'use client'

// React & Next.js
import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'

// Authentication
import { useAuth } from '@clerk/nextjs'

// MDX & Content
import { MDXRemote } from 'next-mdx-remote'

// Shared UI Components
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// Separator component not available

// Icons
import { ArrowLeft, ArrowRight, Clock, BookOpen, Target, CheckCircle } from 'lucide-react'
import { FaRedditAlien, FaGoogle, FaGithub } from 'react-icons/fa'
import { FaMeta } from 'react-icons/fa6'
// MidjourneyIcon not available

// Internationalization - useLanguage not available

// Hooks & Services
import { useChapter } from '../hooks/useWorkshops'

// Layout Components
import { LessonShell } from './layout/LessonShell'

// UI Components
import { HeroBanner } from './ui/HeroBanner'
import { Callout } from './ui/Callout'
import { VideoEmbed } from './ui/VideoEmbed'
import { ExerciseCard } from './ui/ExerciseCard'
import { ResourceList } from './ui/ResourceList'
import { IconDivider } from './ui/IconDivider'
import { ReflectionPrompt } from './ui/ReflectionPrompt'
import { VisualEnhancer, DevPlaceholder, ExternalLink } from './ui/VisualEnhancer'
import { Figure, DevFigure } from './ui/Figure'
import { KeyFigure, InlineKeyFigure } from './ui/KeyFigure'

// List Components
import { FeatureList, TimelineList, ChecklistList, AccordionList, ComparisonList, ProcessList } from './ui/ListComponents'

// Interactive Components
import { Quiz } from './interactive/Quiz'
import { Activity } from './interactive/Activity'
import { Poll } from './interactive/Poll'
import { TimelineWrapper } from './interactive/TimelineWrapper'
import { BeforeAfterSlider } from './interactive/BeforeAfterSlider'
import { SignUpPrompt, InlineSignUpPrompt } from './SignUpPrompt'
import { CompareGrid } from './interactive/CompareGrid'

// Presentation Components
import { ChapterPresentationMode } from './presentation/ChapterPresentationMode'

// Utilities
import { generateSlidesFromChapter, aiVideoWorkshopSlides, aiVideoWorkshopSlidesES } from '../utils/slideGenerator'

// Helper function to generate IDs from titles
function generateIdFromTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
}

interface ChapterReaderProps {
  workshopSlug: string
  chapterSlug: string
  chapter: any; // Add chapter data as prop
  chapterContext?: {
    chapter: any;
    lesson: any;
    day: any;
    week: any;
    path: string[];
  } | null;
  mdxSource: any;
  isAuthenticated?: boolean;
  userId?: string | null;
}

