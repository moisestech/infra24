'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/Badge';
import { 
  Clock, 
  Users, 
  Calendar, 
  ArrowRight, 
  Bot, 
  Printer, 
  Code, 
  Camera, 
  Globe, 
  Headphones, 
  VrBox 
} from 'lucide-react';
import { getWorkshopsForOrganization, getWorkshopCategories } from '@/lib/workshops/shared-workshops';

const workshops = getWorkshopsForOrganization('oolite');
const categories = getWorkshopCategories();

interface OoliteWorkshopsPageProps {
  theme?: 'light' | 'dark';
  bannerImage?: string;
}

export default function OoliteWorkshopsPage({ theme = 'light', bannerImage }: OoliteWorkshopsPageProps) {
  // Oolite organization colors
  const ooliteColors = {
    primary: '#47abc4',
    primaryLight: '#6bb8d1',
    primaryDark: '#3a8ba3',
    primaryAlpha: 'rgba(71, 171, 196, 0.1)',
    primaryAlphaLight: 'rgba(71, 171, 196, 0.05)',
    primaryAlphaDark: 'rgba(71, 171, 196, 0.15)',
    // Dark theme colors - using proper dark blues and grays
    darkPrimary: '#1e3a8a', // Dark blue
    darkSecondary: '#1e293b', // Dark slate
    darkSurface: '#334155', // Slate 700
    darkBorder: '#475569', // Slate 600
    darkBackground: '#0f172a', // Slate 900
    darkAccent: '#1e40af', // Blue 800
  };

  // Theme-aware styles
  const getThemeStyles = () => {
    const isDark = theme === 'dark';
    if (isDark) {
      return {
        background: `linear-gradient(135deg, ${ooliteColors.darkBackground} 0%, ${ooliteColors.darkSecondary} 50%, ${ooliteColors.darkAccent} 100%)`,
        cardBg: ooliteColors.darkSurface,
        cardBorder: ooliteColors.darkBorder,
        textPrimary: '#ffffff',
        textSecondary: '#cbd5e1', // Slate 300
        textMuted: '#94a3b8', // Slate 400
        surfaceBg: ooliteColors.darkSurface,
        mutedBg: ooliteColors.darkSecondary,
        buttonBg: ooliteColors.primary,
        buttonHover: ooliteColors.primaryLight,
      };
    } else {
      return {
        background: `linear-gradient(135deg, ${ooliteColors.primaryAlphaLight} 0%, #ffffff 50%, ${ooliteColors.primaryAlphaLight} 100%)`,
        cardBg: '#ffffff',
        cardBorder: '#e5e5e5',
        textPrimary: '#1a1a1a',
        textSecondary: '#666666',
        textMuted: '#999999',
        surfaceBg: '#ffffff',
        mutedBg: '#f8fafc',
        buttonBg: ooliteColors.primary,
        buttonHover: ooliteColors.primaryLight,
      };
    }
  };

  const themeStyles = getThemeStyles();
  
  // Category icons mapping
  const categoryIcons: { [key: string]: React.ComponentType<{ className?: string }> } = {
    'AI & Technology': Bot,
    'Digital Fabrication': Printer,
    'Creative Technology': Code,
    'Digital Media': Camera,
    'Web Development': Globe,
    'Audio Production': Headphones,
    'Immersive Technology': VrBox,
  };
  
  // Debug logging
  console.log('🎨 Workshops Page Theme Debug:');
  console.log('Theme:', theme);
  console.log('Background gradient:', themeStyles.background);
  console.log('Text primary:', themeStyles.textPrimary);
  console.log('Card background:', themeStyles.cardBg);
  
  return (
    <div 
      className="min-h-screen"
      style={{ background: themeStyles.background }}
    >
      {/* Banner Section */}
      {bannerImage && (
        <div className="relative h-64 md:h-80 overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${bannerImage})`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50" />
          <div className="relative z-10 flex items-end h-full">
            <div className="container mx-auto px-4 pb-8">
              <h1 
                className="text-4xl md:text-5xl font-bold mb-4"
                style={{ color: '#ffffff' }}
              >
                Digital Art Workshops
              </h1>
              <p 
                className="text-lg md:text-xl max-w-3xl"
                style={{ color: '#ffffff' }}
              >
                Comprehensive workshop series covering AI, 3D printing, creative coding, and more. 
                Join our community of digital artists and creators.
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="container mx-auto px-4 py-16">
        {/* Header (only show if no banner) */}
        {!bannerImage && (
          <div className="text-center mb-16">
            <h1 
              className="text-5xl font-bold mb-6"
              style={{ color: themeStyles.textPrimary }}
            >
              Digital Art Workshops
            </h1>
            <p 
              className="text-xl max-w-3xl mx-auto mb-8"
              style={{ color: themeStyles.textSecondary }}
            >
              Comprehensive workshop series covering AI, 3D printing, creative coding, and more. 
              Join our community of digital artists and creators.
            </p>
          </div>
        )}

        {/* Workshop Categories */}
        <div className="mb-16">
          <h2 
            className="text-3xl font-bold text-center mb-12"
            style={{ color: themeStyles.textPrimary }}
          >
            Workshop Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => {
              const count = workshops.filter(w => w.category === category).length;
              const IconComponent = categoryIcons[category] || Code; // Default to Code icon
              const isDark = theme === 'dark';
              const colors = isDark ? [
                'bg-purple-900/30 text-purple-300 border-purple-700',
                'bg-blue-900/30 text-blue-300 border-blue-700', 
                'bg-green-900/30 text-green-300 border-green-700',
                'bg-orange-900/30 text-orange-300 border-orange-700',
                'bg-red-900/30 text-red-300 border-red-700',
                'bg-indigo-900/30 text-indigo-300 border-indigo-700',
                'bg-pink-900/30 text-pink-300 border-pink-700'
              ] : [
                'bg-purple-100 text-purple-800 border-purple-200',
                'bg-blue-100 text-blue-800 border-blue-200', 
                'bg-green-100 text-green-800 border-green-200',
                'bg-orange-100 text-orange-800 border-orange-200',
                'bg-red-100 text-red-800 border-red-200',
                'bg-indigo-100 text-indigo-800 border-indigo-200',
                'bg-pink-100 text-pink-800 border-pink-200'
              ];
              return (
                <Card 
                  key={index} 
                  className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
                  style={{ 
                    backgroundColor: themeStyles.cardBg,
                    borderColor: themeStyles.cardBorder,
                    border: `1px solid ${themeStyles.cardBorder}`
                  }}
                >
                  <CardContent className="pt-6 text-center">
                    <div className="flex justify-center mb-4">
                      <div 
                        className="p-3 rounded-full"
                        style={{ 
                          backgroundColor: theme === 'dark' ? ooliteColors.primaryAlphaDark : ooliteColors.primaryAlphaLight
                        }}
                      >
                        <IconComponent 
                          className="w-8 h-8" 
                          style={{ color: ooliteColors.primary }}
                        />
                      </div>
                    </div>
                    <h3 
                      className="text-lg font-semibold mb-2"
                      style={{ color: themeStyles.textPrimary }}
                    >
                      {category}
                    </h3>
                    <Badge 
                      className={`${colors[index % colors.length]} border`}
                    >
                      {count} workshops
                    </Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Featured Workshops */}
        <div className="mb-16">
          <h2 
            className="text-3xl font-bold text-center mb-12"
            style={{ color: themeStyles.textPrimary }}
          >
            Featured Workshops
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {workshops.slice(0, 6).map((workshop) => {
              const isDark = theme === 'dark';
              const levelColors = isDark ? {
                beginner: 'bg-green-900/30 text-green-300 border-green-700',
                intermediate: 'bg-yellow-900/30 text-yellow-300 border-yellow-700',
                advanced: 'bg-red-900/30 text-red-300 border-red-700'
              } : {
                beginner: 'bg-green-100 text-green-800 border-green-200',
                intermediate: 'bg-yellow-100 text-yellow-800 border-yellow-200',
                advanced: 'bg-red-100 text-red-800 border-red-200'
              };
              
              // Generate workshop-specific image URL from Unsplash
              const imageUrl = `https://images.unsplash.com/photo-${workshop.id === 'ai-video-basics' ? '1551288049-bebda4e38f71' :
                workshop.id === '3d-printing-intro' ? '1581091226824-a80a8a5d8b3b' :
                workshop.id === 'creative-coding' ? '1555066931-4365d14b8c70' :
                workshop.id === 'digital-photography' ? '1606983340126-99ab4feaa64a' :
                workshop.id === 'web-design-basics' ? '1461749280684-dccba630e2f6' :
                '1551288049-bebda4e38f71'}?w=400&h=200&fit=crop&crop=center`;
              
              return (
                <Card 
                  key={workshop.id} 
                  className="hover:shadow-lg transition-all duration-300 hover:scale-105 overflow-hidden"
                  style={{ 
                    backgroundColor: themeStyles.cardBg,
                    borderColor: themeStyles.cardBorder,
                    border: `1px solid ${themeStyles.cardBorder}`
                  }}
                >
                  {/* Workshop Image */}
                  <div className="relative h-48 w-full">
                    <Image
                      src={imageUrl}
                      alt={workshop.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>
                  
                  <CardHeader>
                    <CardTitle 
                      className="text-xl"
                      style={{ color: themeStyles.textPrimary }}
                    >
                      {workshop.title}
                    </CardTitle>
                    <CardDescription 
                      className="text-base"
                      style={{ color: themeStyles.textSecondary }}
                    >
                      {workshop.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Badge 
                          variant="default"
                          style={{ 
                            backgroundColor: themeStyles.buttonBg,
                            color: 'white',
                            border: 'none'
                          }}
                        >
                          {workshop.category}
                        </Badge>
                        <Badge 
                          className={`${levelColors[workshop.level as keyof typeof levelColors]} border`}
                        >
                          {workshop.level}
                        </Badge>
                      </div>
                      
                      <div 
                        className="flex items-center gap-4 text-sm"
                        style={{ color: themeStyles.textSecondary }}
                      >
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {workshop.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {workshop.maxParticipants} max
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span 
                          className="text-lg font-semibold"
                          style={{ color: themeStyles.textPrimary }}
                        >
                          ${workshop.price}
                        </span>
                        <Button 
                          size="sm"
                          style={{ 
                            backgroundColor: themeStyles.buttonBg,
                            color: 'white',
                            border: 'none'
                          }}
                          className="hover:opacity-90 transition-opacity"
                        >
                          Register
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Call to Action */}
        <div 
          className="text-center rounded-lg p-8 shadow-lg"
          style={{ 
            backgroundColor: themeStyles.surfaceBg,
            border: `1px solid ${themeStyles.cardBorder}`
          }}
        >
          <h2 
            className="text-3xl font-bold mb-6"
            style={{ color: themeStyles.textPrimary }}
          >
            Ready to Start Learning?
          </h2>
          <p 
            className="text-xl mb-8 max-w-2xl mx-auto"
            style={{ color: themeStyles.textSecondary }}
          >
            Join our community of digital artists and start creating with cutting-edge technology. 
            All skill levels welcome!
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/o/oolite/workshops">
              <Button 
                size="lg"
                style={{ 
                  backgroundColor: themeStyles.buttonBg,
                  color: 'white',
                  border: 'none'
                }}
                className="hover:opacity-90 transition-opacity"
              >
                <Calendar className="w-5 h-5 mr-2" />
                View All Workshops
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button 
                size="lg" 
                variant="outline"
                style={{ 
                  borderColor: themeStyles.cardBorder,
                  color: themeStyles.textPrimary,
                  backgroundColor: 'transparent'
                }}
                className="hover:opacity-80 transition-opacity"
              >
                <Users className="w-5 h-5 mr-2" />
                Join Community
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}