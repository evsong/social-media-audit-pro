import type { PostData } from "../providers/types";

export interface TimeSlot {
  day: number; // 0=Sun, 6=Sat
  hour: number; // 0-23
  engagementScore: number; // relative, 0-1
  postCount: number;
}

export interface BestTimeResult {
  grid: number[][]; // 7×24, values 0-1 (normalized engagement)
  topSlots: { day: number; hour: number; label: string; score: number }[];
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function analyzeBestTimes(posts: PostData[]): BestTimeResult {
  // 7 days × 24 hours grid
  const engagementSum: number[][] = Array.from({ length: 7 }, () => Array(24).fill(0));
  const counts: number[][] = Array.from({ length: 7 }, () => Array(24).fill(0));

  for (const post of posts) {
    const date = new Date(post.timestamp);
    if (isNaN(date.getTime())) continue;
    const day = date.getUTCDay();
    const hour = date.getUTCHours();
    const engagement = post.likes + post.comments * 2 + (post.shares || 0) * 3;
    engagementSum[day][hour] += engagement;
    counts[day][hour] += 1;
  }

  // Average engagement per slot
  const avgGrid: number[][] = Array.from({ length: 7 }, () => Array(24).fill(0));
  let maxVal = 0;
  for (let d = 0; d < 7; d++) {
    for (let h = 0; h < 24; h++) {
      avgGrid[d][h] = counts[d][h] > 0 ? engagementSum[d][h] / counts[d][h] : 0;
      if (avgGrid[d][h] > maxVal) maxVal = avgGrid[d][h];
    }
  }

  // Normalize to 0-1
  const grid = avgGrid.map((row) => row.map((v) => (maxVal > 0 ? v / maxVal : 0)));

  // Top 3 slots
  const slots: { day: number; hour: number; score: number }[] = [];
  for (let d = 0; d < 7; d++) {
    for (let h = 0; h < 24; h++) {
      if (grid[d][h] > 0) slots.push({ day: d, hour: h, score: grid[d][h] });
    }
  }
  slots.sort((a, b) => b.score - a.score);

  const topSlots = slots.slice(0, 3).map((s) => ({
    ...s,
    label: `${DAY_NAMES[s.day]} ${s.hour.toString().padStart(2, "0")}:00`,
  }));

  return { grid, topSlots };
}
