'use client'

import { useEffect, useState, useCallback } from 'react'
import { Workshop } from '@/types/workshop'

export function useWorkshops() {
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/workshops')
        const data = await response.json()
        if (data.success) {
          setWorkshops(data.workshops)
        } else {
          setError(data.error || 'Failed to fetch workshops')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchWorkshops()
  }, [])

  return { workshops, loading, error }
}

export function useChapter(workshopSlug: string, chapterSlug: string) {
  const [chapter, setChapter] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!workshopSlug || !chapterSlug) return

    const fetchChapter = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/workshops?slug=${workshopSlug}&chapter=${chapterSlug}`)
        const data = await response.json()
        if (data.success) {
          setChapter(data.chapter)
        } else {
          setError(data.error || 'Failed to fetch chapter')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchChapter()
  }, [workshopSlug, chapterSlug])

  return { chapter, loading, error }
} 