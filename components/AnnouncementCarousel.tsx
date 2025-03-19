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
import { useState, useCallback, useEffect, useMemo } from 'react';
import { Announcement, AnnouncementSubType } from '@/types/announcement';
import { cn } from '@/lib/utils';
import { BackgroundPattern } from '@/components/BackgroundPattern';
import { LucideIcon } from 'lucide-react';
// import { TextAnimate } from "@/components/magicui/text-animate";

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

// Add this at the top of the file
// const animations = [
//   "blurInUp",
//   "slideUp",
//   "fadeIn",
//   "blurIn",
//   "slideLeft",
//   "scaleUp"
// ] as const;

// type AnimationVariant = typeof animations[number];

// Helper to get random animation
// const getRandomAnimation = (): AnimationVariant => {
//   return animations[Math.floor(Math.random() * animations.length)];
// };

// Standard template
// function StandardTemplate({ announcement, styles, IconComponent }: TemplateProps) {
//   // Get random animations for different text elements
//   const titleAnimation = useMemo(() => getRandomAnimation(), []);
//   const descriptionAnimation = useMemo(() => getRandomAnimation(), []);
//   const metaAnimation = useMemo(() => getRandomAnimation(), []);

//   const getDateStatus = (dateStr: string) => {
//     const today = new Date();
//     const date = new Date(dateStr);
//     today.setHours(0, 0, 0, 0);
//     date.setHours(0, 0, 0, 0);
    
//     const diffTime = date.getTime() - today.getTime();
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
//     if (date.getTime() === today.getTime()) return { type: 'today', message: 'Happening Today' };
//     if (date < today) return { type: 'past', message: `${Math.abs(diffDays)} days ago` };
//     return { type: 'future', message: `In ${diffDays} days` };
//   };

//   const dateStatus = getDateStatus(announcement.date);

//   return (
//     <motion.div 
//       className={cn(
//         "relative z-10 h-screen w-full p-8 md:p-12",
//         styles.gradient,
//         "text-white"
//       )}
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.5 }}
//     >
//       <div className="absolute inset-0 bg-black/30 z-0" />

//       <div className="relative z-10">
//         {/* Date Display - Absolute Position */}
//         <motion.div 
//           className="absolute top-12 right-12 md:right-12 text-right z-20"
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//         >
//           {/* Day of Week */}
//           <motion.div 
//             className="text-4xl font-bold text-white/80 mb-2"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//           >
//             {formatDateWithDay(announcement.date).dayOfWeek}
//           </motion.div>

//           {/* Date */}
//           <motion.div className="text-[10rem] md:text-[12rem] xl:text-[14rem] font-black text-white md:text-whitetracking-tighter leading-none">
//             {formatDateWithDay(announcement.date).date}
//           </motion.div>

//           {/* Time if available */}
//           {announcement.time && (
//             <motion.div className="text-3xl text-white/60 font-medium tracking-tight mt-2">
//               {announcement.time}
//             </motion.div>
//           )}

//           {/* Days Left Badge */}
//           <motion.div 
//             className={cn(
//               "inline-flex items-center gap-2 px-4 py-2 rounded-full mt-4",
//               "text-xl font-bold",
//               dateStatus.type === 'today' ? "bg-green-500 text-white" : 
//               dateStatus.type === 'past' ? "bg-red-500 text-white" : 
//               "bg-blue-500 text-white"
//             )}
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             whileHover={{ scale: 1.05 }}
//           >
//             <span className="flex items-center gap-2">
//               {dateStatus.type === 'today' ? (
//                 <>🎯 Today</>
//               ) : dateStatus.type === 'future' ? (
//                 <>⏰ {dateStatus.message}</>
//               ) : (
//                 <>📅 {dateStatus.message}</>
//               )}
//             </span>
//           </motion.div>
//         </motion.div>

