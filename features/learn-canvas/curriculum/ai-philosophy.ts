export const aiPhilosophyCurriculum = {
  title: "AI Philosophy",
  icon: "Brain",
  progress: 0.1, // 10% complete (mock)
  description: "Explore the fundamental questions at the intersection of artificial intelligence and philosophy.",
  courses: [
    {
      title: "AI Philosophy Fundamentals",
      icon: "BookOpen",
      progress: 0.2,
      description: "Master the philosophical frameworks for understanding AI and its implications.",
      weeks: [
        {
          title: "Week 1",
          icon: "Calendar",
          progress: 0.3,
          description: "Introduction to AI philosophy and fundamental questions.",
          estimatedTime: 180, // minutes
          days: [
            {
              title: "Day 1",
              icon: "Layers",
              progress: 1,
              estimatedTime: 90,
              description: "Introduction to AI philosophy fundamentals.",
              lessons: [
                {
                  title: "Introduction to AI Philosophy",
                  icon: "Zap",
                  progress: 1,
                  estimatedTime: 45,
                  description: "Learn the basics of AI philosophy and fundamental questions.",
                  prerequisites: [],
                  chapters: [
                    {
                      title: "Introduction to AI Philosophy",
                      icon: "CheckCircle",
                      slug: "01-introduction-to-ai-philosophy",
                      mdx: "content/workshops/ai-philosophy/chapters/01-introduction-to-ai-philosophy.md",
                      progress: 1,
                      estimatedTime: 45,
                      locked: false,
                      prerequisites: [],
                      description: "Explore the big questions at the intersection of artificial intelligence and philosophy."
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

export type AiPhilosophyCurriculum = typeof aiPhilosophyCurriculum; 