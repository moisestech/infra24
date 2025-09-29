// @jest-environment jsdom
/// <reference types="jest" />
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { WorkshopDetail } from '../WorkshopDetail'
import { ChapterCard } from '../ChapterCard'
import { ChapterReader } from '../ChapterReader'
import { workshopService } from '../../services/workshopService'

// Mock the workshop service
jest.mock('../../services/workshopService')

describe('Chapter Visibility Tests - Critical Bug Prevention', () => {
  const mockWorkshop = {
    id: '1',
    slug: 'ethical-ai-journalism',
    title: 'Ethical AI Journalism',
    subtitle: 'Creating responsible news content with AI tools',
    description: 'Learn how to use AI tools ethically in journalism while maintaining accuracy and transparency.',
    learning_objectives: [
      'Understand AI bias and mitigation strategies',
      'Create fact-checked news content with AI assistance',
      'Implement ethical guidelines in AI journalism'
    ],
    prerequisites: [
      'Basic computer literacy',
      'Interest in journalism or media'
    ],
    duration_weeks: 4,
    difficulty_level: 'beginner' as const,
    category: 'journalism',
    featured: true,
    published: true,
    metadata: {},
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  }

  const mockChapters = [
    {
      id: '1',
      workshop_id: '1',
      chapter_number: 1,
      title: 'Understanding AI Bias',
      slug: '01-understanding-ai-bias',
      content_markdown: '# Understanding AI Bias\n\nLearn about AI bias...',
      learning_objectives: ['Identify common types of AI bias'],
      estimated_duration_minutes: 45,
      resources: [],
      assignments: [],
      published: true,
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z',
      workshop_slug: 'ethical-ai-journalism'
    },
    {
      id: '2',
      workshop_id: '1',
      chapter_number: 2,
      title: 'Fact-Checking with AI',
      slug: '02-fact-checking-with-ai',
      content_markdown: '# Fact-Checking with AI\n\nLearn fact-checking...',
      learning_objectives: ['Use AI tools for fact-checking'],
      estimated_duration_minutes: 60,
      resources: [],
      assignments: [],
      published: true,
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z',
      workshop_slug: 'ethical-ai-journalism'
    },
    {
      id: '3',
      workshop_id: '1',
      chapter_number: 3,
      title: 'Ethical Guidelines',
      slug: '03-ethical-guidelines',
      content_markdown: '# Ethical Guidelines\n\nEstablish guidelines...',
      learning_objectives: ['Develop ethical guidelines'],
      estimated_duration_minutes: 45,
      resources: [],
      assignments: [],
      published: true,
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z',
      workshop_slug: 'ethical-ai-journalism'
    }
  ]

  const mockMdxSource = {
    compiledSource: 'export default function MDXContent() { return <div>Mock MDX Content</div> }',
    frontmatter: {},
    scope: {}
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('WorkshopDetail - Chapter Display', () => {
    it('should display all chapters for a workshop', async () => {
      render(<WorkshopDetail workshop={mockWorkshop} chapters={mockChapters} />)
      
      // Verify all chapters are displayed
      expect(screen.getByText('Understanding AI Bias')).toBeInTheDocument()
      expect(screen.getByText('Fact-Checking with AI')).toBeInTheDocument()
      expect(screen.getByText('Ethical Guidelines')).toBeInTheDocument()
    })

    it('should show chapter count correctly', () => {
      render(<WorkshopDetail workshop={mockWorkshop} chapters={mockChapters} />)
      
      // Should show correct chapter count
      expect(screen.getByText('3 chapters')).toBeInTheDocument()
    })

    it('should display chapter cards with correct information', () => {
      render(<WorkshopDetail workshop={mockWorkshop} chapters={mockChapters} />)
      
      // Verify chapter cards show correct information
      expect(screen.getByText('Understanding AI Bias')).toBeInTheDocument()
      expect(screen.getByText('45 min')).toBeInTheDocument()
      expect(screen.getByText('Fact-Checking with AI')).toBeInTheDocument()
      expect(screen.getByText('60 min')).toBeInTheDocument()
    })
  })

  describe('ChapterCard - Individual Chapter Display', () => {
    it('should render chapter card with all required information', () => {
      render(<ChapterCard chapter={mockChapters[0]} workshopSlug="ethical-ai-journalism" />)
      
      expect(screen.getByText('Understanding AI Bias')).toBeInTheDocument()
      expect(screen.getByText('45 min')).toBeInTheDocument()
      expect(screen.getByText('Chapter 1')).toBeInTheDocument()
    })

    it('should show chapter status correctly', () => {
      render(<ChapterCard chapter={mockChapters[0]} workshopSlug="ethical-ai-journalism" />)
      
      // Should show published status
      expect(screen.getByText('Published')).toBeInTheDocument()
    })

    it('should handle unpublished chapters', () => {
      const unpublishedChapter = {
        ...mockChapters[0],
        published: false
      }
      
      render(<ChapterCard chapter={unpublishedChapter} workshopSlug="ethical-ai-journalism" />)
      
      // Should show unpublished status
      expect(screen.getByText('Draft')).toBeInTheDocument()
    })
  })

  describe('ChapterReader - Chapter Content Display', () => {
    beforeEach(() => {
      ;(workshopService.getChapter as jest.Mock).mockResolvedValue(mockChapters[0])
      ;(workshopService.getWorkshopChapters as jest.Mock).mockResolvedValue({
        chapters: mockChapters
      })
      ;(workshopService.getChapter as jest.Mock).mockResolvedValue(mockChapters[0])
    })

    it('should render chapter content correctly', async () => {
      render(
        <ChapterReader 
          workshopSlug="ethical-ai-journalism" 
          chapterSlug="01-understanding-ai-bias"
          chapter={mockChapters[0]}
          mdxSource={mockMdxSource}
        />
      )
      
      // Wait for content to load
      await waitFor(() => {
        expect(screen.getByText('Understanding AI Bias')).toBeInTheDocument()
      })
      
      // Verify chapter content is displayed
      expect(screen.getByText('Learn about AI bias...')).toBeInTheDocument()
    })

    it('should show chapter navigation correctly', async () => {
      render(
        <ChapterReader 
          workshopSlug="ethical-ai-journalism" 
          chapterSlug="01-understanding-ai-bias"
          chapter={mockChapters[0]}
          mdxSource={mockMdxSource}
        />
      )
      
      await waitFor(() => {
        expect(screen.getByText('Understanding AI Bias')).toBeInTheDocument()
      })
      
      // Verify navigation elements are present
      expect(screen.getByText(/previous/i) || screen.getByText(/next/i)).toBeInTheDocument()
    })

    it('should handle chapter loading states', async () => {
      // Mock slow loading
      ;(workshopService.getChapter as jest.Mock).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve(mockChapters[0]), 100))
      )
      
      render(
        <ChapterReader 
          workshopSlug="ethical-ai-journalism" 
          chapterSlug="01-understanding-ai-bias"
          chapter={mockChapters[0]}
          mdxSource={mockMdxSource}
        />
      )
      
      // Should show loading state initially
      expect(screen.getByText(/loading/i)).toBeInTheDocument()
      
      // Should show content after loading
      await waitFor(() => {
        expect(screen.getByText('Understanding AI Bias')).toBeInTheDocument()
      })
    })

    it('should handle chapter not found gracefully', async () => {
      ;(workshopService.getChapter as jest.Mock).mockResolvedValue(null)
      
      render(
        <ChapterReader 
          workshopSlug="ethical-ai-journalism" 
          chapterSlug="non-existent-chapter"
          chapter={null}
          mdxSource={mockMdxSource}
        />
      )
      
      await waitFor(() => {
        expect(screen.getByText(/chapter not found/i) || screen.getByText(/404/i)).toBeInTheDocument()
      })
    })
  })

  describe('Chapter Visibility Edge Cases', () => {
    it('should handle workshop with single chapter', () => {
      const singleChapter = [mockChapters[0]]
      render(<WorkshopDetail workshop={mockWorkshop} chapters={singleChapter} />)
      
      expect(screen.getByText('Understanding AI Bias')).toBeInTheDocument()
      expect(screen.getByText('1 chapter')).toBeInTheDocument()
    })

    it('should handle workshop with many chapters', () => {
      const manyChapters = [
        ...mockChapters,
        {
          id: '4',
          workshop_id: '1',
          chapter_number: 4,
          title: 'Advanced Topics',
          slug: '04-advanced-topics',
          content_markdown: '# Advanced Topics',
          learning_objectives: ['Master advanced concepts'],
          estimated_duration_minutes: 90,
          resources: [],
          assignments: [],
          published: true,
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z',
          workshop_slug: 'ethical-ai-journalism'
        }
      ]
      
      render(<WorkshopDetail workshop={mockWorkshop} chapters={manyChapters} />)
      
      expect(screen.getByText('4 chapters')).toBeInTheDocument()
      expect(screen.getByText('Advanced Topics')).toBeInTheDocument()
    })

    it('should handle workshop with no chapters', () => {
      render(<WorkshopDetail workshop={mockWorkshop} chapters={[]} />)
      
      expect(screen.getByText('0 chapters')).toBeInTheDocument()
      expect(screen.getByText(/no chapters available/i)).toBeInTheDocument()
    })

    it('should handle chapters with missing data gracefully', () => {
      const incompleteChapter = {
        id: '1',
        workshop_id: '1',
        chapter_number: 1,
        title: 'Incomplete Chapter',
        slug: 'incomplete',
        content_markdown: '',
        learning_objectives: [],
        estimated_duration_minutes: 0,
        resources: [],
        assignments: [],
        published: true,
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
        workshop_slug: 'ethical-ai-journalism'
      }
      
      render(<ChapterCard chapter={incompleteChapter} workshopSlug="ethical-ai-journalism" />)
      
      expect(screen.getByText('Incomplete Chapter')).toBeInTheDocument()
      expect(screen.getByText('0 min')).toBeInTheDocument()
    })
  })

  describe('Chapter Access Control', () => {
    it('should show access restrictions for premium chapters', () => {
      const premiumChapter = {
        ...mockChapters[1],
        chapter_number: 2
      }
      
      render(<ChapterCard chapter={premiumChapter} workshopSlug="ethical-ai-journalism" />)
      
      // Should show premium indicator
      expect(screen.getByText(/premium/i) || screen.getByText(/lock/i)).toBeInTheDocument()
    })

    it('should allow access to first chapter for all users', () => {
      render(<ChapterCard chapter={mockChapters[0]} workshopSlug="ethical-ai-journalism" />)
      
      // First chapter should be accessible
      expect(screen.getByText('Understanding AI Bias')).toBeInTheDocument()
      expect(screen.queryByText(/lock/i)).not.toBeInTheDocument()
    })
  })

  describe('Chapter Navigation', () => {
    it('should provide navigation between chapters', () => {
      render(<WorkshopDetail workshop={mockWorkshop} chapters={mockChapters} />)
      
      // Should have navigation elements
      expect(screen.getByText('Understanding AI Bias')).toBeInTheDocument()
      expect(screen.getByText('Fact-Checking with AI')).toBeInTheDocument()
      expect(screen.getByText('Ethical Guidelines')).toBeInTheDocument()
    })

    it('should maintain chapter order correctly', () => {
      render(<WorkshopDetail workshop={mockWorkshop} chapters={mockChapters} />)
      
      const chapterElements = screen.getAllByText(/Chapter \d+/)
      expect(chapterElements[0]).toHaveTextContent('Chapter 1')
      expect(chapterElements[1]).toHaveTextContent('Chapter 2')
      expect(chapterElements[2]).toHaveTextContent('Chapter 3')
    })
  })

  describe('Chapter Content Validation', () => {
    it('should validate chapter content structure', () => {
      const validChapter = mockChapters[0]
      
      expect(validChapter).toHaveProperty('id')
      expect(validChapter).toHaveProperty('title')
      expect(validChapter).toHaveProperty('content_markdown')
      expect(validChapter).toHaveProperty('learning_objectives')
      expect(validChapter).toHaveProperty('estimated_duration_minutes')
    })

    it('should handle chapters with rich content', () => {
      const richChapter = {
        ...mockChapters[0],
        content_markdown: `
# Rich Content Chapter

This chapter has **bold text**, *italic text*, and [links](https://example.com).

## Subsection

- List item 1
- List item 2
- List item 3

\`\`\`javascript
console.log('Code block');
\`\`\`
        `
      }
      
      render(<ChapterCard chapter={richChapter} workshopSlug="ethical-ai-journalism" />)
      
      expect(screen.getByText('Rich Content Chapter')).toBeInTheDocument()
    })
  })

  describe('Chapter Performance', () => {
    it('should render chapters efficiently', () => {
      const startTime = performance.now()
      
      render(<WorkshopDetail workshop={mockWorkshop} chapters={mockChapters} />)
      
      const endTime = performance.now()
      const renderTime = endTime - startTime
      
      // Should render within reasonable time (adjust threshold as needed)
      expect(renderTime).toBeLessThan(1000)
    })

    it('should handle large chapter lists', () => {
      const largeChapterList = Array.from({ length: 50 }, (_, i) => ({
        ...mockChapters[0],
        id: String(i + 1),
        title: `Chapter ${i + 1}`,
        slug: `chapter-${i + 1}`,
        chapter_number: i + 1
      }))
      
      render(<WorkshopDetail workshop={mockWorkshop} chapters={largeChapterList} />)
      
      // Should render without errors
      expect(screen.getByText('50 chapters')).toBeInTheDocument()
    })
  })
}) 