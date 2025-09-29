export const aiSocialImpactCurriculum = {
  title: "AI Social Impact",
  icon: "Heart",
  progress: 0.1, // 10% complete (mock)
  description: "Learn how artificial intelligence is shaping society and creating positive social change.",
  courses: [
    {
      title: "AI Social Impact Fundamentals",
      icon: "BookOpen",
      progress: 0.2,
      description: "Master the principles of using AI for social good and community impact.",
      weeks: [
        {
          title: "Week 1",
          icon: "Calendar",
          progress: 0.3,
          description: "Introduction to AI for social impact and community-driven projects.",
          estimatedTime: 180, // minutes
          days: [
            {
              title: "Day 1",
              icon: "Layers",
              progress: 1,
              estimatedTime: 90,
              description: "Introduction to AI social impact fundamentals.",
              lessons: [
                {
                  title: "Introduction to AI Social Impact",
                  icon: "Zap",
                  progress: 1,
                  estimatedTime: 45,
                  description: "Learn the basics of AI for social good and community impact.",
                  prerequisites: [],
                  chapters: [
                    {
                      title: "Introduction to AI Social Impact",
                      icon: "CheckCircle",
                      slug: "01-introduction-to-ai-social-impact",
                      mdx: "content/workshops/ai-social-impact/chapters/01-introduction-to-ai-social-impact.md",
                      progress: 1,
                      estimatedTime: 45,
                      locked: false,
                      prerequisites: [],
                      description: "Explore how artificial intelligence is shaping society and creating positive social change."
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

export type AiSocialImpactCurriculum = typeof aiSocialImpactCurriculum; 