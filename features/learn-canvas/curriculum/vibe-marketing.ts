export const vibeMarketingCurriculum = {
  title: "Vibe Marketing",
  icon: "TrendingUp",
  progress: 0.1, // 10% complete (mock)
  description: "Learn to create emotional connections with audiences using AI-powered vibe marketing techniques.",
  courses: [
    {
      title: "Vibe Marketing Fundamentals",
      icon: "BookOpen",
      progress: 0.2,
      description: "Master the art of emotional branding and AI-powered audience engagement.",
      weeks: [
        {
          title: "Week 1",
          icon: "Calendar",
          progress: 0.3,
          description: "Introduction to vibe marketing and emotional branding.",
          estimatedTime: 180, // minutes
          days: [
            {
              title: "Day 1",
              icon: "Layers",
              progress: 1,
              estimatedTime: 90,
              description: "Introduction to vibe marketing fundamentals.",
              lessons: [
                {
                  title: "Introduction to Vibe Marketing",
                  icon: "Zap",
                  progress: 1,
                  estimatedTime: 45,
                  description: "Learn the basics of vibe marketing and emotional branding.",
                  prerequisites: [],
                  chapters: [
                    {
                      title: "Introduction to Vibe Marketing",
                      icon: "CheckCircle",
                      slug: "01-introduction-to-vibe-marketing",
                      mdx: "content/workshops/vibe-marketing/chapters/01-introduction-to-vibe-marketing.md",
                      progress: 1,
                      estimatedTime: 45,
                      locked: false,
                      prerequisites: [],
                      description: "Discover how brands use AI and creative technology to build emotional connections with audiences."
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

export type VibeMarketingCurriculum = typeof vibeMarketingCurriculum; 