//         {/* Main Content - Full Width */}
//         <div className="h-full flex flex-col justify-center max-w-4xl">
//           {/* Type Badge */}
//           <motion.div 
//             className="inline-flex items-center gap-4 px-8 py-4 rounded-full bg-white/10 backdrop-blur-sm mb-8"
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ delay: 0.3 }}
//           >
//             <IconComponent className="w-10 h-10 text-white" />
//             <span className="text-3xl font-bold text-white uppercase tracking-wider">
//               {announcement.subType.replace('_', ' ')}
//             </span>
//           </motion.div>

//           {/* Title with animation */}
//           <TextAnimate
//             animation={titleAnimation}
//             by="word"
//             as="h2"
//             className="text-6xl md:text-7xl xl:text-8xl font-black tracking-tight leading-none text-white mb-8"
//             delay={0.3}
//           >
//             {announcement.title}
//           </TextAnimate>

//           {/* Description with animation */}
//           <TextAnimate
//             animation={descriptionAnimation}
//             by="line"
//             as="p"
//             className="text-2xl md:text-3xl text-white/80 max-w-3xl leading-relaxed"
//             delay={0.6}
//           >
//             {announcement.description}
//           </TextAnimate>

//           {/* Meta information with animation */}
//           {(announcement.location || announcement.time) && (
//             <TextAnimate
//               animation={metaAnimation}
//               by="word"
//               className="mt-8 text-xl text-white/70"
//               delay={0.9}
//             >
//               {[
//                 announcement.location && `📍 ${announcement.location}`,
//                 announcement.time && `🕒 ${announcement.time}`
//               ].filter(Boolean).join('\n')}
//             </TextAnimate>
//           )}

//           {/* Footer Info */}
//           <div className="flex items-center justify-between mt-12">
//             {announcement.location && (
//               <motion.div 
//                 className="flex items-center gap-4 text-2xl text-white/80"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//               >
//                 <MapPin className="w-8 h-8" />
//                 <span>{announcement.location}</span>
//               </motion.div>
//             )}

//             {announcement.primary_link && (
//               <motion.a 
//                 href={announcement.primary_link}
//                 className="inline-flex items-center gap-4 px-8 py-4 text-2xl text-white hover:text-white/80 transition-colors group bg-white/10 backdrop-blur-sm rounded-full"
//                 whileHover={{ scale: 1.05 }}
//               >
//                 Learn More
//                 <ExternalLink className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
//               </motion.a>
//             )}
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   );
// }

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
        className="absolute top-16 right-8 md:right-12 text-right z-20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Day of Week */}
        <motion.div 
          className="text-4xl font-bold text-white/80 mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {formatDateWithDay(announcement.date).dayOfWeek}
        </motion.div>

        {/* Date */}
        <motion.div className="text-[10rem] md:text-[12rem] xl:text-[14rem] font-black text-white tracking-tighter leading-none">
          {formatDateWithDay(announcement.date).date}
        </motion.div>

        {/* Time if available */}
        {announcement.time && (
          <motion.div className="text-3xl text-white/60 font-medium tracking-tight mt-2">
            {announcement.time}
          </motion.div>
        )}

        {/* Days Left Badge */}
        <motion.div 
          className={cn(
            "inline-flex items-center gap-2 px-4 py-2 rounded-full mt-4",
            "text-xl font-bold",
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
        className="relative z-20 h-full p-20 md:p-32 flex flex-col justify-center"
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
            className="text-5xl md:text-5xl text-white/80 max-w-3xl leading-snug"
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
    duration: 60, // Doubled from 30 to 60
    watchDrag: true,
  });
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Filter and sort announcements
  const futureAnnouncements = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return announcements
      .filter(announcement => {
        const announcementDate = new Date(announcement.date);
        announcementDate.setHours(0, 0, 0, 0);
        return announcementDate >= today;
      })
      .sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
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

  // Add console log to check styles
  console.log('Type styles configured:', typeStyles);

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
                styles={typeStyles[announcement.type]}
                IconComponent={typeIcons[announcement.type][announcement.subType as keyof typeof typeIcons[typeof announcement.type]]}
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