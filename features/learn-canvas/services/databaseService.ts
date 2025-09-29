import { getAdminSupabase } from '@/shared/lib/supabase/client';

export interface DatabaseWorkshop {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  featured: boolean;
  published: boolean;
  estimated_duration: number | null;
  prerequisites: string[] | null;
  learning_objectives: string[] | null;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface DatabaseChapter {
  id: string;
  workshop_id: string;
  slug: string;
  title: string;
  content: string;
  order_index: number;
  estimated_duration: number | null;
  is_premium: boolean;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface DatabaseUserProgress {
  id: string;
  user_id: string;
  workshop_id: string;
  chapter_id: string;
  status: 'not_started' | 'in_progress' | 'completed';
  progress_percentage: number;
  time_spent: number;
  completed_at: string | null;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface DatabaseUserSubscription {
  id: string;
  user_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  plan: 'basic' | 'pro' | 'enterprise';
  status: 'active' | 'cancelled' | 'expired' | 'past_due';
  current_period_start: string | null;
  current_period_end: string | null;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

class DatabaseService {
  private supabase = getAdminSupabase();

  // Workshop operations
  async getWorkshops(filters?: {
    category?: string;
    difficulty?: string;
    featured?: boolean;
    published?: boolean;
  }): Promise<any[]> {
    let query = this.supabase
      .from('workshops')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.category) {
      query = query.eq('category', filters.category);
    }
    if (filters?.difficulty) {
      query = query.eq('difficulty', filters.difficulty);
    }
    if (filters?.featured !== undefined) {
      query = query.eq('featured', filters.featured);
    }
    if (filters?.published !== undefined) {
      query = query.eq('published', filters.published);
    }

    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching workshops:', error);
      throw new Error('Failed to fetch workshops');
    }

    return data || [];
  }

  async getWorkshop(slug: string): Promise<any | null> {
    const { data, error } = await this.supabase
      .from('workshops')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error('Error fetching workshop:', error);
      return null;
    }

    return data;
  }

  async getChapters(workshopId: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('chapters')
      .select('*')
      .eq('workshop_id', workshopId)
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Error fetching chapters:', error);
      throw new Error('Failed to fetch chapters');
    }

    return data || [];
  }

  async getChapter(workshopId: string, chapterSlug: string): Promise<any | null> {
    const { data, error } = await this.supabase
      .from('chapters')
      .select('*')
      .eq('workshop_id', workshopId)
      .eq('slug', chapterSlug)
      .single();

    if (error) {
      console.error('Error fetching chapter:', error);
      return null;
    }

    return data as unknown as DatabaseChapter;
  }

  // User progress operations
  async getUserProgress(userId: string, workshopId?: string): Promise<any[]> {
    let query = this.supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId);

    if (workshopId) {
      query = query.eq('workshop_id', workshopId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching user progress:', error);
      throw new Error('Failed to fetch user progress');
    }

    return data || [];
  }

  async updateUserProgress(
    userId: string,
    chapterId: string,
    progress: Partial<DatabaseUserProgress>
  ): Promise<any> {
    const { data, error } = await this.supabase
      .from('user_progress')
      .upsert({
        user_id: userId,
        chapter_id: chapterId,
        ...progress,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error updating user progress:', error);
      throw new Error('Failed to update user progress');
    }

    return data;
  }

  async markChapterComplete(userId: string, chapterId: string): Promise<void> {
    await this.updateUserProgress(userId, chapterId, {
      status: 'completed',
      progress_percentage: 100,
      completed_at: new Date().toISOString()
    });
  }

  // Subscription operations
  async getUserSubscription(userId: string): Promise<any | null> {
    const { data, error } = await this.supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching user subscription:', error);
      return null;
    }

    return data;
  }

  async createUserSubscription(
    userId: string,
    subscription: Partial<DatabaseUserSubscription>
  ): Promise<any> {
    const { data, error } = await this.supabase
      .from('user_subscriptions')
      .insert({
        user_id: userId,
        ...subscription
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating user subscription:', error);
      throw new Error('Failed to create user subscription');
    }

    return data;
  }

  async updateUserSubscription(
    userId: string,
    updates: Partial<DatabaseUserSubscription>
  ): Promise<any> {
    const { data, error } = await this.supabase
      .from('user_subscriptions')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating user subscription:', error);
      throw new Error('Failed to update user subscription');
    }

    return data;
  }

  // Workshop enrollment operations
  async enrollUserInWorkshop(userId: string, workshopId: string): Promise<void> {
    const { error } = await this.supabase
      .from('workshop_enrollments')
      .insert({
        user_id: userId,
        workshop_id: workshopId
      });

    if (error) {
      console.error('Error enrolling user in workshop:', error);
      throw new Error('Failed to enroll user in workshop');
    }
  }

  async getUserEnrollments(userId: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('workshop_enrollments')
      .select(`
        *,
        workshops (
          id,
          slug,
          title,
          description,
          category,
          difficulty
        )
      `)
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching user enrollments:', error);
      throw new Error('Failed to fetch user enrollments');
    }

    return data || [];
  }

  // Analytics and reporting
  async getWorkshopProgressSummary(workshopId: string): Promise<any> {
    const { data, error } = await this.supabase
      .from('workshop_progress_summary')
      .select('*')
      .eq('workshop_id', workshopId)
      .single();

    if (error) {
      console.error('Error fetching workshop progress summary:', error);
      return null;
    }

    return data;
  }

  async getUserWorkshopProgress(userId: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('user_workshop_progress')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching user workshop progress:', error);
      throw new Error('Failed to fetch user workshop progress');
    }

    return data || [];
  }
}

export const databaseService = new DatabaseService(); 