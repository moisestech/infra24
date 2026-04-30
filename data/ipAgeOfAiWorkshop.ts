import {
  module1ChapterMarkers,
  module1CleanedTranscript,
  module1KeyTerms,
  module1LessonSummary,
  module1LessonText,
  module1PullQuotes,
  module1RawTranscript,
  module1VideoSuggestedTitle,
} from './ipAgeOfAi/module1Ingest'
import {
  module2ChapterMarkers,
  module2CleanedTranscript,
  module2KeyTerms,
  module2LessonSummary,
  module2LessonText,
  module2PullQuotes,
  module2RawTranscript,
  module2VideoSuggestedTitle,
} from './ipAgeOfAi/module2Ingest'
import {
  module3ChapterMarkers,
  module3CleanedTranscript,
  module3KeyTerms,
  module3LessonSummary,
  module3LessonText,
  module3PullQuotes,
  module3RawTranscript,
  module3VideoSuggestedTitle,
} from './ipAgeOfAi/module3Ingest'
import {
  module4ChapterMarkers,
  module4CleanedTranscript,
  module4KeyTerms,
  module4LessonSummary,
  module4LessonText,
  module4PullQuotes,
  module4RawTranscript,
  module4VideoSuggestedTitle,
} from './ipAgeOfAi/module4Ingest'
import {
  module5ChapterMarkers,
  module5CleanedTranscript,
  module5KeyTerms,
  module5LessonSummary,
  module5LessonText,
  module5PullQuotes,
  module5RawTranscript,
  module5VideoSuggestedTitle,
} from './ipAgeOfAi/module5Ingest'
import {
  module6ChapterMarkers,
  module6CleanedTranscript,
  module6KeyTerms,
  module6LessonSummary,
  module6LessonText,
  module6PullQuotes,
  module6RawTranscript,
  module6VideoSuggestedTitle,
} from './ipAgeOfAi/module6Ingest'
import {
  module7ChapterMarkers,
  module7CleanedTranscript,
  module7KeyTerms,
  module7LessonSummary,
  module7LessonText,
  module7PullQuotes,
  module7RawTranscript,
  module7VideoSuggestedTitle,
} from './ipAgeOfAi/module7Ingest'
import {
  module8ChapterMarkers,
  module8CleanedTranscript,
  module8KeyTerms,
  module8LessonSummary,
  module8LessonText,
  module8PullQuotes,
  module8RawTranscript,
  module8VideoSuggestedTitle,
} from './ipAgeOfAi/module8Ingest'

export type LegalPracticeTriageContent = {
  lawSays: string[]
  unsettled: string[]
  artistPractice: string[]
}

export type ExtraChecklist = {
  title: string
  description: string
  items: string[]
}

export type VideoChapterMarker = {
  label: string
  /** Display time (often wall-clock within the master recording), e.g. 7:05 */
  time: string
}

export type TranscriptIngestFields = {
  lessonText?: string
  lessonSummary?: string
  pullQuotes?: string[]
  keyTerms?: string[]
  chapterMarkers?: VideoChapterMarker[]
}

export type WorkshopModule = {
  id: string
  moduleNumber: number
  title: string
  subtitle: string
  thesis: string
  summary: string
  video: {
    url: string
    poster: string
    startTime: string
    endTime: string
    duration: string
    /** Editorial title suggestion for the edited clip (optional). */
    suggestedTitle?: string
  }
  transcript: {
    /** Learner-facing cleaned lesson text (default). */
    cleanedTranscript: string
    /** Optional raw segment for editorial review; shown only when present. */
    rawTranscript?: string
    speakers: string[]
    notes: string
  } & TranscriptIngestFields
  keyLessonPoints: string[]
  practicalTakeaways: string[]
  glossaryTerms: string[]
  examples: string[]
  checklist: string[]
  reflectionQuestions: string[]
  /** Short labels for legacy “related resources” list in module body. */
  resources: string[]
  nextModule: string
  previousModule: string
  legalPracticeTriage?: LegalPracticeTriageContent
  scenarioLabMode?: 'none' | 'preview' | 'full'
  showRiskResponseLadder?: boolean
  showAIUseSelfAudit?: boolean
  showContractClauseSelector?: boolean
  /** Keys into `ipAgeOfAiResourceCatalog` for categorized ResourceLinks. */
  resourceLinkKeys?: string[]
  additionalChecklists?: ExtraChecklist[]
  artistPracticeTips?: string[]
  /** When true, module page omits the generic legal uncertainty banner (triage covers nuance). */
  suppressGenericUncertaintyCallout?: boolean
}

export type GlossaryTerm = {
  term: string
  definition: string
  whyItMatters: string
}

export type ResourceLink = {
  title: string
  description: string
  url: string
  category: 'Copyright' | 'Contracts' | 'AI' | 'DMCA' | 'Legal Clinics' | 'Artist Resources'
}

export type ScenarioItem = {
  id: string
  scenario: string
  rightsInvolved: string[]
  evidenceToCollect: string[]
  firstStep: string
  whenToEscalate: string
  relatedTemplate: string
}

export type ToolkitAsset = {
  title: string
  description: string
  status: 'Download coming soon' | 'Open worksheet'
}

export const ipAgeOfAiWorkshop = {
  slug: 'ip-age-of-ai',
  title: 'Skills: Intellectual Property in the Age of AI',
  label: 'Oolite Arts Skills Series',
  totalModules: 8,
  description:
    'A practical professional development workshop helping artists understand copyright, contracts, AI, licensing, takedowns, and creative risk in a fast-changing digital environment.',
  educationalDisclaimer:
    'This workshop is for educational purposes only and does not replace advice from an attorney.',
  about:
    'This workshop translates legal complexity into practical decisions artists can use in real projects, conversations, and contracts.',
  audience:
    'Artists, designers, musicians, writers, photographers, filmmakers, and creative producers navigating publishing, commissions, licensing, and platform risks.',
  outcomes: [
    'A practical framework to distinguish legal rules, legal uncertainty, and strategic next steps.',
    'Reusable checklists for publishing, contracting, and responding to misuse.',
    'A shared vocabulary for copyright, authorship, fair use, and rights of publicity.',
  ],
}

