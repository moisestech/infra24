import { EditorialMethodTable } from '@/components/dcc/culture/editorial/EditorialMethodTable'

const RECEIPT_ROWS = [
  {
    name: 'Cash Cost',
    definition:
      'Money that actually left DCC accounts for a period or project: software, materials, contractors, rent share, fees.',
    why: 'Without cash, “efficiency” is only a feeling. This is the floor of any public receipt.',
    status: 'Not yet published. Measurement begins with the DCC pilot.',
  },
  {
    name: 'True Operating Cost',
    definition:
      'Cash Cost plus the unpaid or underpaid labor required to keep the system running — especially founder and steward time.',
    why: 'A cheap stack that only works because one person never clocks out is not cheap. It is deferred labor.',
    status: 'Not yet published. Measurement begins with the DCC pilot.',
  },
  {
    name: 'Founder Subsidy',
    definition:
      'The gap between True Operating Cost and what the organization can currently pay. The hidden transfer from founder capacity into public infrastructure.',
    why: 'If the subsidy is invisible, the institution cannot plan for transfer, rest, or replacement.',
    status: 'Not yet published. Conceptual until time-tracking exists.',
  },
  {
    name: 'Functional Replacement Cost',
    definition:
      'What it would cost to buy equivalent capacity from vendors, agencies, or enterprise tools without DCC’s owned decisions and shared systems.',
    why: 'This is a comparison method, not a market proof. It asks whether ownership of judgment is doing economic work.',
    status: 'Not yet published. No fabricated comparison prices.',
  },
  {
    name: 'Artist-Directed Resource Ratio',
    definition:
      'The share of time, money, and attention that reached artist-directed making versus coordination, administration, and internal maintenance.',
    why: 'An institution can be “efficient” at serving itself. This measure asks whether the machine still faces the artist.',
    status: 'Not yet published. Measurement begins with the DCC pilot.',
  },
]

export function PublishTheReceiptTable() {
  return (
    <EditorialMethodTable
      caption="Publish the Receipt is a methodology, not a dashboard. DCC is stating how it intends to account for itself before it has a public ledger to fill."
      rows={RECEIPT_ROWS}
    />
  )
}
