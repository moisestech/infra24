"use client";

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun, Moon, Plus, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Home } from 'lucide-react';
import Image from 'next/image';
import { ViewModeToggle } from './ViewModeToggle';

const typeStyles = {
  urgent: { label: 'Urgent', color: 'bg-red-600' },
  facility: { label: 'Facility', color: 'bg-blue-600' },
  event: { label: 'Event', color: 'bg-amber-600' },
  opportunity: { label: 'Opportunity', color: 'bg-purple-600' },
  administrative: { label: 'Administrative', color: 'bg-slate-700' },
};

interface NavbarProps {
  viewMode: 'grid' | 'carousel';
  setViewMode: () => void;
  isLoading: boolean;
  typeFilter?: keyof typeof typeStyles | 'all';
  onTypeFilterChange?: (type: keyof typeof typeStyles | 'all') => void;
}

export function Navbar({ viewMode, setViewMode, isLoading, typeFilter = 'all', onTypeFilterChange }: NavbarProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Avoid hydration mismatch

  return (
    <div className={`fixed top-0 left-0 z-50 transition-all duration-300 bg-white/80 dark:bg-black/80 border-r border-gray-200 dark:border-gray-800 ${isCollapsed ? 'w-20' : 'w-64'} ${isCompact ? 'h-16' : 'h-full'}`}>
      <nav
        tabIndex={0}
        className={`
          transition-all duration-300
          absolute top-0 left-0
          w-full
          ${isCompact ? 'h-16' : 'h-full'}
          flex flex-col
          hover:bg-blue-100 hover:dark:bg-blue-900
        `}
        style={{ transitionProperty: 'background, width, height' }}
      >
        <div className="flex items-center justify-between p-4">
          {/* Logo/Icon */}
          <span className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <Image src="/bac-icon.png" alt="Bakehouse Icon" width={32} height={32} priority />
            {!isCollapsed && 'Bakehouse News'}
          </span>
          <div className="flex items-center gap-2">
            {/* Height Toggle Button */}
            <button
              onClick={() => setIsCompact(!isCompact)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              {isCompact ? <ChevronDown /> : <ChevronUp />}
            </button>
            {/* Collapse Button */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
            </button>
          </div>
        </div>
        {/* Only show menu if not compact */}
        {!isCompact && (
          <>
            <div className="flex-1 flex flex-col gap-4 p-4">
              {/* Home Example */}
              <Link href="/" className="flex items-center gap-3">
                <Home />
                {!isCollapsed && <span>Home</span>}
              </Link>
              {/* Type Filter Dropdown */}
              <div className="flex items-center gap-2">
                <select
                  value={typeFilter}
                  onChange={e => onTypeFilterChange?.(e.target.value as keyof typeof typeStyles | 'all')}
                  className={`px-3 py-2 rounded bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-sm font-medium focus:outline-none focus:ring focus:border-blue-400 ${isCollapsed ? 'hidden' : ''}`}
                >
                  <option value="all">All Types</option>
                  {Object.entries(typeStyles).map(([type, { label, color }]) => (
                    <option key={type} value={type}>
                      {label}
                    </option>
                  ))}
                </select>
                {/* Show color indicator for selected type */}
                {typeFilter !== 'all' && (
                  <span className={`inline-block w-4 h-4 rounded-full ml-1 ${typeStyles[typeFilter as keyof typeof typeStyles].color}`} />
                )}
              </div>
              {/* Carousel View Toggle */}
              <div className={isCollapsed ? 'justify-center flex' : ''}>
                <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} isLoading={isLoading} />
              </div>
              {/* Create Announcement Button */}
              <Link href="/create-announcement" className={isCollapsed ? 'justify-center flex' : ''}>
                <button className={`flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition ${isCollapsed ? 'px-2 py-2' : ''}`}>
                  <Plus className="w-5 h-5" />
                  {!isCollapsed && 'Create Announcement'}
                </button>
              </Link>
            </div>
            {/* Theme toggle at bottom, only if not compact */}
            <div className="p-4 mt-auto flex justify-center">
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                title="Toggle Theme"
              >
                {theme === 'dark' ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
              </button>
            </div>
          </>
        )}
      </nav>
    </div>
    // Top nav for mobile (optional, not implemented here)
  );
} 