export const ipAgeOfAiModules: WorkshopModule[] = [
  {
    id: 'module-1',
    moduleNumber: 1,
    title: 'The New Reality of Creative Risk',
    subtitle: 'Why artists need legal literacy in a fast-moving AI environment',
    thesis:
      'Artists are working in a landscape where technology moves faster than the law, so practical preparation matters more than panic.',
    summary:
      'The opening panel stories show that unauthorized use can happen quickly, and that strategic response is often more effective than panic.',
    video: {
      url: '',
      poster: '',
      startTime: '3:30',
      endTime: '13:55',
      duration: '10m 25s',
      suggestedTitle: module1VideoSuggestedTitle,
    },
    transcript: {
      cleanedTranscript: module1CleanedTranscript,
      rawTranscript: module1RawTranscript,
      lessonText: module1LessonText,
      lessonSummary: module1LessonSummary,
      pullQuotes: module1PullQuotes,
      keyTerms: module1KeyTerms,
      chapterMarkers: module1ChapterMarkers,
      speakers: ['Dimmitri', 'Andre', 'Samara'],
      notes: 'Module 1 ingest v1 — verify timings and quotes against final master.',
    },
    legalPracticeTriage: {
      lawSays: [
        'Copyright and related rights may still apply when someone copies or adapts your work without permission.',
        'Platform terms often govern how reports, takedowns, and repeat infringement are handled.',
      ],
      unsettled: [
        'How quickly courts or platforms respond to novel AI-related misuse is still uneven across jurisdictions and services.',
        'Whether a given use is “worth” litigation may depend on facts you cannot know from headlines alone.',
      ],
      artistPractice: [
        'Document before responding: capture URLs, screenshots, dates, and account identifiers.',
        'A practical first step is often a platform report or takedown pathway when misuse is clearly online.',
        'Consider attorney review when money, contracts, or repeated harm is involved.',
      ],
    },
    scenarioLabMode: 'preview',
    resourceLinkKeys: ['dmca-overview', 'copyright-office', 'vla'],
    keyLessonPoints: [
      'Creative misuse often appears first on platforms before legal systems can respond.',
      'The first move is documentation and assessment, not immediate escalation.',
      'Different harms need different responses: platform report, DMCA, demand letter, or pause.',
      'Community reporting can be a practical multiplier for artist protection.',
    ],
    practicalTakeaways: [
      'Capture screenshots, timestamps, account names, and URLs before contacting anyone.',
      'Assess likely harm and actual scale before committing to high-cost action.',
      'Use platform reporting, then legal steps if harm persists or scales.',
    ],
    glossaryTerms: ['AI risk', 'Unauthorized use', 'Platform misuse', 'Strategic response'],
    examples: [
      'Benedict Cork unauthorized AI-completed release scenario.',
      'Unauthorized tote bag merchandising example and practical triage.',
    ],
    checklist: [
      'Document where your work appears.',
      'Check whether monetization appears active.',
      'Preserve evidence before filing reports.',
      'Identify your immediate response path.',
    ],
    reflectionQuestions: [
      'What type of misuse would most disrupt your creative practice?',
      'What evidence system do you already have, and what is missing?',
    ],
    resources: ['DMCA basics guide', 'Infringement evidence log worksheet'],
    nextModule: 'module-2',
    previousModule: '',
  },
  {
    id: 'module-2',
    moduleNumber: 2,
    title: 'Copyright Basics Artists Actually Need',
    subtitle: 'Ownership, registration, derivatives, and takedown tools',
    thesis:
      'Artists usually own copyright in original work automatically, but registration strengthens their ability to enforce those rights.',
    summary:
      'This module breaks down fixation, ownership, registration, DMCA, derivative works, and selling objects while retaining rights.',
    video: {
      url: '',
      poster: '',
      startTime: '43:50',
      endTime: '47:55',
      duration: '4m 05s',
      suggestedTitle: module2VideoSuggestedTitle,
    },
    transcript: {
      cleanedTranscript: module2CleanedTranscript,
      rawTranscript: module2RawTranscript,
      lessonText: module2LessonText,
      lessonSummary: module2LessonSummary,
      pullQuotes: module2PullQuotes,
      keyTerms: module2KeyTerms,
      chapterMarkers: module2ChapterMarkers,
      speakers: ['Samara', 'Andre'],
      notes: 'Module 2 ingest v1 - verify timing alignment and legal phrasing against final cut.',
    },
    legalPracticeTriage: {
      lawSays: [
        'In the U.S., copyright may attach when original work is fixed in a tangible medium—registration affects enforcement options, not whether creativity exists.',
        'Selling a physical object does not automatically transfer all reproduction or derivative rights unless agreed in writing.',
      ],
      unsettled: [
        'How quickly registration completes can affect timing of federal litigation or certain remedies.',
        'DMCA outcomes can depend on platform processes and how clearly you can describe ownership and infringement.',
      ],
      artistPractice: [
        'Clarify in writing what the buyer receives: the object, a license, or an assignment of rights.',
        'Prepare a DMCA-ready evidence folder with links, timestamps, and a plain description of the work.',
        'Consider attorney review when the deal is valuable, ambiguous, or involves many future uses.',
      ],
    },
    resourceLinkKeys: ['copyright-office', 'copyright-ccb', 'dmca-overview', 'vla'],
    keyLessonPoints: [
      'Copyright can attach automatically when original work is fixed in a tangible medium.',
      'Registration is often required before full enforcement options become available.',
      'Selling a physical artwork does not automatically transfer all rights.',
      'Derivative rights and licensing scope should be explicit in writing.',
    ],
    practicalTakeaways: [
      'Use plain-language rights-retention statements in invoices or confirmation emails.',
      'Register high-value works on a regular schedule.',
      'Treat DMCA as one tool in a broader strategy, not the whole strategy.',
    ],
    glossaryTerms: ['Copyright', 'Fixed work', 'Registration', 'Derivative works', 'DMCA'],
    examples: [
      'Selling a singular artwork while retaining reproduction rights.',
      'DMCA pathway as a first practical enforcement step.',
    ],
    checklist: [
      'Confirm work originality and fixation.',
      'Track registration status.',
      'Clarify sale terms: object versus rights.',
      'Prepare a DMCA-ready evidence folder.',
    ],
    reflectionQuestions: [
      'Where in your current workflow do rights transfer terms get communicated?',
      'Which works in your catalog should be prioritized for registration?',
    ],
    resources: ['Copyright Office basics', 'Rights retention language starter'],
    nextModule: 'module-3',
    previousModule: 'module-1',
  },
  {
    id: 'module-3',
    moduleNumber: 3,
    title: 'AI Authorship and Human Contribution',
    subtitle: 'What counts as meaningful creative control when using AI tools',
    thesis:
      'AI-assisted work may involve copyrightable human creativity, but prompts alone may not be enough; artists need to document their creative contribution.',
    summary:
      'Human authorship remains central, and practical documentation can help clarify where technical assistance ends and expressive generation begins.',
    video: {
      url: '',
      poster: '',
      startTime: '20:45',
      endTime: '28:30',
      duration: '7m 45s',
      suggestedTitle: module3VideoSuggestedTitle,
    },
    transcript: {
      cleanedTranscript: module3CleanedTranscript,
      rawTranscript: module3RawTranscript,
      lessonText: module3LessonText,
      lessonSummary: module3LessonSummary,
      pullQuotes: module3PullQuotes,
      keyTerms: module3KeyTerms,
      chapterMarkers: module3ChapterMarkers,
      speakers: ['Samara', 'Dimmitri'],
      notes: 'Module 3 ingest v1 - QA phrasing and chapter timings against the locked edit.',
    },
    legalPracticeTriage: {
      lawSays: [
        'U.S. copyright policy centers human authorship; prompts alone may not establish the full creative story in many filings or disputes.',
        'Publishers, clients, and collaborators may impose disclosure expectations by contract even when statute is silent.',
      ],
      unsettled: [
        'How much human contribution is “enough” remains a fact-specific question that agencies and courts continue to refine.',
        'Detection tools and scores vary in reliability; they may not match how a human reader experiences the work.',
      ],
      artistPractice: [
        'Keep dated notes on drafts, references, and revisions so human decisions are visible later.',
        'Ask collaborators and editors what tools they used and document permissions in writing.',
        'Use the AI self-audit as a prompt for documentation—not a legal conclusion.',
      ],
    },
    showAIUseSelfAudit: true,
    additionalChecklists: [
      {
        title: 'AI documentation worksheet (preview)',
        description: 'Lightweight prompts to capture where AI entered the workflow.',
        items: [
          'List each AI tool and version used.',
          'Mark whether output was technical cleanup or core generation.',
          'Save exports and prompts where policy allows.',
        ],
      },
    ],
    resourceLinkKeys: ['copyright-office', 'partnership-ai', 'vla'],
    keyLessonPoints: [
      'Legal systems still anchor authorship in human creative contribution.',
      'Prompting alone may not establish strong authorship claims in many contexts.',
      'Process documentation can strengthen clarity around human decisions.',
      'Disclosure expectations may differ by publisher, collaborator, or client.',
    ],
    practicalTakeaways: [
      'Keep dated process notes on drafts, edits, and decision points.',
      'Log whether AI handled technical cleanup or core expressive generation.',
      'Ask collaborators and editors to disclose any AI use in your project chain.',
    ],
    glossaryTerms: ['Human authorship', 'AI-assisted work', 'Prompt limits', 'Disclosure'],
    examples: [
      'Publishing workflow where editing layers created authorship confusion.',
      'De minimis versus appreciable contribution distinction in practice.',
    ],
    checklist: [
      'Capture your creative decision timeline.',
      'Mark where AI entered the process.',
      'Store source files and revision history.',
      'Clarify disclosure expectations in agreements.',
    ],
    reflectionQuestions: [
      'Can you explain your human contribution in plain language from start to finish?',
      'What project records would you need if authorship were challenged?',
    ],
    resources: ['AI use documentation worksheet', 'Authorship disclosure clause prompt'],
    nextModule: 'module-4',
    previousModule: 'module-2',
  },
  {
    id: 'module-4',
    moduleNumber: 4,
    title: 'Fair Use, Scraping, and Training Data',
    subtitle: 'Understanding the unsettled legal battleground around AI training',
    thesis:
      'Whether AI training on copyrighted works qualifies as fair use remains unsettled, so artists should prepare without assuming the law has already answered the question.',
    summary:
      'This module separates what fair use can mean, what remains unsettled, and what artists can do now while outcomes are still evolving.',
    video: {
      url: '',
      poster: '',
      startTime: '28:30',
      endTime: '35:55',
      duration: '7m 25s',
      suggestedTitle: module4VideoSuggestedTitle,
    },
    transcript: {
      cleanedTranscript: module4CleanedTranscript,
      rawTranscript: module4RawTranscript,
      lessonText: module4LessonText,
      lessonSummary: module4LessonSummary,
      pullQuotes: module4PullQuotes,
      keyTerms: module4KeyTerms,
      chapterMarkers: module4ChapterMarkers,
      speakers: ['Samara', 'Andre', 'Dimmitri'],
      notes: 'Module 4 ingest v1 - QA against locked edit; verify case names and dates with counsel if cited publicly.',
    },
    legalPracticeTriage: {
      lawSays: [
        'Fair use is a multi-factor U.S. doctrine applied case by case; it may permit some uses without permission.',
        'Copyright owners often rely on registration and takedown tools when infringement is clear enough to describe.',
      ],
      unsettled: [
        'Whether model training on copyrighted works is fair use remains contested and may differ by court, facts, and settlement.',
        'State and federal initiatives can move on different timelines, so headlines may not reflect your specific risk.',
      ],
      artistPractice: [
        'Separate legal headlines from your publishing plan: decide what to share publicly and at what resolution.',
        'Review metadata, watermarks, and anti-scraping options appropriate to your medium.',
        'Keep records of where and when you published high-value files.',
      ],
    },
    additionalChecklists: [
      {
        title: 'Before you publish',
        description: 'Reduce exposure while staying visible.',
        items: [
          'Choose resolution and crop for public posts deliberately.',
          'Check alt text and metadata for unintended training signals.',
          'Archive originals offline or in access-controlled storage.',
        ],
      },
    ],
    resourceLinkKeys: [
      'fair-use-stanford',
      'copyright-office',
      'dmca-overview',
      'nightshade',
      'partnership-ai',
      'vla',
    ],
    keyLessonPoints: [
      'Fair use analysis is case-specific and can shift across courts.',
      'Settlements can resolve disputes without establishing broad precedent.',
      'State and federal frameworks may move at different speeds.',
      'Risk-aware publishing and metadata strategy can still reduce exposure.',
    ],
    practicalTakeaways: [
      'Avoid assuming any single headline equals universal legal certainty.',
      'Track where and how high-resolution files are published publicly.',
      'Review anti-scraping and metadata tools appropriate for your medium.',
    ],
    glossaryTerms: [
      'Fair use',
      'Transformative use',
      'Scraping',
      'Training data',
      'Settlement',
      'Precedent',
    ],
    examples: [
      'Anthropic case discussion and settlement implications.',
      'State and federal mismatch in AI-related enforcement realities.',
    ],
    checklist: [
      'Review current publishing defaults for image/audio detail.',
      'Check metadata and watermark strategy.',
      'Separate legal uncertainty from practical risk decisions.',
      'Maintain records of where work has been posted.',
    ],
    reflectionQuestions: [
      'Where are you currently most exposed to scraping risk?',
      'What can you change this week without reducing your visibility goals?',
    ],
    resources: ['Before you publish checklist', 'Metadata and anti-scraping references'],
    nextModule: 'module-5',
    previousModule: 'module-3',
  },
  {
    id: 'module-5',
    moduleNumber: 5,
    title: 'Contracts as Creative Protection',
    subtitle: 'How artists can reduce ambiguity before problems happen',
    thesis:
      'Contracts are not just legal documents; they are tools for clarifying expectations, preserving rights, and preventing future disputes.',
    summary:
      'This module shows how plain-language contracts, emails, and clause choices can protect artist agency before conflict starts.',
    video: {
      url: '',
      poster: '',
      startTime: '47:55',
      endTime: '60:45',
      duration: '12m 50s',
      suggestedTitle: module5VideoSuggestedTitle,
    },
    transcript: {
      cleanedTranscript: module5CleanedTranscript,
      rawTranscript: module5RawTranscript,
      lessonText: module5LessonText,
      lessonSummary: module5LessonSummary,
      pullQuotes: module5PullQuotes,
      keyTerms: module5KeyTerms,
      chapterMarkers: module5ChapterMarkers,
      speakers: ['Andre', 'Samara', 'Dimmitri'],
      notes:
        'Module 5 ingest v1 (47:55–60:45). Merge or supplement with segment 70:30–76:45 when the second clip is ready.',
    },
    legalPracticeTriage: {
      lawSays: [
        'Written agreements can clarify ownership, payment, credit, AI use, and dispute pathways before work ships.',
        'Emails and invoices can sometimes document mutual understanding, but bespoke deals still benefit from clear terms.',
      ],
      unsettled: [
        'Whether every AI-related clause will be enforced as written can depend on jurisdiction, bargaining power, and public policy.',
        'Mediation and arbitration clauses have tradeoffs; they are not automatically better for every artist.',
      ],
      artistPractice: [
        'Put rights-retention language in writing before or at the time of sale when possible.',
        'Use AI drafting as a first pass, then consider attorney review for gaps you cannot see yet.',
        'Pick governing law and dispute resolution deliberately with counsel when cross-border work is common.',
      ],
    },
    showContractClauseSelector: true,
    artistPracticeTips: [
      'A simple sentence in an email or invoice—selling the object while retaining copyrights—can reduce ambiguity when a buyer proceeds without objection.',
    ],
    additionalChecklists: [
      {
        title: 'Before you sign',
        description: 'Pause for clarity on high-stakes clauses.',
        items: [
          'Confirm scope: deliverables, schedule, and payment triggers.',
          'Check AI disclosure, ownership, and moral rights language.',
          'Identify governing law, venue, mediation, or arbitration terms.',
        ],
      },
    ],
    resourceLinkKeys: ['law-for-creators', 'vla', 'copyright-office'],
    keyLessonPoints: [
      'Ambiguity can be more expensive than careful drafting.',
      'A simple rights-retention sentence can prevent major confusion.',
      'Governing law and dispute pathways should be intentional.',
      'AI can help draft, but legal review can close critical gaps.',
    ],
    practicalTakeaways: [
      'Include rights-retention language in writing before or at point of sale.',
      'Add AI use and disclosure terms when relevant to collaborators.',
      'Choose dispute routes (mediation/arbitration/litigation) deliberately.',
    ],
    glossaryTerms: ['Contract', 'Rights retention', 'Governing law', 'Mediation', 'Arbitration'],
    examples: [
      'Physical artwork sale versus rights transfer confusion.',
      'Contract clause strategies for AI use and ownership boundaries.',
    ],
    checklist: [
      'Define exactly what is sold: object, license, or assignment.',
      'Add governing law and dispute process.',
      'Clarify AI disclosure obligations.',
      'Archive signed terms and version history.',
    ],
    reflectionQuestions: [
      'Which one clause would improve your current contract template the most?',
      'What agreements are currently verbal and should be written?',
    ],
    resources: ['Contract clause starter pack', 'Before you sign checklist'],
    nextModule: 'module-6',
    previousModule: 'module-4',
  },
  {
    id: 'module-6',
    moduleNumber: 6,
    title: 'Name, Image, Voice, and Likeness',
    subtitle: 'Right of publicity and AI impersonation risks',
    thesis:
      'Artists need to understand that voice, likeness, signature, and identity may be protected differently than copyright, especially when AI cloning is involved.',
    summary:
      'This module clarifies how identity-based rights differ from copyright and how state-by-state differences affect practical strategy.',
    video: {
      url: '',
      poster: '',
      startTime: '35:55',
      endTime: '43:50',
      duration: '7m 55s',
      suggestedTitle: module6VideoSuggestedTitle,
    },
    transcript: {
      cleanedTranscript: module6CleanedTranscript,
      rawTranscript: module6RawTranscript,
      lessonText: module6LessonText,
      lessonSummary: module6LessonSummary,
      pullQuotes: module6PullQuotes,
      keyTerms: module6KeyTerms,
      chapterMarkers: module6ChapterMarkers,
      speakers: ['Samara', 'Andre'],
      notes:
        'Module 6 ingest v1 (35:55–43:50). Merge or supplement with segment 61:15–64:25 when the second clip is ready.',
    },
    legalPracticeTriage: {
      lawSays: [
        'Right of publicity and related state laws may protect name, image, voice, or likeness from some unauthorized commercial uses.',
        'Trademark law may protect distinctive marks, signatures, or brands when used as source identifiers.',
      ],
      unsettled: [
        'Federal proposals like the NO Fakes Act may evolve; state protections remain a patchwork.',
        'International misuse may not respond to U.S. remedies the same way domestic misuse does.',
      ],
      artistPractice: [
        'Use written consent for recordings, promotions, and synthetic media that reference your identity.',
        'Document confusion: save posts or messages where audiences believed an impersonation was you.',
        'Consider attorney review when revenue, safety, or platform impersonation is involved.',
      ],
    },
    artistPracticeTips: [
      'Signatures, watermarks, and consistent brand markers can support enforcement conversations alongside copyright claims.',
    ],
    additionalChecklists: [
      {
        title: 'Voice and likeness consent',
        description: 'Basics before you agree to capture or reuse.',
        items: [
          'Specify commercial vs. noncommercial uses.',
          'Note duration, territory, and sublicensing limits.',
          'Clarify whether AI training or synthetic voice is permitted.',
        ],
      },
    ],
    resourceLinkKeys: ['vla', 'copyright-office', 'wipo'],
    keyLessonPoints: [
      'Copyright and publicity rights protect different interests.',
      'Voice and likeness cases may depend heavily on state law.',
      'Trademark and signature practices can support broader protection strategy.',
      'Federal uncertainty means artists should plan with layered safeguards.',
    ],
    practicalTakeaways: [
      'Use clear consent terms before any recording, documentation, or synthetic media use.',
      'Add voice and likeness restrictions in commission and collaboration agreements.',
      'Evaluate whether your business setup aligns with your exposure profile.',
    ],
    glossaryTerms: ['Right of publicity', 'Likeness', 'Voice cloning', 'Trademark', 'Appropriation'],
    examples: [
      'Discussion of state differences (Tennessee, California, New York).',
      'How signatures and watermarking can support practical enforcement.',
    ],
    checklist: [
      'Set consent requirements for recordings and derivatives.',
      'Identify where your strongest legal protections may apply.',
      'Document unauthorized identity-based uses immediately.',
      'Preserve examples of audience confusion or reputational harm.',
    ],
    reflectionQuestions: [
      'How is your name, voice, or likeness currently exposed in your workflow?',
      'Where should consent language be added first?',
    ],
    resources: ['Voice and likeness consent checklist', 'Trademark basics primer'],
    nextModule: 'module-7',
    previousModule: 'module-5',
  },
  {
    id: 'module-7',
    moduleNumber: 7,
    title: 'Responding to Misuse',
    subtitle: 'Demand letters, cease and desist, DMCA, community response, and escalation',
    thesis:
      'Artists do not need to respond to every misuse the same way; the right response depends on harm, evidence, platform, cost, and strategic goals.',
    summary:
      'This module provides an escalation framework from documentation through legal options and community strategy.',
    video: {
      url: '',
      poster: '',
      startTime: '13:55',
      endTime: '20:40',
      duration: '6m 45s',
      suggestedTitle: module7VideoSuggestedTitle,
    },
    transcript: {
      cleanedTranscript: module7CleanedTranscript,
      rawTranscript: module7RawTranscript,
      lessonText: module7LessonText,
      lessonSummary: module7LessonSummary,
      pullQuotes: module7PullQuotes,
      keyTerms: module7KeyTerms,
      chapterMarkers: module7ChapterMarkers,
      speakers: ['Samara', 'Andre'],
      notes:
        'Module 7 ingest v1 (13:55–20:40). Merge or supplement with segment 44:30–45:20 when the second clip is ready.',
    },
    legalPracticeTriage: {
      lawSays: [
        'DMCA and platform policies may offer a structured way to request removal of infringing copies.',
        'Demand letters can create a record that you objected to specific conduct before escalating further.',
      ],
      unsettled: [
        'Whether any single strategy will stop misuse depends on the actor, jurisdiction, and willingness to comply.',
        'Litigation costs and timelines vary widely; not every misuse justifies the same spend.',
      ],
      artistPractice: [
        'Document and monitor first; organize evidence before sending notices.',
        'Use platform tools when terms of service support your claim.',
        'Consider attorney review before high-stakes demands or public campaigns.',
      ],
    },
    showRiskResponseLadder: true,
    scenarioLabMode: 'preview',
    additionalChecklists: [
      {
        title: 'DMCA prep checklist',
        description: 'Gather materials before filing.',
        items: [
          'Identify copyrighted work and registration status if applicable.',
          'List infringing URLs with screenshots and timestamps.',
          'Draft a factual statement without admissions you cannot support.',
        ],
      },
      {
        title: 'Infringement evidence log',
        description: 'Ongoing log while monitoring misuse.',
        items: ['Record each URL and date seen.', 'Note revenue signals or pricing if listed.', 'Track platform responses.'],
      },
    ],
    resourceLinkKeys: ['dmca-overview', 'copyright-office', 'vla'],
    keyLessonPoints: [
      'Escalation should match harm level, available evidence, and resource constraints.',
      'Demand letters can create useful notice even without immediate litigation.',
      'Community and platform pressure can support formal legal steps.',
      'Not every conflict is worth full litigation; strategic choice matters.',
    ],
    practicalTakeaways: [
      'Decide response pathway using a repeatable ladder before urgent incidents occur.',
      'Preserve a full evidence packet before outreach.',
      'Use calm, factual language in notices and public posts.',
    ],
    glossaryTerms: ['Demand letter', 'Cease and desist', 'Platform report', 'Escalation'],
    examples: [
      'Demand letter strategy versus litigation cost realities.',
      'Community reporting as a practical support mechanism.',
    ],
    checklist: [
      'Document the infringement and source context.',
      'Assess harm and urgency.',
      'Choose first response channel.',
      'Set escalation checkpoints with dates.',
    ],
    reflectionQuestions: [
      'What threshold would make you escalate from platform report to attorney review?',
      'What communication tone protects both your rights and your community trust?',
    ],
    resources: ['DMCA takedown prep sheet', 'Demand letter prep worksheet'],
    nextModule: 'module-8',
    previousModule: 'module-6',
  },
  {
    id: 'module-8',
    moduleNumber: 8,
    title: 'Building an Artist Rights Toolkit',
    subtitle: 'From information to repeatable professional practice',
    thesis:
      'The goal is not to memorize legal doctrine; the goal is to build a practical system artists can use repeatedly.',
    summary:
      'The final module consolidates workflows, templates, and habits into a repeatable artist-rights practice.',
    video: {
      url: '',
      poster: '',
      startTime: '60:20',
      endTime: '61:15',
      duration: '0m 55s',
      suggestedTitle: module8VideoSuggestedTitle,
    },
    transcript: {
      cleanedTranscript: module8CleanedTranscript,
      rawTranscript: module8RawTranscript,
      lessonText: module8LessonText,
      lessonSummary: module8LessonSummary,
      pullQuotes: module8PullQuotes,
      keyTerms: module8KeyTerms,
      chapterMarkers: module8ChapterMarkers,
      speakers: ['Samara', 'Andre', 'Dimmitri'],
      notes:
        'Module 8 ingest v1 (60:20–61:15). Merge or supplement with segment 76:45–78:45 when the extended closing is ready.',
    },
    legalPracticeTriage: {
      lawSays: [
        'Knowing baseline rights concepts can help you ask better questions of counsel, clinics, and collaborators.',
        'Written practices (contracts, logs, disclosures) tend to age better than memory alone.',
      ],
      unsettled: [
        'Technology and policy will keep shifting; your workflows should be easy to update as rules clarify.',
      ],
      artistPractice: [
        'Pick one workflow to implement this month—documentation, publishing defaults, or contract hygiene.',
        'Share this toolkit with collaborators so expectations match before work begins.',
        'Consider attorney review for any situation involving significant money, safety, or reputation.',
      ],
    },
    scenarioLabMode: 'full',
    suppressGenericUncertaintyCallout: true,
    resourceLinkKeys: ['vla', 'creative-commons', 'copyright-office', 'wipo'],
    keyLessonPoints: [
      'Legal literacy supports artist agency rather than replacing creativity.',
      'A workflow is more sustainable than one-off reactive decisions.',
      'Templates, logs, and checklists can reduce panic during incidents.',
      'Human review remains essential for high-stakes agreements and disputes.',
    ],
    practicalTakeaways: [
      'Assemble a baseline rights toolkit before your next release cycle.',
      'Schedule periodic reviews of contracts, metadata, and publishing defaults.',
      'Share rights practices with collaborators to align expectations early.',
    ],
    glossaryTerms: ['Legal literacy', 'Workflow', 'Documentation', 'Artist agency'],
    examples: [
      'Panel closing strategy: use AI carefully, but keep human legal review.',
      'From fragmented actions to repeatable artist-rights practice.',
    ],
    checklist: [
      'Download and organize toolkit assets.',
      'Create one folder for rights evidence and contracts.',
      'Pick one workflow to implement this month.',
      'Share your protocol with collaborators.',
    ],
    reflectionQuestions: [
      'What rights practice will you implement first after this workshop?',
      'Who on your team or network needs this toolkit next?',
    ],
    resources: ['Artist rights quickstart guide', 'Artist legal resource directory'],
    nextModule: '',
    previousModule: 'module-7',
  },
]

