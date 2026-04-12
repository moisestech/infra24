import { z } from 'zod'

/**
 * Marketing + future LMS fields stored in workshops.metadata (JSONB).
 * See docs/workshops/WORKSHOP_METADATA.md for slug rules.
 */

const ctaActionSchema = z.enum(['book', 'interest', 'external']).optional()

const ctaSchema = z.object({
  label: z.string(),
  href: z.string().optional(),
  action: ctaActionSchema,
})

const ctasSchema = z.object({
  primary: ctaSchema,
  secondary: ctaSchema.optional(),
  institutional: ctaSchema.optional(),
})

export const workshopMarketingMetadataSchema = z.object({
  slug: z.string().min(1),
  subtitle: z.string().optional(),
  shortDescription: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  galleryImageUrls: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  /** Smart-sign workshop grid schedule block (multi-line). */
  displaySchedule: z.string().optional(),
  /** Optional source catalog dates for display/sorting helpers. */
  sessionStartDate: z.string().optional(),
  sessionEndDate: z.string().optional(),
  /** Controlled labels for filters, e.g. individual_artists */
  audienceTags: z.array(z.string()).optional(),
  format: z.enum(['in_person', 'online', 'hybrid', 'async_resources']),
  materialsRequired: z.array(z.string()).optional(),
  materialsProvided: z.array(z.string()).optional(),
  agenda: z
    .array(
      z.object({
        title: z.string(),
        durationMinutes: z.number().optional(),
        summary: z.string().optional(),
      })
    )
    .optional(),
  instructors: z
    .array(
      z.object({
        name: z.string(),
        title: z.string().optional(),
        bio: z.string().optional(),
        imageUrl: z.string().optional(),
      })
    )
    .optional(),
  deliveryHistory: z
    .object({
      firstOfferedYear: z.number().optional(),
      runsCount: z.number().optional(),
      venues: z.array(z.string()).optional(),
    })
    .optional(),
  testimonials: z
    .array(
      z.object({
        quote: z.string(),
        attribution: z.string().optional(),
        role: z.string().optional(),
      })
    )
    .optional(),
  faq: z.array(z.object({ q: z.string(), a: z.string() })).optional(),
  ctas: ctasSchema.optional(),
  packetPdfUrl: z.string().optional(),
  relatedWorkshopIds: z.array(z.string().uuid()).optional(),
  whoFor: z.array(z.string()).optional(),
  whoNotFor: z.array(z.string()).optional(),
  lmsCourseId: z.string().optional(),
  modulesPreview: z
    .array(
      z.object({
        title: z.string(),
        lessonCount: z.number().optional(),
      })
    )
    .optional(),
  resourceLinks: z
    .array(
      z.object({
        label: z.string(),
        url: z.string(),
        type: z.enum(['worksheet', 'template', 'reading', 'replay']).optional(),
      })
    )
    .optional(),
  /** Roadmap track — filters and badges on org workshop pages */
  track: z
    .enum(['presence', 'ai_literacy', 'creative_coding', 'systems_archive'])
    .optional(),
  /** Lower = build first (1–24 roadmap); optional display / sorting */
  buildPriority: z.number().int().min(1).max(99).optional(),
  /** Batch imagegen / design brief; not shown on public page by default */
  placeholderImagePrompt: z.string().optional(),
  /** Long-form packet / LMS primer copy for the workshop page */
  packetConcept: z.string().optional(),
})

export type WorkshopMarketingMetadata = z.infer<typeof workshopMarketingMetadataSchema>

export type ParsedWorkshopMetadata =
  | { ok: true; data: WorkshopMarketingMetadata }
  | { ok: false; error: z.ZodError }

/**
 * Strict parse — use when inserting/updating from trusted scripts.
 */
export function parseWorkshopMarketingMetadata(
  raw: unknown
): ParsedWorkshopMetadata {
  const r = workshopMarketingMetadataSchema.safeParse(raw)
  if (!r.success) return { ok: false, error: r.error }
  return { ok: true, data: r.data }
}

/**
 * Lenient parse for API responses: fill defaults, keep partial marketing fields.
 */
export function mergeWorkshopMetadata(
  raw: Record<string, unknown> | null | undefined,
  fallback: { title: string; id: string }
): WorkshopMarketingMetadata {
  const base = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>
  const slug =
    typeof base.slug === 'string' && base.slug.length > 0
      ? base.slug
      : `workshop-${fallback.id.slice(0, 8)}`

  const defaults: WorkshopMarketingMetadata = {
    slug,
    format: 'in_person',
    ctas: {
      primary: { label: `Express interest: ${fallback.title}`, action: 'interest' },
      institutional: { label: 'Institutional inquiry', action: 'external' },
    },
  }

  const fmt = base.format
  const format: WorkshopMarketingMetadata['format'] =
    fmt === 'online' || fmt === 'hybrid' || fmt === 'async_resources' || fmt === 'in_person'
      ? fmt
      : defaults.format

  const merged: Record<string, unknown> = {
    ...defaults,
    ...base,
    slug,
    format,
    ctas: normalizeCtas(base.ctas, fallback.title),
  }

  const parsed = workshopMarketingMetadataSchema.safeParse(merged)
  if (parsed.success) return parsed.data
  return defaults
}

function normalizeCtas(
  raw: unknown,
  title: string
): WorkshopMarketingMetadata['ctas'] {
  if (!raw || typeof raw !== 'object') {
    return {
      primary: { label: 'Express interest', action: 'interest' },
      institutional: {
        label: 'Institutional inquiry',
        action: 'external',
      },
    }
  }
  const o = raw as Record<string, unknown>
  const primary = o.primary as Record<string, unknown> | undefined
  return {
    primary: {
      label: typeof primary?.label === 'string' ? primary.label : `Join: ${title}`,
      href: typeof primary?.href === 'string' ? primary.href : undefined,
      action:
        primary?.action === 'book' ||
        primary?.action === 'interest' ||
        primary?.action === 'external'
          ? primary.action
          : 'interest',
    },
    secondary:
      o.secondary && typeof o.secondary === 'object'
        ? {
            label: String((o.secondary as { label?: string }).label ?? ''),
            href: (o.secondary as { href?: string }).href,
          }
        : undefined,
    institutional:
      o.institutional && typeof o.institutional === 'object'
        ? {
            label: String(
              (o.institutional as { label?: string }).label ?? 'Institutional inquiry'
            ),
            href: (o.institutional as { href?: string }).href,
            action: 'external',
          }
        : {
            label: 'Institutional inquiry',
            action: 'external',
          },
  }
}
