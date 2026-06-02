'use client';

import { Eye, Shield } from 'lucide-react';

import { cn } from '@/lib/utils';

type AnnouncementMemberPreviewToggleProps = {
  viewAsMember: boolean;
  onChange: (viewAsMember: boolean) => void;
  className?: string;
};

/** Admin-only: preview the page as a public member would see it. */
export function AnnouncementMemberPreviewToggle({
  viewAsMember,
  onChange,
  className,
}: AnnouncementMemberPreviewToggleProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!viewAsMember)}
      className={cn(
        'inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors',
        viewAsMember
          ? 'border-amber-400/80 bg-amber-50 text-amber-950 dark:border-amber-600 dark:bg-amber-950/40 dark:text-amber-100'
          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700',
        className
      )}
      title={
        viewAsMember
          ? 'Switch back to admin view'
          : 'Preview what public members see'
      }
    >
      {viewAsMember ? (
        <Shield className="h-4 w-4 shrink-0" aria-hidden />
      ) : (
        <Eye className="h-4 w-4 shrink-0" aria-hidden />
      )}
      <span className="flex flex-col items-start leading-tight">
        <span className="text-[10px] font-semibold uppercase tracking-wide opacity-70">
          Preview
        </span>
        <span className="font-medium whitespace-nowrap">
          {viewAsMember ? 'Admin view' : 'Public member'}
        </span>
      </span>
    </button>
  );
}
