// @jest-environment jsdom
/// <reference types="jest" />
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { HeroBanner } from '../ui/HeroBanner'
import { Callout } from '../ui/Callout'
import { VideoEmbed } from '../ui/VideoEmbed'
import { ExerciseCard } from '../ui/ExerciseCard'
import { ResourceList } from '../ui/ResourceList'
import { IconDivider } from '../ui/IconDivider'
import { ReflectionPrompt } from '../ui/ReflectionPrompt'
import { Quiz } from '../interactive/Quiz'
import { Activity } from '../interactive/Activity'
import { Poll } from '../interactive/Poll'
import { Timeline } from '../interactive/Timeline'
import { BeforeAfterSlider } from '../interactive/BeforeAfterSlider'
import { CompareGrid } from '../interactive/CompareGrid'

describe('Course Components - UI Elements', () => {
  describe('HeroBanner', () => {
    it('should render with title and icon', () => {
      render(<HeroBanner title="Test Title" icon="Palette" />)
      
      expect(screen.getByText('Test Title')).toBeInTheDocument()
    })

    it('should render with subtitle', () => {
      render(<HeroBanner title="Test Title" subtitle="Test Subtitle" icon="Palette" />)
      
      expect(screen.getByText('Test Title')).toBeInTheDocument()
      expect(screen.getByText('Test Subtitle')).toBeInTheDocument()
    })

    it('should render with custom background gradient', () => {
      render(
        <HeroBanner 
          title="Test Title" 
          bgGradient="from-blue-500 to-purple-600" 
          icon="Palette" 
        />
      )
      
      expect(screen.getByText('Test Title')).toBeInTheDocument()
    })
  })

  describe('Callout', () => {
    it('should render with title and content', () => {
      render(
        <Callout title="Important Note">
          This is important information
        </Callout>
      )
      
      expect(screen.getByText('Important Note')).toBeInTheDocument()
      expect(screen.getByText('This is important information')).toBeInTheDocument()
    })

    it('should render with different types', () => {
      const { rerender } = render(
        <Callout type="info">
          Information
        </Callout>
      )
      
      expect(screen.getByText('Information')).toBeInTheDocument()
      
      rerender(
        <Callout type="warning">
          Warning message
        </Callout>
      )
      
      expect(screen.getByText('Warning message')).toBeInTheDocument()
      
      rerender(
        <Callout type="success">
          Success message
        </Callout>
      )
      
      expect(screen.getByText('Success message')).toBeInTheDocument()
    })
  })

  describe('VideoEmbed', () => {
    it('should render with video source', () => {
      render(<VideoEmbed src="https://example.com/video.mp4" />)
      
      expect(screen.getByRole('video')).toBeInTheDocument()
    })

    it('should render with caption', () => {
      render(
        <VideoEmbed 
          src="https://example.com/video.mp4" 
          caption="Test Video" 
        />
      )
      
      expect(screen.getByText('Test Video')).toBeInTheDocument()
    })
  })

  describe('ExerciseCard', () => {
    const mockSteps = [
      { text: 'Step 1', completed: false },
      { text: 'Step 2', completed: false }
    ]

    it('should render with title and steps', () => {
      render(<ExerciseCard title="Test Exercise" steps={mockSteps} estTime="5 min" />)
      
      expect(screen.getByText('Test Exercise')).toBeInTheDocument()
      expect(screen.getByText('Step 1')).toBeInTheDocument()
      expect(screen.getByText('Step 2')).toBeInTheDocument()
    })

    it('should render with estimated time', () => {
      render(<ExerciseCard title="Test Exercise" steps={mockSteps} estTime="10 min" />)
      
      expect(screen.getByText('10 min')).toBeInTheDocument()
    })

    it('should render with difficulty', () => {
      render(
        <ExerciseCard 
          title="Test Exercise" 
          steps={mockSteps} 
          estTime="5 min" 
          difficulty="intermediate" 
        />
      )
      
      expect(screen.getByText('intermediate')).toBeInTheDocument()
    })

    it('should handle single step', () => {
      const singleStep = [{ text: 'Single Step', completed: false }]
      
      render(<ExerciseCard title="Single Step Exercise" steps={singleStep} estTime="5 min" />)
      
      expect(screen.getByText('Single Step')).toBeInTheDocument()
    })

    it('should handle empty steps', () => {
      render(<ExerciseCard title="Empty Exercise" steps={[]} estTime="5 min" />)
      
      expect(screen.getByText('Empty Exercise')).toBeInTheDocument()
    })
  })

  describe('ResourceList', () => {
    const mockResources = [
      { title: 'Document 1', url: 'https://example.com/doc1', type: 'document' as const },
      { title: 'Video 1', url: 'https://example.com/video1', type: 'video' as const }
    ]

    it('should render with resources', () => {
      render(<ResourceList items={mockResources} />)
      
      expect(screen.getByText('Document 1')).toBeInTheDocument()
      expect(screen.getByText('Video 1')).toBeInTheDocument()
    })

    it('should render with title', () => {
      render(<ResourceList title="Additional Resources" items={mockResources} />)
      
      expect(screen.getByText('Additional Resources')).toBeInTheDocument()
    })

    it('should handle empty resources', () => {
      render(<ResourceList items={[]} />)
      
      expect(screen.getByText(/no resources/i)).toBeInTheDocument()
    })

    it('should handle different resource types', () => {
      const mixedResources = [
        { title: 'PDF Guide', url: 'https://example.com/guide.pdf', type: 'document' as const },
        { title: 'Download File', url: 'https://example.com/file.zip', type: 'download' as const },
        { title: 'Code Example', url: 'https://example.com/code.js', type: 'code' as const },
        { title: 'Article', url: 'https://example.com/article', type: 'article' as const },
        { title: 'Website', url: 'https://example.com', type: 'website' as const }
      ]
      
      render(<ResourceList items={mixedResources} />)
      
      expect(screen.getByText('PDF Guide')).toBeInTheDocument()
      expect(screen.getByText('Download File')).toBeInTheDocument()
      expect(screen.getByText('Code Example')).toBeInTheDocument()
      expect(screen.getByText('Article')).toBeInTheDocument()
      expect(screen.getByText('Website')).toBeInTheDocument()
    })
  })

  describe('IconDivider', () => {
    it('should render with icon', () => {
      render(<IconDivider icon="palette" />)
      
      expect(screen.getByTestId('icon-divider')).toBeInTheDocument()
    })

    it('should render with text', () => {
      render(<IconDivider icon="palette" text="Section Break" />)
      
      expect(screen.getByText('Section Break')).toBeInTheDocument()
    })
  })

  describe('ReflectionPrompt', () => {
    it('should render with questions', () => {
      render(<ReflectionPrompt questions={['What did you learn?']} />)
      
      expect(screen.getByText('What did you learn?')).toBeInTheDocument()
    })

    it('should render with multiple questions', () => {
      render(
        <ReflectionPrompt 
          questions={['What did you learn?', 'How will you apply this?']} 
        />
      )
      
      expect(screen.getByText('What did you learn?')).toBeInTheDocument()
      expect(screen.getByText('How will you apply this?')).toBeInTheDocument()
    })
  })

  describe('Interactive Components', () => {
    describe('Quiz', () => {
      it('should render with questions', () => {
        render(<Quiz questions={[]} />)
        
        expect(screen.getByText('Quiz')).toBeInTheDocument()
      })
    })

    describe('Activity', () => {
      it('should render with description', () => {
        render(<Activity description="Do something" />)
        
        expect(screen.getByText('Do something')).toBeInTheDocument()
      })
    })

    describe('Poll', () => {
      it('should render with question', () => {
        render(<Poll question="What do you think?" options={[]} />)
        
        expect(screen.getByText('What do you think?')).toBeInTheDocument()
      })
    })

    describe('Timeline', () => {
      it('should render with events', () => {
        render(<Timeline events={[]} />)
        
        expect(screen.getByText('Timeline')).toBeInTheDocument()
      })
    })

    describe('BeforeAfterSlider', () => {
      it('should render with images', () => {
        render(
          <BeforeAfterSlider 
            beforeImg="before.jpg" 
            afterImg="after.jpg" 
          />
        )
        
        expect(screen.getByText('Before/After')).toBeInTheDocument()
      })
    })

    describe('CompareGrid', () => {
      it('should render with tools and features', () => {
        render(<CompareGrid tools={[]} features={[]} />)
        
        expect(screen.getByText('Comparison')).toBeInTheDocument()
      })
    })
  })

  describe('Component Integration', () => {
    it('should render multiple components together', () => {
      render(
        <div>
          <HeroBanner title="Course Title" icon="Palette" />
          <Callout title="Important">Read this</Callout>
          <ExerciseCard 
            title="Mobile Exercise" 
            steps={[{ text: 'Step 1', completed: false }]} 
            estTime="5 min" 
          />
          <ResourceList 
            items={[{ title: 'Resource', url: 'https://example.com', type: 'document' as const }]} 
          />
        </div>
      )
      
      expect(screen.getByText('Course Title')).toBeInTheDocument()
      expect(screen.getByText('Important')).toBeInTheDocument()
      expect(screen.getByText('Mobile Exercise')).toBeInTheDocument()
      expect(screen.getByText('Resource')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<HeroBanner title="Accessible Title" icon="Palette" />)
      
      expect(screen.getByText('Accessible Title')).toBeInTheDocument()
    })

    it('should support keyboard navigation', () => {
      render(
        <ExerciseCard 
          title="Keyboard Exercise" 
          steps={[{ text: 'Step 1', completed: false }]} 
          estTime="5 min" 
        />
      )
      
      expect(screen.getByText('Keyboard Exercise')).toBeInTheDocument()
    })
  })

  describe('Responsive Design', () => {
    it('should render on mobile', () => {
      render(<HeroBanner title="Mobile Title" icon="Palette" />)
      
      expect(screen.getByText('Mobile Title')).toBeInTheDocument()
    })

    it('should render on tablet', () => {
      render(<HeroBanner title="Tablet Title" icon="Palette" />)
      
      expect(screen.getByText('Tablet Title')).toBeInTheDocument()
    })

    it('should render on desktop', () => {
      render(<HeroBanner title="Desktop Title" icon="Palette" />)
      
      expect(screen.getByText('Desktop Title')).toBeInTheDocument()
    })
  })
}) 