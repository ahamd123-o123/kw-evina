import Link from 'next/link';
import styles from '../terms/legal.module.css';
import legalContent from '../../../public/legal/legal.json';
import type { LegalContent } from '@/types/legal';

const legal = legalContent as LegalContent;

export default function Privacy() {
  // Default to English - you can add language detection here
  const content = legal.privacy.en;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <Link href="/" className={styles.backLink}>
            ← Back to Home
          </Link>
        </header>
        
        <main className={styles.main}>
          <h1>{content.title}</h1>
          <p className={styles.lastUpdated}>{content.lastUpdated}</p>
          
          <div className={styles.content}>
            {content.sections.map((section, index) => (
              <section key={index}>
                <h2>{section.heading}</h2>
                {section.content && (
                  <p dangerouslySetInnerHTML={{ __html: section.content }} />
                )}
                {section.subsections && section.subsections.map((subsection, subIndex) => (
                  <div key={subIndex}>
                    <h3>{subsection.subheading}</h3>
                    <p dangerouslySetInnerHTML={{ __html: subsection.content }} />
                    {subsection.summary && (
                      <p className={styles.summary} dangerouslySetInnerHTML={{ __html: subsection.summary }} />
                    )}
                  </div>
                ))}
                {section.summary && (
                  <p className={styles.summary} dangerouslySetInnerHTML={{ __html: section.summary }} />
                )}
              </section>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}