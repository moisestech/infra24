'use client'

import Image from 'next/image'
import { useCallback, useRef, useState } from 'react'
import type { EdgeZonesPhoto } from '@/lib/marketing/edgezones-media'
import { cn } from '@/lib/utils'

type Props = {
  photos: EdgeZonesPhoto[]
}

const DEPTH = [0.35, 0.55, 0.75] as const

export function EdgeZonesHeroCollage({ photos }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  const handleMove = useCallback((clientX: number, clientY: number) => {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (clientX - rect.left) / rect.width - 0.5
    const y = (clientY - rect.top) / rect.height - 0.5
    setOffset({ x, y })
  }, [])

  return (
    <div
      ref={containerRef}
      className="ez-hero-collage group relative"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false)
        setOffset({ x: 0, y: 0 })
      }}
      onMouseMove={(event) => handleMove(event.clientX, event.clientY)}
    >
      <div className="grid grid-cols-2 gap-2">
        <div
          className="relative col-span-2 aspect-[16/9] overflow-hidden border border-[var(--ez-border)] sm:aspect-[5/3]"
          style={{
            transform: isHovering
              ? `translate(${offset.x * 14 * DEPTH[0]}px, ${offset.y * 10 * DEPTH[0]}px)`
              : undefined,
            transition: isHovering ? 'transform 0.12s ease-out' : 'transform 0.45s ease-out',
          }}
        >
          <Image src={photos[0].src} alt={photos[0].alt} fill className="object-cover" sizes="520px" priority />
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--ez-blue)]" aria-hidden />
        </div>
        {photos.slice(1).map((photo, i) => {
          const depth = DEPTH[i + 1] ?? 0.6
          return (
            <div
              key={photo.src}
              className="relative aspect-square overflow-hidden border border-[var(--ez-border)] sm:aspect-[4/5]"
              style={{
                transform: isHovering
                  ? `translate(${offset.x * 14 * depth}px, ${offset.y * 10 * depth}px)`
                  : undefined,
                transition: isHovering ? 'transform 0.12s ease-out' : 'transform 0.45s ease-out',
              }}
            >
              <Image src={photo.src} alt={photo.alt} fill className="object-cover" sizes="260px" />
              <div
                className={cn('absolute bottom-0 left-0 right-0 h-1', i === 0 ? 'bg-[var(--ez-green)]' : 'bg-[var(--ez-orange)]')}
                aria-hidden
              />
            </div>
          )
        })}
      </div>
      <div className="absolute -right-2 -top-2 h-8 w-8 border border-[var(--ez-blue)] bg-[var(--ez-blue)] opacity-80" aria-hidden />
      <div className="absolute -bottom-2 -left-2 h-6 w-6 border border-[var(--ez-orange)] bg-[var(--ez-orange)] opacity-70" aria-hidden />
    </div>
  )
}
