import { useState, useEffect, useCallback } from 'react'
import { useUser } from '@clerk/nextjs'
import { enrollmentService, WorkshopAccess } from '../services/enrollmentService'

export function useEnrollment() {
  const { user } = useUser()
  const [workshopAccess, setWorkshopAccess] = useState<Record<string, WorkshopAccess>>({})
  const [enrolledWorkshops, setEnrolledWorkshops] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const userId = user?.id || null

  // Load workshop access on mount and when user changes
  useEffect(() => {
    const loadWorkshopAccess = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const access = await enrollmentService.getAllWorkshopAccess(userId)
        setWorkshopAccess(access)

        if (userId) {
          const enrollments = await enrollmentService.getUserEnrollments(userId)
          setEnrolledWorkshops(enrollments)
        } else {
          setEnrolledWorkshops([])
        }
      } catch (err) {
        console.error('Error loading workshop access:', err)
        setError('Failed to load workshop access')
      } finally {
        setLoading(false)
      }
    }

    loadWorkshopAccess()
  }, [userId])

  // Enroll in a workshop
  const enrollInWorkshop = useCallback(async (workshopSlug: string) => {
    if (!userId) {
      throw new Error('User must be authenticated to enroll')
    }

    try {
      setError(null)
      const result = await enrollmentService.enrollUserInWorkshop(userId, workshopSlug)
      
      if (result.success) {
        // Update local state
        setEnrolledWorkshops(prev => [...prev, workshopSlug])
        
        // Update access map
        const access = await enrollmentService.checkWorkshopAccess(userId, workshopSlug)
        setWorkshopAccess(prev => ({
          ...prev,
          [workshopSlug]: access
        }))

        return { success: true }
      } else {
        setError(result.error || 'Failed to enroll')
        return { success: false, error: result.error }
      }
    } catch (err) {
      console.error('Error enrolling in workshop:', err)
      setError('Failed to enroll in workshop')
      return { success: false, error: 'Failed to enroll in workshop' }
    }
  }, [userId])

  // Check access for a specific workshop
  const checkWorkshopAccess = useCallback(async (workshopSlug: string) => {
    try {
      const access = await enrollmentService.checkWorkshopAccess(userId, workshopSlug)
      return access
    } catch (err) {
      console.error('Error checking workshop access:', err)
      return {
        workshopId: workshopSlug,
        isEnrolled: false,
        hasAccess: false,
        subscriptionRequired: true,
        subscriptionTier: null,
        reason: 'Error checking access'
      }
    }
  }, [userId])

  // Auto-enroll user in accessible workshops
  const autoEnroll = useCallback(async () => {
    if (!userId) {
      throw new Error('User must be authenticated to auto-enroll')
    }

    try {
      setError(null)
      const enrolled = await enrollmentService.autoEnrollUser(userId)
      
      if (enrolled.length > 0) {
        setEnrolledWorkshops(prev => Array.from(new Set([...prev, ...enrolled])))
        
        // Refresh access map
        const access = await enrollmentService.getAllWorkshopAccess(userId)
        setWorkshopAccess(access)
      }

      return enrolled
    } catch (err) {
      console.error('Error auto-enrolling:', err)
      setError('Failed to auto-enroll')
      return []
    }
  }, [userId])

  // Get workshop access status
  const getWorkshopAccess = useCallback((workshopSlug: string): WorkshopAccess | null => {
    return workshopAccess[workshopSlug] || null
  }, [workshopAccess])

  // Check if user can access a workshop
  const canAccessWorkshop = useCallback((workshopSlug: string): boolean => {
    const access = workshopAccess[workshopSlug]
    return access?.hasAccess || false
  }, [workshopAccess])

  // Check if user is enrolled in a workshop
  const isEnrolledInWorkshop = useCallback((workshopSlug: string): boolean => {
    return enrolledWorkshops.includes(workshopSlug)
  }, [enrolledWorkshops])

  // Check if user can access a specific chapter
  const canAccessChapter = useCallback((workshopSlug: string, chapterNumber: number): boolean => {
    // Allow any logged-in user to access the first chapter only
    if (chapterNumber === 1 && userId) return true;
    // For all other chapters, require active subscription
    const access = workshopAccess[workshopSlug];
    return access?.hasAccess || false;
  }, [workshopAccess, userId]);

  return {
    // State
    workshopAccess,
    enrolledWorkshops,
    loading,
    error,
    
    // Actions
    enrollInWorkshop,
    checkWorkshopAccess,
    autoEnroll,
    
    // Helpers
    getWorkshopAccess,
    canAccessWorkshop,
    isEnrolledInWorkshop,
    canAccessChapter,
    
    // Computed
    totalEnrolled: enrolledWorkshops.length,
    accessibleWorkshops: Object.values(workshopAccess).filter(access => access.hasAccess).length
  }
} 