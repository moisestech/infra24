import type { ReactNode } from 'react';
import Link from 'next/link';
import { BookUser, ExternalLink, Instagram, Linkedin, Mail } from 'lucide-react';
import type { KnightPersonCredential } from '@/lib/marketing/knight-people';
import {
  knightFoundersPageHref,
  knightPersonCardHref,
} from '@/lib/marketing/knight-people';
import { KnightPersonAvatar } from '@/components/marketing/knight/KnightPersonAvatar';
import { cn } from '@/lib/utils';

function CardLink({
  href,
  className,
  children,
  ariaLabel,
}: {
  href: string;
  className?: string;
  children: ReactNode;
  ariaLabel: string;
}) {
  const external = href.startsWith('http');
  if (external) {
    return (
      <a
        href={href}
        className={className}
        aria-label={ariaLabel}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className} aria-label={ariaLabel}>
      {children}
    </Link>
  );
}

function SocialRow({
  social,
  className,
}: {
  social: KnightPersonCredential['social'];
  className?: string;
}) {
  const items: { key: string; href: string; label: string; Icon: typeof Mail }[] = [];
  if (social.instagram) {
    items.push({
      key: 'ig',
      href: social.instagram,
      label: 'Instagram',
      Icon: Instagram,
    });
  }
  if (social.linkedin) {
    items.push({
      key: 'in',
      href: social.linkedin,
      label: 'LinkedIn',
      Icon: Linkedin,
    });
  }
  if (social.email) {
    items.push({
      key: 'email',
      href: social.email.startsWith('mailto:') ? social.email : `mailto:${social.email}`,
      label: 'Email',
      Icon: Mail,
    });
  }

  if (items.length === 0) return null;

  return (
    <div className={cn('flex flex-wrap justify-center gap-2', className)}>
      {items.map(({ key, href, label, Icon }) => (
        <a
          key={key}
          href={href}
          {...(href.startsWith('http')
            ? { target: '_blank' as const, rel: 'noopener noreferrer' }
            : {})}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--cdc-border)] bg-white/95 text-neutral-700 shadow-sm transition-all hover:scale-105 hover:border-[color:var(--cdc-border-strong)] hover:bg-teal-50/95 hover:text-teal-900 hover:shadow-[0_0_22px_color-mix(in_oklab,var(--cdc-teal)_32%,transparent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--cdc-teal)] dark:bg-neutral-900/95 dark:text-neutral-200 dark:hover:bg-teal-950/55 dark:hover:text-teal-50 dark:hover:shadow-[0_0_26px_color-mix(in_oklab,var(--cdc-teal)_22%,transparent)]"
          aria-label={label}
        >
          <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
        </a>
      ))}
    </div>
  );
}

