'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  MapPin, 
  ExternalLink, 
  Clock,
  AlertTriangle,
  Building2,
  PartyPopper,
  Sparkles,
  FileText,
  CloudRainWind,
  ShieldAlert,
  CarFront,
  Hammer,
  Brush,
  Package,
  Palette,
  Users,
  MessageSquare,
  Theater,
  Briefcase,
  Award,
  Home,
  DollarSign,
  ClipboardCheck,
  FileQuestion,
  Pause,
  Play
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useCallback, useEffect } from 'react';
import { Announcement, AnnouncementSubType } from '@/types/announcement';
import { cn } from '@/lib/utils';
import { BackgroundPattern } from '@/components/BackgroundPattern';
import { LucideIcon } from 'lucide-react';

interface AnnouncementCarouselProps {
  announcements: Announcement[];
}

// Update TypeStyle interface
interface TypeStyle {
  gradient: string;
  overlay?: string;
  accent: string;
  badge?: string;
  text: string;
  dateStyle?: string;
  icon?: LucideIcon;
  backgroundPattern?: string;
}

interface TypeStyles {
  [key: string]: TypeStyle;
}

interface TemplateProps {
  announcement: Announcement;
  styles: TypeStyle;
  IconComponent: LucideIcon;
}

// Standard template
function StandardTemplate({ announcement, styles, IconComponent }: TemplateProps) {
  return (
    <motion.div 
      className="relative z-10 h-full p-12 md:p-20 flex flex-col justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto w-full space-y-12">
        {/* Move date to top and make it more prominent */}
        <div className="flex flex-wrap gap-8 text-xl">
          <div className="flex items-center gap-3">
            <Calendar className="w-8 h-8" />
            <span className="text-5xl md:text-6xl font-bold tracking-tight">
              {announcement.date}
            </span>
            {announcement.time && (
              <span className="text-3xl text-white/80">
                {announcement.time}
              </span>
            )}
          </div>
        </div>

        {/* Type Badge */}
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm">
          <IconComponent className="w-8 h-8 text-white" />
          <span className="text-2xl font-bold text-white uppercase tracking-wider">
            {announcement.type}
          </span>
        </div>

        {/* Title */}
        <h2 className={cn(
          "text-7xl md:text-8xl xl:text-9xl font-black tracking-tight leading-none",
          styles.text
        )}>
          {announcement.title}
        </h2>

        {/* Description */}
        <p className="text-3xl md:text-4xl text-white/80 max-w-4xl leading-relaxed">
          {announcement.description}
        </p>

        {/* Call to Action */}
        {announcement.primary_link && (
          <a 
            href={announcement.primary_link}
            className="inline-flex items-center gap-3 text-2xl text-white hover:text-white/80 transition-colors group"
          >
            Learn More
            <ExternalLink className="w-8 h-8 group-hover:translate-x-1 transition-transform" />
          </a>
        )}
      </div>
    </motion.div>
  );
}

