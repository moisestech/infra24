/**
 * Import full 2026 resident cohort + exhibition staff graph for Sites of the Self.
 *
 * Usage:
 *   npm run import:oolite-2026-cohort
 */
import dotenv from 'dotenv'

import {
  createAirtableRecords,
  fetchAllRecords,
  patchAirtableRecord,
} from '../lib/airtable/client'
import { getOoliteCrmPeopleConnection } from '../lib/airtable/oolite-crm-people-config'
import { getProgrammingConnectionForOrg } from '../lib/airtable/programming-config'
import {
  defaultResidentBio,
  OOLITE_2026_STUDIO_RESIDENTS,
} from '../lib/oolite/2026-resident-cohort'
import { OOLITE_PROGRAMMING_RECORD_IDS, OOLITE_PEOPLE_RECORD_IDS } from '../lib/oolite/knowledge-cluster-ids'
import { indexPeopleRowsByName } from '../lib/oolite/people-field-map'
import { seedPersonToAirtableFields, type OolitePeopleSeedRecord } from '../lib/oolite/people-seed'

dotenv.config({ path: '.env.local' })

const ENRICHED_RESIDENT_BIOS: Record<string, Partial<OolitePeopleSeedRecord>> = {
  'Diego Gabaldon': {
    titleRole: 'Studio Artist',
    instagram: '@threatappraisal',
    bio: 'Diego Gabaldon is a 2026 Oolite Arts Studio Resident in Studio 102. His work explores identity, memory, and material presence through installation and lens-based practice. He is included in Sites of the Self at Oolite Arts.',
  },
  'Shayla Marshall': {
    titleRole: 'Mixed-Media Artist',
    bio: 'Shayla Marshall (b. 1999, Miami) is a mixed-media artist based between Miami and London. Her work uses world-building and storytelling to imagine Black histories and futures. She is a 2026 Oolite Arts Studio Resident in Studio 209 and is included in Sites of the Self.',
    portfolioImageUrls: [
      'https://res.cloudinary.com/dkod1at3i/image/upload/v1780452174/shayla-marshall-Da_Crib_Installation_Shayla_Marshall-1-1030x687_rno1ak.jpg',
      'https://res.cloudinary.com/dkod1at3i/image/upload/v1780452177/shayla-marshall-The_First_Lady_Hair_Scuplture_Shayla_Marshall-773x1030_kgsoeb.webp',
    ],
  },
  'Pangea Kali Virga': {
    titleRole: 'Textile & Installation Artist',
    bio: 'Pangea Kali Virga is a 2026 Oolite Arts Studio Resident in Studio 203. Working across textile, installation, and social practice, Virga explores identity, community, and material storytelling. Included in Sites of the Self at Oolite Arts.',
  },
  'Genesis Moreno': {
    titleRole: 'Studio Artist',
    bio: 'Genesis Moreno is a 2026 Oolite Arts Studio Resident in Studio 210. Their practice examines selfhood, embodiment, and cultural memory through installation and image-making. Included in Sites of the Self at Oolite Arts.',
  },
  'Nadia Wolff': {
    titleRole: 'Studio Artist',
    bio: 'Nadia Wolff is a 2026 Oolite Arts Studio Resident in Studio 110. Their work engages identity, narrative, and research-driven studio practice. Included in Sites of the Self at Oolite Arts.',
  },
  'Ricardo E. Zulueta': {
    titleRole: '2026 Oolite Arts Resident Artist',
    website: 'https://www.ricardo-zulueta.com/',
    instagram: '@re_zulueta',
    bio: `Ricardo E. Zulueta is an interdisciplinary artist and scholar born in Havana, Cuba and based in Miami. Zulueta holds a Ph.D. in Cinema and Media Studies and an MFA in Visual Art from the University of Miami. His practice spans video, digital imaging, photography, software, mixed-media, painting, sculpture, performance, and installation, exploring identity, technology, and queer storytelling. Recipient of Oolite Arts' Ellies Creator Award; 2026 Studio Resident in Studio 109. Included in Sites of the Self at Oolite Arts.`,
    portfolioImageUrls: [
      'https://res.cloudinary.com/dkod1at3i/image/upload/v1780862292/ricardo-zulueta-8_Cyberscape_Diptych_No.3_2024__40_x_60_archival_pigment_print-705x513_nczdw7.jpg',
      'https://res.cloudinary.com/dkod1at3i/image/upload/v1780862291/ricardo-zulueta-7_Cyberscape_Diptych_No.1_2024__40_x_60_archival_pigment_print-705x514_slvdpm.jpg',
      'https://res.cloudinary.com/dkod1at3i/image/upload/v1780862289/ricardo-zulueta-6_Cyberscape_Diptych_No.2_2024__40_x_60_archival_pigment_print-705x513_sy9uuk.jpg',
      'https://res.cloudinary.com/dkod1at3i/image/upload/v1780862288/ricardo-zulueta-5_I_am_Not_Your_Robot_2024_dimensions_variable_installation_view_multi_channel_HD_video-705x474_ese1rg.jpg',
      'https://res.cloudinary.com/dkod1at3i/image/upload/v1780862287/ricardo-zulueta-4_Networked_Gestures_v.2_2022_installation_view_at_David_Castillo_Gallery_dimensions_variable_acrylic_ink_software_on_canvas_and_video-705x470_ti2ozj.webp',
      'https://res.cloudinary.com/dkod1at3i/image/upload/v1780862286/ricardo-zulueta-3_Networked_Gestures_v.1_2022_dimensions_variable_installation_view_multi_channel_HD_video-1-705x470_oeenj0.jpg',
      'https://res.cloudinary.com/dkod1at3i/image/upload/v1780862285/ricardo-zulueta-2_GRIDS_1_3_4_2022-23_dimensions_variable_installation_view_acrylic_paint_ink_software_on_canvas-705x532_uquqyj.webp',
      'https://res.cloudinary.com/dkod1at3i/image/upload/v1780862283/ricardo-zulueta-1_Speculative_Cyberscapes_v.1_2024_dimensions_variable_acrylic_paint_ink_on_canvas_printed_vinyl_and_video-705x529_x6lrgd.jpg',
    ],
    practiceTags: ['Photography', 'Installation', 'Video'],
  },
  'José Delgado Zúñiga': {
    titleRole: 'Painter / Instructor',
    bio: 'José Delgado Zúñiga is a 2026 Oolite Arts Studio Resident in Studio 207. A painter and educator, he explores color, observation, and identity through studio practice and teaching. Included in Sites of the Self at Oolite Arts.',
  },
  'Bex McCharen': {
    recordId: OOLITE_PEOPLE_RECORD_IDS.bexMcCharen,
    titleRole: 'Studio Artist',
    website: 'https://bexwater.com/',
    instagram: '@waterbbex',
    bio: 'Bex McCharen is a 2026 Oolite Arts Studio Resident in Studio 108. Their practice spans social practice, photography, and creative technology. Included in Sites of the Self and leads textile workshops at Oolite Arts.',
    programmingRecordIds: [
      OOLITE_PROGRAMMING_RECORD_IDS.sitesOfTheSelf,
      OOLITE_PROGRAMMING_RECORD_IDS.fabricOfRemembering,
    ],
  },
}

