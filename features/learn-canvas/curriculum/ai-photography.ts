
export const aiPhotographyCurriculum = {
  title: "AI Photography",
  icon: "Camera",
  progress: 0.1, // 10% complete (mock)
  description: "Master AI tools for photography enhancement and creative editing.",
  courses: [
    {
      title: "AI Photography Fundamentals",
      icon: "BookOpen",
      progress: 0.2,
      description: "Learn AI-powered photography techniques and workflows.",
      weeks: [
        {
          title: "Week 1",
          icon: "Calendar",
          progress: 0.3,
          description: "Introduction to AI in photography.",
          estimatedTime: 160, // minutes
          days: [
            {
              title: "Day 1",
              icon: "Layers",
              progress: 1,
              estimatedTime: 80,
              description: "Introduction to AI photography techniques.",
              lessons: [
                {
                  title: "Introduction to AI Photography",
                  icon: "Image",
                  progress: 1,
                  estimatedTime: 40,
                  description: "Learn the basics of AI in photography.",
                  prerequisites: [],
                  chapters: [
                    {
                      title: "Introduction to AI Photography",
                      icon: "CheckCircle",
                      slug: "01-introduction-to-ai-photography",
                      mdx: "content/workshops/ai-photography/chapters/01-introduction-to-ai-photography.md",
                      progress: 1,
                      estimatedTime: 40,
                      locked: false,
                      prerequisites: [],
                      description: "Discover how AI is transforming photography from capture to creative editing."
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

export type AiPhotographyCurriculum = typeof aiPhotographyCurriculum; 