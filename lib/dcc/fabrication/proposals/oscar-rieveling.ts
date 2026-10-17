import {
  DEFAULT_CLIENT_OWNERSHIP,
  DEFAULT_DOCUMENTATION_RIGHTS,
  type ClientProposal,
} from '@/lib/dcc/fabrication/schema'

/**
 * Intake-stage project. Dates, scale, geometry and production schedule are not confirmed.
 * Do not assign a numbered completed/paid DCC job until the Airtable job is reconciled.
 */
export const OSCAR_PROPOSAL: ClientProposal = {
  slug: 'oscar-rieveling',
  heroKicker: 'DCC Miami · Prepare + Fabricate · Scope in review',
  heroTitle: 'Balcony Form — Small Display Study',
  heroDek:
    'A provisional image-to-object study based on Oscar’s balcony reference photographs. Final dimensions and use must be confirmed before any fixed production quote.',
  job: {
    id: 'dcc-oscar-scope-pending',
    jobNumber: 'OSCAR · SCOPE PENDING',
    slug: 'oscar-rieveling',
    clientName: 'Oscar Rieveling',
    projectTitle: 'Balcony Form — Small Display Study',
    serviceType: 'PREPARE_PLUS_FABRICATE',
    status: 'PROTOTYPE_SCOPING',
    intendedUse: 'Small display prototype, subject to client confirmation',
    prototypeGoal:
      'Understand the 3D form from reference photography, build a display-scale mesh and print one unpainted prototype for review.',
    clientSuppliedMaterial: false,
    machineId: 'bambu-lab-h2s',
    projectLeadId: 'moises-sanabria',
    fabricationLocation: 'Bakehouse Art Complex — Studio 43 (subject to scheduling)',
    paymentStatus: 'not_quoted',
    documentationRights: { ...DEFAULT_DOCUMENTATION_RIGHTS },
    ownership: { ...DEFAULT_CLIENT_OWNERSHIP },
    createdAt: '2026-08-18',
    updatedAt: '2026-10-17',
  },
  sections: [
    { id: 'goal', label: 'Project objective', shortLabel: 'Goal' },
    { id: 'plan', label: 'Proposed workflow', shortLabel: 'Plan' },
    { id: 'equipment', label: 'Equipment', shortLabel: 'Machines' },
    { id: 'price', label: 'Provisional estimate', shortLabel: 'Estimate' },
    { id: 'scope', label: 'Scope boundaries', shortLabel: 'Scope' },
    { id: 'inputs', label: 'What we need', shortLabel: 'Inputs' },
    { id: 'approval', label: 'Next step', shortLabel: 'Next' },
  ],
  media: [],
  pricing: {
    serviceLabel: 'Small Display Prototype — planning estimate',
    amountStatus: 'pending',
    materialNote:
      'PLA or PETG selection and filament availability require a production review. No material purchase or reservation has been made.',
    terms:
      'The $350 scenario is not yet a fixed quote. A final written price and 50% deposit arrangement, if applicable, require client approval after dimensions and print feasibility are confirmed.',
    includedAttempts:
      'One small display prototype only if the agreed dimensions fit the original planning allowance.',
    reprintNote:
      'Failed geometry, additional copies, large assemblies and expanded finishing require separately approved scope.',
  },
  materialIds: [],
  processSteps: [
    'REFERENCES',
    'DIMENSIONS',
    'MODEL',
    'CLIENT REVIEW',
    'MESH / SLICE',
    'FINAL QUOTE',
    'ACCEPTANCE',
    'PRINT',
    'QA',
    'DELIVERY',
    'DOCUMENTATION BY CONSENT',
  ],
  scopeIncluded: [
    'One desktop-scale conceptual interpretation from adequate reference photographs',
    'Basic 3D cleanup and slicing for a feasible FDM prototype',
    'One small unpainted PLA/PETG print and basic inspection if the quote is accepted',
  ],
  scopeExcluded: [
    'Full-size or functional balcony construction',
    'Survey-grade reconstruction, precise architectural detailing or structural assurance',
    'Paint, exhibition finish, shipping, extra copies or extensive reworking',
    'Public photographs, client identity or case-study rights without explicit permission',
  ],
  requiredInputs: [
    'Overall height, width and depth at the intended display scale',
    'Quantity and where the piece will be displayed or installed',
    'Reference photographs from multiple angles and any available measured drawing',
    'Desired color and surface finish; painted or unpainted',
    'Deadline and which small details matter most',
  ],
  approvalNextStep:
    'Confirm size, quantity, intended use, references and deadline. DCC will review printable geometry and materials, then issue a fixed quote with a delivery window. No payment or fabrication is authorized by this page.',
  modules: ['HERO', 'GOAL', 'WORKFLOW', 'EQUIPMENT', 'PROVISIONAL_ESTIMATE', 'SCOPE', 'INPUTS', 'APPROVAL'],
}
