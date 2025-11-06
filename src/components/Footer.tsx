import Link from 'next/link';
import { LandingPageConfig } from '@/types/config';
import styles from './Footer.module.css';

interface FooterProps {
  config: LandingPageConfig;
}

export default function Footer({ config }: FooterProps) {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p className={styles.legalText}>
          By subscribing, you agree to the{' '}
          <Link href={config.terms_link} className={styles.link}>
            Terms & Conditions
          </Link>{' '}
          and{' '}
          <Link href={config.privacy_link} className={styles.link}>
            Privacy Policy
          </Link>.
        </p>
        
        <p className={styles.serviceInfo}>
          Service: <span className={styles.highlight}>{config.service_name}</span> |{' '}
          Price: <span className={styles.highlight}>{config.price_text}</span> |{' '}
          Available for {config.operators.join(', ')}.
        </p>
        
        <p className={styles.companyInfo}>
          {config.company_name} | <a href={`mailto:${config.company_email}`} className={styles.link}>{config.company_email}</a>
        </p>
        
        <p className={styles.unsubscribe}>
          {config.unsubscribe_text}
        </p>
      </div>
    </footer>
  );
}