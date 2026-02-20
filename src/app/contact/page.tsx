import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — AuditPro",
  description: "Get in touch with the AuditPro team.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen pt-24 pb-20">
      <div className="max-w-2xl mx-auto px-6">
        <h1 className="font-extrabold text-4xl mb-3">Contact Us</h1>
        <p className="text-gray-400 mb-10">
          Have a question, feedback, or need help? We&apos;d love to hear from you.
        </p>

        <div className="space-y-6">
          <Card icon="✉" title="Email" href="mailto:support@socialmediaaudittool.online">
            support@socialmediaaudittool.online
          </Card>
          <Card icon="⏱" title="Response Time">
            We typically respond within 24 hours on business days.
          </Card>
          <Card icon="💡" title="Feature Requests">
            Have an idea for AuditPro? Send us an email with the subject
            &quot;Feature Request&quot; and we&apos;ll review it.
          </Card>
        </div>
      </div>
    </main>
  );
}

function Card({ icon, title, href, children }: {
  icon: string; title: string; href?: string; children: React.ReactNode;
}) {
  return (
    <div className="bg-[rgba(255,255,255,0.04)] border border-white/10 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-2">
        <span>{icon}</span>
        <h2 className="font-semibold text-lg">{title}</h2>
      </div>
      {href ? (
        <a href={href} className="text-[#1de4c3] hover:underline text-sm">{children}</a>
      ) : (
        <p className="text-gray-400 text-sm">{children}</p>
      )}
    </div>
  );
}
