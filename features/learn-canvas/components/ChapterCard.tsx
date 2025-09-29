import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Play, CheckCircle } from 'lucide-react'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { useLanguage } from '@/shared/i18n/LanguageProvider'
import Link from 'next/link'

interface ChapterCardProps {
  chapter: {
    id: string
    title: string
    chapter_number: number
    estimated_duration_minutes: number
    slug: string
    is_free?: boolean
  }
  workshopSlug: string
  isCompleted?: boolean
  isAccessible?: boolean
}

// Custom Spinner component
function Spinner() {
  return (
    <span className="inline-block w-4 h-4 mr-2 align-middle animate-spin border-2 border-t-transparent border-primary rounded-full" />
  );
}

export function ChapterCard({ chapter, workshopSlug, isCompleted = false, isAccessible = true }: ChapterCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { language, t } = useLanguage();
  const isFree = chapter.is_free ?? (chapter.chapter_number === 1) // First chapter is free by default

  const handleNavigate = (e: React.MouseEvent) => {
    if (!isAccessible || isLoading) return;
    e.preventDefault();
    setIsLoading(true);
    const url = language && language !== 'en' 
      ? `/learn/${workshopSlug}/${chapter.slug}?lang=${language}`
      : `/learn/${workshopSlug}/${chapter.slug}`;
    router.push(url);
  };

  return (
    <Card
      className={`transition-all duration-200 hover:shadow-lg ${
        !isAccessible ? 'opacity-60' : 'hover:scale-[1.02] cursor-pointer'
      } ${isCompleted ? 'border-green-500/50 bg-green-50/10' : 'border-gray-200 dark:border-gray-800'}`}
      onClick={handleNavigate}
      tabIndex={isAccessible ? 0 : -1}
      role="button"
      aria-disabled={!isAccessible || isLoading}
      style={{ pointerEvents: isAccessible ? 'auto' : 'none' }}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-medium">
                {chapter.chapter_number}
              </div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg">{chapter.title}</h3>
                {isCompleted && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
              <span className="flex items-center gap-1">
                <Play className="w-4 h-4" />
                {chapter.estimated_duration_minutes} min
              </span>
              {isFree ? (
                <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Free
                </Badge>
              ) : (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  Premium
                </Badge>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            {isAccessible ? (
              <Button
                variant={isCompleted ? "outline" : "default"}
                size="sm"
                className="min-w-[100px]"
                onClick={handleNavigate}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Spinner /> Loading...
                  </>
                ) : isCompleted ? t('workshop.review') : t('workshop.start')}
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                disabled
                className="min-w-[100px] opacity-50"
              >
                <Lock className="w-4 h-4 mr-1" />
                {t('workshop.locked')}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 