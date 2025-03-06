'use client';

import { motion } from "framer-motion";
import { AnnouncementCard } from "@/components/AnnouncementCard";
import { AnnouncementCarousel } from "@/components/AnnouncementCarousel";
import { Announcement } from "@/types/announcement";
import { useState } from "react";
import { LayoutGrid, Maximize2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LandingPageProps {
  announcements: Announcement[];
}

export function LandingPage({ announcements }: LandingPageProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'carousel'>('grid');
  const [isLoading, setIsLoading] = useState(false);

  const handleViewModeChange = () => {
    setIsLoading(true);
    setViewMode(viewMode === 'grid' ? 'carousel' : 'grid');
    setTimeout(() => setIsLoading(false), 300);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="fixed top-4 right-4 z-10">
        <button
          onClick={handleViewModeChange}
          disabled={isLoading}
          className={cn(
            "p-2 rounded-full bg-white/80 shadow-lg",
            "hover:bg-white transition-colors",
            "relative",
            isLoading && "cursor-not-allowed opacity-80"
          )}
        >
          {isLoading ? (
            <Loader2 className="w-6 h-6 animate-spin text-gray-600" />
          ) : viewMode === 'grid' ? (
            <Maximize2 className="w-6 h-6" />
          ) : (
            <LayoutGrid className="w-6 h-6" />
          )}
        </button>
      </div>

      {viewMode === 'carousel' ? (
        <AnnouncementCarousel announcements={announcements} />
      ) : (
        <div className="p-8">
          <main className="max-w-7xl mx-auto">
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {announcements.map((announcement) => (
                <AnnouncementCard 
                  key={announcement.id}
                  announcement={announcement}
                />
              ))}
            </motion.div>
          </main>
        </div>
      )}
    </div>
  );
} 