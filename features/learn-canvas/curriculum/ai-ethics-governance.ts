export const aiEthicsGovernanceCurriculum = {
  title: "AI Ethics & Governance",
  icon: "Shield",
  progress: 0.1, // 10% complete (mock)
  description: "Learn the core principles and frameworks for responsible AI development and deployment.",
  courses: [
    {
      title: "AI Ethics & Governance Fundamentals",
      icon: "BookOpen",
      progress: 0.2,
      description: "Master ethical principles, governance frameworks, and best practices for responsible AI.",
      weeks: [
        {
          title: "Week 1",
          icon: "Calendar",
          progress: 0.3,
          description: "Introduction to AI ethics and governance frameworks.",
          estimatedTime: 180, // minutes
          days: [
            {
              title: "Day 1",
              icon: "Layers",
              progress: 1,
              estimatedTime: 90,
              description: "Introduction to AI ethics and governance fundamentals.",
              lessons: [
                {
                  title: "Introduction to AI Ethics & Governance",
                  icon: "Zap",
                  progress: 1,
                  estimatedTime: 45,
                  description: "Learn the basics of AI ethics and governance principles.",
                  prerequisites: [],
                  chapters: [
                    {
                      title: "Introduction to AI Ethics & Governance",
                      icon: "CheckCircle",
                      slug: "01-introduction-to-ai-ethics",
                      mdx: "content/workshops/ai-ethics-governance/chapters/01-introduction-to-ai-ethics.md",
                      progress: 1,
                      estimatedTime: 45,
                      locked: false,
                      prerequisites: [],
                      description: "Introduces the core principles and frameworks for responsible AI development and deployment."
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

export type AiEthicsGovernanceCurriculum = typeof aiEthicsGovernanceCurriculum; 