export const ipAgeOfAiGlossary: GlossaryTerm[] = [
  {
    term: 'AI risk',
    definition: 'The possibility that AI tools or outputs could affect ownership, credit, licensing, or misuse of your work.',
    whyItMatters: 'Risk-aware publishing and contracting can reduce surprises without stopping experimentation.',
  },
  {
    term: 'Unauthorized use',
    definition: 'Use of your work or identity without permission or beyond the scope of a license.',
    whyItMatters: 'Clarifying permission in writing makes enforcement and platform reports easier to explain.',
  },
  {
    term: 'Platform misuse',
    definition: 'Conduct that may violate a service’s terms, community guidelines, or repeat-infringement policies.',
    whyItMatters: 'Platform tools are often faster than court processes for straightforward online copies.',
  },
  {
    term: 'Strategic response',
    definition: 'Choosing actions based on harm, evidence, cost, and goals rather than reacting in one fixed way.',
    whyItMatters: 'Not every conflict benefits from the same escalation path.',
  },
  {
    term: 'AI-assisted work',
    definition: 'Creative work where a human directs the outcome and AI supports parts of the process.',
    whyItMatters: 'Disclosure and documentation expectations often hinge on how much AI shaped the final expression.',
  },
  {
    term: 'Prompt limits',
    definition: 'The idea that typing prompts alone may not fully describe human authorship for some legal questions.',
    whyItMatters: 'Artists may need additional records of creative choices beyond prompt text.',
  },
  {
    term: 'Disclosure',
    definition: 'Telling clients, publishers, or platforms when AI tools contributed to a work.',
    whyItMatters: 'Contracts and platform rules increasingly ask for transparency about AI use.',
  },
  {
    term: 'Transformative use',
    definition: 'A fair use factor asking whether a new use adds new meaning, message, or purpose.',
    whyItMatters: 'Training-data and remix disputes often debate how “transformative” a use is.',
  },
  {
    term: 'Scraping',
    definition: 'Automated collection of data from websites or files, sometimes at very large scale.',
    whyItMatters: 'Artists may reduce scraping exposure through publishing choices and technical tools.',
  },
  {
    term: 'Settlement',
    definition: 'Parties resolve a dispute without a final court decision on every legal question.',
    whyItMatters: 'Settlements can end conflicts but may leave broader legal questions unanswered for others.',
  },
  {
    term: 'Precedent',
    definition: 'Past court decisions that later courts may look to for guidance.',
    whyItMatters: 'Without binding precedent, artists may still face uncertainty in fast-moving AI issues.',
  },
  {
    term: 'Fixed work',
    definition: 'A work captured in a sufficiently permanent medium that others can perceive it.',
    whyItMatters: 'Fixation is a basic building block for copyright discussions in the U.S.',
  },
  {
    term: 'Registration',
    definition: 'Recording a copyright claim with the U.S. Copyright Office (where applicable).',
    whyItMatters: 'Registration can affect which enforcement options are available and how remedies work.',
  },
  {
    term: 'Contract',
    definition: 'An agreement between parties that can define rights, duties, payment, and dispute handling.',
    whyItMatters: 'Clear contracts reduce ambiguity before creative work ships.',
  },
  {
    term: 'Rights retention',
    definition: 'Language clarifying that selling an object does not automatically sell all creative rights.',
    whyItMatters: 'It helps prevent buyers from assuming they may reproduce or merchandise without permission.',
  },
  {
    term: 'Mediation',
    definition: 'A facilitated negotiation process that may be binding or non-binding depending on terms.',
    whyItMatters: 'Some artists prefer mediation before more adversarial steps.',
  },
  {
    term: 'Likeness',
    definition: 'A person’s recognizable appearance in image, video, or synthetic depictions.',
    whyItMatters: 'Likeness issues may overlap with publicity rights separate from copyright.',
  },
  {
    term: 'Voice cloning',
    definition: 'Synthetic generation that imitates a person’s vocal characteristics.',
    whyItMatters: 'Voice misuse can confuse audiences and implicate publicity or platform policies.',
  },
  {
    term: 'Appropriation',
    definition: 'Taking someone’s name, likeness, or indicia for a use that may not be authorized.',
    whyItMatters: 'Some disputes proceed under publicity or unfair competition theories, not only copyright.',
  },
  {
    term: 'Trademark',
    definition: 'A signifier of source for goods or services that may be protected when used in commerce.',
    whyItMatters: 'Signatures, logos, or watermarks sometimes support claims separate from copyright.',
  },
  {
    term: 'Demand letter',
    definition: 'A written request asking someone to stop conduct or resolve a dispute.',
    whyItMatters: 'It can create a dated record before further escalation.',
  },
  {
    term: 'Platform report',
    definition: 'A complaint filed through a host’s built-in abuse or infringement workflow.',
    whyItMatters: 'Often the fastest first step for clear policy violations online.',
  },
  {
    term: 'Escalation',
    definition: 'Moving to stronger actions after initial steps (for example, from notice to formal legal processes).',
    whyItMatters: 'Matching escalation to harm can protect budgets and mental bandwidth.',
  },
  {
    term: 'Legal literacy',
    definition: 'Understanding enough vocabulary and process to ask better questions and document decisions.',
    whyItMatters: 'It supports agency without replacing professional advice.',
  },
  {
    term: 'Workflow',
    definition: 'A repeatable sequence you use for publishing, contracting, or responding to issues.',
    whyItMatters: 'Workflows reduce panic when problems appear.',
  },
  {
    term: 'Documentation',
    definition: 'Saving records of permissions, drafts, dates, and communications.',
    whyItMatters: 'Good records support platform notices, licensing, and counsel conversations.',
  },
  {
    term: 'Artist agency',
    definition: 'Your ability to steer projects, negotiate terms, and choose tools intentionally.',
    whyItMatters: 'Education aims to expand practical choices, not replace legal counsel.',
  },
  {
    term: 'Copyright',
    definition: 'A legal framework that can protect original creative expression fixed in a tangible medium.',
    whyItMatters: 'It can help artists control copying, derivatives, licensing, and enforcement.',
  },
  {
    term: 'DMCA takedown',
    definition:
      'A platform-based notice process used to request removal of allegedly infringing content.',
    whyItMatters: 'It is often the first practical response when work appears online without permission.',
  },
  {
    term: 'Fair use',
    definition:
      'A legal doctrine allowing limited use of copyrighted work without permission in certain contexts.',
    whyItMatters:
      'Its application is case-specific and currently central to AI training disputes.',
  },
  {
    term: 'Human authorship',
    definition: 'The principle that copyright protection generally requires meaningful human creative input.',
    whyItMatters: 'It affects how AI-assisted works may be protected and described.',
  },
  {
    term: 'Derivative work',
    definition: 'A new work based on preexisting copyrighted material.',
    whyItMatters: 'Unauthorized derivatives can create enforcement and licensing issues.',
  },
  {
    term: 'Right of publicity',
    definition:
      'A state-based right that may protect name, image, voice, or likeness from unauthorized commercial use.',
    whyItMatters:
      'Voice cloning and identity misuse may involve publicity rights rather than copyright.',
  },
  {
    term: 'Governing law',
    definition: 'Contract language identifying which jurisdiction’s law will apply in disputes.',
    whyItMatters: 'It can influence strategy, cost, and outcomes when conflicts arise.',
  },
  {
    term: 'Arbitration',
    definition:
      'A private dispute process where parties present arguments to a neutral decision-maker.',
    whyItMatters:
      'Some artists use it to create a more predictable dispute path than full litigation.',
  },
  {
    term: 'Cease and desist',
    definition:
      'A notice requesting that another party stop specific behavior believed to violate rights.',
    whyItMatters: 'It can create a clear record and sometimes resolve issues without filing suit.',
  },
  {
    term: 'Training data',
    definition: 'Data used to train machine learning models, often at very large scale.',
    whyItMatters: 'How training data is sourced remains a major legal and ethical issue for artists.',
  },
]

