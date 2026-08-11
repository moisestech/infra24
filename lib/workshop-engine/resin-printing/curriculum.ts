import type { Workshop, WorkshopModule } from '@/lib/workshop-engine/types'
import {
  RESIN_BOOKLET_ID,
  resinBookletRef,
} from '@/lib/workshop-engine/resin-printing/booklet'
import {
  RESIN_HERO_MEDIA,
  RESIN_MODULE_MEDIA_IDS,
  RESIN_MODULE_PRIMARY_MEDIA,
  RESIN_MODULE_TUTORIAL_VIDEOS,
} from '@/lib/workshop-engine/resin-printing/media'
import { RESIN_MODULE_BANNERS } from '@/lib/workshop-engine/resin-printing/banners'
import {
  DEFAULT_MODULE_VISUAL,
  RESIN_MODULE_VISUALS,
} from '@/lib/workshop-engine/resin-printing/theme'

const RESIN_PRINTING_MODULES_BASE: WorkshopModule[] = [
  {
    id: 'welcome',
    slug: 'welcome',
    order: 0,
    title: 'Welcome & Join',
    estimatedMinutes: 10,
    promise: 'Know what the class covers and what it does not certify.',
    keyIdeas: [
      'This is preparation for a supervised print appointment — not independent operator certification.',
      'You can Follow class with the facilitator or work at My pace.',
      'Resin equipment stays instructor-led for this beginner workshop.',
    ],
    watchNotice: 'Join QR on the TV, meet facilitators, and hear the expectation statement.',
    discussionPrompt: 'What do you hope to print, and are you following the class or moving at your own pace?',
    tips: [
      'Scan the TV QR or use the backup join card — both open the same participant session.',
      'My pace never authorizes independent equipment use.',
    ],
    physicalSample: 'Printed join sign / QR backup card',
    activity: {
      kind: 'choice',
      prompt: 'Choose how you want to move through class tonight.',
      items: ['Follow class', 'My pace'],
    },
    knowledgeCheck: {
      prompt: 'Finishing tonight’s modules certifies you to operate the resin printer alone.',
      options: [
        {
          id: 'a',
          label: 'True',
          explanation: 'This workshop prepares you for a supervised appointment — it is not operator certification.',
        },
        {
          id: 'b',
          label: 'False',
          correct: true,
          explanation: 'You learn the workflow and prepare a project; equipment stays instructor-led.',
        },
      ],
    },
    bookletRefs: [
      resinBookletRef({
        sectionTitle: 'Index',
        startPage: 2,
        status: 'verified',
      }),
      resinBookletRef({
        sectionTitle: 'Ready to Print? Start Here.',
        startPage: 43,
        status: 'verified',
      }),
      resinBookletRef({
        sectionTitle: 'Back cover / contacts',
        startPage: 44,
        status: 'verified',
        note: 'Supporting reference.',
      }),
    ],
    safetyLevel: 'note',
    safetyNote: 'You will learn the full workflow. You will not independently operate resin equipment tonight.',
    facilitatorNotes: [
      'Open join screen on TVs.',
      'State expectation statement aloud.',
      'Confirm everyone picked Follow class or My pace.',
      'Avoid featuring cover page 1 until independent-use wording is corrected.',
    ],
    tvPrompt: 'Scan to join. Choose Follow class or My pace.',
  },
  {
    id: 'why-resin',
    slug: 'why-resin',
    order: 1,
    title: 'Why Resin?',
    estimatedMinutes: 15,
    promise: 'Decide whether resin is appropriate for an artwork.',
    keyIdeas: [
      'Resin excels at fine detail and smooth surfaces at smaller scales.',
      'Trade-offs include brittleness, cost, and liquid-resin safety overhead.',
      'Some projects need FDM, fabrication, or a consultation instead.',
    ],
    watchNotice: 'Compare successful art objects at different scales and detail levels.',
    discussionPrompt: 'What detail, scale, or surface quality makes this project a resin candidate?',
    tips: [
      'Ask what fails first: detail, strength, cost, or outdoor durability.',
      'A consultation is a valid outcome — not a failure.',
    ],
    physicalSample: 'Successful cured prints with scale reference',
    activity: {
      kind: 'classify',
      prompt: 'Match each project example to resin, not resin, or needs consultation.',
      items: [
        'Jewelry-scale pendant with hair-fine relief',
        'Large outdoor garden stool',
        'Hollow figurative bust with unknown wall thickness',
      ],
      labels: ['resin', 'not resin', 'consultation'],
    },
    knowledgeCheck: {
      prompt: 'Resin is usually the best default for every sculpture scale.',
      options: [
        {
          id: 'a',
          label: 'True',
          explanation: 'Scale, strength, cost, and outdoor durability often push projects to other processes.',
        },
        {
          id: 'b',
          label: 'False',
          correct: true,
          explanation: 'Resin is a fit decision — detail and surface quality vs. size, toughness, and post-processing.',
        },
      ],
    },
    bookletRefs: [
      resinBookletRef({
        sectionTitle: 'From 3D Model to Resin Print',
        startPage: 3,
        status: 'verified',
      }),
      resinBookletRef({
        sectionTitle: 'Is Your Model Ready to Print?',
        startPage: 13,
        endPage: 15,
        status: 'verified',
      }),
      resinBookletRef({
        sectionTitle: 'Estimate Resin Before You Print',
        startPage: 17,
        status: 'verified',
        note: 'Supporting reference.',
      }),
      resinBookletRef({
        sectionTitle: 'Oolite Cost-Recovery Policy',
        startPage: 19,
        status: 'verified',
        note: 'Supporting reference.',
      }),
      resinBookletRef({
        sectionTitle: 'How Resin Color Works',
        startPage: 30,
        endPage: 31,
        status: 'verified',
        note: 'Supporting reference.',
      }),
    ],
    safetyLevel: 'none',
    facilitatorNotes: [
      'Hold up scale samples.',
      'Do not oversell resin for large structural work.',
    ],
    tvPrompt: 'When is resin the right tool — and when is it not?',
  },
  {
    id: 'safety-zones',
    slug: 'safety-zones',
    order: 2,
    title: 'Safety & Zones',
    estimatedMinutes: 20,
    promise: 'Distinguish cured from uncured resin and identify clean vs controlled zones.',
    keyIdeas: [
      'Uncured resin requires PPE, containment, and instructor-led handling.',
      'Clean participant zone vs controlled resin zone are separate.',
      'Stop-work conditions override the schedule.',
    ],
    watchNotice: 'Full-screen room-zone diagram and PPE demonstration.',
    discussionPrompt: 'Which objects belong in the clean zone, which belong in the controlled zone, and who may handle them?',
    tips: [
      'If you are unsure which zone an object belongs in, leave it and ask.',
      'Stop-work conditions override the schedule — say something early.',
    ],
    physicalSample: 'PPE set, zone markers, waste/spill setup, SDS reference',
    activity: {
      kind: 'checklist',
      prompt: 'Confirm each safety statement before continuing.',
      items: [
        'Uncured resin is not skin-safe.',
        'Controlled zone work is instructor-led tonight.',
        'I know where PPE and spill supplies live.',
        'Cured prints are different from wet/uncured parts.',
        'I will not operate the printer independently after class.',
      ],
    },
    knowledgeCheck: {
      prompt: 'Who operates the printer and handles uncured resin in this beginner workshop?',
      options: [
        {
          id: 'a',
          label: 'Any participant who finished the safety check',
          explanation: 'Completion is not operator certification.',
        },
        {
          id: 'b',
          label: 'Instructors only in the controlled resin zone',
          correct: true,
          explanation: 'Participants learn the workflow and prepare projects for supervised appointments.',
        },
      ],
    },
    bookletRefs: [
      resinBookletRef({
        sectionTitle: 'Resin, Color, Safety, and Cleanup',
        startPage: 29,
        status: 'verified',
      }),
      resinBookletRef({
        sectionTitle: 'Bringing Your Own Resin / Print → Wash → Cure / Cured vs Uncured',
        startPage: 32,
        endPage: 34,
        status: 'verified',
      }),
      resinBookletRef({
        sectionTitle: 'Waste Streams and Storage',
        startPage: 36,
        status: 'verified',
      }),
      resinBookletRef({
        sectionTitle: 'FAQ — resin/cleanup',
        startPage: 37,
        status: 'verified',
        note: 'Supporting reference. Logical page 35 is missing from this export.',
      }),
    ],
    safetyLevel: 'required',
    safetyNote:
      'Uncured resin, machine operation, build-plate removal, washing, curing, spills, and waste remain instructor-led.',
    facilitatorNotes: [
      'Demonstrate PPE without rushing.',
      'Point to clean vs controlled zones.',
      'Name the venue stop-work condition.',
    ],
    tvPrompt: 'Clean zone vs controlled resin zone. PPE on before demo.',
  },
  {
    id: 'complete-workflow',
    slug: 'complete-workflow',
    order: 3,
    title: 'Complete Workflow',
    estimatedMinutes: 20,
    promise: 'Explain model → slice → print → wash → cure.',
    keyIdeas: [
      'The pipeline is staged; class does not depend on a live print finishing.',
      'Each stage has its own tools, risks, and quality checks.',
      'File readiness happens before the printer ever starts.',
    ],
    watchNotice: 'Walk the five staged physical pipeline objects.',
    discussionPrompt: 'At which stage could a file problem become a material or safety problem?',
    tips: [
      'Name the stage out loud before you name the tool.',
      'File problems are cheaper to fix than wet-resin problems.',
    ],
    physicalSample: 'Raw file → sliced file → supported print → washed/cured print → finished object',
    activity: {
      kind: 'order',
      prompt: 'Put the five stages in order.',
      items: ['Model / file', 'Slice & support', 'Print', 'Wash', 'Cure / finish'],
      correctOrder: [0, 1, 2, 3, 4],
    },
    knowledgeCheck: {
      prompt: 'Which stage comes immediately after slicing and supports?',
      options: [
        {
          id: 'a',
          label: 'Wash',
          explanation: 'Wash happens after a print exists — not after slicing.',
        },
        {
          id: 'b',
          label: 'Print',
          correct: true,
          explanation: 'Model → slice & support → print → wash → cure / finish.',
        },
        {
          id: 'c',
          label: 'Cure',
          explanation: 'Cure is near the end of the pipeline, after wash.',
        },
      ],
    },
    bookletRefs: [
      resinBookletRef({
        sectionTitle: 'From 3D Model to Resin Print',
        startPage: 3,
        status: 'verified',
      }),
      resinBookletRef({
        sectionTitle: 'Two Workflows at Oolite',
        startPage: 9,
        status: 'verified',
      }),
      resinBookletRef({
        sectionTitle: 'Print → Wash → Cure',
        startPage: 33,
        status: 'verified',
      }),
      resinBookletRef({
        sectionTitle: "Oolite's Resin 3D Printing Workflow",
        startPage: 39,
        status: 'verified',
      }),
    ],
    safetyLevel: 'note',
    safetyNote: 'Wash and cure demos stay instructor-led.',
    facilitatorNotes: [
      'Use staged objects — do not wait on a live print.',
      'Name each stage out loud as you point.',
    ],
    tvPrompt: 'Model → slice → print → wash → cure.',
  },
  {
    id: 'file-readiness',
    slug: 'file-readiness',
    order: 4,
    title: 'Is the File Printable?',
    estimatedMinutes: 25,
    promise: 'Identify scale, geometry, wall, cavity, and fragility problems.',
    keyIdeas: [
      'Units and scale errors are the most common beginner failure.',
      'Thin walls, open geometry, trapped cavities, and fragile details need review.',
      'Ready / repair / consultation is a preparation decision, not a grade.',
    ],
    watchNotice: 'Annotate one good model and one problematic model.',
    discussionPrompt: 'Is this model ready, repairable, or better handled through a consultation—and what evidence supports that decision?',
    tips: [
      'Check units and overall scale before hunting for tiny defects.',
      'Ready / repair / consultation is preparation status — not a grade.',
    ],
    physicalSample: 'Thin wall, open geometry, fragile detail, hollow cavity examples',
    activity: {
      kind: 'classify',
      prompt: 'Mark each sample ready, repair, or consultation.',
      items: [
        'Closed manifold cube at correct mm scale',
        'Figurine with 0.2 mm fingers and no supports plan',
        'Hollow form with no drain holes',
      ],
      labels: ['ready', 'repair', 'consultation'],
    },
    knowledgeCheck: {
      prompt: 'A hollow form with no drain holes is usually ready to print as-is.',
      options: [
        {
          id: 'a',
          label: 'True',
          explanation: 'Trapped resin and wash fluid make undrained hollows a repair or consultation case.',
        },
        {
          id: 'b',
          label: 'False',
          correct: true,
          explanation: 'Drain paths are part of printable readiness for hollow forms.',
        },
      ],
    },
    bookletRefs: [
      resinBookletRef({
        sectionTitle: 'Is Your Model Ready to Print? through Scale and Units',
        startPage: 13,
        endPage: 18,
        status: 'verified',
      }),
      resinBookletRef({
        sectionTitle: 'Final Preflight Checklist',
        startPage: 42,
        status: 'verified',
        note: 'Supporting reference — staff-assisted for this beginner workshop.',
      }),
    ],
    safetyLevel: 'none',
    facilitatorNotes: [
      'Project one good and one bad file on the TV.',
      'Keep language diagnostic, not shaming.',
    ],
    tvPrompt: 'Scale, walls, cavities, fragility — ready, repair, or consult?',
  },
  {
    id: 'slicer-lab',
    slug: 'slicer-lab',
    order: 5,
    title: 'Slicer Lab',
    estimatedMinutes: 40,
    promise: 'Prepare a model using one repeatable sequence.',
    keyIdeas: [
      'One validated slicer + one known-good profile for this venue.',
      'Sequence: import → units/scale → repair → orient → support → hollow → drain → preview → estimate → export.',
      'Exposure settings are venue/profile data, not universal advice.',
    ],
    watchNotice: 'Live slicer demo of the full repeatable sequence.',
    discussionPrompt: 'What changes when we rotate the model, and where will supports leave evidence on the finished object?',
    tips: [
      'Supports leave scars — place them where cleanup is acceptable.',
      'Exporting a slice file is not permission to start the printer.',
    ],
    physicalSample: 'Demo model, validated project file, USB/screenshot backup',
    activity: {
      kind: 'checklist',
      prompt: 'Check off each slicer checkpoint as you reach it.',
      items: [
        'Import sample model',
        'Confirm units and scale',
        'Orient for peel forces',
        'Add supports',
        'Hollow + drain if needed',
        'Preview layers and estimate',
      ],
    },
    knowledgeCheck: {
      prompt: 'Which statement matches this workshop’s slicer lab?',
      options: [
        {
          id: 'a',
          label: 'Any online exposure chart is fine for tonight’s venue profile',
          explanation: 'Use the validated venue profile — exposure is not universal advice.',
        },
        {
          id: 'b',
          label: 'Follow one repeatable sequence on the validated venue profile',
          correct: true,
          explanation: 'One slicer + one known-good profile keeps the room coherent.',
        },
      ],
    },
    bookletRefs: [
      resinBookletRef({
        sectionTitle: 'Understanding the Slicer through Two Workflows',
        startPage: 4,
        endPage: 9,
        status: 'verified',
        note: 'Logical page 10 is missing from this export.',
      }),
      resinBookletRef({
        sectionTitle: 'Slicer Trade-Offs',
        startPage: 11,
        status: 'verified',
      }),
      resinBookletRef({
        sectionTitle: 'Orientation, Supports, and Hollowing',
        startPage: 20,
        endPage: 28,
        status: 'verified',
      }),
      resinBookletRef({
        sectionTitle: 'FAQ — slicers',
        startPage: 12,
        status: 'verified',
        note: 'Supporting reference.',
      }),
    ],
    safetyLevel: 'note',
    safetyNote: 'Exporting a slice file is not permission to start the printer.',
    facilitatorNotes: [
      'Use the exact venue profile label.',
      'Keep a screenshot/video backup ready.',
      'Circulate — do not leave the room mid-demo.',
    ],
    tvPrompt: 'Import → scale → orient → support → hollow → preview → export.',
  },
  {
    id: 'print-wash-cure',
    slug: 'print-wash-cure',
    order: 6,
    title: 'Print, Wash & Cure',
    estimatedMinutes: 20,
    promise: 'Understand machine and post-processing stages without independently operating equipment.',
    keyIdeas: [
      'Build plate, vat, wash, and cure each have distinct hazards.',
      'Participants observe; instructors operate.',
      'Cured parts are handled differently from wet prints.',
    ],
    watchNotice: 'Instructor-only staged demo of print/wash/cure stations.',
    discussionPrompt: 'What happens at each station, what is the hazard, and who operates it during this workshop?',
    tips: [
      'Stay in the clean zone unless an instructor invites you closer.',
      'Narrate the hazard at each station before the action.',
    ],
    physicalSample: 'Build plate, vat, wash station, curing station, removal tools',
    activity: {
      kind: 'classify',
      prompt: 'Which stage does each tool belong to?',
      items: ['Plastic scraper', 'IPA wash basket', 'Cure turntable', 'Resin vat'],
      labels: ['print/removal', 'wash', 'cure', 'print'],
    },
    knowledgeCheck: {
      prompt: 'During this beginner workshop, who operates print, wash, and cure equipment?',
      options: [
        {
          id: 'a',
          label: 'Participants who finished the slicer checklist',
          explanation: 'Checklists prepare projects; they do not authorize machine operation.',
        },
        {
          id: 'b',
          label: 'Instructors only — participants observe from the clean zone',
          correct: true,
          explanation: 'Stations are instructor-led; participants learn roles and hazards.',
        },
      ],
    },
    bookletRefs: [
      resinBookletRef({
        sectionTitle: 'Print → Wash → Cure / Cured vs Uncured',
        startPage: 33,
        endPage: 34,
        status: 'verified',
      }),
      resinBookletRef({
        sectionTitle: 'Waste Streams and Storage',
        startPage: 36,
        status: 'verified',
      }),
      resinBookletRef({
        sectionTitle: 'Resin, Color, Safety, and Cleanup',
        startPage: 29,
        status: 'verified',
        note: 'Supporting reference.',
      }),
    ],
    safetyLevel: 'required',
    safetyNote: 'Do not touch uncured resin, vats, or running equipment. Instructor demo only.',
    facilitatorNotes: [
      'Keep participants in the clean zone.',
      'Narrate PPE and spill response while demonstrating.',
    ],
    tvPrompt: 'Instructor demo only — print, wash, cure stations.',
  },
  {
    id: 'failure-clinic',
    slug: 'failure-clinic',
    order: 7,
    title: 'Failure Clinic',
    estimatedMinutes: 12,
    promise: 'Diagnose evidence without assuming one universal cause.',
    keyIdeas: [
      'Failures are evidence plus contributing factors — not a single guaranteed diagnosis.',
      'Look at stage: plate/film, supports, exposure, wash/cure, design.',
      'Cured failure samples are teaching objects, not trash.',
    ],
    watchNotice: 'Show cured failed prints one at a time.',
    discussionPrompt: 'What evidence do we see, at what stage did it appear, and what is the smallest useful next test?',
    tips: [
      'Name the evidence before naming a cause.',
      'One failure can have several contributing factors — avoid “always means.”',
    ],
    physicalSample: 'Plate/film failure, detached object, crack, white bloom, warp/soft detail',
    activity: {
      kind: 'classify',
      prompt: 'Choose the likely stage for each failure sample.',
      items: [
        'Nothing stuck to the plate',
        'Part detached mid-print',
        'White bloom after wash',
        'Soft detail / undercured look',
      ],
      labels: ['plate/film or exposure', 'supports/orientation', 'wash/IPA', 'cure'],
    },
    knowledgeCheck: {
      prompt: 'The best first move when inspecting a failed print is to:',
      options: [
        {
          id: 'a',
          label: 'Declare a single universal cause',
          explanation: 'Skip certainty — start with observable evidence and stage.',
        },
        {
          id: 'b',
          label: 'Describe the evidence and the stage where it showed up',
          correct: true,
          explanation: 'Evidence + stage narrows useful next tests without overclaiming.',
        },
      ],
    },
    bookletRefs: [
      resinBookletRef({
        sectionTitle: 'What Watertight Means',
        startPage: 14,
        status: 'related',
        note: 'Related guide pages only — the booklet does not contain the full five-failure diagnostic exercise.',
      }),
      resinBookletRef({
        sectionTitle: 'Orientation: The Angle Matters',
        startPage: 21,
        status: 'related',
      }),
      resinBookletRef({
        sectionTitle: 'Too Few vs Too Many Supports',
        startPage: 24,
        endPage: 25,
        status: 'related',
      }),
      resinBookletRef({
        sectionTitle: 'Drain Holes Are Not Optional',
        startPage: 27,
        status: 'related',
      }),
      resinBookletRef({
        sectionTitle: 'Cured vs Uncured',
        startPage: 34,
        status: 'related',
      }),
      resinBookletRef({
        sectionTitle: 'FAQ — resin/cleanup',
        startPage: 37,
        status: 'related',
        note: 'Supporting related reference.',
      }),
    ],
    safetyLevel: 'none',
    facilitatorNotes: [
      'Avoid “this always means X” language.',
      'Invite participants to name evidence first.',
      'Do not imply the booklet covers the full failure clinic.',
    ],
    tvPrompt: 'Evidence first. Then likely stage and factors.',
  },
  {
    id: 'project-readiness',
    slug: 'project-readiness',
    order: 8,
    title: 'Project Readiness',
    estimatedMinutes: 8,
    promise: 'Know the next step for a supervised print appointment.',
    keyIdeas: [
      'Exit with ready / repair / consultation — not operator certification.',
      'Appointment pathway is venue-specific.',
      'Resources and booklet stay available after class.',
    ],
    watchNotice: 'Recap, resource QR, appointment pathway.',
    discussionPrompt: 'Is your project ready, in need of repair, or in need of consultation—and what is your next documented step?',
    tips: [
      'Write one next step you can actually book or complete this week.',
      'Ready means ready for staff review / supervised time — not solo operation.',
    ],
    physicalSample: 'Appointment checklist and resource QR backup',
    activity: {
      kind: 'readiness',
      prompt: 'Select your project status and next step.',
      items: ['Ready for supervised appointment', 'Needs repair first', 'Needs consultation'],
    },
    knowledgeCheck: {
      prompt: 'Selecting “Ready” tonight means:',
      options: [
        {
          id: 'a',
          label: 'You may start the printer independently after class',
          explanation: 'Ready is preparation for supervised time — not certification.',
        },
        {
          id: 'b',
          label: 'You are prepared to book or attend a supervised print appointment',
          correct: true,
          explanation: 'Exit status is about the appointment pathway, not solo machine use.',
        },
      ],
    },
    bookletRefs: [
      resinBookletRef({
        sectionTitle: 'Access, Scheduling, and Documentation through Ready to Print?',
        startPage: 38,
        endPage: 43,
        status: 'verified',
      }),
      resinBookletRef({
        sectionTitle: 'Is Your Model Ready to Print?',
        startPage: 13,
        status: 'verified',
        note: 'Supporting reference.',
      }),
      resinBookletRef({
        sectionTitle: 'Estimate Resin Before You Print',
        startPage: 17,
        status: 'verified',
        note: 'Supporting reference.',
      }),
      resinBookletRef({
        sectionTitle: 'Oolite Cost-Recovery Policy',
        startPage: 19,
        status: 'verified',
        note: 'Supporting reference.',
      }),
    ],
    safetyLevel: 'note',
    safetyNote: 'A readiness summary is preparation status — not a license to operate equipment alone.',
    facilitatorNotes: [
      'Push resource QR on TVs.',
      'Collect readiness outcomes if tracking appointments.',
      'Mark session complete when done.',
    ],
    tvPrompt: 'Ready · Repair · Consultation — then book supervised print time.',
  },
]

