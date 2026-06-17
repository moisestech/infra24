'use client';

import { flexFormats } from '@/lib/playwire/adFormats';
import { pw } from './playwireTheme';
import { cn } from '@/lib/utils';

const formatColors: Record<string, string> = {
  'flex-skin': 'from-[#e85d4c]/20 to-[#1a2b4a]/10',
  'flex-rail': 'from-[#1a2b4a]/15 to-[#e85d4c]/10',
  'flex-leaderboard': 'from-[#2d4a7c]/20 to-[#e85d4c]/15',
};

export function FlexFormatGallery() {
  return (
    <div className="grid gap-3 sm:grid-cols-3" data-theme="playwire">
      {flexFormats.map((f) => (
        <div key={f.id} className={cn(pw.card, 'overflow-hidden')}>
          <div
            className={cn(
              'flex h-20 items-center justify-center bg-gradient-to-br',
              formatColors[f.id] ?? 'from-[#e8edf5] to-[#f8f9fc]',
            )}
            aria-hidden
          >
            <span className={cn('text-xs font-bold uppercase tracking-wider', pw.navyMuted)}>{f.name}</span>
          </div>
          <div className="p-3">
            <p className={cn('text-xs leading-relaxed', pw.navyMuted)}>{f.description}</p>
            <p className={cn('mt-2 text-xs font-semibold', pw.accent)}>~{f.rpmLiftPct}% RPM lift (illustrative)</p>
          </div>
        </div>
      ))}
    </div>
  );
}
