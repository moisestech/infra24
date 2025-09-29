// src/features/learn-canvas/services/workshop.client.service.ts
import { Workshop, WorkshopSummary } from '@/shared/types/workshop';

class WorkshopClientService {
  async getWorkshops(): Promise<WorkshopSummary[]> {
    // This will be implemented to fetch from /api/workshops
    console.log('Fetching workshops from API...');
    return [];
  }

  async getWorkshop(slug: string): Promise<Workshop | null> {
    // This will be implemented to fetch from /api/workshops/[slug]
    console.log(`Fetching workshop ${slug} from API...`);
    return null;
  }

  async getChapter(workshopSlug: string, chapterSlug: string): Promise<any> {
    // This should call your API endpoint for a chapter
    try {
      const res = await fetch(`/api/workshops?slug=${workshopSlug}&chapter=${chapterSlug}`);
      if (!res.ok) return null;
      const data = await res.json();
      // If your API returns { chapter: ... }, return data.chapter
      // Otherwise, return data directly
      return data.chapter || data;
    } catch (e) {
      return null;
    }
  }
}

export const workshopClientService = new WorkshopClientService(); 