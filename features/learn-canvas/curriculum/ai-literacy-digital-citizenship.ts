
export const aiLiteracyCurriculum = {
  title: "AI Literacy & Digital Citizenship",
  icon: 'BookOpen',
  description: "A 4-Week Immersive Journey Into Ethics, Media, and the Future of Intelligence",
  progress: 0,
  resources: [
    { type: "book", title: "Weapons of Math Destruction", author: "Cathy O’Neil", url: "https://womeninaiethics.org", description: "A critique of unregulated algorithms in society." },
    { type: "book", title: "Algorithms of Oppression", author: "Safiya Umoja Noble", url: "https://womeninaiethics.org", description: "Racial and gender bias in search engines." },
    { type: "book", title: "Race After Technology", author: "Ruha Benjamin", url: "https://womeninaiethics.org", description: "How tech can reinforce social inequity." },
    { type: "book", title: "Automating Inequality", author: "Virginia Eubanks", url: "https://womeninaiethics.org", description: "Data-driven algorithms and inequality." },
    { type: "book", title: "Technically Wrong", author: "Sara Wachter-Boettcher", url: "https://womeninaiethics.org", description: "Silicon Valley’s culture and exclusion in tech." },
    { type: "book", title: "Artificial Unintelligence", author: "Meredith Broussard", url: "https://womeninaiethics.org", description: "Limits of AI and technochauvinism." },
    { type: "book", title: "The Age of Surveillance Capitalism", author: "Shoshana Zuboff", url: "https://womeninaiethics.org", description: "How Big Tech monetizes personal data." },
    { type: "course", title: "Elements of AI", url: "https://www.elementsofai.com/", description: "Beginner-friendly online AI course." },
    { type: "curriculum", title: "AI Education Project (AIEDU)", url: "https://theaiedu.org/", description: "Lesson plans and projects for high school classrooms." },
    { type: "curriculum", title: "Common Sense Media – AI & Media Literacy Lessons", url: "https://www.commonsense.org/education/digital-citizenship/topic/artificial-intelligence", description: "Free lessons on AI literacy for grades 6–12." },
    { type: "curriculum", title: "Stanford CRAFT AI Ethics Curriculum", url: "https://craft.stanford.edu/ai-ethics-curriculum/", description: "Classroom-ready high school lessons on AI’s societal impacts." },
    { type: "course", title: "Wharton Online “AI for Educators”", url: "https://interactive.wharton.upenn.edu/ai-for-educators/", description: "Free online course on using LLMs in teaching." },
    { type: "course", title: "Microsoft’s AI Learning Course", url: "https://learn.microsoft.com/en-us/training/paths/introduction-artificial-intelligence/", description: "Free course for educators on AI in education." },
    { type: "curriculum", title: "ISTE’s AI & Digital Citizenship Resources", url: "https://www.iste.org/areas-of-focus/AI-in-education", description: "Standards and guides for AI in schools." },
    { type: "course", title: "MIT Media Labs “Media Literacy in the Age of Deepfakes", url: "https://www.media.mit.edu/projects/media-literacy-in-the-age-of-deepfakes/overview/", description: "Interactive modules on identifying deepfakes." },
    { type: "video", title: "Crash Course: Artificial Intelligence", url: "https://www.youtube.com/playlist?list=PL8dPuuaLjXtOeEc9ME62zTfqc0hT6Y3Fv", description: "20-episode YouTube series introducing AI concepts." },
    { type: "video", title: "Crash Course: Media Literacy", url: "https://www.youtube.com/playlist?list=PL8dPuuaLjXtOeEc9ME62zTfqc0hT6Y3Fv", description: "12-episode series on media literacy." },
    { type: "video", title: "Crash Course: Navigating Digital Information", url: "https://www.youtube.com/playlist?list=PL8dPuuaLjXtOeEc9ME62zTfqc0hT6Y3Fv", description: "10-episode series on fact-checking and online research." },
    { type: "video", title: "Khan Academy – Ethics & AI", url: "https://www.khanacademy.org/computing/computer-science/ai/ai-ethics/a/ethics-of-ai", description: "Short video on AI ethics and algorithmic bias." },
    { type: "film", title: "Coded Bias (2020)", url: "https://www.codedbias.com/", description: "Documentary on bias in AI algorithms." },
    { type: "film", title: "The Social Dilemma (2020)", url: "https://www.netflix.com/title/81254224", description: "Documentary-drama on social media algorithms." },
    { type: "film", title: "Her (2013)", url: "https://www.imdb.com/title/tt1798709/", description: "Sci-fi film about AI and personhood." },
    { type: "film", title: "Ex Machina (2014)", url: "https://www.imdb.com/title/tt0470752/", description: "Sci-fi thriller on AI consciousness and ethics." },
    { type: "film", title: "Minority Report (2002)", url: "https://www.imdb.com/title/tt0181689/", description: "Sci-fi police thriller on predictive technology." },
  ],
  weeks: [
    {
      title: "Week 1: What is AI & Why It Matters",
      icon: 'Calendar',
      progress: 0,
      description: "Demystify AI, explore its history, and understand its impact on society.",
      days: [
        {
          title: "Day 1: What Is Artificial Intelligence?",
          icon: 'Lightbulb',
          progress: 0,
          lessons: [
            {
              title: "What Is AI? Demystifying the Magic",
              icon: 'BookOpen',
              progress: 0,
              chapters: [
                {
                  title: "Opening Story: Viral AI Pizza Meme",
                  slug: "01-opening-story",
                  mdx: "content/workshops/ai-literacy-digital-citizenship/chapters/01-opening-story.mdx"
                },
                {
                  title: "Activity: Teachable Machine Demo",
                  slug: "activity-teachable-machine",
                  mdx: "content/workshops/ai-literacy-digital-citizenship/chapters/activity-teachable-machine.mdx"
                },
                {
                  title: "Quiz: Day 1",
                  slug: "quiz-day-1",
                  mdx: "content/workshops/ai-literacy-digital-citizenship/chapters/quiz-day-1.mdx"
                }
              ]
            }
          ]
        },
        {
          title: "Day 2: How AI Really Works",
          icon: 'Lightbulb',
          progress: 0,
          lessons: [
            {
              title: "Algorithm or Magic?",
              icon: 'BookOpen',
              progress: 0,
              chapters: [
                {
                  title: "How AI Really Works",
                  slug: "01-how-ai-works",
                  mdx: "content/workshops/ai-literacy-digital-citizenship/chapters/01-how-ai-works.mdx"
                },
                {
                  title: "Activity: Build a Simple Classifier",
                  slug: "activity-simple-classifier",
                  mdx: "content/workshops/ai-literacy-digital-citizenship/chapters/activity-simple-classifier.mdx"
                },
                {
                  title: "Quiz: Day 2",
                  slug: "quiz-day-2",
                  mdx: "content/workshops/ai-literacy-digital-citizenship/chapters/quiz-day-2.mdx"
                }
              ]
            }
          ]
        },
        {
          title: "Day 3: AI in Everyday Life",
          icon: 'Users',
          progress: 0,
          lessons: [
            {
              title: "From Siri to Surveillance",
              icon: 'PlayCircle',
              progress: 0,
              chapters: [
                {
                  title: "AI in Everyday Life",
                  slug: "01-ai-in-everyday-life",
                  mdx: "content/workshops/ai-literacy-digital-citizenship/chapters/01-ai-in-everyday-life.mdx"
                },
                {
                  title: "Media: Crash Course AI Ep. 1",
                  slug: "media-crashcourse-ep1",
                  mdx: "content/workshops/ai-literacy-digital-citizenship/chapters/media-crashcourse-ep1.mdx"
                },
                {
                  title: "Quiz: Day 3",
                  slug: "quiz-day-3",
                  mdx: "content/workshops/ai-literacy-digital-citizenship/chapters/quiz-day-3.mdx"
                }
              ]
            }
          ]
        },
        {
          title: "Day 4: Algorithmic Bias & Ethics",
          icon: 'CheckCircle',
          progress: 0,
          lessons: [
            {
              title: "When AI Gets It Wrong",
              icon: 'FileText',
              progress: 0,
              chapters: [
                {
                  title: "Algorithmic Bias: When AI Gets It Wrong",
                  slug: "01-algorithmic-bias",
                  mdx: "content/workshops/ai-literacy-digital-citizenship/chapters/01-algorithmic-bias.mdx"
                },
                {
                  title: "Case Study: COMPAS & Recidivism",
                  slug: "case-study-compas",
                  mdx: "content/workshops/ai-literacy-digital-citizenship/chapters/case-study-compas.mdx"
                },
                {
                  title: "Quiz: Day 4",
                  slug: "quiz-day-4",
                  mdx: "content/workshops/ai-literacy-digital-citizenship/chapters/quiz-day-4.mdx"
                }
              ]
            }
          ]
        },
        {
          title: "Day 5: Digital Citizenship & Media Literacy",
          icon: 'Users',
          progress: 0,
          lessons: [
            {
              title: "Rights, Privacy, and Empathy",
              icon: 'BookOpen',
              progress: 0,
              chapters: [
                {
                  title: "Digital Citizenship: Rights, Privacy, and Empathy",
                  slug: "01-digital-citizenship",
                  mdx: "content/workshops/ai-literacy-digital-citizenship/chapters/01-digital-citizenship.mdx"
                },
                {
                  title: "Group Activity: Digital Footprint Mapping",
                  slug: "activity-digital-footprint",
                  mdx: "content/workshops/ai-literacy-digital-citizenship/chapters/activity-digital-footprint.mdx"
                },
                {
                  title: "Quiz: Day 5",
                  slug: "quiz-day-5",
                  mdx: "content/workshops/ai-literacy-digital-citizenship/chapters/quiz-day-5.mdx"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

export type AiLiteracyCurriculum = typeof aiLiteracyCurriculum; 