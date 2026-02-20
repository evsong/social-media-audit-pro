import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — AuditPro",
  description: "Privacy Policy for AuditPro social media audit tool.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="font-extrabold text-4xl mb-2">Privacy Policy</h1>
        <p className="text-gray-500 text-sm mb-10">Last updated: February 20, 2026</p>

        <div className="prose prose-invert prose-gray max-w-none space-y-6 text-gray-300 text-[15px] leading-relaxed">
          <Section title="1. Introduction">
            AuditPro (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) operates the website socialmediaaudittool.online. This Privacy Policy explains how we collect, use, and protect your information when you use our service.
          </Section>

          <Section title="2. Information We Collect">
            <ul className="list-disc pl-5 space-y-1.5 mt-2">
              <li><b>Account Information:</b> Email address when you sign in via Magic Link.</li>
              <li><b>Audit Data:</b> Social media usernames or profile URLs you submit for analysis.</li>
              <li><b>Usage Data:</b> Pages visited, features used, browser type, and IP address collected automatically.</li>
            </ul>
          </Section>

          <Section title="3. How We Use Your Information">
            <ul className="list-disc pl-5 space-y-1.5 mt-2">
              <li>To provide and improve our social media audit service.</li>
              <li>To send transactional emails (login links, audit reports).</li>
              <li>To analyze usage patterns and improve user experience.</li>
            </ul>
          </Section>

          <Section title="4. Data Sharing">
            We do not sell your personal information. We may share data with third-party services that help us operate (e.g., hosting providers, email delivery services) under strict data processing agreements.
          </Section>

          <Section title="5. Data Retention">
            Account data is retained while your account is active. Audit results are stored for up to 12 months. You may request deletion of your data at any time by contacting us.
          </Section>

          <Section title="6. Cookies">
            We use essential cookies for authentication and session management. No third-party advertising cookies are used.
          </Section>

          <Section title="7. Security">
            We implement industry-standard security measures including encrypted connections (HTTPS), secure authentication, and regular security reviews.
          </Section>

          <Section title="8. Your Rights">
            You have the right to access, correct, or delete your personal data. To exercise these rights, contact us at support@socialmediaaudittool.online.
          </Section>

          <Section title="9. Changes">
            We may update this policy from time to time. Changes will be posted on this page with an updated revision date.
          </Section>

          <Section title="10. Contact">
            For privacy-related inquiries, email us at <a href="mailto:support@socialmediaaudittool.online" className="text-[#1de4c3] hover:underline">support@socialmediaaudittool.online</a>.
          </Section>
        </div>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-semibold text-xl text-white mb-2">{title}</h2>
      <div>{children}</div>
    </section>
  );
}
