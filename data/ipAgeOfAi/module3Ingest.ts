/**
 * Module 3 transcript ingestion (source segment ~20:45-28:30).
 * Raw = lightly edited reference excerpt; cleaned = learner-facing lesson excerpt.
 */

export const module3VideoSuggestedTitle =
  'AI Authorship in Practice: Human Contribution, Disclosure, and Documentation'

export const module3LessonSummary =
  'This segment clarifies that human authorship remains central, while AI use sits on a spectrum from technical assistance to substantial generation. The panel discusses “de minimis” vs. appreciable contribution, limits of prompt-only claims, and why artists should document who used AI, where, and for what.'

export const module3LessonText = `This lesson focuses on a practical question artists face now: when does AI support your process, and when does it become a major creative contributor that changes authorship conversations?

The panel frames this with a useful working contrast: de minimis use (technical assistance like captions, cleanup, formatting) versus appreciable use (AI producing substantial expressive content). The point is not to force certainty where law is still evolving, but to help artists self-audit honestly and preserve evidence of human decisions.

A central warning is that prompting alone may not carry the full authorship story. Artists are encouraged to keep process records: drafts, revisions, source materials, and notes about why creative choices were made. This can matter for platform disputes, publishing workflows, and contract representations.

The discussion also surfaces chain-of-production risk. Even when a primary artist did not rely heavily on AI, collaborators or editors might have used AI tools downstream. The takeaway is to ask, document, and clarify expectations in writing - especially when agreements or publishers require disclosure.

Overall, the module treats AI authorship as a documentation discipline: distinguish technical aid from expressive generation, preserve your human contribution trail, and seek review when stakes are high.`

export const module3PullQuotes = [
  '"Prompts alone are not sufficient to claim authorship." - human contribution remains the baseline.',
  '"Think de minimis versus appreciable: technical assistance versus AI acting like a creative partner."',
  '"You know it when you see it is not enough - document your process so your decisions are visible."',
  '"Ask collaborators what tools were used; hidden AI in the chain can create authorship and disclosure problems."',
]

export const module3KeyTerms = [
  'human authorship',
  'de minimis use',
  'appreciable AI contribution',
  'prompt limits',
  'process documentation',
  'disclosure obligations',
]

export const module3ChapterMarkers: Array<{ label: string; time: string }> = [
  { time: '20:45', label: 'Vocabulary shift: denial of cert and unsettled terrain' },
  { time: '22:30', label: 'Human authorship requirement and prompt-only limits' },
  { time: '23:50', label: 'De minimis vs appreciable AI contribution explained' },
  { time: '24:50', label: 'Publishing example: hidden AI edits and attribution risk' },
  { time: '27:20', label: 'Practical response: disclosures, contracts, and process records' },
]

export const module3CleanedTranscript = `[Dimmitri]
As we shift into terminology, the key question for artists is practical: if you use AI tools, what counts as meaningful human contribution?

[Samara]
U.S. copyright frameworks still require human authorship. Prompts alone are usually not enough by themselves. A useful way to think about this is de minimis versus appreciable contribution.

De minimis means technical support: captions, light cleanup, formatting, organizational assistance. Appreciable means AI is generating core expressive material with you.

[Panel exchange]
There is no single bright-line percentage everyone can rely on today. That uncertainty is exactly why artists should document process and decision-making instead of assuming the tool history speaks for itself.

[Publishing chain example]
The panel discusses a publishing scenario where an editor used AI in revisions. Even if the original author did not generate core text with AI, hidden downstream use created confusion and reputational harm. The lesson: ask collaborators what tools were used and document agreements clearly.

[Practical takeaway]
Treat AI authorship as a workflow issue:
- distinguish technical assistance from expressive generation
- document your human decisions
- clarify disclosures where contracts, publishers, or collaborators require them
- seek attorney review when rights, credit, or revenue are at stake.`

export const module3RawTranscript = `[Discussion segment ~20:45-28:30]
The panel introduces legal vocabulary and explains that Supreme Court non-decisions do not settle the AI authorship issue.

Key exchange:
- U.S. copyright doctrine still centers human authorship.
- Prompting alone is described as insufficient in many contexts.
- Speakers use de minimis (technical support) versus appreciable (substantial expressive output) to frame risk.

The discussion then moves into a publishing-world example where AI edits by someone in the production chain created downstream authorship controversy.

Practical guidance repeated in this section:
- do not rely on AI-detection scores as final truth
- ask collaborators and editors about AI use
- include disclosure and ownership language in contracts
- document process so your human contribution can be explained later.`
