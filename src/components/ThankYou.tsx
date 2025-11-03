import { LandingPageConfig, LanguageContent } from '@/types/config';
import styles from './ThankYou.module.css';

interface ThankYouProps {
  config: LandingPageConfig;
  currentContent: LanguageContent;
}

export default function ThankYou({ config, currentContent }: ThankYouProps) {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.iconContainer}>
          <svg className={styles.checkIcon} viewBox="0 0 52 52">
            <circle 
              className={styles.checkCircle} 
              cx="26" 
              cy="26" 
              r="25" 
              fill="none"
            />
            <path 
              className={styles.checkPath} 
              fill="none" 
              d="m14.1 27.2l7.1 7.2 16.7-16.8"
            />
          </svg>
        </div>
        
        <h1 className={styles.headline}>{currentContent.headline_thanks}</h1>
        <p className={styles.subtext}>{currentContent.subtext_thanks}</p>
        
        <button className={styles.ctaButton}>
          {currentContent.cta_thanks}
        </button>
      </div>
    </div>
  );
}