export const RESIN_PRINTING_MODULES: WorkshopModule[] = RESIN_PRINTING_MODULES_BASE.map(
  (m) => ({
    ...m,
    visual: RESIN_MODULE_VISUALS[m.id] ?? DEFAULT_MODULE_VISUAL,
    primaryMedia: RESIN_MODULE_PRIMARY_MEDIA[m.id],
    banner: RESIN_MODULE_BANNERS[m.id],
    mediaIds: RESIN_MODULE_MEDIA_IDS[m.id],
    tutorialVideo: RESIN_MODULE_TUTORIAL_VIDEOS[m.id],
  })
)

export const RESIN_PRINTING_WORKSHOP: Workshop = {
  slug: 'resin-printing',
  title: 'Intro to 3D Resin Printing for Artists',
  promise:
    'Prepare a project, make informed slicing decisions, understand the complete workflow, and arrive ready for a supervised print appointment.',
  audience: 'Beginner artists and makers (no prior resin experience required)',
  durationMinutes: 180,
  capacity: 8,
  safetyBoundary:
    'Participants learn the complete workflow but do not independently operate resin equipment.',
  expectationStatement:
    'Tonight you will not be certified to operate the printer alone. You will learn how to prepare a project, make informed slicing decisions, understand the complete workflow, and arrive ready for a supervised print appointment.',
  facilitators: ['Moises Sanabria', 'Fabiola Larios'],
  moduleIds: RESIN_PRINTING_MODULES.map((m) => m.id),
  resourceIds: [
    'booklet-print-spreads',
    'sample-stl',
    'slicer-link',
    'photon-workshop',
    'readiness-checklist',
    'glossary',
    'media-shot-list',
  ],
  venueConfigIds: ['oolite', 'bakehouse'],
  bookletId: RESIN_BOOKLET_ID,
  heroMedia: RESIN_HERO_MEDIA,
}

export const RESIN_BREAK_MODULE = {
  id: 'break',
  title: 'Break',
  estimatedMinutes: 10,
  tvPrompt: 'Break — stretch, water, glossary optional. Next module coming up.',
} as const

export function getResinModuleBySlug(slug: string): WorkshopModule | undefined {
  return RESIN_PRINTING_MODULES.find((m) => m.slug === slug)
}

export function getResinModuleById(id: string): WorkshopModule | undefined {
  return RESIN_PRINTING_MODULES.find((m) => m.id === id)
}

export function getResinModuleNav(slug: string) {
  const index = RESIN_PRINTING_MODULES.findIndex((m) => m.slug === slug)
  if (index < 0) return { prev: null, next: null, index: -1 }
  return {
    index,
    prev: index > 0 ? RESIN_PRINTING_MODULES[index - 1] : null,
    next: index < RESIN_PRINTING_MODULES.length - 1 ? RESIN_PRINTING_MODULES[index + 1] : null,
  }
}
