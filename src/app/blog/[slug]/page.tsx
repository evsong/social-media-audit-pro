import { notFound } from "next/navigation";

const posts: Record<string, { title: string; date: string; sections: { heading?: string; paragraphs: string[] }[] }> = {
  "what-is-social-media-audit": {
    title: "What Is a Social Media Audit and Why You Need One",
    date: "Feb 20, 2026",
    sections: [
      { paragraphs: ["A social media audit is a systematic review of your social media profiles, content performance, and audience engagement. It helps you understand what's working, what's not, and where to focus your efforts for maximum growth."] },
      { heading: "Why Run a Social Media Audit?", paragraphs: ["Whether you're a solo creator or managing a brand, regular audits help you stay on track. Without one, you're essentially posting blind — hoping something sticks without data to back your decisions."] },
      { heading: "What Does an Audit Cover?", paragraphs: ["A thorough social media audit examines several key areas: profile completeness, engagement rate compared to industry benchmarks, content mix balance across photos, videos, and stories, posting consistency, and growth trajectory."] },
      { heading: "How Often Should You Audit?", paragraphs: ["We recommend running an audit at least once a month. This gives you enough data to spot trends without being overwhelmed by daily fluctuations. If you're running a campaign, audit before and after to measure impact."] },
      { heading: "How AuditPro Makes It Easy", paragraphs: ["Traditionally, social media audits required spreadsheets, manual data collection, and hours of analysis. AuditPro automates the entire process — just enter your username and get a comprehensive report in 60 seconds.", "Your report includes a health score out of 100, letter grades for each category, and actionable suggestions. Pro users also get AI-powered deep insights and growth trend tracking."] },
    ],
  },
  "improve-engagement-rate": {
    title: "5 Proven Ways to Improve Your Engagement Rate",
    date: "Feb 20, 2026",
    sections: [
      { paragraphs: ["Engagement rate is one of the most important metrics for any social media account. It measures how actively your audience interacts with your content through likes, comments, shares, and saves."] },
      { heading: "1. Post at Optimal Times", paragraphs: ["Timing matters more than most people think. Posting when your audience is most active gives your content the best chance of being seen. AuditPro's Best Time to Post feature analyzes your audience activity patterns to recommend ideal posting windows."] },
      { heading: "2. Use Strong Hooks in the First 3 Seconds", paragraphs: ["Whether it's a video thumbnail, the first line of a caption, or the opening frame of a Reel, you need to grab attention immediately. Questions, bold statements, and unexpected visuals all work well."] },
      { heading: "3. Encourage Saves and Shares", paragraphs: ["Likes are nice, but saves and shares carry more weight in most algorithms. Create content that people want to reference later — tips, tutorials, checklists, and infographics tend to get saved more."] },
      { heading: "4. Respond to Every Comment", paragraphs: ["Engagement is a two-way street. When you reply to comments, you build community and signal to the algorithm that your post is generating conversation. Try to respond within the first hour."] },
      { heading: "5. Diversify Your Content Format", paragraphs: ["Don't rely on a single content type. Mix photos, carousels, short-form video, and stories. Each format reaches different segments of your audience and keeps your feed fresh."] },
    ],
  },
  "instagram-vs-tiktok-2026": {
    title: "Instagram vs TikTok in 2026: Where Should You Focus?",
    date: "Feb 20, 2026",
    sections: [
      { paragraphs: ["The debate between Instagram and TikTok continues to evolve. Both platforms have made significant changes, and the right choice depends on your goals, audience, and content style."] },
      { heading: "Audience Demographics", paragraphs: ["TikTok still skews younger, with the strongest user base in the 16–30 age range. Instagram has broadened its appeal and now reaches a wider demographic, making it better for brands targeting 25–45 year olds."] },
      { heading: "Content Format", paragraphs: ["TikTok remains video-first. Instagram has become more balanced — Reels compete with carousels and photo posts, and the algorithm now gives more weight to all formats."] },
      { heading: "Organic Reach", paragraphs: ["TikTok still offers better organic reach for new accounts. The For You Page can surface content from accounts with zero followers. Instagram's Explore page has improved, but established accounts still have an advantage."] },
      { heading: "Monetization", paragraphs: ["Instagram offers more mature monetization: shopping integration, affiliate tools, and brand partnerships. TikTok's Creator Fund has evolved, but per-view payouts remain lower."] },
      { heading: "Our Recommendation", paragraphs: ["Don't choose one — use both strategically. Create native content for each platform rather than cross-posting. Use TikTok for discovery and audience building, Instagram for deeper engagement and monetization."] },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(posts).map((slug) => ({ slug }));
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = posts[slug];
  if (!post) notFound();

  return (
    <main className="pt-24 pb-16 max-w-2xl mx-auto px-6">
      <a href="/blog" className="text-sm text-gray-400 hover:text-white transition mb-6 inline-block">&larr; Back to Blog</a>
      <time className="text-xs text-gray-500 block mb-2">{post.date}</time>
      <h1 className="text-3xl font-bold mb-8">{post.title}</h1>
      <div className="space-y-6">
        {post.sections.map((s, i) => (
          <section key={i}>
            {s.heading && <h2 className="font-semibold text-lg mb-3">{s.heading}</h2>}
            {s.paragraphs.map((p, j) => (
              <p key={j} className="text-gray-300 text-sm leading-relaxed mb-3">{p}</p>
            ))}
          </section>
        ))}
      </div>
    </main>
  );
}
