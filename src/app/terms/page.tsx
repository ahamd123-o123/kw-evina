import Link from 'next/link';
import styles from './legal.module.css';

export default function Terms() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <Link href="/" className={styles.backLink}>
            ← Back to Home
          </Link>
        </header>
        
        <main className={styles.main}>
          <h1>Terms & Conditions</h1>
          
          <div className={styles.content}>
            <section>
              <h2>1. Service Agreement</h2>
              <p>
                By subscribing to our service, you agree to these terms and conditions. 
                This is a subscription-based digital content service that provides access 
                to games and entertainment content.
              </p>
            </section>

            <section>
              <h2>2. Subscription Details</h2>
              <p>
                The service is billed on a daily basis as specified during signup. 
                Charges will appear on your mobile bill or be deducted from your prepaid balance.
              </p>
            </section>

            <section>
              <h2>3. Content Access</h2>
              <p>
                Upon successful subscription, you will receive access to the content library. 
                Content availability may vary by region and is subject to licensing agreements.
              </p>
            </section>

            <section>
              <h2>4. Cancellation</h2>
              <p>
                You may cancel your subscription at any time by following the unsubscribe 
                instructions provided. Cancellation will take effect from the next billing cycle.
              </p>
            </section>

            <section>
              <h2>5. User Responsibilities</h2>
              <p>
                Users are responsible for ensuring their device compatibility and maintaining 
                sufficient account balance for subscription charges.
              </p>
            </section>

            <section>
              <h2>6. Liability</h2>
              <p>
                The service is provided &quot;as is&quot; without warranties. We are not liable for 
                any indirect, incidental, or consequential damages.
              </p>
            </section>

            <section>
              <h2>7. Contact Information</h2>
              <p>
                For questions regarding these terms, please contact our customer support 
                through the official channels provided on our website.
              </p>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}