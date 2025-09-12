'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { ArrowLeft, Eye, List, EyeOff, Building2, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { AnnouncementCarousel, OrganizationThemeProvider } from '@/components/AnnouncementCarousel';
import { Announcement } from '@/types/announcement';
import OrganizationLogo from '@/components/ui/OrganizationLogo';

interface Organization {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  description?: string;
}

export default function AnnouncementDisplayPage() {
  const { user, isLoaded } = useUser();
  const params = useParams();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNavigation, setShowNavigation] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!user || !params.slug) return;

      try {
        // Load organization details
        const orgResponse = await fetch(`/api/organizations/by-slug/${params.slug}`);
        if (!orgResponse.ok) {
          throw new Error('Organization not found');
        }
        const orgData = await orgResponse.json();
        setOrganization(orgData.organization);

        // Load announcements for this organization
        const announcementsResponse = await fetch(`/api/organizations/by-slug/${params.slug}/announcements?visibility=both`);
        if (!announcementsResponse.ok) {
          throw new Error('Failed to load announcements');
        }
        const announcementsData = await announcementsResponse.json();
        
        // Filter for published announcements and add type inference
        const publishedAnnouncements = (announcementsData.announcements || [])
          .filter((announcement: any) => announcement.status === 'published')
          .map((announcement: any) => ({
            ...announcement,
            // Infer type from existing data if not set
            type: announcement.type || inferAnnouncementType(announcement),
            sub_type: announcement.sub_type || inferAnnouncementSubType(announcement),
          }));
        
        setAnnouncements(publishedAnnouncements);
      } catch (error) {
        console.error('Error loading data:', error);
        setError(error instanceof Error ? error.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    }

    if (isLoaded && user) {
      loadData();
    }
  }, [user, isLoaded, params.slug]);

  // Helper function to infer announcement type from existing data
  function inferAnnouncementType(announcement: any): string {
    // Check priority for urgent announcements
    if (announcement.priority > 3) return 'urgent';
    
    // Check if it's scheduled (likely an event)
    if (announcement.starts_at || announcement.scheduled_at) return 'event';
    
    // Check tags for hints
    const tags = announcement.tags || [];
    const tagString = tags.join(' ').toLowerCase();
    
    if (tagString.includes('workshop') || tagString.includes('exhibition') || tagString.includes('performance')) {
      return 'event';
    }
    if (tagString.includes('job') || tagString.includes('opportunity') || tagString.includes('call')) {
      return 'opportunity';
    }
    if (tagString.includes('maintenance') || tagString.includes('facility') || tagString.includes('cleaning')) {
      return 'facility';
    }
    if (tagString.includes('survey') || tagString.includes('policy') || tagString.includes('deadline')) {
      return 'administrative';
    }
    
    // Default to event
    return 'event';
  }

  // Helper function to infer announcement sub-type
  function inferAnnouncementSubType(announcement: any): string {
    const tags = announcement.tags || [];
    const tagString = tags.join(' ').toLowerCase();
    const title = announcement.title.toLowerCase();
    const body = (announcement.body || '').toLowerCase();
    const combined = `${title} ${body} ${tagString}`;
    
    // Event sub-types
    if (combined.includes('exhibition') || combined.includes('show')) return 'exhibition';
    if (combined.includes('workshop') || combined.includes('class')) return 'workshop';
    if (combined.includes('talk') || combined.includes('lecture') || combined.includes('presentation')) return 'talk';
    if (combined.includes('social') || combined.includes('party') || combined.includes('gathering')) return 'social';
    if (combined.includes('performance') || combined.includes('concert') || combined.includes('show')) return 'performance';
    if (combined.includes('open studio') || combined.includes('open studios')) return 'open_studios';
    
    // Urgent sub-types
    if (combined.includes('closure') || combined.includes('closed')) return 'closure';
    if (combined.includes('weather') || combined.includes('storm') || combined.includes('hurricane')) return 'weather';
    if (combined.includes('safety') || combined.includes('emergency')) return 'safety';
    if (combined.includes('parking') || combined.includes('park')) return 'parking';
    
    // Facility sub-types
    if (combined.includes('maintenance') || combined.includes('repair')) return 'maintenance';
    if (combined.includes('cleaning') || combined.includes('clean')) return 'cleaning';
    if (combined.includes('storage') || combined.includes('store')) return 'storage';
    if (combined.includes('renovation') || combined.includes('renovate')) return 'renovation';
    
    // Opportunity sub-types
    if (combined.includes('open call') || combined.includes('call for')) return 'open_call';
    if (combined.includes('job') || combined.includes('position') || combined.includes('hiring')) return 'job';
    if (combined.includes('commission') || combined.includes('commissioned')) return 'commission';
    if (combined.includes('residency') || combined.includes('resident')) return 'residency';
    if (combined.includes('funding') || combined.includes('grant') || combined.includes('fund')) return 'funding';
    
    // Administrative sub-types
    if (combined.includes('survey') || combined.includes('questionnaire')) return 'survey';
    if (combined.includes('document') || combined.includes('form')) return 'document';
    if (combined.includes('deadline') || combined.includes('due')) return 'deadline';
    if (combined.includes('policy') || combined.includes('rule')) return 'policy';
    
    // Default sub-types based on type
    switch (announcement.type) {
      case 'event': return 'exhibition';
      case 'urgent': return 'closure';
      case 'facility': return 'maintenance';
      case 'opportunity': return 'open_call';
      case 'administrative': return 'survey';
      default: return 'exhibition';
    }
  }

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading announcements...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Error</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <Link
              href={`/o/${params.slug}`}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Organization
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">You must be logged in to view announcements.</p>
            <Link
              href="/sign-in"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header with navigation */}
      <div className={`absolute top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-sm transition-all duration-300 ${
        showNavigation ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href={`/o/${params.slug}`}
                className="inline-flex items-center px-3 py-2 text-white hover:text-white/80 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to {organization?.name}
              </Link>
              
              <div className="hidden md:flex items-center space-x-4 text-white/80">
                <div className="flex items-center space-x-3">
                  {organization && (
                    <OrganizationLogo 
                      organization={organization}
                      size="md"
                      orientation="horizontal"
                      className="h-8"
                    />
                  )}
                  <div>
                    <h1 className="text-lg font-semibold">{organization?.name} Announcements</h1>
                    <p className="text-sm">Display View</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Link
                href={`/o/${params.slug}/announcements`}
                className="inline-flex items-center px-3 py-2 text-white hover:text-white/80 transition-colors"
              >
                <List className="w-4 h-4 mr-2" />
                List View
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Toggle Button */}
      <button
        onClick={() => setShowNavigation(!showNavigation)}
        className={`fixed top-4 right-4 z-50 inline-flex items-center justify-center w-12 h-12 bg-black/60 backdrop-blur-md text-white hover:bg-black/80 transition-all duration-300 rounded-lg border border-white/20 ${
          showNavigation ? 'opacity-100' : 'opacity-70 hover:opacity-100'
        }`}
        title={showNavigation ? "Hide navigation" : "Show navigation"}
      >
        {showNavigation ? (
          <X className="w-5 h-5" />
        ) : (
          <Menu className="w-5 h-5" />
        )}
      </button>

      {/* Carousel */}
      <OrganizationThemeProvider initialSlug={params.slug as string}>
        <AnnouncementCarousel announcements={announcements} organizationSlug={params.slug as string} />
      </OrganizationThemeProvider>
    </div>
  );
}
