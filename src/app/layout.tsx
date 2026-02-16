import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AuditPro — Free Social Media Audit Tool",
  description:
    "Audit your Instagram, TikTok, or X account in 60 seconds. Get a health score, engagement analysis, and AI-powered suggestions.",
  keywords: [
    "social media audit tool",
    "instagram audit",
    "tiktok analytics",
    "social media health check",
    "engagement rate calculator",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=DM+Sans:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
