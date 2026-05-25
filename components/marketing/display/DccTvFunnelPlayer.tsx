'use client'

import { useEffect, useMemo, useState } from 'react'
import QRCode from '@/components/ui/QRCode'
import {
  DCC_TV_QR_PATH,
  DCC_TV_QR_SOURCE,
  DCC_TV_SLIDES,
  type DccTvSlide,
  type DccTvSlideMotion,
} from '@/lib/marketing/dcc-tv-slides'
import { cn } from '@/lib/utils'

function MotionLayer({ motion }: { motion: DccTvSlideMotion }) {
  if (motion === 'terminal') {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-40" aria-hidden>
        <div className="dcc-tv-grid absolute inset-0" />
        <div className="absolute left-8 top-1/3 font-mono text-xs text-teal-400/80">
          <span className="dcc-tv-blink">▮</span> dcc.miami — public digital miami
        </div>
      </div>
    )
  }

  if (motion === 'pulse') {
    return (
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-30" aria-hidden>
        <div className="dcc-tv-pulse h-64 w-64 rounded-full border border-teal-400/40" />
      </div>
    )
  }

  if (motion === 'cards') {
    const labels = ['Network', 'IRL Events', 'Workshops', 'Clinics', 'Open Lab', 'Interfaces', 'Newsletter']
    return (
      <div className="pointer-events-none absolute inset-x-0 bottom-24 overflow-hidden opacity-50" aria-hidden>
        <div className="dcc-tv-marquee flex gap-3 whitespace-nowrap px-8">
          {[...labels, ...labels].map((label, i) => (
            <span
              key={`${label}-${i}`}
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/70"
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    )
  }

  if (motion === 'tiles') {
    return (
      <div className="pointer-events-none absolute inset-0 grid grid-cols-4 gap-3 p-12 opacity-20" aria-hidden>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="dcc-tv-tile rounded-xl border border-teal-500/30 bg-teal-950/40" />
        ))}
      </div>
    )
  }

  if (motion === 'chips') {
    const chips = ['AI literacy', 'Websites', 'Archives', 'Vibe coding', 'Media literacy', 'Digital presence']
    return (
      <div className="pointer-events-none absolute inset-x-0 bottom-28 flex flex-wrap justify-center gap-2 px-12 opacity-45" aria-hidden>
        {chips.map((chip) => (
          <span key={chip} className="rounded-full border border-violet-400/30 px-3 py-1 text-xs text-violet-200/80">
            {chip}
          </span>
        ))}
      </div>
    )
  }

  if (motion === 'network') {
    return (
      <div className="pointer-events-none absolute inset-0 opacity-35" aria-hidden>
        <svg className="h-full w-full" viewBox="0 0 800 450" preserveAspectRatio="xMidYMid slice">
          <circle cx="400" cy="225" r="4" fill="rgb(45 212 191)" className="dcc-tv-node-pulse" />
          {[
            [120, 120],
            [680, 100],
            [640, 320],
            [180, 340],
            [400, 80],
          ].map(([cx, cy], i) => (
            <g key={i}>
              <line x1="400" y1="225" x2={cx} y2={cy} stroke="rgb(45 212 191 / 0.35)" strokeWidth="1" />
              <circle cx={cx} cy={cy} r="3" fill="rgb(167 139 250 / 0.8)" className="dcc-tv-node-pulse" style={{ animationDelay: `${i * 0.4}s` }} />
            </g>
          ))}
        </svg>
      </div>
    )
  }

  return null
}

function SlideView({ slide }: { slide: DccTvSlide }) {
  return (
    <div className="relative flex h-full w-full flex-col justify-center px-[6vw] py-[8vh]">
      <MotionLayer motion={slide.motion} />
      <div className="relative z-10 max-w-[58vw]">
        <p className="font-mono text-[clamp(10px,1.1vw,13px)] font-medium uppercase tracking-[0.28em] text-teal-400/90">
          {slide.eyebrow}
        </p>
        <h1
          className={cn(
            'mt-3 font-semibold tracking-tight text-white',
            slide.emphasize ? 'text-[clamp(2rem,4.8vw,4.5rem)]' : 'text-[clamp(1.75rem,4vw,3.75rem)]'
          )}
        >
          {slide.title}
        </h1>
        <p className="mt-4 max-w-2xl text-[clamp(0.95rem,1.6vw,1.35rem)] leading-relaxed text-neutral-300">
          {slide.body}
        </p>
      </div>
    </div>
  )
}

type Props = {
  showControls?: boolean
}

