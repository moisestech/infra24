'use client'

import type { ProspectConfig } from '@/lib/ask-the-place/types'
import { VoiceOrb } from './VoiceOrb'

type MobileAskHeroProps = {
  config: ProspectConfig
}

export function MobileAskHero({ config }: MobileAskHeroProps) {
  return (
    <div className="space-y-4 px-1">
      <p className="text-center text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-500">
        {config.prospectName}
      </p>
      <VoiceOrb state="idle" />
      <h2 className="text-center text-xl font-medium leading-snug text-white">
        What would you like to experience today?
      </h2>
      <p className="text-center text-sm text-zinc-500">{config.tagline}</p>
    </div>
  )
}
