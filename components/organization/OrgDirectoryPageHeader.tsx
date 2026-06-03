'use client'

import type { ReactNode } from 'react'
import { useMemo } from 'react'

import { AnnouncementMemoryAgentPrompt } from '@/components/announcements/AnnouncementMemoryAgentPrompt'
import { useOrganizationTheme } from '@/components/carousel/OrganizationThemeContext'
import { orgChromeFromPrimary, resolveOrgPrimary } from '@/lib/org/org-chrome'
import { getTenantConfig } from '@/lib/tenant'
import { cn } from '@/lib/utils'

type OrgDirectoryPageHeaderProps = {
  orgSlug: string
  title: string
  description?: ReactNode
  /** Short secondary line (e.g. member count). */
  meta?: ReactNode
  titleIcon?: ReactNode
  /** Toolbar below title row (filters toggle, mode switch, admin actions). */
  actions?: ReactNode
  /** Extra controls under Memory Agent (e.g. Display / admin menu on announcements). */
  aside?: ReactNode
  showMemoryAgent?: boolean
  className?: string
}

/**
 * Minimal directory header aligned with /announcements: title block + Memory Agent nudge.
 */
export function OrgDirectoryPageHeader({
  orgSlug,
  title,
  description,
  meta,
  titleIcon,
  actions,
  aside,
  showMemoryAgent = true,
  className,
}: OrgDirectoryPageHeaderProps) {
  const { theme: orgTheme } = useOrganizationTheme()
  const tenant = getTenantConfig(orgSlug)

  const chrome = useMemo(() => {
    const primary = resolveOrgPrimary(
      tenant?.theme?.primaryColor,
      orgTheme?.colors?.primary
    )
    return orgChromeFromPrimary(primary)
  }, [tenant?.theme?.primaryColor, orgTheme?.colors?.primary])

  return (
    <div className={cn('mb-6', className)}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-3">
            {titleIcon ? (
              <div
                className="shrink-0 rounded-lg p-2.5 sm:p-3"
                style={{ backgroundColor: chrome.iconTileBg }}
              >
                <span className="flex h-7 w-7 items-center justify-center sm:h-8 sm:w-8 [&_svg]:h-7 [&_svg]:w-7 sm:[&_svg]:h-8 sm:[&_svg]:w-8" style={{ color: chrome.text }}>
                  {titleIcon}
                </span>
              </div>
            ) : null}
            <div className="min-w-0">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
                {title}
              </h1>
              {meta ? (
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 sm:text-base">
                  {meta}
                </p>
              ) : null}
              {description ? (
                <div className="mt-2 max-w-3xl space-y-2 text-sm text-gray-500 dark:text-gray-500">
                  {description}
                </div>
              ) : null}
            </div>
          </div>
        </div>
        {showMemoryAgent && tenant?.dashboard.showMemoryAgent ? (
          <div className="flex w-full shrink-0 flex-col gap-3 sm:w-auto lg:max-w-xs lg:items-stretch">
            <AnnouncementMemoryAgentPrompt
              orgSlug={orgSlug}
              chrome={{ solid: chrome.solid, softSurface: chrome.softSurface }}
            />
            {aside}
          </div>
        ) : aside ? (
          <div className="flex w-full shrink-0 flex-col gap-3 sm:w-auto lg:max-w-xs lg:items-stretch">
            {aside}
          </div>
        ) : null}
      </div>
      {actions ? (
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          {actions}
        </div>
      ) : null}
    </div>
  )
}
