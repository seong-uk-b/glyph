# 데이터 파이프라인

앱 소스(`src/`)와 분리된 데이터 생성·가공 스크립트 모음.
앱 빌드에는 포함되지 않으며, 단어 데이터를 추가·수정할 때만 사용한다.

## 구성

| 스크립트 | 용도 |
|---|---|
| `generate-tts.mjs` | 단어 발음 mp3 일괄 생성 (Google Cloud TTS Neural) |

## 발음 mp3 생성

```bash
GOOGLE_TTS_API_KEY=<키> npm run tts:generate
```

- 소스: `src/data/words/*.ts` (일본어), `src/data/korean-words*.ts` (한국어)
- 출력: `public/audio/<lang>/<id>.mp3` — id는 `fnv1a(expression|reading)`
  (`src/utils/wordAudio.ts`의 해시와 반드시 동일해야 함)
- 이미 생성된 파일은 건너뛰므로 **단어 추가 후 재실행하면 신규분만 생성**됨
- 실패 시 `tts-failures.json`에 기록되고, 재실행하면 실패분만 재시도
- 속도 제한: 분당 약 160건 (429 시 지수 백오프 재시도)

### API 키 발급 (필요할 때마다)
1. console.cloud.google.com → Cloud Text-to-Speech API 활성화
2. 사용자 인증 정보 → API 키 생성 (애플리케이션 제한 "없음", API 제한 "TTS만")
3. 사용 후 키 삭제 권장. 전체 재생성해도 무료 한도(월 100만 자)의 ~3% 수준

## 단어 데이터 추가 절차

1. `src/data/` 의 해당 파일에 단어 추가 (형식: `{ expression, reading?, meanings: { en, ko?/ja? }, lang, level }`)
2. `npx tsc --noEmit` 통과 확인
3. `npm run tts:generate` 로 신규 단어 mp3 생성
4. `npm run build:ios` 로 iOS 반영

## 예정

- Anki `.apkg` → Word 형식 변환 스크립트 (덱 구조 확인 후 매핑)
