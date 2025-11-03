import Link from 'next/link';
import styles from '../terms/legal.module.css';

export default function Contact() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <Link href="/" className={styles.backLink}>
            ← Back to Home
          </Link>
        </header>
        
        <main className={styles.main}>
          <h1>Contact Us</h1>
          
          <div className={styles.content}>
            <section>
              <h2>Customer Support</h2>
              <p>
                Our customer support team is here to help you with any questions or 
                issues related to our service.
              </p>
            </section>

            <section>
              <h2>Support Hours</h2>
              <p>
                Monday to Friday: 9:00 AM - 6:00 PM (Local Time)<br />
                Saturday: 10:00 AM - 4:00 PM (Local Time)<br />
                Sunday: Closed
              </p>
            </section>

            <section>
              <h2>Contact Methods</h2>
              <div className={styles.contactMethods}>
                <div className={styles.contactMethod}>
                  <h3>Email Support</h3>
                  <p>support@example.com</p>
                  <p className={styles.note}>Response time: 24-48 hours</p>
                </div>

                <div className={styles.contactMethod}>
                  <h3>Phone Support</h3>
                  <p>+966 11 123 4567</p>
                  <p className={styles.note}>Available during support hours</p>
                </div>

                <div className={styles.contactMethod}>
                  <h3>Live Chat</h3>
                  <p>Available on our main website</p>
                  <p className={styles.note}>Instant support during business hours</p>
                </div>
              </div>
            </section>

            <section>
              <h2>Billing Inquiries</h2>
              <p>
                For billing-related questions, please contact your mobile operator 
                directly or reach out to our billing support at billing@example.com
              </p>
            </section>

            <section>
              <h2>Technical Support</h2>
              <p>
                Experiencing technical difficulties? Our technical team can assist 
                you with device compatibility, login issues, and content access problems.
              </p>
            </section>

            <section>
              <h2>Business Address</h2>
              <p>
                Prizeflix BV<br />
                Van Diemenstraat 356<br />
                1013CR Amsterdam<br />
                The Netherlands
              </p>
            </section>

            <section>
              <h2>Feedback</h2>
              <p>
                We value your feedback! Help us improve our service by sharing your 
                suggestions and experiences at feedback@example.com
              </p>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}