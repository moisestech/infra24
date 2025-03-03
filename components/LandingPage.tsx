'use client';

import { motion } from "framer-motion";
import { AnnouncementCard } from "@/components/AnnouncementCard";
import { AnnouncementCarousel } from "@/components/AnnouncementCarousel";
import { Announcement } from "@/types/announcement";
import { useState } from "react";
import { LayoutGrid, Maximize2 } from "lucide-react";

interface LandingPageProps {
  announcements: Announcement[];
}

export function LandingPage({ announcements }: LandingPageProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'carousel'>('carousel');

  return (
    <div className="min-h-screen">
      <div className="fixed top-4 right-4 z-10">
        <button
          onClick={() => setViewMode(viewMode === 'grid' ? 'carousel' : 'grid')}
          className="p-2 rounded-full bg-white/80 shadow-lg hover:bg-white transition-colors"
        >
          {viewMode === 'grid' ? (
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