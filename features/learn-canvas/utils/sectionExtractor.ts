import { visit } from 'unist-util-visit'
import { Node } from 'unist'

export interface Section {
  id: string
  title: string
  level: number
  element: 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  children?: Section[]
}

export interface ChapterSections {
  chapters: Section[]
  currentChapterSections: Section[]
}

/**
 * Extract sections (H2, H3, etc.) from MDX content
 */
export function extractSectionsFromMDX(mdxSource: any): Section[] {
  const sections: Section[] = []
  
  if (!mdxSource?.compiledSource) {
    return sections
  }

  try {
    // The compiledSource is a string that contains the MDX component code
    // We need to extract headings from the JSX structure
    const source = mdxSource.compiledSource
    
    // Multiple regex patterns to catch different JSX structures
    const patterns = [
      // Pattern 1: Simple string children
      /_jsx\(_components\.(h[2-6]),\s*\{[^}]*children:\s*["']([^"']+)["']/g,
      // Pattern 2: Children as second parameter
      /_jsx\(_components\.(h[2-6]),\s*\{[^}]*\}\s*,\s*["']([^"']+)["']/g,
      // Pattern 3: Children with escaped quotes
      /_jsx\(_components\.(h[2-6]),\s*\{[^}]*children:\s*\\"([^\\"]+)\\"/g,
      // Pattern 4: More complex JSX structure
      /_jsx\(_components\.(h[2-6]),\s*\{[^}]*\}\s*,\s*\\"([^\\"]+)\\"/g,
      // Pattern 5: Template literal children
      /_jsx\(_components\.(h[2-6]),\s*\{[^}]*children:\s*`([^`]+)`/g
    ]
    
    for (const pattern of patterns) {
      let match
      while ((match = pattern.exec(source)) !== null) {
        const level = parseInt(match[1].charAt(1))
        const title = match[2].replace(/\\"/g, '"').replace(/\\n/g, ' ').trim()
        const id = generateIdFromTitle(title)
        
        // Avoid duplicates and empty titles
        if (title && !sections.find(s => s.id === id)) {
          sections.push({
            id,
            title,
            level,
            element: match[1] as 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
          })
        }
      }
    }
    
    // Sort sections by their position in the document
    sections.sort((a, b) => {
      const aIndex = source.indexOf(a.title)
      const bIndex = source.indexOf(b.title)
      return aIndex - bIndex
    })
    
  } catch (error) {
    console.warn('Failed to extract sections from MDX:', error)
  }

  return sections
}

/**
 * Extract text content from a node (handles nested elements)
 */
function extractTextFromNode(node: any): string {
  if (node.type === 'text') {
    return node.value || ''
  }
  
  if (node.children) {
    return node.children.map((child: any) => extractTextFromNode(child)).join('')
  }
  
  return ''
}

/**
 * Generate a URL-friendly ID from a title
 */
function generateIdFromTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
}

/**
 * Organize sections into a hierarchical structure
 */
export function organizeSectionsHierarchically(sections: Section[]): Section[] {
  const result: Section[] = []
  const stack: Section[] = []

  for (const section of sections) {
    // Pop from stack until we find a parent or empty stack
    while (stack.length > 0 && stack[stack.length - 1].level >= section.level) {
      stack.pop()
    }

    if (stack.length === 0) {
      // Top-level section
      result.push(section)
    } else {
      // Child section
      const parent = stack[stack.length - 1]
      if (!parent.children) {
        parent.children = []
      }
      parent.children.push(section)
    }

    stack.push(section)
  }

  return result
}

/**
 * Extract sections from raw markdown content (fallback method)
 */
export function extractSectionsFromMarkdown(content: string): Section[] {
  const sections: Section[] = []
  const lines = content.split('\n')

  for (const line of lines) {
    const match = line.match(/^(#{2,6})\s+(.+)$/)
    if (match) {
      const level = match[1].length
      const title = match[2].trim()
      const id = generateIdFromTitle(title)
      
      sections.push({
        id,
        title,
        level,
        element: `h${level}` as 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
      })
    }
  }

  return sections
}

/**
 * Extract sections from DOM (client-side fallback)
 */
export function extractSectionsFromDOM(): Section[] {
  if (typeof window === 'undefined') {
    return []
  }

  const sections: Section[] = []
  const headings = document.querySelectorAll('h2, h3, h4, h5, h6')

  headings.forEach((heading) => {
    const level = parseInt(heading.tagName.charAt(1))
    const title = heading.textContent?.trim() || ''
    const id = heading.id || generateIdFromTitle(title)
    
    if (title) {
      sections.push({
        id,
        title,
        level,
        element: heading.tagName.toLowerCase() as 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
      })
    }
  })

  return sections
}
