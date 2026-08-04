---
name: handoff
description: Use when pausing, ending, or transferring repository work so a future session can continue from committed state without relying on chat history.
---

# Handoff

실질적인 작업 세션을 끝내기 전에 수행한다.
목적: 다음 세션(누구든, 어떤 도구든)이 **저장소 파일만으로** 이어받게 만든다.

## Steps

1. **대상 트랙 결정**: 이 세션이 어느 트랙(`docs/harness/{트랙}.md`) 작업이었는지 특정한다.
   불명확하면(여러 트랙을 건드렸거나 트랙 미존재) 추측으로 갱신하지 말고 사용자에게 묻는다.
   - **여러 트랙을 건드렸으면**: 사용자 확인 후 **트랙마다 4~7단계를 반복**한다.
   - **자율 세션**(사용자 응답 불가)이면: 변경 파일과 가장 겹치는 트랙을 선택하되,
     그 판단 근거를 트랙 파일과 최종 보고에 명시한다.
2. `git rev-parse --abbrev-ref HEAD` + `git status -sb`.
   트랙 파일에 Boundary 가 선언돼 있는데 경계 밖 변경이 있으면 멈추고 사유와 함께 보고.
   (자율 세션이면: 경계 밖 변경은 **커밋하지 말고** 보고만 한다.)
3. `git diff --stat` 으로 변경 파일 리뷰. sync-contracts.md 의 트리거 경로가 diff 에
   있으면 대상 파일도 diff 에 있는지 확인.
4. 트랙 파일 머리의 Verify 명령(없으면 `docs/harness/verification.md` 의 관련 체크)을
   **이 세션에서 fresh run**.
5. `docs/harness/{트랙}.md` 갱신 초안 작성 (신규 트랙이면 session-state.md 의 템플릿으로
   생성 + 인덱스 표에 한 줄 추가. **기존 트랙이면 session-state.md 의 해당 행 상태 컬럼과
   Last updated 도 같은 커밋에서 갱신**). 갱신 필드:
   - **Last updated (트랙 파일 머리 — 잊기 쉬움)**
   - 작업 도구 (예: `Claude Code`)
   - 브랜치 + 최신 커밋
   - 완료한 작업
   - 검증 명령과 결과 (실제 실행한 것만)
   - 미결 작업 / 알려진 리스크
   - 다음 세션 kickoff 명령 (예: `/kickoff {트랙}`)
6. 초안을 사용자에게 보여주고 **명시적 확인 후** 기록한다.
   단, 자율 세션이면 기록을 진행하되 최종 보고에 초안 전문을 포함해
   사후 검토가 가능하게 한다.
7. **기록을 커밋한다**: 커밋 직전 `git rev-parse --abbrev-ref HEAD` 로 브랜치를
   재확인(루트 CLAUDE.md 브랜치 룰 — 다른 세션이 바꿨을 수 있다)한 뒤, 트랙 파일·인덱스·
   follow-up 등 **하네스 경로만 명시적으로 add** 해서 커밋한다. push 여부는
   프로젝트 배포 정책(루트 CLAUDE.md §3)을 따른다.
8. 브랜치 상태를 보고한다: clean / dirty / 커밋됨 / push 됨.
   push 가 배포를 트리거하는 프로젝트라면 **push 됨 = 배포 트리거됨** 을 함께 명시.

## Rules

- **이 세션에서 fresh run 하지 않은 테스트/빌드를 "통과" 라고 쓰지 않는다.**
- 갱신한 트랙 파일·follow-up 이 untracked 거나 **gitignore 에 걸렸으면 경고한다**
  (확인 명령: `git check-ignore -v {경로}` — ignore 된 파일은 `git status` 에
  아예 안 보이므로 status 만으로는 못 잡는다. gitignore 에 걸린 하네스는
  세션 연속성이 통째로 깨진다). 하네스 린트가 있으면 실행:
  `./scripts/harness-check.sh .` (부트스트랩 설치 시 함께 복사됨).
- 시크릿, 토큰, `.env` 값을 포함하지 않는다.
- 구체적으로: 파일명, 명령, 커밋 해시, 남은 결정사항을 명시.
- 미래 에이전트가 실제로 읽을 만큼 짧게 유지한다.
- "나중에 할 일" 이 생겼으면 트랙 파일이 아니라
  `docs/follow-ups/{YYYY-MM-DD}-{topic}.md` + README 인덱스로.
- 트랙이 완전히 끝났으면 session-state.md 활성 트랙 표에서 제거하고
  트랙 파일을 삭제한다 (이력은 git 히스토리가 보존).
