#!/usr/bin/env bash
# harness 무결성 린트 v2
# 사용법: ./scripts/harness-check.sh [대상경로]   (기본: 현재 디렉토리)
# 실측된 문서 부패를 기계적으로 잡는다:
#   ① 미치환 템플릿 슬롯   ② 죽은 참조(dangling reference)
#   ③ 고아 rules 파일      ④ 트랙 인덱스 <-> 트랙 파일 정합
#   ⑤ gitignore 함정       ⑥ 스크립트 CRLF/실행권한
# 슬롯 표기 규약: 설치 시 채우는 슬롯 = <...한글...> 또는 <dev|main>,
#   영구 관례 표기(채우는 것 아님) = {...}. 그래서 ①은 한글 꺾쇠를 전수 검출한다
#   (v1 의 하드코딩 allowlist 는 새 슬롯을 조용히 놓쳤음 — 일반 검출로 교체).
# 의존성: git(⑤), python3(①②④ — 없거나 실패하면 눈에 보이는 SKIP + 경고,
#   조용한 통과 금지)
# 종료코드: 0=깨끗, 1=경고 있음, 2=사용 오류
set -uo pipefail

TARGET="${1:-.}"
cd "$TARGET" || { echo "오류: $TARGET 없음" >&2; exit 2; }
warn=0
TAB=$(printf '\t')   # 스크립트 내 리터럴 탭 금지 — 복사 오염 방지

section() { echo; echo "== $1 =="; }

HAVE_PY=1
command -v python3 >/dev/null 2>&1 || HAVE_PY=0

PYOUT=""
PYOK=1
if [ "$HAVE_PY" -eq 1 ]; then
PYOUT=$(python3 - <<'PYEOF'
import glob, os, re

SKIP_COMPONENTS = {'.git', 'node_modules', 'vendor', 'dist', 'build'}

def files_matching(*patterns):
    out = []
    for p in patterns:
        out += glob.glob(p)
    return sorted(set(f for f in out
                      if os.path.isfile(f)
                      and not (SKIP_COMPONENTS & set(f.split(os.sep)))))

def strip_comments(t):
    # <!-- --> 주석을 줄 수 보존하며 제거 (줄번호 어긋남 방지, 멀티라인 대응)
    return re.sub(r'<!--.*?-->', lambda m: '\n' * m.group(0).count('\n'), t, flags=re.S)

def read(f):
    # 인코딩 오류로 검사 전체가 죽어 거짓 통과되는 것 방지
    return open(f, encoding='utf-8', errors='replace').read()

# -- (1) 미치환 슬롯: 설치 후 채워져 있어야 하는 파일만 검사
slot_files = files_matching('CLAUDE.md', 'docs/harness/verification.md',
                            '*/CLAUDE.md', '*/*/CLAUDE.md', '*/*/*/CLAUDE.md',
                            '*/rules/*.md', '*/*/rules/*.md', '*/*/*/rules/*.md')
slot_re = re.compile(r'<[^<>\n]*[가-힣][^<>\n]*>|<dev\|main>')

def is_slot(m):
    inner = m[1:-1]
    if inner != inner.strip():
        return False          # '값이 <10 이고 >' 같은 산문 부등호 배제
    if '="' in inner or inner.startswith(('http://', 'https://')):
        return False          # 인라인 HTML 태그·autolink 배제
    return True

for f in slot_files:
    text = strip_comments(read(f))
    for i, line in enumerate(text.splitlines(), 1):
        for m in slot_re.findall(line):
            if is_slot(m):
                print(f'SLOT\t{f}:{i}\t{m}')
if os.path.exists('CLAUDE.md'):
    n = read('CLAUDE.md').count('<!--')
    if n:
        print(f'CMT\tCLAUDE.md\t{n}')

# -- (2) 죽은 참조: 상대경로 md 링크 대상 존재 확인 (http/앵커전용/이미지 제외)
doc_files = files_matching('CLAUDE.md',
                           '*/CLAUDE.md', '*/*/CLAUDE.md', '*/*/*/CLAUDE.md',
                           '*/rules/*.md', '*/*/rules/*.md', '*/*/*/rules/*.md',
                           'docs/harness/*.md', 'docs/follow-ups/*.md')
# 인라인 링크: 앵커(#)·"제목" 붙어도 잡는다. 참조식 정의([x]: path.md)도 검사.
link_re = re.compile(r'(?<!\!)\]\(\s*([^)#\s]+?)(?:#[^)\s]*)?(?:\s+"[^"]*")?\s*\)')
ref_re = re.compile(r'^\[[^\]^]+\]:\s*(\S+?)(?:#\S*)?\s*$', re.M)
for f in doc_files:
    text = strip_comments(read(f))
    links = set(link_re.findall(text))
    links |= set(t for t in ref_re.findall(text) if t.endswith('.md'))
    for link in sorted(links):
        if link.startswith(('http://', 'https://', 'mailto:')):
            continue
        target = link[2:] if link.startswith('./') else link
        base = os.path.dirname(f)
        ok = os.path.exists(os.path.join(base, target))
        # 루트 기준 해석은 경로형 링크에만 허용
        # (bare 이름이 루트의 동명 파일에 가려져 못 잡는 것 방지)
        if not ok and '/' in target:
            ok = os.path.exists(target)
        if not ok:
            print(f'DEAD\t{f} → {link} (없음)')

# -- (4) 트랙 인덱스 정합 (주석은 멀티라인까지 제거 후 판정)
idx = 'docs/harness/session-state.md'
NON_TRACK = {'README.md', 'session-state.md', 'verification.md',
             'sync-contracts.md', 'STYLE.md'}
if os.path.exists(idx):
    body = strip_comments(read(idx))
    linked = set(re.findall(r'\]\((?:\./)?([^)/]+\.md)\)', body))
    for t in sorted(linked):
        if not os.path.exists(f'docs/harness/{t}'):
            print(f'IDXMISS\tdocs/harness/{t}')
    for f in sorted(glob.glob('docs/harness/*.md')):
        name = os.path.basename(f)
        if name in NON_TRACK:
            continue
        # 경계 매칭 — 'oauth.md' 언급이 'auth.md' 등록으로 오인되는 것 방지
        if not re.search(r'(?<![\w.-])' + re.escape(name), body):
            print(f'IDXORPH\t{f}')
else:
    print('IDXNONE\t')
PYEOF
) || PYOK=0
fi

