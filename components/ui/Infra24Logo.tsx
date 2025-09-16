import { Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Infra24LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showText?: boolean;
}

const sizeClasses = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8', 
  lg: 'w-12 h-12',
  xl: 'w-16 h-16'
};

const textSizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg', 
  xl: 'text-xl'
};

export function Infra24Logo({ 
  size = 'md', 
  className,
  showText = true 
}: Infra24LogoProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Globe className={cn(
        'text-blue-600',
        sizeClasses[size]
      )} />
      {showText && (
        <span className={cn(
          'font-bold text-gray-900',
          textSizeClasses[size]
        )}>
          Infra24
        </span>
      )}
    </div>
  );
}