// Pattern-based template using BackgroundPattern
function PatternTemplate({ announcement, styles, IconComponent }: TemplateProps) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  return (
    <div id="pattern-template" className="relative w-full h-full">
      {/* Base gradient background */}
      <div className={cn(
        "absolute inset-0",
        styles.gradient
      )} />

      {/* Pattern overlay */}
      {isMounted && (
        <div className="absolute inset-0 z-10">
          <BackgroundPattern 
            type={announcement.type} 
            subType={announcement.subType}
            width={dimensions.width}
            height={dimensions.height}
          />
        </div>
      )}

      {/* Content */}
      <motion.div 
        className="relative z-20 h-full p-12 md:p-20 flex flex-col justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto w-full space-y-12">
          {/* Type Badge with SubType Icon */}
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm">
            <IconComponent className="w-8 h-8 text-white" />
            <span className="text-2xl font-bold text-white uppercase tracking-wider">
              {announcement.subType.replace('_', ' ')}
            </span>
          </div>
          
          {/* Title */}
          <h2 className={cn(
            "text-7xl md:text-8xl xl:text-9xl font-black tracking-tight leading-none",
            styles.text
          )}>
            {announcement.title}
          </h2>

          {/* Info Row */}
          <div className="flex flex-wrap gap-8 text-xl text-white/90">
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6" />
              <span>{announcement.date}</span>
            </div>
            {announcement.time && (
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6" />
                <span>{announcement.time}</span>
              </div>
            )}
            {announcement.location && (
              <div className="flex items-center gap-3">
                <MapPin className="w-6 h-6" />
                <span>{announcement.location}</span>
              </div>
            )}
          </div>

          {/* Description */}
          <p className="text-3xl md:text-4xl text-white/80 max-w-4xl leading-relaxed">
            {announcement.description}
          </p>

          {/* Call to Action */}
          {announcement.primary_link && (
            <a 
              href={announcement.primary_link}
              className="inline-flex items-center gap-3 text-2xl text-white hover:text-white/80 transition-colors group"
            >
              Learn More
              <ExternalLink className="w-8 h-8 group-hover:translate-x-1 transition-transform" />
            </a>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// Create type-safe icon mappings
type UrgentSubTypes = Extract<AnnouncementSubType, 'closure' | 'weather' | 'safety' | 'parking'>;
type FacilitySubTypes = Extract<AnnouncementSubType, 'maintenance' | 'cleaning' | 'storage' | 'renovation'>;
type EventSubTypes = Extract<AnnouncementSubType, 'exhibition' | 'workshop' | 'talk' | 'social' | 'performance' | 'open_studios'>;
type OpportunitySubTypes = Extract<AnnouncementSubType, 'open_call' | 'job' | 'commission' | 'residency' | 'funding'>;
type AdministrativeSubTypes = Extract<AnnouncementSubType, 'survey' | 'document' | 'deadline' | 'policy'>;

interface TypeIconMappings {
  urgent: Record<UrgentSubTypes, LucideIcon>;
  facility: Record<FacilitySubTypes, LucideIcon>;
  event: Record<EventSubTypes, LucideIcon>;
  opportunity: Record<OpportunitySubTypes, LucideIcon>;
  administrative: Record<AdministrativeSubTypes, LucideIcon>;
}

export function AnnouncementCarousel({ announcements }: AnnouncementCarouselProps) {
  console.log('AnnouncementCarousel rendering with announcements:', announcements);
  
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

  // Get most recent 7 announcements
  const recentAnnouncements = announcements
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 7);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    
    onSelect();
    emblaApi.on('select', onSelect);
    
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  // Auto-play functionality
  useEffect(() => {
    if (!emblaApi || !isAutoPlaying) return;

    const intervalId = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(intervalId);
  }, [emblaApi, isAutoPlaying]);

  // Update the icon mappings with proper typing
  const typeIcons: TypeIconMappings = {
    urgent: {
      closure: AlertTriangle,
      weather: CloudRainWind,
      safety: ShieldAlert,
      parking: CarFront
    },
    facility: {
      maintenance: Hammer,
      cleaning: Brush,
      storage: Package,
      renovation: Building2
    },
    event: {
      exhibition: Palette,
      workshop: Users,
      talk: MessageSquare,
      social: PartyPopper,
      performance: Theater,
      open_studios: Building2
    },
    opportunity: {
      open_call: Sparkles,
      job: Briefcase,
      commission: Award,
      residency: Home,
      funding: DollarSign
    },
    administrative: {
      survey: ClipboardCheck,
      document: FileText,
      deadline: Clock,
      policy: FileQuestion
    }
  };

  const typeStyles: TypeStyles = {
    urgent: {
      gradient: "bg-gradient-to-br from-red-600 via-red-500 to-orange-500",
      overlay: "bg-black/20",
      accent: "from-red-300 to-orange-300",
      badge: "bg-red-500",
      text: "text-white",
      dateStyle: "bg-red-700/90 text-white",
      icon: AlertTriangle,
      backgroundPattern: "radial-gradient-dots"
    },
    facility: {
      gradient: "bg-gradient-to-br from-blue-600 via-blue-500 to-sky-500",
      overlay: "bg-black/20",
      accent: "from-blue-300 to-sky-300",
      badge: "bg-blue-500",
      text: "text-white",
      dateStyle: "bg-blue-700/90 text-white",
      icon: Building2,
      backgroundPattern: "diagonal-lines"
    },
    event: {
      gradient: "bg-gradient-to-br from-yellow-500 via-amber-500 to-orange-400",
      overlay: "bg-black/10",
      accent: "from-yellow-300 to-amber-300",
      badge: "bg-yellow-500",
      text: "text-white",
      dateStyle: "bg-yellow-600/90 text-white",
      icon: PartyPopper,
      backgroundPattern: "confetti"
    },
    opportunity: {
      gradient: "bg-gradient-to-br from-purple-500/90 to-fuchsia-500/90",
      accent: "from-purple-200 to-fuchsia-200",
      text: "text-white",
      backgroundPattern: "sparkles"
    },
    administrative: {
      gradient: "bg-gradient-to-br from-gray-500/90 to-slate-500/90",
      accent: "from-gray-200 to-slate-200",
      text: "text-white",
      backgroundPattern: "dots"
    }
  };

  // Add console log to check styles
  console.log('Type styles configured:', typeStyles);

  return (
    <div className="relative h-screen bg-white">
      {/* Move auto-play toggle button to bottom right */}
      <button
        onClick={() => setIsAutoPlaying(!isAutoPlaying)}
        className="absolute bottom-8 right-8 z-30 p-4 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all flex items-center gap-2"
      >
        {isAutoPlaying ? (
          <>
            <Pause className="w-6 h-6 text-white" />
            <span className="text-white text-sm font-medium">Pause</span>
          </>
        ) : (
          <>
            <Play className="w-6 h-6 text-white" />
            <span className="text-white text-sm font-medium">Play</span>
          </>
        )}
      </button>

      <div className="overflow-hidden h-full" ref={emblaRef}>
        <div className="flex h-full touch-pan-y">
          {recentAnnouncements.map((announcement) => {
            console.log('Processing announcement:', {
              id: announcement.id,
              type: announcement.type,
              subType: announcement.subType,
              template: announcement.template
            });

            const IconComponent = typeIcons[announcement.type][announcement.subType as keyof typeof typeIcons[typeof announcement.type]];
            const styles = typeStyles[announcement.type];
            
            console.log('Styles and Icon:', {
              styles,
              hasIcon: !!IconComponent
            });

            const isPatternTemplate = announcement.template === 'pattern';
            console.log('Template selection:', { isPatternTemplate });
            
            return (
              <div
                key={announcement.id}
                className={cn(
                  "flex-[0_0_100%] min-w-0 relative h-full",
                  styles.gradient
                )}
              >
                {isPatternTemplate ? (
                  <PatternTemplate 
                    announcement={announcement}
                    styles={styles}
                    IconComponent={IconComponent}
                  />
                ) : (
                  <StandardTemplate 
                    announcement={announcement}
                    styles={styles}
                    IconComponent={IconComponent}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        className={cn(
          "absolute left-8 top-1/2 -translate-y-1/2 p-6 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all",
          !prevBtnEnabled && "opacity-50 cursor-not-allowed"
        )}
        onClick={scrollPrev}
        disabled={!prevBtnEnabled}
      >
        <ChevronLeft className="w-8 h-8 text-white" />
      </button>

      <button
        className={cn(
          "absolute right-8 top-1/2 -translate-y-1/2 p-6 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all",
          !nextBtnEnabled && "opacity-50 cursor-not-allowed"
        )}
        onClick={scrollNext}
        disabled={!nextBtnEnabled}
      >
        <ChevronRight className="w-8 h-8 text-white" />
      </button>
    </div>
  );
} 