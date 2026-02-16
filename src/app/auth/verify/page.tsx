export default function VerifyPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm text-center">
        <div className="w-16 h-16 rounded-full bg-[#0d9488]/15 flex items-center justify-center mx-auto mb-6">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1de4c3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2"/>
            <path d="M22 7l-10 6L2 7"/>
          </svg>
        </div>
        <h1 className="text-xl font-bold mb-2">Check your email</h1>
        <p className="text-sm text-gray-400 mb-6">
          We sent a magic link to your inbox. Click the link to sign in.
        </p>
        <p className="text-xs text-gray-600">
          Didn&apos;t receive it? Check spam or{" "}
          <a href="/auth/signin" className="text-[#1de4c3] hover:underline">try again</a>.
        </p>
      </div>
    </main>
  );
}
