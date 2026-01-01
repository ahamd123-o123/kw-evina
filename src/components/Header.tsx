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
            <span className={styles.logoText}>{config.service_name}</span>
          )}
        </div>
        
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
    </header>
  );
}