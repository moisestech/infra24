'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import type { KnightPacketContextLink } from '@/lib/marketing/knight-packet';
import { KnightContextIconBadge } from '@/components/marketing/knight/KnightContextIcon';
import { dccHomePhotos } from '@/lib/marketing/dcc-home-photography';
import { cn } from '@/lib/utils';

/** Ambient documentation — crossfades when no tile is hovered. */
const AMBIENT_ART_TEC = [
  {
    src: dccHomePhotos.knightArtTec2025Talk.src,
    alt: dccHomePhotos.knightArtTec2025Talk.alt,
  },
  {
    src: dccHomePhotos.knightFabiolaArtTec2025.src,
    alt: dccHomePhotos.knightFabiolaArtTec2025.alt,
  },
] as const;

const AMBIENT_INTERVAL_MS = 7500;
const AMBIENT_FADE_MS = 1600;

const ACCENT_GLOW: Record<KnightPacketContextLink['accent'], string> = {
  teal: 'hover:shadow-[0_0_44px_rgba(45,212,191,0.55)] hover:ring-2 hover:ring-teal-300/70',
  coral: 'hover:shadow-[0_0_44px_rgba(251,146,60,0.5)] hover:ring-2 hover:ring-orange-300/65',
  magenta: 'hover:shadow-[0_0_44px_rgba(232,121,249,0.52)] hover:ring-2 hover:ring-fuchsia-300/65',
  indigo: 'hover:shadow-[0_0_44px_rgba(129,140,248,0.55)] hover:ring-2 hover:ring-indigo-300/65',
};

const ACCENT_ACTIVE: Record<KnightPacketContextLink['accent'], string> = {
  teal: 'ring-2 ring-teal-200/90 shadow-[0_0_48px_rgba(45,212,191,0.65)] bg-white/22',
  coral: 'ring-2 ring-orange-200/85 shadow-[0_0_48px_rgba(251,146,60,0.58)] bg-white/22',
  magenta: 'ring-2 ring-fuchsia-200/85 shadow-[0_0_48px_rgba(232,121,249,0.58)] bg-white/22',
  indigo: 'ring-2 ring-indigo-200/85 shadow-[0_0_48px_rgba(129,140,248,0.58)] bg-white/22',
};

type KnightDccLinksPreviewProps = {
  items: KnightPacketContextLink[];
};

