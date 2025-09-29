
export const ethicalAiJournalismCurriculum = {
  title: "Ethical AI Journalism",
  icon: "Shield",
  progress: 0.2, // 20% complete (mock)
  description: "Learn to use AI responsibly in journalism while maintaining ethical standards and journalistic integrity.",
  courses: [
    {
      title: "Foundations of Ethical AI Journalism",
      icon: "BookOpen",
      progress: 0.3,
      description: "Build a strong foundation in ethical AI use for journalism.",
      weeks: [
        {
          title: "Week 1",
          icon: "Calendar",
          progress: 0.5,
          description: "Understanding AI bias and its impact on journalism.",
          estimatedTime: 180, // minutes
          days: [
            {
              title: "Day 1",
              icon: "Layers",
              progress: 1,
              estimatedTime: 90,
              description: "Introduction to AI bias and its implications for journalism.",
              lessons: [
                {
                  title: "Understanding AI Bias",
                  icon: "FileText",
                  progress: 1,
                  estimatedTime: 45,
                  description: "Learn to identify and understand AI bias in news content.",
                  prerequisites: [],
                  chapters: [
                    {
                      title: "Understanding AI Bias",
                      icon: "CheckCircle",
                      slug: "01-understanding-ai-bias",
                      mdx: "content/workshops/ethical-ai-journalism/chapters/01-understanding-ai-bias.md",
                      progress: 1,
                      estimatedTime: 45,
                      locked: false,
                      prerequisites: [],
                      description: "Identify common types of AI bias and their impact on journalism."
                    }
                  ]
                }
              ]
            },
            {
              title: "Day 2",
              icon: "Layers",
              progress: 0,
              estimatedTime: 90,
              description: "AI-powered fact-checking and verification techniques.",
              lessons: [
                {
                  title: "Fact-Checking with AI",
                  icon: "Search",
                  progress: 0,
                  estimatedTime: 45,
                  description: "Use AI tools for efficient and accurate fact-checking.",
                  prerequisites: ["Understanding AI Bias"],
                  chapters: [
                    {
                      title: "Fact-Checking with AI",
                      icon: "PlayCircle",
                      slug: "02-fact-checking-with-ai",
                      mdx: "content/workshops/ethical-ai-journalism/chapters/02-fact-checking-with-ai.md",
                      progress: 0,
                      estimatedTime: 45,
                      locked: false,
                      prerequisites: ["01-understanding-ai-bias"],
                      description: "Leverage AI for efficient fact-checking while maintaining accuracy."
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: "Week 2",
          icon: "Calendar",
          progress: 0,
          description: "Ethical guidelines and best practices for AI journalism.",
          estimatedTime: 120,
          days: [
            {
              title: "Day 1",
              icon: "Layers",
              progress: 0,
              estimatedTime: 120,
              description: "Developing ethical guidelines for AI use in journalism.",
              lessons: [
                {
                  title: "Ethical Guidelines for AI Journalism",
                  icon: "AlertTriangle",
                  progress: 0,
                  estimatedTime: 60,
                  description: "Create and follow ethical guidelines for AI use in journalism.",
                  prerequisites: ["Fact-Checking with AI"],
                  chapters: [
                    {
                      title: "Ethical Guidelines",
                      icon: "PlayCircle",
                      slug: "03-ethical-guidelines",
                      mdx: "content/workshops/ethical-ai-journalism/chapters/03-ethical-guidelines.md",
                      progress: 0,
                      estimatedTime: 60,
                      locked: false,
                      prerequisites: ["02-fact-checking-with-ai"],
                      description: "Develop comprehensive ethical guidelines for AI use in journalism."
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

export type EthicalAiJournalismCurriculum = typeof ethicalAiJournalismCurriculum; 