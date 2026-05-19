'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ChevronDown, Database } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { orgSlugToEnvToken } from '@/lib/airtable/org-alumni-config'
import { cn } from '@/lib/utils'

type AlumniDirectoryDevPanelProps = {
  slug: string
  configured: boolean
  totalRows: number
}

export function AlumniDirectoryDevPanel({
  slug,
  configured,
  totalRows,
}: AlumniDirectoryDevPanelProps) {
  const [open, setOpen] = useState(false)
  const token = orgSlugToEnvToken(slug) ?? 'ORG'

  return (
    <div className="rounded-lg border border-dashed border-border bg-muted/30">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="flex w-full items-center justify-between gap-2 px-4 py-3 text-muted-foreground hover:text-foreground"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="flex items-center gap-2 text-sm font-medium">
          <Database className="h-4 w-4" />
          Data sources & field mapping
        </span>
        <ChevronDown
          className={cn('h-4 w-4 transition-transform', open && 'rotate-180')}
          aria-hidden
        />
      </Button>
      {open ? (
        <div className="space-y-3 border-t border-border px-4 pb-4 pt-2 text-xs text-muted-foreground">
          <p className="text-xs text-amber-700 dark:text-amber-200">
            Developer mode (<code className="rounded bg-muted px-1">?dev=1</code> on the URL). Not shown
            to visitors.
          </p>
          <p>
            Rows load from Airtable on each request (
            <code className="rounded bg-muted px-1">fetchAlumniFromAirtable</code>
            ). {configured ? `${totalRows} records in the current response.` : 'Not configured for this org.'}
          </p>
          <p>
            Map columns with{' '}
            <code className="rounded bg-muted px-1">AIRTABLE_{token}_ALUMNI_FIELD_*</code>
            {slug === 'oolite' ? (
              <>
                {' '}
                or legacy <code className="rounded bg-muted px-1">AIRTABLE_ALUMNI_*</code>
              </>
            ) : null}
            . Filters for digital practice, collection, and video require those fields in the base.
          </p>
          <p>
            JSON debug:{' '}
            <Link
              href={`/api/organizations/by-slug/${slug}/alumni/airtable`}
              className="text-primary underline-offset-2 hover:underline"
            >
              /api/organizations/by-slug/{slug}/alumni/airtable
            </Link>
          </p>
          <p>
            See <code className="rounded bg-muted px-1">docs/AIRTABLE_MULTI_BASE.md</code> and{' '}
            <code className="rounded bg-muted px-1">lib/airtable/org-alumni-config.ts</code> for the
            full <strong>AlumniAirtableRow</strong> shape.
          </p>
        </div>
      ) : null}
    </div>
  )
}