export const ipAgeOfAiResourceCatalog = {
  'copyright-office': {
    title: 'U.S. Copyright Office',
    description: 'Official copyright basics, registration, and policy updates.',
    url: 'https://www.copyright.gov/',
    category: 'Copyright',
  },
  'copyright-ccb': {
    title: 'Copyright Claims Board',
    description: 'Small-claims copyright process overview and filing guidance.',
    url: 'https://www.copyright.gov/about/small-claims/',
    category: 'Copyright',
  },
  'dmca-overview': {
    title: 'DMCA overview',
    description: 'General reference on DMCA notice-and-takedown process.',
    url: 'https://www.copyright.gov/dmca/',
    category: 'DMCA',
  },
  vla: {
    title: 'Volunteer Lawyers for the Arts',
    description: 'Pro bono and reduced-cost legal help pathways for artists.',
    url: 'https://vlany.org/',
    category: 'Legal Clinics',
  },
  'creative-commons': {
    title: 'Creative Commons',
    description: 'Licensing models and educational materials for creators.',
    url: 'https://creativecommons.org/',
    category: 'Artist Resources',
  },
  wipo: {
    title: 'WIPO intellectual property basics',
    description: 'Global introductory resources for creators and cultural workers.',
    url: 'https://www.wipo.int/about-ip/en/',
    category: 'Artist Resources',
  },
  'law-for-creators': {
    title: 'Law for Creators',
    description: 'Readable primer for negotiating and documenting creative agreements.',
    url: 'https://lawforcreators.com/',
    category: 'Contracts',
  },
  'partnership-ai': {
    title: 'Partnership on AI',
    description: 'Multi-stakeholder resources on AI standards and policy.',
    url: 'https://partnershiponai.org/',
    category: 'AI',
  },
  'fair-use-stanford': {
    title: 'Stanford Copyright & Fair Use overview',
    description: 'Educational overview of fair use factors (U.S. context).',
    url: 'https://fairuse.stanford.edu/overview/fair-use/four-factors/',
    category: 'Copyright',
  },
  nightshade: {
    title: 'Nightshade (University of Chicago)',
    description: 'Research project on tools that may affect how some models interpret certain image data.',
    url: 'https://nightshade.cs.uchicago.edu/',
    category: 'AI',
  },
} satisfies Record<string, ResourceLink>

