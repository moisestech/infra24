export const aiVideoProductionCurriculum = {
  title: "AI Video Production",
  icon: "Film",
  progress: 0.0, // 0% complete - new workshop
  description: "From Deepfakes to Dream Machines - A Complete Guide to AI Video. Master the complete landscape of AI video technology in this comprehensive 3-hour intensive workshop.",
  courses: [
    {
      title: "AI Video Production",
      icon: "Zap",
      progress: 0.0,
      description: "Complete 3-hour intensive workshop covering history, platforms, techniques, and ethical considerations.",
      weeks: [
        {
          title: "AI Video Production",
          icon: "Calendar",
          progress: 0.0,
          description: "3-hour intensive AI video mastery workshop",
          estimatedTime: 210, // 3.5 hours in minutes
          days: [
            {
              title: "AI Video Production",
              icon: "Layers",
              progress: 0.0,
              estimatedTime: 210,
              description: "Complete AI video workshop from history to hands-on creation",
              lessons: [
                {
                  title: "AI Video Production",
                  icon: "FileText",
                  progress: 0.0,
                  estimatedTime: 210,
                  description: "Comprehensive 3-hour workshop covering all aspects of AI video technology",
                  prerequisites: [],
                  chapters: [
                    {
                      title: "The History of AI Video: From Deepfakes to Dream Machines",
                      icon: "Clock",
                      slug: "01-introduction-to-ai-video",
                      mdx: "content/workshops/ai-video-production/chapters/01-introduction-to-ai-video.md",
                      progress: 0,
                      estimatedTime: 25,
                      locked: false,
                      prerequisites: [],
                      description: "Complete evolution of AI video technology from 2017-2025, including deepfake controversy and ethical implications"
                    },
                    {
                      title: "The AI Video Platform Landscape: Tools, Pricing, and Quality",
                      icon: "Layers",
                      slug: "02-ai-video-platform-landscape",
                      mdx: "content/workshops/ai-video-production/chapters/02-ai-video-platform-landscape.md",
                      progress: 0,
                      estimatedTime: 30,
                      locked: true,
                      prerequisites: ["01-introduction-to-ai-video"],
                      description: "Comprehensive overview of all major AI video platforms, pricing analysis, and quality expectations"
                    },
                    {
                      title: "Hands-On AI Video Creation: From Prompt to Production",
                      icon: "Play",
                      slug: "03-hands-on-ai-video-creation",
                      mdx: "content/workshops/ai-video-production/chapters/03-hands-on-ai-video-creation.md",
                      progress: 0,
                      estimatedTime: 35,
                      locked: true,
                      prerequisites: ["02-ai-video-platform-landscape"],
                      description: "Master prompt engineering, workflow optimization, and create your first AI videos"
                    },
                    {
                      title: "Ethical AI Video Creation: Responsible Use and Deepfake Awareness",
                      icon: "Shield",
                      slug: "04-ethical-ai-video-creation",
                      mdx: "content/workshops/ai-video-production/chapters/04-ethical-ai-video-creation.md",
                      progress: 0,
                      estimatedTime: 25,
                      locked: true,
                      prerequisites: ["03-hands-on-ai-video-creation"],
                      description: "Learn responsible AI video creation, deepfake detection, and ethical best practices"
                    },
                    {
                      title: "Advanced Techniques and Workflows: Professional AI Video Production",
                      icon: "Settings",
                      slug: "05-advanced-techniques-workflows",
                      mdx: "content/workshops/ai-video-production/chapters/05-advanced-techniques-workflows.md",
                      progress: 0,
                      estimatedTime: 30,
                      locked: true,
                      prerequisites: ["04-ethical-ai-video-creation"],
                      description: "Professional workflows, multi-tool integration, and advanced production techniques"
                    },
                    {
                      title: "Real-World Applications and Case Studies: AI Video in Action",
                      icon: "Globe",
                      slug: "06-real-world-applications",
                      mdx: "content/workshops/ai-video-production/chapters/06-real-world-applications.md",
                      progress: 0,
                      estimatedTime: 25,
                      locked: true,
                      prerequisites: ["05-advanced-techniques-workflows"],
                      description: "Explore real-world applications across industries and learn from successful case studies"
                    },
                    {
                      title: "The Future of AI Video: Trends, Predictions, and Opportunities",
                      icon: "Rocket",
                      slug: "07-future-of-ai-video",
                      mdx: "content/workshops/ai-video-production/chapters/07-future-of-ai-video.md",
                      progress: 0,
                      estimatedTime: 20,
                      locked: true,
                      prerequisites: ["06-real-world-applications"],
                      description: "Explore emerging trends, technological predictions, and future opportunities"
                    },
                    {
                      title: "AI Video in Gaming: From Cutscenes to Real-Time Generation",
                      icon: "Gamepad2",
                      slug: "09-ai-video-in-gaming",
                      mdx: "content/workshops/ai-video-production/chapters/09-ai-video-in-gaming.md",
                      progress: 0,
                      estimatedTime: 30,
                      locked: true,
                      prerequisites: ["07-future-of-ai-video"],
                      description: "Explore AI video applications in game development, from cutscenes to real-time character animation"
                    },
                    {
                      title: "Your AI Video Journey: Next Steps and Resources",
                      icon: "Compass",
                      slug: "08-your-ai-video-journey",
                      mdx: "content/workshops/ai-video-production/chapters/08-your-ai-video-journey.md",
                      progress: 0,
                      estimatedTime: 10,
                      locked: true,
                      prerequisites: ["09-ai-video-in-gaming"],
                      description: "Create your personal action plan and connect with the AI video community"
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

export type AiVideoProductionCurriculum = typeof aiVideoProductionCurriculum;
