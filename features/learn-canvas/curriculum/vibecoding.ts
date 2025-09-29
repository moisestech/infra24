
export const vibecodingCurriculum = {
  title: "VibeCoding: AI-Assisted Development",
  icon: 'BookOpen',
  progress: 0,
  description: "Learn to code with AI assistance in a more intuitive, creative way. Discover how to leverage AI tools for faster, more efficient development workflows.",
  weeks: [
    {
      title: "Week 1: Introduction to AI-Assisted Development",
      icon: 'Calendar',
      progress: 0,
      description: "Explore the future of programming with AI and set up your AI development environment.",
      days: [
        {
          title: "Day 1: The Future of Programming with AI",
          icon: 'Layers',
          progress: 0,
          estimatedTime: 60,
          description: "How AI is transforming software development.",
          lessons: [
            {
              title: "The Future of Programming with AI",
              icon: 'FileText',
              progress: 0,
              estimatedTime: 60,
              description: "Introduction to AI-assisted development and the VibeCoding philosophy.",
              prerequisites: [],
              chapters: [
                {
                  title: "The Future of Programming with AI",
                  icon: 'CheckCircle',
                  slug: "01-the-future-of-programming-with-ai",
                  mdx: "content/workshops/vibecoding/chapters/01-the-future-of-programming-with-ai.md",
                  progress: 0,
                  estimatedTime: 60,
                  locked: false,
                  prerequisites: [],
                  description: "How AI is changing the way we code."
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

export type VibecodingCurriculum = typeof vibecodingCurriculum; 