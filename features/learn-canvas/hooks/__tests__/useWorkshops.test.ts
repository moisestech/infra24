// @jest-environment jsdom
/// <reference types="jest" />
import { renderHook, waitFor } from '@testing-library/react'
import { useWorkshops } from '../useWorkshops'

// Mock the fetch API
global.fetch = jest.fn()

describe('useWorkshops Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getWorkshops', () => {
    it('should fetch workshops successfully', async () => {
      const mockWorkshops = [
        {
          id: '1',
          slug: 'ai-filmmaking',
          title: 'AI Filmmaking',
          description: 'Learn AI filmmaking',
          difficulty_level: 'beginner',
          category: 'film',
          featured: true,
          published: true,
          metadata: {},
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z',
        }
      ]

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => ({ success: true, workshops: mockWorkshops })
      })

      const { result } = renderHook(() => useWorkshops())

      await waitFor(() => {
        expect(result.current.workshops).toEqual(mockWorkshops)
        expect(result.current.loading).toBe(false)
        expect(result.current.error).toBeNull()
      })
    })

    it('should handle errors gracefully', async () => {
      const errorMessage = 'Failed to fetch workshops'
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => ({ success: false, error: errorMessage })
      })

      const { result } = renderHook(() => useWorkshops())

      await waitFor(() => {
        expect(result.current.error).toBe(errorMessage)
        expect(result.current.loading).toBe(false)
        expect(result.current.workshops).toEqual([])
      })
    })

    it('should return initial state', () => {
      const { result } = renderHook(() => useWorkshops())
      
      expect(result.current.workshops).toEqual([])
      expect(result.current.loading).toBe(true)
      expect(result.current.error).toBeNull()
    })
  })
}) 