export function ChapterReader({ workshopSlug, chapterSlug, chapter, chapterContext, mdxSource, isAuthenticated = false, userId }: ChapterReaderProps) {
  // Remove the useChapter hook since we're getting chapter data from props
  const [currentSection, setCurrentSection] = useState(0)
  const [isPresentationMode, setIsPresentationMode] = useState(false)
  const { isSignedIn } = useAuth();
  const [pricingModalOpen, setPricingModalOpen] = useState(false);
  // Simple fallback for language support
  const t = (key: string, options?: any) => key;
  const language: string = 'en';

  // Get translated content for workshop chapters
  const getTranslatedChapterContent = () => {
    // AI Video Production Workshop
    if (workshopSlug === 'ai-video-production') {
      // Get the translated learning objectives array
      const translatedObjectives = t(`ai_video_workshop.chapters.${chapterSlug}.learning_objectives`, { returnObjects: true });
      
      return {
        title: t(`ai_video_workshop.chapters.${chapterSlug}.title`) || chapter.title,
        subtitle: t(`ai_video_workshop.chapters.${chapterSlug}.subtitle`) || chapter.subtitle,
        learning_objectives: Array.isArray(translatedObjectives) ? translatedObjectives : chapter.learning_objectives
      };
    }
    
    // AI Ethics Courses
    const ethicsCourses = ['ai-ethics-governance', 'ai-social-impact', 'ethical-ai-journalism', 'ai-literacy-digital-citizenship'];
    if (ethicsCourses.includes(workshopSlug)) {
      const courseKey = workshopSlug.replace(/-/g, '_');
      
      return {
        title: t(`courses.${courseKey}.chapters.${chapterSlug}.title`) || chapter.title,
        subtitle: chapter.subtitle,
        learning_objectives: chapter.learning_objectives
      };
    }
    
    return {
      title: chapter.title,
      subtitle: chapter.subtitle,
      learning_objectives: chapter.learning_objectives
    };
  };

  const translatedContent = getTranslatedChapterContent();

  // Placeholder: implement your real access logic here
  function canAccessChapter(workshopSlug: string, chapterNumber: number) {
    // Example: allow access to first chapter for all signed-in users
    if (chapterNumber === 1 && isSignedIn) return true;
    // TODO: check subscription or enrollment for later chapters
    return false;
  }

  // Placeholder: implement your real modal logic here
  function openPricingModal() {
    setPricingModalOpen(true);
  }

  function handleNextChapter() {
    if (!chapter) return;
    const nextChapterNumber = (chapter.chapter_number || 0) + 1;
    if (!isSignedIn) {
      window.location.href = '/sign-in';
      return;
    }
    if (!canAccessChapter(workshopSlug, nextChapterNumber)) {
      // Redirect to pricing page with return URL
      window.location.href = `/pricing?redirect=/learn/${workshopSlug}&reason=subscription_required`;
      return;
    }
    // TODO: implement navigation to next chapter
    // e.g., router.push(`/learn/${workshopSlug}/${nextChapterSlug}${language && language !== 'en' ? `?lang=${language}` : ''}`)
    alert('Navigate to next chapter!');
  }

  // Generate slides for presentation mode
  const slides = useMemo(() => {
    if (workshopSlug === 'ai-video-production') {
      // Use Spanish slides if language is Spanish
      if (language === 'es' && aiVideoWorkshopSlidesES[chapterSlug as keyof typeof aiVideoWorkshopSlidesES]) {
        return aiVideoWorkshopSlidesES[chapterSlug as keyof typeof aiVideoWorkshopSlidesES]
      }
      // Use English slides as default
      if (aiVideoWorkshopSlides[chapterSlug as keyof typeof aiVideoWorkshopSlides]) {
        return aiVideoWorkshopSlides[chapterSlug as keyof typeof aiVideoWorkshopSlides]
      }
    }
    return generateSlidesFromChapter(chapter, language === 'ht' ? 'en' : language as 'en' | 'es' | 'fr')
  }, [chapter, chapterSlug, workshopSlug, language])

  // MDX components mapping
  const mdxComponents = useMemo(() => ({
    // Custom styled elements
    h2: ({ children, ...props }: any) => {
      const id = generateIdFromTitle(children?.toString() || '');
      return (
        <h2 
          id={id}
          className="text-3xl font-bold text-[#00ff00] mb-6 mt-12 first:mt-8 border-l-4 border-[#00ff00] pl-4 bg-[#00ff00]/5 py-3 rounded-r-lg" 
          {...props}
        >
          {children}
        </h2>
      );
    },
    h3: ({ children, ...props }: any) => {
      const id = generateIdFromTitle(children?.toString() || '');
      return (
        <h3 
          id={id}
          className="text-xl font-semibold text-white mb-4 mt-8 border-b border-[#00ff00]/30 pb-2" 
          {...props}
        >
          {children}
        </h3>
      );
    },
    h4: ({ children, ...props }: any) => {
      const id = generateIdFromTitle(children?.toString() || '');
      return (
        <h4 
          id={id}
          className="text-lg font-semibold text-white mb-3 mt-6" 
          {...props}
        >
          {children}
        </h4>
      );
    },
    h5: ({ children, ...props }: any) => {
      const id = generateIdFromTitle(children?.toString() || '');
      return (
        <h5 
          id={id}
          className="text-base font-semibold text-white mb-2 mt-4" 
          {...props}
        >
          {children}
        </h5>
      );
    },
    h6: ({ children, ...props }: any) => {
      const id = generateIdFromTitle(children?.toString() || '');
      return (
        <h6 
          id={id}
          className="text-sm font-semibold text-white mb-2 mt-3" 
          {...props}
        >
          {children}
        </h6>
      );
    },
    
    // UI Components
    HeroBanner,
    Callout,
    VideoEmbed,
    ExerciseCard,
    ResourceList,
    IconDivider,
    ReflectionPrompt,
    DevPlaceholder,
    VisualEnhancer,
    ExternalLink,
    Figure,
    DevFigure,
    KeyFigure,
    InlineKeyFigure,
    
    // List Components
    FeatureList,
    TimelineList,
    ChecklistList,
    AccordionList,
    ComparisonList,
    ProcessList,
    
    // Icons
    FaRedditAlien,
    FaMeta,
    FaGoogle,
    FaGithub,
    
    // Interactive Components - Show sign-up prompts for non-authenticated users
    Quiz: (props: any) => isAuthenticated ? <Quiz {...props} /> : <SignUpPrompt feature="quiz" />,
    Activity: (props: any) => isAuthenticated ? <Activity {...props} /> : <SignUpPrompt feature="activity" />,
    Poll: (props: any) => isAuthenticated ? <Poll {...props} /> : <InlineSignUpPrompt feature="comment" />,
    Timeline: (props: any) => isAuthenticated ? <TimelineWrapper {...props} /> : <InlineSignUpPrompt feature="progress" />,
    TimelineHorizontal: (props: any) => isAuthenticated ? <TimelineWrapper {...props} /> : <InlineSignUpPrompt feature="progress" />,
    BeforeAfterSlider: (props: any) => isAuthenticated ? <BeforeAfterSlider {...props} /> : <InlineSignUpPrompt feature="activity" />,
    CompareGrid: (props: any) => isAuthenticated ? <CompareGrid {...props} /> : <InlineSignUpPrompt feature="activity" />,
    
    // Additional components that might be used in MDX
    EmojiMeter: ({ value }: { value: number }) => 
      isAuthenticated ? (
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span>How are you feeling about this content?</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star} className={star <= value ? 'text-yellow-400' : 'text-gray-600'}>
                {star <= value ? '😊' : '😐'}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <InlineSignUpPrompt feature="comment" title="Share Your Feedback" description="Rate this content and share your thoughts" />
      ),
    
    RatingStars: ({ current }: { current: number }) => 
      isAuthenticated ? (
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span>Rate this content:</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star} className={star <= current ? 'text-yellow-400' : 'text-gray-600'}>
                ★
              </span>
            ))}
          </div>
        </div>
      ) : (
        <InlineSignUpPrompt feature="comment" title="Rate This Content" description="Share your rating and help others discover great content" />
      ),
  }), [isAuthenticated]);

  // Render a breadcrumb if context is available
  const Breadcrumb = () => {
    if (!chapterContext) return null;
    
    // Create a simplified breadcrumb path
    const breadcrumbItems = [
      {
        title: t('workshop.breadcrumb_workshop'),
        href: `/learn/${workshopSlug}`,
        isClickable: true
      },
      {
        title: translatedContent.title || chapterContext.chapter?.title || "Chapter",
        href: null,
        isClickable: false
      }
    ];

    return (
      <nav className="mb-4 text-xs text-gray-400">
        {breadcrumbItems.map((item, index) => (
          <span key={index}>
            {item.isClickable && item.href ? (
              <a 
                href={item.href} 
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                {item.title}
              </a>
            ) : (
              <span className="text-[#00ff00] font-semibold">{item.title}</span>
            )}
            {index < breadcrumbItems.length - 1 && <span className="mx-2">&gt;</span>}
          </span>
        ))}
      </nav>
    );
  };

  // Show presentation mode if enabled
  if (isPresentationMode) {
    return (
      <ChapterPresentationMode
        chapter={chapter}
        slides={slides}
        onExit={() => setIsPresentationMode(false)}
      />
    )
  }

  if (!chapter) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Chapter Not Found</h1>
            <p className="text-gray-400 mb-6">
              The requested chapter could not be found.
            </p>
            <Link href={`/learn/${workshopSlug}`}>
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Workshop
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Render the chapter content as MDX

  // Use chapter number, but treat 0 or missing as 1
  const displayChapterNumber = chapter.chapter_number && chapter.chapter_number > 0 ? chapter.chapter_number : 1;

  return (
    <LessonShell
      title={chapter.title}
      chapterNumber={displayChapterNumber}
      totalChapters={10} // This should come from workshop data
      estimatedDuration={chapter.estimated_duration_minutes}
      onPresentationMode={() => setIsPresentationMode(true)}
    >
      {/* Breadcrumb */}
      <Breadcrumb />
      
      {/* Chapter Header */}
      <div className="mb-8">
        <HeroBanner
          title={translatedContent.title}
          subtitle={t('workshop.chapter_subtitle', { chapterNumber: displayChapterNumber, duration: chapter.estimated_duration_minutes })}
          icon="BookOpen"
          bgGradient="from-[#00ff00]/20 via-[#00ff00]/10 to-black"
          titleClassName="learn-heading"
          subtitleClassName="learn-body"
        />
      </div>

      {/* Learning Objectives */}
      <Card className="mb-8 bg-[#00ff00]/5 border-[#00ff00]/30">
        <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#00ff00] learn-heading">
            <Target className="w-5 h-5 text-[#00ff00]" />
            {t('workshop.learning_objectives')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {translatedContent.learning_objectives.map((objective: string, index: number) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#00ff00] mt-0.5 flex-shrink-0" />
                <span className="text-gray-300 learn-body">{objective}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Chapter Content */}
      <div className="space-y-8">
        {/* Visual Divider */}
        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#00ff00]/30 to-transparent"></div>
          <div className="px-4 py-2 bg-[#00ff00]/10 border border-[#00ff00]/30 rounded-full">
            <span className="text-[#00ff00] text-sm font-mono">{t('workshop.chapter_content')}</span>
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#00ff00]/30 to-transparent"></div>
        </div>
        
        {/* Free Chapter Notice */}
        {workshopSlug === 'ai-video-production' && chapterSlug === '01-introduction-to-ai-video' && (
          <div className="mb-6 p-4 bg-gradient-to-r from-[#00ff00]/10 to-[#00ff00]/5 border border-[#00ff00]/30 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#00ff00]/20 rounded-full flex items-center justify-center">
                <span className="text-[#00ff00] text-sm font-bold">FREE</span>
              </div>
              <div>
                <h3 className="text-[#00ff00] font-semibold">Free Chapter</h3>
                <p className="text-gray-300 text-sm">This is a free preview. Access all chapters with a subscription.</p>
              </div>
            </div>
          </div>
        )}

        {/* Visual Enhancement for AI Video Workshop */}
        {workshopSlug === 'ai-video-production' && (
          <div className="space-y-6 mb-8">
            {chapterSlug === '01-introduction-to-ai-video' && (
              <VisualEnhancer
                type="highlight"
                title={t('workshop.key_insight')}
                description={t('workshop.key_insight_description')}
              />
            )}
            {chapterSlug === '02-ai-video-platform-landscape' && (
              <VisualEnhancer
                type="highlight"
                title="Platform Overview"
                description="From Runway ML to Sora, each platform offers unique capabilities for different use cases."
              />
            )}
            {chapterSlug === '03-hands-on-ai-video-creation' && (
              <VisualEnhancer
                type="highlight"
                title="Hands-On Learning"
                description="Practice with real tools and create your first AI video in this chapter."
              />
            )}
            {chapterSlug === '09-ai-video-in-gaming' && (
              <VisualEnhancer
                type="highlight"
                title="Gaming Revolution"
                description="AI video is transforming how games tell stories and animate characters."
              />
            )}
          </div>
        )}
        
        <MDXRemote {...mdxSource} components={mdxComponents} />
        
        {/* Additional Visual Elements */}
        {workshopSlug === 'ai-video-production' && (
          <div className="space-y-6 mt-8">
            {chapterSlug === '01-introduction-to-ai-video' && (
              <VisualEnhancer
                type="section"
                title="Research Links"
                description="Explore these resources to dive deeper into AI video technology:"
              >
                <div className="space-y-3">
                  <VisualEnhancer
                    type="link"
                    title="Deepfake Technology Timeline"
                    description="Comprehensive overview of deepfake development"
                    url="https://www.britannica.com/technology/deepfake"
                  />
                  <VisualEnhancer
                    type="link"
                    title="AI Video Research Papers"
                    description="Latest research on video generation"
                    url="https://arxiv.org/search/cs?query=video"
                  />
                </div>
              </VisualEnhancer>
            )}
            {chapterSlug === '02-ai-video-platform-landscape' && (
              <VisualEnhancer
                type="section"
                title="Platform Resources"
                description="Explore these platforms and their capabilities:"
              >
                <div className="space-y-3">
                  <VisualEnhancer
                    type="link"
                    title="Runway ML"
                    description="Professional AI video editing platform"
                    url="https://runwayml.com"
                  />
                  <VisualEnhancer
                    type="link"
                    title="OpenAI Sora"
                    description="Latest text-to-video generation model"
                    url="https://openai.com/sora"
                  />
                </div>
              </VisualEnhancer>
            )}
            {chapterSlug === '09-ai-video-in-gaming' && (
              <VisualEnhancer
                type="section"
                title="Gaming Resources"
                description="Explore AI video in gaming:"
              >
                <div className="space-y-3">
                  <VisualEnhancer
                    type="link"
                    title="NVIDIA ACE"
                    description="AI character animation for games"
                    url="https://www.nvidia.com/en-us/ai/ace"
                  />
                  <VisualEnhancer
                    type="link"
                    title="Inworld AI"
                    description="Character personality and behavior AI"
                    url="https://inworld.ai"
                  />
                </div>
              </VisualEnhancer>
            )}
          </div>
        )}
        
        {/* Visual Divider */}
        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#00ff00]/30 to-transparent"></div>
          <div className="px-4 py-2 bg-[#00ff00]/10 border border-[#00ff00]/30 rounded-full">
            <span className="text-[#00ff00] text-sm font-mono">End of Content</span>
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#00ff00]/30 to-transparent"></div>
        </div>
      </div>

      {/* Resources */}
      {chapter.resources.length > 0 && (
        <div className="mt-12">
          <ResourceList
            title="Additional Resources"
            items={chapter.resources.map((resource: any) => ({
              title: resource.title,
              url: resource.url,
              type: resource.type as any,
              description: resource.description
            }))}
          />
        </div>
      )}

      {/* Assignments */}
      {chapter.assignments.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2 learn-heading">
            <BookOpen className="w-5 h-5" />
            Assignments
          </h3>
          <div className="space-y-4">
            {chapter.assignments.map((assignment: any, index: number) => (
              <ExerciseCard
                key={index}
                title={assignment.title}
                steps={[{ text: assignment.description }]}
                estTime={`${assignment.estimated_time} min`}
                difficulty="beginner"
              />
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="mt-12 pt-8 border-t border-[#00ff00]/30">
        <div className="flex justify-between items-center">
          <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous Chapter
          </Button>
          <Button className="bg-[#00ff00] hover:bg-[#00ff00]/80 text-black" onClick={handleNextChapter}>
            Next Chapter
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
      {/* PricingModal not available */}
    </LessonShell>
  )
} 