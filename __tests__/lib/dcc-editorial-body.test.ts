jest.mock('server-only', () => ({}))
jest.mock('rehype-stringify', () => () => undefined)
jest.mock('remark-gfm', () => () => undefined)
jest.mock('remark-parse', () => () => undefined)
jest.mock('remark-rehype', () => () => undefined)
jest.mock('unified', () => ({
  unified: () => {
    const pipeline = {
      use() {
        return pipeline
      },
      process: async (markdown: string) => markdown,
    }
    return pipeline
  },
}))

import {
  renderEditorialMarkdown,
  resolveEditorialMarkdown,
  resolveJournalBodyFile,
} from '@/lib/dcc/culture/editorial-body'
import { DCC_EDITORIAL } from '@/lib/dcc/culture/editorial'
import type { DccEditorial } from '@/lib/dcc/culture/types'

const firstEssay = DCC_EDITORIAL.find(
  (entry) => entry.slug === 'a-digital-lab-is-not-a-room-full-of-equipment'
)!
const longformEssay = DCC_EDITORIAL.find(
  (entry) => entry.slug === 'you-cant-buy-digital-culture'
)!

describe('editorial bodyPath loader', () => {
  it('resolves filenames under content/journal/ only', () => {
    const allowed = resolveJournalBodyFile('content/journal/you-cant-buy-digital-culture.md')
    expect(allowed).toMatch(/content\/journal\/you-cant-buy-digital-culture\.md$/)
    expect(resolveJournalBodyFile('you-cant-buy-digital-culture.md')).toBe(allowed)
  })

  it('rejects paths that escape the journal root', () => {
    expect(resolveJournalBodyFile('../editorial.ts')).toBeNull()
    expect(resolveJournalBodyFile('content/journal/../editorial.ts')).toBeNull()
    expect(resolveJournalBodyFile('/etc/passwd')).toBeNull()
    expect(resolveJournalBodyFile('content/workshops/foo.md')).toBeNull()
    expect(resolveJournalBodyFile('content/journal/nested/file.md')).toBeNull()
    expect(resolveJournalBodyFile('you-cant-buy-digital-culture.txt')).toBeNull()
  })

  it('loads markdown from bodyPath and falls back to inline body', () => {
    const fromDisk = resolveEditorialMarkdown(longformEssay)
    expect(fromDisk).toMatch(/Imagine that an artist arrives with a 3D model/)
    expect(fromDisk).toMatch(/fabrication-intake\.png/)
    expect(fromDisk).not.toMatch(/^# You Can’t Buy Digital Culture/m)

    expect(resolveEditorialMarkdown(firstEssay)).toMatch(/## Acquisition is not access/)
    expect(firstEssay.bodyPath).toBeUndefined()

    const escaped: DccEditorial = {
      ...firstEssay,
      bodyPath: 'content/journal/../package.json',
    }
    expect(resolveEditorialMarkdown(escaped)).toBe(firstEssay.body)
  })

  it('sends markdown through the remark pipeline', async () => {
    await expect(renderEditorialMarkdown('## Heading')).resolves.toBe('## Heading')
  })
})