export const ipAgeOfAiResources: ResourceLink[] = Object.values(ipAgeOfAiResourceCatalog)

export function getIpAgeOfAiResourcesByKeys(keys: string[]): ResourceLink[] {
  return keys
    .map((key) => ipAgeOfAiResourceCatalog[key as keyof typeof ipAgeOfAiResourceCatalog])
    .filter((entry): entry is ResourceLink => Boolean(entry))
}

export type WorkshopBuildStatus = 'done' | 'partial' | 'pending'

export const ipAgeOfAiModuleAudit: Array<{
  moduleId: string
  title: string
  build: Record<string, WorkshopBuildStatus>
  content: WorkshopBuildStatus
  nextStep: string
}> = [
  {
    moduleId: 'module-1',
    title: 'The New Reality of Creative Risk',
    build: {
      shell: 'done',
      triage: 'done',
      scenarioLab: 'partial',
      transcript: 'partial',
      video: 'pending',
    },
    content: 'partial',
    nextStep:
      'QA ingested v1 text against the master recording; adjust chapter marker times; add final hosted video URL and poster when the clip is locked.',
  },
  {
    moduleId: 'module-2',
    title: 'Copyright Basics Artists Actually Need',
    build: {
      shell: 'done',
      triage: 'done',
      resourceLinks: 'done',
      transcript: 'partial',
      video: 'pending',
    },
    content: 'partial',
    nextStep:
      'QA module 2 ingest against final transcript cut; refine chapter marker timing; add hosted clip URL/poster.',
  },
  {
    moduleId: 'module-3',
    title: 'AI Authorship and Human Contribution',
    build: {
      shell: 'done',
      triage: 'done',
      aiSelfAudit: 'done',
      extraChecklist: 'done',
      transcript: 'partial',
      video: 'pending',
    },
    content: 'partial',
    nextStep:
      'QA module 3 ingest with final edit; align chapter markers and add final hosted clip/poster; link to published worksheet asset once available.',
  },
  {
    moduleId: 'module-4',
    title: 'Fair Use, Scraping, and Training Data',
    build: {
      shell: 'done',
      triage: 'done',
      publishChecklist: 'done',
      resourceLinks: 'done',
      transcript: 'partial',
      video: 'pending',
    },
    content: 'partial',
    nextStep:
      'QA module 4 ingest with final edit; spot-check resource URLs; add hosted clip URL/poster when ready.',
  },
  {
    moduleId: 'module-5',
    title: 'Contracts as Creative Protection',
    build: {
      shell: 'done',
      triage: 'done',
      clauseSelector: 'done',
      signChecklist: 'done',
      practiceTip: 'done',
      transcript: 'partial',
      video: 'pending',
    },
    content: 'partial',
    nextStep:
      'Ingest or merge second clip (70:30–76:45); QA full module 5 text; add hosted video URL/poster for both segments if split.',
  },
  {
    moduleId: 'module-6',
    title: 'Name, Image, Voice, and Likeness',
    build: {
      shell: 'done',
      triage: 'done',
      consentChecklist: 'done',
      practiceTip: 'done',
      transcript: 'partial',
      video: 'pending',
    },
    content: 'partial',
    nextStep:
      'Merge second clip (61:15–64:25); QA module 6 with Florida-specific examples if desired; add hosted video URL/poster.',
  },
  {
    moduleId: 'module-7',
    title: 'Responding to Misuse',
    build: {
      shell: 'done',
      triage: 'done',
      ladder: 'done',
      scenarioPreview: 'done',
      dmcaChecklist: 'done',
      transcript: 'partial',
      video: 'pending',
    },
    content: 'partial',
    nextStep:
      'Merge second clip (44:30–45:20); QA ingest against final edit; add hosted video URL/poster.',
  },
  {
    moduleId: 'module-8',
    title: 'Building an Artist Rights Toolkit',
    build: {
      shell: 'done',
      triage: 'done',
      scenarioLabFull: 'done',
      toolkit: 'partial',
      completion: 'done',
      transcript: 'partial',
      video: 'pending',
    },
    content: 'partial',
    nextStep:
      'Merge extended closing (76:45–78:45); replace toolkit placeholders with downloadable files; add hosted video URL/poster.',
  },
]

