export type FabricationPolicy = {
  id: string
  title: string
  body: string
}

export const FABRICATION_POLICIES: FabricationPolicy[] = [
  {
    id: 'machine-failure',
    title: 'DCC machine failure',
    body: 'If the machine fails because of DCC operation, machine error, adhesion failure, clog, layer shift, or DCC-approved slicing error, DCC does not charge the artist for the failed print.',
  },
  {
    id: 'file-risk',
    title: 'Artist file risk',
    body: 'If a file is risky, DCC flags it before printing and asks you to repair it, print as-is, or cancel.',
  },
  {
    id: 'change-request',
    title: 'Artist change request',
    body: 'If you approve Version A and later want Version B, that is a new job.',
  },
  {
    id: 'quote-protection',
    title: 'Quote protection',
    body: 'Final price should not exceed the approved estimate by more than 10% without approval.',
  },
]

export const FABRICATION_PROMISE =
  'Transparent pricing for artists. You see the time, material, and labor before we print. Machine failures are on us. No surprise invoices.'

export const FABRICATION_CRAFTCLOUD_NOTE =
  'If this is a simple part and you only need the cheapest shipped option, compare with Craftcloud. If you need local help, file prep, artist access, iteration, workshop support, or finishing, DCC is designed for that.'

export const FABRICATION_WORKSHOP_BOUNDARY =
  'Completing a DCC or Oolite resin workshop prepares you for supervised fabrication — it is not certification to operate equipment alone.'
