'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { BackgroundPattern } from '@/components/BackgroundPattern';
import PublicNavigation from '@/components/ui/PublicNavigation';
import { 
  Building2, 
  Users, 
  Globe, 
  Calendar, 
  MapPin, 
  ArrowRight, 
  Play,
  Shield,
  Zap,
  BarChart3,
  MessageSquare,
  Eye
} from 'lucide-react';

interface Organization {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  description?: string;
  location?: string;
  website_url?: string;
}

interface PublicAnnouncement {
  id: string;
  title: string;
  body?: string;
  org_id: string;
  organization: Organization;
  published_at: string;
  expires_at?: string;
  priority: number;
  tags: string[];
  media: any[];
}

const organizations: Organization[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'Bakehouse Art Complex',
    slug: 'bakehouse',
    description: 'Miami\'s premier artist residency and creative community space',
    location: 'Miami, FL',
    website_url: 'https://bacfl.org'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    name: 'Oolite Arts',
    slug: 'oolite',
    description: 'Supporting artists and engaging the community through contemporary art',
    location: 'Miami Beach, FL',
    website_url: 'https://oolitearts.org'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    name: 'Fountainhead',
    slug: 'fountainhead',
    description: 'Artist residency program fostering creative exchange',
    location: 'Miami, FL',
    website_url: 'https://fountainheadarts.org'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    name: 'Green Space',
    slug: 'greenspace',
    description: 'Sustainable art space and community hub',
    location: 'Miami, FL',
    website_url: 'https://greenspacemiami.org'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440005',
    name: 'FilmGate',
    slug: 'filmgate',
    description: 'Interactive media and film community',
    location: 'Miami, FL',
    website_url: 'https://filmgate.org'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440006',
    name: 'O Cinema',
    slug: 'ocinema',
    description: 'Independent cinema and cultural programming',
    location: 'Miami, FL',
    website_url: 'https://ocinema.org'
  }
];

export default function HomePage() {
  const [announcements, setAnnouncements] = useState<PublicAnnouncement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPublicAnnouncements() {
      try {
        const response = await fetch('/api/announcements/public');
        if (response.ok) {
          const data = await response.json();
          setAnnouncements(data);
        }
      } catch (error) {
        console.error('Error loading announcements:', error);
      } finally {
        setLoading(false);
      }
    }

    loadPublicAnnouncements();
  }, []);

  const featuredAnnouncements = announcements
    .filter(announcement => announcement.priority > 0)
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 6);

  const recentAnnouncements = announcements
    .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
    .slice(0, 12);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <PublicNavigation />
      <BackgroundPattern type="event" subType="exhibition" />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Smart Signs for
              <span className="block text-yellow-300">Communities</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-blue-100">
              The digital communication infrastructure that powers Miami's art communities. 
              See announcements from organizations across the city.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/sign-up"
                className="inline-flex items-center px-8 py-4 text-lg font-semibold bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </a>
              <a
                href="#organizations"
                className="inline-flex items-center px-8 py-4 text-lg font-semibold border-2 border-white text-white rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
              >
                View Organizations
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Announcements */}
      {featuredAnnouncements.length > 0 && (
        <section className="py-16 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Featured Announcements
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Important updates from across Miami's art community
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredAnnouncements.map((announcement) => (
                <div key={announcement.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="success">
                      {announcement.organization.name}
                    </Badge>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(announcement.published_at).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {announcement.title}
                  </h3>
                  
                  {announcement.body && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-3">
                      {announcement.body}
                    </p>
                  )}
                  
                  {announcement.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {announcement.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Priority: {announcement.priority}
                    </span>
                    <a
                      href={`/announcements/${announcement.id}`}
                      className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                    >
                      Read More
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Organizations Grid */}
      <section id="organizations" className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Art Communities
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Organizations using Smart Sign to power their communication
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {organizations.map((org) => (
              <div
                key={org.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  {org.logo_url ? (
                    <img
                      src={org.logo_url}
                      alt={org.name}
                      className="h-24 w-auto object-contain"
                    />
                  ) : (
                    <Building2 className="h-24 w-24 text-white/80" />
                  )}
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {org.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {org.description}
                  </p>
                  
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <MapPin className="w-4 h-4 mr-2" />
                    {org.location}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <Badge variant="info">
                      Active
                    </Badge>
                    {org.website_url && (
                      <a
                        href={org.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                      >
                        Visit Website
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Announcements */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Recent Updates
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Latest announcements from the community
            </p>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-lg h-64 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentAnnouncements.map((announcement) => (
                <div key={announcement.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="success">
                      {announcement.organization.name}
                    </Badge>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(announcement.published_at).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {announcement.title}
                  </h3>
                  
                  {announcement.body && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-3">
                      {announcement.body}
                    </p>
                  )}
                  
                  {announcement.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {announcement.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Priority: {announcement.priority}
                    </span>
                    <a
                      href={`/announcements/${announcement.id}`}
                      className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                    >
                      Read More
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Why Smart Sign?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              The communication infrastructure that gives you control
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 dark:bg-blue-900/20 rounded-lg p-6 mb-4">
                <Shield className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Secure & Controlled
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Role-based access control ensures only authorized users can create and manage content
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 dark:bg-purple-900/20 rounded-lg p-6 mb-4">
                <Zap className="w-12 h-12 text-purple-600 dark:text-purple-400 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Real-time Updates
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Instant content delivery across all displays and platforms
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 dark:bg-green-900/20 rounded-lg p-6 mb-4">
                <BarChart3 className="w-12 h-12 text-green-600 dark:text-green-400 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Analytics & Insights
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Track engagement and understand what content resonates with your community
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-100 dark:bg-orange-900/20 rounded-lg p-6 mb-4">
                <MessageSquare className="w-12 h-12 text-orange-600 dark:text-orange-400 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Community Engagement
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Foster connection and collaboration through shared communication platforms
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Control Your Community's Communication?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join the organizations already using Smart Sign to power their digital infrastructure
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/sign-up"
              className="inline-flex items-center px-8 py-4 text-lg font-semibold bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Get Started Today
              <ArrowRight className="ml-2 w-5 h-5" />
            </a>
            <a
              href="/contact"
              className="inline-flex items-center px-8 py-4 text-lg font-semibold border-2 border-white text-white rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
