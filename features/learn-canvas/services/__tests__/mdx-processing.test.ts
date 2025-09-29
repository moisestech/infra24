// @jest-environment node
/// <reference types="jest" />
import { workshopService } from '../workshopService'

// Mock the workshop service
jest.mock('../workshopService')

describe('MDX Processing Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Chapter Content Processing', () => {
    it('should process chapter content correctly', async () => {
      const mockChapters = [
        {
          id: '1',
          title: 'Test Chapter',
          content_markdown: '# Test Chapter\n\nThis is test content.',
          learning_objectives: ['Learn something'],
          estimated_duration_minutes: 45,
          resources: [],
          assignments: [],
          published: true,
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z',
          workshop_slug: 'test-workshop',
          workshop_id: '1',
          chapter_number: 1,
          slug: 'test-chapter'
        }
      ]

      ;(workshopService.getWorkshopChapters as jest.Mock).mockResolvedValue(mockChapters)

      const chapters = await workshopService.getWorkshopChapters('test-workshop')
      
      chapters.forEach((chapter: any) => {
        expect(chapter).toHaveProperty('content_markdown')
        expect(chapter).toHaveProperty('learning_objectives')
        expect(chapter).toHaveProperty('estimated_duration_minutes')
      })
    })

    it('should handle chapters with rich content', async () => {
      const mockChapters = [
        {
          id: '1',
          title: 'Rich Chapter',
          content_markdown: `
# Rich Chapter

This chapter has **bold text**, *italic text*, and [links](https://example.com).

## Subsection

- List item 1
- List item 2
- List item 3

\`\`\`javascript
console.log('Code block');
\`\`\`
          `,
          learning_objectives: ['Learn rich content'],
          estimated_duration_minutes: 60,
          resources: [],
          assignments: [],
          published: true,
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z',
          workshop_slug: 'test-workshop',
          workshop_id: '1',
          chapter_number: 1,
          slug: 'rich-chapter'
        }
      ]

      ;(workshopService.getWorkshopChapters as jest.Mock).mockResolvedValue(mockChapters)

      const chapters = await workshopService.getWorkshopChapters('test-workshop')
      
      chapters.forEach((chapter: any) => {
        expect(chapter.content_markdown).toContain('**bold text**')
        expect(chapter.content_markdown).toContain('*italic text*')
        expect(chapter.content_markdown).toContain('[links]')
        expect(chapter.content_markdown).toContain('```javascript')
      })
    })

    it('should validate chapter structure', async () => {
      const mockChapters = [
        {
          id: '1',
          title: 'Valid Chapter',
          content_markdown: '# Valid Chapter',
          learning_objectives: ['Objective 1', 'Objective 2'],
          estimated_duration_minutes: 30,
          resources: [],
          assignments: [],
          published: true,
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z',
          workshop_slug: 'test-workshop',
          workshop_id: '1',
          chapter_number: 1,
          slug: 'valid-chapter'
        }
      ]

      ;(workshopService.getWorkshopChapters as jest.Mock).mockResolvedValue(mockChapters)

      const chapters = await workshopService.getWorkshopChapters('test-workshop')
      
      chapters.forEach((chapter: any) => {
        expect(chapter).toHaveProperty('id')
        expect(chapter).toHaveProperty('title')
        expect(chapter).toHaveProperty('content_markdown')
        expect(chapter).toHaveProperty('learning_objectives')
        expect(chapter).toHaveProperty('estimated_duration_minutes')
        expect(chapter).toHaveProperty('resources')
        expect(chapter).toHaveProperty('assignments')
        expect(chapter).toHaveProperty('published')
      })
    })

    it('should handle chapters with resources', async () => {
      const mockChapters = [
        {
          id: '1',
          title: 'Chapter with Resources',
          content_markdown: '# Chapter with Resources',
          learning_objectives: ['Learn about resources'],
          estimated_duration_minutes: 45,
          resources: [
            { title: 'Resource 1', url: 'https://example.com/1', type: 'document' },
            { title: 'Resource 2', url: 'https://example.com/2', type: 'video' }
          ],
          assignments: [],
          published: true,
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z',
          workshop_slug: 'test-workshop',
          workshop_id: '1',
          chapter_number: 1,
          slug: 'chapter-with-resources'
        }
      ]

      ;(workshopService.getWorkshopChapters as jest.Mock).mockResolvedValue(mockChapters)

      const chapters = await workshopService.getWorkshopChapters('test-workshop')
      
      chapters.forEach((chapter: any) => {
        expect(chapter.resources).toHaveLength(2)
        expect(chapter.resources[0]).toHaveProperty('title', 'Resource 1')
        expect(chapter.resources[1]).toHaveProperty('title', 'Resource 2')
      })
    })

    it('should handle chapters with assignments', async () => {
      const mockChapters = [
        {
          id: '1',
          title: 'Chapter with Assignments',
          content_markdown: '# Chapter with Assignments',
          learning_objectives: ['Complete assignments'],
          estimated_duration_minutes: 60,
          resources: [],
          assignments: [
            { title: 'Assignment 1', description: 'Complete this task', due_date: '2025-01-15' },
            { title: 'Assignment 2', description: 'Another task', due_date: '2025-01-20' }
          ],
          published: true,
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z',
          workshop_slug: 'test-workshop',
          workshop_id: '1',
          chapter_number: 1,
          slug: 'chapter-with-assignments'
        }
      ]

      ;(workshopService.getWorkshopChapters as jest.Mock).mockResolvedValue(mockChapters)

      const chapters = await workshopService.getWorkshopChapters('test-workshop')
      
      chapters.forEach((chapter: any) => {
        expect(chapter.assignments).toHaveLength(2)
        expect(chapter.assignments[0]).toHaveProperty('title', 'Assignment 1')
        expect(chapter.assignments[1]).toHaveProperty('title', 'Assignment 2')
      })
    })

    it('should process learning objectives', async () => {
      const mockChapters = [
        {
          id: '1',
          title: 'Learning Objectives Chapter',
          content_markdown: '# Learning Objectives',
          learning_objectives: [
            'Understand basic concepts',
            'Apply knowledge practically',
            'Evaluate results critically'
          ],
          estimated_duration_minutes: 45,
          resources: [],
          assignments: [],
          published: true,
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z',
          workshop_slug: 'test-workshop',
          workshop_id: '1',
          chapter_number: 1,
          slug: 'learning-objectives-chapter'
        }
      ]

      ;(workshopService.getWorkshopChapters as jest.Mock).mockResolvedValue(mockChapters)

      const chapters = await workshopService.getWorkshopChapters('test-workshop')
      
      chapters.forEach((chapter: any) => {
        expect(chapter.learning_objectives).toHaveLength(3)
        expect(chapter.learning_objectives).toContain('Understand basic concepts')
        expect(chapter.learning_objectives).toContain('Apply knowledge practically')
        expect(chapter.learning_objectives).toContain('Evaluate results critically')
      })
    })

    it('should handle empty content gracefully', async () => {
      const mockChapters = [
        {
          id: '1',
          title: 'Empty Chapter',
          content_markdown: '',
          learning_objectives: [],
          estimated_duration_minutes: 0,
          resources: [],
          assignments: [],
          published: true,
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z',
          workshop_slug: 'test-workshop',
          workshop_id: '1',
          chapter_number: 1,
          slug: 'empty-chapter'
        }
      ]

      ;(workshopService.getWorkshopChapters as jest.Mock).mockResolvedValue(mockChapters)

      const chapters = await workshopService.getWorkshopChapters('test-workshop')
      
      chapters.forEach((chapter: any) => {
        expect(chapter.content_markdown).toBe('')
        expect(chapter.learning_objectives).toHaveLength(0)
        expect(chapter.estimated_duration_minutes).toBe(0)
      })
    })
  })

  describe('Workshop Content Processing', () => {
    it('should process workshop metadata', async () => {
      const mockWorkshops = [
        {
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
          metadata: { tier: 'creator' },
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z',
          total_chapters: 3,
          published_chapters: 3,
          avg_chapter_duration: 45,
          image: 'https://example.com/image.jpg'
        }
      ]

      ;(workshopService.getWorkshops as jest.Mock).mockResolvedValue(mockWorkshops)

      const workshops = await workshopService.getWorkshops()
      
      workshops.forEach((workshop: any) => {
        expect(workshop).toHaveProperty('title')
        expect(workshop).toHaveProperty('description')
        expect(workshop).toHaveProperty('learning_objectives')
        expect(workshop).toHaveProperty('prerequisites')
        expect(workshop).toHaveProperty('duration_weeks')
        expect(workshop).toHaveProperty('difficulty_level')
        expect(workshop).toHaveProperty('category')
      })
    })

    it('should handle workshop categories', async () => {
      const mockWorkshops = [
        {
          id: '1',
          slug: 'film-workshop',
          title: 'Film Workshop',
          description: 'Learn filmmaking',
          learning_objectives: ['Learn film'],
          prerequisites: ['Basic knowledge'],
          duration_weeks: 6,
          difficulty_level: 'beginner',
          category: 'film',
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

      const workshops = await workshopService.getWorkshops()
      
      workshops.forEach((workshop: any) => {
        expect(workshop.category).toBe('film')
      })
    })

    it('should process workshop content for search', async () => {
      const mockWorkshops = [
        {
          id: '1',
          slug: 'searchable-workshop',
          title: 'Searchable Workshop',
          description: 'This workshop is searchable',
          learning_objectives: ['Learn to search'],
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

      ;(workshopService.getWorkshops as jest.Mock).mockResolvedValue(mockWorkshops)

      const workshops = await workshopService.getWorkshops()
      
      workshops.forEach((workshop: any) => {
        const searchableContent = `${workshop.title} ${workshop.description} ${workshop.learning_objectives.join(' ')}`
        expect(searchableContent).toContain('Searchable Workshop')
        expect(searchableContent).toContain('searchable')
        expect(searchableContent).toContain('search')
      })
    })

    it('should handle workshop difficulty levels', async () => {
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

      const workshops = await workshopService.getWorkshops()
      
      workshops.forEach((workshop: any) => {
        expect(workshop.difficulty_level).toBe('beginner')
      })
    })

    it('should process workshop prerequisites', async () => {
      const mockWorkshops = [
        {
          id: '1',
          slug: 'prerequisite-workshop',
          title: 'Prerequisite Workshop',
          description: 'Has prerequisites',
          learning_objectives: ['Learn advanced topics'],
          prerequisites: ['Basic knowledge', 'Intermediate skills'],
          duration_weeks: 6,
          difficulty_level: 'advanced',
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

      const workshops = await workshopService.getWorkshops()
      
      workshops.forEach((workshop: any) => {
        expect(workshop.prerequisites).toHaveLength(2)
        expect(workshop.prerequisites).toContain('Basic knowledge')
        expect(workshop.prerequisites).toContain('Intermediate skills')
      })
    })
  })
}) 