export function KnightDccLinksPreview({ items }: KnightDccLinksPreviewProps) {
  /** `null` = ambient ART/TEC slideshow; otherwise show that destination’s preview image. */
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [ambientPhase, setAmbientPhase] = useState(0);

  useEffect(() => {
    if (hoveredId !== null) return undefined;
    const id = window.setInterval(() => {
      setAmbientPhase((p) => (p + 1) % AMBIENT_ART_TEC.length);
    }, AMBIENT_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [hoveredId]);

  const handleLeaveList = useCallback(() => {
    setHoveredId(null);
  }, []);

  const activeItem = hoveredId ? items.find((i) => i.id === hoveredId) : null;

  return (
    <section
      id="identity"
      className="relative scroll-mt-28 overflow-hidden border-b border-neutral-200/80 dark:border-neutral-800"
    >
      <div className="absolute inset-0" aria-hidden>
        {/* Ambient ART/TEC — visible when idle */}
        <div
          className={cn(
            'absolute inset-0 z-0 transition-opacity duration-500',
            hoveredId !== null ? 'opacity-0' : 'opacity-100'
          )}
        >
          {AMBIENT_ART_TEC.map((shot, index) => (
            <div
              key={shot.src}
              className={cn(
                'absolute inset-0 transition-opacity ease-in-out',
                ambientPhase === index ? 'z-[1] opacity-100' : 'z-0 opacity-0'
              )}
              style={{ transitionDuration: `${AMBIENT_FADE_MS}ms` }}
            >
              <Image
                src={shot.src}
                alt=""
                fill
                className="object-cover object-center"
                sizes="100vw"
                priority={index === 0}
                aria-hidden
              />
            </div>
          ))}
        </div>

        {/* Per-link previews on hover */}
        {items.map((item) => (
          <div
            key={item.id}
            className={cn(
              'absolute inset-0 z-[1] transition-opacity duration-500 ease-out',
              hoveredId === item.id ? 'opacity-100' : 'pointer-events-none opacity-0'
            )}
          >
            <Image
              src={item.previewSrc}
              alt=""
              fill
              className="object-cover object-center"
              sizes="100vw"
              aria-hidden
            />
          </div>
        ))}

        <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-t from-neutral-950/88 via-neutral-950/40 to-neutral-950/25 dark:from-black/92 dark:via-black/58 dark:to-black/28" />
        <div className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(ellipse_115%_75%_at_65%_18%,transparent_18%,rgba(0,0,0,0.38)_100%)] dark:bg-[radial-gradient(ellipse_100%_65%_at_78%_0%,transparent_0%,rgba(0,0,0,0.52)_100%)]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[min(78svh,880px)] max-w-6xl flex-col px-4 pb-8 pt-12 sm:px-6 sm:pb-10 sm:pt-16 lg:px-8">
        <header className="max-w-4xl [text-shadow:0_2px_24px_rgba(0,0,0,0.88),0_1px_3px_rgba(0,0,0,0.9)]">
          <p className="font-mono text-xl uppercase tracking-[0.18em] text-teal-100 sm:text-2xl">
            DCC links
          </p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:mt-4 sm:text-6xl lg:text-7xl">
            Public destinations
          </h2>
          {activeItem ? (
            <>
              <p className="mt-4 text-xl font-medium leading-snug text-white sm:text-2xl">
                Previewing — {activeItem.title}
              </p>
              <p className="mt-4 max-w-3xl text-lg leading-relaxed text-white sm:text-2xl sm:leading-relaxed">
                {activeItem.description}
              </p>
            </>
          ) : (
            <>
              <p className="mt-4 max-w-3xl text-lg leading-relaxed text-white sm:text-2xl sm:leading-relaxed">
                Hover a tile for a destination preview. ART/TEC documentation alternates behind the
                grid when idle.
              </p>
              <p className="mt-3 font-mono text-base uppercase tracking-[0.14em] text-white/70 sm:text-lg">
                Session · Miami · Field documentation
              </p>
            </>
          )}
        </header>

        <div className="mt-auto w-full pt-10 lg:pt-16">
          <ul
            className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-3 xl:grid-cols-4 [&::-webkit-scrollbar]:hidden"
            onMouseLeave={handleLeaveList}
          >
            {items.map((item) => {
              const isHighlighted = hoveredId === item.id;
              return (
                <li
                  key={item.id}
                  className="min-w-[min(100%,14rem)] snap-start sm:min-w-0"
                  onMouseEnter={() => setHoveredId(item.id)}
                  onFocus={() => setHoveredId(item.id)}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      'group relative flex min-h-[11rem] flex-col gap-3 rounded-2xl border border-white/18 bg-white/12 p-5 shadow-[0_12px_40px_rgba(0,0,0,0.35)] ring-1 ring-white/12 backdrop-blur-md transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent sm:min-h-[12.5rem] sm:p-5',
                      ACCENT_GLOW[item.accent],
                      'hover:-translate-y-1 hover:border-white/45 hover:bg-white/20 hover:shadow-[0_20px_50px_rgba(0,0,0,0.45)]',
                      'focus-visible:ring-white/85',
                      isHighlighted && ACCENT_ACTIVE[item.accent],
                      isHighlighted && '-translate-y-0.5'
                    )}
                    {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    <div className="flex items-start gap-3">
                      <KnightContextIconBadge icon={item.icon} accent={item.accent} size="compact" />
                      <div className="min-w-0 flex-1">
                        <span className="line-clamp-2 text-left text-base font-semibold leading-snug text-white sm:text-xl">
                          {item.title}
                        </span>
                      </div>
                    </div>
                    <p className="line-clamp-3 text-left text-sm leading-snug text-white/72 transition duration-300 group-hover:text-white/90 sm:text-lg">
                      {item.description}
                    </p>
                    <div
                      className="mt-auto h-[3px] w-0 rounded-full bg-gradient-to-r from-transparent via-white/90 to-transparent transition-all duration-500 ease-out group-hover:w-full"
                      aria-hidden
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
