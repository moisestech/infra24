'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { ArrowLeft, List, Settings } from 'lucide-react';
import Link from 'next/link';
import { AnnouncementCarousel } from '@/components/AnnouncementCarousel';
import { Announcement } from '@/types/announcement';

export default function GlobalAnnouncementCarouselPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!user) return;

      try {
        setLoading(true);
        
        // Check if user is super admin
        const userResponse = await fetch('/api/users/me');
        if (userResponse.ok) {
          const userData = await userResponse.json();
          
          // If user is not super admin, redirect to their organization's carousel
          if (userData.user.role !== 'super_admin') {
            if (userData.organization) {
              router.push(`/o/${userData.organization.slug}/announcements/carousel`);
              return;
            } else {
              router.push('/dashboard');
              return;
            }
          }
        }

        // Load all announcements for super admin
        const announcementsResponse = await fetch('/api/announcements');
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
  }, [user, isLoaded, router]);

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 xl:h-16 xl:w-16 2xl:h-20 2xl:w-20 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg xl:text-xl 2xl:text-2xl">Loading announcements...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-500 text-white p-6 xl:p-8 2xl:p-10 rounded-lg max-w-md xl:max-w-lg 2xl:max-w-xl">
            <h2 className="text-xl xl:text-2xl 2xl:text-3xl font-bold mb-2 xl:mb-4">Error Loading Announcements</h2>
            <p className="mb-4 xl:mb-6 text-sm xl:text-base 2xl:text-lg">{error}</p>
            <Link
              href="/announcements"
              className="inline-flex items-center px-4 xl:px-6 py-2 xl:py-3 bg-white text-gray-900 text-sm xl:text-base 2xl:text-lg rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 xl:h-5 xl:w-5 2xl:h-6 2xl:w-6 mr-2" />
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
          <div className="bg-gray-800 text-white p-8 xl:p-10 2xl:p-12 rounded-lg max-w-md xl:max-w-lg 2xl:max-w-xl">
            <h2 className="text-xl xl:text-2xl 2xl:text-3xl font-bold mb-2 xl:mb-4">No Announcements Available</h2>
            <p className="mb-6 xl:mb-8 text-gray-300 text-sm xl:text-base 2xl:text-lg">
              There are no announcements to display in carousel mode.
            </p>
            <div className="flex space-x-4 xl:space-x-6 justify-center">
              <Link
                href="/announcements"
                className="inline-flex items-center px-4 xl:px-6 py-2 xl:py-3 bg-blue-600 text-white text-sm xl:text-base 2xl:text-lg rounded-lg hover:bg-blue-700 transition-colors"
              >
                <List className="h-4 w-4 xl:h-5 xl:w-5 2xl:h-6 2xl:w-6 mr-2" />
                List View
              </Link>
              <Link
                href="/announcements/create"
                className="inline-flex items-center px-4 xl:px-6 py-2 xl:py-3 bg-green-600 text-white text-sm xl:text-base 2xl:text-lg rounded-lg hover:bg-green-700 transition-colors"
              >
                <Settings className="h-4 w-4 xl:h-5 xl:w-5 2xl:h-6 2xl:w-6 mr-2" />
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
        <div className="flex items-center justify-between p-4 xl:p-6 2xl:p-8 3xl:p-10">
          <Link
            href="/announcements"
            className="inline-flex items-center px-4 xl:px-6 py-2 xl:py-3 bg-white/10 text-white text-sm xl:text-base 2xl:text-lg 3xl:text-xl rounded-lg hover:bg-white/20 transition-colors backdrop-blur-sm"
          >
            <ArrowLeft className="h-4 w-4 xl:h-5 xl:w-5 2xl:h-6 2xl:w-6 3xl:h-8 3xl:w-8 mr-2" />
            Back to List
          </Link>
          
          <div className="flex items-center space-x-4 xl:space-x-6">
            <Link
              href="/announcements"
              className="inline-flex items-center px-4 xl:px-6 py-2 xl:py-3 bg-white/10 text-white text-sm xl:text-base 2xl:text-lg 3xl:text-xl rounded-lg hover:bg-white/20 transition-colors backdrop-blur-sm"
            >
              <List className="h-4 w-4 xl:h-5 xl:w-5 2xl:h-6 2xl:w-6 3xl:h-8 3xl:w-8 mr-2" />
              List View
            </Link>
            
            <div className="text-white text-sm xl:text-base 2xl:text-lg 3xl:text-xl bg-white/10 px-3 xl:px-4 py-2 xl:py-3 rounded-lg backdrop-blur-sm">
              {announcements.length} Announcement{announcements.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>

      {/* Carousel */}
      <AnnouncementCarousel announcements={announcements} />
    </div>
  );
}

