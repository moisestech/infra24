
export const advancedAiFilmmakingCurriculum = {
  title: "Advanced AI Filmmaking",
  icon: "Film",
  progress: 0.1, // 10% complete (mock)
  description: "Master advanced AI cinematography techniques for Hollywood-level production.",
  courses: [
    {
      title: "Advanced AI Cinematography",
      icon: "BookOpen",
      progress: 0.2,
      description: "Learn professional AI cinematography techniques and workflows.",
      weeks: [
        {
          title: "Week 1",
          icon: "Calendar",
          progress: 0.3,
          description: "Advanced AI camera movement and composition techniques.",
          estimatedTime: 240, // minutes
          days: [
            {
              title: "Day 1",
              icon: "Layers",
              progress: 1,
              estimatedTime: 120,
              description: "Introduction to advanced AI cinematography.",
              lessons: [
                {
                  title: "Advanced AI Cinematography",
                  icon: "Camera",
                  progress: 1,
                  estimatedTime: 90,
                  description: "Master advanced AI camera movement and composition.",
                  prerequisites: [],
                  chapters: [
                    {
                      title: "Advanced AI Cinematography",
                      icon: "CheckCircle",
                      slug: "01-advanced-ai-cinematography",
                      mdx: "content/workshops/advanced-ai-filmmaking/chapters/01-advanced-ai-cinematography.md",
                      progress: 1,
                      estimatedTime: 90,
                      locked: false,
                      prerequisites: [],
                      description: "Learn professional AI cinematography techniques for Hollywood-level production."
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

export type AdvancedAiFilmmakingCurriculum = typeof advancedAiFilmmakingCurriculum; 