// @jest-environment jsdom
/// <reference types="jest" />
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { WorkshopDetail } from '../WorkshopDetail'
import { ChapterCard } from '../ChapterCard'
import { ChapterReader } from '../ChapterReader'
// Isolate the external MDX compiler/runtime and auth/router boundaries only.
jest.mock('next-mdx-remote', () => ({ MDXRemote: () => <div>Mock MDX content</div> }))
jest.mock('@clerk/nextjs', () => ({useAuth:()=>({isSignedIn:false}),useUser:()=>({isSignedIn:false,user:null}),SignInButton:({children}:any)=>children,SignUpButton:({children}:any)=>children}))
jest.mock('next/navigation', () => {const push=jest.fn();return {useRouter:()=>({push}),usePathname:()=>'/learn/ethical-ai-journalism'}})
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
    organization_id: 'test-org',
    type: 'workshop' as const,
    level: 'beginner' as const,
    status: 'published' as const,
    price: 0,
    is_active: true,
    is_public: true,
    is_shared: false,
    created_by: 'test-user',
    outcomes: [
      'Understand AI bias and mitigation strategies',
      'Create fact-checked news content with AI assistance',
      'Implement ethical guidelines in AI journalism'
    ],
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

  const mockMdxSource = {compiledSource:'test-fixture',frontmatter:{},scope:{}}
  const push = jest.requireMock('next/navigation').useRouter().push
  beforeEach(() => jest.clearAllMocks())

  it('lists all chapters in source order and allows free browsing', () => {
    render(<WorkshopDetail workshop={mockWorkshop} chapters={mockChapters} />)
    expect(screen.getAllByRole('heading',{level:3}).filter(x=>mockChapters.some(c=>c.title===x.textContent)).map(x=>x.textContent)).toEqual(mockChapters.map(c=>c.title))
    expect(screen.getAllByText('Free')).toHaveLength(3)
    expect(screen.getByText('45 min')).toBeInTheDocument()
    expect(screen.getByText('60 min')).toBeInTheDocument()
  })
  it('handles single and empty lists', () => {
    const {rerender}=render(<WorkshopDetail workshop={mockWorkshop} chapters={[mockChapters[0]]} />)
    expect(screen.getByText('Understanding AI Bias')).toBeInTheDocument()
    expect(screen.queryByText('Fact-Checking with AI')).not.toBeInTheDocument()
    rerender(<WorkshopDetail workshop={mockWorkshop} chapters={[]} />)
    expect(screen.getByText('No chapters available.')).toBeInTheDocument()
    expect(screen.queryByText('Understanding AI Bias')).not.toBeInTheDocument()
  })
  it('renders zero duration and navigates to the selected chapter', () => {
    render(<ChapterCard chapter={{...mockChapters[0],estimated_duration_minutes:0}} workshopSlug="ethical-ai-journalism" />)
    expect(screen.getByText('0 min')).toBeInTheDocument()
    fireEvent.click(screen.getByText('workshop.start'))
    expect(push).toHaveBeenCalledWith('/learn/ethical-ai-journalism/01-understanding-ai-bias')
  })
  it('marks inaccessible premium chapters without allowing navigation', () => {
    render(<ChapterCard chapter={mockChapters[1]} workshopSlug="ethical-ai-journalism" isAccessible={false} />)
    expect(screen.getByText('Premium')).toBeInTheDocument()
    expect(screen.getByRole('button',{name:'workshop.locked'})).toBeDisabled()
    expect(push).not.toHaveBeenCalled()
  })
  it('renders the supplied chapter and MDX boundary without fetching client data', () => {
    render(<ChapterReader workshopSlug="ethical-ai-journalism" chapterSlug={mockChapters[0].slug} chapter={mockChapters[0]} mdxSource={mockMdxSource} />)
    expect(screen.getAllByText('Understanding AI Bias').length).toBeGreaterThan(0)
    expect(screen.getByText('Mock MDX content')).toBeInTheDocument()
    expect(screen.getByText('Identify common types of AI bias')).toBeInTheDocument()
  })
  it('handles a missing server-supplied chapter instead of dereferencing null', () => {
    render(<ChapterReader workshopSlug="ethical-ai-journalism" chapterSlug="missing" chapter={null} mdxSource={mockMdxSource} />)
    expect(screen.getByText('Chapter Not Found')).toBeInTheDocument()
    expect(screen.getByText('Back to Workshop')).toBeInTheDocument()
  })
})
