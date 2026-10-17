/**
 * An unapproved planning allowance, not a firm quote or payment request.
 * Client-facing data only. Operator costs belong in the staff estimator.
 */
export type PilotEstimatePlan = {
  label: string
  amountUsd: number
  lines: ReadonlyArray<{ label: string; amountUsd: number }>
  depositIllustrationUsd: number
  turnaround: string
  timelineStartsWhen: string
  equipment: ReadonlyArray<string>
  includes: ReadonlyArray<string>
  dependencies: ReadonlyArray<string>
  exclusions: ReadonlyArray<string>
}

export const CAROL_PILOT_ESTIMATE: PilotEstimatePlan = {
  label: 'Initial material and geometry study · planning allowance only',
  amountUsd: 225,
  lines: [
    { label: 'Object review + limited reference / geometry preparation', amountUsd: 95 },
    { label: 'First thin-walled resin material study + post-processing', amountUsd: 80 },
    { label: 'QA, weight/texture findings + coordination', amountUsd: 50 },
  ],
  depositIllustrationUsd: 112.5,
  turnaround: '5–8 business days',
  timelineStartsWhen: 'after an in-person cast review, approved limited scope, compatible resin availability, and an operator / machine slot',
  equipment: [
    'Anycubic Photon Mono M7 Max (operator-owned by Leo; DCC access requires confirmation)',
    'Compatible wash / cure station, gloves, eye protection, ventilation and resin-safe tools',
    'Calipers, scale, digital model cleanup and resin slicer',
  ],
  includes: [
    'Reference measurement and feasibility review for the approximately 2-inch mirrored form',
    'One initial hollow-shell material / geometry test in one approved resin colorway',
    'Basic wash, complete cure, support cleanup and findings review',
  ],
  dependencies: [
    'Exact length, comfortable finished weight and attachment direction',
    'Physical cast inspection; extensive scanning or hand-reconstruction may increase cost',
    'Approved transparent resin, safe handling / skin-contact assessment and operator access',
  ],
  exclusions: [
    'Second requested colorway (fuchsia and high-visibility green remain the target directions, but require a separately approved run)',
    'A guaranteed wearable finished pair, jewelry findings, paint, production edition or metal casting',
    'Extensive reconstruction, external scanning, shipping or further print iterations',
  ],
}

export const OSCAR_PILOT_ESTIMATE: PilotEstimatePlan = {
  label: 'Small unpainted display model · planning allowance only',
  amountUsd: 350,
  lines: [
    { label: 'Reference-image to conceptual 3D modeling', amountUsd: 180 },
    { label: 'Mesh repair, simplification and FDM slicing', amountUsd: 90 },
    { label: 'One small FDM production run and material allowance', amountUsd: 60 },
    { label: 'Basic cleanup, QA and handoff', amountUsd: 20 },
  ],
  depositIllustrationUsd: 175,
  turnaround: '7–12 business days',
  timelineStartsWhen: 'after confirming dimensions, reference completeness, one-piece/segmented print feasibility, material stock and an approved fixed scope',
  equipment: [
    'Bambu H2S or H2D FDM printer at Studio 43 (schedule and material stock to verify)',
    'Modeling and mesh-editing software, Bambu slicer and calipers',
    'Suitable PLA or PETG; cleanup and assembly tools if the geometry must be split',
  ],
  includes: [
    'One conceptual desktop-scale study based on supplied photos and measurements',
    'One unpainted FDM prototype and basic support removal / inspection',
    'Documented geometry limitations and recommendations for a later version',
  ],
  dependencies: [
    'Overall height × width × depth, number of copies, intended display or installation context',
    'Clear photographs, reference measurements, detail priority, deadline and desired finish',
    'Review of print dimensions, segmentation needs and available filament',
  ],
  exclusions: [
    'Architecturally accurate reconstruction without survey / drawings',
    'Full-size, structural, load-bearing or outdoor-rated balcony components',
    'Paint, advanced finishing, shipping, complex assembly and multiple iterations',
  ],
}

export function pilotEstimateLinesTotal(plan: PilotEstimatePlan): number {
  return plan.lines.reduce((sum, item) => sum + item.amountUsd, 0)
}