const STAFF: OolitePeopleSeedRecord[] = [
  {
    fullName: 'Melissa Wallen',
    titleRole: 'Exhibition Director',
    department: 'Exhibitions',
    city: 'Miami',
    publicAiApproved: false,
    bio: 'Melissa Wallen is Exhibition Director at Oolite Arts.',
  },
  {
    recordId: OOLITE_PEOPLE_RECORD_IDS.rinaCarvajal,
    fullName: 'Rina Carvajal',
    titleRole: 'Senior Director of Programs',
    department: 'Programs',
    city: 'Miami',
    publicAiApproved: false,
    bio: 'Rina Carvajal is Senior Director of Programs at Oolite Arts.',
  },
  {
    fullName: 'René Morales',
    titleRole: 'Senior Curatorial Fellow',
    department: 'Curatorial',
    publicAiApproved: false,
    skipInstitutionLink: true,
    bio: 'René Morales is Senior Curatorial Fellow at Bakehouse Art Complex. Curator of Sites of the Self at Oolite Arts.',
  },
]

async function upsertPerson(
  row: OolitePeopleSeedRecord,
  orgRecordId: string,
  byName: Map<string, string>,
  peopleConn: NonNullable<ReturnType<typeof getOoliteCrmPeopleConnection>>
): Promise<string | null> {
  const fields = seedPersonToAirtableFields(row, orgRecordId, peopleConn.fieldMap)
  const existingId = row.recordId || byName.get(row.fullName.trim().toLowerCase())
  if (existingId) {
    await patchAirtableRecord(
      peopleConn.baseId,
      peopleConn.tableId,
      peopleConn.apiKey,
      existingId,
      fields
    )
    console.log(`   ↻ Updated  ${row.fullName} (${existingId})`)
    byName.set(row.fullName.trim().toLowerCase(), existingId)
    return existingId
  }

  const createdRows = await createAirtableRecords(
    peopleConn.baseId,
    peopleConn.tableId,
    peopleConn.apiKey,
    [{ fields }]
  )
  const id = createdRows[0]?.id
  if (id) {
    console.log(`   + Created  ${row.fullName} (${id})`)
    byName.set(row.fullName.trim().toLowerCase(), id)
  }
  return id ?? null
}

