import styles from './Footer.module.css';
import { useLanguage } from '../../i18n';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className={styles.footer}>
      <span className={styles.text}>{t.footerText}</span>
      <span className={styles.author}>
        {t.madeBy}{' '}
        <a href="https://github.com/seong-uk-b" target="_blank" rel="noopener noreferrer" className={styles.link}>
          @seong-uk-b
        </a>
        {' · '}
        <a href="https://seongukbyeon.notion.site/glyph" target="_blank" rel="noopener noreferrer" className={styles.link}>
          {t.docs}
        </a>
      </span>
    </footer>
  );
}