py_skip() { # 공통 SKIP 처리. 반환 0 = 계속 진행 가능
  if [ "$HAVE_PY" -eq 0 ]; then
    echo "  SKIP  python3 없음 — 이 검사를 수행하지 못함 (python3 설치 필요)"
    warn=1; return 1
  fi
  if [ "$PYOK" -eq 0 ]; then
    echo "  SKIP  python3 검사가 실행 중 실패 — 결과를 신뢰할 수 없음 (stderr 확인)"
    warn=1; return 1
  fi
  return 0
}

py_section() { # $1=섹션제목 $2=태그 $3=OK메시지
  section "$1"
  py_skip || return 0
  local hits
  hits=$(printf '%s\n' "$PYOUT" | grep "^$2$TAB" || true)
  if [ -n "$hits" ]; then
    printf '%s\n' "$hits" | awk -F'\t' '{ printf "  WARN  %s", $2; if ($3 != "") printf "  %s", $3; print "" }'
    warn=1
  else
    echo "  OK    $3"
  fi
}

py_section "① 미치환 템플릿 슬롯 (<...한글...> 전수 검출)" "SLOT" "리터럴 플레이스홀더 없음"
if [ "$HAVE_PY" -eq 1 ] && [ "$PYOK" -eq 1 ]; then
  cmt=$(printf '%s\n' "$PYOUT" | grep "^CMT$TAB" || true)
  [ -n "$cmt" ] && printf '%s\n' "$cmt" | awk -F'\t' '{ printf "  INFO  %s 에 안내 주석 <!-- --> %s개 잔존 (슬롯 채웠으면 삭제 권장)\n", $2, $3 }'
fi

py_section "② 죽은 참조 (md 링크 대상 부재)" "DEAD" "죽은 링크 없음"

