import {
  buildRecognitionContextBlock,
  expectedFloridaPrize2026Counts,
  getParticipationForRecognition,
  rankRecognitionsForQuestion,
  summarizeRecognitionCounts,
  type ArtistParticipation,
  type RecognitionEvent,
} from '@/lib/oolite/airtable-recognitions'
import {
  detectMemoryIntent,
  intentNeedsRecognition,
  RECOGNITION_RE,
} from '@/lib/memory-agent/intent'
import { FLORIDA_PRIZE_2026_EVENT_RECORD_ID } from '@/lib/oolite/airtable-recognitions-config'

const floridaEvent: RecognitionEvent = {
  id: FLORIDA_PRIZE_2026_EVENT_RECORD_ID,
  name: '2026 Florida Prize in Contemporary Art',
  type: 'Exhibition',
  institution: 'Orlando Museum of Art',
  year: 2026,
  publicSummary:
    'Six Oolite Arts alumni practices were invited to participate in the Orlando Museum of Art’s 2026 Florida Prize in Contemporary Art.',
  publiclyApproved: false,
  doNotUseInAi: false,
  approvalStatus: 'pending',
}

const floridaParticipations: ArtistParticipation[] = [
  {
    id: 'p1',
    label: 'Maria Theresa Barbist',
    artistId: 'a1',
    artistDisplayName: 'Maria Theresa Barbist',
    recognitionId: FLORIDA_PRIZE_2026_EVENT_RECORD_ID,
    participationType: 'Invited Artist',
    countAsPractice: 1,
    individualArtistCount: 1,
    publiclyApproved: false,
    doNotUseInAi: false,
    approvalStatus: 'pending',
  },
  {
    id: 'p2',
    label: 'Rose Marie Cromwell',
    artistId: 'a2',
    artistDisplayName: 'Rose Marie Cromwell',
    recognitionId: FLORIDA_PRIZE_2026_EVENT_RECORD_ID,
    participationType: 'Invited Artist',
    countAsPractice: 1,
    individualArtistCount: 1,
    publiclyApproved: false,
    doNotUseInAi: false,
    approvalStatus: 'pending',
  },
  {
    id: 'p3',
    label: 'Francisco Masó',
    artistId: 'a3',
    artistDisplayName: 'Francisco Masó',
    recognitionId: FLORIDA_PRIZE_2026_EVENT_RECORD_ID,
    participationType: 'Invited Artist',
    countAsPractice: 1,
    individualArtistCount: 1,
    publiclyApproved: false,
    doNotUseInAi: false,
    approvalStatus: 'pending',
  },
  {
    id: 'p4',
    label: 'Charo Oquet',
    artistId: 'a4',
    artistDisplayName: 'Charo Oquet',
    recognitionId: FLORIDA_PRIZE_2026_EVENT_RECORD_ID,
    participationType: 'Invited Artist',
    countAsPractice: 1,
    individualArtistCount: 1,
    publiclyApproved: false,
    doNotUseInAi: false,
    approvalStatus: 'pending',
  },
  {
    id: 'p5',
    label: 'Ema Ri',
    artistId: 'a5',
    artistDisplayName: 'Ema Ri',
    recognitionId: FLORIDA_PRIZE_2026_EVENT_RECORD_ID,
    participationType: 'Invited Artist',
    countAsPractice: 1,
    individualArtistCount: 1,
    publiclyApproved: false,
    doNotUseInAi: false,
    approvalStatus: 'pending',
  },
  {
    id: 'p6',
    label: "Nice'n Easy",
    artistId: 'a6',
    artistDisplayName: "Nice'n Easy",
    recognitionId: FLORIDA_PRIZE_2026_EVENT_RECORD_ID,
    participationType: 'Invited Artist Collective',
    countAsPractice: 1,
    individualArtistCount: 2,
    publiclyApproved: false,
    doNotUseInAi: false,
    approvalStatus: 'pending',
  },
]

describe('recognition intent routing', () => {
  it('detects Florida Prize as recognition or mixed', () => {
    expect(RECOGNITION_RE.test('Who from Oolite is in the Florida Prize?')).toBe(true)
    expect(detectMemoryIntent('Who from Oolite is in the Florida Prize?')).toBe('mixed')
    expect(detectMemoryIntent('How many Oolite practices are in the Florida Prize?')).toBe(
      'recognition'
    )
    expect(intentNeedsRecognition('recognition')).toBe(true)
  })

  it('detects mixed when people and recognition overlap', () => {
    expect(detectMemoryIntent('Which alumni artists are in the Florida Prize exhibition?')).toBe(
      'mixed'
    )
  })

  it('keeps programming hero question on programming/time_bound', () => {
    expect(detectMemoryIntent('What should visitors see this week?')).toBe('time_bound')
  })
})

describe('summarizeRecognitionCounts', () => {
  it('returns 6 practices and 7 individuals for Florida Prize seed shape', () => {
    const summary = summarizeRecognitionCounts(
      floridaParticipations,
      FLORIDA_PRIZE_2026_EVENT_RECORD_ID
    )
    expect(summary.practiceCount).toBe(6)
    expect(summary.individualArtistCount).toBe(7)
    expect(summary.participants).toHaveLength(6)
    expect(expectedFloridaPrize2026Counts().practiceCount).toBe(6)
    expect(expectedFloridaPrize2026Counts().individualArtistCount).toBe(7)
  })

  it('prefers Airtable aggregate counts on the event record', () => {
    const summary = summarizeRecognitionCounts(
      floridaParticipations,
      FLORIDA_PRIZE_2026_EVENT_RECORD_ID,
      {
        participatingPracticesCount: 6,
        namedIndividualsCount: 7,
      }
    )
    expect(summary.practiceCount).toBe(6)
    expect(summary.individualArtistCount).toBe(7)
  })
})

describe('rankRecognitionsForQuestion', () => {
  it('ranks Florida Prize event for Florida Prize question', () => {
    const ranked = rankRecognitionsForQuestion(
      'How many Oolite practices are in the Florida Prize?',
      [floridaEvent]
    )
    expect(ranked[0]?.id).toBe(FLORIDA_PRIZE_2026_EVENT_RECORD_ID)
  })
})

describe('buildRecognitionContextBlock', () => {
  it('includes practice and individual counts in staff mode', () => {
    const block = buildRecognitionContextBlock({
      events: [floridaEvent],
      participations: floridaParticipations,
      mode: 'staff_operator',
    })
    expect(block).toContain('Participating practices count: 6')
    expect(block).toContain('Named individuals count: 7')
    expect(block).toContain('Pending review')
    expect(block).toContain('Orlando Museum of Art')
  })
})
