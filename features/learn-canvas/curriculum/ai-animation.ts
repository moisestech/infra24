
export const aiAnimationCurriculum = {
  title: "AI Animation",
  icon: "Play",
  progress: 0.15, // 15% complete (mock)
  description: "Create studio-quality animation with AI tools and techniques.",
  courses: [
    {
      title: "AI Animation Fundamentals",
      icon: "BookOpen",
      progress: 0.2,
      description: "Learn the fundamentals of AI-powered animation.",
      weeks: [
        {
          title: "Week 1",
          icon: "Calendar",
          progress: 0.4,
          description: "Introduction to AI animation tools and techniques.",
          estimatedTime: 300, // minutes
          days: [
            {
              title: "Day 1",
              icon: "Layers",
              progress: 1,
              estimatedTime: 150,
              description: "Introduction to AI animation fundamentals.",
              lessons: [
                {
                  title: "AI Animation Fundamentals",
                  icon: "Zap",
                  progress: 1,
                  estimatedTime: 75,
                  description: "Learn the basics of AI-powered animation.",
                  prerequisites: [],
                  chapters: [
                    {
                      title: "AI Animation Fundamentals",
                      icon: "CheckCircle",
                      slug: "01-ai-animation-fundamentals",
                      mdx: "content/workshops/ai-animation/chapters/01-ai-animation-fundamentals.md",
                      progress: 1,
                      estimatedTime: 75,
                      locked: false,
                      prerequisites: [],
                      description: "Master AI-powered character design, rigging, and motion generation."
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

export type AiAnimationCurriculum = typeof aiAnimationCurriculum; 