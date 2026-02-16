import { NextRequest, NextResponse } from "next/server";

const RAPIDAPI_HOST = "tiktok-api23.p.rapidapi.com";

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get("u") || "khaby.lame";
  const key = process.env.RAPIDAPI_KEY;
  if (!key) return NextResponse.json({ error: "no key" });

  // Step 1: get secUid
  const infoRes = await fetch(
    `https://${RAPIDAPI_HOST}/api/user/info?uniqueId=${encodeURIComponent(username)}`,
    { headers: { "x-rapidapi-key": key, "x-rapidapi-host": RAPIDAPI_HOST } }
  );
  const infoData = await infoRes.json();
  const secUid = infoData?.userInfo?.user?.secUid;

  if (!secUid) return NextResponse.json({ error: "no secUid", infoKeys: Object.keys(infoData || {}) });

  // Step 2: get posts with secUid
  const postsUrl = `https://${RAPIDAPI_HOST}/api/user/posts?secUid=${encodeURIComponent(secUid)}&count=3`;
  const postsRes = await fetch(postsUrl, {
    headers: { "x-rapidapi-key": key, "x-rapidapi-host": RAPIDAPI_HOST },
  });
  const postsData = await postsRes.json();

  return NextResponse.json({
    secUid: secUid.slice(0, 40) + "...",
    postsStatus: postsRes.status,
    postsKeys: Object.keys(postsData || {}),
    hasItemList: !!postsData?.itemList,
    itemCount: postsData?.itemList?.length ?? 0,
    rawSample: postsData?.itemList?.[0]
      ? { id: postsData.itemList[0].id, desc: (postsData.itemList[0].desc || "").slice(0, 50), stats: postsData.itemList[0].stats }
      : postsData,
  });
}
