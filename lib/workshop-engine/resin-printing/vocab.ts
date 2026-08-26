import type { ModuleVocabTerm } from '@/lib/workshop-engine/types'

/** Per-module key vocabulary shown beside ideas/tips. */
export const RESIN_MODULE_VOCAB: Record<string, ModuleVocabTerm[]> = {
  welcome: [
    {
      term: 'Supervised appointment',
      definition:
        'Staff-led print session after workshop prep — not solo machine certification.',
    },
    {
      term: 'Follow class / My pace',
      definition:
        'Two participation modes for learning flow; neither authorizes independent equipment use.',
    },
  ],
  'why-resin': [
    {
      term: 'Detail vs durability',
      definition:
        'Resin favors fine surface detail; strength, cost, and outdoor use may push other processes.',
    },
    {
      term: 'Consultation',
      definition:
        'A valid outcome when resin, FDM, or fabrication fit is unclear — not a failure.',
    },
  ],
  'safety-zones': [
    {
      term: 'PPE',
      definition:
        'Personal protective equipment required before controlled-zone resin handling.',
    },
    {
      term: 'Clean vs controlled zone',
      definition:
        'Participant clean area vs instructor-led wet-resin area — keep materials separated.',
    },
    {
      term: 'Stop-work',
      definition:
        'Pause the schedule immediately for spills, exposure risk, or unclear containment.',
    },
  ],
  'complete-workflow': [
    {
      term: 'Model → slice → print → wash → cure',
      definition:
        'Staged pipeline; each stage has its own tools, risks, and quality checks.',
    },
    {
      term: 'File readiness',
      definition:
        'Units, manifold mesh, and scale checks completed before the printer starts.',
    },
  ],
  'file-readiness': [
    {
      term: 'Manifold',
      definition:
        'Watertight mesh with consistent normals — required for reliable slicing.',
    },
    {
      term: 'Units / scale',
      definition:
        'Confirm mm vs inches and intended size before supports or hollowing.',
    },
    {
      term: 'Handoff package',
      definition:
        'Named export + notes ready for a supervised appointment review.',
    },
  ],
  'slicer-lab': [
    {
      term: 'Orientation',
      definition:
        'How the part sits on the build plate — affects peel force, supports, and surface quality.',
    },
    {
      term: 'Supports',
      definition:
        'Temporary structures that stabilize overhangs; contact points leave marks.',
    },
    {
      term: 'Hollow / drain',
      definition:
        'Reduce resin volume with cavities and escape paths — never trap uncured resin.',
    },
  ],
  'print-wash-cure': [
    {
      term: 'Uncured vs cured',
      definition:
        'Wet/green resin needs PPE and containment; fully cured polymer is a different risk state.',
    },
    {
      term: 'Wash',
      definition:
        'Solvent cleaning stage after print — instructor-operated in this workshop.',
    },
    {
      term: 'Cure',
      definition:
        'UV exposure that finishes polymerization after wash — observe only tonight.',
    },
  ],
  'failure-clinic': [
    {
      term: 'Evidence first',
      definition:
        'Describe what you see and when it appeared before claiming a cause.',
    },
    {
      term: 'Known-good',
      definition:
        'A successful reference part or coupon used to compare symptoms.',
    },
    {
      term: 'Smallest next test',
      definition:
        'The cheapest useful experiment after listing possible factors.',
    },
  ],
  'project-readiness': [
    {
      term: 'Ready',
      definition:
        'File and plan are fit for a supervised fabrication appointment.',
    },
    {
      term: 'Repair',
      definition:
        'Specific mesh/scale/support issues to fix before booking.',
    },
    {
      term: 'Consultation',
      definition:
        'Needs staff review on process choice, finish level, or scope.',
    },
  ],
}
