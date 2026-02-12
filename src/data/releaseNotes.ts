export interface ReleaseNote {
  version: string;
  date: string;
  changes: {
    ko: string[];
    en: string[];
    ja: string[];
  };
}

export const releaseNotes: ReleaseNote[] = [
  {
    version: 'v1.0',
    date: '2026-02-12',
    changes: {
      ko: [
        '퀴즈 선택지 카드 UI 개선 (호버 시 떠오르는 효과, 정답/오답 글로우)',
      ],
      en: [
        'Quiz option card UI redesign (hover lift effect, correct/wrong glow)',
      ],
      ja: [
        'クイズ選択肢カードUIを改善（ホバー時の浮き上がりエフェクト、正解/不正解グロー）',
      ],
    },
  },
  {
    version: 'v0.9',
    date: '2026-02-12',
    changes: {
      ko: [
        '한국어 단어 305개로 대폭 확장 (65 → 305)',
        '신체, 교통, 감정, 부사, 인사 등 신규 카테고리 추가',
        '릴리즈 노트 화면 추가 (다국어 전환 지원)',
        '푸터에 제작자 정보 및 문서 링크 추가',
      ],
      en: [
        'Expanded Korean vocabulary to 305 words (65 → 305)',
        'New categories: body, transport, emotions, adverbs, greetings',
        'Added release notes screen (with language toggle)',
        'Added author credit and docs link in footer',
      ],
      ja: [
        '韓国語単語を305語に大幅拡張（65 → 305）',
        '身体、交通、感情、副詞、挨拶など新カテゴリ追加',
        'リリースノート画面を追加（多言語切り替え対応）',
        'フッターに制作者情報とドキュメントリンクを追加',
      ],
    },
  },
  {
    version: 'v0.8',
    date: '2026-02-11',
    changes: {
      ko: [
        '한글 자모 퀴즈 (기본/쌍자음, 기본/복합모음 → 로마자)',
        '한글 문자표 (자음/모음 차트 + TTS 발음)',
        '한글 조합 퀴즈 (조합 글자 → 로마자 발음, 자주 쓰는 받침만)',
        '한국어 기본 단어장 (65개, 영어/일본어 뜻)',
        '로고 리디자인 (字를 추상화한 기하학 심볼)',
        'TTS 음성 개선 (음성 품질 스코어링, 자연스러운 속도/피치)',
        '학습 언어 ↔ UI 언어 자동 전환',
      ],
      en: [
        'Hangul consonant/vowel quiz (basic/double consonants, basic/compound vowels → romanization)',
        'Hangul chart (consonant/vowel chart + TTS pronunciation)',
        'Hangul syllable quiz (combined characters → romanization, common final consonants)',
        'Basic Korean vocabulary (65 words, English/Japanese meanings)',
        'Logo redesign (geometric abstraction of 字)',
        'TTS voice improvement (voice quality scoring, natural speed/pitch)',
        'Auto-switch between learning language and UI language',
      ],
      ja: [
        'ハングル子音/母音クイズ（基本/濃音、基本/合成母音 → ローマ字）',
        'ハングル文字表（子音/母音チャート + TTS発音）',
        'ハングル組み合わせクイズ（組み合わせ文字 → ローマ字発音、頻出パッチムのみ）',
        '韓国語基本単語帳（65語、英語/日本語訳）',
        'ロゴリデザイン（字を幾何学的に抽象化）',
        'TTS音声改善（音声品質スコアリング、自然な速度/ピッチ）',
        '学習言語 ↔ UI言語の自動切り替え',
      ],
    },
  },
  {
    version: 'v0.7',
    date: '2026-02-11',
    changes: {
      ko: [
        '앱 이름 변경: Nihongo Master → Glyph (글리프)',
        '새 로고 디자인 (한글 ㄱ + 히라가나 の 조합)',
        '일본어 UI 추가 (한국어/영어/일본어)',
        '홈 화면에 학습 언어 선택 UI 추가 (일본어/한국어)',
      ],
      en: [
        'Rebranded: Nihongo Master → Glyph',
        'New logo design (Korean ㄱ + Hiragana の combination)',
        'Added Japanese UI (Korean/English/Japanese)',
        'Learning language selection on home screen (Japanese/Korean)',
      ],
      ja: [
        'アプリ名変更: Nihongo Master → Glyph（グリフ）',
        '新ロゴデザイン（ハングルㄱ + ひらがなの組み合わせ）',
        '日本語UI追加（韓国語/英語/日本語）',
        'ホーム画面に学習言語選択UIを追加（日本語/韓国語）',
      ],
    },
  },
  {
    version: 'v0.6',
    date: '2026-02-10',
    changes: {
      ko: [
        '일본어 발음 듣기 기능 추가 (Web Speech API TTS)',
        '오답 시 클릭하여 넘어가기 (자동 넘김 → 수동 확인)',
        '한국어 번역 62% 커버리지 (2201/3524 단어)',
        '발음 버튼 애니메이션 (재생 중 펄스 효과)',
      ],
      en: [
        'Japanese pronunciation playback (Web Speech API TTS)',
        'Tap wrong answer to continue (auto-advance → manual confirmation)',
        '62% Korean translation coverage (2201/3524 words)',
        'Pronunciation button animation (pulse effect while playing)',
      ],
      ja: [
        '日本語発音再生機能を追加（Web Speech API TTS）',
        '不正解タップで次へ（自動送り → 手動確認）',
        '韓国語翻訳62%カバレッジ（2201/3524語）',
        '発音ボタンアニメーション（再生中パルスエフェクト）',
      ],
    },
  },
  {
    version: 'v0.5',
    date: '2026-02-10',
    changes: {
      ko: [
        '홈 화면 카테고리 그룹화 (문자표 / 게임 섹션 분리)',
        '단어 게임 언어가 앱 언어와 자동 연동',
        '게임 중 언어 전환 비활성화',
        '헤더 로고 클릭 시 홈 화면 이동',
      ],
      en: [
        'Home screen category grouping (chart / game sections)',
        'Word game language auto-synced with app language',
        'Language switch disabled during game',
        'Navigate to home by clicking header logo',
      ],
      ja: [
        'ホーム画面カテゴリグループ化（文字表 / ゲームセクション分離）',
        '単語ゲーム言語がアプリ言語と自動連動',
        'ゲーム中の言語切り替えを無効化',
        'ヘッダーロゴクリックでホーム画面へ移動',
      ],
    },
  },
  {
    version: 'v0.4',
    date: '2026-02-10',
    changes: {
      ko: ['내부 코드 개선'],
      en: ['Internal code improvements'],
      ja: ['内部コード改善'],
    },
  },
  {
    version: 'v0.3',
    date: '2026-02-09',
    changes: {
      ko: [
        '한국어 / 영어 UI 전환 기능 추가',
        '언어 설정 자동 기억',
      ],
      en: [
        'Korean / English UI switching',
        'Language preference remembered automatically',
      ],
      ja: [
        '韓国語/英語UI切り替え機能を追加',
        '言語設定を自動記憶',
      ],
    },
  },
  {
    version: 'v0.2',
    date: '2026-02-09',
    changes: {
      ko: [
        'N5 ~ N3 단어 퀴즈 구현 (3,524단어)',
        '뜻→단어 / 단어→뜻 두 가지 모드',
        '레벨별 필터링 및 문제 수 설정',
        '한국어/영어 뜻 지원',
      ],
      en: [
        'JLPT N5-N3 vocabulary quiz (3,524 words)',
        'Two modes: meaning→word / word→meaning',
        'Level filtering and question count setting',
        'Korean/English meaning support',
      ],
      ja: [
        'N5〜N3 単語クイズ実装（3,524語）',
        '意味→単語 / 単語→意味の2モード',
        'レベル別フィルタリングおよび問題数設定',
        '韓国語/英語訳サポート',
      ],
    },
  },
  {
    version: 'v0.1',
    date: '2026-02-09',
    changes: {
      ko: [
        '히라가나 / 카타카나 퀴즈 (타이핑 + 4지선다)',
        '행 선택 기능 (원하는 행만 연습)',
        '오십음도 차트 (탁음/반탁음 포함)',
        '혼동하기 쉬운 문자 우선 출제 (Smart Wrong Answers)',
        'Atom Dark 테마 적용',
      ],
      en: [
        'Hiragana / Katakana quiz (typing + multiple choice)',
        'Row selection (practice specific rows)',
        'Gojūon chart (including dakuten/handakuten)',
        'Smart wrong answers (prioritize confusing characters)',
        'Atom Dark theme',
      ],
      ja: [
        'ひらがな / カタカナクイズ（タイピング + 4択）',
        '行選択機能（特定の行だけ練習）',
        '五十音表（濁音/半濁音含む）',
        '紛らわしい文字を優先出題（Smart Wrong Answers）',
        'Atom Darkテーマ適用',
      ],
    },
  },
];
