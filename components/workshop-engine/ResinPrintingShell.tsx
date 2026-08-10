'use client'

import { usePathname } from 'next/navigation'
import { WorkshopEngineShell } from '@/components/workshop-engine/WorkshopEngineShell'

export function ResinPrintingShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '/workshop/resin-printing'
  return <WorkshopEngineShell currentPath={pathname}>{children}</WorkshopEngineShell>
}
