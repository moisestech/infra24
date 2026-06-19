import { applyCapitalCampaignResponse } from '@/lib/memory-agent/apply-capital-campaign-response'
import { applyDigitalLabBookingResponse } from '@/lib/memory-agent/apply-digital-lab-booking-response'
import { applyOpenCallsResponse } from '@/lib/memory-agent/apply-open-calls-response'
import { applyShowcaseArtistResponse } from '@/lib/memory-agent/apply-showcase-artist-response'
import { applyShowcaseExhibitionResponse } from '@/lib/memory-agent/apply-showcase-exhibition-response'
import { applyShowcaseProgramResponse } from '@/lib/memory-agent/apply-showcase-program-response'
import {
  mergeOoliteMemoryAgentSuggestedQuestions,
  ooliteInstitutionalMemorySuggestedQuestions,
} from '@/lib/oolite/oolite-institutional-memory-chips'
import { CAPITAL_CAMPAIGN_SHOWCASE } from '@/lib/oolite/capital-campaign-showcase'
import { DIGITAL_LAB_QGIV_HUB_URL } from '@/lib/orgs/oolite/digital-lab-qgiv-offerings'
import {
  OOLITE_ELLIES_OPEN_CALLS_URL,
  OOLITE_OPEN_CALLS_WINDOW,
} from '@/lib/oolite/open-calls-showcase'
import { FROM_WITHIN_EXHIBITION } from '@/lib/oolite/showcase-exhibitions'
import type { MemoryAgentAskResult } from '@/types/memory-agent'

const EMPTY_RESULT: MemoryAgentAskResult = {
  answer: 'placeholder',
  artists: [],
  followUps: [],
  dataGaps: ['should clear'],
}

function applyOoliteShowcaseChain(question: string): MemoryAgentAskResult {
  return applyOpenCallsResponse({
    orgSlug: 'oolite',
    question,
    result: applyCapitalCampaignResponse({
      orgSlug: 'oolite',
      question,
      result: applyDigitalLabBookingResponse({
        orgSlug: 'oolite',
        question,
        result: applyShowcaseExhibitionResponse({
          orgSlug: 'oolite',
          question,
          result: applyShowcaseProgramResponse({
            orgSlug: 'oolite',
            question,
            result: applyShowcaseArtistResponse({
              orgSlug: 'oolite',
              question,
              result: { ...EMPTY_RESULT },
              contextRows: [],
              publicProfiles: [],
            }),
          }),
        }),
      }),
    }),
  })
}

describe('ooliteInstitutionalMemorySuggestedQuestions', () => {
  it('includes promotion, exhibition, and program chips', () => {
    const chips = ooliteInstitutionalMemorySuggestedQuestions()
    expect(chips).toContain('What are the 2027 open calls?')
    expect(chips).toContain('How do I apply for the Cinematic Residency?')
    expect(chips).toContain('How do I book Digital Lab workshops or consulting?')
    expect(chips).toContain("Tell me about Oolite's new campus in Little River.")
    expect(chips).toContain('Tell me about the From Within exhibition.')
    expect(chips).toContain('Tell me about the Youth Artist Residency.')
  })
})

describe('mergeOoliteMemoryAgentSuggestedQuestions', () => {
  it('preserves Airtable catalog chips and appends missing promotion chips', () => {
    const merged = mergeOoliteMemoryAgentSuggestedQuestions([
      'What should visitors see at Oolite this week?',
      'Tell me about Mark Delmont.',
    ])

    expect(merged[0]).toBe('What should visitors see at Oolite this week?')
    expect(merged).toContain('What are the 2027 open calls?')
    expect(merged).toContain('Tell me about Leo Castaneda.')
    expect(merged.filter((q) => q === 'What are the 2027 open calls?')).toHaveLength(1)
  })
})

describe('Oolite institutional memory chip responses', () => {
  it.each([
    {
      question: 'What are the 2027 open calls?',
      assert: (r: MemoryAgentAskResult) => {
        expect(r.answer).toContain(OOLITE_ELLIES_OPEN_CALLS_URL)
        expect(r.answer).toContain(OOLITE_OPEN_CALLS_WINDOW.display)
        expect(r.dataGaps).toEqual([])
      },
    },
    {
      question: 'How do I apply for the Cinematic Residency?',
      assert: (r: MemoryAgentAskResult) => {
        expect(r.answer).toContain('356110')
        expect(r.dataGaps).toEqual([])
      },
    },
    {
      question: 'How do I book Digital Lab workshops or consulting?',
      assert: (r: MemoryAgentAskResult) => {
        expect(r.answer).toContain(DIGITAL_LAB_QGIV_HUB_URL)
        expect(r.dataGaps).toEqual([])
      },
    },
    {
      question: "Tell me about Oolite's new campus in Little River.",
      assert: (r: MemoryAgentAskResult) => {
        expect(r.answer).toContain(CAPITAL_CAMPAIGN_SHOWCASE.campaignUrl)
        expect(r.dataGaps).toEqual([])
      },
    },
    {
      question: 'Who designed the new Oolite Arts campus?',
      assert: (r: MemoryAgentAskResult) => {
        expect(r.spokenAnswer ?? r.answer).toMatch(/Barozzi/i)
        expect(r.dataGaps).toEqual([])
      },
    },
    {
      question: 'Tell me about the From Within exhibition.',
      assert: (r: MemoryAgentAskResult) => {
        expect(r.answer).toContain(FROM_WITHIN_EXHIBITION.title)
        expect(r.answer).toContain('July 8')
        expect(r.dataGaps).toEqual([])
      },
    },
    {
      question: 'Tell me about the Youth Artist Residency.',
      assert: (r: MemoryAgentAskResult) => {
        expect(r.answer).toMatch(/Youth Artist/i)
        expect(r.dataGaps).toEqual([])
      },
    },
    {
      question: 'Tell me about Leo Castaneda.',
      assert: (r: MemoryAgentAskResult) => {
        expect(r.spokenAnswer ?? r.answer).toMatch(/Leo Castaneda/i)
        expect(r.dataGaps).toEqual([])
      },
    },
  ])('returns grounded showcase answer for: $question', ({ question, assert }) => {
    assert(applyOoliteShowcaseChain(question))
  })
})
