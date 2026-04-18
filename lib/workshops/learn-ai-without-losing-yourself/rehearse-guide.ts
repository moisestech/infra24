export const learnAiRehearseGuide = {
  coreTone: {
    youAre: [
      'Clear, patient, slightly dry',
      'Willing to say “I do not know” about fast-moving tools',
      'More interested in patterns than hot takes',
    ],
    youAreNot: [
      'A vendor advocate',
      'A futurist hype engine',
      'Someone who pretends models are neutral',
    ],
  },
  emotionalMix: ['Curiosity 40%', 'Skepticism 25%', 'Relief 20%', 'Play 15%'],
  teachingRhythm:
    'Name the move → show one example → pair or table → debrief with one sentence participants can repeat.',
  runningOrder: [
    { time: '0:00', title: 'Welcome & stakes', segment: 'opening' as const },
    { time: '6:00', title: 'Pressure', segment: 'pressure' as const },
    { time: '18:00', title: 'Prompt live rewrite', segment: 'prompt' as const },
    { time: '30:00', title: 'Problem framing', segment: 'problem' as const },
    { time: '40:00', title: 'Practice loop', segment: 'practice' as const },
    { time: '50:00', title: 'Scenarios', segment: 'scenarios' as const },
    { time: '58:00', title: 'Close & next step', segment: 'closing' as const },
  ],
  edutainmentBullets: [
    'One joke per segment max—then name the pattern immediately',
    'Exaggerate a bad prompt on purpose; fix it slowly',
    'Use participant examples when they volunteer—never pressure',
  ],
  bridgeLines: [
    'That was funny—and the pattern underneath is…',
    'If that landed, here is the sentence to steal…',
  ],
  quoteGlossExamples: [
    { quote: '“It sounded smart.”', gloss: 'Fluency ≠ accuracy' },
    { quote: '“I just need it faster.”', gloss: 'Name what quality bar is being skipped' },
  ],
  stageTips: [
    'Hydrate; your voice is the primary UI',
    'Watch the clock on pairs—better shallow loop than one deep rabbit hole',
    'Repeat the four-move sequence verbatim at least twice',
    'End on contact + one homework line, not five URLs',
  ],
  nextStepBlurb:
    'Ask each participant to document one prompt that worked and one critique tag they will reuse this week.',
} as const

export type LearnAiRehearseGuideModel = typeof learnAiRehearseGuide
