'use client';

import useEmblaCarousel from 'embla-carousel-react';
import QRCode from '@/components/ui/QRCode';
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
  Bell,
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
import { useState, useCallback, useEffect, useMemo } from 'react';
import { Announcement } from '@/types/announcement';
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

function formatDateWithDay(dateStr: string) {
  const date = new Date(dateStr);
  const day = date.toLocaleString('en-US', { weekday: 'long' });
  const month = date.toLocaleString('en-US', { month: 'short' });
  const dayNum = date.getDate();
  return {
    dayOfWeek: day,
    date: `${month} ${dayNum}`
  };
}

// Pattern-based template using BackgroundPattern
function PatternTemplate({ announcement, styles, IconComponent, orientation }: TemplateProps & { orientation: 'portrait' | 'landscape' }) {
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

  // Use starts_at if available, otherwise use created_at
  const eventDate = announcement.starts_at || announcement.created_at;
  const dateStatus = getDateStatus(eventDate);

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

  // Format time from starts_at
  const formatTime = (dateStr: string) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="relative w-full h-full">
      {/* Base gradient background */}
      <div className={cn("absolute inset-0", styles.gradient)} />

      {/* Pattern overlay */}
      {isMounted && (
        <div className="absolute inset-0 z-10">
          <BackgroundPattern 
            type={announcement.type || 'event'} 
            subType={announcement.sub_type || 'exhibition'}
            width={dimensions.width}
            height={dimensions.height}
          />
        </div>
      )}

      {/* Absolute positioned date display */}
      <motion.div 
        className="absolute top-16 right-8 md:right-12 text-right z-20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Day of Week */}
        <motion.div 
          className="text-4xl xl:text-6xl 2xl:text-8xl 3xl:text-10xl font-bold text-white/80 mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {formatDateWithDay(eventDate).dayOfWeek}
        </motion.div>

        {/* Date */}
        <motion.div className="text-[10rem] md:text-[12rem] xl:text-[16rem] 2xl:text-[20rem] 3xl:text-[24rem] font-black text-white tracking-tighter leading-none">
          {formatDateWithDay(eventDate).date}
        </motion.div>

        {/* Time if available */}
        {formatTime(eventDate) && (
          <motion.div className="text-3xl xl:text-5xl 2xl:text-6xl 3xl:text-8xl text-white/60 font-medium tracking-tight mt-2">
            {formatTime(eventDate)}
          </motion.div>
        )}

        {/* Days Left Badge */}
        <motion.div 
          className={cn(
            `inline-flex items-center rounded-full mt-4 font-bold ${
              orientation === 'portrait'
                ? 'gap-3 xl:gap-5 2xl:gap-7 3xl:gap-9 px-6 xl:px-8 2xl:px-10 3xl:px-14 py-3 xl:py-4 2xl:py-5 3xl:py-7 text-2xl xl:text-3xl 2xl:text-4xl 3xl:text-5xl 4xl:text-7xl'
                : 'gap-2 xl:gap-4 2xl:gap-6 3xl:gap-8 px-4 xl:px-6 2xl:px-8 3xl:px-12 py-2 xl:py-3 2xl:py-4 3xl:py-6 text-xl xl:text-2xl 2xl:text-3xl 3xl:text-4xl 4xl:text-6xl'
            }`,
            dateStatus.type === 'today' ? "bg-green-500 text-white" : 
            dateStatus.type === 'past' ? "bg-red-500 text-white" : 
            "bg-blue-500 text-white"
          )}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
        >
          <span className="flex items-center gap-2">
            {dateStatus.type === 'today' ? (
              <>🎯 Today</>
            ) : dateStatus.type === 'future' ? (
              <>⏰ {dateStatus.message}</>
            ) : (
              <>📅 {dateStatus.message}</>
            )}
          </span>
        </motion.div>
      </motion.div>

      {/* Main content */}
      <motion.div 
        className="relative z-20 h-full p-20 md:p-32 xl:p-40 2xl:p-48 3xl:p-56 flex flex-col justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-4xl xl:max-w-6xl 2xl:max-w-7xl 3xl:max-w-8xl space-y-16 xl:space-y-20 2xl:space-y-24 3xl:space-y-28">
          {/* Type Badge */}
          <motion.div 
            className="inline-flex items-center gap-4 xl:gap-6 px-8 xl:px-12 py-4 xl:py-6 rounded-full bg-white/10 backdrop-blur-sm"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <IconComponent className="w-10 h-10 xl:w-14 xl:h-14 2xl:w-16 2xl:h-16 3xl:w-20 3xl:h-20 text-white" />
            <span className="text-3xl xl:text-4xl 2xl:text-5xl 3xl:text-6xl font-bold text-white uppercase tracking-wider">
              {(announcement.sub_type || announcement.type || 'announcement').replace('_', ' ')}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h2 
            className={cn(
              `font-black tracking-tight leading-none ${
                orientation === 'portrait'
                  ? 'text-5xl md:text-6xl xl:text-7xl 2xl:text-8xl 3xl:text-9xl 4xl:text-[10rem]'
                  : 'text-6xl md:text-7xl xl:text-9xl 2xl:text-[12rem] 3xl:text-[16rem] 4xl:text-[20rem]'
              }`,
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
            className={`text-white/80 leading-snug ${
              orientation === 'portrait'
                ? 'text-3xl md:text-4xl xl:text-5xl 2xl:text-6xl 3xl:text-7xl 4xl:text-8xl max-w-2xl xl:max-w-3xl 2xl:max-w-4xl 3xl:max-w-5xl 4xl:max-w-6xl'
                : 'text-5xl md:text-5xl xl:text-6xl 2xl:text-7xl 3xl:text-8xl 4xl:text-9xl max-w-3xl xl:max-w-4xl 2xl:max-w-5xl 3xl:max-w-6xl 4xl:max-w-7xl'
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {announcement.body || announcement.additional_info || 'No description available'}
          </motion.p>

          {/* Footer Info */}
          <div className="flex items-center justify-between">
            {announcement.location && (
              <motion.div 
                className={`flex items-center gap-4 xl:gap-6 2xl:gap-8 3xl:gap-10 4xl:gap-12 text-white/80 ${
                  orientation === 'portrait' 
                    ? 'text-3xl xl:text-4xl 2xl:text-5xl 3xl:text-6xl 4xl:text-9xl' 
                    : 'text-2xl xl:text-3xl 2xl:text-4xl 3xl:text-5xl 4xl:text-8xl'
                }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <MapPin className={`${
                  orientation === 'portrait'
                    ? 'w-12 h-12 xl:w-16 xl:h-16 2xl:w-20 2xl:h-20 3xl:w-24 3xl:h-24 4xl:w-48 4xl:h-48'
                    : 'w-8 h-8 xl:w-10 xl:h-10 2xl:w-12 2xl:h-12 3xl:w-16 3xl:h-16 4xl:w-32 4xl:h-32'
                }`} />
                <span>{announcement.location}</span>
              </motion.div>
            )}

            <div className="flex items-center gap-6 xl:gap-8 2xl:gap-10 3xl:gap-12">
              {/* QR Code */}
              <motion.div 
                className={`bg-white/90 backdrop-blur-sm rounded-lg ${
                  orientation === 'portrait' 
                    ? 'p-3 xl:p-4 2xl:p-6 3xl:p-8 4xl:p-12' 
                    : 'p-2 xl:p-3 2xl:p-4 3xl:p-6 4xl:p-8'
                }`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
              >
                <QRCode 
                  value={announcement.primary_link || `https://art-events.vercel.app/announcements/${announcement.id}`}
                  size={orientation === 'portrait' ? 600 : 400}
                  className={`${
                    orientation === 'portrait'
                      ? 'w-24 h-24 xl:w-40 xl:h-40 2xl:w-56 2xl:h-56 3xl:w-72 3xl:h-72 4xl:w-96 4xl:h-96'
                      : 'w-20 h-20 xl:w-32 xl:h-32 2xl:w-48 2xl:h-48 3xl:w-64 3xl:h-64 4xl:w-80 4xl:h-80'
                  }`}
                />
              </motion.div>

              {announcement.primary_link && (
                <motion.a 
                  href={announcement.primary_link}
                  className={`inline-flex items-center text-white hover:text-white/80 transition-colors group bg-white/10 backdrop-blur-sm rounded-full ${
                    orientation === 'portrait'
                      ? 'gap-6 xl:gap-8 2xl:gap-10 3xl:gap-12 4xl:gap-16 px-12 xl:px-16 2xl:px-20 3xl:px-24 4xl:px-32 py-6 xl:py-8 2xl:py-10 3xl:py-12 4xl:py-16 text-3xl xl:text-4xl 2xl:text-5xl 3xl:text-6xl 4xl:text-8xl'
                      : 'gap-4 xl:gap-6 2xl:gap-8 3xl:gap-10 4xl:gap-12 px-8 xl:px-12 2xl:px-16 3xl:px-20 4xl:px-24 py-4 xl:py-6 2xl:py-8 3xl:py-10 4xl:py-12 text-2xl xl:text-3xl 2xl:text-4xl 3xl:text-5xl 4xl:text-7xl'
                  }`}
                  whileHover={{ scale: 1.05 }}
                >
                  Learn More
                  <ExternalLink className={`group-hover:translate-x-1 transition-transform ${
                    orientation === 'portrait'
                      ? 'w-8 h-8 xl:w-10 xl:h-10 2xl:w-12 2xl:h-12 3xl:w-14 3xl:h-14 4xl:w-20 4xl:h-20'
                      : 'w-6 h-6 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10 3xl:w-12 3xl:h-12 4xl:w-16 4xl:h-16'
                  }`} />
                </motion.a>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Create type-safe icon mappings
type UrgentSubTypes = 'closure' | 'weather' | 'safety' | 'parking';
type FacilitySubTypes = 'maintenance' | 'cleaning' | 'storage' | 'renovation';
type EventSubTypes = 'exhibition' | 'workshop' | 'talk' | 'social' | 'performance' | 'open_studios';
type OpportunitySubTypes = 'open_call' | 'job' | 'commission' | 'residency' | 'funding';
type AdministrativeSubTypes = 'survey' | 'document' | 'deadline' | 'policy';

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
    duration: 60,
    watchDrag: true,
  });
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('landscape');
  const [screenRatio, setScreenRatio] = useState(1);

  // Orientation and screen ratio detection
  useEffect(() => {
    const updateOrientation = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const ratio = width / height;
      
      setScreenRatio(ratio);
      setOrientation(ratio > 1 ? 'landscape' : 'portrait');
    };

    updateOrientation();
    window.addEventListener('resize', updateOrientation);
    window.addEventListener('orientationchange', updateOrientation);

    return () => {
      window.removeEventListener('resize', updateOrientation);
      window.removeEventListener('orientationchange', updateOrientation);
    };
  }, []);

  // Filter and sort announcements
  const futureAnnouncements = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return announcements
      .filter(announcement => {
        // Use starts_at if available, otherwise use created_at
        const announcementDate = new Date(announcement.starts_at || announcement.created_at);
        announcementDate.setHours(0, 0, 0, 0);
        return announcementDate >= today;
      })
      .sort((a, b) => {
        const dateA = new Date(a.starts_at || a.created_at);
        const dateB = new Date(b.starts_at || b.created_at);
        return dateA.getTime() - dateB.getTime();
      });
  }, [announcements]);

  // Move hooks to the top level
  const scrollPrev = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollPrev();
    // Handle looping to last slide
    if (currentIndex === 0) {
      setCurrentIndex(futureAnnouncements.length - 1);
    } else {
      setCurrentIndex(prev => prev - 1);
    }
  }, [emblaApi, currentIndex, futureAnnouncements.length]);

  const scrollNext = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
    // Handle looping to first slide
    if (currentIndex === futureAnnouncements.length - 1) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  }, [emblaApi, currentIndex, futureAnnouncements.length]);

  // Auto-play effect
  useEffect(() => {
    if (!emblaApi || isPaused) return;

    const intervalId = setInterval(() => {
      if (currentIndex === futureAnnouncements.length - 1) {
        emblaApi.scrollTo(0);
        setCurrentIndex(0);
      } else {
        emblaApi.scrollNext();
        setCurrentIndex(prev => prev + 1);
      }
    }, 10000);

    return () => clearInterval(intervalId);
  }, [emblaApi, isPaused, currentIndex, futureAnnouncements.length]);

  // Handle empty state
  if (futureAnnouncements.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold mb-2">No Upcoming Events</h2>
          <p className="text-gray-600">Check back soon for new announcements!</p>
        </div>
      </div>
    );
  }

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
      overlay: "bg-black/20",
      accent: "from-gray-200 to-slate-200",
      badge: "bg-gray-500",
      text: "text-white",
      dateStyle: "bg-gray-700/90 text-white",
      icon: FileText,
      backgroundPattern: "dots"
    }
  };

  // Helper function to get icon for announcement
  const getIconForAnnouncement = (announcement: Announcement): LucideIcon => {
    const type = announcement.type || 'event';
    const subType = announcement.sub_type || 'exhibition';
    
    const typeIconMap = typeIcons[type as keyof TypeIconMappings];
    if (typeIconMap && subType in typeIconMap) {
      return (typeIconMap as any)[subType];
    }
    
    // Fallback icons
    switch (type) {
      case 'urgent': return AlertTriangle;
      case 'facility': return Building2;
      case 'event': return PartyPopper;
      case 'opportunity': return Sparkles;
      case 'administrative': return FileText;
      default: return Bell;
    }
  };

  return (
    <div className="relative h-screen bg-white">
      {/* Progress indicator */}
      <div className="absolute top-4 left-4 z-30 flex items-center gap-2">
        {futureAnnouncements.map((_, idx) => (
          <motion.div
            key={idx}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              currentIndex === idx ? "w-8 bg-white" : "w-2 bg-white/50"
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />
        ))}
      </div>

      {/* Carousel content */}
      <div className="overflow-hidden h-full" ref={emblaRef}>
        <div className="flex h-full">
          {futureAnnouncements.map((announcement, index) => (
            <div 
              key={`${announcement.id}-${index}`}
              className="flex-[0_0_100%] min-w-0 relative h-full"
            >
              <PatternTemplate 
                announcement={announcement}
                styles={typeStyles[announcement.type || 'event']}
                IconComponent={getIconForAnnouncement(announcement)}
                orientation={orientation}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation buttons */}
      <button
        onClick={scrollPrev}
        className="absolute left-8 top-1/2 -translate-y-1/2 p-6 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all"
      >
        <ChevronLeft className="w-8 h-8 text-white" />
      </button>

      <button
        onClick={scrollNext}
        className="absolute right-8 top-1/2 -translate-y-1/2 p-6 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all"
      >
        <ChevronRight className="w-8 h-8 text-white" />
      </button>

      {/* Play/Pause button */}
      <button
        onClick={() => setIsPaused(!isPaused)}
        className="absolute bottom-8 right-8 z-30 p-4 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all flex items-center gap-2"
      >
        {isPaused ? (
          <>
            <Play className="w-6 h-6 text-white" />
            <span className="text-white text-sm font-medium">Play</span>
          </>
        ) : (
          <>
            <Pause className="w-6 h-6 text-white" />
            <span className="text-white text-sm font-medium">Pause</span>
          </>
        )}
      </button>
    </div>
  );
}
