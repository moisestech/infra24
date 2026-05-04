import type { CSSProperties } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Mail, type LucideIcon } from 'lucide-react';

import type { MarketingGradientId } from '@/lib/marketing/marketing-gradients';
import { marketingGradientSurfaceClass } from '@/lib/marketing/marketing-gradients';
import { cn } from '@/lib/utils';

/** Per-pathway hues + grid tuning for partners hero (pure CSS layers). */
export type PartnerCardAmbient = {
  hueA: number;
  hueB: number;
  hueC?: number;
  gridAngle: number;
  gridPeriod: number;
};

export type CardGridItem = {
  href: string;
  title: string;
  description: string;
  /** Optional icon (e.g. Lucide) shown beside the title row (partners: shown centered on cover only). */
  icon?: LucideIcon;
  /** Gradient cover for pathway-style cards (marketing). */
  cover?: { gradientId: MarketingGradientId; alt: string };
  /** Legacy remote image cover. */
  image?: { src: string; alt: string };
  /** Partners: colored light-wash + grid variety over the base gradient. */
  partnerAmbient?: PartnerCardAmbient;
};

type CardGridProps = {
  items: CardGridItem[];
  className?: string;
  columnsClassName?: string;
  /** Larger type, square hero with centered icon over gradient — partners index. */
  variant?: 'default' | 'partners';
};

const DEFAULT_PARTNER_AMBIENT: PartnerCardAmbient = {
  hueA: 165,
  hueB: 210,
  hueC: 130,
  gridAngle: 102,
  gridPeriod: 11,
};

function partnerAmbientLayers(amb: PartnerCardAmbient): CSSProperties {
  const c = amb.hueC ?? amb.hueA;
  return {
    backgroundImage: [
      `radial-gradient(circle at 10% 16%, hsla(${amb.hueA}, 88%, 58%, 0.44), transparent 46%)`,
      `radial-gradient(circle at 92% 20%, hsla(${amb.hueB}, 82%, 54%, 0.38), transparent 44%)`,
      `radial-gradient(circle at 78% 88%, hsla(${c}, 76%, 52%, 0.32), transparent 42%)`,
      `radial-gradient(ellipse 120% 80% at 50% 120%, hsla(${amb.hueB}, 70%, 48%, 0.22), transparent 50%)`,
      `conic-gradient(from ${amb.gridAngle + 40}deg at 50% 48%, hsla(${amb.hueA}, 75%, 58%, 0.14), transparent 28%, hsla(${amb.hueB}, 70%, 52%, 0.12) 52%, transparent 78%)`,
    ].join(', '),
  };
}

function partnerGridBackground(amb: PartnerCardAmbient): CSSProperties {
  return {
    backgroundImage: `repeating-linear-gradient(${amb.gridAngle}deg, rgba(255,255,255,0.1) 0px, rgba(255,255,255,0.1) 1px, transparent 1px, transparent ${amb.gridPeriod}px)`,
  };
}

