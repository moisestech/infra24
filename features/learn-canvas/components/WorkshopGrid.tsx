'use client'

import { WorkshopCard } from './WorkshopCard'
import { WorkshopSummary } from '@/shared/types/workshop'
import ASCIIAnimation from '@/shared/components/ui/ASCIIAnimation'
import { LiquidLoader } from '@/shared/components/ui/LiquidLoader'
import { useLanguage } from '@/shared/i18n/LanguageProvider'
import { useState, useEffect } from 'react'
import { Badge } from '@/shared/components/ui/badge'

interface WorkshopGridProps {
  filter?: string
  limit?: number
}

const FEATURED_WORKSHOPS = [
  'ai-art-fundamentals',
  'vibecoding',
  'ai-literacy-digital-citizenship',
];

// Define workshop categories based on actual workshop data
const WORKSHOP_CATEGORIES = {
  'AI Art & Creative': [
    'ai-art-fundamentals',
    'ai-animation',
    'ai-photography',
    'ai-vfx',
    'ai-music-creation'
  ],
  'AI Media & Production': [
    'ai-filmmaking',
    'advanced-ai-filmmaking',
    'ai-documentary',
    'ai-advertising',
    'ai-video-production',
    'ai-writing-content'
  ],
  'AI Development & Technical': [
    'vibecoding',
    'llm-fundamentals',
    'ai-game-development',
    'ai-data-visualization'
  ],
  'AI Ethics & Social Impact': [
    'ai-literacy-digital-citizenship',
    'ai-ethics-governance',
    'ai-philosophy',
    'ai-social-impact',
    'ethical-ai-journalism'
  ],
  'Business & Marketing': [
    'vibe-marketing',
    'smart-sign-101'
  ]
};

