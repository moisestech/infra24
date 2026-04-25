'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  UnifiedNavigation,
  ooliteConfig,
  bakehouseConfig,
  madartsConfig,
} from '@/components/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Download, FileText } from 'lucide-react'
import { mergeWorkshopMetadata } from '@/lib/workshops/marketing-metadata'
import { isWorkshopUuid } from '@/lib/workshops/workshop-routing'
import type { WorkshopRow } from '@/components/workshops/marketing/types'

export default function WorkshopPacketPage() {
  const params = useParams()
  const slug = params.slug as string
  const workshopKey = params.workshopKey as string

  const [workshop, setWorkshop] = useState<WorkshopRow | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchWorkshop = useCallback(async () => {
    if (!workshopKey || !slug) return
    try {
      setLoading(true)
      let res: Response
      if (isWorkshopUuid(workshopKey)) {
        res = await fetch(`/api/workshops/${workshopKey}`)
      } else {
        res = await fetch(
          `/api/organizations/by-slug/${slug}/workshops/by-slug/${encodeURIComponent(workshopKey)}`
        )
      }
      if (!res.ok) throw new Error('Failed to load workshop')
      const data = await res.json()
      const row = data.data ?? data
      if (!row?.id) throw new Error('Workshop not found')
      setWorkshop(row as WorkshopRow)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
      setWorkshop(null)
    } finally {
      setLoading(false)
    }
  }, [workshopKey, slug])

  useEffect(() => {
    fetchWorkshop()
  }, [fetchWorkshop])

  const navConfig =
    slug === 'bakehouse' ? bakehouseConfig : slug === 'madarts' ? madartsConfig : ooliteConfig

  const detailHref = `/o/${slug}/workshop/${encodeURIComponent(workshopKey)}`

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <UnifiedNavigation config={navConfig} userRole="admin" />
        <div className="mx-auto flex max-w-2xl items-center justify-center px-4 py-24">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      </div>
    )
  }

  if (error || !workshop) {
    return (
      <div className="min-h-screen bg-background">
        <UnifiedNavigation config={navConfig} userRole="admin" />
        <div className="mx-auto max-w-lg px-4 py-16 text-center">
          <h1 className="text-2xl font-semibold">Workshop not found</h1>
          <p className="mt-2 text-muted-foreground">{error}</p>
          <Button asChild className="mt-8">
            <Link href={`/o/${slug}/workshop`}>Back to workshops</Link>
          </Button>
        </div>
      </div>
    )
  }

  const marketing = mergeWorkshopMetadata(workshop.metadata ?? undefined, {
    title: workshop.title,
    id: workshop.id,
  })
  const pdfUrl = marketing.packetPdfUrl

  return (
    <div className="min-h-screen bg-background">
      <UnifiedNavigation config={navConfig} userRole="admin" />
      <div className="mx-auto max-w-2xl px-4 py-12 md:py-16">
        <Button asChild variant="ghost" size="sm" className="mb-8 -ml-2 gap-2">
          <Link href={detailHref}>
            <ArrowLeft className="h-4 w-4" />
            Back to workshop
          </Link>
        </Button>

        <div className="rounded-2xl border border-border/80 bg-card/50 p-8 shadow-sm md:p-10">
          <div className="mb-6 inline-flex rounded-full border border-border bg-muted/50 p-3">
            <FileText className="h-6 w-6 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{workshop.title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">Workshop packet</p>

          {pdfUrl ? (
            <div className="mt-10 space-y-4">
              <p className="text-sm leading-relaxed text-muted-foreground">
                Download or open the facilitator packet for this workshop.
              </p>
              <Button asChild size="lg" className="w-full sm:w-auto">
                <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                  <Download className="mr-2 h-4 w-4" />
                  Open packet
                </a>
              </Button>
            </div>
          ) : (
            <div className="mt-10 space-y-4">
              <p className="text-base leading-relaxed text-muted-foreground">
                The workshop packet is not available yet. Check back soon, or contact the organization
                for materials.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
