#!/usr/bin/env bash
# PreToolUse(Bash) guard: git 브랜치 전환 · working tree 전체 복원 시 사용자 승인(ask) 강제.
# 근거 룰: 루트 CLAUDE.md 브랜치 룰 — 여러 세션이 working tree 를 공유하므로
#   (a) 활성 브랜치를 바꾸면 다른 세션의 미커밋 작업이 깨지고
#   (b) tree 전체 복원(git checkout . / git restore .)은 미커밋 변경을 복구 불가로 파괴한다.
# 동작: 명령을 세그먼트(&& || ; | & 서브셸·명령치환 경계)로 쪼개 각각 분석한다.
#   ask  → git checkout/switch <기존 브랜치|커밋|- >, git checkout . , git checkout -- . ,
#          git restore . (worktree 복원), 쉘 -c 문자열 안의 전환 의심
#   통과 → 새 브랜치 생성(-b/-B, switch -c/-C, --orphan, -t/--track),
#          파일 단위 복원(checkout -- <파일>, checkout <ref> -- <파일>, restore <파일>),
#          git worktree, git restore --staged(워킹트리 비접촉),
#          git 이 아닌 명령(문자열 안에 'git checkout' 이 있어도 무관 — echo/grep 등)
# git 전역 옵션(git -C <dir> / -c k=v / --git-dir 등)을 건너뛰고 서브커맨드를 식별한다.
# 의존성: jq. 없으면 좁게 fail-closed — checkout/switch/restore 가 보이는 명령만 ask
#   (조용히 무력화되던 v1 fail-open 결함 보수).
# 알려진 한계(의도된 트레이드오프 — deny 가 아니라 ask 이므로 오탐은 승인으로 해소):
#   - 사용자 정의 alias(git co 등)는 감지 못 한다.
#   - 따옴표 문자열 내부의 ; && 도 세그먼트 경계로 취급 → 드물게 오탐(ask) 가능.

ask() {
  printf '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"ask","permissionDecisionReason":"%s"}}' "$1"
  exit 0
}

input=$(cat)

if ! command -v jq >/dev/null 2>&1; then
  # jq 없이는 정밀 파싱 불가 — git + 위험 키워드가 함께 보일 때만 fail-closed 로 ask
  # (git 없는 pg_restore·npm run switch 등은 건드리지 않는다)
  if printf '%s' "$input" | grep -q 'git' \
     && printf '%s' "$input" | grep -qE 'checkout|switch|restore'; then
    ask "jq 미설치로 브랜치 가드가 명령을 파싱하지 못함 — jq 설치 권장. 전환 명령이면 검토 후 승인 (CLAUDE.md 브랜치 룰)"
  fi
  exit 0
fi

cmd=$(printf '%s' "$input" | jq -r '.tool_input.command // empty' 2>/dev/null) || cmd=""
[ -n "$cmd" ] || exit 0

# 빠른 통과: 위험 서브커맨드 문자열 자체가 없으면 끝
case "$cmd" in
  *checkout*|*switch*|*restore*) ;;
  *) exit 0 ;;
esac

# 복합 명령을 세그먼트로 분리 (&& || ; | & 및 서브셸/명령치환 경계)
segments=$(printf '%s\n' "$cmd" | awk '{ gsub(/&&|\|\||;|\||&|\$\(|`|\(/, "\n"); print }')

while IFS= read -r seg; do
  set -f
  # shellcheck disable=SC2086
  set -- $seg
  set +f
  [ $# -gt 0 ] || continue

  # 선행 env 할당·래퍼 제거
  while [ $# -gt 0 ]; do
    case "$1" in
      [A-Za-z_]*=*) shift ;;
      sudo|command|env|nohup|time|builtin|exec) shift ;;
      *) break ;;
    esac
  done
  [ $# -gt 0 ] || continue

  base=${1##*/}
  case "$base" in
    git|git.exe) ;;
    bash|sh|zsh|dash|ksh|eval)
      # 쉘 -c/-eval 문자열 내부는 파싱 불가 — 전환 의심이면 ask (보수적)
      if printf '%s' "$seg" | grep -qE 'git[^"'"'"']*[[:space:]](checkout|switch|restore)[[:space:]]'; then
        ask "쉘 문자열 내부에서 git 브랜치 전환 의심 — 검토 후 승인 필요 (CLAUDE.md 브랜치 룰)"
      fi
      continue ;;
    *) continue ;;
  esac
  shift

  # git 전역 옵션 스킵 (git -C <dir>, -c <k=v>, --git-dir=... 등)
  while [ $# -gt 0 ]; do
    case "$1" in
      -C|-c|--git-dir|--work-tree|--namespace|--exec-path) { shift 2; } 2>/dev/null || break ;;
      --git-dir=*|--work-tree=*|--namespace=*|--exec-path=*|-C?*|-c?*) shift ;;
      --*|-*) shift ;;
      *) break ;;
    esac
  done
  [ $# -gt 0 ] || continue

  sub=$1; shift

  case "$sub" in
    checkout|switch)
      create=0; after_dd=0; first=""; first_after=""
      for a in "$@"; do
        if [ "$after_dd" -eq 1 ]; then
          [ -z "$first_after" ] && first_after=$a
          continue
        fi
        case "$a" in
          --) after_dd=1 ;;
          -) [ -z "$first" ] && first=$a ;;
          -b|-B|-c|-C|--orphan|-t|--track|--create|--force-create) create=1 ;;
          -*) ;;
          *) [ -z "$first" ] && first=$a ;;
        esac
      done
      [ "$create" -eq 1 ] && continue
      if [ "$after_dd" -eq 1 ] && [ -n "$first_after" ]; then
        if [ "$first_after" = "." ]; then
          ask "git $sub -- . 는 working tree 전체 복원 — 미커밋 변경이 파괴됨. 승인 필요 (CLAUDE.md 브랜치 룰)"
        fi
        continue   # 파일 단위 복원(checkout [<ref>] -- <파일>)은 HEAD 를 옮기지 않음 → 통과
      fi
      # '--' 뒤에 경로가 없으면(git checkout main --) 브랜치 전환이다 → 아래로 계속
      [ -z "$first" ] && continue   # bare 'git checkout' — 무해
      if [ "$first" = "." ]; then
        ask "git $sub . 는 working tree 전체 복원 — 미커밋 변경이 파괴됨. 승인 필요 (CLAUDE.md 브랜치 룰)"
      fi
      ask "기존 브랜치 전환은 사용자 승인 필요 (CLAUDE.md 브랜치 룰 — 공유 working tree 보호. 격리는 worktree 로)"
      ;;
    restore)
      staged=0; wt=0; first=""; skipval=0
      for a in "$@"; do
        if [ "$skipval" -eq 1 ]; then skipval=0; continue; fi
        case "$a" in
          -S|--staged) staged=1 ;;
          -W|--worktree) wt=1 ;;
          -s|--source) skipval=1 ;;   # 다음 토큰은 ref — pathspec 아님
          --source=*) ;;
          --) ;;
          -*) ;;
          *) [ -z "$first" ] && first=$a ;;
        esac
      done
      # --staged 만이면 워킹트리 비접촉 → 통과
      if [ "$staged" -eq 1 ] && [ "$wt" -eq 0 ]; then continue; fi
      case "$first" in
        .|:/) ask "git restore 가 working tree 전체를 복원 — 미커밋 변경이 파괴됨. 승인 필요 (CLAUDE.md 브랜치 룰)" ;;
      esac
      ;;
  esac
done <<EOF
$segments
EOF

exit 0
