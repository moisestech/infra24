'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  Users, 
  BookOpen, 
  TrendingUp,
  Heart,
  Target,
  Award
} from 'lucide-react';

const navItems = [
  {
    href: '/learn/admin/analytics',
    label: 'Learning Analytics',
    icon: BarChart3,
    description: 'Overall learning metrics and trends'
  },
  {
    href: '/admin/analytics/onboarding',
    label: 'Onboarding Analytics',
    icon: Users,
    description: 'User onboarding and interest tracking'
  },
  {
    href: '/admin',
    label: 'Platform Analytics',
    icon: TrendingUp,
    description: 'General platform metrics and KPIs'
  }
];

export function LearnAdminNav() {
  const pathname = usePathname();

  return (
    <div className="mb-8 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Learn Admin Dashboard</h1>
          <p className="text-zinc-400 mt-2">
            Analytics and insights for the learning platform
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "default" : "outline"}
                className={`w-full h-auto p-4 flex flex-col items-start gap-3 transition-all duration-200 ${
                  isActive 
                    ? 'bg-[#00ff00] text-black hover:bg-[#00cc00] border-[#00ff00]' 
                    : 'bg-zinc-900 border-zinc-700 text-white hover:border-[#00ff00]/50 hover:bg-zinc-800'
                }`}
              >
                <Icon className={`w-6 h-6 ${isActive ? 'text-black' : 'text-[#00ff00]'}`} />
                <div className="text-left">
                  <div className={`font-semibold ${isActive ? 'text-black' : 'text-white'}`}>
                    {item.label}
                  </div>
                  <div className={`text-sm ${isActive ? 'text-black/70' : 'text-zinc-400'}`}>
                    {item.description}
                  </div>
                </div>
              </Button>
            </Link>
          );
        })}
      </div>
    </div>
  );
} 