export function WorkshopGrid({ filter, limit }: WorkshopGridProps) {
  const { t } = useLanguage();
  const [allWorkshops, setAllWorkshops] = useState<WorkshopSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scrollPositions, setScrollPositions] = useState<{ [key: string]: number }>({});

  // Fetch workshops on component mount
  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/workshops');
        if (!response.ok) {
          throw new Error('Failed to fetch workshops');
        }
        const data = await response.json();
        if (data.success) {
          setAllWorkshops(data.workshops);
        } else {
          throw new Error(data.error || 'Failed to load workshops');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load workshops');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkshops();
  }, []);

  // Organize workshops by category
  const workshopsByCategory = Object.entries(WORKSHOP_CATEGORIES).map(([categoryName, workshopSlugs]) => {
    const workshops = workshopSlugs
      .map(slug => allWorkshops.find(w => w.slug === slug))
      .filter((w): w is WorkshopSummary => Boolean(w))
      .map(workshop => ({
        ...workshop,
        featured: FEATURED_WORKSHOPS.includes(workshop.slug) || workshop.featured,
        total_chapters: workshop.total_chapters ?? 0,
        published_chapters: workshop.published_chapters ?? 0,
        avg_chapter_duration: workshop.avg_chapter_duration ?? 0
      }));

    return {
      categoryName,
      workshops: workshops.slice(0, 5), // Limit to 5 workshops per category for display
      totalWorkshops: workshops.length // Keep track of total workshops in category
    };
  }).filter(category => category.workshops.length > 0);

  // Apply filter if provided
  const filteredCategories = filter ? workshopsByCategory.map(category => ({
    ...category,
    workshops: category.workshops.filter(workshop =>
      workshop.title.toLowerCase().includes(filter.toLowerCase()) ||
      workshop.description?.toLowerCase().includes(filter.toLowerCase())
    )
  })).filter(category => category.workshops.length > 0) : workshopsByCategory;

  // Handle scroll for mobile horizontal scrolling
  const handleScroll = (categoryName: string, event: React.UIEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;
    const scrollLeft = target.scrollLeft;
    const maxScrollLeft = target.scrollWidth - target.clientWidth;
    const scrollPercentage = maxScrollLeft > 0 ? (scrollLeft / maxScrollLeft) * 100 : 0;
    
    setScrollPositions(prev => ({
      ...prev,
      [categoryName]: scrollPercentage
    }));
  };

  return (
    <div className="space-y-8">
      {/* ASCII Animation Header */}
      <div className="relative overflow-hidden rounded-lg bg-gray-900/50 p-6 border border-gray-800">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-white learn-heading mb-2">{t('learn.workshops.available')}</h2>
          <p className="text-gray-300 learn-body">{t('learn.workshops.explore')}</p>
        </div>
      </div>

      {/* Workshop Categories */}
      {loading ? (
        <div className="text-center py-12">
          <LiquidLoader size="md" className="mb-4" />
          <div className="text-lg text-[#00ff00]">{t('learn.workshops.loading')}</div>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="text-red-400">{t('learn.workshops.error')}</div>
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="text-center py-12 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none">
            <ASCIIAnimation 
              fps={12} 
              colorOverlay={false} 
              frameCount={10}
              className="text-gray-400"
            />
          </div>
          <div className="relative z-10">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 learn-heading">
              {t('learn.workshops.no_workshops')}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 learn-body">
              {t('learn.workshops.try_adjusting')}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {filteredCategories.map((category) => (
            <div key={category.categoryName} className="space-y-4">
              {/* Category Header */}
              <div className="flex items-center justify-between category-header">
                <h3 className="text-xl font-bold text-white learn-heading">
                  {category.categoryName}
                </h3>
                <Badge variant="outline" className="text-gray-400 border-gray-600">
                  {category.totalWorkshops} workshops
                </Badge>
              </div>

              {/* Workshop Grid - Horizontal scroll on mobile, grid on desktop */}
              <div className="workshop-grid-container relative">
                {/* Mobile scroll indicator */}
                <div className="md:hidden absolute top-1/2 -translate-y-1/2 right-2 z-10 bg-black/50 rounded-full p-2 pointer-events-none scroll-indicator">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                
                <div 
                  className="flex gap-4 overflow-x-auto pb-4 md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:overflow-x-visible md:pb-0 scrollbar-hide"
                  onScroll={(e) => handleScroll(category.categoryName, e)}
                >
                  {category.workshops.map((workshop) => (
                    <div key={workshop.slug} className="flex-shrink-0 w-64 md:w-auto md:flex-shrink">
                      <WorkshopCard
                        workshop={workshop}
                      />
                    </div>
                  ))}
                </div>
                
                {/* Mobile scroll progress indicator */}
                {category.workshops.length > 3 && (
                  <div className="md:hidden mt-3 flex flex-col items-center space-y-2">
                    <div className="text-xs text-gray-400 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                      </svg>
                      <span>Scroll to see more</span>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                    <div className="flex space-x-1">
                      {Array.from({ length: Math.ceil(category.workshops.length / 2) }, (_, i) => (
                        <div
                          key={i}
                          className={`h-1 rounded-full transition-all duration-300 ${
                            scrollPositions[category.categoryName] >= (i * 50) && 
                            scrollPositions[category.categoryName] < ((i + 1) * 50)
                              ? 'bg-lime-400 w-6'
                              : 'bg-gray-600 w-3'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Show more indicator if there are more than 5 workshops */}
              {category.totalWorkshops > 5 && (
                <div className="text-center mt-4">
                  <Badge variant="outline" className="text-gray-400 border-gray-600 text-sm">
                    +{category.totalWorkshops - 5} more workshops available
                  </Badge>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Quick Stats */}
      <div className="relative overflow-hidden rounded-lg bg-gray-900/30 p-6 border border-gray-800">
        <div className="absolute bottom-4 left-4 opacity-10 pointer-events-none">
          <ASCIIAnimation 
            fps={15} 
            colorOverlay={false} 
            frameCount={10}
            className="text-gray-400 text-xs"
          />
        </div>
        <div className="relative z-10">
          <h3 className="text-lg font-semibold text-white learn-heading mb-4 text-center">Learning Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-black dark:text-white learn-heading">
                {allWorkshops.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300 learn-body">
                Total Workshops
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400 learn-heading">
                0
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300 learn-body">
                Enrolled
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 learn-heading">
                0
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300 learn-body">
                Accessible
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 learn-heading">
                {filteredCategories.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300 learn-body">
                Categories
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 