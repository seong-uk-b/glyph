import styles from './HomeScreen.module.css';
import { useLanguage } from '../../i18n';

interface HomeScreenProps {
  onStart: () => void;
  onChart: () => void;
  onHangulChart: () => void;
  onHangulStart: () => void;
  onSyllable: () => void;
  onWords: () => void;
  onKoreanWords: () => void;
}

export default function HomeScreen({ onStart, onChart, onHangulChart, onHangulStart, onSyllable, onWords, onKoreanWords }: HomeScreenProps) {
  const { t, language, setLanguage, learnLanguage, setLearnLanguage } = useLanguage();

  const selectLearnLanguage = (lang: 'japanese' | 'korean') => {
    setLearnLanguage(lang);
    if (lang === 'japanese' && language === 'ja') setLanguage('ko');
    if (lang === 'korean' && language === 'ko') setLanguage('ja');
  };

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <div className={styles.logoWrap}>
          <img src={`${process.env.PUBLIC_URL}/logo.svg`} alt={t.appTitle} className={styles.logo} />
        </div>
        <h1 className={styles.logoTitle}>Glyph</h1>
        <p className={styles.subtitle}>
          {t.homeSubtitle}
        </p>
      </div>

      {/* Language Selection */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>{t.selectLanguage}</h3>
        <div className={styles.langCards}>
          <button
            className={`${styles.langCard} ${learnLanguage === 'japanese' ? styles.langCardActive : ''}`}
            onClick={() => selectLearnLanguage('japanese')}
          >
            <img src={`${process.env.PUBLIC_URL}/flags/jp.svg`} alt="" className={styles.langFlag} />
            <span className={styles.langName}>{t.japanese}</span>
          </button>
          <button
            className={`${styles.langCard} ${learnLanguage === 'korean' ? styles.langCardActive : ''}`}
            onClick={() => selectLearnLanguage('korean')}
          >
            <img src={`${process.env.PUBLIC_URL}/flags/kr.svg`} alt="" className={styles.langFlag} />
            <span className={styles.langName}>{t.koreanLang}</span>
          </button>
        </div>
      </section>

      {/* Charts Section */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>{t.sectionChart}</h3>
        <div className={styles.categories}>
          {learnLanguage === 'japanese' ? (
            <button className={styles.categoryCard} onClick={onChart}>
              <span className={styles.categoryChar}>{'\u8868'}</span>
              <div className={styles.categoryInfo}>
                <span className={styles.categoryName}>{t.kanaChart}</span>
                <span className={styles.categoryDesc}>{t.kanaChartDesc}</span>
              </div>
              <span className={styles.categoryArrow}>&rarr;</span>
            </button>
          ) : (
            <button className={styles.categoryCard} onClick={onHangulChart}>
              <span className={styles.categoryChar}>{'\u314E'}</span>
              <div className={styles.categoryInfo}>
                <span className={styles.categoryName}>{t.hangulChart}</span>
                <span className={styles.categoryDesc}>{t.hangulChartDesc}</span>
              </div>
              <span className={styles.categoryArrow}>&rarr;</span>
            </button>
          )}
        </div>
      </section>

      {/* Games Section */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>{t.sectionGame}</h3>
        <div className={styles.categories}>
          {learnLanguage === 'japanese' ? (
            <>
              <button className={styles.categoryCard} onClick={onStart}>
                <span className={styles.categoryChar}>{'\u3042'}</span>
                <div className={styles.categoryInfo}>
                  <span className={styles.categoryName}>{t.kana}</span>
                  <span className={styles.categoryDesc}>{t.kanaDesc}</span>
                </div>
                <span className={styles.categoryArrow}>&rarr;</span>
              </button>

              <button className={styles.categoryCard} onClick={onWords}>
                <span className={styles.categoryChar}>{'\u8A00'}</span>
                <div className={styles.categoryInfo}>
                  <span className={styles.categoryName}>{t.words}</span>
                  <span className={styles.categoryDesc}>{t.wordsDesc}</span>
                </div>
                <span className={styles.categoryArrow}>&rarr;</span>
              </button>

              <div className={`${styles.categoryCard} ${styles.disabled}`}>
                <span className={styles.categoryChar}>{'\u6F22'}</span>
                <div className={styles.categoryInfo}>
                  <span className={styles.categoryName}>{t.kanji}</span>
                  <span className={styles.categoryDesc}>{t.kanjiDesc}</span>
                </div>
                <span className={styles.comingSoon}>{t.comingSoon}</span>
              </div>
            </>
          ) : (
            <>
              <button className={styles.categoryCard} onClick={onHangulStart}>
                <span className={styles.categoryChar}>{'\u314E'}</span>
                <div className={styles.categoryInfo}>
                  <span className={styles.categoryName}>{t.hangul}</span>
                  <span className={styles.categoryDesc}>{t.hangulDesc}</span>
                </div>
                <span className={styles.categoryArrow}>&rarr;</span>
              </button>

              <button className={styles.categoryCard} onClick={onSyllable}>
                <span className={styles.categoryChar}>{'\uAC00'}</span>
                <div className={styles.categoryInfo}>
                  <span className={styles.categoryName}>{t.syllable}</span>
                  <span className={styles.categoryDesc}>{t.syllableDesc}</span>
                </div>
                <span className={styles.categoryArrow}>&rarr;</span>
              </button>

              <button className={styles.categoryCard} onClick={onKoreanWords}>
                <span className={styles.categoryChar}>{'\u8A00'}</span>
                <div className={styles.categoryInfo}>
                  <span className={styles.categoryName}>{t.words}</span>
                  <span className={styles.categoryDesc}>{t.wordsDescKo}</span>
                </div>
                <span className={styles.categoryArrow}>&rarr;</span>
              </button>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
