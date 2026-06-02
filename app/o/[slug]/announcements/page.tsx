'use client'

import { useState, useEffect, useMemo, useLayoutEffect, useRef, type CSSProperties } from 'react'
import { useParams, usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Bell, Plus, Calendar, User, Eye, EyeOff, Shield, MapPin, Clock, FileCheck, Copy, LayoutGrid, List, ChevronDown } from 'lucide-react'
import { UnifiedNavigation, ooliteConfig, bakehouseConfig } from '@/components/navigation'
import { AnnouncementIdDisplay } from '@/components/admin/AnnouncementIdDisplay'
import { AnnouncementListDateBadge, ANNOUNCEMENT_LIST_THUMB_SIZE_CLASS } from '@/components/announcements/AnnouncementListDateBadge'
import {
  AnnouncementListFilterBar,
  type AnnouncementCategoryPreset,
  type AnnouncementDateSort,
  type AnnouncementStatusFilter,
} from '@/components/announcements/AnnouncementListFilterBar'
import { AnnouncementMemberPreviewToggle } from '@/components/announcements/AnnouncementMemberPreviewToggle'
import { type Announcement as AnnouncementSchema } from '@/types/announcement'
import { PageFooter } from '@/components/common/PageFooter'
import { useTenant } from '@/components/tenant/TenantProvider'
import { useOrganizationTheme } from '@/components/carousel/OrganizationThemeContext'
import { resolveOrgPrimary, orgChromeFromPrimary } from '@/lib/org/org-chrome'
import { announcementDisplayMonthKey, isDisplayDateToday, parseDisplayDateLocalMs } from '@/lib/display/announcement-month'

interface Announcement {
  id: string
  title: string
  content: string
  body?: string
  type: string
  priority: string
  visibility: string
  start_date: string | null
  end_date: string | null
  starts_at?: string | null
  ends_at?: string | null
  scheduled_at?: string | null
  location: string | null
  key_people: any[]
  metadata: any
  is_active: boolean
  created_at: string
  updated_at: string
  created_by: string
  updated_by: string
  image_url?: string | null
  image_layout?: string | null
  sub_type?: string | null
  tags?: string[] | null
}

/**
 * Prefer start anchors so the calendar column matches “when it starts” (end-only first hid April 9 workshops behind a wrong April 8 end).
 */
function announcementDateRawForDisplay(a: Announcement): string {
  return (
    (a.start_date ||
      a.starts_at ||
      a.end_date ||
      a.ends_at ||
      a.scheduled_at ||
      a.created_at) as string
  )
}

/** End of local calendar day for a date string (YYYY-MM-DD or ISO). */
function parseToEndOfLocalDayMs(raw: string | null | undefined): number | null {
  if (raw == null || String(raw).trim() === '') return null
  const s = String(raw).trim()
  const ymd = /^(\d{4})-(\d{2})-(\d{2})/.exec(s)
  if (ymd) {
    const d = new Date(Number(ymd[1]), Number(ymd[2]) - 1, Number(ymd[3]), 23, 59, 59, 999)
    return Number.isNaN(d.getTime()) ? null : d.getTime()
  }
  const d = new Date(s)
  if (Number.isNaN(d.getTime())) return null
  const copy = new Date(d)
  copy.setHours(23, 59, 59, 999)
  return copy.getTime()
}

/** Latest event day among all anchors — not expired until that local day ends. */
function announcementLatestEventDayEndMs(a: Announcement): number | null {
  const ends: number[] = []
  for (const raw of [a.starts_at, a.start_date, a.ends_at, a.end_date, a.scheduled_at]) {
    const t = parseToEndOfLocalDayMs(raw as string | null | undefined)
    if (t != null) ends.push(t)
  }
  if (ends.length === 0) return null
  return Math.max(...ends)
}

function announcementEventIsCurrent(a: Announcement): boolean {
  const last = announcementLatestEventDayEndMs(a)
  if (last == null) return true
  return last >= Date.now()
}

function isFilmPosterStylePromotion(a: Announcement): boolean {
  const t = String(a.type || '').toLowerCase()
  if (t === 'cinematic') return true
  if (t !== 'promotion') return false
  if (a.metadata?.image_only) return true
  const tags = a.tags
  if (!Array.isArray(tags)) return false
  return tags.some((x) => /film|poster/i.test(String(x)))
}

function matchesEventsExhibitionsPreset(
  a: Announcement,
  includePosters: boolean
): boolean {
  if (isFilmPosterStylePromotion(a)) return includePosters
  const t = String(a.type || '').toLowerCase()
  const st = String(a.sub_type || '').toLowerCase()
  return t === 'event' || st === 'exhibition'
}

function announcementHasTag(a: Announcement, needle: string): boolean {
  const tags = a.tags
  if (!Array.isArray(tags)) return false
  const n = needle.toLowerCase()
  return tags.some((x) => String(x).toLowerCase() === n)
}

