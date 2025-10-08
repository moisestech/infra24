import { remark } from 'remark';
import remarkHtml from 'remark-html';
import remarkGfm from 'remark-gfm';
import { rehype } from 'rehype';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeToc from 'rehype-toc';
import matter from 'gray-matter';
// console.log not available

// Types for markdown processing
export interface WorkshopMetadata {
  title: string;
  subtitle?: string;
  slug: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration_weeks: number;
  learning_objectives: string[];
  prerequisites: string[];
  featured?: boolean;
  published?: boolean;
}

export interface ChapterMetadata {
  title: string;
  chapter_number: number;
  estimated_duration: number;
  learning_objectives: string[];
  resources: Array<{
    title: string;
    url: string;
    type: 'tool' | 'article' | 'video' | 'book';
  }>;
  assignments: Array<{
    title: string;
    description: string;
    estimated_time: number;
    type: 'analysis' | 'exercise' | 'project';
  }>;
  published?: boolean;
}

export interface ProcessedWorkshop {
  metadata: WorkshopMetadata;
  content: string; // HTML content
  content_markdown: string; // Raw markdown content
  toc: TableOfContentsItem[];
}

export interface ProcessedChapter {
  metadata: ChapterMetadata;
  content: string;
  toc: TableOfContentsItem[];
  resources: Resource[];
  assignments: Assignment[];
}

export interface TableOfContentsItem {
  id: string;
  text: string;
  level: number;
  children?: TableOfContentsItem[];
}

export interface Resource {
  title: string;
  url: string;
  type: 'tool' | 'article' | 'video' | 'book';
  description?: string;
}

export interface Assignment {
  title: string;
  description: string;
  estimated_time: number;
  type: 'analysis' | 'exercise' | 'project';
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

class MarkdownService {
  private processor = remark()
    .use(remarkGfm)
    .use(remarkHtml);

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
    // });

  /**
   * Parse frontmatter from markdown content
   */
  parseFrontmatter<T = any>(content: string): T {
    const { data } = matter(content);
    return data as T;
  }

  /**
   * Extract markdown content without frontmatter
   */
  extractContent(content: string): string {
    const { content: markdownContent } = matter(content);
    return markdownContent;
  }

  /**
   * Render markdown to HTML
   */
  async renderMarkdown(content: string): Promise<string> {
    const processed = await this.processor.process(content);
    const html = processed.toString();
    
    // Process with rehype for additional features
    const rehypeResult = await this.rehypeProcessor.process(html);
    return rehypeResult.toString();
  }

  /**
   * Generate table of contents from markdown content
   */
  generateTableOfContents(content: string): TableOfContentsItem[] {
    const lines = content.split('\n');
    const toc: TableOfContentsItem[] = [];
    
    lines.forEach((line, index) => {
      const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
      if (headingMatch) {
        const level = headingMatch[1].length;
        const text = headingMatch[2].trim();
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        
        const item: TableOfContentsItem = {
          id,
          text,
          level,
        };
        
        if (level === 1) {
          toc.push(item);
        } else if (level === 2) {
          if (toc.length > 0) {
            if (!toc[toc.length - 1].children) {
              toc[toc.length - 1].children = [];
            }
            toc[toc.length - 1].children!.push(item);
          }
        } else if (level === 3) {
          if (toc.length > 0 && toc[toc.length - 1].children) {
            const lastH2 = toc[toc.length - 1].children![toc[toc.length - 1].children!.length - 1];
            if (lastH2 && !lastH2.children) {
              lastH2.children = [];
            }
            if (lastH2?.children) {
              lastH2.children.push(item);
            }
          }
        }
      }
    });
    
    return toc;
  }

