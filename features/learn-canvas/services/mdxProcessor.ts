import 'server-only'
import { remark } from 'remark'
import remarkMdx from 'remark-mdx'
import remarkGfm from 'remark-gfm'
import { rehype } from 'rehype'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'
import rehypeToc from 'rehype-toc'
import matter from 'gray-matter'
import { visit } from 'unist-util-visit'
import { toString } from 'mdast-util-to-string'
// console.log not available

// Types for MDX processing
export interface MDXComponent {
  name: string
  props: Record<string, any>
  children?: string
}

export interface ProcessedMDX {
  content: string
  components: MDXComponent[]
  toc: TableOfContentsItem[]
  metadata: Record<string, any>
}

export interface TableOfContentsItem {
  id: string
  text: string
  level: number
  children?: TableOfContentsItem[]
}

export interface MDXProcessingOptions {
  includeComponents?: boolean
  includeToc?: boolean
  includeMetadata?: boolean
}

class MDXProcessor {
  private processor = remark()
    .use(remarkMdx)
    .use(remarkGfm)

  private rehypeProcessor = rehype()
    .use(rehypeHighlight)
    .use(rehypeSlug)
    // Temporarily disabled due to type compatibility issues
    // .use(rehypeToc, {
    //   headings: ['h1', 'h2', 'h3'],
    //   cssClasses: {
    //     toc: 'toc',
    //     link: 'toc-link',
    //   },
    // })

  /**
   * Process MDX content with custom components
   */
  async processMDX(content: string, options: MDXProcessingOptions = {}): Promise<ProcessedMDX> {
    const { data: metadata, content: mdxContent } = matter(content)
    
    // Extract custom components
    const components = options.includeComponents !== false 
      ? this.extractComponents(mdxContent)
      : []

    // Generate table of contents
    const toc = options.includeToc !== false 
      ? this.generateTableOfContents(mdxContent)
      : []

    // Process MDX to HTML
    const processed = await this.processor.process(mdxContent)
    const html = await this.rehypeProcessor.process(processed)

    return {
      content: html.toString(),
      components,
      toc,
      metadata: metadata || {}
    }
  }

  /**
   * Extract custom components from MDX content
   */
  private extractComponents(content: string): MDXComponent[] {
    const components: MDXComponent[] = []
    
    // Match custom component patterns
    const componentRegex = /<(\w+)([^>]*)>([\s\S]*?)<\/\1>/g
    let match

    while ((match = componentRegex.exec(content)) !== null) {
      const [, name, propsString, children] = match
      
      // Parse props
      const props: Record<string, any> = {}
      const propsRegex = /(\w+)=["']([^"']*)["']/g
      let propMatch

      while ((propMatch = propsRegex.exec(propsString)) !== null) {
        const [, propName, propValue] = propMatch
        props[propName] = propValue
      }

      components.push({
        name,
        props,
        children: children.trim()
      })
    }

    return components
  }

  /**
   * Generate table of contents from MDX content
   */
  private generateTableOfContents(content: string): TableOfContentsItem[] {
    const lines = content.split('\n')
    const toc: TableOfContentsItem[] = []
    
    lines.forEach((line) => {
      const headingMatch = line.match(/^(#{1,6})\s+(.+)$/)
      if (headingMatch) {
        const level = headingMatch[1].length
        const text = headingMatch[2].trim()
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        
        const item: TableOfContentsItem = {
          id,
          text,
          level,
        }
        
        if (level === 1) {
          toc.push(item)
        } else if (level === 2) {
          if (toc.length > 0) {
            if (!toc[toc.length - 1].children) {
              toc[toc.length - 1].children = []
            }
            toc[toc.length - 1].children!.push(item)
          }
        } else if (level === 3) {
          if (toc.length > 0 && toc[toc.length - 1].children) {
            const lastH2 = toc[toc.length - 1].children![toc[toc.length - 1].children!.length - 1]
            if (lastH2 && !lastH2.children) {
              lastH2.children = []
            }
            if (lastH2?.children) {
              lastH2.children.push(item)
            }
          }
        }
      }
    })
    
    return toc
  }

  /**
   * Validate MDX content structure
   */
  validateMDX(content: string): { isValid: boolean; errors: string[]; warnings: string[] } {
    const errors: string[] = []
    const warnings: string[] = []

    // Check for required frontmatter
    if (!content.includes('---')) {
      errors.push('Missing frontmatter')
    }

    // Check for required fields
    const { data } = matter(content)
    if (!data.title) {
      errors.push('Missing title in frontmatter')
    }

    // Check for custom components
    const components = this.extractComponents(content)
    const validComponents = [
      'HeroBanner',
      'Callout',
      'VideoEmbed',
      'ExerciseCard',
      'ResourceList',
      'ReflectionPrompt',
      'Quiz',
      'Poll',
      'Timeline',
      'TimelineHorizontal',
      'BeforeAfterSlider',
      'CompareGrid',
      'ProgressRing',
      'BadgeGrid',
      'IconDivider'
    ]

    components.forEach(component => {
      if (!validComponents.includes(component.name)) {
        warnings.push(`Unknown component: ${component.name}`)
      }
    })

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    }
  }

  /**
   * Transform MDX components to React components
   */
  transformComponents(components: MDXComponent[]): string {
    return components.map(component => {
      const propsString = Object.entries(component.props)
        .map(([key, value]) => `${key}="${value}"`)
        .join(' ')

      return `<${component.name} ${propsString}>${component.children || ''}</${component.name}>`
    }).join('\n')
  }

  /**
   * Process workshop chapter with MDX (server-side only)
   */
  async processChapter(workshopSlug: string, chapterSlug: string): Promise<ProcessedMDX | null> {
    // Only run on server side
    if (typeof window !== 'undefined') {
      console.log('processChapter can only be called on the server side', { level: 'warn', prefix: 'mdxProcessor' })
      return null
    }

    try {
      const fs = await import('fs/promises')
      const path = await import('path')
      
      const filePath = path.join(process.cwd(), 'content', 'workshops', workshopSlug, 'chapters', `${chapterSlug}.md`)
      const content = await fs.readFile(filePath, 'utf-8')
      
      return this.processMDX(content)
    } catch (error) {
      console.log(`Error processing chapter ${chapterSlug} for workshop ${workshopSlug}:`, { level: 'error', prefix: 'mdxProcessor' }, error)
      return null
    }
  }

  /**
   * Get all available components in a workshop (server-side only)
   */
  async getWorkshopComponents(workshopSlug: string): Promise<MDXComponent[]> {
    // Only run on server side
    if (typeof window !== 'undefined') {
      console.log('getWorkshopComponents can only be called on the server side', { level: 'warn', prefix: 'mdxProcessor' })
      return []
    }

    try {
      const fs = await import('fs/promises')
      const path = await import('path')
      
      const chaptersDir = path.join(process.cwd(), 'content', 'workshops', workshopSlug, 'chapters')
      const files = await fs.readdir(chaptersDir)
      
      const allComponents: MDXComponent[] = []
      
      for (const file of files) {
        if (file.endsWith('.md')) {
          const filePath = path.join(chaptersDir, file)
          const content = await fs.readFile(filePath, 'utf-8')
          const { content: mdxContent } = matter(content)
          const components = this.extractComponents(mdxContent)
          allComponents.push(...components)
        }
      }
      
      return allComponents
    } catch (error) {
      console.log(`Error getting components for workshop ${workshopSlug}:`, { level: 'error', prefix: 'mdxProcessor' }, error)
      return []
    }
  }
}

// Export singleton instance
export const mdxProcessor = new MDXProcessor() 