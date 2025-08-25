import { Loader2, Maximize2, LayoutGrid } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ViewModeToggleProps {
  viewMode: 'grid' | 'carousel';
  setViewMode: (mode: 'grid' | 'carousel') => void;
  isLoading: boolean;
}

export function ViewModeToggle({ viewMode, setViewMode, isLoading }: ViewModeToggleProps) {
  const handleViewModeChange = () => {
    setViewMode(viewMode === 'grid' ? 'carousel' : 'grid');
  };

  return (
    <button
      onClick={handleViewModeChange}
      disabled={isLoading}
      className={cn(
        "p-2 rounded-full bg-white/80 dark:bg-gray-900/80 shadow-lg",
        "hover:bg-white dark:hover:bg-gray-800 transition-colors",
        "relative",
        isLoading && "cursor-not-allowed opacity-80"
      )}
      title={viewMode === 'grid' ? 'Switch to Carousel View' : 'Switch to Grid View'}
    >
      {isLoading ? (
        <Loader2 className="w-6 h-6 animate-spin text-gray-600" />
      ) : viewMode === 'grid' ? (
        <Maximize2 className="w-6 h-6" />
      ) : (
        <LayoutGrid className="w-6 h-6" />
      )}
    </button>
  );
} 