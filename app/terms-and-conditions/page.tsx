import { Metadata } from 'next'
import { LegalLayout, LegalSection } from '@/components/shared/legal-layout'

export const metadata: Metadata = {
  title: 'Terms & Conditions | Shorts Maker',
  description: 'Terms and conditions for using the Shorts Maker platform.',
}

export default function TermsAndConditions() {
  const sections = [
    { id: 'agreement', title: '1. Agreement to Terms' },
    { id: 'services', title: '2. Description of Service' },
    { id: 'accounts', title: '3. User Accounts' },
    { id: 'third-party-platforms', title: '4. Third-Party Platforms' },
    { id: 'ai-content', title: '5. AI-Generated Content' },
    { id: 'intellectual-property', title: '6. Intellectual Property' },
    { id: 'billing', title: '7. Billing & Credits' },
    { id: 'acceptable-use', title: '8. Acceptable Use' },
    { id: 'termination', title: '9. Termination' },
    { id: 'disclaimers', title: '10. Disclaimers' },
    { id: 'liability', title: '11. Limitation of Liability' },
    { id: 'governing-law', title: '12. Governing Law' },
  ];

  const lastUpdated = "May 15, 2026";

  return (
    <LegalLayout title="Terms & Conditions" lastUpdated={lastUpdated} sections={sections}>
      <LegalSection id="agreement" title="1. Agreement to Terms">
        <p>
          By accessing or using Shorts Maker (the "Service"), you agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree to all of these terms, do not use the Service.
        </p>
      </LegalSection>

      <LegalSection id="services" title="2. Description of Service">
        <p>
          Shorts Maker provides an AI-powered platform for generating short-form video content. This includes text-to-speech, image/video generation, and automated publishing tools for platforms like YouTube.
        </p>
      </LegalSection>

      <LegalSection id="accounts" title="3. User Accounts">
        <p>
          To use certain features, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.
        </p>
      </LegalSection>

      <LegalSection id="third-party-platforms" title="4. Third-Party Platforms">
        <p>
          Shorts Maker allows you to publish content to third-party platforms, including but not limited to YouTube, Instagram, TikTok, and LinkedIn.
        </p>
        <ul>
          <li><strong>Compliance:</strong> By using these features, you agree to comply with the terms of service and privacy policies of each respective platform.</li>
          <li><strong>YouTube:</strong> You specifically agree to the <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer">YouTube Terms of Service</a>.</li>
          <li><strong>No Affiliation:</strong> Shorts Maker is not affiliated with, endorsed by, or sponsored by any of these third-party platforms. We are not responsible for any actions taken by these platforms against your account (e.g., shadowbans, strikes, or account termination).</li>
        </ul>
      </LegalSection>

      <LegalSection id="ai-content" title="5. AI-Generated Content">
        <p>
          Our Service uses artificial intelligence to generate content.
        </p>
        <ul>
          <li><strong>Ownership:</strong> Subject to your compliance with these terms, you own the content you generate using the Service.</li>
          <li><strong>Responsibility:</strong> You are solely responsible for the content you generate. You must ensure that your content does not violate any laws, third-party rights, or platform community guidelines.</li>
          <li><strong>Nature of AI:</strong> You acknowledge that AI-generated content may occasionally be inaccurate, biased, or offensive. Shorts Maker does not guarantee the accuracy or appropriateness of generated content.</li>
        </ul>
      </LegalSection>

      <LegalSection id="intellectual-property" title="6. Intellectual Property">
        <p>
          The Service, including its original content, features, and functionality, are and will remain the exclusive property of Shorts Maker and its licensors. Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent.
        </p>
      </LegalSection>

      <LegalSection id="billing" title="7. Billing & Credits">
        <p>
          Shorts Maker operates on a subscription and credit-based model.
        </p>
        <ul>
          <li><strong>Credits:</strong> Credits are required to generate videos. Credits are non-refundable and expire according to your specific plan terms.</li>
          <li><strong>Subscriptions:</strong> Subscriptions automatically renew unless cancelled. You can cancel your subscription at any time through your dashboard.</li>
          <li><strong>Refunds:</strong> Refunds are handled on a case-by-case basis at our sole discretion, unless required by law.</li>
        </ul>
      </LegalSection>

      <LegalSection id="acceptable-use" title="8. Acceptable Use">
        <p>
          You agree not to use the Service to:
        </p>
        <ul>
          <li>Generate content that is illegal, harmful, threatening, abusive, or defamatory.</li>
          <li>Infringe upon the intellectual property rights of others.</li>
          <li>Create "deepfakes" or misleading content intended to deceive.</li>
          <li>Attempt to bypass any security measures or rate limits of the Service.</li>
          <li>Use automated scripts to scrape or interact with the Service without authorization.</li>
        </ul>
      </LegalSection>

      <LegalSection id="termination" title="9. Termination">
        <p>
          We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever, including without limitation if you breach the Terms.
        </p>
      </LegalSection>

      <LegalSection id="disclaimers" title="10. Disclaimers">
        <p>
          The Service is provided on an "AS IS" and "AS AVAILABLE" basis. Shorts Maker makes no representations or warranties of any kind, express or implied, as to the operation of their services, or the information, content or materials included therein.
        </p>
      </LegalSection>

      <LegalSection id="liability" title="11. Limitation of Liability">
        <p>
          In no event shall Shorts Maker, nor its directors, employees, partners, agents, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including loss of profits, data, use, or goodwill, resulting from your use of the Service.
        </p>
      </LegalSection>

      <LegalSection id="governing-law" title="12. Governing Law">
        <p>
          These Terms shall be governed and construed in accordance with the laws of the State of California, United States, without regard to its conflict of law provisions.
        </p>
      </LegalSection>

      <div className="mt-12 p-8 bg-primary/5 border border-primary/20 rounded-3xl backdrop-blur-sm">
        <h3 className="text-xl font-bold mb-4 text-white">Questions?</h3>
        <p className="text-zinc-400 mb-0">
          If you have any questions about these Terms, please contact us at <a href="mailto:support@shortsmaker.com" className="text-primary font-medium hover:underline">support@shortsmaker.com</a>.
        </p>
      </div>
    </LegalLayout>
  )
}
