import type { SohoFunnelMockupKey } from '@/lib/sohohouse/pitch-constants'

export type SohoFunnelMockupPromptSet = {
  /** Where this frame appears on /soho-house-ai-assistant */
  section: string
  /** Aspect ratio target for generation */
  aspect: string
  /** Overall creative direction shared across light + dark */
  vibe: string
  /** What must read clearly at phone/card size */
  mustShow: string[]
  /** Generation prompt — light theme (warm editorial, cream surfaces) */
  promptLight: string
  /** Generation prompt — dark theme (lounge, low light, brass accents) */
  promptDark: string
  /** Filename stem; app loads `{stem}-light.webp` and `{stem}-dark.webp` */
  fileStem: string
}

/**
 * Image generation briefs for Soho funnel mockups.
 * Drop finished assets in public/assets/sohohouse/mockups/ using the fileStem pattern.
 */
export const SOHO_FUNNEL_MOCKUP_PROMPTS: Record<SohoFunnelMockupKey, SohoFunnelMockupPromptSet> =
  {
    hero: {
      section: 'Overview (hero, right column)',
      aspect: '9:19 phone portrait · ~880×1860px',
      vibe:
        'Intimate House member moment — voice-first AI concierge, not a generic chatbot. Feels like holding a phone in a lounge, not a SaaS screenshot.',
      mustShow: [
        'Member Signal Agent UI on phone',
        'Suggested question chip or voice orb',
        'Warm Soho palette (cream or dark lounge)',
        'No real Soho House logos or trademarks',
      ],
      promptLight:
        'Editorial product mockup, iPhone-style device floating on warm cream background (#f7f3ed), soft natural window light. Screen shows a refined member concierge app: serif headline "What should members experience this week?", subtle voice waveform, 2–3 experience cards (screening, wellness, dining). UI palette: ivory, warm taupe (#6b5344), soft gold accents. Shallow depth of field, boutique hotel lobby bokeh in background. Premium, calm, Soho House–adjacent aesthetic without logos. Photorealistic device render, not flat illustration.',
      promptDark:
        'Cinematic phone mockup in dim Soho-style lounge at night. Device glow on dark walnut and leather (#0c0a09 background). Screen: Member Signal Agent with cream-on-charcoal UI, glowing voice orb, elegant card stack. Warm amber practical lights, film grain, intimate members-club atmosphere. No logos. High-end editorial tech photography.',
      fileStem: 'hero-member-signal',
    },
    interaction: {
      section: 'Member interaction (wide card beside question flow)',
      aspect: '16:10 landscape · ~1600×1000px',
      vibe:
        'One question → four outputs. Shows the agent loop as a polished dashboard/card spread, not a wireframe.',
      mustShow: [
        'Member route or itinerary strip',
        'Bookable experience cards',
        'Smart sign copy preview',
        'Mobile handoff indicator',
      ],
      promptLight:
        'Wide UI composition on warm off-white canvas. Four connected panels: (1) member route timeline, (2) bookable experiences grid with dates, (3) smart sign copy block for lobby screen, (4) QR mobile handoff tile. Soft shadows, rounded corners, serif section labels, taupe and champagne accents. Feels like an internal member-relations tool made beautiful — editorial layout, generous whitespace, no clutter. Light mode only surfaces, subtle grid lines.',
      promptDark:
        'Same four-panel member experience loop UI on dark charcoal surface (#141110). Panels separated by hairline gold borders. Glowing accent on active "Member route" step. Cards show film screening, pool club, house kitchen — grounded programming labels. Moody lounge lighting reflection on glass table beneath the UI. Premium dark-mode product design, not neon cyberpunk.',
      fileStem: 'experience-cards',
    },
    smartSign: {
      section: 'Smart sign moment (full-width hero image)',
      aspect: '16:10 landscape · ~1920×1200px',
      vibe:
        'The lobby moment — approved programming on a physical screen with QR. Bridges digital agent and physical House space.',
      mustShow: [
        'Large display or digital sign in architectural lobby',
        'This week programming headline',
        'QR code corner (subtle, not dominant)',
        'Members-club interior (abstracted)',
      ],
      promptLight:
        'Architectural interior photograph, upscale members club lobby with limestone, plants, mid-century furniture. Wall-mounted digital sign displays elegant programming: "This week at the House" with 3 events, minimal typography, cream and black. Small QR in corner labeled "Member route". Daylight, airy, Mediterranean-meets-London club. No brand logos. Sign content legible. Wide cinematic framing.',
      promptDark:
        'Evening lobby scene, low amber lighting, terrazzo floor, velvet seating. Freestanding or wall digital sign glowing softly — dark UI with cream type listing screenings and dining. QR code discreet. Atmosphere: exclusive house at dusk, cinematic, shallow depth. Sign is hero focal point. No Soho trademarks.',
      fileStem: 'smart-sign-lobby',
    },
    mobileHandoff: {
      section: 'Try demo (phone beside CTA)',
      aspect: '9:19 phone portrait · ~880×1860px',
      vibe:
        'After scanning QR — member holds phone with curated weekly journey. Continuation of hero phone but shows results/state.',
      mustShow: [
        'Post-scan mobile journey / itinerary',
        'Bookable items with times',
        'Beach House or House programming labels (generic)',
        'Clear "member-facing" public mode',
      ],
      promptLight:
        'Close-up hands holding phone in sunlit terrace setting (blurred palm and ocean hint). Screen shows curated member itinerary: "Your week" with stacked cards — rooftop screening, wellness session, members dinner. Light UI, serif titles, warm sand and cream color story. Feels like Soho Beach House energy without naming it. Optimistic, leisure, premium travel editorial.',
      promptDark:
        'Phone held in dark lounge booth, screen illuminating face slightly. Mobile UI: approved member route with 4 stops, book buttons, subtle map strip. Dark mode app chrome, champagne highlights. Background: blurred bottles, candlelight. Intimate, evening plans, members-only tone.',
      fileStem: 'mobile-handoff',
    },
    staffGovernance: {
      section: 'Working proof (staff governance panel)',
      aspect: '4:3 screen · ~1200×900px',
      vibe:
        'Staff approves before anything goes live. Governance UI — draft vs approved, internal brief visible, not consumer-flashy.',
      mustShow: [
        'Staff review panel or admin surface',
        'Approve / draft states',
        'Staff brief vs public output split',
        'Trustworthy, operational (not scary enterprise)',
      ],
      promptLight:
        'Desktop or tablet UI mockup on warm desk surface (marble, notebook, espresso). Staff governance dashboard: left column "Draft outputs", center "Public handoff preview", right "Approve for QR" primary action. Tags: Staff brief, Leadership insight, Smart sign copy. Calm operational design, taupe buttons, clear status pills (Draft / Ready). Editorial serif headings. Feels like a creative ops tool for member relations.',
      promptDark:
        'Dark-mode staff console on laptop in dim back-office nook. Split view: internal staff brief (longer text) vs approved public card (shorter). Prominent "Approve public handoff" button in warm gold. Audit trail snippet, source record links. Serious but elegant — members club back of house, not generic admin panel. Screen glow on dark wood desk.',
      fileStem: 'staff-approval',
    },
  }
