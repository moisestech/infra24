import type { PilotScope } from './types'

export const DEFAULT_PILOT_SCOPE: PilotScope = {
  title: 'Phase 3 Cultural Intelligence Concierge Pilot',
  bullets: [
    '3 prospect environments with distinct vertical skins',
    '8+ data categories surfaced with readiness framing',
    'Knowledge graph + map + timeline canvases (mock)',
    'Natural-language scenarios with triple outputs',
    'Role-based modes: Public, Staff, Leadership',
    'Signage preview + QR handoff concept',
    'Mobile concierge shell with primary flows',
  ],
  timeline: 'Weeks 1–2: config + mock UX lock · Weeks 3–4: data connectors · Weeks 5–6: pilot instrumentation',
  dataNeeded: [
    'Structured events + spaces export (CSV or API)',
    'Partner roster with permissions & imagery rights',
    'Staff approval workflow owner (role + inbox)',
    'Signage CMS or screen vendor webhook (optional)',
  ],
  delivered: [
    'Sales-ready Ask the Place command center',
    'Scenario engine (deterministic, swappable for AI/RAG)',
    'Output bundle schema aligned to pilot reporting',
  ],
}
