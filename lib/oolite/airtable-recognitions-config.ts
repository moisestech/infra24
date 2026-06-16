/**
 * Oolite Memory Agent — Airtable recognition adapter field map.
 * Base: OOLITE ARTS (appBvA0pWq9XkthTc)
 */

export const OOLITE_AIRTABLE_BASE_ID = 'appBvA0pWq9XkthTc'

/** Public-safe artist directory — not the private CRM table. */
export const OOLITE_PUBLIC_DIRECTORY_TABLE = {
  id: 'tblvcSA236qoUfjcv',
  name: '🧑‍🎨 Alumni Directory (Public Fields)',
  fields: {
    displayName: 'fldrLbeHZLECsR3QO',
    alumniLink: 'fldbGq9aN9kOvbaFH',
    publicProfileApproved: 'fld7NfCWQsRrKDPDX',
    directoryTier: 'fldXUI9TlV7ZWCNyg',
    batchStatus: 'flddoqwepuFLB0PsR',
    recencyYear: 'fldjcG3aQVZt68tnV',
    topics: 'fldOg0cJUcQBCY1wK',
    themes: 'fldY3HYCv8oECzfob',
    digitalArtist: 'fldv0Wl1zqMqrjPNu',
    videoMovingImage: 'fldNTO6a5GizO80zj',
    inOoliteCollection: 'fldF2T3glHXXk2TeL',
    websiteUrl: 'fldME0CvawbHYhyBz',
    instagramUrl: 'fldZaJB7xfHbW3DVk',
    featuredImageUrl: 'fldnkYQCGZ78Yqhlj',
    notesPublic: 'fldAz8NOS5QQtSpUq',
    primaryMedium: 'fldJ90fIS3fUTiGMw',
    additionalMediums: 'fldZlc5HeRRAZvfAB',
    digitalPracticeQualifier: 'fldkgYj3CmhhrpX1K',
    tagSource: 'fldiY3jQDIJbKKaei',
    tagConfidence: 'fld8HjPtYgk4HPwlK',
    ooliteArtsAlumni: 'fldDkm0HK2N3lNywG',
    residencyProgram: 'fld2Rgo6AgqKcQo7A',
    residencyCategory: 'fldp2eBEX2gQJM6mS',
    studioNumber: 'fldE9DEW5Lu6T42Yh',
    currentAlumniStatus: 'fldWfzyVjzV0APjP2',
    ooliteProfileUrl: 'fldqUy9WYyszb9wYo',
    doNotUseInAi: 'fldOzBbhlBHr8uLsf',
    duplicateReviewStatus: 'fld2nzxLJV39rEt3G',
    sourceNotes: 'fldDPHV4m9IJRR3yV',
    lastReviewed: 'fld4jwEmzvpuC8ota',
    reviewedBy: 'fldDPxJNFE9AbxwPG',
    publicBio: 'fldZSgWANORWnjhUW',
    shortAiSummary: 'fldeeOIZLexAS1nNN',
    imageAltText: 'fldR0mEKC3xG8Xe4L',
    imageCredit: 'fldEaPYycHj4A8a50',
    imageSource: 'fldjPZgTUr9JZBVUO',
    headshotAttachment: 'fldd9aapFaWmzr0a0',
    portraitVerticalUrl: 'fldm29NXp29zA67eH',
    portraitLandscapeUrl: 'fldIvAQzMrSdctgew',
    additionalImageUrls: 'fld6Pe4ZRKjQ9i6HT',
    imageReviewStatus: 'fldS6yKRYw1UC5aWN',
    preferredImageOrientation: 'fld0e6v6b8uqsVtps',
    cloudinaryFolderSourceBatch: 'fldQm5lHvzP95LSu8',
    nameKey: 'fldZPN2b7NsDLoQvU',
  },
} as const

export const OOLITE_RECOGNITIONS_TABLE = {
  id: 'tblSEbXzptyAgiTJx',
  name: '🏆 Recognitions & Exhibitions',
  fields: {
    recognitionEventName: 'fld8FILH0wBcWe3sM',
    type: 'fldCwOZUmkYem4NKC',
    institution: 'fldnwVyiGfNkJbvAR',
    year: 'fldAs0Bcj8ZKUBKh5',
    startDate: 'fldzmWLuDbxiy6sdj',
    endDate: 'fldsdMrPjXJgYcili',
    publicSummary: 'fldV3DCfm2KSUt9sz',
    sourceUrl: 'flddiuym06tzvGI6f',
    publiclyApproved: 'fldfdhHcINHzhTRYJ',
    doNotUseInAi: 'flddjJnNE7xV84ZOE',
    sourceNotes: 'fld83usw3KQvf4PK8',
    lastReviewed: 'fldYVxAcck5ikLeiC',
    reviewedBy: 'fldPKTwAkjVae2Jfd',
    artistParticipationReverseLink: 'fldjbTnurgAzIdZJC',
    participatingPracticesCount: 'fldmzQGBew8ELWkNA',
    namedIndividualsCount: 'flddYf5K5X1sAwyAU',
  },
} as const

