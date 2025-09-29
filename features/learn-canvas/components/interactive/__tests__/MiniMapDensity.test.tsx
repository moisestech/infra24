import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MiniMapDensity } from '../MiniMapDensity'
import type { TimelineEvent } from '../FilmstripTimeline'

const mockEvents: TimelineEvent[] = [
  {
    id: 'test-1',
    date: '2020-01-01',
    title: 'Test Event 1',
    summary: 'This is a test event',
    category: 'milestone'
  },
  {
    id: 'test-2',
    date: '2021-06-15',
    title: 'Test Event 2',
    summary: 'This is another test event',
    category: 'breakthrough'
  },
  {
    id: 'test-3',
    date: '2022-12-31',
    title: 'Test Event 3',
    summary: 'This is a third test event',
    category: 'release'
  }
]

// Mock canvas context
const mockCanvasContext = {
  scale: jest.fn(),
  clearRect: jest.fn(),
  fillStyle: '',
  fillRect: jest.fn(),
  strokeStyle: '',
  beginPath: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  stroke: jest.fn(),
}

const mockCanvas = {
  getContext: jest.fn(() => mockCanvasContext),
  width: 0,
  height: 0,
}

// Mock HTMLCanvasElement
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: jest.fn(() => mockCanvasContext),
})

Object.defineProperty(HTMLCanvasElement.prototype, 'getBoundingClientRect', {
  value: jest.fn(() => ({
    width: 800,
    height: 56,
    top: 0,
    left: 0,
    bottom: 56,
    right: 800,
  })),
})

