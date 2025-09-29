import { render, screen } from '@testing-library/react'
import { TimelineWrapper } from '../TimelineWrapper'

// Mock the Timeline and FilmstripTimeline components
jest.mock('../Timeline', () => ({
  Timeline: ({ events, title, className }: any) => (
    <div data-testid="vertical-timeline" className={className}>
      <h3>{title}</h3>
      {events.map((event: any, index: number) => (
        <div key={index} data-testid={`vertical-event-${index}`}>
          {event.title}
        </div>
      ))}
    </div>
  ),
}))

jest.mock('../FilmstripTimeline', () => ({
  FilmstripTimeline: ({ events, height, neon }: any) => (
    <div data-testid="horizontal-timeline" style={{ height, '--neon': neon }}>
      {events.map((event: any, index: number) => (
        <div key={index} data-testid={`horizontal-event-${index}`}>
          {event.title}
        </div>
      ))}
    </div>
  ),
}))

const smallEventSet = [
  { year: '2020', title: 'Event 1', description: 'Description 1', category: 'milestone' },
  { year: '2021', title: 'Event 2', description: 'Description 2', category: 'breakthrough' }
]

const largeEventSet = [
  { year: '2017', title: 'Event 1', description: 'Description 1', category: 'milestone' },
  { year: '2018', title: 'Event 2', description: 'Description 2', category: 'breakthrough' },
  { year: '2019', title: 'Event 3', description: 'Description 3', category: 'release' },
  { year: '2020', title: 'Event 4', description: 'Description 4', category: 'research' },
  { year: '2021', title: 'Event 5', description: 'Description 5', category: 'milestone' },
  { year: '2022', title: 'Event 6', description: 'Description 6', category: 'breakthrough' },
  { year: '2023', title: 'Event 7', description: 'Description 7', category: 'release' },
  { year: '2024', title: 'Event 8', description: 'Description 8', category: 'research' },
  { year: '2025', title: 'Event 9', description: 'Description 9', category: 'milestone' }
]

describe('TimelineWrapper', () => {
  it('renders with title', () => {
    render(
      <TimelineWrapper
        events={smallEventSet}
        title="Test Timeline"
      />
    )
    
    expect(screen.getByText('Test Timeline')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(
      <TimelineWrapper
        events={smallEventSet}
        className="custom-class"
      />
    )
    
    const timeline = screen.getByTestId('vertical-timeline')
    expect(timeline).toHaveClass('custom-class')
  })

  it('uses vertical timeline for small event sets (auto mode)', () => {
    render(
      <TimelineWrapper
        events={smallEventSet}
        variant="auto"
      />
    )
    
    expect(screen.getByTestId('vertical-timeline')).toBeInTheDocument()
    expect(screen.queryByTestId('horizontal-timeline')).not.toBeInTheDocument()
  })

  it('uses horizontal timeline for large event sets (auto mode)', () => {
    render(
      <TimelineWrapper
        events={largeEventSet}
        variant="auto"
      />
    )
    
    expect(screen.getByTestId('horizontal-timeline')).toBeInTheDocument()
    expect(screen.queryByTestId('vertical-timeline')).not.toBeInTheDocument()
  })

  it('uses vertical timeline when explicitly specified', () => {
    render(
      <TimelineWrapper
        events={largeEventSet}
        variant="vertical"
      />
    )
    
    expect(screen.getByTestId('vertical-timeline')).toBeInTheDocument()
    expect(screen.queryByTestId('horizontal-timeline')).not.toBeInTheDocument()
  })

  it('uses horizontal timeline when explicitly specified', () => {
    render(
      <TimelineWrapper
        events={smallEventSet}
        variant="horizontal"
      />
    )
    
    expect(screen.getByTestId('horizontal-timeline')).toBeInTheDocument()
    expect(screen.queryByTestId('vertical-timeline')).not.toBeInTheDocument()
  })

  it('converts event data format correctly for vertical timeline', () => {
    render(
      <TimelineWrapper
        events={smallEventSet}
        variant="vertical"
      />
    )
    
    expect(screen.getByTestId('vertical-event-0')).toHaveTextContent('Event 1')
    expect(screen.getByTestId('vertical-event-1')).toHaveTextContent('Event 2')
  })

  it('converts event data format correctly for horizontal timeline', () => {
    render(
      <TimelineWrapper
        events={smallEventSet}
        variant="horizontal"
      />
    )
    
    expect(screen.getByTestId('horizontal-event-0')).toHaveTextContent('Event 1')
    expect(screen.getByTestId('horizontal-event-1')).toHaveTextContent('Event 2')
  })

  it('handles empty events array', () => {
    render(
      <TimelineWrapper
        events={[]}
        variant="auto"
      />
    )
    
    expect(screen.getByTestId('vertical-timeline')).toBeInTheDocument()
  })

  it('handles events with missing optional fields', () => {
    const eventsWithMissingFields = [
      { year: '2020', title: 'Event 1', description: 'Description 1' },
      { year: '2021', title: 'Event 2', description: 'Description 2', category: 'milestone' }
    ]
    
    render(
      <TimelineWrapper
        events={eventsWithMissingFields}
        variant="auto"
      />
    )
    
    expect(screen.getByTestId('vertical-timeline')).toBeInTheDocument()
    expect(screen.getByTestId('vertical-event-0')).toHaveTextContent('Event 1')
    expect(screen.getByTestId('vertical-event-1')).toHaveTextContent('Event 2')
  })

  it('handles events with all category types', () => {
    const eventsWithAllCategories = [
      { year: '2020', title: 'Milestone', description: 'A milestone', category: 'milestone' },
      { year: '2021', title: 'Breakthrough', description: 'A breakthrough', category: 'breakthrough' },
      { year: '2022', title: 'Release', description: 'A release', category: 'release' },
      { year: '2023', title: 'Research', description: 'Research', category: 'research' }
    ]
    
    render(
      <TimelineWrapper
        events={eventsWithAllCategories}
        variant="auto"
      />
    )
    
    expect(screen.getByTestId('vertical-timeline')).toBeInTheDocument()
    expect(screen.getByTestId('vertical-event-0')).toHaveTextContent('Milestone')
    expect(screen.getByTestId('vertical-event-1')).toHaveTextContent('Breakthrough')
    expect(screen.getByTestId('vertical-event-2')).toHaveTextContent('Release')
    expect(screen.getByTestId('vertical-event-3')).toHaveTextContent('Research')
  })

  it('defaults to auto variant when not specified', () => {
    render(
      <TimelineWrapper
        events={smallEventSet}
      />
    )
    
    expect(screen.getByTestId('vertical-timeline')).toBeInTheDocument()
  })

  it('passes through all props to vertical timeline', () => {
    render(
      <TimelineWrapper
        events={smallEventSet}
        title="Custom Title"
        className="custom-class"
        variant="vertical"
      />
    )
    
    const timeline = screen.getByTestId('vertical-timeline')
    expect(timeline).toHaveClass('custom-class')
    expect(screen.getByText('Custom Title')).toBeInTheDocument()
  })

  it('passes through title to horizontal timeline', () => {
    render(
      <TimelineWrapper
        events={largeEventSet}
        title="Custom Title"
        variant="horizontal"
      />
    )
    
    expect(screen.getByText('Custom Title')).toBeInTheDocument()
  })
})
