import { editorialHref, editorialJournalCategory } from '@/lib/dcc/culture/taxonomy'
import type { DccEditorial } from '@/lib/dcc/culture/types'

/**
 * Journal records. Medium-agnostic: written, video, audio, or a combination.
 * Do not invent conversations, quotations, or guests.
 *
 * Body uses `\n\n` paragraph breaks for short inline records. `## Heading` lines
 * render as h2 in EditorialDetail. Longer essays use `bodyPath` MDX under
 * `content/journal/`. `bodyPath` takes precedence when present.
 * Do not invent guests for conversations; a podcast feed is not launching in this phase.
 */
export const DCC_EDITORIAL: DccEditorial[] = [
  {
    id: 'a-digital-lab-is-not-a-room-full-of-equipment',
    slug: 'a-digital-lab-is-not-a-room-full-of-equipment',
    title: 'A Digital Lab Is Not a Room Full of Equipment',
    dek: 'Buying technology is easy to see. Building access around it is much harder.',
    type: 'essay',
    publishedAt: '2026-09-11',
    author: 'Moises Sanabria',
    featured: true,
    status: 'published',
    heroImage:
      'https://res.cloudinary.com/dck5rzi4h/image/upload/q_auto/f_auto/v1789319099/dccmiami/journal/a-digital-lab-is-not-a-room-full-of-equipment_rqhmks.png',
    heroImageAlt: 'Graphic cover for A Digital Lab Is Not a Room Full of Equipment',
    seoTitle: 'A Digital Lab Is Not a Room Full of Equipment | DCC Miami',
    seoDescription:
      'Digital access requires more than buying technology. It requires maintenance, knowledge, people, documentation, and continuity.',
    excerpt: 'Buying technology is easy to see. Building access around it is much harder.',
    body: `Buying technology is easy to see. Building access around it is much harder.

Walk into almost any conversation about expanding access to digital art and technology and, eventually, somebody starts making a list.

A 3D printer.

A VR headset.

A laser cutter.

A large-format printer.

A room full of computers.

Equipment matters. Artists need tools. But I've spent enough time around digital production spaces to become increasingly convinced that the equipment is usually the easiest part.

The harder question is what happens after it arrives.

Who knows how to use it?

Who teaches the next person?

Who notices when something needs maintenance?

Who documents the workflow?

Who orders the material?

Who helps an artist whose file isn't ready?

Who determines what can actually be accomplished with the machine?

And what happens when the one person who knows all of this leaves?

A digital lab is not a room full of equipment.

It is a system of relationships, knowledge, maintenance, experimentation, documentation, and continuity built around that equipment.

## Acquisition is not access

Cultural organizations are often very good at acquisition.

A grant makes it possible to buy a new machine. A program launches. Photos are taken. A workshop happens. The technology becomes evidence that an organization is investing in innovation.

But access isn't created at the moment of purchase.

Access is created when somebody can arrive with an idea they don't yet know how to realize and find a believable path forward.

Sometimes that requires a machine.

Often it requires a person.

Someone has to be able to say:

Your file isn't ready yet, but here's what needs to change.

Or:

That material isn't going to work, but this one might.

Or:

You don't actually need to learn this entire software package. Let's find the person who already knows it.

That layer of translation is infrastructure too.

## Maintenance is cultural work

Maintenance is rarely the glamorous part of technological culture.

Calibration doesn't photograph particularly well.

Neither does writing documentation, cleaning a machine, testing materials, updating software, replacing consumables, organizing files, troubleshooting a failed print, or explaining the same workflow for the tenth time.

But without that labor, access slowly becomes theoretical.

The machine exists.

The program technically exists.

The possibility exists.

But fewer and fewer people know how to reach it.

I think cultural organizations need to take that invisible work more seriously.

If maintenance is treated as an inconvenience that happens after the "real" program, the program was never fully designed.

Maintenance is part of the program.

Documentation is part of the program.

Knowledge transfer is part of the program.

Staff continuity is part of the program.

## Artists shouldn't have to become technicians to participate

There is another assumption worth questioning: that access means teaching every artist to operate every piece of technology independently.

Sometimes that's exactly what an artist wants.

Sometimes it isn't.

An artist may need to understand what a process can do without becoming an expert operator. They might need a fabricator, developer, technician, producer, or another artist with a complementary skill.

That isn't a failure of education.

It is how almost every mature creative field already works.

Filmmakers have crews.

Architects work with engineers and fabricators.

Musicians work with producers and audio engineers.

Complex digital cultural work also requires networks of specialized people.

The infrastructure shouldn't only teach people how to use machines.

It should help people find one another.

## What we're testing at DCC Miami

This is one of the questions underneath DCC Miami:

What would digital cultural infrastructure look like if we designed it around what artists actually need to accomplish?

Sometimes the answer is a workshop.

Sometimes it's access to fabrication.

Sometimes it's helping repair a file before it reaches the printer.

Sometimes it's documentation.

Sometimes it's introducing someone to the person who knows the thing we don't.

Sometimes it's testing a process ourselves before offering it publicly.

The goal isn't to accumulate the largest collection of technology.

The goal is to make more ambitious work possible.

That distinction matters.

## Access should survive the announcement

I want us to become more precise when we use the word access.

A machine sitting in a room is availability.

A workshop is an introduction.

Access is the larger system that allows someone to return, continue learning, ask for help, find collaborators, understand the limitations of the technology, recover from failure, and eventually make something they could not have made alone.

That requires resources.

But more importantly, it requires care.

And perhaps the most useful question for any digital lab isn't:

What equipment do you have?

It is:

What can someone actually accomplish here—and what systems exist to help them accomplish it?

That is the infrastructure I want DCC Miami to keep building.`,
  },
  {
    id: 'the-artist-doesnt-need-to-learn-everything',
    slug: 'the-artist-doesnt-need-to-learn-everything',
    title: "The Artist Doesn't Need to Learn Everything",
    dek: 'Digital culture has taught artists to become their own technicians, producers, fabricators, installers, and troubleshooters. Sometimes learning the tool is the answer. Sometimes the better answer is finding the person who already knows it.',
    type: 'essay',
    publishedAt: '2026-09-12',
    author: 'Moises Sanabria',
    featured: false,
    status: 'published',
    seoTitle: "The Artist Doesn't Need to Learn Everything | DCC Miami",
    seoDescription:
      'Artists do not need to master every technical tool themselves. DCC Miami explores expertise, collaboration, technical literacy, and why access to the right person can matter as much as access to equipment.',
    excerpt:
      'Digital culture has taught artists to become their own technicians, producers, fabricators, installers, and troubleshooters. Sometimes learning the tool is the answer. Sometimes the better answer is finding the person who already knows it.',
    pullQuote:
      'Does the artist need to learn this skill, or does the project need access to this skill?',
    bodyPath: 'content/journal/the-artist-doesnt-need-to-learn-everything.mdx',
    heroImage:
      'https://res.cloudinary.com/dck5rzi4h/image/upload/q_auto/f_auto/v1789319100/dccmiami/journal/artist-doesnt-need-to-learn-everything_oz7ipo.png',
    heroImageAlt: "Graphic cover for The Artist Doesn't Need to Learn Everything",
    heroSlot: {
      id: '02-hero',
      ratio: '16:9',
      role: 'hero',
      title: 'An unfinished idea meets specialized knowledge',
      brief:
        'A grounded DCC-scale workspace. An artist and technical collaborator reviewing an unfinished prototype, model, sketch, or fabrication problem together — work that exists between people, not between a lone artist and a machine.',
    },
  },
  {
    id: 'miami-doesnt-have-a-digital-art-problem',
    slug: 'miami-doesnt-have-a-digital-art-problem',
    title: "Miami Doesn't Have a Digital-Art Problem. It Has an Infrastructure Problem.",
    dek: 'Miami already has artists working with software, 3D tools, AI, immersive media, fabrication, moving image, and networked culture. What often feels missing is not talent or technology, but the connective infrastructure that helps those ideas move from experiment to production, exhibition, and sustained public life.',
    type: 'essay',
    publishedAt: '2026-09-12',
    author: 'Moises Sanabria',
    featured: false,
    status: 'published',
    seoTitle:
      "Miami Doesn't Have a Digital-Art Problem. It Has an Infrastructure Problem. | DCC Miami",
    seoDescription:
      'DCC Miami explores why the future of digital culture in Miami depends less on acquiring more technology and more on connecting artists, expertise, fabrication, education, institutions, and opportunity.',
    excerpt:
      'Miami already has artists working with software, 3D tools, AI, immersive media, fabrication, moving image, and networked culture. What often feels missing is not talent or technology, but the connective infrastructure that helps those ideas move from experiment to production, exhibition, and sustained public life.',
    pullQuote: 'Uncoordinated capacity can feel a lot like scarcity.',
    bodyPath: 'content/journal/miami-doesnt-have-a-digital-art-problem.mdx',
    heroImage:
      'https://res.cloudinary.com/dck5rzi4h/image/upload/q_auto/f_auto/v1789319098/dccmiami/journal/miami-doesnt-have-a-digital-art-problem-it-has-an-infrastructure-problem_kz4qjt.png',
    heroImageAlt:
      "Graphic cover for Miami Doesn't Have a Digital-Art Problem. It Has an Infrastructure Problem.",
    heroSlot: {
      id: '03-hero',
      ratio: '16:9',
      role: 'hero',
      title: 'The pieces already exist',
      brief:
        'A grounded collage of real cultural capacity: an artist workstation, fabrication equipment, workshop or education, installation or exhibition, and a small Miami-specific environmental fragment. Artists, equipment, expertise, education, and institutions exist. The connections are the problem.',
    },
  },
]

