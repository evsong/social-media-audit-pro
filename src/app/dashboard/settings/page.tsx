import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/auth/signin");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  return (
    <main className="pt-24 pb-16 max-w-2xl mx-auto px-6">
      <h1 className="text-2xl font-bold mb-8">Account Settings</h1>
      <div className="bg-[rgba(255,255,255,0.04)] border border-white/10 rounded-2xl p-6 space-y-5">
        <Field label="Email" value={session.user.email} />
        <Field label="Plan" value={user?.plan ?? "FREE"} />
        <Field label="Member since" value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"} />
      </div>
      <div className="mt-6">
        <a href="/dashboard" className="text-sm text-gray-400 hover:text-white transition">&larr; Back to Dashboard</a>
      </div>
    </main>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className="text-sm">{value}</div>
    </div>
  );
}
