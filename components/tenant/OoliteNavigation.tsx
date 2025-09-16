'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTenant } from './TenantProvider';
import { 
  Home, 
  Microscope, 
  GraduationCap, 
  Calendar,
  BarChart3,
  FileText,
  Bot, 
  Map, 
  DollarSign, 
  TrendingUp,
  LineChart,
  Menu,
  X
} from 'lucide-react';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const navigationItems: NavigationItem[] = [
  {
    name: 'Overview',
    href: '/o/oolite',
    icon: Home,
    description: 'Digital transformation overview'
  },
  {
    name: 'Digital Lab',
    href: '/o/oolite/digital-lab',
    icon: Microscope,
    description: 'Lab resources and equipment'
  },
  {
    name: 'Workshops',
    href: '/o/oolite/workshops',
    icon: GraduationCap,
    description: 'Educational programs and training'
  },
  {
    name: 'Bookings',
    href: '/o/oolite/bookings',
    icon: Calendar,
    description: 'Manage workshops and resources'
  },
  {
    name: 'Analytics',
    href: '/o/oolite/analytics',
    icon: BarChart3,
    description: 'Performance metrics and insights'
  },
  {
    name: 'Submissions',
    href: '/o/oolite/submissions',
    icon: FileText,
    description: 'Manage forms and review submissions'
  },
  {
    name: 'AI Tools',
    href: '/o/oolite/ai-tools',
    icon: Bot,
    description: 'AI-powered creative tools'
  },
  {
    name: 'Roadmap',
    href: '/o/oolite/roadmap',
    icon: Map,
    description: 'Strategic development plan'
  },
  {
    name: 'Budget',
    href: '/o/oolite/budget',
    icon: DollarSign,
    description: 'Financial planning and costs'
  },
  {
    name: 'Budget Prognosis',
    href: '/o/oolite/budget/prognosis',
    icon: LineChart,
    description: '2025 budget projections and planning'
  },
  {
    name: 'Impact & ROI',
    href: '/o/oolite/impact-roi',
    icon: TrendingUp,
    description: 'Success metrics and outcomes'
  }
];

export function OoliteNavigation() {
  const pathname = usePathname();
  const { tenantConfig } = useTenant();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  if (!tenantConfig || tenantConfig.slug !== 'oolite') {
    return null;
  }

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link href="/o/oolite" className="flex items-center space-x-3">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: tenantConfig.theme.primaryColor }}
              >
                O
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Oolite Arts</h1>
                <p className="text-xs text-gray-500">Digital Platform</p>
              </div>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  style={{
                    backgroundColor: isActive ? tenantConfig.theme.primaryColor : undefined
                  }}
                  title={item.description}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-50 rounded-lg mt-2">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-white'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                    style={{
                      backgroundColor: isActive ? tenantConfig.theme.primaryColor : undefined
                    }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    <div>
                      <div>{item.name}</div>
                      <div className="text-xs opacity-75">{item.description}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
