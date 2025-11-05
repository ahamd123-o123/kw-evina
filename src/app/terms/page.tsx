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
          <h1>Terms of Service</h1>
          <p className={styles.lastUpdated}>Last Updated: November 5, 2025</p>
          
          <div className={styles.content}>
            <section>
              <h2>Service Provider</h2>
              <p>
                <strong>Company:</strong> Overseas MCC<br />
                <strong>Website:</strong> playcheaply.com<br />
                <strong>Address:</strong> Beirut, Lebanon<br />
                <strong>Contact Email:</strong> <a href="mailto:info@playcheaply.com">info@playcheaply.com</a>
              </p>
            </section>

            <section>
              <h2>1. Acceptance of Terms</h2>
              <p>
                By accessing or using our websites, applications, or services (collectively, the "Services"), 
                you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree 
                to these terms, please do not use our Services.
              </p>
            </section>

            <section>
              <h2>2. Service Description</h2>
              <p>
                Our Services provide subscription-based access to digital content, including games, entertainment, 
                and related services. The specific content, features, and pricing are described at the point of 
                subscription and may vary by region.
              </p>
            </section>

            <section>
              <h2>3. Subscription and Billing</h2>
              <p>
                Subscription fees are charged on a recurring basis (daily, weekly, or monthly) as specified during 
                signup. Charges will appear on your mobile phone bill or be deducted from your prepaid balance. 
                By subscribing, you authorize us and our payment partners to charge your account automatically.
              </p>
              <p>
                Pricing is displayed in your local currency and includes applicable taxes where required. 
                We reserve the right to change pricing with advance notice.
              </p>
            </section>

            <section>
              <h2>4. Cancellation and Refunds</h2>
              <p>
                You may cancel your subscription at any time by following the unsubscribe instructions provided 
                via SMS, email, or on our website. Cancellation takes effect at the end of the current billing period. 
                No refunds are provided for partial billing periods unless required by law.
              </p>
            </section>

            <section>
              <h2>5. User Responsibilities</h2>
              <p>
                You agree to:
              </p>
              <ul>
                <li>Provide accurate and current information during registration</li>
                <li>Maintain sufficient account balance for subscription charges</li>
                <li>Ensure your device meets minimum requirements for accessing the Services</li>
                <li>Use the Services only for lawful purposes</li>
                <li>Not share, resell, or distribute content from the Services</li>
              </ul>
            </section>

            <section>
              <h2>6. Content and Intellectual Property</h2>
              <p>
                All content provided through our Services, including games, videos, text, graphics, and software, 
                is owned by us or our licensors and protected by intellectual property laws. You may access content 
                for personal, non-commercial use only. You may not copy, distribute, modify, or create derivative 
                works from our content.
              </p>
            </section>

            <section>
              <h2>7. Service Availability</h2>
              <p>
                While we strive to provide continuous access, we do not guarantee uninterrupted or error-free service. 
                We may suspend or modify the Services for maintenance, updates, or other reasons without prior notice. 
                Content availability may vary by region due to licensing restrictions.
              </p>
            </section>

            <section>
              <h2>8. Limitation of Liability</h2>
              <p>
                The Services are provided "as is" and "as available" without warranties of any kind, either express 
                or implied. To the maximum extent permitted by law, we are not liable for any indirect, incidental, 
                special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred 
                directly or indirectly.
              </p>
            </section>

            <section>
              <h2>9. Privacy and Data Protection</h2>
              <p>
                Your use of our Services is also governed by our Privacy Policy, which explains how we collect, 
                use, and protect your personal information. By using our Services, you consent to the practices 
                described in our Privacy Policy.
              </p>
            </section>

            <section>
              <h2>10. Modifications to Terms</h2>
              <p>
                We may update these Terms of Service from time to time. When changes are made, we will update the 
                "Last Updated" date above and post the revised version on our website. Your continued use of the 
                Services after changes take effect constitutes acceptance of the updated terms.
              </p>
            </section>

            <section>
              <h2>11. Governing Law</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of Lebanon, without 
                regard to its conflict of law provisions.
              </p>
            </section>

            <section>
              <h2>12. Contact Us</h2>
              <p>
                If you have questions about these Terms of Service, please contact us at:
              </p>
              <p>
                <strong>Email:</strong> <a href="mailto:info@playcheaply.com">info@playcheaply.com</a><br />
                <strong>Website:</strong> playcheaply.com
              </p>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}