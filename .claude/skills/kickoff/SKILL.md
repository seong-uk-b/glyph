---
name: kickoff
description: Use when starting or resuming work in this repository in a fresh session that needs branch context, handoff state, verification rules, and next actions before editing files.
---

# Kickoff

세션 시작 시, 파일을 수정하기 전에 수행한다.
목적: 채팅 히스토리 없이 **저장소 파일만으로** 이전 작업을 이어받는다.

## Steps

### 인자(트랙 이름 또는 파일 경로)가 주어진 경우 — 그 파일만 읽는다 (집중 모드)

인자가 있으면 전체 스캔(session-state 본문·follow-ups·git log)을 **건너뛰고** 지정된 것만 로드한다:

1. `git rev-parse --abbrev-ref HEAD` + `git status -sb` — 브랜치·트리 상태만 확인
   (Boundary 대조와 커밋 직전 안전에 필요).
2. **인자를 해석해 그 파일만 읽는다**. 분류 규칙 (상보적 — 모든 인자가 정확히 한쪽에 해당):
   - 인자에 `/` 도 `.` 도 없으면 → **짧은 트랙 이름** (예 `auth`·`billing`) →
     `docs/harness/{이름}.md`. 트랙 목록 = `docs/harness/session-state.md` 의 활성 트랙 표.
   - 그 외 (`/` 또는 확장자 포함) → **경로** 로 그대로 읽는다.
   - 해석한 파일이 없으면 그 사실을 말하고 인자 없는(차단·되묻기) 모드로 폴백.
3. **읽는 범위 = 트랙 파일 + 그 머리 필드가 가리키는 문서(Spec/Plan 링크, 명시된 관련
   follow-up)까지만.** 그 이상의 링크는 따라가지 않는다.
4. 트랙 파일 머리에 **Boundary**(수정 가능 범위)나 **Branch** 핀이 선언돼 있으면
   재고지하고, 1번에서 확인한 git 상태와 모순되면 먼저 보고한다.
5. 현재 목표·알려진 리스크·첫 번째 구체적 행동을 진술하고 끝. **전체 스캔 안 함.**
   트랙 파일의 기록은 "마지막 관측"이지 현재 사실이 아니다 — Verification 항목이
   과거 세션 것이면 통과로 간주하지 않는다 (fresh run 정책은 verification.md).

> 여러 인자면 공백/콤마로 나열.

### 인자가 없는 경우 — 차단하고 되묻는다 (자동 스캔 금지)

인자가 없으면 **전체 스캔을 자동으로 하지 않고 멈춘다.** 무엇을 할지 사용자가 먼저 고르게 한다:

1. `git rev-parse --abbrev-ref HEAD` — 브랜치만 확인.
2. `docs/harness/session-state.md` 의 **활성 트랙 표만** 읽는다
   (트랙 파일 본문·follow-up·git log 는 아직 읽지 않는다).
3. **사용자에게 어떤 작업을 시작할지 되묻는다** (AskUserQuestion 권장):
   활성 트랙들을 선택지로 + `직접 파일/경로 지정` + `전체 스캔` 옵션을 제시한다.
   **사용자가 고르기 전엔 트랙 파일 읽기, 파일 수정, 작업 시작 전부 금지.**
   - **자율/헤드리스 세션**(사용자가 실시간 응답 불가)이면 되묻기가 불가능하므로:
     활성 트랙 표를 보고에 나열하고 **추측으로 진행하지 말고 종료**한다
     (호출 측에 `/kickoff {트랙}` 재호출을 요구).
4. 선택 후에만 진행:
   - **특정 트랙** → 위 "인자 모드" 2~5단계와 동일하게 (읽는 범위도 동일 —
     트랙 파일 + 머리 필드가 가리키는 문서까지만).
   - **직접 파일** → 그 파일(+머리 필드 링크)만.
   - **전체 스캔** → 그제서야 활성 트랙 파일 전부·`docs/follow-ups/README.md`·`git log --oneline -8` 확인.
5. 현재 목표·알려진 리스크·첫 번째 구체적 행동을 진술. session-state 가 git 상태와
   모순되면(브랜치 없음·이미 push 등) 먼저 보고·갱신 후 본작업.

## Rules

- **저장소 파일 > 채팅 메모리.** auto-memory 의 기억이 session-state 와 다르면
  session-state(저장소)를 우선하되 모순을 사용자에게 보고한다.
- 브랜치 상태와 핸드오프 상태를 파악하기 전에는 파일을 수정하지 않는다.
- **승인 없이 기존 브랜치 checkout/switch·tree 전체 복원 금지** (루트 CLAUDE.md 브랜치 룰).
  격리가 필요하면 worktree.
- 검증 명령은 `docs/harness/verification.md` 를 따른다.

## Useful Commands

```bash
git rev-parse --abbrev-ref HEAD
git status -sb
git log --oneline --decorate -8
```

테스트/빌드 명령은 여기 복제하지 않는다 — 정본 = `docs/harness/verification.md`.
