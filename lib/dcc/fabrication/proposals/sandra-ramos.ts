import {
  DEFAULT_CLIENT_OWNERSHIP,
  DEFAULT_DOCUMENTATION_RIGHTS,
  type ClientProposal,
} from '@/lib/dcc/fabrication/schema'

/** Airtable Jobs & Quotes: recMxJ2kWFsvreTnq.
 * The initial inquiry does not yet identify an object, file, dimensions or budget.
 * This is a discovery page, never an approved fabrication quote.
 */
export const SANDRA_PROPOSAL: ClientProposal = {
  slug: 'sandra-ramos',
  heroKicker: 'DCC Miami · Fabrication inquiry · Scope discovery',
  heroTitle: '3D Printing Study — Scope & File Review',
  heroDek:
    'A first step toward a fabrication plan for Sandra Ramos. We will determine what needs to be made, what digital source exists, and whether the job requires modeling or direct printing.',
  job: {
    id: 'dcc-crm-recMxJ2kWFsvreTnq',
    jobNumber: 'SANDRA · SCOPE PENDING',
    slug: 'sandra-ramos',
    clientName: 'Sandra Ramos',
    projectTitle: '3D Printing Study — Scope & File Review',
    serviceType: 'PREPARE_PLUS_FABRICATE',
    status: 'INQUIRY',
    prototypeGoal:
      'Determine the first useful physical prototype and an appropriate fabrication pathway; design intent, object size and materials remain to be confirmed.',
    intendedUse: 'Not yet confirmed with Sandra',
    clientSuppliedMaterial: false,
    projectLeadId: 'moises-sanabria',
    paymentStatus: 'not_quoted',
    documentationRights: { ...DEFAULT_DOCUMENTATION_RIGHTS },
    ownership: { ...DEFAULT_CLIENT_OWNERSHIP },
    createdAt: '2026-10-17',
    updatedAt: '2026-10-17',
  },
  sections: [
    { id: 'goal', label: 'Project question', shortLabel: 'Goal' },
    { id: 'workflow', label: 'Proposed workflow', shortLabel: 'Path' },
    { id: 'quote', label: 'Quotation structure', shortLabel: 'Quote' },
    { id: 'scope', label: 'Scope boundaries', shortLabel: 'Scope' },
    { id: 'inputs', label: 'Open questions', shortLabel: 'Questions' },
    { id: 'approval', label: 'Next step', shortLabel: 'Next' },
  ],
  media: [],
  pricing: {
    serviceLabel: 'Fabrication discovery and optional prototype',
    amountStatus: 'pending',
    materialNote:
      'FDM, resin and specialist production are options, not selected materials or machines.',
    terms:
      'No dollar amount, turnaround or deposit is proposed before the object, digital file and production requirements are known. A small diagnostic may be quoted separately if file preparation is needed.',
    includedAttempts:
      'No fabrication attempt is authorized or included at the discovery stage.',
    reprintNote:
      'Revisions, support removal, paint, assembly and reprints are only included when expressly listed in an approved quote.',
  },
  quoteLineItems: [
    {
      id: 'reference-review',
      label: 'Source and feasibility review',
      shortLabel: 'REVIEW',
      description: 'Identify the object, intended use, dimensions and available model or references.',
      clientReceives: ['Suitable service recommendation', 'Missing input list', 'A bounded first prototype objective'],
      category: 'preflight', clientVisible: true, amountStatus: 'pending',
    },
    {
      id: 'model-prep',
      label: 'File preparation / modeling if needed',
      shortLabel: 'MODEL',
      description: 'Only if the supplied file needs repair, rescaling or geometry creation.',
      clientReceives: ['Defined CAD preparation scope and file assumptions'],
      category: 'preflight', clientVisible: true, amountStatus: 'pending',
    },
    {
      id: 'fabrication',
      label: 'Fabrication + materials',
      shortLabel: 'MAKE',
      description: 'Select an available machine/process only after actual geometry and material needs are reviewed.',
      clientReceives: ['Quoted first print attempt with defined materials and quantity'],
      category: 'fabrication', clientVisible: true, amountStatus: 'pending',
    },
    {
      id: 'finish-qa',
      label: 'Finishing / QA / handoff',
      shortLabel: 'FINISH',
      description: 'Separate basic cleanup from exhibition-grade surface treatment.',
      clientReceives: ['Defined finish level and delivery or pickup arrangement'],
      category: 'handoff', clientVisible: true, amountStatus: 'pending',
    },
  ],
  materialIds: [],
  processSteps: [
    'INQUIRY',
    'SOURCE FILE / REFERENCES',
    'DIMENSIONS + USE',
    'PRODUCTION STRATEGY',
    'FIXED QUOTE',
    'APPROVAL',
    'FABRICATION',
    'REVIEW',
    'HANDOFF',
  ],
  scopeIncluded: [
    'Review references or STL/OBJ/3MF files supplied by Sandra',
    'Recommend Print My File or Prepare + Fabricate after understanding the object',
    'Prepare a later fixed quote for one defined first prototype',
  ],
  scopeExcluded: [
    'Any production, unlimited modeling, materials purchase or scheduled machine slot at this discovery stage',
    'A particular finish level, size, process or turnaround before technical review',
    'Public use of artist images, designs or project details without separate approval',
  ],
  requiredInputs: [
    'What exactly is the object and what should the first prototype prove?',
    'Do you have a printable file (STL/OBJ/3MF) or only images, sketches or a physical original?',
    'Final height × width × depth, quantity and scale',
    'Material, strength or transparency requirements and preferred finish/color',
    'Deadline, intended location or use, and available budget',
  ],
  approvalNextStep:
    'Share the object description, available source files/photos, dimensions, quantity and deadline. DCC will recommend the simplest fabrication path and write a separate fixed quote. This page neither reserves a machine nor accepts payment.',
  modules: ['HERO', 'GOAL', 'WORKFLOW', 'PENDING_QUOTE', 'SCOPE', 'INPUTS', 'APPROVAL'],
}
