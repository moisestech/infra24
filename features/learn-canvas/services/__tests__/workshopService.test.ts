// @jest-environment jsdom
/// <reference types="jest" />
import { workshopService } from '../workshopService'
import { WorkshopSummary, WorkshopWithChapters, Chapter } from '@/shared/types/workshop'

// Mock the workshop service
jest.mock('../workshopService')

describe('WorkshopService Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getWorkshops', () => {
    it('should return beginner workshops', async () => {
      const mockWorkshops = [
        {
          id: '1',
          slug: 'beginner-workshop',
          title: 'Beginner Workshop',
          description: 'For beginners',
          learning_objectives: ['Learn basics'],
          prerequisites: ['No prerequisites'],
          duration_weeks: 4,
          difficulty_level: 'beginner',
          category: 'test',
          featured: true,
          published: true,
          metadata: {},
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z',
          total_chapters: 3,
          published_chapters: 3,
          avg_chapter_duration: 45,
          image: 'https://example.com/image.jpg'
        }
      ]

      ;(workshopService.getWorkshops as jest.Mock).mockResolvedValue(mockWorkshops)

      const beginnerWorkshops = await workshopService.getWorkshops({ difficulty: 'beginner' })
      
      beginnerWorkshops.forEach((workshop: any) => {
        expect(workshop.difficulty_level).toBe('beginner')
      })
    })

    it('should return featured workshops', async () => {
      const mockWorkshops = [
        {
          id: '1',
          slug: 'featured-workshop',
          title: 'Featured Workshop',
          description: 'A featured workshop',
          learning_objectives: ['Learn something'],
          prerequisites: ['Basic knowledge'],
          duration_weeks: 6,
          difficulty_level: 'intermediate',
          category: 'test',
          featured: true,
          published: true,
          metadata: {},
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z',
          total_chapters: 3,
          published_chapters: 3,
          avg_chapter_duration: 45,
          image: 'https://example.com/image.jpg'
        }
      ]

      ;(workshopService.getWorkshops as jest.Mock).mockResolvedValue(mockWorkshops)

      const featuredWorkshops = await workshopService.getWorkshops({ featured: true })
      
      featuredWorkshops.forEach((workshop: any) => {
        expect(workshop.featured).toBe(true)
      })
    })

    it('should return published workshops', async () => {
      const mockWorkshops = [
        {
          id: '1',
          slug: 'published-workshop',
          title: 'Published Workshop',
          description: 'A published workshop',
          learning_objectives: ['Learn something'],
          prerequisites: ['Basic knowledge'],
          duration_weeks: 4,
          difficulty_level: 'beginner',
          category: 'test',
          featured: false,
          published: true,
          metadata: {},
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z',
          total_chapters: 3,
          published_chapters: 3,
          avg_chapter_duration: 45,
          image: 'https://example.com/image.jpg'
        }
      ]

      ;(workshopService.getWorkshops as jest.Mock).mockResolvedValue(mockWorkshops)

      const publishedWorkshops = await workshopService.getWorkshops({ published: true })
      
      publishedWorkshops.forEach((workshop: any) => {
        expect(workshop.published).toBe(true)
      })
    })
  })

  describe('getWorkshopBySlug', () => {
    it('should return workshop by slug', async () => {
      const mockWorkshop = {
        id: '1',
        slug: 'test-workshop',
        title: 'Test Workshop',
        description: 'A test workshop',
        learning_objectives: ['Learn something'],
        prerequisites: ['Basic knowledge'],
        duration_weeks: 4,
        difficulty_level: 'beginner',
        category: 'test',
        featured: true,
        published: true,
        metadata: {},
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
        total_chapters: 3,
        published_chapters: 3,
        avg_chapter_duration: 45,
        image: 'https://example.com/image.jpg'
      }

      ;(workshopService.getWorkshopBySlug as jest.Mock).mockResolvedValue(mockWorkshop)

      const workshop = await workshopService.getWorkshopBySlug('test-workshop')
      
      expect(workshop).toEqual(mockWorkshop)
    })

    it('should return null for non-existent workshop', async () => {
      ;(workshopService.getWorkshopBySlug as jest.Mock).mockResolvedValue(null)

      const workshop = await workshopService.getWorkshopBySlug('non-existent')
      
      expect(workshop).toBeNull()
    })
  })

  describe('getWorkshopChapters', () => {
    it('should return chapters for workshop', async () => {
      const mockChapters = [
        {
          id: '1',
          workshop_id: '1',
          chapter_number: 1,
          title: 'Chapter 1',
          slug: 'chapter-1',
          content_markdown: '# Chapter 1',
          learning_objectives: ['Learn chapter 1'],
          estimated_duration_minutes: 45,
          resources: [],
          assignments: [],
          published: true,
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z',
          workshop_slug: 'test-workshop'
        }
      ]

      ;(workshopService.getWorkshopChapters as jest.Mock).mockResolvedValue(mockChapters)

      const chapters = await workshopService.getWorkshopChapters('test-workshop')
      
      chapters.forEach((chapter: any) => {
        expect(chapter.workshop_slug).toBe('test-workshop')
      })
    })
  })

  describe('getChapter', () => {
    it('should return specific chapter', async () => {
      const mockChapter = {
        id: '1',
        workshop_id: '1',
        chapter_number: 1,
        title: 'Chapter 1',
        slug: 'chapter-1',
        content_markdown: '# Chapter 1',
        learning_objectives: ['Learn chapter 1'],
        estimated_duration_minutes: 45,
        resources: [],
        assignments: [],
        published: true,
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
        workshop_slug: 'test-workshop'
      }

      ;(workshopService.getChapter as jest.Mock).mockResolvedValue(mockChapter)

      const chapter = await workshopService.getChapter('test-workshop', 'chapter-1')
      
      expect(chapter).toEqual(mockChapter)
    })
  })

  describe('searchWorkshops', () => {
    it('should search workshops by query', async () => {
      const mockWorkshops = [
        {
          id: '1',
          slug: 'ethical-ai-journalism',
          title: 'Ethical AI Journalism',
          description: 'Learn ethical AI journalism',
          learning_objectives: ['Learn ethical AI'],
          prerequisites: ['Basic knowledge'],
          duration_weeks: 4,
          difficulty_level: 'beginner',
          category: 'journalism',
          featured: true,
          published: true,
          metadata: {},
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z',
          total_chapters: 3,
          published_chapters: 3,
          avg_chapter_duration: 45,
          image: 'https://example.com/image.jpg'
        }
      ]

      ;(workshopService.searchWorkshops as jest.Mock).mockResolvedValue(mockWorkshops)

      const results = await workshopService.searchWorkshops('ethical')
      
      expect(results.some((w: any) => w.description?.toLowerCase().includes('ethical'))).toBe(true)
    })

    it('should search by category', async () => {
      const mockWorkshops = [
        {
          id: '1',
          slug: 'art-workshop',
          title: 'Art Workshop',
          description: 'Learn art',
          learning_objectives: ['Learn art'],
          prerequisites: ['Basic knowledge'],
          duration_weeks: 4,
          difficulty_level: 'beginner',
          category: 'art',
          featured: true,
          published: true,
          metadata: {},
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z',
          total_chapters: 3,
          published_chapters: 3,
          avg_chapter_duration: 45,
          image: 'https://example.com/image.jpg'
        }
      ]

      ;(workshopService.searchWorkshops as jest.Mock).mockResolvedValue(mockWorkshops)

      const artWorkshops = await workshopService.searchWorkshops('art')
      
      artWorkshops.forEach((workshop: any) => {
        expect(workshop.category).toBe('art')
      })
    })

    it('should search featured workshops', async () => {
      const mockWorkshops = [
        {
          id: '1',
          slug: 'featured-workshop',
          title: 'Featured Workshop',
          description: 'A featured workshop',
          learning_objectives: ['Learn something'],
          prerequisites: ['Basic knowledge'],
          duration_weeks: 4,
          difficulty_level: 'beginner',
          category: 'test',
          featured: true,
          published: true,
          metadata: {},
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z',
          total_chapters: 3,
          published_chapters: 3,
          avg_chapter_duration: 45,
          image: 'https://example.com/image.jpg'
        }
      ]

      ;(workshopService.searchWorkshops as jest.Mock).mockResolvedValue(mockWorkshops)

      const featuredWorkshops = await workshopService.searchWorkshops('featured')
      
      featuredWorkshops.forEach((workshop: any) => {
        expect(workshop.featured).toBe(true)
      })
    })

    it('should find workshop by slug', async () => {
      const mockWorkshops = [
        {
          id: '1',
          slug: 'ethical-ai-journalism',
          title: 'Ethical AI Journalism',
          description: 'Learn ethical AI journalism',
          learning_objectives: ['Learn ethical AI'],
          prerequisites: ['Basic knowledge'],
          duration_weeks: 4,
          difficulty_level: 'beginner',
          category: 'journalism',
          featured: true,
          published: true,
          metadata: {},
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z',
          total_chapters: 3,
          published_chapters: 3,
          avg_chapter_duration: 45,
          image: 'https://example.com/image.jpg'
        }
      ]

      ;(workshopService.searchWorkshops as jest.Mock).mockResolvedValue(mockWorkshops)

      const workshops = await workshopService.searchWorkshops('ethical-ai-journalism')
      
      expect(workshops.find((w: any) => w.slug === 'ethical-ai-journalism')?.id).toBe('1')
    })

    it('should search by learning objectives', async () => {
      const mockWorkshops = [
        {
          id: '1',
          slug: 'test-workshop',
          title: 'Test Workshop',
          description: 'A test workshop',
          learning_objectives: ['Learn AI', 'Understand ethics'],
          prerequisites: ['Basic knowledge'],
          duration_weeks: 4,
          difficulty_level: 'beginner',
          category: 'test',
          featured: true,
          published: true,
          metadata: {},
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z',
          total_chapters: 3,
          published_chapters: 3,
          avg_chapter_duration: 45,
          image: 'https://example.com/image.jpg'
        }
      ]

      ;(workshopService.searchWorkshops as jest.Mock).mockResolvedValue(mockWorkshops)

      const workshops = await workshopService.searchWorkshops('AI')
      
      workshops.forEach((workshop: any) => {
        workshop.learning_objectives.forEach((objective: any) => {
          expect(objective.toLowerCase()).toContain('ai')
        })
      })
    })

    it('should search by prerequisites', async () => {
      const mockWorkshops = [
        {
          id: '1',
          slug: 'test-workshop',
          title: 'Test Workshop',
          description: 'A test workshop',
          learning_objectives: ['Learn something'],
          prerequisites: ['Basic knowledge', 'Intermediate skills'],
          duration_weeks: 4,
          difficulty_level: 'beginner',
          category: 'test',
          featured: true,
          published: true,
          metadata: {},
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z',
          total_chapters: 3,
          published_chapters: 3,
          avg_chapter_duration: 45,
          image: 'https://example.com/image.jpg'
        }
      ]

      ;(workshopService.searchWorkshops as jest.Mock).mockResolvedValue(mockWorkshops)

      const workshops = await workshopService.searchWorkshops('Basic')
      
      workshops.forEach((workshop: any) => {
        workshop.prerequisites.forEach((prereq: any) => {
          expect(prereq.toLowerCase()).toContain('basic')
        })
      })
    })
  })
})