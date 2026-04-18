export type LearnAiCueSegment =
  | 'opening'
  | 'pressure'
  | 'prompt'
  | 'problem'
  | 'practice'
  | 'scenarios'
  | 'closing'

export type LearnAiCueBeat = {
  id: string
  timeRange: string
  segment: LearnAiCueSegment
  slideLabel: string
  screenAction: string
  script: string
  altJoke?: string
  teachingGoal: string
  criticalTakeaway: string
  slideImageUrl?: string
  notes?: string
  skillWord?: string
  onScreenLine?: string
  onScreenGloss?: string
}

export const learnAiCueSegmentOrder = [
  { id: 'opening', label: 'Opening' },
  { id: 'pressure', label: 'Pressure' },
  { id: 'prompt', label: 'Prompt' },
  { id: 'problem', label: 'Problem' },
  { id: 'practice', label: 'Practice' },
  { id: 'scenarios', label: 'Scenarios' },
  { id: 'closing', label: 'Closing' },
] as const satisfies ReadonlyArray<{ id: LearnAiCueSegment; label: string }>

export type LearnAiCueSegmentOrderModel = typeof learnAiCueSegmentOrder

export const learnAiCueBeats: LearnAiCueBeat[] = [
  {
    id: 'beat-01',
    timeRange: '0:00–3:00',
    segment: 'opening',
    slideLabel: 'Title',
    screenAction: 'Hero only; no tool logos',
    script:
      'Welcome. This is not a certification. It is a room for judgment—how to use these tools without outsourcing your voice.',
    teachingGoal: 'Lower defenses; set authorship norm',
    criticalTakeaway: 'Voice stays yours; models are assistants with amnesia',
    skillWord: 'Framing',
    onScreenLine: 'Learn AI · without losing yourself',
    onScreenGloss: 'Authorship-forward',
  },
  {
    id: 'beat-02',
    timeRange: '3:00–6:00',
    segment: 'opening',
    slideLabel: 'Agenda',
    screenAction: 'Show four moves + scenarios',
    script:
      'We will move Pressure → Prompt → Problem → Practice, then scenarios and close. Questions in chat or aloud—either is fine.',
    altJoke: 'If the Wi‑fi dies, we still have judgment.',
    teachingGoal: 'Map the arc',
    criticalTakeaway: 'Same spine every time you teach this',
  },
  {
    id: 'beat-03',
    timeRange: '6:00–12:00',
    segment: 'pressure',
    slideLabel: 'Pressure list',
    screenAction: 'Blank slide; invite shout-outs',
    script:
      'Name one pressure you felt this month about AI—speed, comparison, admin fear. We are not solving your institution today; we are naming weather.',
    teachingGoal: 'Externalize shame',
    criticalTakeaway: 'Pressure is data',
    skillWord: 'Normalize',
  },
  {
    id: 'beat-04',
    timeRange: '12:00–22:00',
    segment: 'prompt',
    slideLabel: 'Bad prompt → good prompt',
    screenAction: 'Live text edit',
    script:
      'Here is a vague prompt. Watch what happens when we add audience, constraints, and how we will evaluate success.',
    teachingGoal: 'Show constraint beats cleverness',
    criticalTakeaway: 'Good prompts carry evaluation criteria',
    notes: 'Swap example for local grant or syllabus if available',
  },
  {
    id: 'beat-05',
    timeRange: '22:00–30:00',
    segment: 'problem',
    slideLabel: 'Problem statement',
    screenAction: 'Pair in breakout or turn-and-talk',
    script:
      'Write one sentence: what job are we hiring the model for? If you cannot say it, do not prompt yet.',
    teachingGoal: 'Problem before tool',
    criticalTakeaway: 'Fuzzy problem → confident sludge',
  },
  {
    id: 'beat-06',
    timeRange: '30:00–42:00',
    segment: 'practice',
    slideLabel: 'Critique tags',
    screenAction: 'Show tag list',
    script:
      'Pick two tags: voice, fact, consent, credit. Apply to this short paragraph. Timer: four minutes.',
    teachingGoal: 'Structured critique',
    criticalTakeaway: 'Tags beat vague dislike',
  },
  {
    id: 'beat-07',
    timeRange: '42:00–52:00',
    segment: 'scenarios',
    slideLabel: 'Scenario menu',
    screenAction: 'Table read setup',
    script:
      'Choose grant paragraph, syllabus email, or studio crit. Same tags; different stakes. Facilitator keeps time.',
    teachingGoal: 'Transfer to their contexts',
    criticalTakeaway: 'Separate tool talk from intent talk',
  },
  {
    id: 'beat-08',
    timeRange: '52:00–60:00',
    segment: 'closing',
    slideLabel: 'Formats + next step',
    screenAction: 'Contact line',
    script:
      'Thirty, forty-five, sixty, or custom—we keep the spine. Your best next step is one loop documented this week.',
    teachingGoal: 'Land the offer',
    criticalTakeaway: 'One documented loop beats ten bookmarked threads',
  },
]
