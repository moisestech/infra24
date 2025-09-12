'use client';

import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { enrichPeopleData } from '@/lib/enrich-people-data';
import { AnnouncementPerson } from '@/types/people';

interface AnnouncementPeopleProps {
  people: any[];
  orientation: 'portrait' | 'landscape';
  avatarSizeMultiplier?: number;
  organizationSlug?: string;
  className?: string;
}

export function AnnouncementPeople({ 
  people, 
  orientation, 
  avatarSizeMultiplier = 1,
  organizationSlug = 'bakehouse',
  className 
}: AnnouncementPeopleProps) {
  
  const [enrichedPeople, setEnrichedPeople] = useState<AnnouncementPerson[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const enrichData = async () => {
      if (!people || people.length === 0) {
        setEnrichedPeople([]);
        setIsLoading(false);
        return;
      }

      try {
        const enriched = await enrichPeopleData(people, organizationSlug);
        setEnrichedPeople(enriched);
      } catch (error) {
        console.error('Error enriching people data:', error);
        setEnrichedPeople(people.map(person => ({
          ...person,
          is_member: false,
          relationship_type: person.relationship_type || 'participant'
        })));
      } finally {
        setIsLoading(false);
      }
    };

    enrichData();
  }, [people, organizationSlug]);

  if (!people || people.length === 0 || isLoading) {
    return null;
  }

  const getAvatarSize = (baseSize: number) => {
    // Much larger base sizes for carousel display
    const largeBaseSize = orientation === 'portrait' ? 24 : 20; // Increased from 12/10
    return Math.round(largeBaseSize * avatarSizeMultiplier);
  };

  const getTextSize = () => {
    // Much larger text sizes for carousel display
    if (avatarSizeMultiplier >= 6) return 'text-4xl';
    if (avatarSizeMultiplier >= 5) return 'text-3xl';
    if (avatarSizeMultiplier >= 4) return 'text-2xl';
    if (avatarSizeMultiplier >= 3) return 'text-xl';
    if (avatarSizeMultiplier >= 2) return 'text-lg';
    return orientation === 'portrait' ? 'text-lg' : 'text-base';
  };

  return (
    <motion.div 
      className={cn("space-y-3", className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <div className="flex items-center gap-2 mb-3">
        <User className="w-4 h-4 text-white/70" />
        <span className="text-white/90 text-sm font-medium">
          People ({enrichedPeople.length})
        </span>
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        {enrichedPeople.map((person, index) => (
          <motion.div 
            key={person.id || index}
            className="flex items-center gap-3 p-3 bg-white/5 rounded-lg"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 + (index * 0.1) }}
          >
            {/* Avatar */}
            <div className="relative">
              {person.avatar_url ? (
                <img
                  src={person.avatar_url}
                  alt={person.name || 'Person'}
                  className="rounded-full object-cover border-2 border-white/20"
                  style={{
                    width: `${getAvatarSize(1)}px`,
                    height: `${getAvatarSize(1)}px`
                  }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
              ) : null}
              
              {/* Fallback Avatar */}
              <div 
                className={cn(
                  "rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold border-2 border-white/20",
                  person.avatar_url ? 'hidden' : 'flex'
                )}
                style={{
                  width: `${getAvatarSize(1)}px`,
                  height: `${getAvatarSize(1)}px`,
                  fontSize: `${Math.max(12, getAvatarSize(1) * 0.4)}px`,
                  display: person.avatar_url ? 'none' : 'flex'
                }}
              >
                {person.name ? person.name.charAt(0).toUpperCase() : '?'}
              </div>
            </div>

            {/* Person Info */}
            <div className="flex-1 min-w-0">
              <div className={cn("text-white/90 font-medium truncate", getTextSize())}>
                {person.name || 'Unknown Person'}
              </div>
              {person.role && (
                <div className={cn("text-white/60 truncate", getTextSize())}>
                  {person.role}
                </div>
              )}
              {person.organization && (
                <div className={cn("text-white/50 truncate", getTextSize())}>
                  {person.organization}
                </div>
              )}
            </div>

            {/* Membership Badge */}
            {person.is_member && (
              <div className="flex-shrink-0">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                  Member
                </span>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
