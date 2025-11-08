import Link from 'next/link';
import { LandingPageConfig, LanguageContent } from '@/types/config';
import styles from './Footer.module.css';

interface FooterProps {
  config: LandingPageConfig;
  currentContent: LanguageContent;
}

export default function Footer({ config, currentContent }: FooterProps) {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p className={styles.legalText}>
          {currentContent.footer_legal_prefix}{' '}
          <Link href={config.terms_link} className={styles.link}>
            {currentContent.footer_terms}
          </Link>{' '}
          {currentContent.footer_and}{' '}
          <Link href={config.privacy_link} className={styles.link}>
            {currentContent.footer_privacy}
          </Link>.
        </p>
        
        <p className={styles.serviceInfo}>
          {currentContent.footer_service} <span className={styles.highlight}>{config.service_name}</span> |{' '}
          {currentContent.footer_price} <span className={styles.highlight}>{config.price_text}</span> |{' '}
          {currentContent.footer_available} {config.operators.join(', ')}.
        </p>
        
        <p className={styles.companyInfo}>
          {config.company_name} | <a href={`mailto:${config.company_email}`} className={styles.link}>{config.company_email}</a>
        </p>
        
        <p className={styles.unsubscribe}>
          {currentContent.footer_unsubscribe}
        </p>
      </div>
    </footer>
  );
}