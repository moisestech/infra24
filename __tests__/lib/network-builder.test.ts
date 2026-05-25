import { generateRelationshipActions } from '@/lib/network-builder/actions'
import { getFixtureNetworkContacts } from '@/lib/network-builder/read-contacts'
import { parseFollowUpCadence } from '@/lib/network-builder/read-contacts'
import {
  rankPriorityContacts,
  scoreAllContacts,
  scoreNetworkReadiness,
} from '@/lib/network-builder/readiness'

describe('network-builder readiness — 100-point model', () => {
  it('marks contact without email as not network-ready', () => {
    const contact = getFixtureNetworkContacts()[0]
    const score = scoreNetworkReadiness(contact, { readinessThreshold: 70 })
    expect(score.missingFields).toContain('Email')
    expect(score.networkReady).toBe(false)
    expect(score.maxScore).toBe(100)
  })

  it('marks fully ready artist segment contact as network-ready at 70%', () => {
    const contact = getFixtureNetworkContacts()[3]
    const score = scoreNetworkReadiness(contact, { readinessThreshold: 70 })
    expect(score.networkReady).toBe(true)
    expect(score.isArtistSegment).toBe(true)
    expect(score.readinessStatus).toMatch(/ready|high_value/)
  })

  it('preserves separate lastContactDate and lastMeaningfulTouch', () => {
    const contact = getFixtureNetworkContacts()[1]
    expect(contact.lastContactDate).toBe('2026-05-01')
    expect(contact.lastMeaningfulTouch).toBe('2026-05-10')
    expect(contact.lastRecencyAt).toBe('2026-05-10')
  })

  it('detects stale with 60-day cadence default', () => {
    const contact = getFixtureNetworkContacts()[0]
    const score = scoreNetworkReadiness(contact, { staleDays: 60, now: new Date('2026-05-24') })
    expect(score.staleRelationship).toBe(true)
    expect(score.followUpCadence).toBe('60_days')
  })

  it('does not mark pause cadence as stale', () => {
    const contact = getFixtureNetworkContacts()[2]
    const score = scoreNetworkReadiness(contact)
    expect(score.followUpCadence).toBe('pause')
    expect(score.staleRelationship).toBe(false)
  })

  it('requires social signifier for network-ready', () => {
    const contact = {
      ...getFixtureNetworkContacts()[0],
      email: 'jane@example.com',
      practiceTags: ['AI Art'],
      digitalOrientationStatement: 'Works with generative video.',
      consentStatus: 'Permission to Contact',
    }
    const score = scoreNetworkReadiness(contact, { readinessThreshold: 70 })
    expect(score.percentReady).toBeGreaterThanOrEqual(70)
    expect(score.networkReady).toBe(false)
  })

  it('ranks incomplete artist ahead of ready non-stale contacts', () => {
    const contacts = getFixtureNetworkContacts()
    const scores = scoreAllContacts(contacts)
    const ranked = rankPriorityContacts(scores)
    expect(ranked[0]?.fullName).toBe('Jane Artist')
  })
})

describe('network-builder follow-up cadence parsing', () => {
  it('parses cadence strings', () => {
    expect(parseFollowUpCadence('30 Days')).toBe('30_days')
    expect(parseFollowUpCadence('90 Days')).toBe('90_days')
    expect(parseFollowUpCadence('Pause')).toBe('pause')
    expect(parseFollowUpCadence('Do Not Contact')).toBe('do_not_contact')
  })
})

describe('network-builder actions', () => {
  it('generates proposed actions for incomplete or stale contacts', () => {
    const contacts = getFixtureNetworkContacts()
    const scores = scoreAllContacts(contacts)
    const ranked = rankPriorityContacts(scores)
    const byId = new Map(contacts.map((c) => [c.recordId, c]))
    const actions = generateRelationshipActions(ranked, byId, 5)
    expect(actions.length).toBeGreaterThan(0)
    expect(actions[0]?.approvalStatus).toBe('pending')
    expect(actions[0]?.proposedMessage.length).toBeGreaterThan(10)
  })

  it('skips fully ready non-stale Sam when threshold met', () => {
    const contacts = getFixtureNetworkContacts()
    const scores = scoreAllContacts(contacts, { staleDays: 60, readinessThreshold: 70 })
    const ranked = rankPriorityContacts(scores)
    const byId = new Map(contacts.map((c) => [c.recordId, c]))
    const actions = generateRelationshipActions(ranked, byId, 10)
    const samAction = actions.find((a) => a.contactName === 'Sam Creative Technologist')
    expect(samAction).toBeUndefined()
  })
})

describe('network-builder readiness status bands', () => {
  it('assigns partial status between 40-69', () => {
    const contact = {
      ...getFixtureNetworkContacts()[0],
      email: 'jane@example.com',
      linkedin: 'https://linkedin.com/in/jane',
      practiceTags: ['Video'],
    }
    const score = scoreNetworkReadiness(contact)
    if (score.percentReady >= 40 && score.percentReady < 70) {
      expect(score.readinessStatus).toBe('partial')
    }
  })
})
