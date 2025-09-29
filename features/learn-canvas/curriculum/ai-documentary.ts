
export const aiDocumentaryCurriculum = {
  title: "AI Documentary",
  icon: "Video",
  progress: 0.1, // 10% complete (mock)
  description: "Learn to use AI tools for documentary filmmaking and storytelling.",
  courses: [
    {
      title: "AI Documentary Fundamentals",
      icon: "BookOpen",
      progress: 0.2,
      description: "Master AI tools for documentary research, editing, and storytelling.",
      weeks: [
        {
          title: "Week 1",
          icon: "Calendar",
          progress: 0.3,
          description: "Introduction to AI in documentary filmmaking.",
          estimatedTime: 180, // minutes
          days: [
            {
              title: "Day 1",
              icon: "Layers",
              progress: 1,
              estimatedTime: 90,
              description: "Introduction to AI documentary techniques.",
              lessons: [
                {
                  title: "Introduction to AI Documentary",
                  icon: "Search",
                  progress: 1,
                  estimatedTime: 45,
                  description: "Learn the basics of AI in documentary filmmaking.",
                  prerequisites: [],
                  chapters: [
                    {
                      title: "Introduction to AI Documentary",
                      icon: "CheckCircle",
                      slug: "01-introduction-to-ai-documentary",
                      mdx: "content/workshops/ai-documentary/chapters/01-introduction-to-ai-documentary.md",
                      progress: 1,
                      estimatedTime: 45,
                      locked: false,
                      prerequisites: [],
                      description: "Discover how AI is transforming documentary research, editing, and storytelling."
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

export type AiDocumentaryCurriculum = typeof aiDocumentaryCurriculum; 