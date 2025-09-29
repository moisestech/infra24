
export const aiGameDevelopmentCurriculum = {
  title: "AI Game Development",
  icon: "Gamepad",
  progress: 0.1, // 10% complete (mock)
  description: "Create intelligent games with AI-powered NPCs and procedural content.",
  courses: [
    {
      title: "AI Game Development Fundamentals",
      icon: "BookOpen",
      progress: 0.2,
      description: "Learn AI techniques for game design and development.",
      weeks: [
        {
          title: "Week 1",
          icon: "Calendar",
          progress: 0.3,
          description: "Introduction to AI in game development.",
          estimatedTime: 240, // minutes
          days: [
            {
              title: "Day 1",
              icon: "Layers",
              progress: 1,
              estimatedTime: 120,
              description: "Introduction to AI game development techniques.",
              lessons: [
                {
                  title: "Introduction to AI Game Development",
                  icon: "Zap",
                  progress: 1,
                  estimatedTime: 60,
                  description: "Learn the basics of AI in game development.",
                  prerequisites: [],
                  chapters: [
                    {
                      title: "Introduction to AI Game Development",
                      icon: "CheckCircle",
                      slug: "01-introduction-to-ai-game-dev",
                      mdx: "content/workshops/ai-game-development/chapters/01-introduction-to-ai-game-dev.md",
                      progress: 1,
                      estimatedTime: 60,
                      locked: false,
                      prerequisites: [],
                      description: "Discover how AI is revolutionizing game design with smart NPCs and procedural content."
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

export type AiGameDevelopmentCurriculum = typeof aiGameDevelopmentCurriculum; 