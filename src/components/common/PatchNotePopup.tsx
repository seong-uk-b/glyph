import styles from './PatchNotePopup.module.css';
import { useLanguage } from '../../i18n';
import { releaseNotes } from '../../data/releaseNotes';

const STORAGE_KEY = 'glyph_last_seen_version';

export function getLastSeenVersion(): string | null {
  return localStorage.getItem(STORAGE_KEY);
}

export function getCurrentVersion(): string {
  return releaseNotes[0].version;
}

export function shouldShowPatchNote(): boolean {
  const lastSeen = getLastSeenVersion();

  // 완전 신규 사용자: glyph 관련 localStorage가 없으면 팝업 없이 버전만 저장
  if (lastSeen === null) {
    const isReturningUser = localStorage.getItem('glyph-lang') !== null
      || localStorage.getItem('glyph-learn-lang') !== null;
    if (!isReturningUser) {
      markVersionSeen();
      return false;
    }
    return true;
  }

  return lastSeen !== getCurrentVersion();
}

export function markVersionSeen(): void {
  localStorage.setItem(STORAGE_KEY, getCurrentVersion());
}

interface PatchNotePopupProps {
  onDismiss: () => void;
  onViewAll: () => void;
}

export default function PatchNotePopup({ onDismiss, onViewAll }: PatchNotePopupProps) {
  const { t, language } = useLanguage();
  const latest = releaseNotes[0];

  const handleDismiss = () => {
    markVersionSeen();
    onDismiss();
  };

  const handleViewAll = () => {
    markVersionSeen();
    onViewAll();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) handleDismiss();
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.sheet}>
        <div className={styles.handle} />
        <div className={styles.header}>
          <h3 className={styles.title}>{t.whatsNew}</h3>
          <span className={styles.version}>{latest.version}</span>
        </div>
        <div className={styles.body}>
          <ul className={styles.changeList}>
            {latest.changes[language].map((change, i) => (
              <li key={i} className={styles.changeItem}>{change}</li>
            ))}
          </ul>
        </div>
        <div className={styles.actions}>
          <button className={styles.dismissBtn} onClick={handleDismiss}>
            {t.dismiss}
          </button>
          <button className={styles.viewAllBtn} onClick={handleViewAll}>
            {t.viewAll}
          </button>
        </div>
      </div>
    </div>
  );
}
