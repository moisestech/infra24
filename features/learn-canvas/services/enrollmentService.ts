// useSubscriptionStore not available
// getPricingTier not available

export interface EnrollmentStatus {
  isEnrolled: boolean
  hasAccess: boolean
  subscriptionTier: string | null
  canAccess: boolean
  reason?: string
}

export interface WorkshopAccess {
  workshopId: string
  isEnrolled: boolean
  hasAccess: boolean
  subscriptionRequired: boolean
  subscriptionTier: string | null
  enrolledAt?: string
  completedAt?: string
  reason?: string
}

export class EnrollmentService {
  private static instance: EnrollmentService

  static getInstance(): EnrollmentService {
    if (!EnrollmentService.instance) {
      EnrollmentService.instance = new EnrollmentService()
    }
    return EnrollmentService.instance
  }

  /**
   * Check if user can access a specific workshop
   */
  async checkWorkshopAccess(
    userId: string | null,
    workshopSlug: string
  ): Promise<WorkshopAccess> {
    // Complete workshop access rules for all 18 workshops
    const workshopAccessRules = {
      // 🎬 Creative & Media (8 workshops)
      'ai-filmmaking': { requiresSubscription: true, minTier: 'creator' },
      'advanced-ai-filmmaking': { requiresSubscription: true, minTier: 'pro' },
      'ai-animation': { requiresSubscription: true, minTier: 'creator' },
      'ai-documentary': { requiresSubscription: true, minTier: 'creator' },
      'ai-vfx': { requiresSubscription: true, minTier: 'pro' },
      'ai-advertising': { requiresSubscription: true, minTier: 'creator' },
      'ai-art-fundamentals': { requiresSubscription: true, minTier: 'creator' },
      'ai-photography': { requiresSubscription: true, minTier: 'creator' },

      // 🤖 Technical & Development (3 workshops)
      'llm-fundamentals': { requiresSubscription: true, minTier: 'creator' },
      'vibecoding': { requiresSubscription: true, minTier: 'pro' },
      'ai-game-development': { requiresSubscription: true, minTier: 'pro' },

      // 🧠 Ethical & Philosophical (4 workshops)
      'ethical-ai-journalism': { requiresSubscription: true, minTier: 'creator' },
      'ai-ethics-governance': { requiresSubscription: true, minTier: 'pro' },
      'ai-social-impact': { requiresSubscription: true, minTier: 'creator' },
      'ai-philosophy': { requiresSubscription: true, minTier: 'org-seat' },

      // 💼 Business & Marketing (2 workshops)
      'vibe-marketing': { requiresSubscription: true, minTier: 'creator' },
      'smart-sign-101': { requiresSubscription: false, minTier: 'explorer' },

      // 🆓 Free & Foundation (1 workshop)
      'ai-literacy-digital-citizenship': { requiresSubscription: false, minTier: 'explorer' }
    }

    const rule = workshopAccessRules[workshopSlug as keyof typeof workshopAccessRules]
    
    if (!rule) {
      return {
        workshopId: workshopSlug,
        isEnrolled: false,
        hasAccess: false,
        subscriptionRequired: false,
        subscriptionTier: null,
        reason: 'Workshop not found'
      }
    }

    // If no user, check if workshop is free
    if (!userId) {
      return {
        workshopId: workshopSlug,
        isEnrolled: false,
        hasAccess: !rule.requiresSubscription,
        subscriptionRequired: rule.requiresSubscription,
        subscriptionTier: null,
        reason: rule.requiresSubscription ? 'Authentication required' : 'Free workshop'
      }
    }

    // Mock subscription check - assume user has access for now
    const subscription = { status: 'active', tier: 'pro' }

    if (!subscription || subscription.status !== 'active') {
      return {
        workshopId: workshopSlug,
        isEnrolled: false,
        hasAccess: false,
        subscriptionRequired: rule.requiresSubscription,
        subscriptionTier: null,
        reason: 'Active subscription required'
      }
    }

    // Mock tier check - assume user has pro tier
    const tierLevels = { explorer: 0, creator: 1, pro: 2, 'org-seat': 3 }
    const userLevel = tierLevels[subscription.tier as keyof typeof tierLevels] || 0
    const requiredLevel = tierLevels[rule.minTier as keyof typeof tierLevels] || 0

    if (userLevel < requiredLevel) {
      return {
        workshopId: workshopSlug,
        isEnrolled: false,
        hasAccess: false,
        subscriptionRequired: rule.requiresSubscription,
        subscriptionTier: subscription.tier,
        reason: `Upgrade to ${rule.minTier} tier required`
      }
    }

    // Check if user is enrolled (mock enrollment check)
    const isEnrolled = await this.checkUserEnrollment(userId, workshopSlug)

    return {
      workshopId: workshopSlug,
      isEnrolled,
      hasAccess: true,
      subscriptionRequired: rule.requiresSubscription,
      subscriptionTier: subscription.tier,
      enrolledAt: isEnrolled ? new Date().toISOString() : undefined
    }
  }

