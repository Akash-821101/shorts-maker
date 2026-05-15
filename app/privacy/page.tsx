import { Metadata } from 'next'
import { LegalLayout, LegalSection } from '@/components/shared/legal-layout'

export const metadata: Metadata = {
  title: 'Privacy Policy | Shorts Maker',
  description: 'How Shorts Maker collects, uses, and protects your personal data.',
}

export default function PrivacyPolicy() {
  const sections = [
    { id: 'introduction', title: '1. Introduction' },
    { id: 'data-collection', title: '2. Data We Collect' },
    { id: 'youtube-api', title: '3. YouTube API Services' },
    { id: 'social-media', title: '4. Social Media Integrations' },
    { id: 'data-usage', title: '5. How We Use Data' },
    { id: 'data-retention', title: '6. Retention & Deletion' },
    { id: 'third-parties', title: '7. Third-Party Services' },
    { id: 'security', title: '8. Data Security' },
    { id: 'user-rights', title: '9. Your Rights' },
    { id: 'contact', title: '10. Contact Us' },
  ];

  const lastUpdated = "May 15, 2026";

  return (
    <LegalLayout title="Privacy Policy" lastUpdated={lastUpdated} sections={sections}>
      <LegalSection id="introduction" title="1. Introduction">
        <p>
          Welcome to Shorts Maker ("we," "our," or "us"). We are committed to protecting your privacy and ensuring you have a positive experience when using our AI-powered video generation platform.
        </p>
        <p>
          This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services. By using Shorts Maker, you consent to the data practices described in this policy.
        </p>
      </LegalSection>

      <LegalSection id="data-collection" title="2. Data We Collect">
        <p>
          We collect information that you provide directly to us, as well as information collected automatically when you use our service:
        </p>
        <ul>
          <li><strong>Account Information:</strong> Name, email address, and profile picture provided through OAuth providers (Google, GitHub).</li>
          <li><strong>Content Data:</strong> Text prompts, scripts, and media files you upload or generate using our AI tools.</li>
          <li><strong>Usage Data:</strong> Information on how you interact with our service, including feature usage, time spent, and generation history.</li>
          <li><strong>Billing Information:</strong> Payment details are processed securely through Stripe; we do not store your full credit card information on our servers.</li>
        </ul>
      </LegalSection>

      <LegalSection id="youtube-api" title="3. YouTube API Services">
        <p>
          Shorts Maker utilizes YouTube API Services to provide features that allow you to publish generated content directly to your YouTube channel.
        </p>
        <p>
          <strong>Compliance:</strong> By using these features, you agree to be bound by the <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer">YouTube Terms of Service</a> and the <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a>.
        </p>
        <p>
          <strong>Data Access:</strong> We request the <code>youtube.upload</code> scope to upload videos. We do not access your private viewing history, contact lists, or other unrelated data. We store only the necessary authentication tokens to perform uploads on your behalf.
        </p>
        <p>
          <strong>Revoking Access:</strong> You can revoke Shorts Maker's access to your YouTube data at any time via the <a href="https://security.google.com/settings/security/permissions" target="_blank" rel="noopener noreferrer">Google Security Settings</a> page.
        </p>
      </LegalSection>

      <LegalSection id="social-media" title="4. Other Social Media Integrations">
        <p>
          In addition to YouTube, Shorts Maker is designed to integrate with other social media platforms to help you reach a wider audience.
        </p>
        <ul>
          <li><strong>Meta (Instagram/Facebook):</strong> Future integrations will allow you to share content directly to Reels and Stories. Use of these features will be subject to the <a href="https://www.facebook.com/legal/terms" target="_blank" rel="noopener noreferrer">Meta Terms of Service</a> and <a href="https://www.facebook.com/privacy/policy/" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.</li>
          <li><strong>TikTok:</strong> We plan to support direct uploads to TikTok. Use will be subject to <a href="https://www.tiktok.com/legal/terms-of-service" target="_blank" rel="noopener noreferrer">TikTok Terms of Service</a> and <a href="https://www.tiktok.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.</li>
          <li><strong>LinkedIn:</strong> Automated posting to LinkedIn is on our roadmap, subject to <a href="https://www.linkedin.com/legal/user-agreement" target="_blank" rel="noopener noreferrer">LinkedIn User Agreement</a> and <a href="https://www.linkedin.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.</li>
        </ul>
        <p>
          We only access the minimal permissions required to post content and provide analytics on your behalf. You can disconnect these services at any time through your dashboard settings.
        </p>
      </LegalSection>

      <LegalSection id="data-usage" title="5. How We Use Data">
        <p>
          We use the information we collect to:
        </p>
        <ul>
          <li>Provide, maintain, and improve our video generation services.</li>
          <li>Process transactions and send related information, including confirmations and invoices.</li>
          <li>Send technical notices, updates, security alerts, and support messages.</li>
          <li>Monitor and analyze trends, usage, and activities in connection with our services.</li>
          <li>Personalize your experience and deliver content relevant to your interests.</li>
        </ul>
      </LegalSection>

      <LegalSection id="data-retention" title="6. Retention & Deletion">
        <p>
          We retain your personal information for as long as your account is active or as needed to provide you services.
        </p>
        <p>
          <strong>Account Deletion:</strong> You may delete your account at any time through the settings dashboard. Upon deletion, we will remove your personal data from our active databases, although some information may be retained in backups for legal or regulatory compliance.
        </p>
      </LegalSection>

      <LegalSection id="third-parties" title="7. Third-Party Services">
        <p>
          We use third-party service providers to help us operate our business:
        </p>
        <ul>
          <li><strong>AI Providers:</strong> We use OpenAI, Anthropic, and other AI models to generate content. Prompts sent to these services are subject to their respective privacy policies.</li>
          <li><strong>Infrastructure:</strong> Vercel (Hosting), Supabase (Database), Inngest (Workflow orchestration).</li>
          <li><strong>Analytics:</strong> PostHog or similar tools to understand user behavior.</li>
        </ul>
      </LegalSection>

      <LegalSection id="security" title="8. Data Security">
        <p>
          We implement industry-standard security measures designed to protect your data from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
        </p>
      </LegalSection>

      <LegalSection id="user-rights" title="9. Your Rights">
        <p>
          Depending on your location, you may have certain rights regarding your personal data, including:
        </p>
        <ul>
          <li>The right to access the data we hold about you.</li>
          <li>The right to request correction of inaccurate data.</li>
          <li>The right to request deletion of your data.</li>
          <li>The right to object to or restrict certain processing.</li>
        </ul>
      </LegalSection>

      <LegalSection id="contact" title="10. Contact Us">
        <p>
          If you have any questions or concerns about this Privacy Policy or our data practices, please reach out to us:
        </p>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mt-4">
          <p className="mb-0 font-medium text-white">Shorts Maker Support</p>
          <p className="mb-0">Email: <a href="mailto:support@shortsmaker.com" className="text-primary hover:underline">support@shortsmaker.com</a></p>
        </div>
      </LegalSection>
    </LegalLayout>
  )
}
