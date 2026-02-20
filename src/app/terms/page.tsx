import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — AuditPro",
  description: "Terms of Service for AuditPro social media audit tool.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="font-extrabold text-4xl mb-2">Terms of Service</h1>
        <p className="text-gray-500 text-sm mb-10">Last updated: February 20, 2026</p>

        <div className="prose prose-invert prose-gray max-w-none space-y-6 text-gray-300 text-[15px] leading-relaxed">
          <Section title="1. Acceptance of Terms">
            By accessing or using AuditPro at socialmediaaudittool.online, you agree to be bound by these Terms of Service. If you do not agree, please do not use our service.
          </Section>

          <Section title="2. Service Description">
            AuditPro provides social media account auditing and analytics for Instagram, TikTok, and X (Twitter). We analyze publicly available profile data to generate health scores, engagement metrics, and improvement suggestions.
          </Section>

          <Section title="3. User Accounts">
            <ul className="list-disc pl-5 space-y-1.5 mt-2">
              <li>You must provide a valid email address to create an account.</li>
              <li>You are responsible for maintaining the security of your account.</li>
              <li>You must not use the service for any unlawful purpose.</li>
            </ul>
          </Section>

          <Section title="4. Subscription Plans">
            <ul className="list-disc pl-5 space-y-1.5 mt-2">
              <li><b>Free:</b> 3 audits per month with basic features.</li>
              <li><b>Pro ($5.99/mo):</b> 30 audits per month with AI suggestions, trends, and PDF export.</li>
              <li><b>Agency ($99/mo):</b> Unlimited audits with competitor compare and white-label reports.</li>
            </ul>
            Paid subscriptions are billed monthly. You may cancel at any time; access continues until the end of the billing period.
          </Section>

          <Section title="5. Refund Policy">
            We offer a full refund within 7 days of your first paid subscription if you are not satisfied. After 7 days, no refunds are provided for the current billing period.
          </Section>

          <Section title="6. Acceptable Use">
            You agree not to:
            <ul className="list-disc pl-5 space-y-1.5 mt-2">
              <li>Scrape, reverse-engineer, or abuse the service.</li>
              <li>Use automated tools to access the service beyond normal usage.</li>
              <li>Attempt to gain unauthorized access to other users&apos; data.</li>
            </ul>
          </Section>

          <Section title="7. Intellectual Property">
            All content, branding, and technology of AuditPro are owned by us. Audit reports generated for you are yours to use, but the underlying algorithms and presentation remain our property.
          </Section>

          <Section title="8. Limitation of Liability">
            AuditPro is provided &quot;as is&quot; without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from your use of the service. Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim.
          </Section>

          <Section title="9. Termination">
            We reserve the right to suspend or terminate accounts that violate these terms. You may delete your account at any time by contacting support.
          </Section>

          <Section title="10. Changes">
            We may modify these terms at any time. Continued use of the service after changes constitutes acceptance of the updated terms.
          </Section>

          <Section title="11. Third-Party Platforms">
            AuditPro is an independent product and is not affiliated with, endorsed by, or sponsored by Instagram (Meta Platforms, Inc.), TikTok (ByteDance Ltd.), X/Twitter (X Corp.), or any of their parent companies. All platform names and trademarks belong to their respective owners.
          </Section>

          <Section title="12. Contact">
            Questions about these terms? Email <a href="mailto:support@socialmediaaudittool.online" className="text-[#1de4c3] hover:underline">support@socialmediaaudittool.online</a>.
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
