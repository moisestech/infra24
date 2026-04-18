export type LearnAiCurriculumChapter = {
  id: string
  title: string
  durationHint: string
  summary: string
  objectives: string[]
  keyIdeas: string[]
  demoSummary?: string
}

export const learnAiCurriculumIntro =
  'Seven short chapters mirror the live arc: stakes, four moves, scenarios, and close. Use them as pre-reading or async reinforcement after the session.'

export const learnAiCurriculumChapters: LearnAiCurriculumChapter[] = [
  {
    id: 'ch-01-stakes',
    title: 'Stakes & language',
    durationHint: '~12 min read',
    summary: 'Why “losing yourself” is a design problem, not a personal failure.',
    objectives: ['Name two pressures participants commonly feel', 'Agree on vocabulary for the session (assistant vs author)'],
    keyIdeas: ['Models optimize for plausible text, not truth', 'Voice is maintained through constraints and critique'],
  },
  {
    id: 'ch-02-pressure',
    title: 'Pressure',
    durationHint: '~10 min read',
    summary: 'External speed narratives vs what your cohort actually owes stakeholders.',
    objectives: ['Separate hype from obligation', 'List one pressure you can ignore this quarter'],
    keyIdeas: ['Institutions copy each other’s AI policies', 'Saying “not yet” is a valid technical choice'],
  },
  {
    id: 'ch-03-prompt',
    title: 'Prompt',
    durationHint: '~15 min read',
    summary: 'Prompt patterns that carry voice, audience, and evaluation criteria.',
    objectives: ['Draft a three-part prompt template', 'Add a “red team” instruction for fact-sensitive tasks'],
    keyIdeas: ['Constraints beat cleverness', 'Show your work: paste sources or say “unknown”'],
    demoSummary: 'Live: turn a vague wish into a bounded prompt for a grant blurb.',
  },
  {
    id: 'ch-04-problem',
    title: 'Problem',
    durationHint: '~12 min read',
    summary: 'Clarify the job-to-be-done before touching a tool.',
    objectives: ['Write a one-sentence problem statement', 'Identify one step that must stay human-only'],
    keyIdeas: ['If the problem is fuzzy, output will be confidently wrong', 'Problem framing is a group skill'],
  },
  {
    id: 'ch-05-practice',
    title: 'Practice',
    durationHint: '~18 min read',
    summary: 'A repeatable loop: generate → critique → revise → document.',
    objectives: ['Run the loop once on a real snippet', 'Capture one “keep” rule for your studio'],
    keyIdeas: ['Critique tags beat vague dislike', 'Document prompts that worked—models forget'],
  },
  {
    id: 'ch-06-scenarios',
    title: 'Scenarios',
    durationHint: '~15 min read',
    summary: 'Table reads for syllabus language, studio crit, and admin email.',
    objectives: ['Pick two critique tags for your discipline', 'Facilitate a five-minute structured response'],
    keyIdeas: ['Separate tool talk from intent talk', 'Consent and credit stay on the human side'],
  },
  {
    id: 'ch-07-close',
    title: 'Formats, proof, next step',
    durationHint: '~10 min read',
    summary: 'Scaling the session; what to measure; how to book a deeper build.',
    objectives: ['Choose a format length for your org', 'List one metric beyond “time saved”'],
    keyIdeas: ['30/45/60/custom share one spine', 'Proof accumulates—start with clear participant outcomes'],
  },
]
