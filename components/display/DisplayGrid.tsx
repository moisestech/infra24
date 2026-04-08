'use client';

import { cn } from '@/lib/utils';
import type { Announcement } from '@/types/announcement';

export interface WorkshopGridItem {
  id: string;
  title: string;
  description?: string | null;
  image_url?: string | null;
  category?: string | null;
}

export interface ArtistGridItem {
  id: string;
  name: string;
  bio?: string | null;
  avatar_url?: string | null;
  profile_image?: string | null;
  studio_type?: string | null;
  /** Public API may include this for studio-resident filtering */
  metadata?: Record<string, unknown> | null;
}

interface DisplayGridProps {
  title: string;
  columns?: 1 | 2 | 3;
  className?: string;
  children: React.ReactNode;
}

export function DisplayGrid({ title, columns = 3, className, children }: DisplayGridProps) {
  return (
    <div
      className={cn(
        'min-h-screen w-full bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white p-6 md:p-10',
        className
      )}
    >
      <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-8 md:mb-10 text-center drop-shadow-lg">
        {title}
      </h2>
      <div
        className={cn(
          'grid gap-4 md:gap-6 max-w-[1800px] mx-auto',
          columns === 3 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
          columns === 2 && 'grid-cols-1 md:grid-cols-2',
          columns === 1 && 'grid-cols-1 max-w-3xl mx-auto'
        )}
      >
        {children}
      </div>
    </div>
  );
}

function imageSrc(url: string | null | undefined): string | null {
  if (!url?.trim()) return null;
  return url;
}

export function WorkshopGridCard({ item }: { item: WorkshopGridItem }) {
  const img = imageSrc(item.image_url);
  return (
    <article className="group flex flex-col rounded-2xl overflow-hidden bg-white/5 border border-white/10 shadow-xl backdrop-blur-sm hover:bg-white/10 transition-colors">
      <div className="relative aspect-video bg-gray-800">
        {img ? (
          <img src={img} alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-white/30 text-sm">Workshop</div>
        )}
      </div>
      <div className="p-4 flex flex-col gap-2 flex-1">
        {item.category && (
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-300/90">{item.category}</span>
        )}
        <h3 className="text-lg md:text-xl font-bold leading-snug line-clamp-2">{item.title}</h3>
        {item.description && (
          <p className="text-sm text-white/70 line-clamp-3 flex-1">{item.description}</p>
        )}
      </div>
    </article>
  );
}

export function ArtistGridCard({ item }: { item: ArtistGridItem }) {
  const img = imageSrc(item.avatar_url || item.profile_image);
  return (
    <article className="flex flex-col rounded-2xl overflow-hidden bg-white/5 border border-white/10 shadow-xl backdrop-blur-sm">
      <div className="relative mx-auto w-full max-h-[min(420px,50vh)] aspect-[3/4] bg-gray-800">
        {img ? (
          <img src={img} alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-white/20">
            {item.name.slice(0, 1)}
          </div>
        )}
      </div>
      <div className="p-4 text-center">
        <h3 className="text-lg md:text-xl font-bold">{item.name}</h3>
        {item.studio_type && (
          <p className="text-sm text-cyan-300/90 mt-1">{item.studio_type}</p>
        )}
        {item.bio && <p className="text-sm text-white/65 mt-2 line-clamp-3">{item.bio}</p>}
      </div>
    </article>
  );
}

export function CinematicGridCard({ announcement }: { announcement: Announcement }) {
  const img = imageSrc(announcement.image_url);
  return (
    <article className="flex flex-col rounded-2xl overflow-hidden bg-black/60 border border-white/15 shadow-xl">
      <div className="relative aspect-[2/3] bg-gray-900">
        {img ? (
          <img src={img} alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-white/30">Cinematic</div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg md:text-xl font-bold line-clamp-2">{announcement.title}</h3>
      </div>
    </article>
  );
}