export const ipAgeOfAiScenarioLab: ScenarioItem[] = [
  {
    id: 'reposted-work',
    scenario: 'Someone reposted my work',
    rightsInvolved: ['Copyright', 'Attribution expectations', 'Platform policy'],
    evidenceToCollect: ['Screenshot', 'URL', 'Account handle', 'Date and time'],
    firstStep: 'Request correction or removal and file a platform report if needed.',
    whenToEscalate: 'Escalate if reposting continues, monetization appears, or context is damaging.',
    relatedTemplate: 'Infringement Evidence Log',
  },
  {
    id: 'selling-my-work',
    scenario: 'Someone is selling my work',
    rightsInvolved: ['Copyright', 'Derivative rights', 'Trademark/signature issues'],
    evidenceToCollect: ['Product pages', 'Pricing', 'Seller identity', 'Order confirmations'],
    firstStep: 'Document listings and submit DMCA/takedown requests where applicable.',
    whenToEscalate: 'Escalate when commercial scale or reputational harm is substantial.',
    relatedTemplate: 'Demand Letter Prep Worksheet',
  },
  {
    id: 'client-uses-ai',
    scenario: 'A client wants to use AI',
    rightsInvolved: ['Contract rights', 'Disclosure obligations', 'Derivative permissions'],
    evidenceToCollect: ['Scope brief', 'Contract drafts', 'Tool disclosures'],
    firstStep: 'Clarify AI scope in contract terms before production begins.',
    whenToEscalate: 'Escalate if ownership terms are unclear or rights transfer is overbroad.',
    relatedTemplate: 'Contract Clause Starter Pack',
  },
  {
    id: 'voice-cloned',
    scenario: 'My voice or likeness was cloned',
    rightsInvolved: ['Right of publicity', 'Appropriation', 'Trademark and false endorsement'],
    evidenceToCollect: ['Audio/video captures', 'Distribution links', 'Audience confusion evidence'],
    firstStep: 'Preserve evidence and send immediate platform reports.',
    whenToEscalate: 'Escalate quickly if identity misuse affects livelihood or safety.',
    relatedTemplate: 'Voice/Likeness Consent Checklist',
  },
  {
    id: 'sell-physical-art',
    scenario: 'I am selling a physical artwork',
    rightsInvolved: ['Object ownership', 'Copyright retention', 'Reproduction rights'],
    evidenceToCollect: ['Invoice', 'Email terms', 'Signed agreement'],
    firstStep: 'State that sale is for the object and rights are retained unless licensed.',
    whenToEscalate: 'Escalate if buyer reproduces or licenses work without permission.',
    relatedTemplate: 'Before You Sell Artwork Checklist',
  },
  {
    id: 'license-an-image',
    scenario: 'I am licensing an image',
    rightsInvolved: ['License scope', 'Territory', 'Duration', 'Derivative restrictions'],
    evidenceToCollect: ['Usage specs', 'Payment terms', 'Contract version history'],
    firstStep: 'Define medium, duration, territory, and no-training restrictions in writing.',
    whenToEscalate: 'Escalate when use exceeds agreed scope or payment terms are breached.',
    relatedTemplate: 'Contract Clause Starter Pack',
  },
  {
    id: 'unclear-contract',
    scenario: 'A contract has unclear ownership language',
    rightsInvolved: ['Assignment versus license', 'Moral rights references', 'Governing law'],
    evidenceToCollect: ['Drafts', 'Redlines', 'Email clarifications'],
    firstStep: 'Pause signing and request plain-language clarification in writing.',
    whenToEscalate: 'Escalate before signing if clauses remain ambiguous.',
    relatedTemplate: 'Before You Sign Checklist',
  },
]

