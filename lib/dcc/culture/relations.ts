import { DCC_ARTISTS, getArtistById, isPublishedArtist } from '@/lib/dcc/culture/artists'
import { DCC_EDITORIAL, getEditorialById, isPublishedEditorial } from '@/lib/dcc/culture/editorial'
import { DCC_PROGRAMS, getProgramById, isListedProgram } from '@/lib/dcc/culture/programs'
import { DCC_PROJECTS, getProjectById, isPublishedProject } from '@/lib/dcc/culture/projects'
import type {
  CultureRegistry,
  DccArtist,
  DccEditorial,
  DccProgram,
  DccProject,
} from '@/lib/dcc/culture/types'

export function defaultCultureRegistry(): CultureRegistry {
  return {
    artists: DCC_ARTISTS,
    programs: DCC_PROGRAMS,
    editorial: DCC_EDITORIAL,
    projects: DCC_PROJECTS,
  }
}

export function getProgramsForArtist(
  artist: DccArtist,
  registry: CultureRegistry = defaultCultureRegistry()
): DccProgram[] {
  const fromArtist = (artist.programIds ?? [])
    .map((id) => getProgramById(id, registry.programs))
    .filter((program): program is DccProgram => Boolean(program))
  const fromPrograms = registry.programs.filter((program) =>
    (program.artistIds ?? []).includes(artist.id)
  )
  return dedupeById([...fromArtist, ...fromPrograms]).filter(isListedProgram)
}

export function getEditorialForArtist(
  artist: DccArtist,
  registry: CultureRegistry = defaultCultureRegistry()
): DccEditorial[] {
  const fromArtist = (artist.editorialIds ?? [])
    .map((id) => getEditorialById(id, registry.editorial))
    .filter((entry): entry is DccEditorial => Boolean(entry))
  const fromEditorial = registry.editorial.filter((entry) =>
    (entry.artistIds ?? []).includes(artist.id)
  )
  return dedupeById([...fromArtist, ...fromEditorial]).filter(isPublishedEditorial)
}

export function getProjectsForArtist(
  artist: DccArtist,
  registry: CultureRegistry = defaultCultureRegistry()
): DccProject[] {
  const fromArtist = (artist.projectIds ?? [])
    .map((id) => getProjectById(id, registry.projects))
    .filter((project): project is DccProject => Boolean(project))
  const fromProjects = registry.projects.filter((project) =>
    (project.artistIds ?? []).includes(artist.id)
  )
  return dedupeById([...fromArtist, ...fromProjects]).filter(isPublishedProject)
}

export function getArtistsForProgram(
  program: DccProgram,
  registry: CultureRegistry = defaultCultureRegistry()
): DccArtist[] {
  const fromProgram = (program.artistIds ?? [])
    .map((id) => getArtistById(id, registry.artists))
    .filter((artist): artist is DccArtist => Boolean(artist))
  const fromArtists = registry.artists.filter((artist) =>
    (artist.programIds ?? []).includes(program.id)
  )
  return dedupeById([...fromProgram, ...fromArtists]).filter(isPublishedArtist)
}

export function getEditorialForProgram(
  program: DccProgram,
  registry: CultureRegistry = defaultCultureRegistry()
): DccEditorial[] {
  const fromProgram = (program.editorialIds ?? [])
    .map((id) => getEditorialById(id, registry.editorial))
    .filter((entry): entry is DccEditorial => Boolean(entry))
  const fromEditorial = registry.editorial.filter((entry) =>
    (entry.programIds ?? []).includes(program.id)
  )
  return dedupeById([...fromProgram, ...fromEditorial]).filter(isPublishedEditorial)
}

export function getProjectsForProgram(
  program: DccProgram,
  registry: CultureRegistry = defaultCultureRegistry()
): DccProject[] {
  const fromProgram = (program.projectIds ?? [])
    .map((id) => getProjectById(id, registry.projects))
    .filter((project): project is DccProject => Boolean(project))
  const fromProjects = registry.projects.filter((project) =>
    (project.programIds ?? []).includes(program.id)
  )
  return dedupeById([...fromProgram, ...fromProjects]).filter(isPublishedProject)
}

export function getArtistsForEditorial(
  entry: DccEditorial,
  registry: CultureRegistry = defaultCultureRegistry()
): DccArtist[] {
  return (entry.artistIds ?? [])
    .map((id) => getArtistById(id, registry.artists))
    .filter((artist): artist is DccArtist => Boolean(artist && isPublishedArtist(artist)))
}

export function getProgramsForEditorial(
  entry: DccEditorial,
  registry: CultureRegistry = defaultCultureRegistry()
): DccProgram[] {
  return (entry.programIds ?? [])
    .map((id) => getProgramById(id, registry.programs))
    .filter((program): program is DccProgram => Boolean(program && isListedProgram(program)))
}

export function getProjectsForEditorial(
  entry: DccEditorial,
  registry: CultureRegistry = defaultCultureRegistry()
): DccProject[] {
  return (entry.projectIds ?? [])
    .map((id) => getProjectById(id, registry.projects))
    .filter((project): project is DccProject => Boolean(project && isPublishedProject(project)))
}

export function unresolvedRelationIds(
  registry: CultureRegistry = defaultCultureRegistry()
): string[] {
  const errors: string[] = []

  const check = (
    kind: string,
    recordId: string,
    field: string,
    ids: string[] | undefined,
    resolve: (id: string) => unknown
  ) => {
    for (const id of ids ?? []) {
      if (!resolve(id)) {
        errors.push(`${kind} ${recordId} ${field} → missing ${id}`)
      }
    }
  }

  for (const artist of registry.artists) {
    check('artist', artist.id, 'programIds', artist.programIds, (id) =>
      getProgramById(id, registry.programs)
    )
    check('artist', artist.id, 'projectIds', artist.projectIds, (id) =>
      getProjectById(id, registry.projects)
    )
    check('artist', artist.id, 'editorialIds', artist.editorialIds, (id) =>
      getEditorialById(id, registry.editorial)
    )
  }

  for (const program of registry.programs) {
    check('program', program.id, 'artistIds', program.artistIds, (id) =>
      getArtistById(id, registry.artists)
    )
    check('program', program.id, 'projectIds', program.projectIds, (id) =>
      getProjectById(id, registry.projects)
    )
    check('program', program.id, 'editorialIds', program.editorialIds, (id) =>
      getEditorialById(id, registry.editorial)
    )
  }

  for (const entry of registry.editorial) {
    check('editorial', entry.id, 'artistIds', entry.artistIds, (id) =>
      getArtistById(id, registry.artists)
    )
    check('editorial', entry.id, 'programIds', entry.programIds, (id) =>
      getProgramById(id, registry.programs)
    )
    check('editorial', entry.id, 'projectIds', entry.projectIds, (id) =>
      getProjectById(id, registry.projects)
    )
  }

  for (const project of registry.projects) {
    check('project', project.id, 'artistIds', project.artistIds, (id) =>
      getArtistById(id, registry.artists)
    )
    check('project', project.id, 'programIds', project.programIds, (id) =>
      getProgramById(id, registry.programs)
    )
    check('project', project.id, 'editorialIds', project.editorialIds, (id) =>
      getEditorialById(id, registry.editorial)
    )
  }

  return errors
}

function dedupeById<T extends { id: string }>(items: T[]): T[] {
  const seen = new Set<string>()
  const out: T[] = []
  for (const item of items) {
    if (seen.has(item.id)) continue
    seen.add(item.id)
    out.push(item)
  }
  return out
}
