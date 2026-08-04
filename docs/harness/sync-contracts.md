# Sync Contracts — 동반갱신 계약 레지스트리

"X 가 바뀌면 같은 커밋에서 Y·Z 도 갱신한다" 류 규칙의 **단일 레지스트리**.
이런 계약을 CLAUDE.md 여러 섹션에 산문으로 흩뿌리면 반드시 서로 드리프트한다
— 여기 표 한 곳에만 두고, 다른 문서는 링크한다.

**검증 명령 없는 행은 금지** — 선언만 있고 확인 방법이 없는 계약은 지켜지지 않는다.

| 트리거 (무엇이 바뀌면) | 동반갱신 대상 | 갱신 형식 | 검증 명령 |
|---|---|---|---|
| 버전 릴리즈 (`src/data/releaseNotes.ts` 에 새 버전) | ① `README.md` 버전 히스토리 ② `src/i18n/translations.ts` 의 `footerText` 3개 언어 | ko 기준 동기화, `vX.Y` 형식 | `grep -c "v{버전}" README.md src/i18n/translations.ts` — 둘 다 1 이상 |
| 단어 데이터 추가/수정 (`src/data/words/*.ts`, `src/data/korean-words*.ts`) | 발음 mp3 재생성 (신규분만) + 파일 헤더 `Total:` 주석 | `GOOGLE_TTS_API_KEY=… npm run tts:generate` | `ls public/audio/{ja,ko} \| wc -l` 이 단어 수와 정합 (공유 해시만큼 오차 허용) |
| `fnv1a` 해시 변경 (`src/utils/wordAudio.ts`) | `scripts/pipeline/generate-tts.mjs` 의 동일 함수 + **mp3 전체 재생성** | 두 구현 동일 유지 | `diff <(sed -n '/fnv1a/,/^}/p' src/utils/wordAudio.ts) <(sed -n '/^function fnv1a/,/^}/p' scripts/pipeline/generate-tts.mjs)` 육안 대조 |
| i18n 키 추가 (`translations.ts` interface) | en/ko/ja 세 블록 모두 | 같은 키 3회 | `npx tsc --noEmit` (누락 시 타입 오류) |

## 운영 룰

- 새 계약 발생(리뷰에서 "이것도 같이 고쳐야 했네"가 나온 순간) = 이 표에 행 추가.
- handoff 시 diff 에 트리거 경로가 있으면 대상 파일도 diff 에 있는지 확인한다.
- 미러 문서 쌍(같은 개념을 두 패키지가 나눠 가짐)도 여기 등록하되,
  **정본 1 + 미러는 링크 스텁** 방향을 행에 명시한다.