export function DccTvFunnelPlayer({ showControls = false }: Props) {
  const slides = DCC_TV_SLIDES
  const [index, setIndex] = useState(0)
  const [origin, setOrigin] = useState('')
  const [docHidden, setDocHidden] = useState(false)
  const [paused, setPaused] = useState(false)

  const slide = slides[index] ?? slides[0]

  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

  useEffect(() => {
    const onVis = () => setDocHidden(document.hidden)
    onVis()
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  useEffect(() => {
    if (docHidden || paused) return
    const t = window.setTimeout(() => {
      setIndex((i) => (i + 1) % slides.length)
    }, slide.durationMs)
    return () => window.clearTimeout(t)
  }, [index, slide.durationMs, slides.length, docHidden, paused])

  const qrUrl = useMemo(() => {
    if (!origin) return ''
    return `${origin}${DCC_TV_QR_PATH}?source=${encodeURIComponent(DCC_TV_QR_SOURCE)}`
  }, [origin])

  return (
    <div className="relative min-h-[100dvh] w-full overflow-hidden bg-neutral-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_20%,rgba(45,212,191,0.12),transparent_50%),radial-gradient(ellipse_at_80%_80%,rgba(167,139,250,0.1),transparent_45%)]" />

      <SlideView slide={slide} />

      <aside className="absolute bottom-[6vh] right-[5vw] z-20 flex flex-col items-end gap-3">
        <p className="font-mono text-[clamp(10px,1vw,12px)] tracking-wide text-neutral-400">{slide.pathLabel}</p>
        <div
          className={cn(
            'rounded-2xl border bg-white p-3 shadow-2xl shadow-black/40',
            slide.emphasize && 'dcc-tv-qr-emphasis ring-2 ring-teal-400/50'
          )}
        >
          {qrUrl ? <QRCode value={qrUrl} size={140} /> : (
            <div className="h-[140px] w-[140px] animate-pulse rounded-lg bg-neutral-200" />
          )}
        </div>
        <p className="max-w-[180px] text-right text-[clamp(10px,0.95vw,12px)] leading-snug text-neutral-400">
          Scan to join · <span className="text-teal-400/90">dcc.miami/network/signup</span>
        </p>
      </aside>

      <div className="absolute bottom-[6vh] left-[5vw] z-20 flex items-center gap-2">
        {slides.map((s, i) => (
          <span
            key={s.id}
            className={cn(
              'h-1.5 rounded-full transition-all duration-500',
              i === index ? 'w-8 bg-teal-400' : 'w-1.5 bg-white/25'
            )}
            aria-hidden
          />
        ))}
      </div>

      {showControls ? (
        <div className="absolute left-[5vw] top-[5vh] z-30 flex gap-2">
          <button
            type="button"
            className="rounded-lg border border-white/20 px-3 py-1.5 text-xs text-white/80 hover:bg-white/10"
            onClick={() => setPaused((p) => !p)}
          >
            {paused ? 'Play' : 'Pause'}
          </button>
          <button
            type="button"
            className="rounded-lg border border-white/20 px-3 py-1.5 text-xs text-white/80 hover:bg-white/10"
            onClick={() => setIndex((i) => (i + 1) % slides.length)}
          >
            Next
          </button>
        </div>
      ) : null}

      <style jsx global>{`
        .dcc-tv-grid {
          background-image:
            linear-gradient(rgba(45, 212, 191, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(45, 212, 191, 0.08) 1px, transparent 1px);
          background-size: 48px 48px;
          animation: dcc-tv-grid-drift 24s linear infinite;
        }
        @keyframes dcc-tv-grid-drift {
          from { transform: translate(0, 0); }
          to { transform: translate(48px, 48px); }
        }
        .dcc-tv-blink {
          animation: dcc-tv-blink 1.2s step-end infinite;
        }
        @keyframes dcc-tv-blink {
          50% { opacity: 0; }
        }
        .dcc-tv-pulse {
          animation: dcc-tv-pulse 3s ease-in-out infinite;
        }
        @keyframes dcc-tv-pulse {
          0%, 100% { transform: scale(0.85); opacity: 0.4; }
          50% { transform: scale(1.05); opacity: 0.7; }
        }
        .dcc-tv-marquee {
          animation: dcc-tv-marquee 28s linear infinite;
        }
        @keyframes dcc-tv-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .dcc-tv-tile {
          animation: dcc-tv-tile 4s ease-in-out infinite alternate;
        }
        .dcc-tv-tile:nth-child(odd) { animation-delay: 0.5s; }
        @keyframes dcc-tv-tile {
          from { opacity: 0.3; transform: translateY(0); }
          to { opacity: 0.55; transform: translateY(-6px); }
        }
        .dcc-tv-node-pulse {
          animation: dcc-tv-node 2.4s ease-in-out infinite;
        }
        @keyframes dcc-tv-node {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        .dcc-tv-qr-emphasis {
          animation: dcc-tv-qr-glow 2s ease-in-out infinite;
        }
        @keyframes dcc-tv-qr-glow {
          0%, 100% { box-shadow: 0 0 0 rgba(45, 212, 191, 0); }
          50% { box-shadow: 0 0 24px rgba(45, 212, 191, 0.35); }
        }
      `}</style>
    </div>
  )
}
