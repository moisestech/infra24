/**
 * Module 4 transcript ingestion (source segment ~28:30–35:55).
 * Raw = lightly edited reference excerpt; cleaned = learner-facing lesson excerpt.
 */

export const module4VideoSuggestedTitle =
  'Fair Use, Scraping, and Training Data: What Artists Should Assume Is Still Open'

export const module4LessonSummary =
  'The panel explains fair use as a fact-specific U.S. doctrine, then stresses that whether training generative models on copyrighted works counts as fair use remains deeply contested. A high-profile Anthropic-related dispute illustrates how settlements can end cases without settling the big precedent artists want—and why federal and state law may move on different clocks.'

export const module4LessonText = `This lesson sits in one of the most unstable zones for artists right now: the relationship between copyright, fair use, and large-scale training data.

The panel starts from a familiar idea: fair use is not a single permission slip. It is evaluated case by case using multiple factors, including how transformative a use is and what effect it may have on the market for the original work. That matters because headlines often flatten nuance into a binary “allowed” or “not allowed.”

The conversation then distinguishes inspiration and learning from wholesale scraping and model training at industrial scale. Even when analogies to human practice feel intuitive, the legal arguments in court are not identical—and different judges may weigh the factors differently.

A concrete example anchors the uncertainty: litigation involving Anthropic and training materials. The panel notes that some issues reached partial resolution while other core questions were left unresolved when the parties settled—meaning the public may still lack a clean appellate answer about certain training paths.

Finally, the segment widens the lens: federal policy and proposed legislation may interact awkwardly with state-level experimentation. For artists, the practical implication is not panic, but preparation—separate what courts have actually decided from what is still being fought over, and align publishing and documentation habits with your risk tolerance.`

export const module4PullQuotes = [
  '"Fair use is evaluated case by case on four factors—this is not a universal yes or no for training."',
  '"Courts have been split on whether training on copyrighted works is fair use—that is the active battleground."',
  '"When a case settles, you may lose the precedent moment everyone was waiting for."',
  '"Federal movement can be slow while states try to fill gaps—that can create a patchwork for artists to track."',
]

export const module4KeyTerms = [
  'fair use',
  'transformative use',
  'scraping',
  'training data',
  'settlement vs precedent',
  'state and federal law',
]

export const module4ChapterMarkers: Array<{ label: string; time: string }> = [
  { time: '28:35', label: 'Fair use as a case-by-case doctrine—not a blanket rule' },
  { time: '29:45', label: 'Inspiration vs industrial-scale scraping and training' },
  { time: '31:10', label: 'Anthropic-related litigation: licensed material, scraped sources, partial rulings' },
  { time: '33:20', label: 'Settlement before precedent: what artists lose when cases end early' },
  { time: '34:40', label: 'Federal vs state dynamics and why headlines may mislead' },
]

export const module4CleanedTranscript = `[Dimmitri]
We are shifting to fair use. For artists, the headline anxiety is often: if my work was used to train a model, what is my legal position today?

[Samara / Andre]
Fair use is a U.S. doctrine that can allow limited uses of copyrighted works without permission, but it is not automatic. Courts weigh multiple factors, including how transformative the use is and how it affects the market for the original.

The harder question in this era is model training: courts have been split on whether training on copyrighted works is fair use. That means artists should not treat any single outcome as universal law yet.

[Concrete example thread]
The discussion references Anthropic-related litigation involving training on large corpora, including both licensed and less-clearly-licensed sources. The panel explains that a settlement can end a dispute without producing the broad precedent many people wanted—leaving key questions open for the next cases.

[State and federal framing]
Speakers also note federal and state law may evolve on different timelines. Some state activity tries to address gaps while federal debates continue. For artists, the practical task is to track uncertainty without assuming the law has already answered every scenario.

[Takeaway]
Prepare without pretending the question is closed: document what you publish, understand your platform footprint, and treat legal strategy as risk management rather than certainty shopping.`

export const module4RawTranscript = `[Discussion segment ~28:30-35:55]
Panel defines fair use as a multi-factor doctrine and stresses case-by-case application.

Key tension:
- individual learning and influence vs AI companies training at scale on scraped corpora

Anthropic / Barts-style discussion (as summarized in session):
- court addressed some questions about certain licensed materials
- unresolved threads about unlicensed or contested sources
- settlement ends case before a clean appellate rule for everyone

Precedent vocabulary:
- settlement may avoid a published decision that would guide later disputes

Federal vs state:
- federal proposals and executive attention vs state experiments
- potential friction between federal and state directions

Practical artist takeaway repeated:
- do not infer final national rule from one headline
- keep publishing and evidence habits aligned with risk tolerance
- consult counsel for portfolio-level decisions when exposure is high`
