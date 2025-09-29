export const aiFilmmakingCurriculum = {
  title: "AI Filmmaking",
  icon: "Film",
  progress: 0.3, // 30% complete (mock)
  description: "Master the art and technology of AI-powered filmmaking, from script to screen.",
  courses: [
    {
      title: "Foundations of AI Filmmaking",
      icon: "BookOpen",
      progress: 0.5,
      description: "Start your journey with the basics of AI in film production.",
      weeks: [
        {
          title: "Week 1",
          icon: "Calendar",
          progress: 0.7,
          description: "Introduction to AI tools and workflows in filmmaking.",
          estimatedTime: 300, // minutes
          days: [
            {
              title: "Day 1",
              icon: "Layers",
              progress: 1,
              estimatedTime: 120,
              description: "Kickoff and overview of AI in film production.",
              lessons: [
                {
                  title: "Introduction to AI in Film Production",
                  icon: "FileText",
                  progress: 1,
                  estimatedTime: 60,
                  description: "Explore the impact of AI on the film industry.",
                  prerequisites: [],
                  chapters: [
                    {
                      title: "Understanding AI in Film Production",
                      icon: "CheckCircle",
                      slug: "01-understanding-ai-in-film-production",
                      mdx: "content/workshops/ai-filmmaking/chapters/01-understanding-ai-in-film-production.md",
                      progress: 1,
                      estimatedTime: 30,
                      locked: false,
                      prerequisites: [],
                      description: "What is AI filmmaking? Key concepts and industry impact."
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
              description: "Hands-on with AI scriptwriting tools.",
              lessons: [
                {
                  title: "AI Tools for Scriptwriting",
                  icon: "FileText",
                  progress: 0,
                  estimatedTime: 45,
                  description: "Learn to use AI for script generation.",
                  prerequisites: ["Introduction to AI in Film Production"],
                  chapters: [
                    {
                      title: "Script Generation with AI",
                      icon: "PlayCircle",
                      slug: "02-script-generation-with-ai",
                      mdx: "content/workshops/ai-filmmaking/chapters/02-script-generation-with-ai.md",
                      progress: 0,
                      estimatedTime: 30,
                      locked: true,
                      prerequisites: ["01-understanding-ai-in-film-production"],
                      description: "Generate and analyze scripts using AI tools."
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
          description: "Visual storytelling and pre-visualization with AI.",
          estimatedTime: 240,
          days: [
            {
              title: "Day 1",
              icon: "Layers",
              progress: 0,
              estimatedTime: 120,
              description: "AI-powered storyboarding and visualization.",
              lessons: [
                {
                  title: "AI Storyboarding",
                  icon: "FileText",
                  progress: 0,
                  estimatedTime: 60,
                  description: "Create storyboards with AI image models.",
                  prerequisites: ["AI Tools for Scriptwriting"],
                  chapters: [
                    {
                      title: "Visual Pre-visualization with AI",
                      icon: "PlayCircle",
                      slug: "03-visual-previsualization-with-ai",
                      mdx: "content/workshops/ai-filmmaking/chapters/03-visual-previsualization-with-ai.md",
                      progress: 0,
                      estimatedTime: 30,
                      locked: true,
                      prerequisites: ["02-script-generation-with-ai"],
                      description: "Use AI to generate visual storyboards."
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

export type AiFilmmakingCurriculum = typeof aiFilmmakingCurriculum; 