
export const aiArtFundamentalsCurriculum = {
  title: "AI Art Fundamentals",
  icon: 'Palette',
  progress: 0.2, // 20% complete (mock)
  description: "Master AI-powered digital art creation from foundational concepts to professional workflows.",
  weeks: [
    {
      title: "Week 1: Foundations & History",
      icon: 'Calendar',
      progress: 0.4,
      description: "Introduction to AI art concepts, history, and basic tools.",
      estimatedTime: 480, // minutes
      days: [
        {
          title: "Day 1: Course Overview & History",
          icon: 'Layers',
          progress: 0.6,
          estimatedTime: 240,
          description: "Welcome to AI art and understanding its historical context.",
          lessons: [
            {
              title: "Introduction to AI Art",
              icon: 'FileText',
              progress: 1,
              estimatedTime: 60,
              description: "Introduction to AI Art Fundamentals and course structure.",
              prerequisites: [],
              chapters: [
                {
                  title: "Introduction to AI Art",
                  icon: 'CheckCircle',
                  slug: "01-introduction-to-ai-art",
                  mdx: "content/workshops/ai-art-fundamentals/chapters/01-introduction-to-ai-art.md",
                  progress: 1,
                  estimatedTime: 60,
                  locked: false,
                  prerequisites: [],
                  description: "Course introduction, structure, and getting oriented with tools."
                }
              ]
            },
            {
              title: "The History of AI Art",
              icon: 'FileText',
              progress: 0.5,
              estimatedTime: 60,
              description: "Trace the evolution of AI in art and key milestones.",
              prerequisites: ["Introduction to AI Art"],
              chapters: [
                {
                  title: "The History of AI Art",
                  icon: 'PlayCircle',
                  slug: "02-the-history-of-ai-art",
                  mdx: "content/workshops/ai-art-fundamentals/chapters/02-the-history-of-ai-art.mdx",
                  progress: 0.5,
                  estimatedTime: 60,
                  locked: false,
                  prerequisites: ["01-introduction-to-ai-art"],
                  description: "Evolution from early computer art to modern AI tools."
                }
              ]
            },
            {
              title: "Key Concepts: Generative AI",
              icon: 'FileText',
              progress: 0,
              estimatedTime: 60,
              description: "Understanding the fundamentals of generative AI.",
              prerequisites: ["The History of AI Art"],
              chapters: [
                {
                  title: "Key Concepts: Generative AI",
                  icon: 'PlayCircle',
                  slug: "03-key-concepts-generative-ai",
                  mdx: "content/workshops/ai-art-fundamentals/chapters/03-key-concepts-generative-ai.mdx",
                  progress: 0,
                  estimatedTime: 60,
                  locked: false,
                  prerequisites: ["02-the-history-of-ai-art"],
                  description: "Core concepts behind AI art generation."
                }
              ]
            },
            {
              title: "Types of AI Art Tools",
              icon: 'FileText',
              progress: 0,
              estimatedTime: 60,
              description: "Overview of different AI art platforms and tools.",
              prerequisites: ["Key Concepts: Generative AI"],
              chapters: [
                {
                  title: "Types of AI Art Tools",
                  icon: 'PlayCircle',
                  slug: "04-types-of-ai-art-tools",
                  mdx: "content/workshops/ai-art-fundamentals/chapters/04-types-of-ai-art-tools.mdx",
                  progress: 0,
                  estimatedTime: 60,
                  locked: false,
                  prerequisites: ["03-key-concepts-generative-ai"],
                  description: "Exploring various AI art platforms and their capabilities."
                }
              ]
            }
          ]
        },
        {
          title: "Day 2: Setup & Basics",
          icon: 'Layers',
          progress: 0,
          estimatedTime: 240,
          description: "Setting up your workspace and learning prompt engineering basics.",
          lessons: [
            {
              title: "Setting Up Your Workspace",
              icon: 'FileText',
              progress: 0,
              estimatedTime: 60,
              description: "Configure your tools and environment for AI art creation.",
              prerequisites: ["Types of AI Art Tools"],
              chapters: [
                {
                  title: "Setting Up Your Workspace",
                  icon: 'PlayCircle',
                  slug: "05-setting-up-your-workspace",
                  mdx: "content/workshops/ai-art-fundamentals/chapters/05-setting-up-your-workspace.mdx",
                  progress: 0,
                  estimatedTime: 60,
                  locked: true,
                  prerequisites: ["04-types-of-ai-art-tools"],
                  description: "Configure your AI art tools and development environment."
                }
              ]
            },
            {
              title: "Prompt Engineering Basics",
              icon: 'FileText',
              progress: 0,
              estimatedTime: 60,
              description: "Learn the fundamentals of writing effective AI prompts.",
              prerequisites: ["Setting Up Your Workspace"],
              chapters: [
                {
                  title: "Prompt Engineering Basics",
                  icon: 'PlayCircle',
                  slug: "06-prompt-engineering-basics",
                  mdx: "content/workshops/ai-art-fundamentals/chapters/06-prompt-engineering-basics.mdx",
                  progress: 0,
                  estimatedTime: 60,
                  locked: true,
                  prerequisites: ["05-setting-up-your-workspace"],
                  description: "Master the art of writing prompts for consistent AI art results."
                }
              ]
            },
            {
              title: "Text-to-Image: How It Works",
              icon: 'FileText',
              progress: 0,
              estimatedTime: 60,
              description: "Understanding the technical process behind text-to-image generation.",
              prerequisites: ["Prompt Engineering Basics"],
              chapters: [
                {
                  title: "Text-to-Image: How It Works",
                  icon: 'PlayCircle',
                  slug: "07-text-to-image-how-it-works",
                  mdx: "content/workshops/ai-art-fundamentals/chapters/07-text-to-image-how-it-works.mdx",
                  progress: 0,
                  estimatedTime: 60,
                  locked: true,
                  prerequisites: ["06-prompt-engineering-basics"],
                  description: "Technical understanding of how AI generates images from text."
                }
              ]
            },
            {
              title: "Hands-On: Your First AI Image",
              icon: 'FileText',
              progress: 0,
              estimatedTime: 60,
              description: "Create your first AI-generated artwork.",
              prerequisites: ["Text-to-Image: How It Works"],
              chapters: [
                {
                  title: "Hands-On: Your First AI Image",
                  icon: 'PlayCircle',
                  slug: "08-hands-on-your-first-ai-image",
                  mdx: "content/workshops/ai-art-fundamentals/chapters/08-hands-on-your-first-ai-image.mdx",
                  progress: 0,
                  estimatedTime: 60,
                  locked: true,
                  prerequisites: ["07-text-to-image-how-it-works"],
                  description: "Practical exercise creating your first AI-generated image."
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

export type AiArtFundamentalsCurriculum = typeof aiArtFundamentalsCurriculum;