export const OOLITE_RECOGNITION_AGGREGATE_FIELDS = {
  participatingPracticesCount: 'fldmzQGBew8ELWkNA',
  namedIndividualsCount: 'flddYf5K5X1sAwyAU',
} as const

export const OOLITE_MEMORY_AGENT_QUESTION_CATALOG_TABLE = {
  id: 'tblj02Uy16QpNvbaw',
  name: '🧠 Memory Agent Question Catalog',
  fields: {
    question: 'fldJGuQP8zOaQGLLW',
    questionCategory: 'fld8OhwLTbu2Bb9ry',
    capabilityPhase: 'fldhWrxZ6CLreRzwZ',
    demoPriority: 'fldnqqgAESphrbJsZ',
    audience: 'fldan64cfOElRUNXU',
    dataDomain: 'fldbw8pdN5WVYw3Ny',
    expectedAnswerPattern: 'fldl2p2nU5gDEbm3o',
    demoAnswerNotes: 'fldo28gITKhHqd7I5',
    supportStatus: 'fldlzK9aiICfgaUL0',
    publicSafe: 'fldULkUsTRqIpoGBv',
    relatedRecognitionExhibition: 'fldKIKsxJ0d2MAhjw',
    sourceTables: 'fldI6ebRXyDUyOTcV',
    testStatus: 'fldymNR6K1FZY0l3E',
    lastTested: 'fldVoqWTBBbwtHaCl',
    showInApp: 'fld959rYfGt7PSO5u',
    appDisplayOrder: 'flduE2e3u3xy5qEe6',
  },
} as const

/** Showcase public-directory records wired for leadership demos. */
export const OOLITE_SHOWCASE_PUBLIC_DIRECTORY_RECORD_IDS = {
  markDelmont: 'recQjJVKj3QzhEAvx',
  shaylaMarshall: 'reccaY67D6OUMHxQ6',
  ricardoEZulueta: 'recF9rzblLM0MprGk',
  leoCastaneda: 'recktCg5W9FxR8Swi',
} as const

export const OOLITE_ARTIST_PARTICIPATION_TABLE = {
  id: 'tblJXhoXoJg3o1XOh',
  name: '🔗 Artist Participation',
  fields: {
    participationRecord: 'fldHp50LJjOUWw6es',
    artistCollective: 'fldLh5xM6knDIkvUP',
    recognitionExhibition: 'fldeDsjY9EZYUpDEW',
    participationType: 'fldt3RUkVNIpoUC3N',
    participationStatus: 'fldOWj3g0B43OpclQ',
    countAsPractice: 'fld6kdBaRuDNZS9kL',
    individualArtistCount: 'fldU9nz7FWvIpLcRB',
    publicNote: 'fldMFbJuCDxxa2746',
    sourceUrl: 'fldtnjL3cRX0yZExC',
    publiclyApproved: 'fld3151DwmK4WYjKT',
    doNotUseInAi: 'fldxcw3587Ular4bL',
    sourceNotes: 'fldrobwxfj7KBuvFe',
    lastReviewed: 'fldsRPDv7cET8AGt9',
    reviewedBy: 'fldPmKiFqpsJBW1nE',
  },
} as const

export const OOLITE_PUBLIC_DIRECTORY_RECOGNITIONS_REVERSE_LINK =
  'fldJauw5BmTiMlLMV'

export const FLORIDA_PRIZE_2026_EVENT_RECORD_ID = 'recHxWpN48bbKZBsQ'

export const FLORIDA_PRIZE_2026_PARTICIPATION_RECORD_IDS = {
  mariaTheresaBarbist: 'recrWMW5XJlewojo8',
  roseMarieCromwell: 'recEYit5QXFnEAwXr',
  franciscoMaso: 'recssOX5CXQ3WT6Hu',
  charoOquet: 'rec1Iod0N1aTNXQwH',
  emaRi: 'recLtEiPqeRDo9fyR',
  niceNEasy: 'rec5Mc39PNWyklDHa',
} as const

export const FLORIDA_PRIZE_2026_ARTIST_RECORD_IDS = {
  mariaTheresaBarbist: 'recLuKXyupUCxMAJn',
  roseMarieCromwell: 'rec1cMqyOWOLBDi9R',
  franciscoMaso: 'recmWFTENJ5UEzYo2',
  charoOquet: 'recgqUpTxvKCAFH6K',
  emaRi: 'rectd2o8lVRV8FFRl',
  niceNEasy: 'reczSBc5yToSEaCVi',
} as const
