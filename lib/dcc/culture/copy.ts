/**
 * Public institutional language for DCC MIA cultural surfaces.
 * Technology is a condition around the work — not a medium police test.
 */

export const DCC_MIA_NAME = 'DCC MIA'

export const DCC_CULTURAL_POSITION =
  'DCC MIA is a digital cultural center for artists working through the technological conditions of the present.'

export const DCC_CULTURAL_SUPPORT =
  'DCC develops programs, exhibitions, education and production infrastructure connecting contemporary culture with emerging technology.'

export const ARTISTS_INDEX_INTRO =
  'DCC MIA presents and works with artists through exhibitions, programs, production, education and cultural research. This is a curated record of artists DCC has presented or collaborated with — not an open directory.'

export const ARTISTS_EMPTY =
  'Artist profiles will appear here as DCC presents and documents work. Names, images and bios are published only when confirmed.'

export const PROGRAMS_CULTURAL_INTRO =
  'Current and upcoming presentations sit alongside DCC’s ongoing workshop, public-program and institutional offerings.'

export const JOURNAL_DESCRIPTOR = 'The infrastructure behind digital culture.'

export const JOURNAL_INTRO =
  'Essays, conversations, experiments, and shared knowledge about how artists, institutions, technologies, and cities build capacity together.'

export const JOURNAL_SECONDARY =
  'Digital culture needs infrastructure. We are interested in how that infrastructure gets built, who maintains it, who benefits from it, and what happens when it fails.'

export const JOURNAL_THESIS =
  'DCC Journal examines the infrastructure behind digital culture—from the capabilities artists need, to the systems institutions build, to the technologies cities inherit.'

export const JOURNAL_SCALE_LABELS = [
  'Artist',
  'Studio',
  'Institution',
  'Network',
  'City',
] as const

export const JOURNAL_SCALE_QUESTION =
  'We study what digital culture requires at each scale.'

/** Topic vocabulary for the publication we actually have. Not a filter, not a CMS. */
export const JOURNAL_TOPICS = [
  'Infrastructure',
  'Art & Technology',
  'Institutions',
  'Fabrication',
  'Public Space',
  'Digital Literacy',
] as const

export const JOURNAL_INDEX_SECTION_DESCRIPTION: Record<string, string> = {
  essays:
    'Longform arguments on infrastructure, access, and how digital culture actually gets made.',
  conversations:
    'People whose practices complicate or expand the Journal’s arguments. Published when they have been edited. A podcast feed is not launching in this phase.',
}

/** Single-paragraph hero / SEO description (PageHero is one `<p>`). */
export const JOURNAL_HERO_DESCRIPTION = `${JOURNAL_DESCRIPTOR} ${JOURNAL_INTRO}`

export const JOURNAL_EMPTY_CONVERSATIONS =
  'Conversations are coming. DCC will speak with artists, fabricators, technologists, educators, institutional leaders, and others building the infrastructure of digital culture. A podcast feed is not launching in this phase.'

export const JOURNAL_INDEX_EMPTY =
  'Published essays and field notes will appear here when they are ready.'

export const DCC_BELIEFS_HEADLINE = 'What we believe'

export const DCC_BELIEFS_PARAGRAPHS = [
  'Digital culture needs more than access to technology.',
  'It needs people who know how to use it, systems for maintaining it, places to experiment, ways to share knowledge, and networks capable of carrying an idea from concept to public experience.',
  'DCC Miami exists to strengthen that infrastructure.',
  'We believe access requires continuity. Knowledge becomes more valuable when it circulates. Technical care is cultural care. And infrastructure should still work after the announcement is over.',
] as const

export const CLANDESTINE_PLACEHOLDER =
  'Artist names, selected works, dates and venue details will be published when confirmed. Do not treat empty slots as announcements.'
