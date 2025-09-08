'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { ArrowLeft, List, Settings, Eye } from 'lucide-react';
import Link from 'next/link';
import { AnnouncementCarousel } from '@/components/AnnouncementCarousel';
import { Announcement } from '@/types/announcement';

interface Organization {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  description?: string;
}

export default function OrganizationAnnouncementCarouselPage() {
  const { user, isLoaded } = useUser();
  const params = useParams();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!user || !params.slug) return;

      try {
        setLoading(true);
        
        // Load organization details
        const orgResponse = await fetch(`/api/organizations/by-slug/${params.slug}`);
        if (orgResponse.ok) {
          const orgData = await orgResponse.json();
          setOrganization(orgData.organization);
        }

        // Load announcements for this organization
        const announcementsResponse = await fetch(`/api/organizations/by-slug/${params.slug}/announcements?visibility=both`);
        if (!announcementsResponse.ok) {
          throw new Error('Failed to load announcements');
        }
        
        const announcementsData = await announcementsResponse.json();
        setAnnouncements(announcementsData.announcements || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load announcements');
      } finally {
        setLoading(false);
      }
    }

    if (isLoaded && user) {
      loadData();
    }
  }, [user, isLoaded, params.slug]);

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading announcements...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-500 text-white p-6 rounded-lg max-w-md">
            <h2 className="text-xl font-bold mb-2">Error Loading Announcements</h2>
            <p className="mb-4">{error}</p>
            <Link
              href={`/o/${params.slug}/announcements`}
              className="inline-flex items-center px-4 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to List View
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (announcements.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-gray-800 text-white p-8 rounded-lg max-w-md">
            <h2 className="text-xl font-bold mb-2">No Announcements Available</h2>
            <p className="mb-6 text-gray-300">
              {organization?.name} has no announcements to display in carousel mode.
            </p>
            <div className="flex space-x-4 justify-center">
              <Link
                href={`/o/${params.slug}/announcements`}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <List className="h-4 w-4 mr-2" />
                List View
              </Link>
              <Link
                href={`/o/${params.slug}/announcements/create`}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Settings className="h-4 w-4 mr-2" />
                Create Announcement
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navigation Bar */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-sm">
        <div className="flex items-center justify-between p-4">
          <Link
            href={`/o/${params.slug}/announcements`}
            className="inline-flex items-center px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors backdrop-blur-sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to List
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link
              href={`/o/${params.slug}/announcements`}
              className="inline-flex items-center px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors backdrop-blur-sm"
            >
              <List className="h-4 w-4 mr-2" />
              List View
            </Link>
            
            <Link
              href={`/o/${params.slug}/announcements/public`}
              className="inline-flex items-center px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors backdrop-blur-sm"
            >
              <Eye className="h-4 w-4 mr-2" />
              Public View
            </Link>
            
            <div className="text-white text-sm bg-white/10 px-3 py-2 rounded-lg backdrop-blur-sm">
              {organization?.name} • {announcements.length} Announcement{announcements.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>

      {/* Carousel */}
      <AnnouncementCarousel announcements={announcements} />
    </div>
  );
}

