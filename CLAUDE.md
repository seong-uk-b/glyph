# Glyph (글리프) - 개발 가이드

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
- [x] 일본어 히라가나/카타카나 퀴즈
- [x] 일본어 가나 문자표
- [x] JLPT N5~N3 단어 퀴즈 (3,524단어)
- [x] 한국어 번역 62% 커버리지
- [x] 일본어 발음 TTS
- [x] 오답 클릭 후 넘어가기
- [x] 다국어 UI (한국어/영어/일본어)

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

## 참고 자료

### 데이터 소스
- JLPT 단어: [jamsinclair/open-anki-jlpt-decks](https://github.com/jamsinclair/open-anki-jlpt-decks) (MIT License)
- 원본 데이터: tanos.co.uk