function matchesWorkshopsPreset(a: Announcement): boolean {
  const st = String(a.sub_type || '').toLowerCase()
  if (st === 'workshop') return true
  return announcementHasTag(a, 'workshop')
}

function matchesCinematicPreset(a: Announcement): boolean {
  const t = String(a.type || '').toLowerCase()
  if (t === 'cinematic') return true
  if (isFilmPosterStylePromotion(a)) return true
  if (t === 'news' && announcementHasTag(a, 'cinematic')) return true
  return false
}

function announcementTagContains(a: Announcement, needle: string): boolean {
  const tags = a.tags
  if (!Array.isArray(tags)) return false
  const n = needle.toLowerCase()
  return tags.some((x) => String(x).toLowerCase().includes(n))
}

/** Artist-facing comms: attention to artists, open studios, residency, member spotlights, etc. */
function matchesArtistsPreset(a: Announcement): boolean {
  const t = String(a.type || '').toLowerCase()
  if (t === 'attention_artists') return true
  const st = String(a.sub_type || '').toLowerCase()
  if (st === 'open_studios' || st === 'residency') return true
  if (
    announcementHasTag(a, 'artists') ||
    announcementHasTag(a, 'artist') ||
    announcementHasTag(a, 'open-studios') ||
    announcementHasTag(a, 'open_studios') ||
    announcementHasTag(a, 'residency') ||
    announcementHasTag(a, 'studio-resident') ||
    announcementHasTag(a, 'members')
  ) {
    return true
  }
  if (announcementTagContains(a, 'open studio')) return true
  if (announcementTagContains(a, 'open-studio')) return true
  return false
}

/** Badge + display: film posters may still be stored as `promotion` until DB allows `cinematic`. */
function effectiveTypeForBadge(a: Announcement): string {
  const t = String(a.type || '').toLowerCase()
  if (t === 'cinematic' || isFilmPosterStylePromotion(a)) return 'cinematic'
  return t || 'general'
}

interface Organization {
  id: string
  name: string
  slug: string
}