async function main() {
  const peopleConn = getOoliteCrmPeopleConnection('oolite')
  const progConn = getProgrammingConnectionForOrg('oolite')
  if (!peopleConn || !progConn) {
    console.error('❌ Oolite People or Programming not configured in .env.local')
    process.exit(1)
  }

  const orgRecordId = peopleConn.orgRecordId || 'recRiKB2W96uzTfY0'
  const sitesId = OOLITE_PROGRAMMING_RECORD_IDS.sitesOfTheSelf

  console.log('📥 2026 resident cohort + Sites of the Self staff graph')

  const filterFormula = peopleConn.orgName
    ? `{${peopleConn.fieldMap.institution}}='${peopleConn.orgName.replace(/'/g, "\\'")}'`
    : undefined
  const existingRows = await fetchAllRecords(
    peopleConn.baseId,
    peopleConn.tableId,
    peopleConn.apiKey,
    { filterFormula, viewId: peopleConn.viewId }
  )
  const byName = indexPeopleRowsByName(existingRows, peopleConn.fieldMap.name)

  const residentRows: OolitePeopleSeedRecord[] = OOLITE_2026_STUDIO_RESIDENTS.map((entry) => {
    const enriched = ENRICHED_RESIDENT_BIOS[entry.fullName] ?? {}
    return {
      fullName: entry.fullName,
      titleRole: enriched.titleRole ?? '2026 Oolite Arts Resident Artist',
      department: 'Artist / Resident Artist',
      city: 'Miami',
      website: entry.website ?? enriched.website,
      instagram: entry.instagram ?? enriched.instagram,
      primaryImageUrl: entry.primaryImageUrl,
      portfolioImageUrls: enriched.portfolioImageUrls,
      practiceTags: entry.practiceTags,
      publicAiApproved: true,
      bio: enriched.bio ?? defaultResidentBio(entry.fullName, entry.studio),
      programmingRecordIds: enriched.programmingRecordIds ?? [sitesId],
      recordId: enriched.recordId,
    }
  })

  console.log(`\n👥 Upserting ${residentRows.length} resident artists…`)
  const residentIds: string[] = []
  for (const row of residentRows) {
    const id = await upsertPerson(row, orgRecordId, byName, peopleConn)
    if (id) residentIds.push(id)
  }

  console.log(`\n🏛 Upserting ${STAFF.length} staff / curator rows…`)
  const staffIds: Record<string, string> = {}
  for (const row of STAFF) {
    const id = await upsertPerson(row, orgRecordId, byName, peopleConn)
    if (id) staffIds[row.fullName] = id
  }

  const artistIds = [...new Set(residentIds)]
  const curatorIds = staffIds['René Morales'] ? [staffIds['René Morales']] : []
  const programStaffIds = [staffIds['Melissa Wallen'], staffIds['Rina Carvajal']].filter(
    Boolean
  ) as string[]

  await patchAirtableRecord(progConn.baseId, progConn.tableId, progConn.apiKey, sitesId, {
    [progConn.fieldMap.artists]: artistIds,
    [progConn.fieldMap.curators]: curatorIds,
    [progConn.fieldMap.programStaff]: programStaffIds,
  })

  console.log(`\n🔗 Linked Sites of the Self (${sitesId}):`)
  console.log(`   Artists (${artistIds.length}): ${artistIds.join(', ')}`)
  console.log(`   Curators (${curatorIds.length}): ${curatorIds.join(', ') || '(none)'}`)
  console.log(`   Program Staff (${programStaffIds.length}): ${programStaffIds.join(', ') || '(none)'}`)

  const missingBio = residentRows.filter((r) => !r.bio?.trim()).map((r) => r.fullName)
  const missingImage = residentRows.filter((r) => !r.primaryImageUrl).map((r) => r.fullName)

  console.log('\n📋 Enrichment gaps:')
  console.log(`   Missing bios: ${missingBio.length ? missingBio.join(', ') : '(none)'}`)
  console.log(`   Missing images: ${missingImage.length ? missingImage.join(', ') : '(none)'}`)
  console.log('\n🎉 Cohort import complete.')
}

main().catch((err) => {
  console.error('❌', err instanceof Error ? err.message : err)
  process.exit(1)
})
