import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { platform, username } = await req.json();

  if (!platform || !username) {
    return NextResponse.json({ error: "Missing platform or username" }, { status: 400 });
  }

  // TODO: Replace with real API calls to Instagram/TikTok/X
  const mockData = {
    platform,
    username: username.replace("@", ""),
    displayName: username.replace("@", ""),
    avatar: null,
    followers: 302000000,
    following: 214,
    posts: 1847,
    healthScore: 85,
    grades: {
      engagement: "A",
      postingFrequency: "A-",
      contentMix: "B+",
      bioCompleteness: "A",
      hashtagUsage: "B",
    },
    engagementRate: 4.2,
    industryBenchmark: 3.4,
    postsPerWeek: 4.8,
    contentMix: { reels: 45, photos: 30, carousels: 25 },
  };

  return NextResponse.json(mockData);
}
