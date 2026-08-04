# Session State — 핸드오프 인덱스

Last updated: 2026-08-04

세션 간 핸드오프 정본의 **인덱스**. 각 활성 트랙의 상세는 `docs/harness/{트랙}.md` 에 두고,
여기엔 표만 둔다. **`/kickoff {트랙}`** 으로 해당 트랙 파일만 로드한다.
(나중에 할 일 = `docs/follow-ups/`, 설계 = spec/plan 문서 — 복제 금지, 링크만.
갱신은 `/handoff` 의식을 따른다.)

## 활성 트랙

| 트랙 | 파일 / 로드 | 브랜치 | 상태 |
|---|---|---|---|
| JLPT N2/N1 확장 | [`jlpt-expansion.md`](jlpt-expansion.md) · `/kickoff jlpt-expansion` | main | 1단계 완료, 2단계(N2 +1,646) 대기 |

> - 새 트랙 = `docs/harness/{트랙}.md` 생성(아래 템플릿) + 이 표에 한 줄 추가.
> - 트랙 종료 = 표에서 제거 + 그 파일 삭제 (이력은 git 히스토리가 보존).
> - **트랙당 동시 세션은 하나** (동시 handoff 는 마지막 쓰기가 이김 — README '알려진 한계' 2항).

---

## 트랙 파일 템플릿 (`docs/harness/{트랙}.md`)

```markdown
# 트랙: {이름}

- Last updated: {YYYY-MM-DD}
- Tool: {Claude Code 등}
- Branch: {브랜치}, latest commit {해시 제목}
- Spec/Plan: {경로 — 없으면 "없음"}
- Boundary: {수정 가능 범위 — 디렉토리/DB 접근 모드/금지 라이브러리. 없으면 "제한 없음"}
- Verify: {이 트랙 전용 검증 명령. 없으면 verification.md 표준 체크}

## Current Goal
## Completed Context
## Verification
## Open Work
## Known Risks
## Next Session Kickoff
```

> **트랙 고유 설정은 전부 이 파일의 머리 필드로** (브랜치 핀·경계·검증 명령·베이스라인).
> kickoff/handoff 스킬을 트랙별로 복제(포크)하지 말 것 — 변종 파일은 반드시 드리프트한다.
> 스킬은 한 쌍, 트랙 차이는 데이터(이 파일)로.
