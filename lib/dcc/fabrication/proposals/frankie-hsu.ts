import {
  DEFAULT_CLIENT_OWNERSHIP,
  DEFAULT_DOCUMENTATION_RIGHTS,
  type ClientProposal,
} from '@/lib/dcc/fabrication/schema'

/** Airtable Jobs & Quotes: recgNYcTAfSkE8Cwb.
 * Frankie has two distinct potential scopes, neither of which has a validated file.
 * Old $75 ring-halves estimate must NOT be carried into these jobs.
 */
export const FRANKIE_PROPOSAL: ClientProposal = {
  slug: 'frankie-hsu',
  heroKicker: 'DCC Miami · Technical diagnosis · Scope discovery',
  heroTitle: 'Precision Mold Repair + Coral Texture Study',
  heroDek:
    'Two possible directions: understand a previous warped resin mold before repeating it, and investigate enlarging a coral-texture source for sculptural work. Each can become a separate bounded paid phase after reviewing the source files.',
  job: {
    id: 'recgNYcTAfSkE8Cwb',
    jobNumber: 'FRANKIE · SCOPE PENDING',
    slug: 'frankie-hsu',
    clientName: 'Frankie Hsu',
    projectTitle: 'Precision Mold Repair + Coral Texture Study',
    serviceType: 'PREPARE_PLUS_FABRICATE',
    status: 'PROTOTYPE_SCOPING',
    prototypeGoal:
      'Diagnose reported warping / blocked internal geometry of prior resin mold; optionally assess scaling, tiling, and print feasibility of a coral texture for artwork.',
    intendedUse: 'Precision mold and sculptural surface studies — distinct scopes',
    clientSuppliedMaterial: false,
    projectLeadId: 'moises-sanabria',
    paymentStatus: 'not_quoted',
    documentationRights: { ...DEFAULT_DOCUMENTATION_RIGHTS },
    ownership: { ...DEFAULT_CLIENT_OWNERSHIP },
    createdAt: '2026-10-05',
    updatedAt: '2026-10-17',
  },
  sections: [
    { id: 'goal', label: 'Two project directions', shortLabel: 'Goal' },
    { id: 'workflow', label: 'Diagnostic path', shortLabel: 'Workflow' },
    { id: 'quote', label: 'Quote structure', shortLabel: 'Quote' },
    { id: 'scope', label: 'Boundaries', shortLabel: 'Scope' },
    { id: 'inputs', label: 'What we need', shortLabel: 'Files' },
    { id: 'approval', label: 'Next step', shortLabel: 'Next' },
  ],
  media: [],
  pricing: {
    serviceLabel: 'Technical diagnostic first, fabrication separately scoped',
    amountStatus: 'pending',
    materialNote:
      'SLA/MSLA may be appropriate for precision molds, but final process and resin depend on tolerance, geometry, function, resin compatibility and operator capacity.',
    terms:
      'First quote a bounded file-and-failure diagnostic after receiving the failed mold references and CAD. Mold revisions, test coupons, full molds and coral enlargement are separately approved workstreams. No new quote amount has been agreed.',
    includedAttempts:
      'No production attempts or reprints are included until a fixed scope is approved.',
    reprintNote:
      'The historical $75 ring-halves price does not apply to this new mold/coral work. Dimensional risk and reprints must be separately scoped.',
  },
  quoteLineItems: [
    {
      id: 'diagnostic',
      label: 'A · Failed mold technical diagnostic',
      shortLabel: 'DIAGNOSE',
      description:
        'Inspect prior part, CAD and slicing evidence; identify likely deformation, barrier, orientation, drainage and cure risks without claiming root cause in advance.',
      clientReceives: [
        'Evidence-backed failure hypotheses and unknowns',
        'Review of dimensions and critical internal surfaces',
        'One written recommendation for the smallest credible validation test',
      ],
      category: 'preflight', clientVisible: true, amountStatus: 'pending',
    },
    {
      id: 'mold-test',
      label: 'B · Mold revision and controlled test (optional)',
      shortLabel: 'TEST',
      description:
        'A separately approved targeted revision and test print to verify critical features before a full mold.',
      clientReceives: ['Defined revision scope', 'One agreed test piece / coupon if appropriate', 'Recorded dimensions and outcome'],
      category: 'fabrication', clientVisible: true, amountStatus: 'pending',
    },
    {
      id: 'coral',
      label: 'C · Coral texture enlargement (separate pathway)',
      shortLabel: 'CORAL',
      description:
        'Review geometry/detail and desired output size. Decide on scale, segmentation, process, supports and finishing before costing a physical test.',
      clientReceives: ['Feasibility and segmentation recommendation', 'Separate estimate for one enlarged material test'],
      category: 'preflight', clientVisible: true, amountStatus: 'pending',
    },
    {
      id: 'handoff',
      label: 'Findings + quality review',
      shortLabel: 'LEARN',
      description: 'Document technical decisions and what should change before the next production run.',
      clientReceives: ['Concise diagnostic notes and scoped next-action recommendation'],
      category: 'qa', clientVisible: true, amountStatus: 'pending',
    },
  ],
  materialIds: [],
  processSteps: [
    'FAILED PRINT / FILES',
    'DIMENSIONS + TOLERANCE',
    'DIAGNOSTIC',
    'MINIMAL TEST PLAN',
    'FIXED QUOTE',
    'APPROVAL',
    'TEST PIECE',
    'QA / LEARNING',
    'NEXT PHASE',
  ],
  scopeIncluded: [
    'Assess the prior failed precision mold from actual reference images, printed part and CAD when supplied',
    'Separate the mold problem from coral enlargement as two independent client decisions',
    'Write a small diagnostic or validation phase before estimating repeat full-size resin molds',
  ],
  scopeExcluded: [
    'Guaranteed dimensional accuracy or defect root cause without inspecting real geometry',
    'An unlimited sequence of reprints, production mold series or an enlarged coral sculpture',
    'Use of the old ring-halves estimate for either new scope',
    'External fabrication or publication of project evidence without agreement',
  ],
  requiredInputs: [
    'Failed mold photographs: warped circle, interior blockage/barrier, supports and base',
    'Original CAD/STL/3MF and, if available, slicer/project file and orientation',
    'Target outer/inner dimensions, fit tolerances, functional mold material and failure criteria',
    'Number of molds, material preference and deadline',
    'For coral: original source geometry/scan, target enlarged scale, finish and installation context',
    'Which path should be diagnosed first: the mold, the coral surface or both?',
  ],
  approvalNextStep:
    'Share the failed mold photos and source files, target tolerances and desired coral enlargement size. DCC will recommend the smallest paid diagnostic or test to authorize first. No fabrication, deposit or reprint is authorized by this page.',
  modules: ['HERO', 'GOAL', 'WORKFLOW', 'PENDING_QUOTE', 'SCOPE', 'INPUTS', 'APPROVAL'],
}
