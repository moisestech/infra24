'use client';

import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnnouncementPerson } from '@/types/people';

interface AnnouncementPeopleProps {
  people: AnnouncementPerson[];
  orientation: 'portrait' | 'landscape';
  avatarSizeMultiplier?: number;
  /** Card/smart-sign: dark text on white. Default overlay: light text on hero. */
  variant?: 'overlay' | 'inline';
  className?: string;
}

export function AnnouncementPeople({
  people,
  orientation,
  avatarSizeMultiplier = 1,
  variant = 'overlay',
  className,
}: AnnouncementPeopleProps) {
  if (!people || people.length === 0) {
    return null;
  }

  const inline = variant === 'inline';

  const getAvatarSize = (baseSize: number) => {
    if (inline) return Math.round(36 * baseSize);
    const largeBaseSize = orientation === 'portrait' ? 24 : 20;
    return Math.round(largeBaseSize * avatarSizeMultiplier);
  };

  const getTextSize = () => {
    if (inline) return 'text-sm md:text-base';
    if (avatarSizeMultiplier >= 6) return 'text-4xl';
    if (avatarSizeMultiplier >= 5) return 'text-3xl';
    if (avatarSizeMultiplier >= 4) return 'text-2xl';
    if (avatarSizeMultiplier >= 3) return 'text-xl';
    if (avatarSizeMultiplier >= 2) return 'text-lg';
    return orientation === 'portrait' ? 'text-lg' : 'text-base';
  };

  const avatarPx = getAvatarSize(1);

  return (
    <motion.div
      className={cn('space-y-3', className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <div className="mb-3 flex items-center gap-2">
        <User className={cn('h-4 w-4', inline ? 'text-gray-500' : 'text-white/70')} />
        <span
          className={cn(
            'text-sm font-medium',
            inline ? 'text-gray-700' : 'text-white/90'
          )}
        >
          Residents ({people.length})
        </span>
      </div>

      <div
        className={cn(
          'grid gap-2 md:gap-3',
          inline ? 'grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 gap-3'
        )}
      >
        {people.map((person, index) => (
          <motion.div
            key={person.id || index}
            className={cn(
              'flex items-center gap-3 rounded-lg p-2 md:p-3',
              inline
                ? 'border border-gray-200 bg-gray-50'
                : 'bg-white/5 p-3'
            )}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 + index * 0.05 }}
          >
            <div className="relative shrink-0">
              {person.avatar_url ? (
                <img
                  src={person.avatar_url}
                  alt={person.name || 'Person'}
                  className={cn(
                    'rounded-full object-cover',
                    inline ? 'border border-gray-200' : 'border-2 border-white/20'
                  )}
                  style={{
                    width: `${avatarPx}px`,
                    height: `${avatarPx}px`,
                  }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
              ) : null}

              <div
                className={cn(
                  'flex items-center justify-center rounded-full font-semibold',
                  inline
                    ? 'bg-[#47abc4]/15 text-[#2d8fa6] border border-[#47abc4]/30'
                    : 'border-2 border-white/20 bg-gradient-to-br from-blue-500 to-blue-600 text-white',
                  person.avatar_url ? 'hidden' : 'flex'
                )}
                style={{
                  width: `${avatarPx}px`,
                  height: `${avatarPx}px`,
                  fontSize: `${Math.max(12, avatarPx * 0.4)}px`,
                  display: person.avatar_url ? 'none' : 'flex',
                }}
              >
                {person.name ? person.name.charAt(0).toUpperCase() : '?'}
              </div>
            </div>

            <div className="min-w-0 flex-1">
              {person.role && /^studio\s/i.test(person.role) ? (
                <div
                  className={cn(
                    'truncate font-black tracking-tight',
                    inline ? 'text-base text-[#47abc4] md:text-lg' : getTextSize(),
                    !inline && 'text-[#7dd3ea]'
                  )}
                >
                  {person.role}
                </div>
              ) : null}
              <div
                className={cn(
                  'truncate font-medium',
                  inline ? 'text-gray-900' : 'text-white/90',
                  person.role && /^studio\s/i.test(person.role) ? 'text-sm text-gray-600' : getTextSize()
                )}
              >
                {person.name || 'Unknown Person'}
              </div>
              {person.role && !/^studio\s/i.test(person.role) ? (
                <div
                  className={cn(
                    'truncate',
                    inline ? 'text-sm text-gray-500' : cn('text-white/60', getTextSize())
                  )}
                >
                  {person.role}
                </div>
              ) : null}
              {!inline && person.organization ? (
                <div className={cn('truncate text-white/50', getTextSize())}>
                  {person.organization}
                </div>
              ) : null}
            </div>

            {!inline ? (
              <div className="flex shrink-0 flex-col gap-1">
                {person.is_member ? (
                  <span className="inline-flex items-center rounded-full border border-green-500/30 bg-green-500/20 px-2 py-1 text-xs font-medium text-green-400">
                    ✓ Member
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full border border-orange-500/30 bg-orange-500/20 px-2 py-1 text-xs font-medium text-orange-400">
                    External
                  </span>
                )}
                {person.relationship_type && person.relationship_type !== 'participant' ? (
                  <span className="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/20 px-2 py-1 text-xs font-medium text-blue-400">
                    {person.relationship_type.replace('_', ' ')}
                  </span>
                ) : null}
              </div>
            ) : null}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
