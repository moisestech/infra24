'use client'

import Link from 'next/link'
import { Settings } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { ma } from '@/lib/memory-agent/ui-tokens'
import { cn } from '@/lib/utils'

type MemoryAgentSettingsSheetProps = {
  orgSlug: string
  autoSpeakAnswers: boolean
  onAutoSpeakChange: (on: boolean) => void
  showDataReadiness: boolean
  onShowDataReadinessChange: (on: boolean) => void
  voiceAvailable: boolean
  isDevMode: boolean
  onEnableDevMode: () => void
  onDisableDevMode: () => void
}

export function MemoryAgentSettingsSheet({
  orgSlug,
  autoSpeakAnswers,
  onAutoSpeakChange,
  showDataReadiness,
  onShowDataReadinessChange,
  voiceAvailable,
  isDevMode,
  onEnableDevMode,
  onDisableDevMode,
}: MemoryAgentSettingsSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button type="button" variant="outline" size="sm" className={cn('gap-1.5', ma.btnOutline)}>
          <Settings className="h-4 w-4" aria-hidden />
          Settings
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-[var(--ma-surface)] text-[var(--ma-text)]">
        <SheetHeader>
          <SheetTitle className="text-[var(--ma-text)]">Memory Agent settings</SheetTitle>
          <SheetDescription className="text-[var(--ma-text-muted)]">
            Preferences for this device. Account sync coming later.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-[var(--ma-input-border)]"
              checked={autoSpeakAnswers}
              disabled={!voiceAvailable}
              onChange={(e) => onAutoSpeakChange(e.target.checked)}
            />
            <span>
              <span className={cn('block text-sm font-medium', ma.body)}>Speak answers automatically</span>
              <span className={cn('mt-1 block text-xs', ma.caption)}>
                {voiceAvailable
                  ? 'Play the latest answer aloud when it arrives.'
                  : 'Spoken answers are not available yet on this device.'}
              </span>
            </span>
          </label>
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-[var(--ma-input-border)]"
              checked={showDataReadiness}
              onChange={(e) => onShowDataReadinessChange(e.target.checked)}
            />
            <span>
              <span className={cn('block text-sm font-medium', ma.body)}>Show data readiness</span>
              <span className={cn('mt-1 block text-xs', ma.caption)}>
                Staff-facing notes on source records and gaps. Off by default for public demos.
              </span>
            </span>
          </label>
          <p className={cn('text-xs', ma.caption)}>
            <Link href={`/o/${orgSlug}/memory-agent/about`} className={ma.link}>
              About this product & roadmap →
            </Link>
          </p>
          <div className="border-t border-[var(--ma-border)] pt-6">
            <p className={cn('text-sm font-medium', ma.body)}>Developer</p>
            <p className={cn('mt-1 text-xs', ma.caption)}>
              Connection status, staff mode, asset queue, and step-by-step voice tools.
            </p>
            {isDevMode ? (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="mt-3 w-full"
                onClick={onDisableDevMode}
              >
                Exit developer mode
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className={cn('mt-3 w-full', ma.btnOutline)}
                onClick={onEnableDevMode}
              >
                Enable developer mode
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
