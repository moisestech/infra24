'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { OrbitingCircles } from '@/components/magicui/orbiting-circles';
import { SparklesText } from '@/components/magicui/sparkles-text';
import { ThemeToggle } from '@/components/ThemeToggle';
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
  Eye,
  Palette,
  Paintbrush,
  Handshake,
  User,
  Brush,
  Image,
  Mic,
  Film,
  PenTool,
  Compass,
  Layers,
  Camera,
  Music,
  Scissors
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
  scheduled_at?: string;
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

  // Date utility functions
  const isToday = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isTomorrow = (dateString: string) => {
    const date = new Date(dateString);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return date.toDateString() === tomorrow.toDateString();
  };

  const isPast = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const getDateStatus = (dateString: string) => {
    if (isToday(dateString)) return 'today';
    if (isTomorrow(dateString)) return 'tomorrow';
    if (isPast(dateString)) return 'past';
    return 'upcoming';
  };

  const recentAnnouncements = announcements
    .sort((a, b) => {
      const dateA = new Date(a.scheduled_at || a.published_at);
      const dateB = new Date(b.scheduled_at || b.published_at);
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, 12);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <PublicNavigation />
      
      {/* Theme Toggle - Fixed Position */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-screen flex items-center justify-center">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700">
          <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/20 via-purple-500/20 to-blue-500/20 animate-pulse"></div>
          <div className="absolute inset-0 bg-gradient-to-bl from-cyan-400/10 via-blue-500/10 to-purple-600/10 animate-pulse delay-1000"></div>
        </div>
        
        {/* Floating Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-white/10 backdrop-blur-sm animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-24 h-24 rounded-full bg-purple-400/20 backdrop-blur-sm animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 right-1/3 w-16 h-16 rounded-full bg-cyan-400/20 backdrop-blur-sm animate-pulse delay-500"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="mb-8">
            <SparklesText 
              text="Smart Signs for Communities" 
              className="text-4xl md:text-6xl font-bold text-white mb-6"
              sparklesCount={30}
              colors={["#FFD700", "#FFA500", "#FF69B4", "#00BFFF", "#32CD32", "#FF6B6B", "#4ECDC4"]}
            />
          </div>
          
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
            The digital communication infrastructure that powers Miami's art communities. 
            See announcements from organizations across the city.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <a
              href="/sign-up"
              className="inline-flex items-center px-8 py-4 text-lg font-semibold bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Get Started
              <ArrowRight className="ml-2 w-5 h-5" />
            </a>
            <a
              href="#organizations"
              className="inline-flex items-center px-8 py-4 text-lg font-semibold border-2 border-white text-white rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105"
            >
              View Organizations
            </a>
          </div>
          
          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
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

      {/* Art Communities - Orbiting Circles */}
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
          
          <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden">
            {/* Art-themed icons orbiting in outer circle */}
            <OrbitingCircles iconSize={60} radius={180}>
              {[
                { icon: Palette, color: 'from-pink-500 to-rose-500' },
                { icon: Paintbrush, color: 'from-blue-500 to-cyan-500' },
                { icon: Handshake, color: 'from-green-500 to-emerald-500' },
                { icon: User, color: 'from-purple-500 to-violet-500' },
                { icon: Brush, color: 'from-orange-500 to-red-500' },
                { icon: Image, color: 'from-indigo-500 to-blue-500' },
                { icon: Mic, color: 'from-yellow-500 to-orange-500' },
                { icon: Film, color: 'from-teal-500 to-green-500' }
              ].map((item, index) => (
                <div
                  key={index}
                  className={`flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${item.color} shadow-lg hover:shadow-xl transition-shadow`}
                >
                  <item.icon className="h-8 w-8 text-white" />
                </div>
              ))}
            </OrbitingCircles>
            
            {/* Art-themed icons orbiting in inner circle */}
            <OrbitingCircles iconSize={40} radius={120} reverse speed={1.5}>
              {[
                { icon: PenTool, color: 'from-rose-500 to-pink-500' },
                { icon: Compass, color: 'from-cyan-500 to-blue-500' },
                { icon: Layers, color: 'from-emerald-500 to-green-500' },
                { icon: Camera, color: 'from-violet-500 to-purple-500' }
              ].map((item, index) => (
                <div
                  key={`inner-${index}`}
                  className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${item.color} shadow-lg hover:shadow-xl transition-shadow`}
                >
                  <item.icon className="h-6 w-6 text-white" />
                </div>
              ))}
            </OrbitingCircles>
            
            {/* Smart Sign icon in the center */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600 shadow-2xl border-4 border-white dark:border-gray-800">
                <MessageSquare className="h-10 w-10 text-white" />
              </div>
            </div>
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
              {recentAnnouncements.map((announcement) => {
                const eventDate = announcement.scheduled_at || announcement.published_at;
                const isEventToday = isToday(eventDate);
                const isEventTomorrow = isTomorrow(eventDate);
                const isEventPast = isPast(eventDate);
                
                return (
                  <div 
                    key={announcement.id} 
                    className={`rounded-lg p-6 transition-shadow ${
                      isEventPast
                        ? 'bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 opacity-75'
                        : 'bg-gray-50 dark:bg-gray-700 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="success">
                        {announcement.organization.name}
                      </Badge>
                      <div className="flex items-center space-x-2">
                        {isEventToday && (
                          <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                            TODAY
                          </span>
                        )}
                        {isEventTomorrow && (
                          <span className="px-2 py-1 bg-blue-500 text-white text-xs font-bold rounded-full">
                            TOMORROW
                          </span>
                        )}
                        {isEventPast && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 text-xs rounded-full">
                            Past Event
                          </span>
                        )}
                        <span className={`text-sm ${
                          isEventPast
                            ? 'text-gray-400 dark:text-gray-500'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {new Date(eventDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <h3 className={`text-lg font-semibold mb-2 ${
                      isEventPast
                        ? 'text-gray-500 dark:text-gray-400'
                        : 'text-gray-900 dark:text-white'
                    }`}>
                      {announcement.title}
                    </h3>
                    
                    {announcement.body && (
                      <p className={`text-sm mb-3 line-clamp-3 ${
                        isEventPast
                          ? 'text-gray-400 dark:text-gray-500'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        {announcement.body}
                      </p>
                    )}
                    
                    {announcement.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {announcement.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className={`px-2 py-1 text-xs rounded ${
                              isEventPast
                                ? 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
                                : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <span className={`text-xs ${
                        isEventPast
                          ? 'text-gray-400 dark:text-gray-500'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        Priority: {announcement.priority}
                      </span>
                      <a
                        href={`/announcements/${announcement.id}`}
                        className={`text-sm font-medium ${
                          isEventPast
                            ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                            : 'text-blue-600 hover:text-blue-500'
                        }`}
                        style={isEventPast ? { pointerEvents: 'none' } : {}}
                      >
                        Read More
                      </a>
                    </div>
                  </div>
                );
              })}
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
