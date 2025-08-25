'use client';

import { motion } from "framer-motion";
// import { AnnouncementCard } from "@/components/AnnouncementCard";
// import { AnnouncementCarousel } from "@/components/AnnouncementCarousel";
import { Announcement } from "@/types/announcement";
import { useState } from "react";
import { LayoutGrid, Maximize2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";


interface LandingPageProps {
  announcements: Announcement[];
  viewMode: 'grid' | 'carousel';
}

export function LandingPage({ announcements, viewMode }: LandingPageProps) {

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">

      {viewMode === 'carousel' ? (
        <div className="p-8">
          <main className="max-w-7xl mx-auto">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Carousel view not available
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Please use grid view to see announcements.
              </p>
            </div>
          </main>
        </div>
      ) : (
        <div className="p-8">
          <main className="max-w-7xl mx-auto">
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-white dark:bg-black/80 rounded-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {announcements.map((announcement) => (
                <div 
                  key={announcement.id}
                  className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {announcement.title}
                  </h3>
                  {announcement.body && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">
                      {announcement.body}
                    </p>
                  )}
                </div>
              ))}
            </motion.div>
          </main>
        </div>
      )}
    </div>
  );
} 