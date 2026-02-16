export function AccountCard({
  profile,
  platform,
}: {
  profile: {
    username: string;
    displayName: string;
    avatar: string;
    bio: string;
    followers: number;
    following: number;
    posts: number;
    isVerified: boolean;
  };
  platform: string;
}) {
  const platformBadge: Record<string, string> = {
    instagram: "Instagram",
    tiktok: "TikTok",
    x: "X / Twitter",
  };

  return (
    <div className="bg-[rgba(255,255,255,0.04)] backdrop-blur border border-white/10 rounded-2xl p-6 flex items-start gap-5">
      {profile.avatar ? (
        <img
          src={profile.avatar}
          alt={profile.displayName}
          className="w-16 h-16 rounded-full object-cover border-2 border-white/10"
        />
      ) : (
        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-2xl">
          {profile.displayName?.charAt(0) || "?"}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h2 className="font-bold text-lg truncate">{profile.displayName}</h2>
          {profile.isVerified && <span className="text-[#1de4c3] text-sm">✓</span>}
          <span className="px-2 py-0.5 rounded-full bg-[#0d9488]/20 text-[#1de4c3] text-xs font-medium">
            {platformBadge[platform] || platform}
          </span>
        </div>
        <p className="text-gray-500 text-sm mb-3">@{profile.username}</p>
        {profile.bio && <p className="text-gray-400 text-sm mb-3 line-clamp-2">{profile.bio}</p>}
        <div className="flex items-center gap-6 text-sm">
          <div><span className="font-semibold text-white">{formatNum(profile.followers)}</span> <span className="text-gray-500">followers</span></div>
          <div><span className="font-semibold text-white">{formatNum(profile.following)}</span> <span className="text-gray-500">following</span></div>
          <div><span className="font-semibold text-white">{formatNum(profile.posts)}</span> <span className="text-gray-500">posts</span></div>
        </div>
      </div>
    </div>
  );
}

function formatNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}
