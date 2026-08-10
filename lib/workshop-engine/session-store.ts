import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { generateJoinCode, normalizeJoinCode } from '@/lib/workshop-engine/join-code'
import {
  RESIN_PRINTING_MODULES,
  RESIN_PRINTING_WORKSHOP,
} from '@/lib/workshop-engine/resin-printing'
import type {
  SessionStatus,
  TvScreen,
  WorkshopLiveSession,
} from '@/lib/workshop-engine/types'

type SessionRow = {
  id: string
  workshop_slug: string
  venue_config_id: string
  join_code: string
  status: SessionStatus
  live_module_id: string
  live_step: number
  tv_screen: TvScreen
  timer_ends_at: string | null
  timer_label: string | null
  started_at: string | null
  ends_at: string | null
  created_at: string
  updated_at: string
}

type MemoryStore = Map<string, WorkshopLiveSession>

declare global {
  // eslint-disable-next-line no-var
  var __workshopLiveSessions: MemoryStore | undefined
}

const COOKIE_PREFIX = 'infra24_wls_'
const COOKIE_MAX_AGE = 60 * 60 * 12

function memoryStore(): MemoryStore {
  if (!globalThis.__workshopLiveSessions) {
    globalThis.__workshopLiveSessions = new Map()
  }
  return globalThis.__workshopLiveSessions
}

function rowToSession(row: SessionRow): WorkshopLiveSession {
  return {
    id: row.id,
    workshopSlug: row.workshop_slug,
    venueConfigId: row.venue_config_id,
    joinCode: row.join_code,
    status: row.status,
    liveModuleId: row.live_module_id,
    liveStep: row.live_step,
    tvScreen: row.tv_screen,
    timerEndsAt: row.timer_ends_at,
    timerLabel: row.timer_label,
    startedAt: row.started_at,
    endsAt: row.ends_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function sessionToRow(session: WorkshopLiveSession): SessionRow {
  return {
    id: session.id,
    workshop_slug: session.workshopSlug,
    venue_config_id: session.venueConfigId,
    join_code: session.joinCode,
    status: session.status,
    live_module_id: session.liveModuleId,
    live_step: session.liveStep,
    tv_screen: session.tvScreen,
    timer_ends_at: session.timerEndsAt,
    timer_label: session.timerLabel,
    started_at: session.startedAt,
    ends_at: session.endsAt,
    created_at: session.createdAt,
    updated_at: session.updatedAt,
  }
}

function supabaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)
}

function cookieName(code: string): string {
  return `${COOKIE_PREFIX}${code}`
}

function readCookieSession(code: string): WorkshopLiveSession | null {
  try {
    const raw = cookies().get(cookieName(code))?.value
    if (!raw) return null
    return JSON.parse(decodeURIComponent(raw)) as WorkshopLiveSession
  } catch {
    return null
  }
}

function writeCookieSession(session: WorkshopLiveSession): void {
  try {
    cookies().set(cookieName(session.joinCode), encodeURIComponent(JSON.stringify(session)), {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: COOKIE_MAX_AGE,
      secure: process.env.NODE_ENV === 'production',
    })
  } catch {
    // cookies() can throw outside a request scope; memory still holds the session.
  }
}

export type CreateLiveSessionInput = {
  workshopSlug?: string
  venueConfigId?: string
}

export type PatchLiveSessionInput = {
  status?: SessionStatus
  liveModuleId?: string
  liveStep?: number
  tvScreen?: TvScreen
  timerEndsAt?: string | null
  timerLabel?: string | null
  startedAt?: string | null
  endsAt?: string | null
}

function newSession(input: CreateLiveSessionInput): WorkshopLiveSession {
  const now = new Date().toISOString()
  const firstModule = RESIN_PRINTING_MODULES[0]
  return {
    id: crypto.randomUUID(),
    workshopSlug: input.workshopSlug ?? RESIN_PRINTING_WORKSHOP.slug,
    venueConfigId: input.venueConfigId ?? 'oolite',
    joinCode: generateJoinCode(5),
    status: 'open',
    liveModuleId: firstModule.id,
    liveStep: 0,
    tvScreen: 'join',
    timerEndsAt: null,
    timerLabel: null,
    startedAt: null,
    endsAt: null,
    createdAt: now,
    updatedAt: now,
  }
}

