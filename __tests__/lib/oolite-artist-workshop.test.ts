import { mapCrmPeopleRow } from '@/lib/memory-agent/airtable-crm-people'
import { mapAirtableProgrammingRow } from '@/lib/memory-agent/airtable-programming'
import { seedPersonToAirtableFields } from '@/lib/oolite/people-seed'
import { seedRecordToAirtableFields } from '@/lib/oolite/programming-seed'
import { buildEventCardFields } from '@/lib/memory-agent/event-card-urls'

describe('Bex McCharen CRM People mapping', () => {
  it('maps bio, website, pronouns, and portfolio images', () => {
    const row = mapCrmPeopleRow(
      {
        id: 'recBex123',
        fields: {
          'Full Name': 'Bex McCharen',
          Bio: 'Interdisciplinary artist based in Miami.',
          Website: 'https://bexwater.com/',
          Pronouns: 'they/them',
          'Image / Portrait URL': 'https://example.com/portrait.jpg',
          'Portfolio Image URLs': 'https://example.com/a.jpg\nhttps://example.com/b.jpg',
          'Practice Tags': ['Social Practice', 'Photography'],
          'Public AI Approved': true,
        },
      },
      {
        name: 'Full Name',
        titleRole: 'Title / Role',
        department: 'Department',
        institution: 'Institution',
        city: 'City',
        bio: 'Bio',
        website: 'Website',
        pronouns: 'Pronouns',
        primaryImageUrl: 'Image / Portrait URL',
        portfolioImageUrls: 'Portfolio Image URLs',
        practiceTags: 'Practice Tags',
        publicAiApproved: 'Public AI Approved',
        doNotUseInAi: 'Do Not Use In AI',
      }
    )

    expect(row?.name).toBe('Bex McCharen')
    expect(row?.publicBio).toContain('Interdisciplinary artist')
    expect(row?.website).toBe('https://bexwater.com/')
    expect(row?.pronoun).toBe('they/them')
    expect(row?.additionalImageUrls).toEqual([
      'https://example.com/a.jpg',
      'https://example.com/b.jpg',
    ])
    expect(row?.approvedForPublicAi).toBe(true)
  })
})

describe('workshop programming mapping', () => {
  it('maps instructor, schedule, cost, and register CTA', () => {
    const record = mapAirtableProgrammingRow(
      {
        id: 'recWorkshop1',
        fields: {
          Title: 'The Fabric of Remembering: Cyanotype & Quilting',
          'Record Type': 'workshop',
          Status: 'coming_soon',
          Visibility: 'public',
          'Start Date': '2026-07-14',
          'End Date': '2026-07-28',
          Instructor: 'Bex McCharen',
          'Time Text': 'Tuesdays, 6–9 p.m.',
          'Duration Text': '3-week workshop',
          'Cost Text': '$165, materials included',
          Capacity: 8,
          Bookable: true,
          'RSVP URL': 'https://oolitearts.org/event/the-fabric-of-remembering-cyanotype-and-digital-photo-quilting/',
          'Public AI Approved': true,
        },
      },
      'oolite'
    )

    expect(record?.recordKind).toBe('workshop')
    expect(record?.instructor).toBe('Bex McCharen')
    expect(record?.costText).toBe('$165, materials included')
    expect(record?.bookingCta).toEqual({
      label: 'Register',
      url: 'https://oolitearts.org/event/the-fabric-of-remembering-cyanotype-and-digital-photo-quilting/',
      grounded: true,
    })

    const card = buildEventCardFields(record!, 'public', 'oolite')
    expect(card.instructor).toBe('Bex McCharen')
    expect(card.ctaLabel).toBe('Register')
    expect(card.bookable).toBe(true)
  })
})

describe('seed mappers', () => {
  it('maps Bex people seed row to Airtable fields', () => {
    const fields = seedPersonToAirtableFields(
      {
        fullName: 'Bex McCharen',
        website: 'https://bexwater.com/',
        pronouns: 'they/them',
        publicAiApproved: true,
      },
      'recRiKB2W96uzTfY0'
    )
    expect(fields['Full Name']).toBe('Bex McCharen')
    expect(fields.Institution).toEqual(['recRiKB2W96uzTfY0'])
  })

  it('maps workshop seed row to Airtable fields', () => {
    const fields = seedRecordToAirtableFields(
      {
        title: 'The Fabric of Remembering: Cyanotype & Quilting',
        recordType: 'workshop',
        instructor: 'Bex McCharen',
        costText: '$165, materials included',
        bookable: true,
      },
      'recRiKB2W96uzTfY0'
    )
    expect(fields.Instructor).toBe('Bex McCharen')
    expect(fields['Cost Text']).toBe('$165, materials included')
  })
})