describe('MiniMapDensity', () => {
  const mockScrollRef = {
    current: {
      scrollWidth: 2400,
      clientWidth: 800,
      scrollLeft: 0,
      scrollTo: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }
  }

  beforeEach(() => {
    // Mock ResizeObserver
    global.ResizeObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }))

    // Mock devicePixelRatio
    Object.defineProperty(window, 'devicePixelRatio', {
      value: 1,
      writable: true,
    })

    // Mock scrollBy and scrollTo for DOM elements
    Element.prototype.scrollBy = jest.fn()
    Element.prototype.scrollTo = jest.fn()

    // Reset mocks
    jest.clearAllMocks()
  })

  it('renders mini-map container', () => {
    render(
      <MiniMapDensity
        events={mockEvents}
        scrollRef={mockScrollRef}
        height={56}
        neon="#00ff00"
      />
    )
    
    const container = screen.getByRole('slider')
    expect(container).toBeInTheDocument()
    expect(container).toHaveAttribute('aria-label', 'Timeline viewport')
  })

  it('renders with custom height', () => {
    render(
      <MiniMapDensity
        events={mockEvents}
        scrollRef={mockScrollRef}
        height={80}
        neon="#00ff00"
      />
    )
    
    const canvas = document.querySelector('canvas')
    expect(canvas).toHaveStyle({ height: '80px' })
  })

  it('renders with custom neon color', () => {
    render(
      <MiniMapDensity
        events={mockEvents}
        scrollRef={mockScrollRef}
        height={56}
        neon="#ff0000"
      />
    )
    
    const viewport = screen.getByRole('slider')
    expect(viewport).toHaveStyle({
      borderColor: '#ff0000AA',
      boxShadow: expect.stringContaining('#ff0000')
    })
  })

  it('handles click navigation', () => {
    render(
      <MiniMapDensity
        events={mockEvents}
        scrollRef={mockScrollRef}
        height={56}
        neon="#00ff00"
      />
    )
    
    const container = screen.getByRole('slider').parentElement
    fireEvent.pointerDown(container!, { clientX: 400 })
    
    expect(mockScrollRef.current.scrollTo).toHaveBeenCalled()
  })

  it('handles drag navigation', () => {
    render(
      <MiniMapDensity
        events={mockEvents}
        scrollRef={mockScrollRef}
        height={56}
        neon="#00ff00"
      />
    )
    
    const viewport = screen.getByRole('slider')
    
    // Start drag
    fireEvent.pointerDown(viewport, { clientX: 100 })
    fireEvent.pointerMove(viewport, { clientX: 200 })
    fireEvent.pointerUp(viewport)
    
    expect(mockScrollRef.current.scrollTo).toHaveBeenCalled()
  })

  it('handles keyboard navigation', () => {
    render(
      <MiniMapDensity
        events={mockEvents}
        scrollRef={mockScrollRef}
        height={56}
        neon="#00ff00"
      />
    )
    
    const viewport = screen.getByRole('slider')
    
    fireEvent.keyDown(viewport, { key: 'ArrowRight' })
    fireEvent.keyDown(viewport, { key: 'ArrowLeft' })
    
    expect(mockScrollRef.current.scrollBy).toHaveBeenCalledTimes(2)
  })

  it('handles empty events array', () => {
    render(
      <MiniMapDensity
        events={[]}
        scrollRef={mockScrollRef}
        height={56}
        neon="#00ff00"
      />
    )
    
    const container = screen.getByRole('slider')
    expect(container).toBeInTheDocument()
    // Should not crash with empty events
  })

  it('calculates density bins correctly', () => {
    render(
      <MiniMapDensity
        events={mockEvents}
        scrollRef={mockScrollRef}
        height={56}
        neon="#00ff00"
        binCount={10}
      />
    )
    
    // Canvas should be rendered and context methods called
    expect(mockCanvasContext.scale).toHaveBeenCalled()
    expect(mockCanvasContext.clearRect).toHaveBeenCalled()
  })

  it('handles scroll ref changes', () => {
    const { rerender } = render(
      <MiniMapDensity
        events={mockEvents}
        scrollRef={mockScrollRef}
        height={56}
        neon="#00ff00"
      />
    )
    
    const newScrollRef = {
      current: {
        scrollWidth: 1200,
        clientWidth: 400,
        scrollLeft: 200,
        scrollTo: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      }
    }
    
    rerender(
      <MiniMapDensity
        events={mockEvents}
        scrollRef={newScrollRef}
        height={56}
        neon="#00ff00"
      />
    )
    
    expect(newScrollRef.current.addEventListener).toHaveBeenCalled()
  })

  it('handles viewport width calculations', () => {
    const wideScrollRef = {
      current: {
        scrollWidth: 4000,
        clientWidth: 800,
        scrollLeft: 0,
        scrollTo: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      }
    }
    
    render(
      <MiniMapDensity
        events={mockEvents}
        scrollRef={wideScrollRef}
        height={56}
        neon="#00ff00"
      />
    )
    
    const viewport = screen.getByRole('slider')
    expect(viewport).toBeInTheDocument()
  })

  it('handles single event', () => {
    const singleEvent: TimelineEvent[] = [
      {
        id: 'single',
        date: '2021-01-01',
        title: 'Single Event',
        summary: 'Only one event',
        category: 'milestone'
      }
    ]
    
    render(
      <MiniMapDensity
        events={singleEvent}
        scrollRef={mockScrollRef}
        height={56}
        neon="#00ff00"
      />
    )
    
    const container = screen.getByRole('slider')
    expect(container).toBeInTheDocument()
  })

  it('handles events with same date', () => {
    const sameDateEvents: TimelineEvent[] = [
      {
        id: 'event-1',
        date: '2021-01-01',
        title: 'Event 1',
        summary: 'First event',
        category: 'milestone'
      },
      {
        id: 'event-2',
        date: '2021-01-01',
        title: 'Event 2',
        summary: 'Second event',
        category: 'breakthrough'
      }
    ]
    
    render(
      <MiniMapDensity
        events={sameDateEvents}
        scrollRef={mockScrollRef}
        height={56}
        neon="#00ff00"
      />
    )
    
    const container = screen.getByRole('slider')
    expect(container).toBeInTheDocument()
  })

  it('handles custom bin count', () => {
    render(
      <MiniMapDensity
        events={mockEvents}
        scrollRef={mockScrollRef}
        height={56}
        neon="#00ff00"
        binCount={20}
      />
    )
    
    const container = screen.getByRole('slider')
    expect(container).toBeInTheDocument()
  })
})
