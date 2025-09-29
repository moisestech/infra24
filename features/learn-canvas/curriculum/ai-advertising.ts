
export const aiAdvertisingCurriculum = {
  title: "AI Advertising",
  icon: "Megaphone",
  progress: 0.1, // 10% complete (mock)
  description: "Create effective AI-powered advertising campaigns and content.",
  courses: [
    {
      title: "AI Advertising Fundamentals",
      icon: "BookOpen",
      progress: 0.2,
      description: "Master AI tools for creative advertising and campaign optimization.",
      weeks: [
        {
          title: "Week 1",
          icon: "Calendar",
          progress: 0.3,
          description: "Introduction to AI in advertising.",
          estimatedTime: 280, // minutes
          days: [
            {
              title: "Day 1",
              icon: "Layers",
              progress: 1,
              estimatedTime: 140,
              description: "Introduction to AI advertising techniques.",
              lessons: [
                {
                  title: "AI-Powered Advertising Fundamentals",
                  icon: "Target",
                  progress: 1,
                  estimatedTime: 70,
                  description: "Learn the fundamentals of AI in advertising.",
                  prerequisites: [],
                  chapters: [
                    {
                      title: "AI-Powered Advertising Fundamentals",
                      icon: "CheckCircle",
                      slug: "01-ai-powered-advertising-fundamentals",
                      mdx: "content/workshops/ai-advertising/chapters/01-ai-powered-advertising-fundamentals.md",
                      progress: 1,
                      estimatedTime: 70,
                      locked: false,
                      prerequisites: [],
                      description: "Explore how AI is revolutionizing advertising from concept to campaign optimization."
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

export type AiAdvertisingCurriculum = typeof aiAdvertisingCurriculum; 