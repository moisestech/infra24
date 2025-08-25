"use client";
import { useState } from "react";
import { LandingPage } from "@/components/LandingPage";
import { Announcement } from "@/types/announcement";
import { Navbar } from "@/components/ui/Navbar";

interface ClientLandingPageProps {
  announcements: Announcement[];
}

export function ClientLandingPage({ announcements }: ClientLandingPageProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'carousel'>('grid');
  const [isLoading, setIsLoading] = useState(false);
  const [typeFilter, setTypeFilter] = useState<'all' | 'urgent' | 'facility' | 'event' | 'opportunity' | 'administrative'>('all');

  // Handler for the toggle button
  const handleViewModeChange = () => {
    setIsLoading(true);
    setViewMode(viewMode === 'grid' ? 'carousel' : 'grid');
    setTimeout(() => setIsLoading(false), 300);
  };

  // Handler for type filter
  const handleTypeFilterChange = (type: typeof typeFilter) => {
    setTypeFilter(type);
  };

  // Filter announcements by type (disabled since Announcement type doesn't have 'type' property)
  const filteredAnnouncements = announcements;

  return (
    <>
      <Navbar
        viewMode={viewMode}
        setViewMode={handleViewModeChange}
        isLoading={isLoading}
        typeFilter={typeFilter}
        onTypeFilterChange={handleTypeFilterChange}
      />
      <LandingPage announcements={filteredAnnouncements} viewMode={viewMode} />
    </>
  );
} 