async function trySupabaseCreate(session: WorkshopLiveSession): Promise<WorkshopLiveSession | null> {
  if (!supabaseConfigured()) return null
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('workshop_live_sessions')
      .insert(sessionToRow(session))
      .select('*')
      .single()
    if (error || !data) return null
    return rowToSession(data as SessionRow)
  } catch {
    return null
  }
}

async function trySupabaseGet(code: string): Promise<WorkshopLiveSession | null> {
  if (!supabaseConfigured()) return null
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('workshop_live_sessions')
      .select('*')
      .eq('join_code', code)
      .maybeSingle()
    if (error || !data) return null
    return rowToSession(data as SessionRow)
  } catch {
    return null
  }
}

async function trySupabaseUpdate(
  code: string,
  patch: PatchLiveSessionInput
): Promise<WorkshopLiveSession | null> {
  if (!supabaseConfigured()) return null
  try {
    const supabase = createClient()
    const payload: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    }
    if (patch.status !== undefined) payload.status = patch.status
    if (patch.liveModuleId !== undefined) payload.live_module_id = patch.liveModuleId
    if (patch.liveStep !== undefined) payload.live_step = patch.liveStep
    if (patch.tvScreen !== undefined) payload.tv_screen = patch.tvScreen
    if (patch.timerEndsAt !== undefined) payload.timer_ends_at = patch.timerEndsAt
    if (patch.timerLabel !== undefined) payload.timer_label = patch.timerLabel
    if (patch.startedAt !== undefined) payload.started_at = patch.startedAt
    if (patch.endsAt !== undefined) payload.ends_at = patch.endsAt

    const { data, error } = await supabase
      .from('workshop_live_sessions')
      .update(payload)
      .eq('join_code', code)
      .select('*')
      .single()
    if (error || !data) return null
    return rowToSession(data as SessionRow)
  } catch {
    return null
  }
}

export async function createLiveSession(
  input: CreateLiveSessionInput = {}
): Promise<{ session: WorkshopLiveSession; storage: 'supabase' | 'memory' }> {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const candidate = newSession(input)
    const fromDb = await trySupabaseCreate(candidate)
    if (fromDb) {
      writeCookieSession(fromDb)
      memoryStore().set(fromDb.joinCode, fromDb)
      return { session: fromDb, storage: 'supabase' }
    }

    const store = memoryStore()
    if (Array.from(store.values()).some((s) => s.joinCode === candidate.joinCode)) continue
    store.set(candidate.joinCode, candidate)
    writeCookieSession(candidate)
    return { session: candidate, storage: 'memory' }
  }
  throw new Error('Could not allocate a unique join code')
}

export async function getLiveSessionByCode(
  rawCode: string
): Promise<WorkshopLiveSession | null> {
  const code = normalizeJoinCode(rawCode)
  if (!code) return null

  const fromDb = await trySupabaseGet(code)
  if (fromDb) {
    memoryStore().set(code, fromDb)
    return fromDb
  }

  const fromMemory = memoryStore().get(code)
  if (fromMemory) return fromMemory

  const fromCookie = readCookieSession(code)
  if (fromCookie) {
    memoryStore().set(code, fromCookie)
    return fromCookie
  }

  return null
}

export async function patchLiveSession(
  rawCode: string,
  patch: PatchLiveSessionInput
): Promise<WorkshopLiveSession | null> {
  const code = normalizeJoinCode(rawCode)
  if (!code) return null

  const fromDb = await trySupabaseUpdate(code, patch)
  if (fromDb) {
    memoryStore().set(code, fromDb)
    writeCookieSession(fromDb)
    return fromDb
  }

  const existing =
    memoryStore().get(code) ?? readCookieSession(code)
  if (!existing) return null

  const next: WorkshopLiveSession = {
    ...existing,
    ...patch,
    updatedAt: new Date().toISOString(),
  }
  memoryStore().set(code, next)
  writeCookieSession(next)
  return next
}