function PersonCard({ person }: { person: KnightPersonCredential }) {
  const ready = person.documentStatus === 'ready' && Boolean(person.documentHref);
  const external = Boolean(person.documentHref?.startsWith('http'));
  const cardHref = knightPersonCardHref(person);
  const cardLinkLabel = `Open ${person.name} — ${person.subtitle}`;

  return (
    <li className="h-full overflow-visible">
      <article
        className={cn(
          'group relative isolate flex h-full flex-col overflow-visible rounded-2xl border border-[var(--cdc-border)] bg-white shadow-md ring-1 ring-black/[0.04] transition duration-300',
          'hover:-translate-y-1 hover:border-teal-400/35 hover:shadow-[0_22px_52px_-14px_rgba(0,212,170,0.14),0_22px_52px_-14px_rgba(124,58,237,0.12)] hover:ring-teal-400/25',
          'dark:bg-neutral-900/96 dark:ring-white/[0.07]',
          'dark:hover:border-teal-400/25 dark:hover:shadow-[0_26px_56px_-14px_rgba(45,212,191,0.12),0_26px_56px_-14px_rgba(167,139,250,0.1)] dark:hover:ring-teal-400/15'
        )}
      >
        <div
          className="knight-people-card__accent h-14 shrink-0 rounded-t-2xl"
          aria-hidden
        />

        <div className="absolute left-1/2 top-14 z-[35] -translate-x-1/2 -translate-y-1/2">
          <CardLink
            href={cardHref}
            ariaLabel={cardLinkLabel}
            className="block rounded-full transition duration-300 [box-shadow:0_8px_28px_rgba(15,23,42,0.14)] group-hover:[box-shadow:0_12px_40px_color-mix(in_oklab,var(--cdc-teal)_38%,transparent)] dark:[box-shadow:0_10px_36px_rgba(0,0,0,0.55)] dark:group-hover:[box-shadow:0_14px_44px_color-mix(in_oklab,var(--cdc-teal)_26%,transparent)]"
          >
            <KnightPersonAvatar
              name={person.name}
              initials={person.initials}
              initialsClass={person.initialsClass}
              portraitSrc={person.portraitSrc}
              portraitAlt={person.portraitAlt}
              size="xl"
            />
          </CardLink>
        </div>

        <div className="relative z-10 flex min-h-0 flex-1 flex-col px-4 pb-5 pt-28 text-center sm:px-5 sm:pt-[7.5rem]">
          <CardLink
            href={cardHref}
            ariaLabel={cardLinkLabel}
            className="rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--cdc-teal)]"
          >
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">{person.name}</h3>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{person.subtitle}</p>
          </CardLink>

          <SocialRow social={person.social} className="mt-4" />

          <div className="mt-5 flex flex-1 flex-col border-t border-[var(--cdc-border)] pt-4">
            {ready ? (
              <a
                href={person.documentHref}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-transparent bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:border-[color:var(--cdc-border-strong)] hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:border-[color:var(--cdc-border-strong)] dark:hover:bg-white"
                {...(external ? { target: '_blank' as const, rel: 'noopener noreferrer' } : {})}
              >
                {person.documentLabel}
                {external ? <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-90" aria-hidden /> : null}
              </a>
            ) : (
              <span className="inline-flex flex-col items-center gap-1 rounded-xl border border-dashed border-[var(--cdc-border)] bg-neutral-50 px-4 py-2.5 text-sm font-medium text-neutral-600 dark:bg-neutral-800/85 dark:text-neutral-400">
                <span>{person.documentLabel}</span>
                <span className="text-xs font-normal tracking-wide text-neutral-500 dark:text-neutral-500">
                  Coming soon
                </span>
              </span>
            )}
            {ready && external ? (
              <span className="mt-2 text-center text-[11px] text-neutral-500 dark:text-neutral-500">
                Opens in Google Drive
              </span>
            ) : null}
          </div>
        </div>
      </article>
    </li>
  );
}

type KnightPeopleCredentialsProps = {
  people: KnightPersonCredential[];
  className?: string;
};

export function KnightPeopleCredentials({ people, className }: KnightPeopleCredentialsProps) {
  return (
    <section
      id="people"
      className={cn(
        'scroll-mt-28 overflow-visible border-y border-[var(--cdc-border)] bg-gradient-to-b from-teal-50/28 via-[var(--cdc-surface)] to-orange-50/24 py-14 dark:from-teal-950/14 dark:via-[var(--cdc-surface)] dark:to-orange-950/12 sm:py-20 lg:py-24',
        className
      )}
    >
      <div className="mx-auto max-w-6xl overflow-visible px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
          <div className="min-w-0 flex-1 text-center sm:text-left">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              People and credentials
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              Profile-style cards: portrait sits on the card edge (like LinkedIn), with Instagram and LinkedIn when
              available. Hover a card for a soft glow; the photo and name open the primary credential or profile. The
              letter and CVs open in{' '}
              <strong className="font-medium text-neutral-800 dark:text-neutral-200">Google Drive</strong> when linked.
            </p>
          </div>
          <Link
            href={knightFoundersPageHref}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-teal-200/70 bg-white px-4 py-2.5 text-sm font-medium text-neutral-900 shadow-sm transition-colors hover:border-violet-300/60 hover:bg-gradient-to-r hover:from-teal-50/90 hover:via-violet-50/50 hover:to-orange-50/70 dark:border-teal-800/50 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:border-violet-500/35 dark:hover:from-teal-950/50 dark:hover:via-violet-950/35 dark:hover:to-orange-950/30"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[linear-gradient(135deg,rgba(0,212,170,0.35),rgba(124,58,237,0.28),rgba(255,107,53,0.3))] text-teal-900 shadow-sm dark:text-teal-100">
              <BookUser className="h-4 w-4" strokeWidth={2} aria-hidden />
            </span>
            Founder bios (full page)
          </Link>
        </div>

        <ul className="mt-10 grid list-none gap-6 overflow-visible pt-2 pl-0 sm:grid-cols-2 lg:grid-cols-3">
          {people.map((p) => (
            <PersonCard key={p.id} person={p} />
          ))}
        </ul>
      </div>
    </section>
  );
}
