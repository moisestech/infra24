'use client'

import Image from 'next/image'
import { useState } from 'react'
import { ImageIcon } from 'lucide-react'

import { useTheme } from '@/contexts/ThemeContext'
import {
  sohoMockupDropHint,
  sohoMockupSrc,
  type SohoFunnelMockupKey,
} from '@/lib/sohohouse/pitch-constants'
import { cn } from '@/lib/utils'

type MockupAspect = 'phone' | 'screen' | 'wide' | 'video'

const ASPECT_CLASS: Record<MockupAspect, string> = {
  phone: 'aspect-[9/19] w-full max-w-[220px]',
  screen: 'aspect-[4/3] w-full',
  wide: 'aspect-[16/10] w-full',
  video: 'aspect-video w-full',
}

export type SohoFunnelMockupFrameProps = {
  mockupKey: SohoFunnelMockupKey
  alt: string
  caption: string
  aspect?: MockupAspect
  className?: string
  priority?: boolean
}

export function SohoFunnelMockupFrame({
  mockupKey,
  alt,
  caption,
  aspect = 'wide',
  className,
  priority,
}: SohoFunnelMockupFrameProps) {
  const { resolvedTheme } = useTheme()
  const theme = resolvedTheme === 'light' ? 'light' : 'dark'
  const src = sohoMockupSrc(mockupKey, theme)
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const showPlaceholder = failedSrc === src

  return (
    <figure className={cn('group/mockup', className)}>
      <div
        className={cn(
          'soho-funnel-card soho-funnel-mockup-frame relative mx-auto overflow-hidden rounded-2xl',
          'border border-[var(--soho-border-strong)] bg-[var(--soho-surface)] shadow-[0_24px_60px_-28px_var(--soho-mockup-shadow)]',
          ASPECT_CLASS[aspect]
        )}
      >
        {!showPlaceholder ? (
          <Image
            key={src}
            src={src}
            alt={alt}
            fill
            priority={priority}
            className="object-cover object-top transition duration-700 ease-out group-hover/mockup:scale-[1.02]"
            sizes={
              aspect === 'phone'
                ? '(max-width: 768px) 220px, 220px'
                : '(max-width: 768px) 100vw, 640px'
            }
            onError={() => setFailedSrc(src)}
          />
        ) : (
          <div className="soho-funnel-mockup-placeholder flex h-full min-h-[12rem] flex-col items-center justify-center gap-3 p-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--soho-border-strong)] bg-[var(--soho-bg-soft)]">
              <ImageIcon className="h-5 w-5 text-[var(--soho-accent)]" aria-hidden />
            </div>
            <div>
              <p className="text-xs font-medium text-[var(--soho-text)]">{caption}</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-[var(--soho-accent-muted)]">
                {theme} theme
              </p>
              <p className="mt-1.5 text-[10px] leading-relaxed text-[var(--soho-text-muted)]">
                Add mockups:{' '}
                <code className="rounded bg-[var(--soho-bg-soft)] px-1 py-0.5 text-[var(--soho-accent)]">
                  public/assets/sohohouse/mockups/{sohoMockupDropHint(mockupKey)}
                </code>
              </p>
            </div>
          </div>
        )}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-[var(--soho-border)]"
          aria-hidden
        />
      </div>
      <figcaption className="mt-3 text-center text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--soho-accent-muted)]">
        {caption}
      </figcaption>
    </figure>
  )
}
