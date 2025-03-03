'use client';

import { motion } from "framer-motion";
import { 
  Calendar, 
  MapPin, 
  ExternalLink, 
  Clock,
  AlertTriangle,
  Building2,
  PartyPopper,
  Sparkles,
  FileText
} from 'lucide-react';
import { Announcement } from "@/types/announcement";
import { cn } from "@/lib/utils";

interface AnnouncementCardProps {
  announcement: Announcement;
}

export function AnnouncementCard({ announcement }: AnnouncementCardProps) {
  const typeIcons = {
    urgent: AlertTriangle,
    facility: Building2,
    event: PartyPopper,
    opportunity: Sparkles,
    administrative: FileText,
  };

  const typeStyles = {
    urgent: {
      gradient: "bg-gradient-to-br from-red-50 via-red-100 to-orange-50",
      iconGradient: "from-red-500 to-orange-500",
      textGradient: "from-red-600 to-orange-600",
    },
    facility: {
      gradient: "bg-gradient-to-br from-blue-50 via-blue-100 to-sky-50",
      iconGradient: "from-blue-500 to-sky-500",
      textGradient: "from-blue-600 to-sky-600",
    },
    event: {
      gradient: "bg-gradient-to-br from-yellow-50 via-yellow-100 to-amber-50",
      iconGradient: "from-yellow-500 to-amber-500",
      textGradient: "from-yellow-600 to-amber-600",
    },
    opportunity: {
      gradient: "bg-gradient-to-br from-purple-50 via-purple-100 to-fuchsia-50",
      iconGradient: "from-purple-500 to-fuchsia-500",
      textGradient: "from-purple-600 to-fuchsia-600",
    },
    administrative: {
      gradient: "bg-gradient-to-br from-gray-50 via-gray-100 to-slate-50",
      iconGradient: "from-gray-500 to-slate-500",
      textGradient: "from-gray-600 to-slate-600",
    },
  };

  const IconComponent = typeIcons[announcement.type];
  const styles = typeStyles[announcement.type];

  return (
    <motion.div
      className={cn(
        "rounded-xl border shadow-sm overflow-hidden relative min-h-[24rem]",
        styles.gradient
      )}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {/* Large Background Icon */}
      <div className="absolute -right-8 -bottom-8 opacity-[0.07]">
        <IconComponent className="w-48 h-48" />
      </div>

      <div className="relative z-10 p-6 flex flex-col h-full">
        {/* Type Indicator */}
        <div className="flex items-center gap-3 mb-4">
          <div className={cn(
            "p-2 rounded-xl bg-gradient-to-br",
            styles.iconGradient
          )}>
            <IconComponent className="w-5 h-5 text-white" />
          </div>
          <span className={cn(
            "text-lg font-medium bg-gradient-to-br bg-clip-text text-transparent",
            styles.textGradient
          )}>
            {announcement.type}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold mb-4 line-clamp-2">
          {announcement.title}
        </h3>

        {/* Date, Time, Location */}
        <div className="space-y-2 text-gray-600 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{announcement.date}</span>
          </div>
          {announcement.time && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{announcement.time}</span>
            </div>
          )}
          {announcement.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{announcement.location}</span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-700 line-clamp-3 mb-4 flex-grow">
          {announcement.description}
        </p>

        {/* Link */}
        {announcement.primary_link && (
          <a 
            href={announcement.primary_link}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors mt-auto group"
          >
            Learn More
            <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        )}
      </div>
    </motion.div>
  );
} 