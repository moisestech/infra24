#!/usr/bin/env node
/**
 * Seed / upsert Oolite catalog workshops from JSON (first eight + future rows).
 * Run: node scripts/data/seed/seed-oolite-workshops-catalog.js
 *
 * Idempotent: updates existing rows matched by metadata.slug for the target org.
 * relatedSlugs in JSON are resolved to relatedWorkshopIds after all upserts.
 */

const fs = require('fs')
const path = require('path')

require('dotenv').config({ path: '.env.local' })

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321'
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const PLACEHOLDER =
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80'

const CATALOG_PATHS = [
  path.join(__dirname, '../../../data/workshops/oolite-first-eight.json'),
  path.join(__dirname, '../../../data/oolite/adult-art-classes-spring-2026.json'),
]

function loadCatalog() {
  let organizationSlug = 'oolite'
  const workshops = []
  for (const catalogPath of CATALOG_PATHS) {
    if (!fs.existsSync(catalogPath)) {
      console.warn('Catalog file missing, skipping:', catalogPath)
      continue
    }
    const raw = fs.readFileSync(catalogPath, 'utf8')
    const data = JSON.parse(raw)
    if (!data.workshops || !Array.isArray(data.workshops)) {
      throw new Error(`Catalog must contain workshops array: ${catalogPath}`)
    }
    organizationSlug = data.organizationSlug || organizationSlug
    workshops.push(...data.workshops)
  }
  if (workshops.length === 0) {
    throw new Error('No workshop catalogs loaded (all paths missing or empty)')
  }
  return { organizationSlug, workshops }
}

async function upsertWorkshop(orgId, row, metadataForDb) {
  const slug = metadataForDb.slug
  const { data: existing } = await supabase
    .from('workshops')
    .select('id')
    .eq('organization_id', orgId)
    .eq('metadata->>slug', slug)
    .maybeSingle()

  const imageFromRow =
    row.image_url && String(row.image_url).trim()
      ? String(row.image_url).trim()
      : null

  const galleryUrls = metadataForDb.galleryImageUrls
  const imageFromGallery =
    Array.isArray(galleryUrls) &&
    galleryUrls.length > 0 &&
    typeof galleryUrls[0] === 'string' &&
    galleryUrls[0].trim()
      ? galleryUrls[0].trim()
      : null

  const resolvedImage = imageFromRow || imageFromGallery || PLACEHOLDER

  const payload = {
    organization_id: orgId,
    title: row.title,
    description: row.description,
    content: row.content,
    category: row.category,
    type: 'workshop',
    level: row.level,
    duration_minutes: row.duration_minutes,
    max_participants: row.max_participants,
    price: row.price,
    instructor: row.instructor,
    prerequisites: row.prerequisites,
    materials: row.materials,
    outcomes: row.outcomes,
    is_active: row.is_active,
    is_public: row.is_public,
    is_shared: false,
    featured: row.featured,
    status: row.status,
    image_url: resolvedImage,
    metadata: metadataForDb,
    created_by: 'seed_oolite_workshops_catalog',
  }

  if (existing?.id) {
    const { error } = await supabase.from('workshops').update(payload).eq('id', existing.id)
    if (error) throw error
    console.log('Updated:', slug, existing.id)
    return existing.id
  }

  const { data: inserted, error } = await supabase
    .from('workshops')
    .insert(payload)
    .select('id')
    .single()

  if (error) throw error
  console.log('Inserted:', slug, inserted.id)
  return inserted.id
}

async function main() {
  const catalog = loadCatalog()
  const orgSlug = catalog.organizationSlug || 'oolite'

  const { data: org, error: orgErr } = await supabase
    .from('organizations')
    .select('id, slug')
    .eq('slug', orgSlug)
    .single()

  if (orgErr || !org) {
    console.error('Organization not found:', orgSlug, orgErr)
    process.exit(1)
  }

  const slugToRelatedSlugs = {}
  const ids = {}

  for (const entry of catalog.workshops) {
    const { relatedSlugs = [], metadata: _ignore, ...row } = entry
    const metadata = { ...(entry.metadata || {}) }
    delete metadata.relatedWorkshopIds
    metadata.slug = metadata.slug || entry.slug
    metadata.announcement_title =
      metadata.announcement_title || entry.title
    const displaySchedule =
      typeof entry.schedule === 'string' ? entry.schedule.trim() : ''
    if (displaySchedule) metadata.displaySchedule = displaySchedule
    if (typeof entry.start_date === 'string' && entry.start_date.trim()) {
      metadata.sessionStartDate = entry.start_date.trim()
    }
    if (typeof entry.end_date === 'string' && entry.end_date.trim()) {
      metadata.sessionEndDate = entry.end_date.trim()
    }
    if (!metadata.slug) {
      throw new Error(`Workshop missing metadata.slug: ${entry.title}`)
    }

    const workshopSlug = metadata.slug || row.slug
    slugToRelatedSlugs[workshopSlug] = Array.isArray(relatedSlugs) ? relatedSlugs : []

    const id = await upsertWorkshop(org.id, row, metadata)
    ids[workshopSlug] = id
  }

  for (const entry of catalog.workshops) {
    const workshopSlug = entry.metadata?.slug || entry.slug
    const want = slugToRelatedSlugs[workshopSlug] || []
    const relatedIds = want
      .map((s) => ids[s])
      .filter((id) => id && id !== ids[workshopSlug])

    const metadata = { ...(entry.metadata || {}) }
    metadata.relatedWorkshopIds = relatedIds

    const { error } = await supabase
      .from('workshops')
      .update({ metadata })
      .eq('id', ids[workshopSlug])

    if (error) console.error('related update', workshopSlug, error)
    else console.log('Linked related for', workshopSlug, '→', relatedIds.length, 'workshops')
  }

  console.log('Done.')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
