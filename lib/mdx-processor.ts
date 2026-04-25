import matter from 'gray-matter'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
import rehypeSlug from 'rehype-slug'
import rehypeStringify from 'rehype-stringify'
import rehypeToc from 'rehype-toc'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'
import { rehypeExternalLessonLinks } from '@/lib/workshops/rehype-external-lesson-links'

export interface ProcessedMDX {
  content: string
  metadata: Record<string, any>
  toc: Array<{ id: string; text: string; level: number }>
}

export class MDXProcessor {
  async processMDX(content: string): Promise<ProcessedMDX> {
    try {
      const { data: metadata, content: mdxContent } = matter(content)

      const file = await unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(rehypeRaw)
        .use(rehypeHighlight)
        .use(rehypeSlug)
        .use(rehypeToc as any, {
          headings: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
          cssClasses: {
            toc: 'toc',
            link: 'toc-link',
            list: 'toc-list',
            listItem: 'toc-list-item',
          },
        })
        .use(rehypeExternalLessonLinks)
        .use(rehypeStringify)
        .process(mdxContent)

      const toc = this.generateTableOfContents(mdxContent)

      return {
        content: String(file),
        metadata: metadata || {},
        toc,
      }
    } catch (error) {
      console.error('Error processing MDX:', error)
      throw new Error('Failed to process MDX content')
    }
  }

  private generateTableOfContents(content: string): Array<{ id: string; text: string; level: number }> {
    const toc: Array<{ id: string; text: string; level: number }> = []
    const headingRegex = /^(#{1,6})\s+(.+)$/gm
    let match

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length
      const text = match[2].trim()
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-')

      toc.push({ id, text, level })
    }

    return toc
  }
}

export const mdxProcessor = new MDXProcessor()
