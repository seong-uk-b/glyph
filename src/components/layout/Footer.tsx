import styles from './Footer.module.css';
import { useLanguage } from '../../i18n';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className={styles.footer}>
      <span className={styles.text}>{t.footerText}</span>
    </footer>
  );
}
