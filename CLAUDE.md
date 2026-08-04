# Glyph (글리프) - 개발 가이드

**세션 연속성 (하네스)**: 진행 중 트랙은 **`docs/harness/{트랙}.md`** 단위 파일로 관리
(인덱스·활성트랙 표 = [`docs/harness/session-state.md`](docs/harness/session-state.md)). 세션 시작 시
**`/kickoff {트랙}`** 으로 그 트랙만 로드 — 인자 없는 `/kickoff` 는 차단·되묻기(`.claude/skills/kickoff`).
긴 세션 종료 전 갱신한다(`.claude/skills/handoff`). 검증 명령 정본 = [`docs/harness/verification.md`](docs/harness/verification.md).
운영 모델과 한계 = [`docs/harness/README.md`](docs/harness/README.md).

## 프로젝트 개요
다국어 문자/어휘 학습 앱. 현재 일본어 학습 지원, 한국어 학습 추가 예정.

## 기술 스택
- **프레임워크:** CRA + React 19
- **언어:** TypeScript (strict)
- **스타일링:** CSS Modules + CSS 변수 (Atom Dark 테마)
- **TTS:** Web Speech API
- **배포:** GitHub Pages (`/language_games/`)
- **i18n:** 자체 Context 기반 (ko/en/ja)

## 명령어

```bash
npm start          # 개발 서버 (포트 3000)
npm run build      # 프로덕션 빌드 → /build
npm test           # Jest 테스트 (watch 모드)
npm run deploy     # 빌드 + GitHub Pages 배포
```

## 프로젝트 구조
```
src/
├── components/
│   ├── common/           # 재사용 UI (Button, CheckboxGrid, ToggleGroup)
│   ├── game/             # 게임 UI (FeedbackOverlay, ScoreDisplay, SpeakButton, WordMultipleChoice)
│   ├── layout/           # 공통 레이아웃 (Header, Footer)
│   └── screens/          # 화면 (Home, Setup, Game, Result, Chart, WordSetup, WordGame, WordResult)
├── data/
│   ├── types.ts          # 모든 TypeScript 인터페이스
│   ├── releaseNotes.ts   # 릴리즈 노트 (ko/en/ja) — README.md와 동기화
│   ├── hiragana.ts       # 히라가나 데이터
│   ├── katakana.ts       # 카타카나 데이터
│   └── words/            # JLPT 단어 (N5, N4, N3)
├── hooks/
│   ├── useGameState.ts       # 가나 게임 상태
│   └── useWordGameState.ts   # 단어 게임 상태
├── i18n/
│   ├── LanguageContext.tsx   # LanguageProvider + useLanguage
│   └── translations.ts       # ko/en/ja 번역
├── utils/
│   ├── gameLogic.ts          # shuffle, generateOptions
│   └── speech.ts             # TTS (speakJapanese)
└── styles/
    ├── animations.css
    └── theme.ts
```

## 현재 구현된 기능
- [x] 일본어 히라가나/카타카나 퀴즈 + 가나 문자표
- [x] JLPT N5~N1 단어 퀴즈 (4,702단어, 전량 ko/en 뜻)
- [x] 한국어 한글/조합 퀴즈 + TOPIK 1·2급 단어 퀴즈 (1,060단어)
- [x] 발음 mp3 사전 생성 (Neural TTS, 오프라인 재생) + Web Speech 폴백
- [x] 듣기 퀴즈 모드, 발음 자동 재생, 오답 복습 모드, 학습 스트릭/통계
- [x] iOS 앱 (Capacitor), 햅틱 피드백, 다국어 UI (한국어/영어/일본어)

---

## 추후 개발 계획

### Phase 1: 한국어 학습 추가 (예상 2시간)

