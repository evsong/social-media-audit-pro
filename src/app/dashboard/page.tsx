import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/auth/signin");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  const audits = await prisma.auditReport.findMany({
    where: { userId: user?.id },
    orderBy: { createdAt: "desc" },
    take: 20,
    select: { id: true, platform: true, username: true, healthScore: true, createdAt: true },
  });

  const plan = user?.plan ?? "FREE";
  const limits: Record<string, number> = { FREE: 3, PRO: 30, AGENCY: 999 };
  const thisMonth = audits.filter(a => {
    const d = new Date(a.createdAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  return (
    <main className="pt-24 pb-16 max-w-4xl mx-auto px-6">
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>

      {/* Plan & Usage */}
      <div className="grid md:grid-cols-3 gap-4 mb-10">
        <StatCard label="Plan" value={plan} />
        <StatCard label="Audits this month" value={`${thisMonth} / ${limits[plan] ?? 3}`} />
        <StatCard label="Total audits" value={String(audits.length)} />
      </div>

      {/* Audit History */}
      <h2 className="font-semibold text-lg mb-4">Recent Audits</h2>
      {audits.length === 0 ? (
        <div className="bg-[rgba(255,255,255,0.04)] border border-white/10 rounded-2xl p-8 text-center">
          <p className="text-gray-400 mb-4">No audits yet.</p>
          <a href="/" className="px-4 py-2 bg-[#0d9488] hover:bg-[#0f766e] rounded-lg text-white text-sm font-medium transition">
            Run your first audit
          </a>
        </div>
      ) : (
        <div className="space-y-3">
          {audits.map(a => (
            <a key={a.id} href={`/audit/${a.platform}/${a.username}`}
              className="flex items-center justify-between bg-[rgba(255,255,255,0.04)] border border-white/10 rounded-xl px-5 py-4 hover:border-white/20 transition">
              <div className="flex items-center gap-3">
                <span className="text-xs uppercase text-[#1de4c3] font-semibold w-16">{a.platform}</span>
                <span className="text-sm">@{a.username}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold">{a.healthScore}/100</span>
                <span className="text-xs text-gray-500">{new Date(a.createdAt).toLocaleDateString()}</span>
              </div>
            </a>
          ))}
        </div>
      )}
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[rgba(255,255,255,0.04)] border border-white/10 rounded-xl p-5">
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  );
}
