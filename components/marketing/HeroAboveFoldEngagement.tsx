'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ChevronRight, Mail, UserPlus } from 'lucide-react';
import { BorderBeam } from '@/components/ui/border-beam';
import { marketingHeroEngagement } from '@/lib/marketing/content';
import { cdcDigitalBeam } from '@/lib/marketing/cdc-digital-theme';
import { cn } from '@/lib/utils';

const { artistIndex, newsletter } = marketingHeroEngagement;

const shellClass = cn(
  'relative overflow-hidden rounded-2xl border border-[var(--cdc-border)] p-4 shadow-[0_1px_0_rgba(45,212,191,0.08),0_18px_48px_-28px_rgba(15,23,42,0.12)] sm:p-5',
  'bg-gradient-to-br from-white via-teal-50/[0.35] to-violet-50/40 backdrop-blur-md',
  'dark:border-neutral-600/80 dark:from-neutral-950 dark:via-neutral-900 dark:to-slate-950',
  'dark:shadow-[0_0_0_1px_rgba(45,212,191,0.06),0_24px_56px_-32px_rgba(0,0,0,0.55)]'
);

export function HeroAboveFoldEngagement({ className }: { className?: string }) {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [email, setEmail] = useState('');
  const externalAction = newsletter.formAction?.trim() ?? '';

  const onSubmit = useCallback(
    (e: FormEvent) => {
      if (externalAction) return;
      e.preventDefault();
      const q = email.trim() ? `?email=${encodeURIComponent(email.trim())}` : '';
      router.push(`/newsletter${q}`);
    },
    [email, externalAction]
  );

  return (
    <motion.div
      className={cn(shellClass, className)}
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Engineering grid + vignette */}
      <div
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-0 rounded-[inherit] opacity-[0.42] dark:hidden',
          !reduceMotion && 'motion-safe:animate-dcc-engagement-grid'
        )}
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(15,23,42,0.07) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(15,23,42,0.07) 1px, transparent 1px)
          `,
          backgroundSize: '22px 22px',
          maskImage: 'radial-gradient(ellipse 85% 75% at 50% 40%, black 10%, transparent 72%)',
        }}
      />
      <div
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-0 hidden rounded-[inherit] opacity-[0.32] dark:block',
          !reduceMotion && 'motion-safe:animate-dcc-engagement-grid'
        )}
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.055) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.055) 1px, transparent 1px)
          `,
          backgroundSize: '22px 22px',
          maskImage: 'radial-gradient(ellipse 85% 75% at 50% 40%, black 12%, transparent 70%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-t from-teal-500/[0.07] via-transparent to-violet-500/[0.06] dark:from-teal-400/[0.08] dark:to-violet-500/[0.07]"
      />

      {!reduceMotion ? (
        <BorderBeam
          size={88}
          duration={22}
          borderWidth={1.25}
          colorFrom={cdcDigitalBeam.from}
          colorTo={cdcDigitalBeam.to}
          className="opacity-55 dark:opacity-40"
        />
      ) : null}

      <div className="relative z-[1] flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-stretch sm:gap-4">
        <Link
          href={artistIndex.href}
          className={cn(
            'group relative inline-flex min-h-[2.85rem] flex-1 items-center justify-center gap-2 overflow-hidden rounded-xl px-4 text-center text-sm font-semibold no-underline sm:min-w-[12rem]',
            'border border-teal-500/35 bg-gradient-to-b from-teal-50/95 to-white/90 text-teal-950 shadow-sm',
            'transition-[transform,box-shadow,border-color] duration-300 ease-out',
            'hover:border-teal-500/55 hover:shadow-[0_0_0_1px_rgba(45,212,191,0.12),0_12px_32px_-12px_rgba(13,148,136,0.28)] active:scale-[0.99]',
            'dark:border-teal-400/30 dark:from-teal-950/70 dark:to-neutral-900/90 dark:text-teal-50',
            'dark:hover:border-teal-300/45 dark:hover:shadow-[0_0_0_1px_rgba(45,212,191,0.15),0_14px_40px_-14px_rgba(45,212,191,0.22)]'
          )}
        >
          <span
            aria-hidden
            className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-teal-400 via-cyan-400 to-violet-500 opacity-90 dark:from-teal-300 dark:via-cyan-300 dark:to-violet-400"
          />
          {!reduceMotion ? (
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 transition duration-700 ease-out group-hover:translate-x-full group-hover:opacity-100 dark:via-white/10"
            />
          ) : null}
          <UserPlus
            className="relative h-4 w-4 shrink-0 text-teal-700 transition-transform duration-300 group-hover:scale-110 dark:text-teal-200"
            aria-hidden
          />
          <span className="relative">{artistIndex.label}</span>
          <ChevronRight
            className="relative h-4 w-4 shrink-0 text-teal-600/80 transition-transform duration-300 group-hover:translate-x-0.5 dark:text-teal-300/90"
            aria-hidden
          />
        </Link>

        <form
          action={externalAction || undefined}
          method={externalAction ? 'post' : undefined}
          onSubmit={onSubmit}
          className="flex min-w-0 flex-1 flex-col gap-2 sm:min-w-[16rem] sm:flex-row sm:items-center sm:gap-2"
        >
          <label htmlFor="hero-newsletter-email" className="sr-only">
            Email address for DCC updates
          </label>
          <div className="relative min-h-[2.85rem] w-full flex-1">
            <Mail
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400 dark:text-neutral-500"
              aria-hidden
            />
            <input
              id="hero-newsletter-email"
              name={externalAction ? 'EMAIL' : 'email'}
              type="email"
              autoComplete="email"
              placeholder={newsletter.placeholder}
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              className={cn(
                'cdc-font-mono-accent h-full min-h-[2.85rem] w-full rounded-xl border py-2 pl-10 pr-3 text-sm outline-none transition-[border-color,box-shadow,background-color]',
                'border-neutral-200/90 bg-white/85 text-neutral-900 caret-teal-600 placeholder:text-neutral-400',
                'shadow-[inset_0_1px_2px_rgba(15,23,42,0.04)] focus:border-teal-500/45 focus:ring-2 focus:ring-teal-500/25',
                'dark:border-neutral-600 dark:bg-neutral-950/75 dark:text-neutral-100 dark:caret-teal-400 dark:placeholder:text-neutral-500',
                'dark:shadow-[inset_0_1px_2px_rgba(0,0,0,0.35)] dark:focus:border-teal-400/40 dark:focus:ring-teal-400/20'
              )}
            />
          </div>
          <motion.button
            type="submit"
            whileTap={reduceMotion ? undefined : { scale: 0.98 }}
            className={cn(
              'relative min-h-[2.85rem] shrink-0 overflow-hidden rounded-xl px-5 text-sm font-semibold',
              'bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-600 text-white shadow-md',
              'transition-[filter,box-shadow] duration-300 hover:brightness-[1.06] hover:shadow-lg hover:shadow-teal-600/25',
              'dark:from-teal-400 dark:via-teal-300 dark:to-cyan-400 dark:text-neutral-950 dark:shadow-teal-400/15',
              'dark:hover:shadow-cyan-400/20'
            )}
          >
            {!reduceMotion ? (
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[length:220%_100%] bg-[linear-gradient(110deg,transparent_0%,rgba(255,255,255,0.22)_45%,transparent_60%)] motion-safe:animate-dcc-engagement-shine dark:bg-[linear-gradient(110deg,transparent_0%,rgba(255,255,255,0.14)_45%,transparent_60%)]"
              />
            ) : null}
            <span className="relative">{newsletter.submitLabel}</span>
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}