#### 1.1 한글 문자표 (HangulChartScreen)
```typescript
// src/data/hangul.ts
export const consonants = {
  basic: ['ㄱ','ㄴ','ㄷ','ㄹ','ㅁ','ㅂ','ㅅ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'],
  double: ['ㄲ','ㄸ','ㅃ','ㅆ','ㅉ']
};

export const vowels = {
  basic: ['ㅏ','ㅑ','ㅓ','ㅕ','ㅗ','ㅛ','ㅜ','ㅠ','ㅡ','ㅣ'],
  compound: ['ㅐ','ㅒ','ㅔ','ㅖ','ㅘ','ㅙ','ㅚ','ㅝ','ㅞ','ㅟ','ㅢ']
};

export const finalConsonants = [
  'ㄱ','ㄲ','ㄳ','ㄴ','ㄵ','ㄶ','ㄷ','ㄹ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ',
  'ㅁ','ㅂ','ㅄ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'
];
```

#### 1.2 한글 퀴즈
- 자음/모음 → 발음 매칭
- 발음 듣고 자음/모음 고르기
- 글자 조합 퀴즈 (ㄱ + ㅏ = 가)

#### 1.3 TTS 확장
```typescript
// src/utils/speech.ts 수정
export function speak(text: string, lang: 'ja' | 'ko' | 'en'): void {
  const langMap = { ja: 'ja-JP', ko: 'ko-KR', en: 'en-US' };
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = langMap[lang];
  speechSynthesis.speak(utterance);
}
```

### Phase 2: TOPIK 단어장

- TOPIK 초급 (1-2급) 어휘
- 일본어/영어 뜻 지원
- 기존 WordGameScreen 재사용

### Phase 3: 서버 연동 (선택)

#### 추천: Vercel + Supabase (무료)
```
┌─────────────────────────────────┐
│          Vercel (무료)           │
│  • React 앱 호스팅              │
│  • API Routes (서버리스)         │
└─────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────┐
│        Supabase (무료)           │
│  • PostgreSQL 500MB             │
│  • Auth (소셜 로그인)            │
│  • Storage 1GB                  │
└─────────────────────────────────┘
```

#### DB 스키마
```sql
-- 사용자
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 학습 기록
CREATE TABLE study_records (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  language TEXT, -- 'ja' | 'ko'
  category TEXT, -- 'kana' | 'hangul' | 'words'
  correct INT,
  total INT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 오답 노트
CREATE TABLE missed_items (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  item_type TEXT,
  item_id TEXT,
  miss_count INT DEFAULT 1,
  last_missed TIMESTAMP DEFAULT NOW()
);
```

### Phase 4: 고급 기능

- [ ] Cloud TTS (Google/AWS) - 더 자연스러운 발음
- [ ] AI 예문 생성 (Claude API)
- [ ] 스페이스드 리피티션 (복습 알고리즘)
- [ ] 오답 노트 & 취약점 분석
- [ ] 문법 학습 모듈
- [ ] 리더보드 & 업적 시스템

---

## 코딩 컨벤션

### 릴리즈 노트
- **단일 소스:** `src/data/releaseNotes.ts`가 릴리즈 노트의 단일 진실 공급원(Single Source of Truth)
- **동기화 대상:** 버전 업데이트 시 아래 세 곳을 반드시 함께 업데이트:
  1. `src/data/releaseNotes.ts` — 앱 내 릴리즈 노트 화면 데이터 (ko/en/ja 다국어)
  2. `README.md` 버전 히스토리 섹션 — ko 기준으로 동기화
  3. `src/i18n/translations.ts`의 `footerText` — 세 언어 모두 버전 번호 업데이트
- **다국어:** 각 릴리즈 항목에 `changes: { ko, en, ja }` 세 언어 모두 작성
- **버전 형식:** `vX.Y` (예: v0.9), 날짜는 `YYYY-MM-DD`
- 이 계약을 포함한 동반갱신 계약 레지스트리 = [`docs/harness/sync-contracts.md`](docs/harness/sync-contracts.md)

### Git 커밋
- **커밋 메시지는 한글로 작성**
- 형식: `type: 설명` (예: `feat: 학습 언어 선택 기능 추가`)
- type: feat, fix, style, refactor, docs, chore

### 파일 구조
```
1. Import (React → CSS Module → types → hooks → components → i18n)
2. Props 인터페이스 (ComponentNameProps)
3. export default function ComponentName() { ... }
```

