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
          <p className={styles.lastUpdated}>Last Updated: November 5, 2025</p>
          
          <div className={styles.content}>
            <section>
              <h2>Owner and Data Controller</h2>
              <p>
                <strong>Company:</strong> Overseas MCC<br />
                <strong>Address:</strong> Beirut, Lebanon<br />
                <strong>Contact Email:</strong> <a href="mailto:info@playcheaply.com">info@playcheaply.com</a>
              </p>
            </section>

            <section>
              <h2>Introduction</h2>
              <p>
                This Privacy Policy explains how we collect, use, and protect your information when you use our 
                websites, applications, or related services ("Services"). Please read it carefully.
              </p>
              <p>
                If you do not agree with this Privacy Policy, you should not use our Sites or Services. 
                This Privacy Policy forms part of our Terms of Service.
              </p>
            </section>

            <section>
              <h2>1. Information We Collect</h2>
              
              <h3>When You Provide It</h3>
              <p>
                We collect information that you provide directly, such as your name, email address, and phone number. 
                You may browse our Sites without providing personal information, but certain Services may require 
                registration or contact details. If you make a purchase or subscription, payment information may be 
                collected by us or by a third-party payment processor.
              </p>
              <p className={styles.summary}>
                <strong>In Summary:</strong> We collect the information you voluntarily provide when registering, 
                subscribing, or contacting us.
              </p>

              <h3>Technical Information</h3>
              <p>
                We automatically collect technical data when you visit our Sites or use our Services. This may include 
                your device type, browser information, IP address, geographic location, and how you use our Sites. 
                Cookies and similar technologies help us analyze usage, enhance security, and improve your overall experience.
              </p>
              <p className={styles.summary}>
                <strong>In Summary:</strong> We automatically gather technical information to personalize and improve our Services.
              </p>

              <h3>Information from Partners and Advertisers</h3>
              <p>
                We may use analytics and advertising tools (such as Google Analytics, Google Ads, and Hotjar) to help us 
                understand usage trends and optimize performance. These tools may use cookies or similar technologies to 
                collect data on how you interact with our content and ads.
              </p>
              <p className={styles.summary}>
                <strong>In Summary:</strong> We use third-party tools to analyze and improve our content, marketing, and user experience.
              </p>
            </section>

            <section>
              <h2>2. Managing Cookies and Opting Out</h2>
              <p>
                You can refuse cookies or set your browser to notify you when cookies are used. To opt out of tracking 
                by analytics or advertising services, visit their respective opt-out pages.
              </p>
              <p className={styles.summary}>
                <strong>In Summary:</strong> You control your cookie settings and can opt out of tracking at any time.
              </p>
            </section>

            <section>
              <h2>3. How We Use Your Information</h2>
              <p>We use your information to:</p>
              <ul>
                <li>Provide, maintain, and improve our Services</li>
                <li>Process payments and manage subscriptions</li>
                <li>Send service notifications or marketing updates (where permitted)</li>
                <li>Respond to inquiries and customer support requests</li>
                <li>Comply with legal obligations and enforce our terms</li>
              </ul>
              <p className={styles.summary}>
                <strong>In Summary:</strong> We use your data to operate and enhance our Services and to communicate with you.
              </p>
            </section>

            <section>
              <h2>4. Data Retention</h2>
              <p>
                We retain personal data only as long as necessary to fulfill the purposes described in this policy and 
                comply with applicable laws. Once it is no longer needed, we securely delete or anonymize it.
              </p>
              <p className={styles.summary}>
                <strong>In Summary:</strong> Your data is kept only as long as necessary and securely removed when no longer required.
              </p>
            </section>

            <section>
              <h2>5. Data Protection and International Transfers</h2>
              <p>
                We implement reasonable technical and organizational safeguards to protect your information. While we 
                take steps to ensure your data is secure, no system is completely secure. Your data may be processed 
                in countries outside your own, and we ensure adequate protection during any such transfer.
              </p>
              <p className={styles.summary}>
                <strong>In Summary:</strong> We protect your data and apply appropriate safeguards when it's processed internationally.
              </p>
            </section>

            <section>
              <h2>6. Sharing Your Information</h2>
              <p>
                We may share information with trusted third parties who help us deliver and improve our Services, such 
                as analytics providers or payment processors. We do not share personal data without your consent unless 
                required by law or necessary to protect our rights.
              </p>
              <p className={styles.summary}>
                <strong>In Summary:</strong> We share data only with trusted partners when necessary and never sell your personal information.
              </p>
            </section>

            <section>
              <h2>7. Children's Privacy</h2>
              <p>
                Our Services are not intended for children under 13, and we do not knowingly collect personal information 
                from them. If we discover that a child has provided personal data, we will delete it promptly. Additional 
                rights may apply for minors in certain jurisdictions.
              </p>
              <p className={styles.summary}>
                <strong>In Summary:</strong> We do not collect or store data from users under 13.
              </p>
            </section>

            <section>
              <h2>8. Updates to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. When changes are made, we will update the 
                "Last Updated" date above and post the revised version on our website. Continued use of our Services 
                after changes take effect constitutes acceptance of the updated policy.
              </p>
              <p className={styles.summary}>
                <strong>In Summary:</strong> We may update this policy periodically and will always indicate the latest revision date.
              </p>
            </section>

            <section>
              <h2>9. Contacting Us</h2>
              <p>
                If you have questions about this Privacy Policy or wish to access, correct, or delete your personal 
                information, please contact us at:
              </p>
              <p>
                <strong>Email:</strong> <a href="mailto:info@playcheaply.com">info@playcheaply.com</a>
              </p>
              <p>
                If you believe your data rights have not been respected, you may contact your local data protection authority.
              </p>
              <p className={styles.summary}>
                <strong>In Summary:</strong> For any privacy questions or requests, reach us at info@playcheaply.com.
              </p>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}