'use client'

import { useEffect, useState, useCallback } from 'react'
import type { ResolvedPlaylist, ResolvedSlide } from '@/lib/display-plane/types'

const POLL_MS = 20_000

export function DisplayPlayerClient({
  orgSlug,
  screenKey,
  token,
}: {
  orgSlug: string
  screenKey: string
  token: string | null
}) {
  const [playlist, setPlaylist] = useState<ResolvedPlaylist | null>(null)
  const [index, setIndex] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const fetchPlaylist = useCallback(async () => {
    const q = token ? `?token=${encodeURIComponent(token)}` : ''
    const path = `/api/display/v1/org/${encodeURIComponent(orgSlug)}/screens/${encodeURIComponent(screenKey)}/playlist${q}`
    const res = await fetch(path)
    if (!res.ok) {
      const j = await res.json().catch(() => ({}))
      setError((j as { error?: string }).error || `HTTP ${res.status}`)
      return
    }
    const data = (await res.json()) as ResolvedPlaylist
    setError(null)
    setPlaylist(data)
    setIndex(0)
  }, [orgSlug, screenKey, token])

  useEffect(() => {
    fetchPlaylist()
    const id = setInterval(fetchPlaylist, POLL_MS)
    return () => clearInterval(id)
  }, [fetchPlaylist])

  const slides = playlist?.slides || []
  const slide = slides.length ? slides[Math.min(index, slides.length - 1)] : null

  useEffect(() => {
    if (!slide?.durationSeconds) return
    const t = setTimeout(() => {
      setIndex((i) => (slides.length ? (i + 1) % slides.length : 0))
    }, Math.max(3, slide.durationSeconds) * 1000)
    return () => clearTimeout(t)
  }, [slide, slides.length])

  if (error) {
    return (
      <div className="min-h-screen bg-black text-red-400 flex items-center justify-center p-8 text-center">
        <div>
          <p className="text-xl font-semibold">Display error</p>
          <p className="mt-2 opacity-80">{error}</p>
        </div>
      </div>
    )
  }

  if (!playlist) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Loading…</p>
      </div>
    )
  }

  if (!slide) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-400 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl">No slides</p>
          <p className="mt-2 text-sm">{playlist.screenName}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <SlideView slide={slide} />
      <footer className="text-xs text-zinc-600 px-4 py-2 flex justify-between border-t border-zinc-800">
        <span>{playlist.screenName}</span>
        <span>
          {index + 1} / {slides.length}
        </span>
      </footer>
    </div>
  )
}

function SlideView({ slide }: { slide: ResolvedSlide }) {
  if (slide.kind === 'media' && slide.mediaUrl) {
    const url = slide.mediaUrl
    const isVideo = /\.(mp4|webm|ogg)(\?|$)/i.test(url) || url.includes('video')
    if (isVideo) {
      return (
        <div className="flex-1 flex items-center justify-center bg-black">
          <video
            key={slide.id}
            className="max-h-[calc(100vh-48px)] max-w-full"
            src={url}
            autoPlay
            muted
            playsInline
            loop
          />
        </div>
      )
    }
    return (
      <div className="flex-1 flex items-center justify-center bg-black p-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={url} alt="" className="max-h-[calc(100vh-48px)] max-w-full object-contain" />
      </div>
    )
  }

  if (slide.kind === 'workshop_promo') {
    return (
      <div className="flex-1 flex flex-col justify-center px-10 md:px-20 gap-4">
        <p className="text-sm uppercase tracking-widest text-amber-400">Workshop</p>
        <h1 className="text-4xl md:text-6xl font-bold leading-tight">{slide.title}</h1>
        {slide.body ? <p className="text-xl text-zinc-300 max-w-3xl">{slide.body}</p> : null}
      </div>
    )
  }

  if (slide.kind === 'workshop_digest') {
    return (
      <div className="flex-1 flex flex-col justify-center px-10 md:px-20 gap-6">
        <p className="text-sm uppercase tracking-widest text-emerald-400">Today</p>
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">{slide.title}</h1>
        {slide.body ? (
          <div className="text-xl md:text-2xl text-zinc-200 whitespace-pre-line max-w-4xl leading-relaxed">
            {slide.body}
          </div>
        ) : null}
      </div>
    )
  }

  if (slide.kind === 'artist_spotlight') {
    const meta = slide.meta || {}
    return (
      <div className="flex-1 flex flex-col md:flex-row">
        {slide.imageUrl ? (
          <div className="md:w-1/2 min-h-[40vh] relative bg-zinc-900">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={slide.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
          </div>
        ) : null}
        <div className="flex-1 flex flex-col justify-center px-10 md:px-16 py-10 gap-4">
          <p className="text-sm uppercase tracking-widest text-cyan-400">Artist</p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">{slide.title}</h1>
          {slide.body ? (
            <div className="text-lg text-zinc-300 whitespace-pre-wrap max-w-3xl">{slide.body}</div>
          ) : null}
          {(typeof meta.portfolio_url === 'string' && meta.portfolio_url) ||
          (typeof meta.instagram === 'string' && meta.instagram) ||
          (typeof meta.website === 'string' && meta.website) ? (
            <p className="text-sm text-zinc-500">
              {typeof meta.portfolio_url === 'string' && meta.portfolio_url ? (
                <span className="mr-4">Portfolio linked</span>
              ) : null}
              {typeof meta.instagram === 'string' && meta.instagram ? (
                <span className="mr-4">@{meta.instagram}</span>
              ) : null}
            </p>
          ) : null}
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col md:flex-row">
      {slide.imageUrl ? (
        <div className="md:w-1/2 min-h-[40vh] relative bg-zinc-900">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={slide.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
        </div>
      ) : null}
      <div className="flex-1 flex flex-col justify-center px-10 md:px-16 py-10 gap-4">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">{slide.title}</h1>
        {slide.body ? (
          <div className="text-lg text-zinc-300 whitespace-pre-wrap max-w-3xl">{slide.body}</div>
        ) : null}
      </div>
    </div>
  )
}
