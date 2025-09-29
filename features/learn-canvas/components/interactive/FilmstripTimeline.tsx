'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { MiniMapDensity } from './MiniMapDensity'

export type TimelineEvent = {
  id: string
  date: string   // ISO: '2020-06-01'
  title: string
  summary: string
  image?: string
  tags?: string[]
  category?: 'milestone'|'breakthrough'|'release'|'research'|'controversy'|'adoption'
}

export function FilmstripTimeline({
  events,
  height = 220,
  neon = '#00ff00',
}: {
  events: TimelineEvent[]
  height?: number
  neon?: string
}) {
  const railRef = useRef<HTMLDivElement|null>(null)
  const [zoom, setZoom] = useState(1) // 0.6..1.6
  const [openId, setOpenId] = useState<string|null>(null)

  const sorted = useMemo(
    () => [...events].sort((a,b)=>a.date.localeCompare(b.date)),
    [events]
  )

  // year grouping label (optional)
  const groups = useMemo(() => {
    const m = new Map<number, TimelineEvent[]>()
    for (const e of sorted) {
      const y = new Date(e.date).getFullYear()
      if (!m.has(y)) m.set(y, [])
      m.get(y)!.push(e)
    }
    return [...m.entries()]
  }, [sorted])

  const scrollByCards = (dir: -1|1) => {
    const el = railRef.current
    if (!el) return
    const cardW = Math.round(220 * zoom) // base width * zoom
    el.scrollBy({ left: dir * cardW * 2.5, behavior:'smooth' })
  }

  // Keyboard nudge when preview is closed
  useEffect(() => {
    const el = railRef.current
    if (!el) return
    const onKey = (e: KeyboardEvent) => {
      if (openId) return
      if (e.key === 'ArrowRight') scrollByCards(1)
      if (e.key === 'ArrowLeft') scrollByCards(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [openId, zoom])

  return (
    <div className="relative">
      {/* Header / controls */}
      <div className="mb-2 flex items-center justify-between">
        <div className="text-white/80 text-sm">AI Video — 10-year timeline</div>
        <div className="flex items-center gap-3">
          <label className="text-xs text-white/60">Zoom</label>
          <input
            type="range" min={0.6} max={1.6} step={0.05}
            value={zoom}
            onChange={(e)=>setZoom(parseFloat(e.target.value))}
            className="w-40 accent-[var(--neon)]"
            style={{ ['--neon' as any]: neon }}
            aria-label="Zoom"
          />
          <button onClick={()=>scrollByCards(-1)} className="h-8 w-8 grid place-items-center rounded bg-white/10 hover:bg-white/20">
            <ChevronLeft className="h-4 w-4 text-white" />
          </button>
          <button onClick={()=>scrollByCards(1)} className="h-8 w-8 grid place-items-center rounded bg-white/10 hover:bg-white/20">
            <ChevronRight className="h-4 w-4 text-white" />
          </button>
        </div>
      </div>

      {/* Filmstrip rail */}
      <div
        ref={railRef}
        className="relative overflow-x-auto overflow-y-visible snap-x snap-mandatory
                   scrollbar-thin scrollbar-thumb-white/20"
        style={{ height }}
      >
        <div className="flex gap-4 pr-8">
          {groups.map(([year, rows]) => (
            <section key={year} className="snap-start">
              <div className="px-1 pb-2 text-xs text-white/60">{year}</div>
              <div className="flex gap-4">
                {rows.map(ev => (
                  <button
                    key={ev.id}
                    onClick={()=>setOpenId(ev.id)}
                    className="group relative rounded-xl overflow-hidden border border-white/10 bg-white/5 hover:bg-white/10 snap-start"
                    style={{
                      width: Math.round(220*zoom),
                      height: Math.round((220*zoom)*9/16),
                      boxShadow: `0 0 0 0 rgba(0,0,0,0)`,
                    }}
                  >
                    {ev.image && (
                      <Image src={ev.image} alt={ev.title} fill className="object-cover" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-2 text-left">
                      <div className="text-[11px] text-white/85 font-semibold line-clamp-2">{ev.title}</div>
                      <div className="text-[10px] text-white/60 line-clamp-1">{ev.summary}</div>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      {/* Mini-map density / draggable viewport */}
      <div className="mt-3">
        <MiniMapDensity
          events={sorted}
          scrollRef={railRef}
          height={56}
          neon={neon}
          // binCount auto-adapts to width; you can hint here:
          // binCount={160}
        />
      </div>

      {/* Preview portal */}
      {openId && (
        <PreviewPortal onClose={()=>setOpenId(null)}>
          <PreviewCard
            event={sorted.find(e=>e.id===openId)!}
            onClose={()=>setOpenId(null)}
            neon={neon}
          />
        </PreviewPortal>
      )}
    </div>
  )
}

/* ---------- preview + portal ---------- */

function PreviewPortal({ children, onClose }:{children:React.ReactNode; onClose:()=>void}) {
  const [node] = useState(()=>document.createElement('div'))
  useEffect(()=>{
    node.style.position='fixed'; node.style.inset='0'; node.style.zIndex='9999'
    document.body.appendChild(node)
    const onEsc = (e:KeyboardEvent)=> e.key==='Escape' && onClose()
    window.addEventListener('keydown', onEsc)
    return ()=>{ document.body.removeChild(node); window.removeEventListener('keydown', onEsc) }
  }, [node, onClose])
  return createPortal(<div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}>{children}</div>, node)
}

function PreviewCard({ event, onClose, neon }:{ event:TimelineEvent; onClose:()=>void; neon:string }) {
  return (
    <motion.div
      onClick={(e)=>e.stopPropagation()}
      initial={{ opacity:0, scale:.96 }}
      animate={{ opacity:1, scale:1 }}
      exit={{ opacity:0, scale:.96 }}
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                 w-[min(92vw,780px)] h-[min(80vh,560px)] rounded-2xl overflow-hidden
                 bg-neutral-950 border border-white/10"
      style={{ boxShadow: `0 0 40px ${neon}AA` }}
    >
      <div className="relative h-1/2">
        {event.image && <Image src={event.image} alt={event.title} fill className="object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <button onClick={onClose} className="absolute top-3 right-3 h-8 w-8 rounded-full bg-black/60 text-white grid place-items-center">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="p-4 space-y-2">
        <div className="text-white text-lg font-semibold">{event.title}</div>
        <div className="text-white/60 text-sm">{new Date(event.date).toLocaleDateString()}</div>
        <p className="text-white/80 text-sm">{event.summary}</p>
        {event.tags && event.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {event.tags.map((tag, index) => (
              <span key={index} className="px-2 py-1 text-xs bg-white/10 text-white/70 rounded">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}
