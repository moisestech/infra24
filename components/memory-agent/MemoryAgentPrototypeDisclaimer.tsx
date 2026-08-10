'use client'

import { Card, CardContent } from '@/components/ui/card'
import { ma } from '@/lib/memory-agent/ui-tokens'
import { cn } from '@/lib/utils'

export function MemoryAgentPrototypeDisclaimer({ orgName }: { orgName: string }) {
  return (
    <Card className={cn(ma.card, 'bg-[var(--ma-surface-muted)]')}>
      <CardContent className={cn('space-y-2 p-4 text-xs leading-relaxed', ma.bodyMuted)}>
        <p className={cn('font-semibold', ma.body)}>
          Pilot — governed public outputs; not production HR/finance
        </p>
        <p>
          This governed pilot for {orgName} may return incomplete answers when source fields are
          missing. It does not use payment, contract, or HR systems. Public outputs require approval
          before QR handoff or signage. A production deployment would need separate scope for
          ownership, hosting, privacy review, staff training, and maintenance.
        </p>
      </CardContent>
    </Card>
  )
}