export default function OrganizationAnnouncementsPage() {
  const params = useParams()
  const slug = params.slug as string
  const pathname = usePathname()
  const router = useRouter()
  const { tenantConfig } = useTenant()
  const { theme: orgTheme } = useOrganizationTheme()
  const skipFirstUrlReplace = useRef(true)

  const orgPrimary = useMemo(
    () => resolveOrgPrimary(tenantConfig?.theme?.primaryColor, orgTheme?.colors?.primary),
    [tenantConfig?.theme?.primaryColor, orgTheme?.colors?.primary]
  )
  const chrome = useMemo(() => orgChromeFromPrimary(orgPrimary), [orgPrimary])

  const pillOnChrome: CSSProperties = {
    backgroundColor: chrome.softSurface,
    color: chrome.text,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: chrome.softBorder,
  }

  // Debug tenant config
  console.log('🎨 Announcements Page - Tenant Config:', tenantConfig)
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<AnnouncementStatusFilter>('all')
  /** `YYYY-MM` in local calendar, or '' for all months */
  const [monthFilter, setMonthFilter] = useState<string>('')
  /** Previously the list hid everything without an image — that dropped many real rows */
  const [imagesOnly, setImagesOnly] = useState(false)
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards')
  const [categoryPreset, setCategoryPreset] = useState<null | AnnouncementCategoryPreset>(null)
  const [includePosterPromotions, setIncludePosterPromotions] = useState(false)
  const [viewAsMember, setViewAsMember] = useState(false)
  const [dateSort, setDateSort] = useState<AnnouncementDateSort>('latest_first')
  const [userRole, setUserRole] = useState<string>('')
  const [editingEndDate, setEditingEndDate] = useState<string | null>(null)
  const [tempEndDate, setTempEndDate] = useState<string>('')
  const [updating, setUpdating] = useState<string | null>(null)

  // Get navigation config based on organization slug
  const getNavigationConfig = () => {
    switch (slug) {
      case 'oolite':
        return ooliteConfig
      case 'bakehouse':
        return bakehouseConfig
      default:
        return ooliteConfig // Default fallback
    }
  }

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        console.log('🔍 Loading announcements for slug:', slug)
        
        let resolvedRole = userRole
        try {
          const userResponse = await fetch('/api/users/me')
          if (userResponse.ok) {
            const userData = await userResponse.json()
            resolvedRole = userData.role || 'resident'
            setUserRole(resolvedRole)
          }
        } catch {
          /* public fallback */
        }

        const adminRole =
          resolvedRole === 'super_admin' ||
          resolvedRole === 'org_admin' ||
          resolvedRole === 'moderator'
        const usePublicFeed = viewAsMember && adminRole

        let response: Response
        if (usePublicFeed) {
          response = await fetch(`/api/organizations/by-slug/${slug}/announcements/public`)
        } else {
          response = await fetch(`/api/organizations/by-slug/${slug}/announcements`)
          if (!response.ok) {
            response = await fetch(`/api/organizations/by-slug/${slug}/announcements/public`)
          }
        }
        
        if (!response.ok) {
          const errorText = await response.text()
          console.error('📢 Both endpoints failed. Last response:', response.status, errorText)
          throw new Error(`Failed to load announcements: ${response.status} - ${errorText}`)
        }
        
        const data = await response.json()
        console.log('📢 Successfully loaded announcements:', data)
        setAnnouncements(data.announcements || [])
        setOrganization(data.organization)
      } catch (err) {
        console.error('❌ Error loading announcements:', err)
        setError(err instanceof Error ? err.message : 'Failed to load announcements')
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      loadData()
    }
  }, [slug, viewAsMember])

  useLayoutEffect(() => {
    if (!slug || typeof window === 'undefined') return
    const sp = new URLSearchParams(window.location.search)
    const month = sp.get('month')
    const view = sp.get('view')
    if (month && /^\d{4}-\d{2}$/.test(month)) {
      setMonthFilter(month)
    }
    if (view === 'list' || view === 'cards') {
      setViewMode(view)
    } else {
      try {
        const stored = localStorage.getItem(`announcements-view:${slug}`)
        if (stored === 'list' || stored === 'cards') {
          setViewMode(stored)
        }
      } catch {
        /* ignore */
      }
    }
    try {
      if (localStorage.getItem(`announcements-member-preview:${slug}`) === '1') {
        setViewAsMember(true)
      }
      const storedSort = localStorage.getItem(`announcements-sort:${slug}`)
      if (storedSort === 'latest_first' || storedSort === 'earliest_first') {
        setDateSort(storedSort)
      }
    } catch {
      /* ignore */
    }
  }, [slug])

  useEffect(() => {
    if (!pathname) return
    if (skipFirstUrlReplace.current) {
      skipFirstUrlReplace.current = false
      return
    }
    const params = new URLSearchParams()
    if (monthFilter) params.set('month', monthFilter)
    if (viewMode === 'list') params.set('view', 'list')
    const q = params.toString()
    const next = q ? `${pathname}?${q}` : pathname
    router.replace(next, { scroll: false })
  }, [monthFilter, viewMode, pathname, router])

  const monthOptions = useMemo(() => {
    const keys = new Set<string>()
    for (const a of announcements) {
      const k = announcementDisplayMonthKey(a as unknown as AnnouncementSchema)
      if (k) keys.add(k)
    }
    return Array.from(keys).sort((a, b) => b.localeCompare(a))
  }, [announcements])

  const statusCounts = useMemo(
    (): Record<AnnouncementStatusFilter, number> => ({
      all: announcements.length,
      current: announcements.filter((a) => announcementEventIsCurrent(a)).length,
      expired: announcements.filter((a) => !announcementEventIsCurrent(a)).length,
      active: announcements.filter((a) => a.is_active).length,
      inactive: announcements.filter((a) => !a.is_active).length,
      public: announcements.filter((a) => a.visibility === 'public').length,
      internal: announcements.filter((a) => a.visibility === 'internal').length,
      members_only: announcements.filter((a) => a.visibility === 'members_only').length,
    }),
    [announcements]
  )

  const hasExtraFilters =
    filter !== 'all' ||
    imagesOnly ||
    Boolean(categoryPreset) ||
    Boolean(monthFilter) ||
    includePosterPromotions

  const handlePresetChange = (
    preset: 'none' | 'april_2026' | AnnouncementCategoryPreset
  ) => {
    if (preset === 'none') {
      setCategoryPreset(null)
      setMonthFilter('')
      setIncludePosterPromotions(false)
      return
    }
    if (preset === 'april_2026') {
      setMonthFilter('2026-04')
      setCategoryPreset(null)
      setIncludePosterPromotions(false)
      return
    }
    setCategoryPreset(preset)
    setMonthFilter('')
    if (preset !== 'events_exhibitions') {
      setIncludePosterPromotions(false)
    }
  }

  const clearAllFilters = () => {
    setFilter('all')
    setMonthFilter('')
    setImagesOnly(false)
    setCategoryPreset(null)
    setIncludePosterPromotions(false)
  }

  const filteredAnnouncements = useMemo(() => {
    return announcements.filter((announcement) => {
    if (imagesOnly && (!announcement.image_url || announcement.image_url.trim() === '')) {
      return false
    }
    if (monthFilter) {
      const k = announcementDisplayMonthKey(announcement as unknown as AnnouncementSchema)
      if (k !== monthFilter) return false
    }
    if (categoryPreset === 'events_exhibitions') {
      if (!matchesEventsExhibitionsPreset(announcement, includePosterPromotions)) {
        return false
      }
    }
    if (categoryPreset === 'workshops') {
      if (!matchesWorkshopsPreset(announcement)) return false
    }
    if (categoryPreset === 'cinematic') {
      if (!matchesCinematicPreset(announcement)) return false
    }
    if (categoryPreset === 'artists') {
      if (!matchesArtistsPreset(announcement)) return false
    }

    if (filter === 'all') return true
    if (filter === 'current') {
      return announcementEventIsCurrent(announcement)
    }
    if (filter === 'expired') {
      return !announcementEventIsCurrent(announcement)
    }
    if (filter === 'active') return announcement.is_active
    if (filter === 'inactive') return !announcement.is_active
    if (filter === 'public') return announcement.visibility === 'public'
    if (filter === 'internal') return announcement.visibility === 'internal'
    if (filter === 'members_only') return announcement.visibility === 'members_only'
    return true
    })
  }, [
    announcements,
    imagesOnly,
    monthFilter,
    categoryPreset,
    includePosterPromotions,
    filter,
  ])

  const uniqueAnnouncements = useMemo(() => {
    return filteredAnnouncements.reduce((acc, announcement) => {
      if (!acc.find((a) => a.id === announcement.id)) {
        acc.push(announcement)
      }
      return acc
    }, [] as Announcement[])
  }, [filteredAnnouncements])

  const sortedAnnouncements = useMemo(() => {
    const withDates = uniqueAnnouncements.map((a) => ({
      announcement: a,
      sortMs: parseDisplayDateLocalMs(announcementDateRawForDisplay(a)),
    }))

    const missing = dateSort === 'latest_first' ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY

    return withDates
      .sort((a, b) => {
        const na = Number.isNaN(a.sortMs) ? missing : a.sortMs
        const nb = Number.isNaN(b.sortMs) ? missing : b.sortMs
        return dateSort === 'latest_first' ? nb - na : na - nb
      })
      .map((x) => x.announcement)
  }, [uniqueAnnouncements, dateSort])

  if (filteredAnnouncements.length !== uniqueAnnouncements.length) {
    console.log('🔍 Found duplicates:', {
      before: filteredAnnouncements.length,
      after: uniqueAnnouncements.length,
      removed: filteredAnnouncements.length - uniqueAnnouncements.length,
    })
  }

  console.log('📋 Final announcements count:', sortedAnnouncements.length, 'unique announcements')

  // Utility functions for date handling
  const isToday = (dateString: string) => isDisplayDateToday(dateString)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatDateForInput = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toISOString().split('T')[0]
  }

  const handleEditEndDate = (announcementId: string, currentEndDate?: string) => {
    setEditingEndDate(announcementId)
    setTempEndDate(formatDateForInput(currentEndDate || ''))
  }

  const handleCancelEdit = () => {
    setEditingEndDate(null)
    setTempEndDate('')
  }

  const handleSaveEndDate = async (announcementId: string) => {
    try {
      setUpdating(announcementId)
      
      const response = await fetch(`/api/announcements/${announcementId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          end_date: tempEndDate ? new Date(tempEndDate).toISOString() : null
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update end date')
      }

      // Update the local state
      setAnnouncements(prev => prev.map(announcement => 
        announcement.id === announcementId 
          ? { ...announcement, end_date: tempEndDate ? new Date(tempEndDate).toISOString() : null }
          : announcement
      ))

      setEditingEndDate(null)
      setTempEndDate('')
    } catch (error) {
      console.error('Error updating end date:', error)
      alert('Failed to update end date. Please try again.')
    } finally {
      setUpdating(null)
    }
  }

  const isAdmin = userRole === 'super_admin' || userRole === 'org_admin' || userRole === 'moderator'
  const showAdminChrome = isAdmin && !viewAsMember

  const handleMemberPreviewChange = (on: boolean) => {
    setViewAsMember(on)
    try {
      localStorage.setItem(`announcements-member-preview:${slug}`, on ? '1' : '0')
    } catch {
      /* ignore */
    }
    if (on) {
      setFilter((current) =>
        current === 'all' || current === 'current' || current === 'expired' ? current : 'all'
      )
    }
  }

  const navUserRole = showAdminChrome ? userRole : 'member'

  const persistDateSort = (sort: AnnouncementDateSort) => {
    setDateSort(sort)
    try {
      localStorage.setItem(`announcements-sort:${slug}`, sort)
    } catch {
      /* ignore */
    }
  }

  const persistViewMode = (mode: 'cards' | 'list') => {
    setViewMode(mode)
    try {
      localStorage.setItem(`announcements-view:${slug}`, mode)
    } catch {
      /* ignore */
    }
  }

  const getStatusColor = (isActive: boolean) => {
    return isActive
      ? ''
      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
  }

  const getVisibilityColor = (visibility: string) => {
    switch (visibility) {
      case 'public':
        return ''
      case 'internal':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'members_only':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    }
  }

  const getTypeBadge = (type?: string) => {
    if (!type) return null;
    
    const typeStyles = {
      urgent: { bg: 'bg-red-100', text: 'text-red-800', label: 'Urgent' },
      facility: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Facility' },
      event: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Event' },
      opportunity: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Opportunity' },
      administrative: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Admin' },
      promotion: { bg: 'bg-fuchsia-100', text: 'text-fuchsia-900', label: 'Promotion' },
      cinematic: { bg: 'bg-violet-100', text: 'text-violet-900', label: 'Cinematic' },
      news: { bg: 'bg-slate-100', text: 'text-slate-800', label: 'News' },
      general: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'General' },
    };
    
    const style = typeStyles[type as keyof typeof typeStyles] || typeStyles.event;
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${style.bg} ${style.text}`}>
        {style.label}
      </span>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <UnifiedNavigation config={getNavigationConfig()} userRole={navUserRole as any} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <UnifiedNavigation config={getNavigationConfig()} userRole={navUserRole as any} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <UnifiedNavigation config={getNavigationConfig()} userRole={navUserRole as any} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Announcements
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base">
                {viewAsMember
                  ? 'Public programming and news for members'
                  : showAdminChrome
                    ? 'Manage programming, display, and visibility'
                    : 'Programming and news for this organization'}
              </p>
              {viewAsMember ? (
                <p className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-900 dark:bg-amber-950/50 dark:text-amber-100">
                  <Eye className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  Previewing member view — admin controls hidden
                </p>
              ) : null}
            </div>
            {showAdminChrome ? (
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={`/o/${slug}/announcements/display`}
                  className="px-3 py-2 rounded-lg flex items-center gap-2 text-sm transition-colors"
                  style={{
                    background: chrome.gradient135,
                    color: chrome.onSolid,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = chrome.gradient135Hover
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = chrome.gradient135
                  }}
                >
                  <Eye className="h-4 w-4 shrink-0" />
                  <span>Display</span>
                </Link>
                <details className="relative group">
                  <summary className="list-none cursor-pointer rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 [&::-webkit-details-marker]:hidden">
                    <LayoutGrid className="h-4 w-4 shrink-0" />
                    <span>More</span>
                    <ChevronDown className="h-4 w-4 shrink-0 opacity-70" />
                  </summary>
                  <div className="absolute right-0 z-50 mt-1 w-56 rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-600 dark:bg-gray-800">
                    <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Preview segment
                    </div>
                    <Link
                      href={`/o/${slug}/announcements/display?view=announcement_carousel`}
                      className="block px-3 py-2 text-sm text-gray-800 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
                    >
                      Carousel
                    </Link>
                    <Link
                      href={`/o/${slug}/announcements/display?view=announcement_fullscreen`}
                      className="block px-3 py-2 text-sm text-gray-800 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
                    >
                      Fullscreen
                    </Link>
                    <Link
                      href={`/o/${slug}/announcements/display?view=grid_workshops`}
                      className="block px-3 py-2 text-sm text-gray-800 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
                    >
                      Workshops grid
                    </Link>
                    <Link
                      href={`/o/${slug}/announcements/display?view=grid_artists`}
                      className="block px-3 py-2 text-sm text-gray-800 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
                    >
                      Artists grid
                    </Link>
                    <Link
                      href={`/o/${slug}/announcements/display?view=grid_cinematic`}
                      className="block px-3 py-2 text-sm text-gray-800 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
                    >
                      Cinematic grid
                    </Link>
                    <div className="my-1 border-t border-gray-200 dark:border-gray-600" />
                    <Link
                      href={`/o/${slug}/announcements/create`}
                      className="block px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
                    >
                      New announcement
                    </Link>
                  </div>
                </details>
              </div>
            ) : null}
          </div>
        </div>

        {/* Admin Summary — collapsed by default to keep the top area minimal */}
        {showAdminChrome && announcements.length > 0 && (
          <details className="mb-6 rounded-lg border border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/10">
            <summary className="cursor-pointer list-none px-4 py-3 flex items-center justify-between [&::-webkit-details-marker]:hidden">
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Admin quick access
              </h3>
              <span className="text-xs text-yellow-600 dark:text-yellow-400">
                {announcements.length} announcement{announcements.length !== 1 ? 's' : ''}
              </span>
            </summary>
            <div className="px-4 pb-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {announcements.map((announcement) => (
                <div key={announcement.id} className="flex items-center justify-between bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 p-2">
                  <div className="flex-1 min-w-0">
                    <code className="text-xs font-mono text-gray-700 dark:text-gray-300 truncate block">
                      {announcement.id}
                    </code>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {announcement.title}
                    </p>
                  </div>
                  <button
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(announcement.id)
                        console.log('Copied ID:', announcement.id)
                      } catch (err) {
                        console.error('Failed to copy ID:', err)
                      }
                    }}
                    className="ml-2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    title="Copy ID"
                  >
                    <Copy className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
            </div>
          </details>
        )}

        {/* Filters — single toolbar row */}
        <div className="mb-6">
          <AnnouncementListFilterBar
            leading={
              <>
                <label className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-800 dark:text-gray-200">
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Month
                  </span>
                  <select
                    value={monthFilter}
                    onChange={(e) => setMonthFilter(e.target.value)}
                    className="min-w-[9.5rem] border-0 bg-transparent p-0 text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-0"
                  >
                    <option value="">All months</option>
                    {monthOptions.map((key) => {
                      const label = new Date(`${key}-01T12:00:00`).toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric',
                      })
                      const count = announcements.filter(
                        (a) =>
                          announcementDisplayMonthKey(a as unknown as AnnouncementSchema) === key
                      ).length
                      return (
                        <option key={key} value={key}>
                          {label} ({count})
                        </option>
                      )
                    })}
                  </select>
                </label>
                <div
                  className="inline-flex shrink-0 rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden"
                  role="group"
                  aria-label="Announcement layout"
                >
                  <button
                    type="button"
                    aria-pressed={viewMode === 'cards'}
                    onClick={() => persistViewMode('cards')}
                    className={`px-3 py-2 text-sm flex items-center gap-1.5 transition-colors ${
                      viewMode === 'cards'
                        ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                    title="Card view"
                  >
                    <LayoutGrid className="h-4 w-4 shrink-0" />
                    <span className="hidden sm:inline">Cards</span>
                  </button>
                  <button
                    type="button"
                    aria-pressed={viewMode === 'list'}
                    onClick={() => persistViewMode('list')}
                    className={`px-3 py-2 text-sm flex items-center gap-1.5 border-l border-gray-300 dark:border-gray-600 transition-colors ${
                      viewMode === 'list'
                        ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                    title="List view"
                  >
                    <List className="h-4 w-4 shrink-0" />
                    <span className="hidden sm:inline">List</span>
                  </button>
                </div>
                {isAdmin ? (
                  <AnnouncementMemberPreviewToggle
                    viewAsMember={viewAsMember}
                    onChange={handleMemberPreviewChange}
                  />
                ) : null}
              </>
            }
            filter={filter}
            onFilterChange={setFilter}
            memberPreview={viewAsMember}
            statusCounts={statusCounts}
            categoryPreset={categoryPreset}
            monthFilter={monthFilter}
            onPresetChange={handlePresetChange}
            includePosterPromotions={includePosterPromotions}
            onIncludePosterPromotionsChange={setIncludePosterPromotions}
            imagesOnly={imagesOnly}
            onImagesOnlyChange={setImagesOnly}
            onClearAll={clearAllFilters}
            hasExtraFilters={hasExtraFilters}
            chrome={chrome}
            dateSort={dateSort}
            onDateSortChange={persistDateSort}
          />
        </div>

        {/* Announcements List */}
        <div className="space-y-4">
          {sortedAnnouncements.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No announcements found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {monthFilter || imagesOnly || categoryPreset || includePosterPromotions
                  ? 'No announcements match the current filters. Try “All months”, turn off “Image only”, or clear presets.'
                  : filter === 'all'
                    ? 'No announcements have been created yet.'
                    : `No ${filter} announcements found.`}
              </p>
              {showAdminChrome ? (
              <Link
                href={`/o/${slug}/announcements/create`}
                className="px-4 py-2 rounded-lg inline-flex items-center space-x-2 transition-colors"
                style={{
                  backgroundColor: chrome.solid,
                  color: chrome.onSolid,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = chrome.solidHover
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = chrome.solid
                }}
              >
                <Plus className="h-4 w-4" />
                <span>Create First Announcement</span>
              </Link>
              ) : null}
            </div>
          ) : viewMode === 'list' ? (
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 overflow-hidden">
              {sortedAnnouncements.map((announcement) => {
                const sortRaw = announcementDateRawForDisplay(announcement)
                const detailHref = `/o/${slug}/announcements/${announcement.id}`
                const isStillActive = announcementEventIsCurrent(announcement)
                const isEventToday = isToday(sortRaw)
                return (
                  <div
                    key={announcement.id}
                    className={`flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 px-4 sm:px-5 py-4 transition-colors ${
                      !isStillActive
                        ? 'bg-gray-50/90 dark:bg-gray-900/40 opacity-80 hover:bg-gray-100/90 dark:hover:bg-gray-800/60'
                        : isEventToday
                          ? 'bg-green-50/80 dark:bg-green-950/25 hover:bg-green-50 dark:hover:bg-green-950/40'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    <div className="flex shrink-0 items-center gap-3 sm:w-auto">
                      <AnnouncementListDateBadge
                        dateString={sortRaw}
                        muted={!isStillActive}
                      />
                      {announcement.image_url ? (
                        <Link
                          href={detailHref}
                          className={`hidden sm:block shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-600 ${ANNOUNCEMENT_LIST_THUMB_SIZE_CLASS}`}
                        >
                          <img
                            src={announcement.image_url}
                            alt=""
                            className={`h-full w-full object-cover ${!isStillActive ? 'grayscale-[35%]' : ''}`}
                            onError={(e) => {
                              e.currentTarget.style.display = 'none'
                            }}
                          />
                        </Link>
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          href={detailHref}
                          className={`text-lg font-semibold hover:underline line-clamp-2 ${
                            !isStillActive
                              ? 'text-gray-600 dark:text-gray-400'
                              : 'text-gray-900 dark:text-white'
                          }`}
                        >
                          {announcement.title}
                        </Link>
                        {isEventToday && isStillActive ? (
                          <span className="inline-flex shrink-0 rounded-full bg-green-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                            Today
                          </span>
                        ) : null}
                        {!isStillActive ? (
                          <span className="inline-flex shrink-0 rounded-full bg-gray-200 px-2 py-0.5 text-[10px] font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                            Past
                          </span>
                        ) : null}
                      </div>
                      <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                        {getTypeBadge(effectiveTypeForBadge(announcement))}
                        {announcement.sub_type && String(announcement.sub_type).trim() !== '' && (
                          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200 capitalize">
                            {String(announcement.sub_type).replace(/_/g, ' ')}
                          </span>
                        )}
                        {showAdminChrome && (
                          <>
                            <span
                              className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(announcement.is_active)}`}
                              style={announcement.is_active ? pillOnChrome : undefined}
                            >
                              {announcement.is_active ? 'Active' : 'Inactive'}
                            </span>
                            <span
                              className={`px-2 py-0.5 text-xs font-medium rounded-full ${getVisibilityColor(announcement.visibility)}`}
                              style={
                                announcement.visibility === 'public' ? pillOnChrome : undefined
                              }
                            >
                              {announcement.visibility}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2 sm:flex-col sm:items-end">
                      <Link
                        href={detailHref}
                        className="text-base font-medium whitespace-nowrap"
                        style={{ color: chrome.text }}
                      >
                        View
                      </Link>
                      {showAdminChrome && (
                        <Link
                          href={`/o/${slug}/announcements/${announcement.id}/edit`}
                          className="text-sm text-gray-600 dark:text-gray-400 hover:underline whitespace-nowrap"
                        >
                          Edit
                        </Link>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedAnnouncements.map((announcement) => {
              const eventDate = announcementDateRawForDisplay(announcement)
              const detailHref = `/o/${slug}/announcements/${announcement.id}`
              const isEventToday = isToday(eventDate)
              const isStillActive = announcementEventIsCurrent(announcement)

              return (
                <article
                  key={announcement.id}
                  className={`flex h-full flex-col overflow-hidden rounded-lg border transition-shadow ${
                    !isStillActive
                      ? 'border-gray-300 bg-gray-50 opacity-90 dark:border-gray-600 dark:bg-gray-800/50'
                      : isEventToday
                        ? 'border-green-200 bg-green-50/50 hover:shadow-md dark:border-green-800 dark:bg-green-950/20'
                        : 'border-gray-200 bg-white hover:shadow-md dark:border-gray-700 dark:bg-gray-800'
                  }`}
                >
                  {showAdminChrome && (
                    <AnnouncementIdDisplay
                      announcement={announcement}
                      onEdit={(id) => {
                        console.log('Edit announcement ID:', id)
                      }}
                      onDelete={(id) => {
                        setAnnouncements((prev) => prev.filter((a) => a.id !== id))
                      }}
                    />
                  )}

                  {announcement.image_url ? (
                    <Link href={detailHref} className="block aspect-[16/10] shrink-0 overflow-hidden border-b border-gray-200 dark:border-gray-700">
                      <img
                        src={announcement.image_url}
                        alt={announcement.title}
                        className={`h-full w-full object-cover ${!isStillActive ? 'grayscale-[35%]' : ''}`}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    </Link>
                  ) : null}

                  <div className="flex flex-1 flex-col gap-3 p-4">
                    <div className="flex items-start gap-3">
                      <div className="relative shrink-0">
                        <AnnouncementListDateBadge
                          dateString={eventDate}
                          muted={!isStillActive}
                        />
                        {isEventToday && isStillActive ? (
                          <span className="absolute -right-1 -top-1 rounded-full bg-green-500 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white shadow">
                            Today
                          </span>
                        ) : null}
                      </div>
                      <div className="min-w-0 flex-1">
                        <Link href={detailHref} className="block">
                          <h3
                            className={`text-lg font-semibold leading-snug line-clamp-2 hover:underline ${
                              !isStillActive
                                ? 'text-gray-600 dark:text-gray-400'
                                : 'text-gray-900 dark:text-white'
                            }`}
                          >
                            {announcement.title}
                          </h3>
                        </Link>
                        <div className="mt-2 flex flex-wrap items-center gap-1.5">
                          {getTypeBadge(effectiveTypeForBadge(announcement))}
                          {announcement.sub_type && String(announcement.sub_type).trim() !== '' && (
                            <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium capitalize text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200">
                              {String(announcement.sub_type).replace(/_/g, ' ')}
                            </span>
                          )}
                          {showAdminChrome ? (
                            <>
                              <span
                                className={`rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(announcement.is_active)}`}
                                style={announcement.is_active ? pillOnChrome : undefined}
                              >
                                {announcement.is_active ? 'Active' : 'Inactive'}
                              </span>
                              <span
                                className={`rounded-full px-2 py-0.5 text-xs font-medium ${getVisibilityColor(announcement.visibility)}`}
                                style={
                                  announcement.visibility === 'public' ? pillOnChrome : undefined
                                }
                              >
                                {announcement.visibility}
                              </span>
                              {announcement.priority !== 'normal' && (
                                <span
                                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                    announcement.priority === 'urgent'
                                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                      : announcement.priority === 'high'
                                        ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                                  }`}
                                >
                                  {announcement.priority}
                                </span>
                              )}
                            </>
                          ) : null}
                          {!isStillActive ? (
                            <span className="rounded-full bg-gray-200 px-2 py-0.5 text-[10px] font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                              Past
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    <p
                      className={`line-clamp-3 text-sm ${
                        !isStillActive
                          ? 'text-gray-400 dark:text-gray-500'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {announcement.body || announcement.content}
                    </p>

                    {announcement.location ? (
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <MapPin className="h-4 w-4 shrink-0 text-gray-400" />
                        <span className="line-clamp-1">{announcement.location}</span>
                      </div>
                    ) : null}

                    {announcement.key_people && announcement.key_people.length > 0 ? (
                      <div className="flex items-start gap-2">
                        <User className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                        <div className="flex flex-wrap gap-1">
                          {announcement.key_people.map((person: { name?: string } | string, index: number) => (
                            <span
                              key={index}
                              className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                            >
                              {typeof person === 'object' && person?.name ? person.name : String(person)}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    {showAdminChrome ? (
                      <>
                        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-800 dark:bg-yellow-900/10">
                          <div className="mb-2 flex items-center">
                            <Shield className="mr-2 h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                            <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                              Admin information
                            </span>
                          </div>
                          <div className="grid grid-cols-1 gap-2 text-xs text-yellow-700 dark:text-yellow-300">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>Created: {formatDate(announcement.created_at)}</span>
                            </div>
                            {announcement.end_date ? (
                              <div className="flex items-center gap-1">
                                <EyeOff className="h-3 w-3" />
                                <span>Expires: {formatDate(announcement.end_date)}</span>
                              </div>
                            ) : null}
                          </div>
                        </div>

                        {announcement.end_date ? (
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Clock className="h-4 w-4 shrink-0 text-gray-400" />
                            {editingEndDate === announcement.id ? (
                              <div className="flex flex-wrap items-center gap-2">
                                <input
                                  type="date"
                                  value={tempEndDate}
                                  onChange={(e) => setTempEndDate(e.target.value)}
                                  className="rounded border border-gray-300 px-2 py-1 text-sm"
                                  disabled={updating === announcement.id}
                                />
                                <button
                                  onClick={() => handleSaveEndDate(announcement.id)}
                                  disabled={updating === announcement.id}
                                  className="text-xs font-medium text-green-600 hover:text-green-500 disabled:opacity-50"
                                >
                                  {updating === announcement.id ? 'Saving…' : 'Save'}
                                </button>
                                <button
                                  onClick={handleCancelEdit}
                                  disabled={updating === announcement.id}
                                  className="text-xs font-medium text-gray-600 hover:text-gray-500 disabled:opacity-50"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <span>Ends: {new Date(announcement.end_date).toLocaleDateString()}</span>
                                <button
                                  onClick={() =>
                                    handleEditEndDate(announcement.id, announcement.end_date || undefined)
                                  }
                                  className="text-xs font-medium text-blue-600 hover:text-blue-500"
                                >
                                  Edit
                                </button>
                              </div>
                            )}
                          </div>
                        ) : null}
                      </>
                    ) : null}

                    <div className="mt-auto flex items-center gap-3 pt-1">
                      <Link
                        href={detailHref}
                        className="text-sm font-medium transition-colors"
                        style={{ color: chrome.text }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = chrome.solidHover
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = chrome.text
                        }}
                      >
                        View
                      </Link>
                      {showAdminChrome ? (
                        <Link
                          href={`/o/${slug}/announcements/${announcement.id}/edit`}
                          className="text-sm font-medium text-gray-600 hover:text-gray-500 dark:text-gray-400"
                        >
                          Edit
                        </Link>
                      ) : null}
                    </div>

                    {announcement.title.toLowerCase().includes('survey') ? (
                      <a
                        href={`/o/${slug}/surveys`}
                        className="inline-flex w-fit items-center rounded-md bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
                      >
                        <FileCheck className="mr-1 h-3 w-3" />
                        Take Survey
                      </a>
                    ) : null}
                  </div>
                </article>
              )
            })}
            </div>
          )}

          {/* Page Footer */}
          <PageFooter
            organizationSlug={slug}
            showGetStarted={true}
            showGuidelines={false}
            showTerms={false}
          />
        </div>
      </div>
    </div>
  )
}
