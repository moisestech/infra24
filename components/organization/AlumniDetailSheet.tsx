'use client'

import Image from 'next/image'
import Link from 'next/link'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { AlumniAirtableRow } from '@/lib/airtable/alumni-service'
import {
  alumniDisplayName,
  alumniYearLabel,
} from '@/lib/airtable/alumni-service'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { ExternalLink, Mail } from 'lucide-react'

function isVideoRow(row: AlumniAirtableRow): boolean {
  if (row.videoArt === true) return true
  const m = row.medium?.toLowerCase() ?? ''
  return m.includes('video') || m.includes('film') || m.includes('moving image')
}

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  const a = parts[0][0]
  const b = parts[parts.length - 1][0]
  return `${a}${b}`.toUpperCase()
}

export type AlumniDetailSheetProps = {
  row: AlumniAirtableRow | null
  onClose: () => void
  orgName: string
}

export function AlumniDetailSheet({
  row,
  onClose,
  orgName,
}: AlumniDetailSheetProps) {
  return (
    <Sheet
      open={row !== null}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      {row ? (
        <AlumniDetailSheetInner row={row} orgName={orgName} />
      ) : null}
    </Sheet>
  )
}

function AlumniDetailSheetInner({
  row,
  orgName,
}: {
  row: AlumniAirtableRow
  orgName: string
}) {
  const display = alumniDisplayName(row)
  const year = alumniYearLabel(row.year)
  const showLegalName =
    row.artistName?.trim() && row.artistName.trim() !== row.name.trim()

  return (
    <SheetContent
      key={row.id}
      side="right"
      className="w-full overflow-y-auto sm:max-w-md"
    >
        <SheetHeader className="space-y-4 text-left">
          <div className="flex gap-4">
            <Avatar className="h-20 w-20 shrink-0 ring-1 ring-border">
              {row.photoUrl ? (
                <AvatarImage asChild>
                  <Image
                    src={row.photoUrl}
                    alt=""
                    width={80}
                    height={80}
                    className="aspect-square h-full w-full object-cover"
                    sizes="80px"
                  />
                </AvatarImage>
              ) : null}
              <AvatarFallback className="text-lg font-semibold">
                {initialsFromName(display)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1 space-y-1">
              <SheetTitle className="text-xl leading-snug">{display}</SheetTitle>
              {showLegalName ? (
                <SheetDescription>Also listed as: {row.name}</SheetDescription>
              ) : (
                <SheetDescription>{orgName} alumni</SheetDescription>
              )}
            </div>
          </div>
        </SheetHeader>

        <div className="mt-6 flex flex-wrap gap-1.5">
          {row.digitalArtist === true && (
            <Badge className="bg-violet-600 hover:bg-violet-600">Digital</Badge>
          )}
          {row.inCollection === true && (
            <Badge variant="secondary">Collection</Badge>
          )}
          {isVideoRow(row) && (
            <Badge
              variant="outline"
              className="border-amber-500/50 text-amber-800 dark:text-amber-200"
            >
              Video
            </Badge>
          )}
          {row.cohort?.trim() && (
            <Badge variant="secondary">{row.cohort.trim()}</Badge>
          )}
          {row.program?.trim() && (
            <Badge variant="outline">{row.program.trim()}</Badge>
          )}
          {year ? <Badge variant="outline">{year}</Badge> : null}
          {row.medium?.trim() && (
            <Badge variant="outline" className="font-normal">
              {row.medium.trim()}
            </Badge>
          )}
        </div>

        <dl className="mt-6 space-y-3 text-sm">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Medium
            </dt>
            <dd className="text-foreground">{row.medium?.trim() || '—'}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Year at Oolite
            </dt>
            <dd className="text-foreground">{year || '—'}</dd>
          </div>
        </dl>

        {row.topics.length > 0 && (
          <div className="mt-6">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">
              Topics
            </p>
            <div className="flex flex-wrap gap-1.5">
              {row.topics.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-col gap-2">
          {row.website && (
            <Button asChild variant="default" className="w-full sm:w-auto">
              <Link href={row.website} target="_blank" rel="noopener noreferrer">
                Website
                <ExternalLink className="ml-2 h-4 w-4" aria-hidden />
              </Link>
            </Button>
          )}
          {row.email && (
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link href={`mailto:${row.email}`}>
                <Mail className="mr-2 h-4 w-4" aria-hidden />
                Email
              </Link>
            </Button>
          )}
        </div>

        {row.phone?.trim() && (
          <p className="mt-4 text-sm text-muted-foreground">
            Phone:{' '}
            <a href={`tel:${row.phone.replace(/\s/g, '')}`} className="text-primary hover:underline">
              {row.phone}
            </a>
          </p>
        )}

        {row.artifacts?.trim() && (
          <div className="mt-6 border-t border-border pt-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
              Work at Oolite
            </p>
            <p className="whitespace-pre-wrap text-sm text-foreground">
              {row.artifacts}
            </p>
          </div>
        )}

        {row.notes?.trim() && !row.artifacts?.trim() && (
          <div className="mt-6 border-t border-border pt-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
              Notes
            </p>
            <p className="whitespace-pre-wrap text-sm text-foreground">
              {row.notes}
            </p>
          </div>
        )}
    </SheetContent>
  )
}
