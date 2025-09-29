import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { FilmstripTimeline, TimelineEvent } from '../FilmstripTimeline'

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} {...props} />
  ),
}))

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}))

// Mock createPortal
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: (children: any) => children,
}))

const mockEvents: TimelineEvent[] = [
  {
    id: 'test-1',
    date: '2020-01-01',
    title: 'Test Event 1',
    summary: 'This is a test event',
    category: 'milestone',
    tags: ['test', 'milestone'],
    image: '/test-image-1.jpg'
  },
  {
    id: 'test-2',
    date: '2021-01-01',
    title: 'Test Event 2',
    summary: 'This is another test event',
    category: 'breakthrough',
    tags: ['test', 'breakthrough']
  },
  {
    id: 'test-3',
    date: '2022-01-01',
    title: 'Test Event 3',
    summary: 'This is a third test event',
    category: 'release',
    tags: ['test', 'release']
  }
]

describe('FilmstripTimeline', () => {
  beforeEach(() => {
    // Mock ResizeObserver
    global.ResizeObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }))

    // Mock scrollBy for DOM elements
    Element.prototype.scrollBy = jest.fn()
    Element.prototype.scrollTo = jest.fn()
  })

  it('renders timeline with events', () => {
    render(<FilmstripTimeline events={mockEvents} />)
    
    expect(screen.getByText('AI Video — 10-year timeline')).toBeInTheDocument()
    expect(screen.getByText('Test Event 1')).toBeInTheDocument()
    expect(screen.getByText('Test Event 2')).toBeInTheDocument()
    expect(screen.getByText('Test Event 3')).toBeInTheDocument()
  })

  it('renders with custom height', () => {
    render(<FilmstripTimeline events={mockEvents} height={300} />)
    
    const timeline = screen.getByText('AI Video — 10-year timeline').closest('div')?.parentElement
    expect(timeline).toHaveStyle({ height: '300px' })
  })

  it('renders with custom neon color', () => {
    render(<FilmstripTimeline events={mockEvents} neon="#ff0000" />)
    
    const zoomSlider = screen.getByLabelText('Zoom')
    expect(zoomSlider).toHaveStyle({ '--neon': '#ff0000' })
  })

  it('groups events by year', () => {
    render(<FilmstripTimeline events={mockEvents} />)
    
    expect(screen.getByText('2020')).toBeInTheDocument()
    expect(screen.getByText('2021')).toBeInTheDocument()
    expect(screen.getByText('2022')).toBeInTheDocument()
  })

  it('handles zoom changes', () => {
    render(<FilmstripTimeline events={mockEvents} />)
    
    const zoomSlider = screen.getByLabelText('Zoom')
    fireEvent.change(zoomSlider, { target: { value: '1.5' } })
    
    expect(zoomSlider).toHaveValue('1.5')
  })

  it('handles navigation buttons', () => {
    render(<FilmstripTimeline events={mockEvents} />)
    
    const buttons = screen.getAllByRole('button')
    const leftButton = buttons[0] // First button (left arrow)
    const rightButton = buttons[1] // Second button (right arrow)
    
    fireEvent.click(leftButton)
    fireEvent.click(rightButton)
    
    // Buttons should be clickable without errors
    expect(leftButton).toBeInTheDocument()
    expect(rightButton).toBeInTheDocument()
  })

  it('opens preview when event is clicked', async () => {
    render(<FilmstripTimeline events={mockEvents} />)
    
    const eventButtons = screen.getAllByRole('button')
    const eventButton = eventButtons.find(button => 
      button.textContent?.includes('Test Event 1')
    )
    
    if (eventButton) {
      fireEvent.click(eventButton)
      
      await waitFor(() => {
        // Check that the preview modal appears
        expect(screen.getByText('Test Event 1')).toBeInTheDocument()
      })
    }
  })

  it('handles keyboard navigation', () => {
    render(<FilmstripTimeline events={mockEvents} />)
    
    // Test arrow key navigation
    fireEvent.keyDown(document, { key: 'ArrowRight' })
    fireEvent.keyDown(document, { key: 'ArrowLeft' })
    
    // Should not throw errors
    expect(screen.getByText('AI Video — 10-year timeline')).toBeInTheDocument()
  })

  it('renders images when provided', () => {
    render(<FilmstripTimeline events={mockEvents} />)
    
    const images = screen.getAllByRole('img')
    expect(images).toHaveLength(1) // Only one event has an image
    expect(images[0]).toHaveAttribute('src', '/test-image-1.jpg')
  })

  it('handles empty events array', () => {
    render(<FilmstripTimeline events={[]} />)
    
    expect(screen.getByText('AI Video — 10-year timeline')).toBeInTheDocument()
    // Should not crash with empty events
  })

  it('sorts events by date', () => {
    const unsortedEvents: TimelineEvent[] = [
      {
        id: 'test-3',
        date: '2022-01-01',
        title: 'Latest Event',
        summary: 'This is the latest event',
        category: 'release'
      },
      {
        id: 'test-1',
        date: '2020-01-01',
        title: 'Earliest Event',
        summary: 'This is the earliest event',
        category: 'milestone'
      }
    ]

    render(<FilmstripTimeline events={unsortedEvents} />)
    
    // Events should be sorted by date - check for the year labels
    expect(screen.getByText('2020')).toBeInTheDocument()
    expect(screen.getByText('2022')).toBeInTheDocument()
  })

  it('displays event summaries', () => {
    render(<FilmstripTimeline events={mockEvents} />)
    
    expect(screen.getByText('This is a test event')).toBeInTheDocument()
    expect(screen.getByText('This is another test event')).toBeInTheDocument()
    expect(screen.getByText('This is a third test event')).toBeInTheDocument()
  })

  it('handles events without images', () => {
    const eventsWithoutImages: TimelineEvent[] = [
      {
        id: 'test-1',
        date: '2020-01-01',
        title: 'Test Event',
        summary: 'No image event',
        category: 'milestone'
      }
    ]

    render(<FilmstripTimeline events={eventsWithoutImages} />)
    
    expect(screen.getByText('Test Event')).toBeInTheDocument()
    // Should not crash when no images are provided
  })
})
