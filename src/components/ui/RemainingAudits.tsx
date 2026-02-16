export function RemainingAudits({ remaining, isAnonymous }: { remaining: number; isAnonymous: boolean }) {
  return (
    <div className="text-center text-sm text-gray-500">
      {isAnonymous ? (
        <p>{remaining > 0 ? `${remaining} free audit remaining today.` : "Daily limit reached."} <a href="/auth/signin" className="text-[#1de4c3] hover:underline">Sign up for more.</a></p>
      ) : (
        <p>{remaining} audits remaining this month</p>
      )}
    </div>
  );
}
