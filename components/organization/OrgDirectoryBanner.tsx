'use client'

import type { ReactNode } from 'react'

import { getDirectoryBannerUrl, type DirectoryBannerPage } from '@/lib/org/directory-banners'
import { getTenantConfig } from '@/lib/tenant'
import { cn } from '@/lib/utils'

type OrgDirectoryBannerProps = {
  orgSlug: string
  /** Short label over the image (e.g. Alumni, Artists) */
  title: string
  /** Icon beside the title (e.g. page icon moved into the hero). */
  titleIcon?: ReactNode
  subtitle?: ReactNode
  className?: string
  /** Use a page-specific banner when configured (e.g. residents, alumni). */
  page?: DirectoryBannerPage
  /** Explicit image URL; wins over `page` and tenant default. */
  imageUrl?: string
  /** Background focal point for cover image (default center). */
  imagePosition?: 'center' | 'top'
}

/** Shared hero banner for org directory pages (alumni, artists, residents). */
export function OrgDirectoryBanner({
  orgSlug,
  title,
  titleIcon,
  subtitle,
  className,
  page,
  imageUrl,
  imagePosition = 'center',
}: OrgDirectoryBannerProps) {
  const tenant = getTenantConfig(orgSlug)
  const bannerUrl =
    imageUrl?.trim() ||
    (page ? getDirectoryBannerUrl(orgSlug, page) : undefined) ||
    tenant?.theme?.banner?.trim()

  if (!bannerUrl) return null

  return (
    <div
      className={cn(
        'relative -mx-4 mb-8 overflow-hidden sm:mx-0 sm:rounded-xl',
        className
      )}
    >
      <div
        className={cn(
          'absolute inset-0 bg-cover',
          imagePosition === 'top' ? 'bg-top' : 'bg-center'
        )}
        style={{ backgroundImage: `url(${bannerUrl})` }}
        role="img"
        aria-label=""
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/45 to-black/25" />
      <div className="relative px-6 py-10 sm:px-10 sm:py-14">
        <div className="flex flex-wrap items-center gap-3">
          {titleIcon ? (
            <span className="shrink-0 text-white drop-shadow-md [&_svg]:h-8 [&_svg]:w-8 sm:[&_svg]:h-9 sm:[&_svg]:w-9">
              {titleIcon}
            </span>
          ) : null}
          <h1 className="text-2xl font-bold tracking-tight text-white drop-shadow-md sm:text-3xl">
            {title}
          </h1>
        </div>
        {subtitle ? (
          <p className="mt-2 max-w-2xl text-sm text-white/90 sm:text-base [&_a]:font-medium [&_a]:text-white [&_a]:underline [&_a]:underline-offset-2 [&_a]:hover:text-white/95">
            {subtitle}
          </p>
        ) : null}
      </div>
    </div>
  )
}