export const ipAgeOfAiToolkitAssets: ToolkitAsset[] = [
  {
    title: 'Artist Rights Quickstart Guide',
    description: 'A quick orientation to rights, risk, and response pathways.',
    status: 'Download coming soon',
  },
  {
    title: 'Before You Publish Checklist',
    description: 'Publishing safeguards for images, captions, and metadata.',
    status: 'Download coming soon',
  },
  {
    title: 'Before You Sell Artwork Checklist',
    description: 'Sale terms checklist covering object ownership and rights retention.',
    status: 'Download coming soon',
  },
  {
    title: 'AI Use Documentation Worksheet',
    description: 'Track human creative choices and AI technical assistance.',
    status: 'Open worksheet',
  },
  {
    title: 'Contract Clause Starter Pack',
    description: 'Plain-language clause prompts for artist agreements.',
    status: 'Open worksheet',
  },
  {
    title: 'Infringement Evidence Log',
    description: 'Structured log for URLs, screenshots, timestamps, and actions.',
    status: 'Open worksheet',
  },
  {
    title: 'DMCA Takedown Prep Sheet',
    description: 'Step-by-step prep before submitting a takedown request.',
    status: 'Download coming soon',
  },
  {
    title: 'Demand Letter Prep Worksheet',
    description: 'Organize facts and claims before seeking legal review.',
    status: 'Open worksheet',
  },
  {
    title: 'Artist Legal Resource Directory',
    description: 'Legal clinics, education links, and support pathways.',
    status: 'Download coming soon',
  },
]

