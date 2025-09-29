
export const llmFundamentalsCurriculum = {
  title: "LLM Fundamentals",
  icon: "Zap",
  progress: 0.1, // 10% complete (mock)
  description: "Master the fundamentals of large language models and their applications.",
  courses: [
    {
      title: "LLM Fundamentals",
      icon: "BookOpen",
      progress: 0.2,
      description: "Learn the basics of large language models and their capabilities.",
      weeks: [
        {
          title: "Week 1",
          icon: "Calendar",
          progress: 0.3,
          description: "Introduction to large language models.",
          estimatedTime: 220, // minutes
          days: [
            {
              title: "Day 1",
              icon: "Layers",
              progress: 1,
              estimatedTime: 110,
              description: "Introduction to LLM fundamentals.",
              lessons: [
                {
                  title: "Introduction to LLM Fundamentals",
                  icon: "Zap",
                  progress: 1,
                  estimatedTime: 55,
                  description: "Learn the basics of large language models.",
                  prerequisites: [],
                  chapters: [
                    {
                      title: "Introduction to LLM Fundamentals",
                      icon: "CheckCircle",
                      slug: "01-introduction-to-llms",
                      mdx: "content/workshops/llm-fundamentals/chapters/01-introduction-to-llms.md",
                      progress: 1,
                      estimatedTime: 55,
                      locked: false,
                      prerequisites: [],
                      description: "Understand what large language models are and how they work."
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

export type LlmFundamentalsCurriculum = typeof llmFundamentalsCurriculum; 