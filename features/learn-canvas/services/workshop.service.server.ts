import { Workshop, WorkshopLevel } from '@/types/workshop'
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

interface WorkshopFilters {
  category?: string
  difficulty?: string
  featured?: boolean
  published?: boolean
}

class WorkshopService {
  private static instance: WorkshopService

  private constructor() {}

  static getInstance(): WorkshopService {
    if (!WorkshopService.instance) {
      WorkshopService.instance = new WorkshopService()
    }
    return WorkshopService.instance
  }

  /**
   * Load workshop data from syllabus.md file
   */
  private async loadWorkshopFromSyllabus(workshopSlug: string): Promise<Workshop | null> {
    try {
      const syllabusPath = path.join(process.cwd(), 'content', 'workshops', workshopSlug, 'syllabus.md');
      const content = await fs.readFile(syllabusPath, 'utf-8');
      const { data } = matter(content);
      
      return {
        id: workshopSlug,
        organization_id: 'default',
        title: data.title || 'Untitled Workshop',
        description: data.description || '',
        content: data.content || '',
        category: data.category || 'media',
        type: 'workshop' as const,
        level: (data.difficulty || 'beginner') as WorkshopLevel,
        status: 'published' as const,
        duration_minutes: (data.duration_hours || 3) * 60, // Convert hours to minutes
        max_participants: data.max_participants || 20,
        price: data.price || 0,
        instructor: data.instructor || '',
        prerequisites: data.prerequisites || [],
        materials: data.materials || [],
        outcomes: data.learning_objectives || [],
        is_active: true,
        is_public: true,
        is_shared: false,
        featured: data.featured || false,
        image_url: data.image_url || '',
        metadata: data.metadata || {},
        created_by: 'system',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    } catch (error) {
      console.error(`Error loading workshop from syllabus: ${workshopSlug}`, error);
      return null;
    }
  }

  /**
   * Get all workshops with optional filtering
   */
  async getWorkshops(filters?: WorkshopFilters): Promise<Workshop[]> {
    // Load AI video production workshop from syllabus file
    const aiVideoWorkshop = await this.loadWorkshopFromSyllabus('ai-video-production');
    
    // In a real implementation, this would fetch from Supabase
    // For now, return mock data with all 18 workshops
    const allWorkshops: Workshop[] = [
      {
        id: "ai-filmmaking",
        organization_id: "default",
        title: "AI Filmmaking Fundamentals",
        description: "Learn how to use AI tools to create incredible films.",
        content: "",
        category: "film",
        type: "workshop",
        level: "beginner",
        status: "published",
        duration_minutes: 360,
        max_participants: 20,
        price: 0,
        instructor: "",
        prerequisites: [],
        materials: [],
        outcomes: [],
        is_active: true,
        is_public: true,
        is_shared: false,
        featured: true,
        image_url: "",
        metadata: {},
        created_by: "system",
        created_at: "2025-01-01T00:00:00Z",
        updated_at: "2025-01-01T00:00:00Z"
      },
      {
        id: "advanced-ai-filmmaking",
        organization_id: "default",
        title: "Advanced AI Filmmaking",
        description: "Advanced AI filmmaking techniques.",
        content: "",
        category: "film",
        type: "workshop",
        level: "advanced",
        status: "published",
        duration_minutes: 480,
        max_participants: 15,
        price: 0,
        instructor: "",
        prerequisites: [],
        materials: [],
        outcomes: [],
        is_active: true,
        is_public: true,
        is_shared: false,
        featured: true,
        image_url: "",
        metadata: {},
        created_by: "system",
        created_at: "2025-01-01T00:00:00Z",
        updated_at: "2025-01-01T00:00:00Z"
      }
    ]
    // Apply filters if provided
    if (!filters) {
      return allWorkshops
    }

    return allWorkshops.filter(workshop => {
      if (filters.category && workshop.category !== filters.category) return false
      if (filters.difficulty && workshop.level !== filters.difficulty) return false
      if (filters.featured !== undefined && workshop.featured !== filters.featured) return false
      if (filters.published !== undefined && (workshop.status === 'published') !== filters.published) return false
      return true
    })
  }

  /**
   * Get a specific workshop by slug or ID
   */
  async getWorkshop(slugOrId: string): Promise<Workshop & { chapters: any[] } | null> {
    const workshops = await this.getWorkshops()
    const workshop = workshops.find(w => w.id === slugOrId)
    
    if (!workshop) return null

    // Return the workshop with chapters
    return {
      ...workshop,
      chapters: await this.getanys(workshop.id)
    }
  }

  /**
   * Get chapters for a specific workshop
   */
  async getanys(workshopIdOrSlug: string, language: string = 'en'): Promise<any[]> {
    // Try to read chapters from the filesystem
    try {
      const chaptersDir = path.join(process.cwd(), 'content', 'workshops', workshopIdOrSlug, 'chapters');
      console.log(`[getanys] Looking for chapters in: ${chaptersDir}`);
      const files = await fs.readdir(chaptersDir);
      console.log(`[getanys] Found files:`, files);
      const chapters: any[] = [];
      for (const file of files) {
        if (!file.endsWith('.md') && !file.endsWith('.mdx')) continue;
        
        // Determine which language file to load
        let targetFile = file;
        if (language === 'es') {
          // For Spanish, look for -es.md files
          const spanishFile = file.replace(/\.(md|mdx)$/, '-es.$1');
          if (files.includes(spanishFile)) {
            targetFile = spanishFile;
          }
        } else {
          // For English, skip Spanish versions
          if (file.includes('-es.md') || file.includes('-es.mdx')) continue;
        }
        const filePath = path.join(chaptersDir, targetFile);
        const raw = await fs.readFile(filePath, 'utf8');
        const { data, content } = matter(raw);
        const chapterObj = {
          id: file,
          workshop_id: workshopIdOrSlug,
          chapter_number: data.chapter_number || parseInt(file.match(/^(\d+)/)?.[1] || '0', 10),
          title: data.title || file.replace(/\.(md|mdx)$/, ''),
          slug: file.replace(/\.(md|mdx)$/, ''),
          content_markdown: content,
          learning_objectives: data.learning_objectives || [],
          estimated_duration_minutes: data.estimated_duration || 60,
          resources: data.resources || [],
          assignments: data.assignments || [],
          published: data.published !== false,
          created_at: data.created_at || null,
          updated_at: data.updated_at || null
        };
        console.log(`[getanys] Parsed chapter:`, chapterObj);
        chapters.push(chapterObj);
      }
      // Sort by chapter_number
      chapters.sort((a, b) => (a.chapter_number || 0) - (b.chapter_number || 0));
      console.log(`[getanys] Returning chapters:`, chapters.map(c => c.title));
      return chapters;
    } catch (err) {
      console.error(`[getanys] Error reading chapters for ${workshopIdOrSlug}:`, err);
      // Fallback: return empty array if directory or files are missing
      return [];
    }
  }

  /**
   * Get a specific chapter by workshop ID and chapter slug
   */
  async getany(workshopId: string, chapterSlug: string, language: string = 'en'): Promise<any | null> {
    const chapters = await this.getanys(workshopId, language)
    return chapters.find(c => c.slug === chapterSlug) || null
  }

  /**
   * Get processed chapter content with MDX processing
   */
  async getProcessedany(workshopId: string, chapterSlug: string, language: string = 'en'): Promise<any | null> {
    const chapter = await this.getany(workshopId, chapterSlug, language)
    if (!chapter) return null

    // Import MDX processor dynamically to avoid SSR issues
    try {
      const { mdxProcessor } = await import('./mdxProcessor')
      const processed = await mdxProcessor.processChapter(workshopId, chapterSlug)
      
      if (processed) {
        return {
          ...chapter,
          content_markdown: processed.content,
          metadata: processed.metadata,
          components: processed.components,
          toc: processed.toc
        }
      }
    } catch (error) {
      console.error('Error processing MDX:', error)
    }

    // Fallback to original content if MDX processing fails
    return chapter
  }

  /**
   * Get workshop progress for a user
   */
  async getWorkshopProgress(userId: string, workshopId: string): Promise<any[]> {
    // Mock progress data
    return [
      {
        id: '1',
        user_id: userId,
        workshop_id: workshopId,
        chapter_id: '1',
        status: 'completed',
        completed_at: '2025-01-15T00:00:00Z',
        time_spent_minutes: 45,
        metadata: {},
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-15T00:00:00Z'
      },
      {
        id: '2',
        user_id: userId,
        workshop_id: workshopId,
        chapter_id: '2',
        status: 'in_progress',
        completed_at: undefined,
        time_spent_minutes: 20,
        metadata: {},
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-15T00:00:00Z'
      }
    ]
  }

  /**
   * Update chapter progress for a user
   */
  async updateanyProgress(
    userId: string,
    chapterId: string,
    status: 'not_started' | 'in_progress' | 'completed',
    timeSpent?: number
  ): Promise<void> {
    // In a real implementation, this would update Supabase
    console.log(`Updating progress for user ${userId}, chapter ${chapterId}: ${status}`)
  }

  /**
   * Search workshops by query
   */
  async searchWorkshops(query: string): Promise<Workshop[]> {
    const workshops = await this.getWorkshops()
    const lowercaseQuery = query.toLowerCase()
    
    return workshops.filter(workshop => 
      (workshop.title.toLowerCase().includes(lowercaseQuery)) ||
      ((workshop.description || '').toLowerCase().includes(lowercaseQuery))
    )
  }

  /**
   * Get workshops by category
   */
  async getWorkshopsByCategory(category: string): Promise<Workshop[]> {
    return this.getWorkshops({ category })
  }

  /**
   * Get featured workshops
   */
  async getFeaturedWorkshops(): Promise<Workshop[]> {
    return this.getWorkshops({ featured: true })
  }
}

// Export singleton instance
export const workshopService = WorkshopService.getInstance()
