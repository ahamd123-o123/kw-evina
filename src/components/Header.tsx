import { LandingPageConfig, LanguageContent } from '@/types/config';
import styles from './Header.module.css';

interface HeaderProps {
  config: LandingPageConfig;
  currentLanguage: string;
  currentContent: LanguageContent;
  onLanguageChange: (lang: string) => void;
}

export default function Header({ config, currentLanguage, currentContent, onLanguageChange }: HeaderProps) {
  const showLogo = config.brand_logo_url && config.brand_logo_url.trim() !== "";
  
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logoSection}>
          {showLogo ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={config.brand_logo_url} 
                alt={config.service_name}
                className={styles.logo}
              />
            </>
          ) : (
            <>
              <div className={styles.logoIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="#FFB800"/>
                </svg>
              </div>
              <span className={styles.logoText}>{config.service_name}</span>
            </>
          )}
        </div>
        
        <div className={styles.rightSection}>
          <p className={styles.tagline}>{currentContent.tagline}</p>
          <div className={styles.languageSelector}>
            {Object.keys(config.languages).length > 1 && (
              <button
                onClick={() => {
                  const availableLangs = Object.keys(config.languages);
                  const nextLang = availableLangs.find(lang => lang !== currentLanguage) || availableLangs[0];
                  onLanguageChange(nextLang);
                }}
                className={styles.langButton}
              >
                {currentLanguage === 'en' ? 'عربي' : 'English'}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}