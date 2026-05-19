'use client'

import { Card, CardContent } from '@/components/ui/card'
import { ma } from '@/lib/memory-agent/ui-tokens'
import { cn } from '@/lib/utils'

export function MemoryAgentPrototypeDisclaimer({ orgName }: { orgName: string }) {
  return (
    <Card className={cn(ma.card, 'bg-[var(--ma-surface-muted)]')}>
      <CardContent className={cn('space-y-2 p-4 text-xs leading-relaxed', ma.bodyMuted)}>
        <p className={cn('font-semibold', ma.body)}>Prototype disclaimer</p>
        <p>
          This contractor-led R&amp;D demo for {orgName} may return incomplete answers when
          Airtable fields are missing. It does not use payment, contract, or HR systems. A
          production deployment would need a separate scope for ownership, hosting, privacy
          review, staff training, and maintenance.
        </p>
      </CardContent>
    </Card>
  )
}
