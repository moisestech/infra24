import matter from 'gray-matter'
import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import { rehype } from 'rehype'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'
import rehypeToc from 'rehype-toc'

export interface ProcessedMDX {
  content: string
  metadata: Record<string, any>
  toc: Array<{ id: string; text: string; level: number }>
}

export class MDXProcessor {
  private processor = remark()
    .use(remarkGfm)

  private rehypeProcessor = rehype()
    .use(rehypeHighlight)
    .use(rehypeSlug)
    .use(rehypeToc, {
      headings: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      cssClasses: {
        toc: 'toc',
        link: 'toc-link',
        list: 'toc-list',
        listItem: 'toc-list-item',
      },
    })

  async processMDX(content: string): Promise<ProcessedMDX> {
    try {
      // Parse frontmatter
      const { data: metadata, content: mdxContent } = matter(content)
      
      // Process markdown to HTML
      const processed = await this.processor.process(mdxContent)
      const html = await this.rehypeProcessor.process(processed)
      
      // Generate table of contents
      const toc = this.generateTableOfContents(mdxContent)
      
      return {
        content: html.toString(),
        metadata: metadata || {},
        toc
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
