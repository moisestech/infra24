import { aiVideoTimelineData, aiVideoTimelineEvents } from '../aiVideoTimelineData'

describe('aiVideoTimelineData', () => {
  describe('aiVideoTimelineData', () => {
    it('contains expected number of events', () => {
      expect(aiVideoTimelineData).toHaveLength(9)
    })

    it('has events with required properties', () => {
      aiVideoTimelineData.forEach(event => {
        expect(event).toHaveProperty('id')
        expect(event).toHaveProperty('date')
        expect(event).toHaveProperty('title')
        expect(event).toHaveProperty('summary')
        expect(event).toHaveProperty('category')
        expect(event).toHaveProperty('tags')
        expect(event).toHaveProperty('image')
      })
    })

    it('has valid date formats', () => {
      aiVideoTimelineData.forEach(event => {
        const date = new Date(event.date)
        expect(date).toBeInstanceOf(Date)
        expect(date.getTime()).not.toBeNaN()
      })
    })

    it('has valid categories', () => {
      const validCategories = ['milestone', 'breakthrough', 'release', 'research', 'controversy', 'adoption']
      
      aiVideoTimelineData.forEach(event => {
        expect(validCategories).toContain(event.category)
      })
    })

    it('has unique IDs', () => {
      const ids = aiVideoTimelineData.map(event => event.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(ids.length)
    })

    it('covers expected time range', () => {
      const dates = aiVideoTimelineData.map(event => new Date(event.date))
      const minDate = new Date(Math.min(...dates.map(d => d.getTime())))
      const maxDate = new Date(Math.max(...dates.map(d => d.getTime())))
      
      expect(minDate.getFullYear()).toBe(2017)
      expect(maxDate.getFullYear()).toBe(2025)
    })

    it('has events in chronological order', () => {
      const dates = aiVideoTimelineData.map(event => new Date(event.date).getTime())
      const sortedDates = [...dates].sort((a, b) => a - b)
      expect(dates).toEqual(sortedDates)
    })

    it('has meaningful titles', () => {
      aiVideoTimelineData.forEach(event => {
        expect(event.title.length).toBeGreaterThan(0)
        expect(event.title).not.toMatch(/^test/i)
      })
    })

    it('has meaningful summaries', () => {
      aiVideoTimelineData.forEach(event => {
        expect(event.summary.length).toBeGreaterThan(10)
        expect(event.summary).not.toMatch(/^test/i)
      })
    })

    it('has relevant tags', () => {
      aiVideoTimelineData.forEach(event => {
        expect(event.tags).toBeInstanceOf(Array)
        expect(event.tags!.length).toBeGreaterThan(0)
        event.tags!.forEach(tag => {
          expect(tag.length).toBeGreaterThan(0)
        })
      })
    })

    it('has image paths', () => {
      aiVideoTimelineData.forEach(event => {
        expect(event.image).toMatch(/^\/img\/ai-video-timeline\//)
        expect(event.image).toMatch(/\.jpg$/)
      })
    })

    it('includes key AI video milestones', () => {
      const titles = aiVideoTimelineData.map(event => event.title)
      
      expect(titles).toContain('Deepfakes Emerge')
      expect(titles).toContain('AI Video Goes Mainstream')
      expect(titles).toContain('Quality Improvements')
      expect(titles).toContain('Professional Control')
    })
  })

  describe('aiVideoTimelineEvents', () => {
    it('contains expected number of events', () => {
      expect(aiVideoTimelineEvents).toHaveLength(9)
    })

    it('has events with required properties', () => {
      aiVideoTimelineEvents.forEach(event => {
        expect(event).toHaveProperty('year')
        expect(event).toHaveProperty('title')
        expect(event).toHaveProperty('description')
        expect(event).toHaveProperty('category')
      })
    })

    it('has valid year formats', () => {
      aiVideoTimelineEvents.forEach(event => {
        expect(event.year).toMatch(/^\d{4}$/)
        const year = parseInt(event.year)
        expect(year).toBeGreaterThanOrEqual(2017)
        expect(year).toBeLessThanOrEqual(2025)
      })
    })

    it('has valid categories', () => {
      const validCategories = ['milestone', 'breakthrough', 'release', 'research']
      
      aiVideoTimelineEvents.forEach(event => {
        expect(validCategories).toContain(event.category)
      })
    })

    it('matches aiVideoTimelineData content', () => {
      expect(aiVideoTimelineEvents).toHaveLength(aiVideoTimelineData.length)
      
      aiVideoTimelineEvents.forEach((event, index) => {
        const originalEvent = aiVideoTimelineData[index]
        expect(event.title).toBe(originalEvent.title)
        expect(event.description).toBe(originalEvent.summary)
        expect(event.year).toBe(new Date(originalEvent.date).getFullYear().toString())
      })
    })

    it('has events in chronological order', () => {
      const years = aiVideoTimelineEvents.map(event => parseInt(event.year))
      const sortedYears = [...years].sort((a, b) => a - b)
      expect(years).toEqual(sortedYears)
    })

    it('has meaningful descriptions', () => {
      aiVideoTimelineEvents.forEach(event => {
        expect(event.description.length).toBeGreaterThan(10)
        expect(event.description).not.toMatch(/^test/i)
      })
    })
  })

  describe('data consistency', () => {
    it('has consistent event counts', () => {
      expect(aiVideoTimelineData).toHaveLength(aiVideoTimelineEvents.length)
    })

    it('has consistent titles', () => {
      aiVideoTimelineData.forEach((event, index) => {
        expect(event.title).toBe(aiVideoTimelineEvents[index].title)
      })
    })

    it('has consistent content', () => {
      aiVideoTimelineData.forEach((event, index) => {
        expect(event.summary).toBe(aiVideoTimelineEvents[index].description)
      })
    })

    it('has consistent years', () => {
      aiVideoTimelineData.forEach((event, index) => {
        const expectedYear = new Date(event.date).getFullYear().toString()
        expect(aiVideoTimelineEvents[index].year).toBe(expectedYear)
      })
    })
  })
})
