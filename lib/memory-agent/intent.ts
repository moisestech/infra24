import type { MemoryIntent } from '@/lib/memory-agent/knowledge-record'

const PEOPLE_RE =
  /\b(alumni|alumnus|alumna|artist|artists|photographer|photographers|filmmaker|filmmakers|who\s+(are|is|was)|which\s+alumni|people\s+in|members?\s+who|creator|creators|residency|cohort|discipline|medium|residents?|studio\s+residents?)\b/i

const STUDIO_LOOKUP_RE =
  /\b(where\s+is|find\s+.*studio|studio\s+(number|location)|which\s+studio)\b/i

const PROGRAMMING_RE =
  /\b(happening|this\s+week|tonight|today|tomorrow|upcoming|coming\s+up|latest|exhibition|exhibitions|workshop|workshops|class|classes|event|events|programming|program|screening|screenings|carousel|smart\s*sign|signage|visitors?\s+see|put\s+on\s+the\s+sign|what'?s\s+on|schedule|calendar|rsvp|opening|showing|film\s+festival|cinematic|member\s+route|routes?|new\s+member|bookable|house\s+tonight|members?\s+experience|rooftop|wellness|cecconi|cowshed|ocho)\b/i

export const RECOGNITION_RE =
  /\b(florida\s+prize|orlando\s+museum|recognition|recognitions|consortium|ellies|awards?|fellowship|invited\s+artists?|participating\s+alumni|how\s+many\s+.*practices|how\s+many\s+.*participants|participating\s+practices|named\s+individuals|institutional\s+memory)\b/i

export const BOOKABLE_QUESTION_RE =
  /\b(bookable|book\s+now|what\s+can\s+i\s+book|join\s+waitlist|register\s+now|what\s+is\s+bookable)\b/i

const TIME_BOUND_RE =
  /\b(this\s+week|tonight|today|tomorrow|this\s+weekend|next\s+week|right\s+now|currently\s+(on|at|running))\b/i

const UPCOMING_RE = /\b(coming\s+up|upcoming|future|next\s+month|later\s+this)\b/i

const LATEST_RE = /\b(latest|most\s+recent|newest|just\s+opened|recent\s+exhibition)\b/i

const RECOMMEND_RE =
  /\b(recommend|suggest|should\s+(i|we|visitors)|what\s+should|best\s+for|good\s+for|experience\s+this\s+week)\b/i

const MIXED_RE =
  /\b(connected\s+to|related\s+to|who\s+(is|are)\s+(in|at|for)|artists?\s+(in|at|for)\s+(the|this)|exhibition\s+and|for\s+this\s+exhibition|from\s+oolite\s+(is|are|in))\b/i

/**
 * Lightweight intent routing (keyword-first). Sprint 2 may add LLM fallback.
 */
export function detectMemoryIntent(question: string): MemoryIntent {
  const q = question.trim()
  if (!q) return 'data_gap'

  const people = PEOPLE_RE.test(q) || STUDIO_LOOKUP_RE.test(q)
  const programming = PROGRAMMING_RE.test(q)
  const recognition = RECOGNITION_RE.test(q)
  const mixed =
    MIXED_RE.test(q) ||
    (people && programming) ||
    (people && recognition) ||
    (programming && recognition)

  if (mixed) return 'mixed'
  if (TIME_BOUND_RE.test(q)) return 'time_bound'
  if (UPCOMING_RE.test(q)) return 'upcoming'
  if (LATEST_RE.test(q)) return 'latest'
  if (RECOMMEND_RE.test(q)) return 'recommendation'
  if (recognition && !people && !programming) return 'recognition'
  if (programming && !people && !recognition) return 'programming'
  if (people && !programming && !recognition) return 'people'

  return 'people'
}

export function intentNeedsPeople(intent: MemoryIntent): boolean {
  return intent === 'people' || intent === 'mixed' || intent === 'recognition'
}

export function intentNeedsProgramming(intent: MemoryIntent): boolean {
  return (
    intent === 'programming' ||
    intent === 'mixed' ||
    intent === 'time_bound' ||
    intent === 'upcoming' ||
    intent === 'latest' ||
    intent === 'recommendation'
  )
}

export function intentNeedsRecognition(intent: MemoryIntent): boolean {
  return intent === 'recognition' || intent === 'mixed'
}

export function isStudioLookupQuestion(question: string): boolean {
  return STUDIO_LOOKUP_RE.test(question.trim())
}

export function isActiveResidentsQuestion(question: string): boolean {
  return /\b(2026\s+studio\s+residents?|current\s+residents?|active\s+residents?|studio\s+residents?)\b/i.test(
    question.trim()
  )
}
