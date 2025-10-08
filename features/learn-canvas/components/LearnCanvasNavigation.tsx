'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
// useLanguage not available
import { ChevronDown, ChevronRight, BookOpen, Lock, Play, Pause } from 'lucide-react';

interface NavNode {
  title: string;
  slug?: string;
  children?: NavNode[];
}

interface LearnCanvasNavigationProps {
  curriculum: any;
  currentSlug?: string;
  expandedPath?: string[];
  workshopSlug?: string;
}

export function LearnCanvasNavigation({ 
  curriculum, 
  currentSlug = "", 
  expandedPath = [], 
  workshopSlug = "" 
}: LearnCanvasNavigationProps) {
  // Simple fallback for language support
  const t = (key: string) => key;
  const language: string = 'en';
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const getTranslatedWorkshopTitle = () => {
    if (workshopSlug === 'ai-video-production') {
      return t('ai_video_workshop.title') || curriculum.title;
    }
    return curriculum.title;
  };

  const getTranslatedTitle = (node: NavNode) => {
    if (node.slug && workshopSlug === 'ai-video-production') {
      return t(`ai_video_workshop.chapters.${node.slug}.title`) || node.title;
    }
    return node.title;
  };

  const isCurrentChapter = (slug: string) => {
    return pathname.includes(slug);
  };

  const renderChapterLink = (node: NavNode, index: number) => {
    if (!node.slug) return null;
    
    const isCurrent = isCurrentChapter(node.slug);
    const translatedTitle = getTranslatedTitle(node);
    const isFirstChapter = index === 0;
    const isRestricted = !isFirstChapter;
    
    if (isRestricted) {
      return (
        <div
          key={node.slug}
          className="px-3 py-2 text-sm rounded-md text-gray-500 cursor-not-allowed flex items-center gap-2"
        >
          <Lock className="w-3 h-3" />
          {translatedTitle}
          <span className="text-xs bg-gray-700 px-2 py-1 rounded">Premium</span>
        </div>
      );
    }
    
    const chapterUrl = language && language !== 'en' 
      ? `/learn/${workshopSlug}/${node.slug}?lang=${language}`
      : `/learn/${workshopSlug}/${node.slug}`;

    return (
      <Link
        key={node.slug}
        href={chapterUrl}
        className={`px-3 py-2 text-sm rounded-md transition-colors ${
          isCurrent
            ? 'bg-[#00ff00]/20 text-[#00ff00] border border-[#00ff00]/30'
            : 'text-gray-300 hover:text-white hover:bg-gray-800'
        }`}
      >
        {translatedTitle}
      </Link>
    );
  };

  const renderChapters = () => {
    // Navigate the nested curriculum structure to find chapters
    const chapters = curriculum?.courses?.[0]?.weeks?.[0]?.days?.[0]?.lessons?.[0]?.chapters;
    if (!chapters) return null;
    
    return chapters.map((chapter: any, index: number) => renderChapterLink(chapter, index));
  };

  return (
    <div className="bg-gray-900/50 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Workshop Title */}
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#00ff00]" />
            <h2 className="text-lg font-semibold text-white">
              {getTranslatedWorkshopTitle()}
            </h2>
          </div>

          {/* Chapter Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 px-3 py-2 text-sm text-gray-300 hover:text-white transition-colors"
            >
              Chapters
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Expanded Chapter List */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-gray-800">
            <div className="flex flex-wrap gap-2">
              {renderChapters()}
            </div>
          </div>
        )}

        {/* Chapter Images Demo Section */}
        {workshopSlug === 'ai-video-production' && (
          <div className="mt-4 pt-4 border-t border-gray-800">
            <div className="bg-gradient-to-r from-[#00ff00]/10 to-[#00ff00]/5 border border-[#00ff00]/30 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-[#00ff00]/20 rounded-full flex items-center justify-center">
                  <span className="text-[#00ff00] text-lg">🎬</span>
                </div>
                <div>
                  <h3 className="text-[#00ff00] font-semibold text-sm">
                    {language === 'es' ? 'La Historia del Video con IA' : 'The History of AI Video'}
                  </h3>
                  <p className="text-gray-300 text-xs">
                    {language === 'es' ? 'Galería de imágenes' : 'Image Gallery'}
                  </p>
                </div>
              </div>
              
              {/* Image Carousel */}
              <div className="relative bg-black/50 rounded-lg overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  {/* Chapter Images */}
                  <div className="w-full h-full relative">
                    <img
                      src="https://res.cloudinary.com/dck5rzi4h/image/upload/v1757795792/ai24/workshops/ai-video-production/01-history-of-ai-video/stages-of-machine-generated-creativity_vt9llg.png"
                      alt={language === 'es' ? 'Evolución de las tecnologías de IA' : 'Evolution of AI Technologies'}
                      className="w-full h-full object-cover opacity-90"
                    />
                    
                    {/* Overlay with play button */}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <button
                        onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#00ff00]/20 border border-[#00ff00]/30 rounded-lg text-[#00ff00] hover:bg-[#00ff00]/30 transition-colors text-sm backdrop-blur-sm"
                      >
                        {isVideoPlaying ? (
                          <>
                            <Pause className="w-5 h-5" />
                            {language === 'es' ? 'Pausar' : 'Pause'}
                          </>
                        ) : (
                          <>
                            <Play className="w-5 h-5" />
                            {language === 'es' ? 'Ver galería' : 'View Gallery'}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Image Gallery Overlay (when playing) */}
                {isVideoPlaying && (
                  <div className="absolute inset-0 bg-black/90 flex items-center justify-center p-4">
                    <div className="text-center max-w-4xl">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <img
                          src="https://res.cloudinary.com/dck5rzi4h/image/upload/v1757799487/ai24/workshops/ai-video-production/01-history-of-ai-video/2017-birth-of-deepfake_kpvtxy.png"
                          alt={language === 'es' ? 'Nacimiento del deepfake' : 'Birth of Deepfake'}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <img
                          src="https://res.cloudinary.com/dck5rzi4h/image/upload/v1757799267/ai24/workshops/ai-video-production/01-history-of-ai-video/2017-2018-deepfake-revolution_gv88xp.png"
                          alt={language === 'es' ? 'Revolución del deepfake' : 'Deepfake Revolution'}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <img
                          src="https://res.cloudinary.com/dck5rzi4h/image/upload/v1757803322/ai24/workshops/ai-video-production/01-history-of-ai-video/ai24-ai-video-production-2022-meta-make-a-video_sqrhn6.png"
                          alt={language === 'es' ? 'Meta Make-A-Video' : 'Meta Make-A-Video'}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <img
                          src="https://res.cloudinary.com/dck5rzi4h/image/upload/v1757805203/ai24/workshops/ai-video-production/01-history-of-ai-video/ai24-ai-video-production-2023-open-source-gen2_g2z5yt.png"
                          alt={language === 'es' ? 'Runway Gen-2' : 'Runway Gen-2'}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      </div>
                      <p className="text-[#00ff00] text-sm mb-2">
                        {language === 'es' ? 'Galería de imágenes del capítulo' : 'Chapter Image Gallery'}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {language === 'es' 
                          ? 'Evolución del video con IA: 2017-2025' 
                          : 'AI Video Evolution: 2017-2025'
                        }
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Description */}
              <div className="mt-3 text-xs text-gray-400">
                <p>
                  {language === 'es' 
                    ? 'Explora las imágenes clave que muestran la evolución de la tecnología de video con IA desde los deepfakes hasta las herramientas creativas actuales.'
                    : 'Explore key images showing the evolution of AI video technology from deepfakes to today\'s creative tools.'
                  }
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}