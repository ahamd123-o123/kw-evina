import Link from 'next/link';
import styles from '../terms/legal.module.css';

export default function Privacy() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <Link href="/" className={styles.backLink}>
            ← Back to Home
          </Link>
        </header>
        
        <main className={styles.main}>
          <h1>Privacy Policy</h1>
          
          <div className={styles.content}>
            <section>
              <h2>1. Information Collection</h2>
              <p>
                We collect your mobile number (MSISDN) for subscription purposes and 
                service delivery. This information is necessary to provide our services 
                and process billing through your mobile operator.
              </p>
            </section>

            <section>
              <h2>2. Data Usage</h2>
              <p>
                Your personal information is used solely for:
              </p>
              <ul>
                <li>Service activation and management</li>
                <li>Billing and payment processing</li>
                <li>Customer support</li>
                <li>Service improvement and analytics</li>
              </ul>
            </section>

            <section>
              <h2>3. Data Sharing</h2>
              <p>
                We do not sell or rent your personal information to third parties. 
                Data may be shared with:
              </p>
              <ul>
                <li>Your mobile operator for billing purposes</li>
                <li>Service providers who assist in our operations</li>
                <li>Legal authorities when required by law</li>
              </ul>
            </section>

            <section>
              <h2>4. Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect 
                your personal information against unauthorized access, alteration, 
                disclosure, or destruction.
              </p>
            </section>

            <section>
              <h2>5. Data Retention</h2>
              <p>
                We retain your personal information only for as long as necessary to 
                provide our services and comply with legal obligations.
              </p>
            </section>

            <section>
              <h2>6. Your Rights</h2>
              <p>
                You have the right to:
              </p>
              <ul>
                <li>Access your personal information</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to processing of your data</li>
              </ul>
            </section>

            <section>
              <h2>7. Cookies and Tracking</h2>
              <p>
                Our website may use cookies and similar technologies to improve user 
                experience and analyze usage patterns. You can control cookie settings 
                through your browser.
              </p>
            </section>

            <section>
              <h2>8. Contact Us</h2>
              <p>
                For privacy-related questions or to exercise your rights, please contact 
                our Data Protection Officer through our official support channels.
              </p>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}