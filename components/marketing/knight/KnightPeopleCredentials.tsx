import Link from 'next/link';
import { BookUser, ExternalLink, Instagram, Linkedin, Mail } from 'lucide-react';
import type { KnightPersonCredential } from '@/lib/marketing/knight-people';
import { knightFoundersPageHref } from '@/lib/marketing/knight-people';
import { KnightPersonAvatar } from '@/components/marketing/knight/KnightPersonAvatar';
import { cn } from '@/lib/utils';

function SocialRow({ social }: { social: KnightPersonCredential['social'] }) {
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
    <div className="mt-3 flex flex-wrap gap-2">
      {items.map(({ key, href, label, Icon }) => (
        <a
          key={key}
          href={href}
          {...(href.startsWith('http')
            ? { target: '_blank' as const, rel: 'noopener noreferrer' }
            : {})}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200/90 bg-white text-neutral-700 transition-colors hover:border-teal-300 hover:bg-teal-50 hover:text-teal-900 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:border-teal-500/50 dark:hover:bg-teal-950/40 dark:hover:text-teal-100"
          aria-label={label}
        >
          <Icon className="h-4 w-4" strokeWidth={2} />
        </a>
      ))}
    </div>
  );
}

function PersonCard({ person }: { person: KnightPersonCredential }) {
  const ready = person.documentStatus === 'ready' && Boolean(person.documentHref);
  const external = Boolean(person.documentHref?.startsWith('http'));

  return (
    <li className="flex flex-col rounded-2xl border border-neutral-200/90 bg-white p-5 shadow-sm ring-1 ring-black/[0.03] dark:border-neutral-700 dark:bg-neutral-900/85 dark:ring-white/[0.05] sm:p-6">
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        <KnightPersonAvatar
          name={person.name}
          initials={person.initials}
          initialsClass={person.initialsClass}
          portraitSrc={person.portraitSrc}
          portraitAlt={person.portraitAlt}
        />
        <div className="min-w-0 flex-1 text-center sm:text-left">
          <p className="text-base font-semibold text-neutral-900 dark:text-neutral-50">{person.name}</p>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">{person.subtitle}</p>
          <SocialRow social={person.social} />
          <div className="mt-4 flex flex-col gap-1.5 sm:items-start">
            {ready ? (
              <a
                href={person.documentHref}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200 sm:inline-flex"
                {...(external ? { target: '_blank' as const, rel: 'noopener noreferrer' } : {})}
              >
                {person.documentLabel}
                {external ? <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-90" aria-hidden /> : null}
              </a>
            ) : (
              <span className="inline-flex flex-col items-center gap-1 rounded-lg border border-dashed border-neutral-300 bg-neutral-50 px-4 py-2.5 text-sm font-medium text-neutral-600 dark:border-neutral-600 dark:bg-neutral-800/80 dark:text-neutral-400 sm:items-start">
                <span>{person.documentLabel}</span>
                <span className="text-xs font-normal tracking-wide text-neutral-500 dark:text-neutral-500">
                  Coming soon
                </span>
              </span>
            )}
            {ready && external ? (
              <span className="text-[11px] text-neutral-500 dark:text-neutral-500">
                Opens in Google Drive
              </span>
            ) : null}
          </div>
        </div>
      </div>
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
        'scroll-mt-28 border-y border-neutral-200/80 bg-gradient-to-b from-orange-50/30 via-white to-teal-50/25 py-14 dark:border-neutral-800 dark:from-orange-950/15 dark:via-neutral-950 dark:to-teal-950/15 sm:py-20 lg:py-24',
        className
      )}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              People and credentials
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              Rina’s recommendation letter and the founders’ CV packet link to{' '}
              <strong className="font-medium text-neutral-800 dark:text-neutral-200">Google Drive</strong>{' '}
              (PDF viewer). Fabiola’s separate CV file is listed as coming soon until it is uploaded.
              Instagram, LinkedIn, and email appear on each card when those URLs are configured.
            </p>
          </div>
          <Link
            href={knightFoundersPageHref}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-neutral-200/90 bg-white px-4 py-2.5 text-sm font-medium text-neutral-900 shadow-sm transition-colors hover:border-teal-400 hover:bg-teal-50/60 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:border-teal-500/50 dark:hover:bg-teal-950/35"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-200">
              <BookUser className="h-4 w-4" strokeWidth={2} aria-hidden />
            </span>
            Founder bios (full page)
          </Link>
        </div>

        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {people.map((p) => (
            <PersonCard key={p.id} person={p} />
          ))}
        </ul>
      </div>
    </section>
  );
}
