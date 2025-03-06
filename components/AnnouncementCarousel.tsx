'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { 
  ChevronLeft, 
  ChevronRight,
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
import { motion } from "framer-motion";
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

// Add this helper function at the top of the file
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
  const day = date.getDate();
  return `${month} ${day}`;
};

// Standard template
function StandardTemplate({ announcement, styles, IconComponent }: TemplateProps) {
  const getDateStatus = (dateStr: string) => {
    const today = new Date();
    const date = new Date(dateStr);
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (date.getTime() === today.getTime()) return { type: 'today', message: 'Happening Today' };
    if (date < today) return { type: 'past', message: `${Math.abs(diffDays)} days ago` };
    return { type: 'future', message: `In ${diffDays} days` };
  };

  const dateStatus = getDateStatus(announcement.date);

  return (
    <motion.div 
      className="relative z-10 h-screen w-full p-8 md:p-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Date Display - Absolute Position */}
      <motion.div 
        className="absolute top-8 right-8 md:right-12 text-right z-20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className={cn(
            "text-[10rem] md:text-[12rem] xl:text-[14rem] font-black tracking-tighter leading-none",
            dateStatus.type === 'today' ? "text-white/90" : 
            dateStatus.type === 'past' ? "text-white/60" : 
            "text-white/90"
          )}
        >
          {formatDate(announcement.date)}
        </motion.div>

        {announcement.time && (
          <motion.div 
            className="text-3xl text-white/60 font-medium tracking-tight mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {announcement.time}
          </motion.div>
        )}

        <motion.div 
          className={cn(
            "text-xl font-bold tracking-tight mt-2",
            dateStatus.type === 'today' ? "text-green-400" : 
            dateStatus.type === 'past' ? "text-red-400" : 
            "text-blue-400"
          )}
        >
          {dateStatus.message}
        </motion.div>
      </motion.div>

      {/* Main Content - Full Width */}
      <div className="h-full flex flex-col justify-center max-w-4xl">
        {/* Type Badge */}
        <motion.div 
          className="inline-flex items-center gap-4 px-8 py-4 rounded-full bg-white/10 backdrop-blur-sm mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <IconComponent className="w-10 h-10 text-white" />
          <span className="text-3xl font-bold text-white uppercase tracking-wider">
            {announcement.subType.replace('_', ' ')}
          </span>
        </motion.div>

        {/* Title and Description */}
        <div className="space-y-8">
          <motion.h2 
            className={cn(
              "text-6xl md:text-7xl xl:text-8xl font-black tracking-tight leading-none",
              styles.text
            )}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {announcement.title}
          </motion.h2>

          <motion.p 
            className="text-2xl md:text-3xl text-white/80 max-w-3xl leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {announcement.description}
          </motion.p>
        </div>

        {/* Footer Info */}
        <div className="flex items-center justify-between mt-12">
          {announcement.location && (
            <motion.div 
              className="flex items-center gap-4 text-2xl text-white/80"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <MapPin className="w-8 h-8" />
              <span>{announcement.location}</span>
            </motion.div>
          )}

          {announcement.primary_link && (
            <motion.a 
              href={announcement.primary_link}
              className="inline-flex items-center gap-4 px-8 py-4 text-2xl text-white hover:text-white/80 transition-colors group bg-white/10 backdrop-blur-sm rounded-full"
              whileHover={{ scale: 1.05 }}
            >
              Learn More
              <ExternalLink className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </motion.a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Pattern-based template using BackgroundPattern
function PatternTemplate({ announcement, styles, IconComponent }: TemplateProps) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isMounted, setIsMounted] = useState(false);

  const getDateStatus = (dateStr: string) => {
    const today = new Date();
    const date = new Date(dateStr);
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (date.getTime() === today.getTime()) return { type: 'today', message: 'Happening Today' };
    if (date < today) return { type: 'past', message: `${Math.abs(diffDays)} days ago` };
    return { type: 'future', message: `In ${diffDays} days` };
  };

  const dateStatus = getDateStatus(announcement.date);

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
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  return (
    <div className="relative w-full h-full">
      {/* Base gradient background */}
      <div className={cn("absolute inset-0", styles.gradient)} />

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

      {/* Absolute positioned date display */}
      <motion.div 
        className="absolute top-8 right-8 md:right-12 text-right z-20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className={cn(
            "text-[10rem] md:text-[12rem] xl:text-[14rem] font-black tracking-tighter leading-none",
            dateStatus.type === 'today' ? "text-white/90" : 
            dateStatus.type === 'past' ? "text-white/60" : 
            "text-white/90"
          )}
        >
          {formatDate(announcement.date)}
        </motion.div>

        {announcement.time && (
          <motion.div 
            className="text-3xl text-white/60 font-medium tracking-tight mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {announcement.time}
          </motion.div>
        )}

        <motion.div 
          className={cn(
            "text-xl font-bold tracking-tight mt-2",
            dateStatus.type === 'today' ? "text-green-400" : 
            dateStatus.type === 'past' ? "text-red-400" : 
            "text-blue-400"
          )}
        >
          {dateStatus.message}
        </motion.div>
      </motion.div>

      {/* Main content */}
      <motion.div 
        className="relative z-20 h-full p-12 md:p-20 flex flex-col justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-4xl space-y-16">
          {/* Type Badge */}
          <motion.div 
            className="inline-flex items-center gap-4 px-8 py-4 rounded-full bg-white/10 backdrop-blur-sm"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <IconComponent className="w-10 h-10 text-white" />
            <span className="text-3xl font-bold text-white uppercase tracking-wider">
              {announcement.subType.replace('_', ' ')}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h2 
            className={cn(
              "text-6xl md:text-7xl xl:text-8xl font-black tracking-tight leading-none",
              styles.text
            )}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {announcement.title}
          </motion.h2>

          {/* Description */}
          <motion.p 
            className="text-2xl md:text-3xl text-white/80 max-w-3xl leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {announcement.description}
          </motion.p>

          {/* Footer Info */}
          <div className="flex items-center justify-between">
            {announcement.location && (
              <motion.div 
                className="flex items-center gap-4 text-2xl text-white/80"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <MapPin className="w-8 h-8" />
                <span>{announcement.location}</span>
              </motion.div>
            )}

            {announcement.primary_link && (
              <motion.a 
                href={announcement.primary_link}
                className="inline-flex items-center gap-4 px-8 py-4 text-2xl text-white hover:text-white/80 transition-colors group bg-white/10 backdrop-blur-sm rounded-full"
                whileHover={{ scale: 1.05 }}
              >
                Learn More
                <ExternalLink className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </motion.a>
            )}
          </div>
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
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    duration: 30
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCurrentIndex(emblaApi.selectedScrollSnap());
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
    if (!emblaApi || !isPaused) return;

    const intervalId = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(intervalId);
  }, [emblaApi, isPaused]);

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
        onClick={() => setIsPaused(!isPaused)}
        className="absolute bottom-8 right-8 z-30 p-4 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all flex items-center gap-2"
      >
        {isPaused ? (
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
        <div className="flex h-full">
          {announcements.map((announcement, index) => {
            // Create a truly unique key using multiple unique identifiers
            const uniqueKey = `${announcement.type}-${announcement.subType}-${announcement.date}-${index}`;
            
            return (
              <div 
                key={uniqueKey}
                className="flex-[0_0_100%] min-w-0 relative h-full"
              >
                {announcement.type === 'event' || announcement.type === 'opportunity' ? (
                  <PatternTemplate 
                    announcement={announcement}
                    styles={typeStyles[announcement.type]}
                    IconComponent={typeIcons[announcement.type][announcement.subType as keyof typeof typeIcons[typeof announcement.type]]}
                  />
                ) : (
                  <StandardTemplate 
                    announcement={announcement}
                    styles={typeStyles[announcement.type]}
                    IconComponent={typeIcons[announcement.type][announcement.subType as keyof typeof typeIcons[typeof announcement.type]]}
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
          currentIndex === 0 && "opacity-50 cursor-not-allowed"
        )}
        onClick={scrollPrev}
        disabled={currentIndex === 0}
      >
        <ChevronLeft className="w-8 h-8 text-white" />
      </button>

      <button
        className={cn(
          "absolute right-8 top-1/2 -translate-y-1/2 p-6 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all",
          currentIndex === announcements.length - 1 && "opacity-50 cursor-not-allowed"
        )}
        onClick={scrollNext}
        disabled={currentIndex === announcements.length - 1}
      >
        <ChevronRight className="w-8 h-8 text-white" />
      </button>
    </div>
  );
} 