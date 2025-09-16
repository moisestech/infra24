'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { OrbitingCircles } from '@/components/magicui/orbiting-circles';
import { SparklesText } from '@/components/magicui/sparkles-text';
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
    .filter(announcement => 
      announcement.priority > 0 && 
      announcement.organization.slug === 'bakehouse'
    )
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
    .filter(announcement => announcement.organization.slug === 'bakehouse')
    .sort((a, b) => {
      const dateA = new Date(a.scheduled_at || a.published_at);
      const dateB = new Date(b.scheduled_at || b.published_at);
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, 12);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <PublicNavigation />
      
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
        
        <div className="relative max-w-7xl xl:max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-24 xl:py-32 text-center">
          <div className="mb-8 xl:mb-12">
            <SparklesText 
              text="Infra24" 
              className="text-4xl md:text-6xl xl:text-8xl 2xl:text-9xl font-bold text-white mb-6 xl:mb-8"
              sparklesCount={30}
              colors={["#FFD700", "#FFA500", "#FF69B4", "#00BFFF", "#32CD32", "#FF6B6B", "#4ECDC4"]}
            />
            <h2 className="text-2xl md:text-3xl xl:text-4xl 2xl:text-5xl font-semibold text-blue-100 mb-6 xl:mb-8">
              Art Organization Operating System
            </h2>
          </div>
          
          <p className="text-xl md:text-2xl xl:text-3xl 2xl:text-4xl mb-8 xl:mb-12 text-blue-100 max-w-3xl xl:max-w-5xl mx-auto leading-relaxed">
            The comprehensive platform that powers art organizations with Smart Signs, 
            interactive maps, booking systems, and community engagement tools.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 xl:gap-6 justify-center mb-12 xl:mb-16">
            <a
              href="/sign-up"
              className="inline-flex items-center px-8 xl:px-12 py-4 xl:py-6 text-lg xl:text-xl 2xl:text-2xl font-semibold bg-white text-blue-600 rounded-lg xl:rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg xl:shadow-xl"
            >
              Get Started
              <ArrowRight className="ml-2 w-5 h-5 xl:w-6 xl:h-6 2xl:w-8 2xl:h-8" />
            </a>
            <a
              href="#organizations"
              className="inline-flex items-center px-8 xl:px-12 py-4 xl:py-6 text-lg xl:text-xl 2xl:text-2xl font-semibold border-2 border-white text-white rounded-lg xl:rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105"
            >
              Explore Platform
            </a>
          </div>
          
          {/* Scroll Indicator */}
          <div className="absolute bottom-8 xl:bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 xl:w-8 xl:h-12 2xl:w-10 2xl:h-16 border-2 border-white/50 rounded-full flex justify-center">
              <div className="w-1 h-3 xl:w-2 xl:h-4 2xl:w-2 2xl:h-5 bg-white/50 rounded-full mt-2 xl:mt-3 2xl:mt-4 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Announcements */}
      {featuredAnnouncements.length > 0 && (
        <section className="py-16 xl:py-24 2xl:py-32 bg-white dark:bg-gray-800">
          <div className="max-w-7xl xl:max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
            <div className="text-center mb-12 xl:mb-16 2xl:mb-20">
              <h2 className="text-3xl xl:text-4xl 2xl:text-5xl font-bold text-gray-900 dark:text-white mb-4 xl:mb-6">
                Featured Events
              </h2>
              <p className="text-lg xl:text-xl 2xl:text-2xl text-gray-600 dark:text-gray-400">
                Important updates and events from Bakehouse Art Complex
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 xl:gap-8 2xl:gap-10">
              {featuredAnnouncements.map((announcement) => (
                <a 
                  key={announcement.id} 
                  href={`/announcements/${announcement.id}`}
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg xl:rounded-xl p-6 xl:p-8 2xl:p-10 hover:shadow-md xl:hover:shadow-lg transition-shadow cursor-pointer block"
                >
                  <div className="flex items-center justify-between mb-3 xl:mb-4">
                    <Badge variant="success">
                      {announcement.organization.name}
                    </Badge>
                    <span className="text-sm xl:text-base 2xl:text-lg text-gray-500 dark:text-gray-400">
                      {new Date(announcement.published_at).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <h3 className="text-lg xl:text-xl 2xl:text-2xl font-semibold text-gray-900 dark:text-white mb-2 xl:mb-3">
                    {announcement.title}
                  </h3>
                  
                  {announcement.body && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm xl:text-base 2xl:text-lg mb-3 xl:mb-4 line-clamp-3">
                      {announcement.body}
                    </p>
                  )}
                  
                  {announcement.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 xl:gap-2 mb-3 xl:mb-4">
                      {announcement.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 xl:px-3 xl:py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs xl:text-sm 2xl:text-base rounded xl:rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs xl:text-sm 2xl:text-base text-gray-500 dark:text-gray-400">
                      Priority: {announcement.priority}
                    </span>
                    <span className="text-blue-600 hover:text-blue-500 text-sm xl:text-base 2xl:text-lg font-medium">
                      Read More →
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Art Communities - Orbiting Circles */}
      <section id="organizations" className="py-16 xl:py-24 2xl:py-32 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl xl:max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="text-center mb-12 xl:mb-16 2xl:mb-20">
            <h2 className="text-3xl xl:text-4xl 2xl:text-5xl font-bold text-gray-900 dark:text-white mb-4 xl:mb-6">
              Art Communities
            </h2>
            <p className="text-lg xl:text-xl 2xl:text-2xl text-gray-600 dark:text-gray-400">
              Organizations using Smart Sign to power their communication
            </p>
          </div>
          
          <div className="relative flex h-[500px] xl:h-[600px] 2xl:h-[700px] w-full flex-col items-center justify-center overflow-hidden">
            {/* Art-themed icons orbiting in outer circle */}
            <OrbitingCircles iconSize={60} radius={180}>
              {[
                { icon: Palette, color: 'from-pink-500 to-rose-500', link: '/o/bakehouse/announcements' },
                { icon: Paintbrush, color: 'from-blue-500 to-cyan-500', link: '/o/bakehouse/artists' },
                { icon: Handshake, color: 'from-green-500 to-emerald-500', link: '/o/bakehouse/users' },
                { icon: User, color: 'from-purple-500 to-violet-500', link: '/o/bakehouse' },
                { icon: Brush, color: 'from-orange-500 to-red-500', link: '/o/bakehouse/announcements' },
                { icon: Image, color: 'from-indigo-500 to-blue-500', link: '/o/bakehouse/artists' },
                { icon: Mic, color: 'from-yellow-500 to-orange-500', link: '/o/bakehouse/announcements' },
                { icon: Film, color: 'from-teal-500 to-green-500', link: '/o/bakehouse' }
              ].map((item, index) => (
                <a
                  key={index}
                  href={item.link}
                  className={`flex h-16 w-16 xl:h-20 xl:w-20 2xl:h-24 2xl:w-24 items-center justify-center rounded-full bg-gradient-to-br ${item.color} shadow-lg xl:shadow-xl hover:shadow-2xl hover:shadow-${item.color.split('-')[1]}-500/50 transition-all duration-300 transform hover:scale-110 hover:rotate-12 cursor-pointer group`}
                >
                  <item.icon className="h-8 w-8 xl:h-10 xl:w-10 2xl:h-12 2xl:w-12 text-white group-hover:animate-pulse" />
                </a>
              ))}
            </OrbitingCircles>
            
            {/* Art-themed icons orbiting in inner circle */}
            <OrbitingCircles iconSize={40} radius={120} reverse speed={1.5}>
              {[
                { icon: PenTool, color: 'from-rose-500 to-pink-500', link: '/o/bakehouse/artists' },
                { icon: Compass, color: 'from-cyan-500 to-blue-500', link: '/o/bakehouse' },
                { icon: Layers, color: 'from-emerald-500 to-green-500', link: '/o/bakehouse/users' },
                { icon: Camera, color: 'from-violet-500 to-purple-500', link: '/o/bakehouse/announcements' }
              ].map((item, index) => (
                <a
                  key={`inner-${index}`}
                  href={item.link}
                  className={`flex h-12 w-12 xl:h-16 xl:w-16 2xl:h-20 2xl:w-20 items-center justify-center rounded-full bg-gradient-to-br ${item.color} shadow-lg xl:shadow-xl hover:shadow-2xl hover:shadow-${item.color.split('-')[1]}-500/50 transition-all duration-300 transform hover:scale-125 hover:-rotate-12 cursor-pointer group`}
                >
                  <item.icon className="h-6 w-6 xl:h-8 xl:w-8 2xl:h-10 2xl:w-10 text-white group-hover:animate-bounce" />
                </a>
              ))}
            </OrbitingCircles>
            
            {/* Smart Sign icon in the center */}
            <div className="absolute inset-0 flex items-center justify-center">
              <a 
                href="/o/bakehouse"
                className="flex h-20 w-20 xl:h-24 xl:w-24 2xl:h-28 2xl:w-28 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600 shadow-2xl border-4 xl:border-6 2xl:border-8 border-white dark:border-gray-800 hover:shadow-blue-500/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-110 hover:rotate-6 cursor-pointer group"
              >
                <MessageSquare className="h-10 w-10 xl:h-12 xl:w-12 2xl:h-14 2xl:w-14 text-white group-hover:animate-pulse" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 xl:py-24 2xl:py-32 bg-white dark:bg-gray-800">
        <div className="max-w-7xl xl:max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="text-center mb-16 xl:mb-20 2xl:mb-24">
            <h2 className="text-3xl xl:text-4xl 2xl:text-5xl font-bold text-gray-900 dark:text-white mb-4 xl:mb-6">
              Infra24 Platform Features
            </h2>
            <p className="text-lg xl:text-xl 2xl:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl xl:max-w-4xl 2xl:max-w-5xl mx-auto">
              Complete infrastructure for art organizations: Smart Signs, interactive maps, booking systems, and community engagement
            </p>
          </div>

          {/* Feature Categories */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 xl:gap-10 2xl:gap-12 mb-16 xl:mb-20 2xl:mb-24">
            {/* Announcement Management */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl xl:rounded-3xl p-8 xl:p-10 2xl:p-12 hover:shadow-xl xl:hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center mb-6 xl:mb-8">
                <div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg xl:rounded-xl p-3 xl:p-4 mr-4 xl:mr-6">
                  <MessageSquare className="w-8 h-8 xl:w-10 xl:h-10 2xl:w-12 2xl:h-12 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl xl:text-2xl 2xl:text-3xl font-bold text-gray-900 dark:text-white">
                  Announcement Management
                </h3>
              </div>
              <ul className="space-y-3 xl:space-y-4 text-gray-600 dark:text-gray-400 text-sm xl:text-base 2xl:text-lg">
                <li className="flex items-center">
                  <div className="w-2 h-2 xl:w-3 xl:h-3 bg-blue-500 rounded-full mr-3 xl:mr-4"></div>
                  Create and schedule announcements
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 xl:w-3 xl:h-3 bg-blue-500 rounded-full mr-3 xl:mr-4"></div>
                  Rich media support (images, videos)
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 xl:w-3 xl:h-3 bg-blue-500 rounded-full mr-3 xl:mr-4"></div>
                  Priority-based display
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 xl:w-3 xl:h-3 bg-blue-500 rounded-full mr-3 xl:mr-4"></div>
                  Event scheduling and RSVP
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 xl:w-3 xl:h-3 bg-blue-500 rounded-full mr-3 xl:mr-4"></div>
                  Approval workflows
                </li>
              </ul>
            </div>

            {/* Member Management */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl xl:rounded-3xl p-8 xl:p-10 2xl:p-12 hover:shadow-xl xl:hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center mb-6 xl:mb-8">
                <div className="bg-green-100 dark:bg-green-900/30 rounded-lg xl:rounded-xl p-3 xl:p-4 mr-4 xl:mr-6">
                  <Users className="w-8 h-8 xl:w-10 xl:h-10 2xl:w-12 2xl:h-12 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl xl:text-2xl 2xl:text-3xl font-bold text-gray-900 dark:text-white">
                  Member Management
                </h3>
              </div>
              <ul className="space-y-3 xl:space-y-4 text-gray-600 dark:text-gray-400 text-sm xl:text-base 2xl:text-lg">
                <li className="flex items-center">
                  <div className="w-2 h-2 xl:w-3 xl:h-3 bg-green-500 rounded-full mr-3 xl:mr-4"></div>
                  Role-based access control
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 xl:w-3 xl:h-3 bg-green-500 rounded-full mr-3 xl:mr-4"></div>
                  Artist profile management
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 xl:w-3 xl:h-3 bg-green-500 rounded-full mr-3 xl:mr-4"></div>
                  Studio assignments
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 xl:w-3 xl:h-3 bg-green-500 rounded-full mr-3 xl:mr-4"></div>
                  Member type categorization
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 xl:w-3 xl:h-3 bg-green-500 rounded-full mr-3 xl:mr-4"></div>
                  Profile claiming system
                </li>
              </ul>
            </div>

            {/* Display & Analytics */}
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-2xl xl:rounded-3xl p-8 xl:p-10 2xl:p-12 hover:shadow-xl xl:hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center mb-6 xl:mb-8">
                <div className="bg-purple-100 dark:bg-purple-900/30 rounded-lg xl:rounded-xl p-3 xl:p-4 mr-4 xl:mr-6">
                  <BarChart3 className="w-8 h-8 xl:w-10 xl:h-10 2xl:w-12 2xl:h-12 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl xl:text-2xl 2xl:text-3xl font-bold text-gray-900 dark:text-white">
                  Display & Analytics
                </h3>
              </div>
              <ul className="space-y-3 xl:space-y-4 text-gray-600 dark:text-gray-400 text-sm xl:text-base 2xl:text-lg">
                <li className="flex items-center">
                  <div className="w-2 h-2 xl:w-3 xl:h-3 bg-purple-500 rounded-full mr-3 xl:mr-4"></div>
                  Public display mode
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 xl:w-3 xl:h-3 bg-purple-500 rounded-full mr-3 xl:mr-4"></div>
                  Carousel presentations
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 xl:w-3 xl:h-3 bg-purple-500 rounded-full mr-3 xl:mr-4"></div>
                  Engagement tracking
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 xl:w-3 xl:h-3 bg-purple-500 rounded-full mr-3 xl:mr-4"></div>
                  Content performance metrics
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 xl:w-3 xl:h-3 bg-purple-500 rounded-full mr-3 xl:mr-4"></div>
                  Real-time updates
                </li>
              </ul>
            </div>

            {/* Interactive Maps */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl xl:rounded-3xl p-8 xl:p-10 2xl:p-12 hover:shadow-xl xl:hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center mb-6 xl:mb-8">
                <div className="bg-orange-100 dark:bg-orange-900/30 rounded-lg xl:rounded-xl p-3 xl:p-4 mr-4 xl:mr-6">
                  <MapPin className="w-8 h-8 xl:w-10 xl:h-10 2xl:w-12 2xl:h-12 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="text-xl xl:text-2xl 2xl:text-3xl font-bold text-gray-900 dark:text-white">
                  Interactive Maps
                </h3>
              </div>
              <ul className="space-y-3 xl:space-y-4 text-gray-600 dark:text-gray-400 text-sm xl:text-base 2xl:text-lg">
                <li className="flex items-center">
                  <div className="w-2 h-2 xl:w-3 xl:h-3 bg-orange-500 rounded-full mr-3 xl:mr-4"></div>
                  Studio location mapping
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 xl:w-3 xl:h-3 bg-orange-500 rounded-full mr-3 xl:mr-4"></div>
                  Artist profile integration
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 xl:w-3 xl:h-3 bg-orange-500 rounded-full mr-3 xl:mr-4"></div>
                  Real-time availability
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 xl:w-3 xl:h-3 bg-orange-500 rounded-full mr-3 xl:mr-4"></div>
                  Interactive hover cards
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 xl:w-3 xl:h-3 bg-orange-500 rounded-full mr-3 xl:mr-4"></div>
                  SVG-based layouts
                </li>
              </ul>
            </div>
          </div>

          {/* Interactive Feature Showcase */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-3xl xl:rounded-[2rem] 2xl:rounded-[2.5rem] p-8 md:p-12 xl:p-16 2xl:p-20">
            <div className="text-center mb-12 xl:mb-16 2xl:mb-20">
              <h3 className="text-2xl xl:text-3xl 2xl:text-4xl font-bold text-gray-900 dark:text-white mb-4 xl:mb-6">
                See Infra24 in Action
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-base xl:text-lg 2xl:text-xl">
                Experience the comprehensive platform that powers art organizations with modern infrastructure
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8 2xl:gap-10">
              {/* Feature Cards with Interactive Elements */}
              <div className="group bg-white dark:bg-gray-800 rounded-xl xl:rounded-2xl p-6 xl:p-8 2xl:p-10 shadow-lg xl:shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg xl:rounded-xl p-4 xl:p-5 2xl:p-6 mb-4 xl:mb-6 group-hover:rotate-6 transition-transform duration-300">
                  <Calendar className="w-8 h-8 xl:w-10 xl:h-10 2xl:w-12 2xl:h-12 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2 xl:mb-3 text-base xl:text-lg 2xl:text-xl">Event Scheduling</h4>
                <p className="text-sm xl:text-base 2xl:text-lg text-gray-600 dark:text-gray-400">
                  Schedule events with automatic reminders and RSVP tracking
                </p>
              </div>

              <div className="group bg-white dark:bg-gray-800 rounded-xl xl:rounded-2xl p-6 xl:p-8 2xl:p-10 shadow-lg xl:shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer">
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg xl:rounded-xl p-4 xl:p-5 2xl:p-6 mb-4 xl:mb-6 group-hover:rotate-6 transition-transform duration-300">
                  <Shield className="w-8 h-8 xl:w-10 xl:h-10 2xl:w-12 2xl:h-12 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2 xl:mb-3 text-base xl:text-lg 2xl:text-xl">Secure Access</h4>
                <p className="text-sm xl:text-base 2xl:text-lg text-gray-600 dark:text-gray-400">
                  Role-based permissions ensure only authorized users can manage content
                </p>
              </div>

              <div className="group bg-white dark:bg-gray-800 rounded-xl xl:rounded-2xl p-6 xl:p-8 2xl:p-10 shadow-lg xl:shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg xl:rounded-xl p-4 xl:p-5 2xl:p-6 mb-4 xl:mb-6 group-hover:rotate-6 transition-transform duration-300">
                  <Zap className="w-8 h-8 xl:w-10 xl:h-10 2xl:w-12 2xl:h-12 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2 xl:mb-3 text-base xl:text-lg 2xl:text-xl">Real-time Updates</h4>
                <p className="text-sm xl:text-base 2xl:text-lg text-gray-600 dark:text-gray-400">
                  Changes appear instantly across all displays and platforms
                </p>
              </div>

              <div className="group bg-white dark:bg-gray-800 rounded-xl xl:rounded-2xl p-6 xl:p-8 2xl:p-10 shadow-lg xl:shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer">
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg xl:rounded-xl p-4 xl:p-5 2xl:p-6 mb-4 xl:mb-6 group-hover:rotate-6 transition-transform duration-300">
                  <Eye className="w-8 h-8 xl:w-10 xl:h-10 2xl:w-12 2xl:h-12 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2 xl:mb-3 text-base xl:text-lg 2xl:text-xl">Public Display</h4>
                <p className="text-sm xl:text-base 2xl:text-lg text-gray-600 dark:text-gray-400">
                  Beautiful public displays for lobbies, galleries, and common areas
                </p>
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center mt-12 xl:mt-16 2xl:mt-20">
              <a
                href="/sign-up"
                className="inline-flex items-center px-8 xl:px-12 py-4 xl:py-6 text-lg xl:text-xl 2xl:text-2xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg xl:rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg xl:shadow-xl"
              >
                Start Your Free Trial
                <ArrowRight className="ml-2 w-5 h-5 xl:w-6 xl:h-6 2xl:w-8 2xl:h-8" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Announcements */}
      <section className="py-16 xl:py-24 2xl:py-32 bg-white dark:bg-gray-800">
        <div className="max-w-7xl xl:max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="text-center mb-12 xl:mb-16 2xl:mb-20">
            <h2 className="text-3xl xl:text-4xl 2xl:text-5xl font-bold text-gray-900 dark:text-white mb-4 xl:mb-6">
              Recent Updates
            </h2>
            <p className="text-lg xl:text-xl 2xl:text-2xl text-gray-600 dark:text-gray-400">
              Latest announcements and events from Bakehouse Art Complex
            </p>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 xl:gap-8 2xl:gap-10">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-lg xl:rounded-xl h-64 xl:h-80 2xl:h-96 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 xl:gap-8 2xl:gap-10">
              {recentAnnouncements.map((announcement) => {
                const eventDate = announcement.scheduled_at || announcement.published_at;
                const isEventToday = isToday(eventDate);
                const isEventTomorrow = isTomorrow(eventDate);
                const isEventPast = isPast(eventDate);
                
                return (
                  <a 
                    key={announcement.id} 
                    href={isEventPast ? '#' : `/announcements/${announcement.id}`}
                    className={`rounded-lg xl:rounded-xl p-6 xl:p-8 2xl:p-10 transition-shadow block ${
                      isEventPast
                        ? 'bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 opacity-75 cursor-not-allowed'
                        : 'bg-gray-50 dark:bg-gray-700 hover:shadow-md xl:hover:shadow-lg cursor-pointer'
                    }`}
                    style={isEventPast ? { pointerEvents: 'none' } : {}}
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
                      <span className={`text-sm font-medium ${
                        isEventPast
                          ? 'text-gray-400 dark:text-gray-500'
                          : 'text-blue-600 hover:text-blue-500'
                      }`}>
                        {isEventPast ? 'Past Event' : 'Read More →'}
                      </span>
                    </div>
                  </a>
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
              Why Infra24?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              The comprehensive platform that powers art organizations with modern infrastructure
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
      <section className="py-16 xl:py-24 2xl:py-32 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 dark:from-blue-800 dark:via-purple-800 dark:to-indigo-900 text-white">
        <div className="max-w-4xl xl:max-w-6xl 2xl:max-w-7xl mx-auto text-center px-4 sm:px-6 lg:px-8 xl:px-12">
          <h2 className="text-3xl md:text-4xl xl:text-5xl 2xl:text-6xl font-bold mb-6 xl:mb-8 2xl:mb-10">
            Ready to Power Your Art Organization?
          </h2>
          <p className="text-xl xl:text-2xl 2xl:text-3xl mb-8 xl:mb-12 2xl:mb-16 text-blue-100 dark:text-blue-200 max-w-2xl xl:max-w-4xl 2xl:max-w-5xl mx-auto leading-relaxed">
            Join the organizations already using Infra24 to power their digital infrastructure with Smart Signs, interactive maps, and community engagement tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 xl:gap-6 justify-center">
            <a
              href="/sign-up"
              className="inline-flex items-center px-8 xl:px-12 py-4 xl:py-6 text-lg xl:text-xl 2xl:text-2xl font-semibold bg-white text-blue-600 rounded-lg xl:rounded-xl hover:bg-gray-100 dark:hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 shadow-lg xl:shadow-xl"
            >
              Get Started Today
              <ArrowRight className="ml-2 w-5 h-5 xl:w-6 xl:h-6 2xl:w-8 2xl:h-8" />
            </a>
            <a
              href="/contact"
              className="inline-flex items-center px-8 xl:px-12 py-4 xl:py-6 text-lg xl:text-xl 2xl:text-2xl font-semibold border-2 border-white text-white rounded-lg xl:rounded-xl hover:bg-white hover:text-blue-600 dark:hover:text-blue-700 transition-all duration-300 transform hover:scale-105"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
