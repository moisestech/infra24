import type { SlideKind } from '@/lib/domain/display'

export interface ResolvedSlide {
  kind: SlideKind
  /** Stable id for this slide in the resolved list */
  id: string
  durationSeconds: number
  title?: string
  body?: string
  imageUrl?: string
  mediaUrl?: string
  announcementId?: string
  workshopId?: string
  artistProfileId?: string
  meta?: Record<string, unknown>
}

export interface ResolvedPlaylist {
  screenId: string
  screenName: string
  playlistId: string | null
  playlistName: string | null
  resolvedAt: string
  slides: ResolvedSlide[]
}

/** playlist.metadata shape for department-scoped dynamic feeds */
export interface PlaylistDepartmentFilter {
  department_ids?: string[]
}
