import type { GradeBreakdown } from "../scoring/types";

const templates: Record<string, Record<string, string>> = {
  engagement: {
    D: "Your engagement rate is below average. Try asking questions in captions and responding to comments within the first hour.",
    C: "Your engagement rate is below average. Try asking questions in captions and responding to comments within the first hour.",
    B: "Your engagement is decent. Consider using more interactive content like polls, quizzes, or carousel posts.",
  },
  frequency: {
    D: "You're posting less than once a week. Aim for at least 3 posts per week to stay visible in the algorithm.",
    C: "Increase your posting frequency. 3-4 times per week is the sweet spot for most accounts.",
  },
  contentMix: {
    C: "You're only using one content type. Mix in Reels, carousels, and Stories to reach different audience segments.",
  },
  bio: {
    D: "Your profile is incomplete. Add a bio, profile picture, and link to improve discoverability.",
    C: "Your profile is incomplete. Add a bio, profile picture, and link to improve discoverability.",
  },
  hashtags: {
    D: "You're not using hashtags. Add 5-15 relevant hashtags per post to increase reach.",
    C: "You're using too many hashtags. Focus on 5-15 highly relevant ones instead of 30+.",
  },
};

export function generateTemplateSuggestions(grades: GradeBreakdown): string[] {
  const suggestions: string[] = [];

  for (const [dimension, gradeTemplates] of Object.entries(templates)) {
    const grade = grades[dimension as keyof GradeBreakdown]?.grade;
    if (!grade) continue;

    const letter = grade.charAt(0); // A, B, C, D
    if (letter === "A") continue; // No suggestions for A grades

    const template = gradeTemplates[letter] || gradeTemplates[grade];
    if (template) suggestions.push(template);
  }

  if (suggestions.length === 0) {
    suggestions.push(
      "Great job! Your account is performing well across all dimensions. Keep up the consistency and experiment with new content formats to stay ahead."
    );
  }

  return suggestions;
}
