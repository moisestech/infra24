import 'server-only'
import fs from 'fs/promises'
import path from 'path'
import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import remarkHtml from 'remark-html'

const REHEARSAL_FILENAME = 'learn-ai-without-losing-yourself-printable-rehearsal.md'

export async function loadLearnAiPrintableRehearsalHtml(): Promise<string> {
  const filePath = path.join(
    process.cwd(),
    'content/workshops/learn-ai-without-losing-yourself',
    REHEARSAL_FILENAME
  )
  const raw = await fs.readFile(filePath, 'utf8')
  const file = await remark().use(remarkGfm).use(remarkHtml).process(raw)
  return String(file)
}