  /**
   * Enroll user in a workshop
   */
  async enrollUserInWorkshop(
    userId: string,
    workshopSlug: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Check access first
      const access = await this.checkWorkshopAccess(userId, workshopSlug)
      
      if (!access.hasAccess) {
        return {
          success: false,
          error: access.reason || 'Access denied'
        }
      }

      // Mock enrollment - in real implementation, this would save to database
      const enrollmentKey = `enrollment_${userId}_${workshopSlug}`
      localStorage.setItem(enrollmentKey, JSON.stringify({
        userId,
        workshopSlug,
        enrolledAt: new Date().toISOString(),
        status: 'enrolled'
      }))

      return { success: true }
    } catch (error) {
      console.error('Error enrolling user in workshop:', error)
      return {
        success: false,
        error: 'Failed to enroll in workshop'
      }
    }
  }

  /**
   * Check if user is enrolled in a workshop (mock implementation)
   */
  private async checkUserEnrollment(
    userId: string,
    workshopSlug: string
  ): Promise<boolean> {
    try {
      const enrollmentKey = `enrollment_${userId}_${workshopSlug}`
      const enrollment = localStorage.getItem(enrollmentKey)
      return !!enrollment
    } catch (error) {
      console.error('Error checking enrollment:', error)
      return false
    }
  }

  /**
   * Get user's enrolled workshops
   */
  async getUserEnrollments(userId: string): Promise<string[]> {
    try {
      const enrollments: string[] = []
      const allWorkshopSlugs = [
        // 🎬 Creative & Media (8 workshops)
        'ai-filmmaking',
        'advanced-ai-filmmaking',
        'ai-animation',
        'ai-documentary',
        'ai-vfx',
        'ai-advertising',
        'ai-art-fundamentals',
        'ai-photography',

        // 🤖 Technical & Development (3 workshops)
        'llm-fundamentals',
        'vibecoding',
        'ai-game-development',

        // 🧠 Ethical & Philosophical (4 workshops)
        'ethical-ai-journalism',
        'ai-ethics-governance',
        'ai-social-impact',
        'ai-philosophy',

        // 💼 Business & Marketing (2 workshops)
        'vibe-marketing',
        'smart-sign-101',

        // 🆓 Free & Foundation (1 workshop)
        'ai-literacy-digital-citizenship'
      ]

      // Check localStorage for enrollments
      for (const slug of allWorkshopSlugs) {
        const enrollmentKey = `enrollment_${userId}_${slug}`
        const enrollment = localStorage.getItem(enrollmentKey)
        if (enrollment) {
          enrollments.push(slug)
        }
      }

      return enrollments
    } catch (error) {
      console.error('Error getting user enrollments:', error)
      return []
    }
  }

  /**
   * Get enrollment status for all workshops
   */
  async getAllWorkshopAccess(
    userId: string | null
  ): Promise<Record<string, WorkshopAccess>> {
    const workshopSlugs = [
      'ethical-ai-journalism',
      'ai-art-fundamentals',
      'ai-data-visualization',
      'ai-music-creation',
      'ai-video-production',
      'ai-writing-content'
    ]

    const accessMap: Record<string, WorkshopAccess> = {}

    for (const slug of workshopSlugs) {
      accessMap[slug] = await this.checkWorkshopAccess(userId, slug)
    }

    return accessMap
  }

  /**
   * Auto-enroll user in accessible workshops based on subscription
   */
  async autoEnrollUser(userId: string): Promise<string[]> {
    try {
      const accessMap = await this.getAllWorkshopAccess(userId)
      const enrolledWorkshops: string[] = []

      for (const [slug, access] of Object.entries(accessMap)) {
        if (access.hasAccess && !access.isEnrolled) {
          const result = await this.enrollUserInWorkshop(userId, slug)
          if (result.success) {
            enrolledWorkshops.push(slug)
          }
        }
      }

      return enrolledWorkshops
    } catch (error) {
      console.error('Error auto-enrolling user:', error)
      return []
    }
  }
}

// Export singleton instance
export const enrollmentService = EnrollmentService.getInstance() 