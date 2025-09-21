'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTenant } from './TenantProvider';
import { OrganizationLogo } from '@/components/ui/OrganizationLogo';
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
  X,
  Shield,
  ChevronDown,
  Users,
  Bell,
  User
} from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Button } from '@/components/ui/button';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  category?: 'user' | 'admin';
}

// User-facing navigation items
const userNavigationItems: NavigationItem[] = [
  {
    name: 'Overview',
    href: '/o/oolite',
    icon: Home,
    description: 'Digital transformation overview',
    category: 'user'
  },
  {
    name: 'Digital Lab',
    href: '/o/oolite/digital-lab',
    icon: Microscope,
    description: 'Lab resources and equipment',
    category: 'user'
  },
  {
    name: 'Workshops',
    href: '/o/oolite/workshops',
    icon: GraduationCap,
    description: 'Educational programs and training',
    category: 'user'
  },
  {
    name: 'Announcements',
    href: '/o/oolite/announcements/display',
    icon: Bell,
    description: 'Latest updates and news',
    category: 'user'
  },
  {
    name: 'Members',
    href: '/o/oolite/users',
    icon: Users,
    description: 'Community members and artists',
    category: 'user'
  },
  {
    name: 'My Surveys',
    href: '/surveys/dashboard',
    icon: FileText,
    description: 'Track your survey submissions',
    category: 'user'
  }
];

// Admin-only navigation items
const adminNavigationItems: NavigationItem[] = [
  {
    name: 'Analytics',
    href: '/o/oolite/analytics',
    icon: BarChart3,
    description: 'Performance metrics and insights',
    category: 'admin'
  },
  {
    name: 'Submissions',
    href: '/o/oolite/submissions',
    icon: FileText,
    description: 'Manage forms and review submissions',
    category: 'admin'
  },
  {
    name: 'Surveys',
    href: '/o/oolite/surveys',
    icon: FileText,
    description: 'Survey management and analytics',
    category: 'admin'
  },
  {
    name: 'Roadmap',
    href: '/o/oolite/roadmap',
    icon: Map,
    description: 'Strategic development plan',
    category: 'admin'
  },
  {
    name: 'Budget',
    href: '/o/oolite/budget',
    icon: DollarSign,
    description: 'Financial planning and costs',
    category: 'admin'
  },
  {
    name: 'Budget Prognosis',
    href: '/o/oolite/budget/prognosis',
    icon: LineChart,
    description: '2025 budget projections and planning',
    category: 'admin'
  },
  {
    name: 'Impact & ROI',
    href: '/o/oolite/impact-roi',
    icon: TrendingUp,
    description: 'Success metrics and outcomes',
    category: 'admin'
  },
  {
    name: 'AI Tools',
    href: '/o/oolite/ai-tools',
    icon: Bot,
    description: 'AI-powered creative tools',
    category: 'admin'
  },
  {
    name: 'Bookings',
    href: '/o/oolite/bookings',
    icon: Calendar,
    description: 'Manage workshops and resources',
    category: 'admin'
  }
];

export function OoliteNavigation() {
  const pathname = usePathname();
  const { tenantConfig } = useTenant();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = React.useState(false);

  if (!tenantConfig || tenantConfig.slug !== 'oolite') {
    return null;
  }

  const isActive = (href: string) => pathname === href;

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-lg border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link href="/o/oolite" className="flex items-center">
              <OrganizationLogo 
                organizationSlug="oolite" 
                variant="horizontal" 
                size="lg" 
              />
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {/* User navigation items */}
            {userNavigationItems.map((item) => {
              const isActiveItem = isActive(item.href);
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    isActiveItem
                      ? 'text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-105'
                  }`}
                  style={{
                    backgroundColor: isActiveItem ? tenantConfig.theme.primaryColor : undefined
                  }}
                  title={item.description}
                >
                  <Icon className="w-6 h-6 xl:w-4 xl:h-4" />
                  <span className="hidden xl:block">{item.name}</span>
                </Link>
              );
            })}

            {/* Admin dropdown */}
            <div className="relative group">
              <button 
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-105 transition-all duration-200"
                onMouseEnter={() => setIsAdminDropdownOpen(true)}
                onMouseLeave={() => setIsAdminDropdownOpen(false)}
              >
                <Shield className="w-6 h-6 xl:w-4 xl:h-4" />
                <span className="hidden xl:block">Admin</span>
                <ChevronDown className="w-4 h-4 hidden xl:block" />
              </button>
              
              <div 
                className={`absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50 transition-all duration-200 ${
                  isAdminDropdownOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                }`}
                onMouseEnter={() => setIsAdminDropdownOpen(true)}
                onMouseLeave={() => setIsAdminDropdownOpen(false)}
              >
                <div className="py-2">
                  <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Admin Tools
                    </div>
                  </div>
                  {adminNavigationItems.map((item) => {
                    const isActiveItem = isActive(item.href);
                    const Icon = item.icon;
                    
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center space-x-3 px-4 py-2 text-sm transition-colors ${
                          isActiveItem
                            ? 'text-white'
                            : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                        style={{
                          backgroundColor: isActiveItem ? tenantConfig.theme.primaryColor : undefined
                        }}
                      >
                        <Icon className="w-4 h-4" />
                        <div>
                          <div>{item.name}</div>
                          <div className="text-xs opacity-75">{item.description}</div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Theme toggle and user menu */}
            <div className="flex items-center space-x-2 ml-4">
              <ThemeToggle />
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <User className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
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
            <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-50 dark:bg-gray-800 rounded-lg mt-2">
              {/* User navigation items */}
              {userNavigationItems.map((item) => {
                const isActiveItem = isActive(item.href);
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActiveItem
                        ? 'text-white'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                    style={{
                      backgroundColor: isActiveItem ? tenantConfig.theme.primaryColor : undefined
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

              {/* Admin section in mobile */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Admin Tools
                </div>
                {adminNavigationItems.map((item) => {
                  const isActiveItem = isActive(item.href);
                  const Icon = item.icon;
                  
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActiveItem
                          ? 'text-white'
                          : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                      style={{
                        backgroundColor: isActiveItem ? tenantConfig.theme.primaryColor : undefined
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
          </div>
        )}
      </div>
    </nav>
  );
}
