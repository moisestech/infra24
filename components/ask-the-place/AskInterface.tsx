'use client'

import { useState } from 'react'
import { Mic } from 'lucide-react'
import { VoiceOrb } from './VoiceOrb'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type AskInterfaceProps = {
  placeholder: string
  onSubmitText: (text: string) => void
}

export function AskInterface({ placeholder, onSubmitText }: AskInterfaceProps) {
  const [text, setText] = useState('')
  const [voice, setVoice] = useState<'idle' | 'listening' | 'thinking'>('idle')

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0B1118]/95 p-4 shadow-2xl ring-1 ring-white/[0.04] backdrop-blur">
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-start">
        <VoiceOrb state={voice} />
        <div className="min-w-0 flex-1 space-y-2">
          <label htmlFor="atp-ask" className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Ask the place
          </label>
          <Input
            id="atp-ask"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={placeholder}
            className="border-white/10 bg-[#05070A] text-zinc-100 placeholder:text-zinc-600"
          />
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              className="gap-1 border border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10"
              onClick={() => {
                setVoice('listening')
                window.setTimeout(() => setVoice('thinking'), 500)
                window.setTimeout(() => {
                  setVoice('idle')
                  if (text.trim()) onSubmitText(text.trim())
                }, 1400)
              }}
            >
              <Mic className="h-4 w-4" />
              Simulate voice
            </Button>
            <Button
              type="button"
              size="sm"
              className="bg-gradient-to-r from-teal-600 to-teal-500 text-white hover:from-teal-500 hover:to-teal-400"
              disabled={!text.trim()}
              onClick={() => onSubmitText(text.trim())}
            >
              Send question
            </Button>
          </div>
          <p className="text-[10px] text-zinc-600">
            Voice is simulated for the pilot shell — wire to WebRTC / STT when ready.
          </p>
        </div>
      </div>
    </div>
  )
}
