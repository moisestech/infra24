'use client'

import Image from 'next/image'
import { useCallback, useRef, useState, type CSSProperties } from 'react'
import type { EdgeZonesPhoto } from '@/lib/marketing/edgezones-media'

type Props = {
  banner: EdgeZonesPhoto
}

export function EdgeZonesConceptBanner({ banner }: Props) {
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

  const motionStyle = {
    '--ez-banner-tilt-x': `${offset.y * -7}deg`,
    '--ez-banner-tilt-y': `${offset.x * 9}deg`,
    '--ez-banner-shift-x': `${offset.x * 22}px`,
    '--ez-banner-shift-y': `${offset.y * 14}px`,
    '--ez-banner-glow-x': `${50 + offset.x * 28}%`,
    '--ez-banner-glow-y': `${50 + offset.y * 22}%`,
  } as CSSProperties

  return (
    <div
      ref={containerRef}
      className="ez-concept-banner group relative mb-8"
      style={motionStyle}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false)
        setOffset({ x: 0, y: 0 })
      }}
      onMouseMove={(event) => handleMove(event.clientX, event.clientY)}
    >
      <div className={isHovering ? 'ez-concept-banner-frame ez-concept-banner-frame-active' : 'ez-concept-banner-frame'}>
        <div className="ez-concept-banner-glow pointer-events-none absolute inset-0" aria-hidden />
        <div className="ez-concept-banner-corners pointer-events-none absolute inset-0" aria-hidden>
          <span className="ez-concept-banner-corner ez-concept-banner-corner-tl" />
          <span className="ez-concept-banner-corner ez-concept-banner-corner-tr" />
          <span className="ez-concept-banner-corner ez-concept-banner-corner-bl" />
          <span className="ez-concept-banner-corner ez-concept-banner-corner-br" />
        </div>

        <div className="relative aspect-[21/9] w-full min-h-[12rem] overflow-hidden sm:min-h-[16rem]">
          <div className="ez-concept-banner-media absolute inset-0">
            <Image src={banner.src} alt={banner.alt} fill className="object-cover" sizes="1152px" priority />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--ez-paper)] via-[var(--ez-paper)]/70 to-transparent" />
          <div className="ez-concept-banner-scanlines pointer-events-none absolute inset-0" aria-hidden />
        </div>
      </div>
    </div>
  )
}
