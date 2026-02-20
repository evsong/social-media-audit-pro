import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — AuditPro",
  description: "Tips, guides, and insights on social media growth and optimization.",
};

const posts = [
  {
    slug: "what-is-social-media-audit",
    title: "What Is a Social Media Audit and Why You Need One",
    excerpt: "A social media audit reviews your profiles, content, and metrics to find what's working and what needs improvement. Here's why every creator and brand should do one regularly.",
    date: "Feb 20, 2026",
  },
  {
    slug: "improve-engagement-rate",
    title: "5 Proven Ways to Improve Your Engagement Rate",
    excerpt: "Low engagement? These five strategies — from posting timing to content format — can help you boost interactions without buying followers.",
    date: "Feb 20, 2026",
  },
  {
    slug: "instagram-vs-tiktok-2026",
    title: "Instagram vs TikTok in 2026: Where Should You Focus?",
    excerpt: "Both platforms have evolved significantly. We break down audience demographics, algorithm changes, and growth potential to help you decide.",
    date: "Feb 20, 2026",
  },
];

export default function BlogPage() {
  return (
    <main className="min-h-screen pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="font-extrabold text-4xl mb-3">Blog</h1>
        <p className="text-gray-400 mb-12">Tips and insights on social media growth.</p>

        <div className="space-y-8">
          {posts.map((post) => (
            <article key={post.slug} className="bg-[rgba(255,255,255,0.04)] border border-white/10 rounded-2xl p-6 hover:border-[#0d9488]/30 transition">
              <time className="text-xs text-gray-500">{post.date}</time>
              <h2 className="font-semibold text-xl mt-1 mb-2">{post.title}</h2>
              <p className="text-gray-400 text-sm leading-relaxed">{post.excerpt}</p>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
