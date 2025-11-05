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
              <h2>Get in Touch</h2>
              <p>
                Our customer support team is here to help you with any questions, concerns, 
                or issues related to our services. We strive to respond to all inquiries promptly.
              </p>
            </section>

            <section>
              <h2>Company Information</h2>
              <p>
                <strong>Company Name:</strong> Overseas MCC<br />
                <strong>Website:</strong> playcheaply.com<br />
                <strong>Location:</strong> Beirut, Lebanon
              </p>
            </section>

            <section>
              <h2>Contact Information</h2>
              <div className={styles.contactMethods}>
                <div className={styles.contactMethod}>
                  <h3>Email Support</h3>
                  <p><a href="mailto:info@playcheaply.com">info@playcheaply.com</a></p>
                  <p className={styles.note}>Primary contact for all inquiries</p>
                </div>

                <div className={styles.contactMethod}>
                  <h3>General Inquiries</h3>
                  <p>For questions about our services, subscriptions, or partnerships</p>
                  <p className={styles.note}>Email: <a href="mailto:info@playcheaply.com">info@playcheaply.com</a></p>
                </div>

                <div className={styles.contactMethod}>
                  <h3>Customer Support</h3>
                  <p>For technical support, billing questions, or account assistance</p>
                  <p className={styles.note}>Email: <a href="mailto:info@playcheaply.com">info@playcheaply.com</a></p>
                </div>
              </div>
            </section>

            <section>
              <h2>What We Can Help With</h2>
              <ul>
                <li><strong>Subscription Management:</strong> Questions about subscriptions, pricing, and billing</li>
                <li><strong>Technical Support:</strong> Device compatibility, login issues, and content access</li>
                <li><strong>Account Issues:</strong> Account registration, password reset, and profile updates</li>
                <li><strong>Cancellations:</strong> Assistance with unsubscribing from services</li>
                <li><strong>Privacy & Data:</strong> Questions about data protection and privacy practices</li>
                <li><strong>Billing Disputes:</strong> Resolution of payment or billing concerns</li>
              </ul>
            </section>

            <section>
              <h2>Response Time</h2>
              <p>
                We aim to respond to all email inquiries within 24-48 hours during business days. 
                Complex issues may require additional time for investigation and resolution.
              </p>
            </section>

            <section>
              <h2>Feedback and Suggestions</h2>
              <p>
                We value your feedback! Help us improve our services by sharing your suggestions, 
                experiences, and ideas. Send your feedback to <a href="mailto:info@playcheaply.com">info@playcheaply.com</a>
              </p>
            </section>

            <section>
              <h2>Legal and Privacy Inquiries</h2>
              <p>
                For questions regarding our Terms of Service, Privacy Policy, or data protection 
                practices, please contact us at <a href="mailto:info@playcheaply.com">info@playcheaply.com</a>
              </p>
              <p>
                You can also review our <Link href="/privacy">Privacy Policy</Link> and{' '}
                <Link href="/terms">Terms of Service</Link> pages for detailed information.
              </p>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}