export function isPublishedEditorial(entry: DccEditorial): boolean {
  return (entry.status ?? 'published') === 'published'
}

function compareEditorialDateDesc(a: DccEditorial, b: DccEditorial): number {
  const da = a.publishedAt ?? ''
  const db = b.publishedAt ?? ''
  if (da === db) return 0
  return db.localeCompare(da)
}

export function listEditorial(
  editorial: readonly DccEditorial[] = DCC_EDITORIAL
): DccEditorial[] {
  return editorial.filter(isPublishedEditorial).slice().sort(compareEditorialDateDesc)
}

export function listFeaturedEditorial(
  editorial: readonly DccEditorial[] = DCC_EDITORIAL
): DccEditorial[] {
  return listEditorial(editorial).filter((entry) => entry.featured)
}

export function listEditorialByType(
  type: DccEditorial['type'],
  editorial: readonly DccEditorial[] = DCC_EDITORIAL
): DccEditorial[] {
  return listEditorial(editorial).filter((entry) => entry.type === type)
}

export function getEditorialById(
  id: string,
  editorial: readonly DccEditorial[] = DCC_EDITORIAL
): DccEditorial | undefined {
  return editorial.find((entry) => entry.id === id)
}

export function getEditorialBySlug(
  slug: string,
  editorial: readonly DccEditorial[] = DCC_EDITORIAL
): DccEditorial | undefined {
  return editorial.find((entry) => entry.slug === slug)
}

export function getPublishedEditorialBySlug(
  slug: string,
  editorial: readonly DccEditorial[] = DCC_EDITORIAL
): DccEditorial | undefined {
  const entry = getEditorialBySlug(slug, editorial)
  if (!entry || !isPublishedEditorial(entry)) return undefined
  return entry
}

export function getEditorialPublicPath(entry: DccEditorial): string {
  return editorialHref(editorialJournalCategory(entry.type), entry.slug)
}

export function assertEditorialSlugsValid(
  editorial: readonly DccEditorial[] = DCC_EDITORIAL
): string[] {
  const errors: string[] = []
  const slugs = new Set<string>()
  const ids = new Set<string>()
  for (const entry of editorial) {
    if (!entry.id) errors.push('editorial missing id')
    if (!entry.slug) errors.push(`editorial ${entry.id} missing slug`)
    if (ids.has(entry.id)) errors.push(`duplicate editorial id ${entry.id}`)
    if (slugs.has(entry.slug)) errors.push(`duplicate editorial slug ${entry.slug}`)
    ids.add(entry.id)
    slugs.add(entry.slug)
  }
  return errors
}