export const transcriptSegments = [
  {
    moduleId: 'module-1',
    title: 'Opening Scenario and Creative Risk',
    sourceStartTime: '3:30',
    sourceEndTime: '13:55',
    suggestedVideoTitle: module1VideoSuggestedTitle,
    rawTranscript: module1RawTranscript,
    cleanedTranscript: module1CleanedTranscript,
    lessonText: module1LessonText,
    lessonSummary: module1LessonSummary,
    pullQuotes: module1PullQuotes,
    keyTerms: module1KeyTerms,
    chapterMarkers: module1ChapterMarkers,
  },
  {
    moduleId: 'module-2',
    title: 'Copyright Basics and Enforcement Tools',
    sourceStartTime: '43:50',
    sourceEndTime: '47:55',
    suggestedVideoTitle: module2VideoSuggestedTitle,
    rawTranscript: module2RawTranscript,
    cleanedTranscript: module2CleanedTranscript,
    lessonText: module2LessonText,
    lessonSummary: module2LessonSummary,
    pullQuotes: module2PullQuotes,
    keyTerms: module2KeyTerms,
    chapterMarkers: module2ChapterMarkers,
  },
  {
    moduleId: 'module-3',
    title: 'Human Authorship and AI Contribution',
    sourceStartTime: '20:45',
    sourceEndTime: '28:30',
    suggestedVideoTitle: module3VideoSuggestedTitle,
    rawTranscript: module3RawTranscript,
    cleanedTranscript: module3CleanedTranscript,
    lessonText: module3LessonText,
    lessonSummary: module3LessonSummary,
    pullQuotes: module3PullQuotes,
    keyTerms: module3KeyTerms,
    chapterMarkers: module3ChapterMarkers,
  },
  {
    moduleId: 'module-4',
    title: 'Fair Use, Scraping, and Uncertainty',
    sourceStartTime: '28:30',
    sourceEndTime: '35:55',
    suggestedVideoTitle: module4VideoSuggestedTitle,
    rawTranscript: module4RawTranscript,
    cleanedTranscript: module4CleanedTranscript,
    lessonText: module4LessonText,
    lessonSummary: module4LessonSummary,
    pullQuotes: module4PullQuotes,
    keyTerms: module4KeyTerms,
    chapterMarkers: module4ChapterMarkers,
  },
  {
    moduleId: 'module-5',
    title: 'Contracts as Preventive Protection',
    sourceStartTime: '47:55',
    sourceEndTime: '60:45',
    suggestedVideoTitle: module5VideoSuggestedTitle,
    rawTranscript: module5RawTranscript,
    cleanedTranscript: module5CleanedTranscript,
    lessonText: module5LessonText,
    lessonSummary: module5LessonSummary,
    pullQuotes: module5PullQuotes,
    keyTerms: module5KeyTerms,
    chapterMarkers: module5ChapterMarkers,
  },
  {
    moduleId: 'module-6',
    title: 'Publicity Rights and Identity Misuse',
    sourceStartTime: '35:55',
    sourceEndTime: '43:50',
    suggestedVideoTitle: module6VideoSuggestedTitle,
    rawTranscript: module6RawTranscript,
    cleanedTranscript: module6CleanedTranscript,
    lessonText: module6LessonText,
    lessonSummary: module6LessonSummary,
    pullQuotes: module6PullQuotes,
    keyTerms: module6KeyTerms,
    chapterMarkers: module6ChapterMarkers,
  },
  {
    moduleId: 'module-7',
    title: 'Responding to Misuse',
    sourceStartTime: '13:55',
    sourceEndTime: '20:40',
    suggestedVideoTitle: module7VideoSuggestedTitle,
    rawTranscript: module7RawTranscript,
    cleanedTranscript: module7CleanedTranscript,
    lessonText: module7LessonText,
    lessonSummary: module7LessonSummary,
    pullQuotes: module7PullQuotes,
    keyTerms: module7KeyTerms,
    chapterMarkers: module7ChapterMarkers,
  },
  {
    moduleId: 'module-8',
    title: 'Building an Artist Rights Toolkit',
    sourceStartTime: '60:20',
    sourceEndTime: '61:15',
    suggestedVideoTitle: module8VideoSuggestedTitle,
    rawTranscript: module8RawTranscript,
    cleanedTranscript: module8CleanedTranscript,
    lessonText: module8LessonText,
    lessonSummary: module8LessonSummary,
    pullQuotes: module8PullQuotes,
    keyTerms: module8KeyTerms,
    chapterMarkers: module8ChapterMarkers,
  },
]

export function getIpAgeOfAiModuleById(moduleId: string) {
  return ipAgeOfAiModules.find((module) => module.id === moduleId)
}
