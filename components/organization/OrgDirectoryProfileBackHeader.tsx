'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

import { OrgDirectoryPageHeader } from '@/components/organization/OrgDirectoryPageHeader'

type OrgDirectoryProfileBackHeaderProps = {
  orgSlug: string
  title: string
  description?: ReactNode
  backHref: string
  backLabel?: string
}

/** Profile / detail pages: minimal header + back link (announcements-style shell). */
export function OrgDirectoryProfileBackHeader({
  orgSlug,
  title,
  description,
  backHref,
  backLabel = 'Back to directory',
}: OrgDirectoryProfileBackHeaderProps) {
  return (
    <>
      <OrgDirectoryPageHeader
        orgSlug={orgSlug}
        title={title}
        description={description}
        showMemoryAgent
      />
      <Link
        href={backHref}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:underline dark:text-gray-300"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        {backLabel}
      </Link>
    </>
  )
}