  /**
   * Extract resources from markdown content
   */
  extractResources(content: string): Resource[] {
    const resources: Resource[] = [];
    const lines = content.split('\n');
    
    let inResourcesSection = false;
    
    lines.forEach(line => {
      if (line.toLowerCase().includes('## resources') || line.toLowerCase().includes('### resources')) {
        inResourcesSection = true;
        return;
      }
      
      if (inResourcesSection && line.startsWith('##')) {
        inResourcesSection = false;
        return;
      }
      
      if (inResourcesSection) {
        const linkMatch = line.match(/\[([^\]]+)\]\(([^)]+)\)/);
        if (linkMatch) {
          const title = linkMatch[1];
          const url = linkMatch[2];
          const type = this.determineResourceType(url);
          
          resources.push({
            title,
            url,
            type,
          });
        }
      }
    });
    
    return resources;
  }

  /**
   * Extract assignments from markdown content
   */
  extractAssignments(content: string): Assignment[] {
    const assignments: Assignment[] = [];
    const lines = content.split('\n');
    
    let inAssignmentsSection = false;
    let currentAssignment: Partial<Assignment> = {};
    
    lines.forEach(line => {
      if (line.toLowerCase().includes('## assignments') || line.toLowerCase().includes('### assignments')) {
        inAssignmentsSection = true;
        return;
      }
      
      if (inAssignmentsSection && line.startsWith('##')) {
        inAssignmentsSection = false;
        if (currentAssignment.title) {
          assignments.push(currentAssignment as Assignment);
        }
        return;
      }
      
      if (inAssignmentsSection) {
        if (line.startsWith('### ')) {
          if (currentAssignment.title) {
            assignments.push(currentAssignment as Assignment);
          }
          currentAssignment = {
            title: line.replace('### ', '').trim(),
            type: 'exercise',
            estimated_time: 30,
          };
        } else if (line.trim() && currentAssignment.title && !currentAssignment.description) {
          currentAssignment.description = line.trim();
        }
      }
    });
    
    if (currentAssignment.title) {
      assignments.push(currentAssignment as Assignment);
    }
    
    return assignments;
  }

  /**
   * Determine resource type from URL
   */
  private determineResourceType(url: string): 'tool' | 'article' | 'video' | 'book' {
    if (url.includes('youtube.com') || url.includes('vimeo.com')) {
      return 'video';
    }
    if (url.includes('github.com') || url.includes('tool')) {
      return 'tool';
    }
    if (url.includes('amazon.com') || url.includes('book')) {
      return 'book';
    }
    return 'article';
  }

  /**
   * Process workshop markdown file
   */
  async processWorkshop(content: string): Promise<ProcessedWorkshop> {
    const metadata = this.parseFrontmatter<WorkshopMetadata>(content);
    const markdownContent = this.extractContent(content);
    const html = await this.renderMarkdown(markdownContent);
    const toc = this.generateTableOfContents(markdownContent);
    
    return {
      metadata,
      content: html,
      content_markdown: markdownContent,
      toc,
    };
  }

  /**
   * Process chapter markdown file
   */
  async processChapter(content: string): Promise<ProcessedChapter> {
    const metadata = this.parseFrontmatter<ChapterMetadata>(content);
    const markdownContent = this.extractContent(content);
    const html = await this.renderMarkdown(markdownContent);
    const toc = this.generateTableOfContents(markdownContent);
    const resources = this.extractResources(markdownContent);
    const assignments = this.extractAssignments(markdownContent);
    
    return {
      metadata,
      content: html,
      toc,
      resources,
      assignments,
    };
  }

  /**
   * Read and process workshop file from filesystem (server-side only)
   */
  async readWorkshop(workshopSlug: string): Promise<ProcessedWorkshop> {
    if (typeof window !== 'undefined') {
      console.log('readWorkshop can only be called on the server side', { level: 'error', prefix: 'markdownService' });
      throw new Error('readWorkshop can only be called on the server side');
    }

    const fs = await import('fs/promises');
    const path = await import('path');
    
    const filePath = path.join(process.cwd(), 'content', 'workshops', workshopSlug, 'syllabus.md');
    const content = await fs.readFile(filePath, 'utf-8');
    return this.processWorkshop(content);
  }

  /**
   * Read and process chapter file from filesystem (server-side only)
   */
  async readChapter(workshopSlug: string, chapterSlug: string): Promise<ProcessedChapter> {
    if (typeof window !== 'undefined') {
      console.log('readChapter can only be called on the server side', { level: 'error', prefix: 'markdownService' });
      throw new Error('readChapter can only be called on the server side');
    }

    const fs = await import('fs/promises');
    const path = await import('path');
    
    const filePath = path.join(process.cwd(), 'content', 'workshops', workshopSlug, 'chapters', `${chapterSlug}.md`);
    const content = await fs.readFile(filePath, 'utf-8');
    return this.processChapter(content);
  }

  /**
   * Validate workshop content
   */
  validateWorkshop(content: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    try {
      const metadata = this.parseFrontmatter<WorkshopMetadata>(content);
      
      // Required fields
      if (!metadata.title) errors.push('Missing title');
      if (!metadata.slug) errors.push('Missing slug');
      if (!metadata.category) errors.push('Missing category');
      if (!metadata.learning_objectives || metadata.learning_objectives.length === 0) {
        errors.push('Missing learning objectives');
      }
      
      // Validation rules
      if (metadata.duration_weeks < 1 || metadata.duration_weeks > 12) {
        warnings.push('Duration should be between 1-12 weeks');
      }
      
      if (!['beginner', 'intermediate', 'advanced'].includes(metadata.difficulty)) {
        errors.push('Invalid difficulty level');
      }
      
    } catch (error) {
      errors.push('Invalid frontmatter format');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Validate chapter content
   */
  validateChapter(content: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    try {
      const metadata = this.parseFrontmatter<ChapterMetadata>(content);
      
      // Required fields
      if (!metadata.title) errors.push('Missing title');
      if (!metadata.chapter_number) errors.push('Missing chapter number');
      if (!metadata.learning_objectives || metadata.learning_objectives.length === 0) {
        errors.push('Missing learning objectives');
      }
      
      // Validation rules
      if (metadata.chapter_number < 1) {
        errors.push('Chapter number must be positive');
      }
      
      if (metadata.estimated_duration < 5 || metadata.estimated_duration > 180) {
        warnings.push('Estimated duration should be between 5-180 minutes');
      }
      
    } catch (error) {
      errors.push('Invalid frontmatter format');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Get all workshop slugs from filesystem (server-side only)
   */
  async getWorkshopSlugs(): Promise<string[]> {
    if (typeof window !== 'undefined') {
      console.log('getWorkshopSlugs can only be called on the server side', { level: 'error', prefix: 'markdownService' });
      throw new Error('getWorkshopSlugs can only be called on the server side');
    }

    const fs = await import('fs/promises');
    const path = await import('path');
    
    const workshopsDir = path.join(process.cwd(), 'content', 'workshops');
    try {
      const entries = await fs.readdir(workshopsDir, { withFileTypes: true });
      return entries
        .filter(entry => entry.isDirectory())
        .map(entry => entry.name);
    } catch (error) {
      console.log('Workshops directory not found', { level: 'warn', prefix: 'markdownService' }, error);
      return [];
    }
  }

  /**
   * Get all chapter slugs for a workshop (server-side only)
   */
  async getChapterSlugs(workshopSlug: string): Promise<string[]> {
    if (typeof window !== 'undefined') {
      console.log('getChapterSlugs can only be called on the server side', { level: 'error', prefix: 'markdownService' });
      throw new Error('getChapterSlugs can only be called on the server side');
    }

    const fs = await import('fs/promises');
    const path = await import('path');
    
    const chaptersDir = path.join(process.cwd(), 'content', 'workshops', workshopSlug, 'chapters');
    try {
      const entries = await fs.readdir(chaptersDir, { withFileTypes: true });
      return entries
        .filter(entry => entry.isFile() && entry.name.endsWith('.md'))
        .map(entry => entry.name.replace('.md', ''));
    } catch (error) {
      console.log(`Chapters directory not found for ${workshopSlug}:`, { level: 'warn', prefix: 'markdownService' }, error);
      return [];
    }
  }
}

// Export singleton instance
export const markdownService = new MarkdownService();
export default markdownService; 