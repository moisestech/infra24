/**
 * Editorial copy + structured blocks for the Learn AI landing page.
 * Internal URLs in strings should be filled at render time via learnAiWorkshopPaths(orgSlug).
 */

export type LearnAiOutcomeCard = { title: string; body: string }

export type LearnAiProcessStep = {
  key: 'pressure' | 'prompt' | 'problem' | 'practice'
  title: string
  body: string
}

export type LearnAiScenarioCard = { title: string; setup: string; twist: string }

export type LearnAiFormatOption = {
  label: string
  minutes: number | 'custom'
  summary: string
}

export const learnAiLandingCopy = {
  eyebrow: 'Digital Lab · AI literacy',
  title: 'Learn AI Without Losing Yourself',
  supportingLine:
    'A single-session workshop for artists, educators, and cultural workers who want clarity—not hype—when AI enters the room.',
  pullQuotes: [
    'The goal is not faster drafts; it is steadier judgment.',
    'Treat the model as a collaborator with amnesia: it needs your context, your stakes, and your “no.”',
    'Voice is a practice, not a file format.',
  ],
  quickFacts: [
    { label: 'Format', value: 'Hybrid · facilitator-led' },
    { label: 'Level', value: 'Beginner-friendly' },
    { label: 'You bring', value: 'Laptop + one real task or draft' },
    { label: 'You leave', value: 'Language, loops, and next steps you can reuse' },
  ],
  problemHeading: 'Why this workshop exists',
  problemBody: `Many teams are told to “just use AI” without norms for disclosure, critique, or credit. Individuals feel pressure to sound fluent overnight. This session names those pressures, grounds them in practice, and gives you repeatable moves you can take back to studio, classroom, or admin work—without pretending the technology is neutral.`,
  processTagline: 'Four moves you can teach tomorrow',
  processSteps: [
    {
      key: 'pressure',
      title: 'Pressure',
      body: 'Name what the room is feeling—speed, comparison, fear of falling behind—and separate hype from obligation.',
    },
    {
      key: 'prompt',
      title: 'Prompt',
      body: 'Design prompts that carry voice, constraints, and evaluation criteria—not vague wishes.',
    },
    {
      key: 'problem',
      title: 'Problem',
      body: 'Clarify the actual problem before reaching for a tool. If the problem is unclear, the output will lie confidently.',
    },
    {
      key: 'practice',
      title: 'Practice',
      body: 'Run a tight loop: generate, critique on voice and fact, revise, document what worked.',
    },
  ] as LearnAiProcessStep[],
  outcomesHeading: 'What you can realistically leave with',
  outcomeCards: [
    {
      title: 'A clearer “use boundary”',
      body: 'Short language you can reuse in grants, syllabi, or studio agreements about when AI is appropriate.',
    },
    {
      title: 'A critique rubric for AI drafts',
      body: 'Three to five checks that keep authorship and factuality visible—without pretending humans are perfect.',
    },
    {
      title: 'A mapped workflow',
      body: 'One real path from idea → prompt → draft → human edit → publish, with obvious handoff points.',
    },
    {
      title: 'Confidence to say no',
      body: 'Permission to skip automation where judgment, consent, or craft risk is high.',
    },
  ] as LearnAiOutcomeCard[],
  humanVsAutomated: {
    humanHeading: 'Keep human in the loop when…',
    humanList: [
      'Credit, consent, or vulnerable subjects are involved',
      'Facts must be verifiable or legally sensitive',
      'Voice and style are the artwork—not generic polish',
    ],
    automatedHeading: 'Automation may be appropriate when…',
    automatedList: [
      'Formatting, summarizing long reference material you control',
      'Brainstorming variants you will still curate',
      'Draft scaffolding you will rewrite in your own syntax',
    ],
  },
  scenarios: [
    {
      title: 'The grant paragraph',
      setup: 'You need a tight project summary under a strict word count.',
      twist: 'The model can compress; you still own claims, numbers, and ethics language.',
    },
    {
      title: 'The syllabus email',
      setup: 'Parents or admins want “AI policy” language by Friday.',
      twist: 'We draft norms together—you bring institutional constraints, not vibes.',
    },
    {
      title: 'The studio critique',
      setup: 'Someone brings AI-generated sketches to group crit.',
      twist: 'We separate tool talk from intent talk, and set repeatable critique tags.',
    },
  ] as LearnAiScenarioCard[],
  differentiationHeading: 'How this differs from a product demo',
  differentiationBullets: [
    'Facilitation-first: critical framing, not a single-vendor walkthrough',
    'Authorship-forward: disclosure, credit, and critique as core skills',
    'Portable patterns: prompts and loops you can adapt across tools',
  ],
  formatsHeading: 'Session lengths we can adapt',
  formatsIntro:
    'Same spine—opening, four moves, scenarios, close—scaled to your schedule.',
  formats: [
    { label: '30 minutes', minutes: 30, summary: 'Key ideas + one live loop; best as a keynote teaser.' },
    { label: '45 minutes', minutes: 45, summary: 'Adds a short pair exercise on prompts.' },
    { label: '60 minutes', minutes: 60, summary: 'Full scenario pass with table read.' },
    { label: 'Custom / half-day', minutes: 'custom', summary: 'Deeper critique labs and institutional policy blocks.' },
  ] as LearnAiFormatOption[],
  idealIntroHeading: 'Ideal hosts & venues',
  idealVenues: [
    'Residencies and arts nonprofits',
    'University arts departments and continuing ed',
    'Municipal cultural offices and library systems',
    'Studio collectives running professional development',
  ],
  aboutHeading: 'About the facilitator',
  aboutBio: `Moises works at the intersection of documentation, digital infrastructure, and artist-centered pedagogy. Sessions emphasize repeatable practice, plain language, and room for skepticism—especially when tools shift faster than policy.`,
  proofHeading: 'Proof & hosts',
  proofIntro:
    'Quotes and partner logos can be dropped in as the series runs. Until then, this block holds space for social proof.',
  proofPlaceholders: [
    { quote: '“Placeholder—host quote after first delivery.”', attribution: 'Role, Organization' },
    { quote: '“Placeholder—participant takeaway.”', attribution: 'Discipline, City' },
  ],
  inquiryHeading: 'Bring this to your space',
  inquiryBody:
    'Share audience size, dates, and tech constraints. We reply with format options and materials checklist.',
} as const

export function learnAiAboutImageUrl(): string | null {
  const u = process.env.NEXT_PUBLIC_LEARN_AI_ABOUT_IMAGE?.trim()
  return u || null
}