### 네이밍
| 대상 | 규칙 | 예시 |
|------|------|------|
| 컴포넌트 파일 | PascalCase | `GameScreen.tsx` |
| 훅 파일 | camelCase | `useGameState.ts` |
| CSS 클래스 | camelCase | `.topBar` |
| 콜백 prop | onXxx | `onFinish` |

### 스타일
- CSS Modules 사용
- CSS 변수로 테마 관리 (`--bg-primary`, `--accent-blue` 등)
- Atom Dark 색상 팔레트 유지

```css
/* 주요 색상 */
--bg-primary: #1e2127
--bg-secondary: #282c34
--accent-blue: #61afef
--accent-green: #98c379
--accent-red: #e06c75
--accent-yellow: #e5c07b
--accent-purple: #c678dd
--accent-cyan: #56b6c2
```

---

## 브랜치

- **기본 브랜치 = `main`**. PR base 도 동일.
- 시크릿 파일(`.env.*` 등)은 **커밋 금지**. 로컬에만 둔다.
- 신규 feature 브랜치는 기본 브랜치에서 분기, 다 끝나면 기본 브랜치로 머지.

### 절대 임의로 하지 말 것

- ⛔ **승인 없이 `git checkout {기존브랜치}` / `git switch {기존브랜치}` 금지.**
  - cherry-pick / rebase / merge 등 "다른 브랜치를 checkout 해야 하는 작업" 도 전환에 포함.
  - 격리가 필요하면 **새 worktree** 로 처리. 현재 checkout 은 건드리지 않는다 —
    working tree 가 다른 세션과 공유되므로 활성 브랜치를 바꾸면 그쪽 미커밋 작업이 깨진다.
  - 예외: 사용자가 직접 그 브랜치를 checkout 해 둔 경우.
- ⛔ **승인 없이 `git checkout .` / `git restore .` 등 working tree 전체 복원 금지.**
  같은 이유 — 다른 세션의 미커밋 변경까지 복구 불가로 파괴한다.
  파일 단위 복원(`git checkout -- {파일}`, `git restore {파일}`)은 허용.
- **커밋 직전에는 반드시 현재 브랜치를 확인** (`git rev-parse --abbrev-ref HEAD`).

---

## 검증

- 에이전트가 직접 확인할 수 없는 동작(TTS 소리·햅틱·실기기)은 확인을 시도하지 않는다. 검증은 다음까지:
  1. 로컬 자동: `npx tsc --noEmit`, `CI=true npx react-scripts test --watchAll=false`, `npm run build:ios`
  2. 보고에 **수동 테스트 항목 체크리스트**(시나리오 + 기대 결과)를 별도 섹션으로 안내
- 빌드 통과 ≠ 런타임 정상 — React StrictMode 는 effect 를 이중 호출한다 (dev 클릭 테스트 필요 명시).
- 명령 정본 = `docs/harness/verification.md`.

---

## 절대 하지 말 것 (전역)

- ⛔ **API 키·시크릿을 저장소·문서·커밋 메시지에 기록 금지.** (2026-08-04 확정 —
  근거: `docs/follow-ups/2026-08-04-tts-api-key-cleanup.md`, TTS 키 대화 노출 사고)
  - 대안: 환경변수로만 전달(`GOOGLE_TTS_API_KEY=... npm run tts:generate`), 사용 후 콘솔에서 키 삭제.
- ⛔ **발음 mp3 를 손으로 추가/이름변경 금지.** 파일명 해시가 코드와 맞물려 있다.
  - 대안: `scripts/pipeline/generate-tts.mjs` 로만 생성 (`scripts/pipeline/README.md`).

---

## follow-ups 디렉토리

지금 안 하지만 잊지 말아야 할 작업은:

- `docs/follow-ups/{YYYY-MM-DD}-{topic}.md` 로 저장
- `docs/follow-ups/README.md` 인덱스에 한 줄 추가

---

## 참고 자료

### 데이터 소스
- JLPT 단어: [jamsinclair/open-anki-jlpt-decks](https://github.com/jamsinclair/open-anki-jlpt-decks) (MIT License)
- 원본 데이터: tanos.co.uk