section "③ 고아 rules 파일 (패키지 CLAUDE.md 미참조)"
orphan=0
while IFS= read -r rules_dir; do
  [ -n "$rules_dir" ] || continue
  pkg_claude="$(dirname "$rules_dir")/CLAUDE.md"
  for rule in "$rules_dir"/*.md; do
    [ -e "$rule" ] || continue
    name=$(basename "$rule")
    [ "$name" = "README.md" ] && continue
    esc=$(printf '%s' "$name" | sed 's/[.[\*^$]/\\&/g')
    # 경계 매칭 — 'webapi.md' 언급이 'api.md' 참조로 오인되는 것 방지
    if [ ! -e "$pkg_claude" ] || ! grep -Eq "(^|[^A-Za-z0-9_.-])$esc" "$pkg_claude"; then
      echo "  WARN  $rule — $pkg_claude 에서 참조되지 않음 (발견 불가 = 죽은 문서)"
      orphan=1; warn=1
    fi
  done
done < <(find . -maxdepth 4 -type d -name rules ! -path './.git/*' ! -path '*/node_modules/*' ! -path '*/vendor/*' 2>/dev/null | sed 's|^\./||')
[ "$orphan" -eq 0 ] && echo "  OK    모든 rules 파일이 인덱스에 등록됨"

section "④ 트랙 인덱스 <-> 트랙 파일 정합"
if py_skip; then
  if printf '%s\n' "$PYOUT" | grep -q "^IDXNONE$TAB"; then
    echo "  WARN  docs/harness/session-state.md 없음 (하네스 미설치 또는 이동됨)"; warn=1
  else
    idx_hits=$(printf '%s\n' "$PYOUT" | grep -E "^IDX(MISS|ORPH)$TAB" || true)
    if [ -n "$idx_hits" ]; then
      printf '%s\n' "$idx_hits" | awk -F'\t' '{
        if ($1 == "IDXMISS") printf "  WARN  인덱스가 가리키는 %s 없음\n", $2;
        else printf "  WARN  %s — session-state.md 활성 트랙 표에 없음 (kickoff 가 발견 못 함)\n", $2 }'
      warn=1
    else
      echo "  OK    인덱스와 트랙 파일 일치"
    fi
  fi
fi

section "⑤ gitignore 함정 (하네스/훅 미추적 검출)"
if ! git rev-parse --git-dir >/dev/null 2>&1; then
  echo "  SKIP  git 저장소가 아님 — 하네스는 git 커밋을 전제함 (git init 필요)"; warn=1
else
  gi_warn=0
  for p in docs/harness docs/follow-ups .claude/skills .claude/hooks \
           .claude/settings.json scripts/harness-check.sh; do
    if git check-ignore -q "$p" 2>/dev/null; then
      echo "  WARN  '$p' 가 gitignore 에 걸림 — 커밋되지 않아 연속성/훅 공유가 깨짐"
      gi_warn=1; warn=1
    fi
  done
  # 파일 글롭 패턴(예: docs/harness/*.md)은 디렉토리 검사로 안 잡힌다 — 가상 경로로 프로브
  for p in docs/harness/new-track-probe.md docs/follow-ups/2099-01-01-probe.md \
           .claude/skills/kickoff/SKILL.md .claude/hooks/branch-switch-guard.sh; do
    if git check-ignore -q "$p" 2>/dev/null; then
      echo "  WARN  '$p' 류 경로가 gitignore 패턴에 걸림 — 새 하네스 파일이 추적되지 않음"
      gi_warn=1; warn=1
    fi
  done
  [ "$gi_warn" -eq 0 ] && echo "  OK"
fi

section "⑥ 스크립트 CRLF/실행권한"
sc_warn=0
for s in .claude/hooks/*.sh scripts/*.sh; do
  [ -e "$s" ] || continue
  if LC_ALL=C grep -q "$(printf '\r')" "$s"; then
    echo "  WARN  $s 에 CR(\\r) 잔존 — shebang/heredoc 이 깨짐. LF 로 변환할 것"
    sc_warn=1; warn=1
  fi
  if [ ! -x "$s" ]; then
    echo "  WARN  $s 실행권한 없음 — chmod +x 필요"
    sc_warn=1; warn=1
  fi
done
[ "$sc_warn" -eq 0 ] && echo "  OK"

echo
if [ "$warn" -eq 0 ]; then
  echo "결과: 깨끗함"
else
  echo "결과: 경고 있음 — 위 WARN/SKIP 항목 확인"
fi
exit $warn
