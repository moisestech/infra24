'use client'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { ma } from '@/lib/memory-agent/ui-tokens'
import { cn } from '@/lib/utils'

type StatusShape = {
  dataConfigured?: boolean
  openaiConfigured?: boolean
  elevenLabsApiKeyConfigured?: boolean
  elevenLabsVoiceIdConfigured?: boolean
} | null

type MemoryAgentAvailabilityBannerProps = {
  ready: boolean
  status: StatusShape
  statusLoading: boolean
  devMode?: boolean
}

export function MemoryAgentAvailabilityBanner({
  ready,
  status,
  statusLoading,
  devMode = false,
}: MemoryAgentAvailabilityBannerProps) {
  if (statusLoading) {
    return (
      <p className={cn('mb-4', ma.bodyMuted)} role="status">
        Checking availability…
      </p>
    )
  }

  if (ready) return null

  if (!devMode) {
    return (
      <Alert className={cn('mb-4', ma.alertAmber)} role="status">
        <AlertDescription className={ma.body}>
          Voice and answers are not available yet. You can still browse this page; check back soon.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="mb-4 space-y-3">
      {!status?.dataConfigured ? (
        <Alert className={ma.alertAmber}>
          <AlertDescription>
            Airtable alumni is not configured. Set{' '}
            <code className={ma.alertAmberCode}>AIRTABLE_&#123;ORG&#125;_ALUMNI_*</code> (see{' '}
            <code className={ma.alertAmberCode}>docs/AIRTABLE_MULTI_BASE.md</code>).
          </AlertDescription>
        </Alert>
      ) : null}
      {status?.dataConfigured && !status.openaiConfigured ? (
        <Alert className={ma.alertAmber}>
          <AlertDescription>
            Add <code className={ma.alertAmberCode}>OPENAI_API_KEY</code> to enable answers.
          </AlertDescription>
        </Alert>
      ) : null}
      {status?.elevenLabsApiKeyConfigured && !status.elevenLabsVoiceIdConfigured ? (
        <Alert className={ma.alertAmber}>
          <AlertDescription>
            Set <code className={ma.alertAmberCode}>ELEVENLABS_VOICE_ID</code> (or org-specific
            override) and restart the dev server.
          </AlertDescription>
        </Alert>
      ) : null}
    </div>
  )
}
