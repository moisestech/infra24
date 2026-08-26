import type {
  ModuleTechniqueBoards,
  WorkshopMedia,
} from '@/lib/workshop-engine/types'
import { RESIN_CONCEPT_CDN } from '@/lib/workshop-engine/resin-printing/cloudinary'

export const TECHNIQUE_BOARD_SIZE = {
  width: 1672,
  height: 941,
} as const

function board(
  id: keyof typeof RESIN_CONCEPT_CDN,
  partial: Omit<
    WorkshopMedia,
    'id' | 'src' | 'width' | 'height' | 'kind' | 'evidenceLevel' | 'productionStatus'
  > & {
    role?: WorkshopMedia['role']
  }
): WorkshopMedia {
  return {
    id,
    src: RESIN_CONCEPT_CDN[id],
    width: TECHNIQUE_BOARD_SIZE.width,
    height: TECHNIQUE_BOARD_SIZE.height,
    kind: 'illustration',
    evidenceLevel: 'conceptual',
    productionStatus: 'draft-teaching-board',
    zoomable: true,
    role: 'lesson',
    ...partial,
  }
}

const SAFETY =
  'Participants prepare and observe. Instructors operate equipment and handle uncured resin. Ready means ready for staff review — not unsupervised machine access.'

export const RESIN_MODULE_TECHNIQUE_BOARDS: Record<string, ModuleTechniqueBoards> =
  {
    welcome: {
      title: 'Participant path',
      intro:
        'How tonight’s modules lead to a supervised appointment — not operator certification.',
      layout: 'primary',
      safetyNote: SAFETY,
      boards: [
        board('200-m00-participant-path', {
          alt: 'Conceptual participant path from join through modules to a supervised appointment.',
          caption: 'Participant path',
          prompt: 'Where does tonight end — and what comes after class?',
          longDescription:
            'A conceptual map of join, pace choice, modules, and supervised fabrication. No exact schedule or machine authorization is implied.',
          doAvoid: {
            do: [
              'Choose Follow class or My pace for learning flow',
              'Treat class completion as preparation for staff review',
            ],
            avoid: [
              'Assuming class completion authorizes solo printer use',
              'Skipping the expectation statement',
            ],
          },
          panelCrops: [
            {
              id: 'join',
              label: 'Join',
              objectPosition: 'left center',
              prompt: 'Scan or enter the join code to open your session.',
            },
            {
              id: 'pace',
              label: 'Pace',
              objectPosition: 'center',
              prompt: 'Follow class or My pace changes navigation, not machine rights.',
            },
            {
              id: 'next',
              label: 'Next',
              objectPosition: 'right center',
              prompt: 'Exit paths lead to supervised fabrication, not certification.',
            },
          ],
          regions: [
            {
              id: 'path',
              label: 'Path',
              x: 8,
              y: 20,
              w: 40,
              h: 20,
              note: 'HTML titles stay outside the image.',
            },
          ],
        }),
      ],
    },
    'why-resin': {
      title: 'Process choice',
      intro:
        'Decide whether resin fits the artwork — consultation is a valid outcome.',
      layout: 'primary',
      safetyNote: SAFETY,
      boards: [
        board('201-m01-process-choice', {
          alt: 'Conceptual comparison of resin, other processes, and consultation.',
          caption: 'Process choice',
          prompt: 'What makes this project a resin candidate versus another process?',
          longDescription:
            'Illustrative process pathways. Dimensions and material claims in any baked labels are fictional examples — use HTML discussion points.',
          doAvoid: {
            do: [
              'Name detail, scale, durability, and safety overhead',
              'Accept consultation when fit is unclear',
            ],
            avoid: [
              'Defaulting to resin for every sculpture scale',
              'Treating this board as a cost or strength calculator',
            ],
          },
          panelCrops: [
            {
              id: 'resin',
              label: 'Resin',
              objectPosition: 'left center',
              prompt: 'Fine detail and smooth surfaces at smaller scales.',
            },
            {
              id: 'other',
              label: 'Other',
              objectPosition: 'center',
              prompt: 'Larger or structural work may need another process.',
            },
            {
              id: 'consult',
              label: 'Consult',
              objectPosition: 'right center',
              prompt: 'Staff review when the fit is unclear.',
            },
          ],
        }),
      ],
    },
    'safety-zones': {
      title: 'Zone behaviors',
      intro:
        'Clean participant zone vs controlled resin zone. Venue SDS and instructor demo remain the authority.',
      layout: 'primary',
      safetyNote: SAFETY,
      boards: [
        board('202-m02-safety-zone-behaviors', {
          alt: 'Conceptual behaviors for clean versus controlled resin zones.',
          caption: 'Zone behaviors',
          prompt: 'Which behaviors belong in the clean zone versus the controlled zone?',
          longDescription:
            'Conceptual zone map. Exact room layout, PPE brand, and chemical handling follow venue rules — not this illustration.',
          doAvoid: {
            do: [
              'Ask before moving objects between zones',
              'Stop work early if containment is unclear',
            ],
            avoid: [
              'Handling uncured resin as a participant',
              'Treating zone diagrams as installed floor plans',
            ],
          },
          panelCrops: [
            {
              id: 'clean',
              label: 'Clean',
              objectPosition: 'left center',
              prompt: 'Participant materials and notes stay here.',
            },
            {
              id: 'boundary',
              label: 'Boundary',
              objectPosition: 'center',
              prompt: 'Amber boundary marks controlled work.',
            },
            {
              id: 'controlled',
              label: 'Controlled',
              objectPosition: 'right center',
              prompt: 'Instructors only for wet-resin handling tonight.',
            },
          ],
        }),
      ],
    },
    'complete-workflow': {
      title: 'Workflow checkpoints',
      intro: 'Stages matter more than brand names. Name the stage before the tool.',
      layout: 'primary',
      safetyNote: SAFETY,
      boards: [
        board('203-m03-workflow-checkpoints', {
          alt: 'Conceptual workflow checkpoints across model, slice, print, wash, and cure.',
          caption: 'Workflow checkpoints',
          prompt: 'At which stage could a file problem become a material or safety problem?',
          longDescription:
            'Conceptual pipeline. Timings and machine settings shown as examples are fictional.',
          doAvoid: {
            do: [
              'Complete file readiness before print starts',
              'Keep wash and cure as separate instructor stages',
            ],
            avoid: [
              'Skipping checks because a live print is running',
              'Reading baked labels as certified settings',
            ],
          },
          panelCrops: [
            {
              id: 'file',
              label: 'File',
              objectPosition: 'left center',
              prompt: 'File problems are cheapest to fix early.',
            },
            {
              id: 'print',
              label: 'Print',
              objectPosition: 'center',
              prompt: 'Observe only — instructors operate.',
            },
            {
              id: 'post',
              label: 'Post',
              objectPosition: 'right center',
              prompt: 'Wash and cure remain controlled-zone work.',
            },
          ],
        }),
      ],
    },
    'file-readiness': {
      title: 'File readiness boards',
      intro:
        'Five checks and outcome triage before wet resin. Measurements stay in the file — examples on boards are fictional.',
      layout: 'tabs',
      pairLabels: ['Five file checks', 'File outcomes'],
      safetyNote: SAFETY,
      boards: [
        board('204-m04-five-file-checks', {
          alt: 'Conceptual five file checks for resin print readiness.',
          caption: 'Five file checks',
          prompt: 'Which check would you run first on tonight’s file?',
          longDescription:
            'Checklist illustration. Wall thickness, units, and file extensions shown are fictional teaching examples.',
          doAvoid: {
            do: [
              'Confirm units and intended scale',
              'Inspect manifold integrity and thin walls',
            ],
            avoid: [
              'Trusting AI meshes without inspection',
              'Treating example numbers as venue rules',
            ],
          },
          panelCrops: [
            {
              id: 'units',
              label: 'Units',
              objectPosition: 'left center',
              prompt: 'Confirm mm vs inches before supports.',
            },
            {
              id: 'mesh',
              label: 'Mesh',
              objectPosition: 'center',
              prompt: 'Look for holes, inverted normals, and thin walls.',
            },
            {
              id: 'handoff',
              label: 'Handoff',
              objectPosition: 'right center',
              prompt: 'Name the export you would bring to staff review.',
            },
          ],
        }),
        board('205-m04-file-outcomes', {
          alt: 'Conceptual file outcomes: ready, repair, or consultation.',
          caption: 'File outcomes',
          prompt: 'Is this file ready, needs repair, or needs consultation?',
          longDescription:
            'Outcome tokens are teaching labels. Ready means ready for staff review, not machine access.',
          doAvoid: {
            do: [
              'Pick ready / repair / consultation honestly',
              'List the specific repair if not ready',
            ],
            avoid: [
              'Equating ready with unsupervised printing',
              'Hiding mesh issues to “save time”',
            ],
          },
        }),
      ],
    },
    'slicer-lab': {
      title: 'Slicer Lab sequence',
      intro:
        'Guided conceptual sequence. Follow with venue-validated Photon Workshop — these are not software screenshots.',
      layout: 'guided-sequence',
      safetyNote: SAFETY,
      boards: [
        board('206-m05-orientation-tradeoffs', {
          alt: 'Conceptual orientation tradeoffs for resin slicing.',
          caption: 'Orientation',
          prompt: 'What improves and what worsens when the part tilts?',
          longDescription:
            'Orientation study. Cover any accidental baked UI text such as layer or build-plate placeholders with crop/zoom.',
          doAvoid: {
            do: ['Discuss peel force and support landing zones'],
            avoid: ['Copying a baked angle as a certified setting'],
          },
          panelCrops: [
            {
              id: 'upright',
              label: 'Upright',
              objectPosition: 'left center',
              prompt: 'Note cross-section and support reach.',
            },
            {
              id: 'tilt',
              label: 'Tilt',
              objectPosition: 'right center',
              prompt: 'Compare peel direction and surface access.',
            },
          ],
        }),
        board('207-m05-hollow-drain-cutaway', {
          alt: 'Conceptual hollow and drain cutaway for trapped resin risk.',
          caption: 'Hollow / drain',
          prompt: 'Where could uncured resin get trapped without a drain path?',
          longDescription:
            'Cutaway teaching board. Drain hole sizes and counts are fictional — venue staff decide openings.',
          doAvoid: {
            do: ['Look for exit paths from enclosed volumes'],
            avoid: ['Assuming a hollow part is automatically safe'],
          },
        }),
        board('208-m05-layers-and-islands', {
          alt: 'Conceptual layer preview showing islands and fragile early layers.',
          caption: 'Layers / islands',
          prompt: 'Which early layers look unstable or disconnected?',
          longDescription:
            'Layer preview concept. Any “HTML LAYERS” style placeholders are not settings — ignore and use the technique question.',
          doAvoid: {
            do: ['Flag islands before export'],
            avoid: ['Reading placeholder layer labels as machine truth'],
          },
        }),
      ],
    },
    'print-wash-cure': {
      title: 'Preflight and controlled process',
      intro:
        'Preflight stop-check, then observe print → wash → dry → supports → cure. Instructors operate.',
      layout: 'pair',
      pairLabels: ['Preflight', 'Controlled process'],
      safetyNote: SAFETY,
      boards: [
        board('209-m06-preflight-stop-check', {
          alt: 'Conceptual preflight stop-check before print, wash, and cure.',
          caption: 'Preflight',
          prompt: 'What must be true before the instructor starts the machine?',
          doAvoid: {
            do: ['Confirm PPE, zone, and file readiness aloud'],
            avoid: ['Starting wet-resin work from the clean zone'],
          },
          panelCrops: [
            {
              id: 'stop',
              label: 'Stop',
              objectPosition: 'left center',
              prompt: 'Stop-work overrides the schedule.',
            },
            {
              id: 'check',
              label: 'Check',
              objectPosition: 'right center',
              prompt: 'Name the last check before start.',
            },
          ],
        }),
        board('210-m06-print-wash-dry-support-cure', {
          alt: 'Conceptual sequence of print, wash, dry, support removal, and cure.',
          caption: 'Controlled process',
          prompt: 'Name the stage you are watching — do not operate equipment.',
          doAvoid: {
            do: ['Observe and describe stages only'],
            avoid: [
              'Touching uncured parts',
              'Skipping dry before dry finishing',
            ],
          },
        }),
      ],
    },
    'failure-clinic': {
      title: 'Symptoms and method',
      intro:
        'Describe evidence before guessing causes. Real cured specimens remain the authority when available.',
      layout: 'pair',
      pairLabels: ['Symptoms', 'Method'],
      safetyNote: SAFETY,
      boards: [
        board('211-m07-failure-symptom-atlas', {
          alt: 'Conceptual atlas of cured failure symptoms for diagnosis practice.',
          caption: 'Symptoms',
          prompt: 'Describe the visible symptom before guessing a cause.',
          longDescription:
            'Symptom atlas is conceptual. It does not certify a failure cause or machine configuration.',
          doAvoid: {
            do: ['Describe location, stage, and surface clues'],
            avoid: ['Naming a single root cause from one still'],
          },
        }),
        board('212-m07-evidence-first-diagnosis', {
          alt: 'Conceptual evidence-first diagnosis board.',
          caption: 'Method',
          prompt: 'What is the smallest useful next test after listing factors?',
          doAvoid: {
            do: [
              'Compare a known-good reference',
              'Choose the smallest next test',
            ],
            avoid: ['Skipping evidence to jump to a fix'],
          },
        }),
      ],
    },
    'project-readiness': {
      title: 'Preparation and next step',
      intro:
        'Readiness board and pathways. Pricing stays on /fabricate. Ready ≠ unsupervised operation.',
      layout: 'prep-next',
      pairLabels: ['Preparation', 'Next step'],
      safetyNote: SAFETY,
      boards: [
        board('213-m08-readiness-board', {
          alt: 'Conceptual project readiness board with checklist and handoff cues.',
          caption: 'Preparation',
          prompt: 'What still needs to be true before a supervised appointment?',
          doAvoid: {
            do: ['Complete checklist items you can verify tonight'],
            avoid: ['Leaving machine access as an assumed next click'],
          },
        }),
        board('214-m08-readiness-pathways', {
          alt: 'Conceptual pathways for ready, repair, and consultation outcomes.',
          caption: 'Next step',
          prompt: 'Which path matches your project tonight?',
          doAvoid: {
            do: [
              'Pick ready / repair / consultation',
              'Browse /fabricate for finishes and quote after class',
            ],
            avoid: [
              'Treating ready as certification',
              'Skipping staff review when unsure',
            ],
          },
        }),
      ],
    },
  }