export function CardGrid({ items, className, columnsClassName, variant = 'default' }: CardGridProps) {
  const partners = variant === 'partners';

  return (
    <ul
      className={cn(
        'grid sm:grid-cols-2 lg:grid-cols-3',
        partners ? 'gap-6' : 'gap-4',
        columnsClassName,
        className
      )}
    >
      {items.map((item) => {
        const Icon = item.icon;
        const isMailto = partners && item.href.startsWith('mailto:');
        const amb = partners ? (item.partnerAmbient ?? DEFAULT_PARTNER_AMBIENT) : null;
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-label={isMailto ? `Email DCC about ${item.title}` : undefined}
              className={cn(
                'group/link flex h-full flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm transition-colors hover:border-neutral-300 hover:bg-white/95 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:border-neutral-600 dark:hover:bg-neutral-800/40',
                partners &&
                  'partners-grid-card rounded-2xl border-neutral-200/90 dark:border-neutral-600/80'
              )}
            >
              {item.cover ? (
                <div
                  className={cn(
                    'relative w-full shrink-0 overflow-hidden',
                    partners ? 'aspect-square' : 'aspect-[16/10]'
                  )}
                >
                  {partners && amb ? (
                    <>
                      <div
                        className={cn(
                          marketingGradientSurfaceClass(item.cover.gradientId),
                          'absolute inset-0 z-0 transition-transform duration-500 ease-out group-hover/link:scale-[1.04]'
                        )}
                        aria-hidden
                      />
                      <div
                        className="pointer-events-none absolute inset-0 z-[1] opacity-[0.55] mix-blend-soft-light dark:opacity-[0.62] dark:mix-blend-screen"
                        style={partnerAmbientLayers(amb)}
                        aria-hidden
                      />
                      <div
                        className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_95%_95%_at_50%_42%,transparent_18%,rgba(0,0,0,0.36)_100%)] dark:bg-[radial-gradient(ellipse_95%_95%_at_50%_40%,transparent_22%,rgba(0,0,0,0.55)_100%)]"
                        aria-hidden
                      />
                      <div
                        className="pointer-events-none absolute inset-0 z-[1] opacity-[0.88] dark:opacity-100"
                        style={{
                          background: `radial-gradient(circle at 48% 24%, hsla(${amb.hueA}, 92%, 72%, 0.3), transparent 44%)`,
                        }}
                        aria-hidden
                      />
                      <div
                        className="pointer-events-none absolute inset-0 z-[1] opacity-[0.18] mix-blend-overlay dark:opacity-[0.14]"
                        style={partnerGridBackground(amb)}
                        aria-hidden
                      />
                      <div
                        className="pointer-events-none absolute inset-0 z-[1] opacity-[0.12] mix-blend-overlay dark:opacity-[0.1]"
                        style={{
                          backgroundImage: `repeating-linear-gradient(${amb.gridAngle + 90}deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 1px, transparent ${amb.gridPeriod + 4}px)`,
                        }}
                        aria-hidden
                      />
                      <div
                        className="relative z-[2] flex h-full min-h-[10.5rem] w-full flex-col items-center justify-center p-6 sm:min-h-[11.5rem]"
                        role="img"
                        aria-label={item.cover.alt}
                      >
                        {Icon ? (
                          <span
                            className="rounded-2xl border border-white/30 bg-black/20 p-6 shadow-[0_20px_50px_-14px_rgba(0,0,0,0.65)] ring-1 ring-white/15 backdrop-blur-[3px] dark:border-white/20 dark:bg-white/10 dark:ring-white/10"
                            style={{
                              borderColor: `hsla(${amb.hueA}, 70%, 74%, 0.42)`,
                              boxShadow: `0 0 0 1px hsla(${amb.hueB}, 65%, 58%, 0.22), 0 20px 50px -14px rgba(0,0,0,0.65)`,
                            }}
                          >
                            <Icon
                              className="h-14 w-14 text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.45)] sm:h-[4.5rem] sm:w-[4.5rem]"
                              aria-hidden
                            />
                          </span>
                        ) : null}
                      </div>
                    </>
                  ) : (
                    <div
                      className={cn(
                        marketingGradientSurfaceClass(item.cover.gradientId),
                        'absolute inset-0 transition-[transform,filter] duration-500 ease-out group-hover/link:scale-[1.03]'
                      )}
                      role="img"
                      aria-label={item.cover.alt}
                    />
                  )}
                </div>
              ) : item.image ? (
                <div
                  className={cn(
                    'relative w-full shrink-0 overflow-hidden bg-neutral-200/80 dark:bg-neutral-800',
                    partners ? 'aspect-square' : 'aspect-[16/10]'
                  )}
                >
                  <Image
                    src={item.image.src}
                    alt={partners && Icon ? '' : item.image.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className={cn(
                      'object-cover transition-[transform,filter] duration-500 ease-out group-hover/link:scale-[1.03] group-hover/link:contrast-[1.03]',
                      partners && 'brightness-[0.92] contrast-[1.05]'
                    )}
                  />
                  {partners && Icon && amb ? (
                    <>
                      <div
                        className="pointer-events-none absolute inset-0 z-[1] opacity-[0.5] mix-blend-soft-light dark:opacity-[0.58] dark:mix-blend-screen"
                        style={partnerAmbientLayers(amb)}
                        aria-hidden
                      />
                      <div
                        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/75 via-black/25 to-transparent"
                        aria-hidden
                      />
                      <div
                        className="pointer-events-none absolute inset-0 z-[1] opacity-[0.2] mix-blend-overlay"
                        style={partnerGridBackground(amb)}
                        aria-hidden
                      />
                      <div
                        className="pointer-events-none absolute inset-0 z-[1] opacity-[0.12] mix-blend-overlay"
                        style={{
                          backgroundImage: `repeating-linear-gradient(${amb.gridAngle + 90}deg, rgba(255,255,255,0.07) 0px, rgba(255,255,255,0.07) 1px, transparent 1px, transparent ${amb.gridPeriod + 4}px)`,
                        }}
                        aria-hidden
                      />
                      <div
                        className="relative z-[2] flex h-full min-h-[10.5rem] w-full items-center justify-center p-6"
                        role="img"
                        aria-label={item.image.alt}
                      >
                        <span
                          className="rounded-2xl border border-white/30 bg-black/30 p-6 shadow-[0_20px_50px_-14px_rgba(0,0,0,0.65)] ring-1 ring-white/15 backdrop-blur-sm"
                          style={{
                            borderColor: `hsla(${amb.hueA}, 65%, 72%, 0.45)`,
                            boxShadow: `0 0 0 1px hsla(${amb.hueB}, 60%, 58%, 0.2), 0 20px 50px -14px rgba(0,0,0,0.65)`,
                          }}
                        >
                          <Icon
                            className="h-14 w-14 text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.45)] sm:h-[4.5rem] sm:w-[4.5rem]"
                            aria-hidden
                          />
                        </span>
                      </div>
                    </>
                  ) : null}
                </div>
              ) : null}
              <div className={cn('relative z-[2] flex flex-1 flex-col', partners ? 'gap-4 p-6 sm:p-7' : 'gap-3 p-5')}>
                {!partners && Icon ? (
                  <span
                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-teal-500/25 bg-teal-500/[0.12] text-teal-700 shadow-[0_0_0_1px_rgba(45,212,191,0.06)] dark:border-teal-400/30 dark:bg-teal-400/10 dark:text-teal-300 dark:shadow-[0_0_20px_rgba(0,212,170,0.12)]"
                    aria-hidden
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                ) : null}
                <div className="min-w-0 flex-1">
                  <span className="flex items-start justify-between gap-3">
                    <span
                      className={cn(
                        'font-semibold text-neutral-900 dark:text-neutral-100',
                        partners
                          ? 'text-xl leading-snug sm:text-2xl lg:text-3xl'
                          : 'text-sm'
                      )}
                    >
                      {item.title}
                    </span>
                    {isMailto ? (
                      <Mail
                        className={cn(
                          'shrink-0 text-[var(--cdc-teal)] transition-all duration-200 ease-out',
                          'opacity-100 scale-100 motion-safe:opacity-0 motion-safe:scale-90 motion-safe:group-hover/link:opacity-100 motion-safe:group-hover/link:scale-100',
                          partners ? 'mt-1 h-7 w-7 sm:h-8 sm:w-8' : 'mt-0.5 h-4 w-4'
                        )}
                        aria-hidden
                      />
                    ) : (
                      <ArrowRight
                        className={cn(
                          'shrink-0 text-neutral-300 transition-colors duration-200 group-hover/link:text-[var(--cdc-teal)] dark:text-neutral-600 dark:group-hover/link:text-teal-300',
                          partners ? 'mt-1 h-7 w-7 sm:h-8 sm:w-8' : 'mt-0.5 h-4 w-4'
                        )}
                        aria-hidden
                      />
                    )}
                  </span>
                  <p
                    className={cn(
                      'leading-relaxed text-neutral-600 dark:text-neutral-400 dark:group-hover/link:text-neutral-300',
                      partners
                        ? 'mt-3 text-base sm:text-lg lg:text-xl'
                        : 'mt-2 text-sm'
                    )}
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
