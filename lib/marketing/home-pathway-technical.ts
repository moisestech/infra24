/**
 * Expandable “technical readout” for homepage pathway cards (keyed by href).
 */
export const homePathwayTechnical = {
  '/grants/funders': {
    layer:
      'Grant narratives align to public-layer outcomes, pilot scope, and Infra24 implementation line items—so funders read systems and accountability, not a black-box vendor quote.',
    hints: ['schema: grants.priority_bundle', 'export: narrative.md + budget.xlsx', 'signal: miami_pilot.v1'],
  },
  '/programs/institutional-programs': {
    layer:
      'Org programs bundle signage feeds, wayfinding, staff workflows, and training artifacts into one maintainable surface—scoped so small teams can operate without a full IT department.',
    hints: ['module: signage.delta_sync', 'module: staff.handoff_queue', 'policy: update_sla.default'],
  },
  '/programs': {
    layer:
      'Artist-facing tracks emphasize workshops, clinics, and experimental tooling—visibility and literacy without forcing everyone through the same enterprise procurement path.',
    hints: ['queue: workshop.session', 'artifact: visibility.toolkit', 'route: /programs/*'],
  },
} as const;

export type HomePathwayTechnicalHref = keyof typeof homePathwayTechnical;
