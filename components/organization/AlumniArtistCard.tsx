'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { AlumniAirtableRow } from '@/lib/airtable/alumni-service'
import {
  alumniDisplayName,
  alumniYearLabel,
} from '@/lib/airtable/alumni-service'
import { cn } from '@/lib/utils'

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  const a = parts[0][0]
  const b = parts[parts.length - 1][0]
  return `${a}${b}`.toUpperCase()
}

export type AlumniArtistCardProps = {
  row: AlumniAirtableRow
  onOpen: () => void
}

/**
 * Alumni grid tile: avatar, display name, medium, Oolite year — opens detail on activate.
 */
export function AlumniArtistCard({ row, onOpen }: AlumniArtistCardProps) {
  const reduceMotion = useReducedMotion()
  const display = alumniDisplayName(row)
  const year = alumniYearLabel(row.year)
  const medium = row.medium?.trim() ?? ''

  return (
    <motion.div
      className="h-full"
      whileHover={reduceMotion ? undefined : { y: -3 }}
      whileTap={reduceMotion ? undefined : { scale: 0.99 }}
      transition={{ type: 'spring', stiffness: 420, damping: 30 }}
    >
      <div
        role="button"
        tabIndex={0}
        aria-label={`View profile: ${display}`}
        onClick={onOpen}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onOpen()
          }
        }}
        className={cn(
          'flex h-full cursor-pointer flex-col gap-3 rounded-xl border border-border bg-card p-4 text-left shadow-sm transition-[border-color,box-shadow]',
          'hover:border-primary/40 hover:shadow-md',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'
        )}
      >
        <div className="flex gap-3">
          <Avatar className="h-14 w-14 shrink-0 ring-1 ring-border">
            {row.photoUrl ? (
              <AvatarImage asChild>
                <Image
                  src={row.photoUrl}
                  alt=""
                  width={56}
                  height={56}
                  className="aspect-square h-full w-full object-cover"
                  sizes="56px"
                />
              </AvatarImage>
            ) : null}
            <AvatarFallback className="text-sm font-semibold">
              {initialsFromName(display)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="line-clamp-2 text-base font-semibold leading-snug text-foreground">
              {display}
            </p>
          </div>
        </div>

        <p
          className="line-clamp-1 text-sm text-muted-foreground"
          title={medium || undefined}
        >
          {medium || '—'}
        </p>

        <div className="mt-auto flex items-baseline justify-between gap-2 border-t border-border pt-3 text-sm">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Oolite
          </span>
          <span className="font-medium tabular-nums text-foreground">
            {year || '—'}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
