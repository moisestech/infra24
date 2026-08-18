import type { Metadata } from 'next'
import { ResinPrintingShell } from '@/components/workshop-engine/ResinPrintingShell'

export const metadata: Metadata = {
  title: 'Intro to 3D Resin Printing for Artists',
  description:
    'Reusable Infra24 workshop engine — facilitator, TV, participant, and booklet modes for resin printing.',
  alternates: { canonical: '/workshop/resin-printing' },
}

export default function ResinPrintingLayout({ children }: { children: React.ReactNode }) {
  return <ResinPrintingShell>{children}</ResinPrintingShell>
}
