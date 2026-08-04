# 트랙: JLPT N2/N1 확장

- Last updated: 2026-08-04
- Tool: Claude Code
- Branch: main, latest commit 963f3c5 (feat: 신규 JLPT 단어 1,175개 발음 mp3 추가)
- Spec/Plan: 없음 (파이프라인 절차 = `scripts/pipeline/README.md`)
- Boundary: `src/data/words/**`, `public/audio/ja/**`, `scripts/pipeline/**`, 릴리즈 노트 3종 (sync-contracts 참조)
- Verify: `npx tsc --noEmit` + `CI=true npx react-scripts test --watchAll=false` + `npm run build:ios` (정본: verification.md)

## Current Goal

Anki 덱(`data/anki/JLPT 통합덱2 20250908.apkg`)의 N2/N1 전용 단어를 앱에 추가해
N2(현재 930) → 약 2,570개, N1(현재 188) → 약 3,200개로 완성한다.

## Completed Context

- **1단계 완료**: 덱 N5~N3 신규 1,178개 병합(43797ce), 레벨 재배정+N2/N1 활성화(63fed1d), mp3 생성(963f3c5)
- 덱 파싱 파이프라인 검증됨: apkg = zip → `collection.anki21b`(zstd) → sqlite.
  파싱 스크립트 패턴은 세션 스크래치에 있었으므로 **재작성 필요** — 요점:
  `sqlite3` + `db.create_collation('unicase', ...)`, 어휘 notetype id `1728981502167`,
  필드 순서 = 단어/루비/한자/품사/의미/예문/번호, 덱명 `%JLPT N2` 등으로 레벨 필터
- **뜻은 덱에서 가져오지 않는다** (사전 스크랩 저작권 + en 부재) — 표기·읽기만 추출하고
  ko/en 뜻은 에이전트 자체 생성 → 검증 에이전트(한자-읽기 불일치 IME 오변환 중점) → 병합
- 1단계 실측: 덱 원본에 IME 오변환 다수 (교정 후 기존 단어와 중복되면 제거하는 규칙 사용)
- 덱 전용 신규 후보: N2 약 1,646개 / N1 약 3,025개 (기존과 표기 중복 제외 후)

## Verification

- 2026-08-04: tsc 0 오류, Jest 20/20, build:ios Compiled successfully, 시뮬레이터 실행 확인 (1단계 기준)

## Open Work

1. **2단계 — N2 완성**: 덱 N2 전용 후보 추출 → 뜻 생성 에이전트 5~6개(청크당 ~300단어)
   → 검증 에이전트 → 병합(`src/data/words/n2.ts`에 보충 섹션) → tsc/테스트/빌드
2. **3단계 — N1 완성**: 동일 파이프라인, 후보 ~3,025개 (에이전트 8~10개)
3. mp3 생성: 병합 후 `GOOGLE_TTS_API_KEY=<새 키> npm run tts:generate` (신규분만 자동 생성,
   키는 follow-up `2026-08-04-tts-api-key-cleanup.md` 참조)
4. 완료 시 릴리즈 노트 갱신 (sync-contracts의 버전 릴리즈 계약)

## Known Risks

- 덱 IME 오변환이 N2/N1 에도 있을 것 — 검증 단계 필수 (1단계에서 60건 적발)
- 한 뜻 생성 에이전트가 300단어를 넘으면 JSON 응답이 잘릴 수 있음 — 결과는
  scratchpad 파일로 저장시키는 방식 사용 (인라인 채팅 응답 금지)
- tanos 전용 표기 변형 286개(代る·事 등) 정리는 별도 판단 필요 — 아직 유지 중

## Next Session Kickoff

`/kickoff jlpt-expansion`
