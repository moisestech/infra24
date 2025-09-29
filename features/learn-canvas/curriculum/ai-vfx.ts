
export const aiVfxCurriculum = {
  title: "AI VFX",
  icon: "Zap",
  progress: 0.1, // 10% complete (mock)
  description: "Master AI-powered visual effects for film, TV, and games.",
  courses: [
    {
      title: "AI VFX Fundamentals",
      icon: "BookOpen",
      progress: 0.2,
      description: "Learn AI tools for compositing, rotoscoping, and effects creation.",
      weeks: [
        {
          title: "Week 1",
          icon: "Calendar",
          progress: 0.3,
          description: "Introduction to AI in visual effects.",
          estimatedTime: 200, // minutes
          days: [
            {
              title: "Day 1",
              icon: "Layers",
              progress: 1,
              estimatedTime: 100,
              description: "Introduction to AI VFX techniques.",
              lessons: [
                {
                  title: "Introduction to AI VFX",
                  icon: "Zap",
                  progress: 1,
                  estimatedTime: 50,
                  description: "Learn the basics of AI-powered visual effects.",
                  prerequisites: [],
                  chapters: [
                    {
                      title: "Introduction to AI VFX",
                      icon: "CheckCircle",
                      slug: "01-introduction-to-ai-vfx",
                      mdx: "content/workshops/ai-vfx/chapters/01-introduction-to-ai-vfx.md",
                      progress: 1,
                      estimatedTime: 50,
                      locked: false,
                      prerequisites: [],
                      description: "Discover how AI is revolutionizing visual effects for film, TV, and games."
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

export type AiVfxCurriculum = typeof aiVfxCurriculum; 