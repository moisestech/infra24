export const learnAiLabIntro =
  'Lab notes for facilitators: session map, skills grid, critique vocabulary, and proof checklist. Pair with the printable rehearsal script on the Rehearse page.'

export const learnAiLabStatus = {
  label: 'Lab packet',
  detail: 'Syllabus-ready · printable rehearsal shipped in-repo',
}

export const learnAiLabThesis = {
  thesis:
    'Treat facilitation as editorial design: visible structure, explicit norms, and humor as a release valve—not a distraction.',
  supports: [
    'Open with stakes, not tool logos',
    'Keep segments under twenty minutes before a mode switch',
    'End every block with a “so what” line participants can repeat',
  ],
  pullQuotes: [
    'If participants only remember one sentence, script that sentence on purpose.',
    'Edutainment is timing: laugh, then name the pattern.',
  ],
}

export type LearnAiSessionBlock = {
  id: string
  phase: 'opening' | 'segment' | 'closing'
  title: string
  purpose: string
  tension: string
  skill: string
  critique: string
}

export const learnAiSessionMap: LearnAiSessionBlock[] = [
  {
    id: 'opening',
    phase: 'opening',
    title: 'Opening — stakes & promises',
    purpose: 'Align on authorship, disclosure, and what “success” means today',
    tension: 'Some want tools; some want ethics—hold both',
    skill: 'Plain-language framing',
    critique: 'Ask what a “good” output would change in their week',
  },
  {
    id: 'seg-pressure',
    phase: 'segment',
    title: 'Pressure',
    purpose: 'External narratives vs obligations they actually own',
    tension: 'Shame spikes when comparing to hype accounts',
    skill: 'Name → normalize → redirect',
    critique: 'Pressure is data, not destiny',
  },
  {
    id: 'seg-prompt',
    phase: 'segment',
    title: 'Prompt',
    purpose: 'Templates with voice, audience, constraints, evaluation',
    tension: 'Vague prompts produce confident sludge',
    skill: 'Three-part prompt scaffold',
    critique: 'Red-team for facts before voice polish',
  },
  {
    id: 'seg-problem',
    phase: 'segment',
    title: 'Problem',
    purpose: 'Problem statement before tool',
    tension: 'Solutionism is seductive under time pressure',
    skill: 'One-sentence job-to-be-done',
    critique: 'If problem shifts midstream, reset the prompt',
  },
  {
    id: 'seg-practice',
    phase: 'segment',
    title: 'Practice',
    purpose: 'Generate → critique → revise → document',
    tension: 'Critique without tags becomes taste wars',
    skill: 'Critique tags + timer',
    critique: 'Voice, fact, consent, credit—pick two per round',
  },
  {
    id: 'closing',
    phase: 'closing',
    title: 'Closing — formats & next step',
    purpose: 'Scale options, proof plan, booking path',
    tension: 'Everyone wants a custom build in the hallway',
    skill: 'Clear “best next step” line',
    critique: 'Leave one sentence they can text a colleague',
  },
]

export const learnAiSkillsGrid = [
  { skill: 'Framing', detail: 'Assistant vs author; disclosure norms' },
  { skill: 'Prompt design', detail: 'Constraints, evaluation, red-team' },
  { skill: 'Facilitation', detail: 'Timers, pairs, tags, parking lot' },
  { skill: 'Documentation', detail: 'Capture prompts that worked' },
]

export const learnAiCritiqueTags = [
  'voice',
  'fact',
  'consent',
  'credit',
  'audience',
  'scope',
  'tone',
  'risk',
]

export const learnAiHumorMechanics = [
  'Self-deprecating tool joke → immediate serious pattern',
  'Exaggerated “worst prompt” example → fix live',
  'One meme-level analogy per segment max',
]

export const learnAiEducationalMechanics = [
  'Think–pair–share on pressure list',
  'Live rewrite of a vague prompt',
  'Tag-based crit of a short AI paragraph',
]

export const learnAiVisualStrategy = [
  'One slide per idea; large type',
  'Show prompts in monospace',
  'Avoid vendor splash screens in opening',
]

export const learnAiProofChecklist = [
  'Participant can repeat the four-move sequence',
  'At least one prompt captured on paper or doc',
  'One critique tag used correctly in front of group',
  'Clear next step articulated (book, async, policy follow-up)',
]

export const learnAiLabTocIds = [
  { id: 'lab-intro', label: 'Intro' },
  { id: 'lab-session-map', label: 'Session map' },
  { id: 'lab-skills', label: 'Skills' },
  { id: 'lab-critique', label: 'Critique tags' },
  { id: 'lab-mechanics', label: 'Mechanics' },
  { id: 'lab-visual', label: 'Visual strategy' },
  { id: 'lab-proof', label: 'Proof checklist' },
]
