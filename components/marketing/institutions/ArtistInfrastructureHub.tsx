import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { CtaBlock, Section } from '@/components/marketing/cdc';
import { artistInfrastructurePage as P } from '@/lib/marketing/institutions/artistInfrastructure';
import { isExternalHref } from '@/lib/marketing/institutions/shared';
import { cn } from '@/lib/utils';
import { CurriculumModuleCard } from './CurriculumModuleCard';
import { HeroWorkshopCarousel } from './HeroWorkshopCarousel';
import { LogoBand } from './LogoBand';
import { OfferLink } from './OfferLink';

/** Header (~85px) + family strip (~57px). Literal so Tailwind JIT can see it. */
const SECTION_SCROLL = 'scroll-mt-44';

const SECTION_NAV = [
  { id: 'positioning', label: 'Positioning' },
  { id: 'curriculum', label: 'Curriculum' },
  { id: 'oolite-proof', label: 'Oolite' },
  { id: 'process', label: 'Process' },
  { id: 'supporting-proof', label: 'Proof' },
  { id: 'practice', label: 'Practice' },
  { id: 'engagement', label: 'Engage' },
  { id: 'contact', label: 'Contact' },
] as const;

function OutboundMark({ href }: { href: string }) {
  if (!isExternalHref(href) || href.startsWith('mailto:')) return null;
  return <ArrowUpRight className="ml-1 inline h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden />;
}

export function ArtistInfrastructureHub() {
  return (
    <>
      <nav
        aria-label="Page sections"
        className="border-b border-[var(--cdc-border)] bg-white dark:border-neutral-800 dark:bg-neutral-950"
      >
        <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 py-2 sm:px-6 lg:px-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {SECTION_NAV.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="inline-flex min-h-10 shrink-0 items-center px-3 text-xs font-medium text-neutral-600 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-neutral-100"
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      <Section className="border-b border-[var(--cdc-border)] dark:border-neutral-800">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          <div>
            <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{P.hero.availability}</p>
            <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
              Bookable public catalog and hosted rates live on{' '}
              <OfferLink href="/workshops" className="font-medium underline-offset-4 hover:underline">
                /workshops
              </OfferLink>
              — not as a price wall on this page.
            </p>
          </div>
          <HeroWorkshopCarousel slides={P.hero.carousel} note={P.hero.imageNote} />
        </div>
      </Section>

      <Section className="border-b border-[var(--cdc-border)] bg-white dark:border-neutral-800 dark:bg-neutral-950">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
          {P.contextProof.eyebrow}
        </p>
        <ul className="mt-6 grid gap-4 sm:grid-cols-3">
          {P.contextProof.items.map((item) => (
            <li
              key={item.id}
              className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-700"
            >
              <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">{item.label}</p>
              <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{item.body}</p>
            </li>
          ))}
        </ul>
        <LogoBand items={P.logoBand} label={P.logoBandLabel} className="mt-10 border-b-0 pb-0" />
      </Section>

      <Section
        id="positioning"
        className={cn(SECTION_SCROLL, 'border-b border-[var(--cdc-border)] dark:border-neutral-800')}
      >
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
          {P.positioning.eyebrow}
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
          {P.positioning.title}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          {P.positioning.lead}
        </p>
        <ul className="mt-8 grid gap-4 lg:grid-cols-3">
          {P.positioning.cards.map((card) => (
            <li
              key={card.id}
              className="overflow-hidden rounded-lg border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900"
            >
              <div className="relative aspect-[16/10]">
                <Image src={card.image.src} alt={card.image.alt} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 33vw" />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{card.body}</p>
                <OfferLink
                  href={card.href}
                  className="mt-4 inline-flex items-center text-sm font-medium text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-100"
                >
                  {card.hrefLabel}
                  <OutboundMark href={card.href} />
                </OfferLink>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        id="curriculum"
        className={cn(
          SECTION_SCROLL,
          'border-b border-[var(--cdc-border)] bg-white dark:border-neutral-800 dark:bg-neutral-950'
        )}
      >
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
          {P.curriculum.eyebrow}
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
          {P.curriculum.title}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          {P.curriculum.lead}
        </p>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {P.curriculum.modules.map((module, i) => (
            <li key={module.id} className="min-h-0">
              <CurriculumModuleCard module={module} defaultOpen={i === 0} />
            </li>
          ))}
        </ul>
        <p className="mt-8 text-sm text-neutral-600 dark:text-neutral-400">
          Live DCC landings:{' '}
          <OfferLink href="/workshop/vibe-coding-net-art" className="font-medium underline-offset-4 hover:underline">
            Vibe Coding & Net Art
          </OfferLink>
          {' · '}
          <OfferLink href="/workshop/resin-printing" className="font-medium underline-offset-4 hover:underline">
            Resin printing
          </OfferLink>
          . Full catalog:{' '}
          <OfferLink href="/workshops" className="font-medium underline-offset-4 hover:underline">
            /workshops
          </OfferLink>
          .
        </p>
      </Section>

      <Section
        id="oolite-proof"
        className={cn(SECTION_SCROLL, 'border-b border-[var(--cdc-border)] dark:border-neutral-800')}
      >
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
              {P.ooliteProof.eyebrow}
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
              {P.ooliteProof.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{P.ooliteProof.lead}</p>
            <p className="mt-4 border-l-2 border-[var(--cdc-teal)] pl-4 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
              {P.ooliteProof.credit}
            </p>
            <p className="cdc-font-mono-accent mt-3 text-[10px] uppercase tracking-[0.14em] text-neutral-500">
              {P.ooliteProof.contractNote}
            </p>
            <ul className="mt-5 space-y-2">
              {P.ooliteProof.points.map((point) => (
                <li key={point} className="text-sm text-neutral-700 dark:text-neutral-300">
                  {point}
                </li>
              ))}
            </ul>
            <OfferLink
              href={P.ooliteProof.href}
              className="mt-6 inline-flex items-center text-sm font-semibold text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-100"
            >
              {P.ooliteProof.hrefLabel}
              <OutboundMark href={P.ooliteProof.href} />
            </OfferLink>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {P.ooliteProof.gallery.map((img) => (
              <li
                key={img.src}
                className={cn(
                  'overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-700',
                  img.category === 'wide' && 'sm:col-span-2'
                )}
              >
                <div className="relative aspect-[16/10]">
                  <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
                </div>
                {img.caption ? (
                  <p className="px-3 py-2 text-xs text-neutral-500 dark:text-neutral-400">{img.caption}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section
        id="process"
        className={cn(
          SECTION_SCROLL,
          'border-b border-[var(--cdc-border)] bg-white dark:border-neutral-800 dark:bg-neutral-950'
        )}
      >
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
          {P.engagementProcess.eyebrow}
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
          {P.engagementProcess.title}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          {P.engagementProcess.valueLine}
        </p>
        <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {P.engagementProcess.steps.map((step, i) => (
            <li key={step.id} className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-700">
              <p className="cdc-font-mono-accent text-[10px] uppercase tracking-[0.16em] text-neutral-500">
                {String(i + 1).padStart(2, '0')}
              </p>
              <h3 className="mt-2 text-sm font-semibold text-neutral-900 dark:text-neutral-50">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{step.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section
        id="supporting-proof"
        className={cn(SECTION_SCROLL, 'border-b border-[var(--cdc-border)] dark:border-neutral-800')}
      >
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
          {P.supportingProof.eyebrow}
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
          {P.supportingProof.title}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          {P.supportingProof.lead}
        </p>
        <ul className="mt-8 grid gap-4 lg:grid-cols-3">
          {P.supportingProof.cards.map((card) => (
            <li
              key={card.id}
              className="overflow-hidden rounded-lg border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900"
            >
              <div className="relative aspect-[16/10]">
                <Image src={card.image.src} alt={card.image.alt} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 33vw" />
              </div>
              <div className="p-5">
                <p className="cdc-font-mono-accent text-[10px] uppercase tracking-[0.16em] text-neutral-500">
                  {card.status.replace('-', ' ')}
                </p>
                <h3 className="mt-1 font-semibold text-neutral-900 dark:text-neutral-50">{card.title}</h3>
                <p className="mt-1 text-xs text-neutral-500">{card.org}</p>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{card.body}</p>
                <p className="mt-2 text-xs text-neutral-500">{card.statusNote}</p>
                <OfferLink
                  href={card.href}
                  className="mt-4 inline-flex items-center text-sm font-medium underline-offset-4 hover:underline"
                >
                  Open
                  <OutboundMark href={card.href} />
                </OfferLink>
                {'secondaryHref' in card && card.secondaryHref ? (
                  <OfferLink
                    href={card.secondaryHref}
                    className="ml-3 inline-flex text-sm font-medium underline-offset-4 hover:underline"
                  >
                    {card.secondaryLabel}
                  </OfferLink>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        id="practice"
        className={cn(
          SECTION_SCROLL,
          'border-b border-[var(--cdc-border)] bg-white dark:border-neutral-800 dark:bg-neutral-950'
        )}
      >
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
          {P.practice.eyebrow}
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
          {P.practice.title}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{P.practice.lead}</p>
        <OfferLink
          href={P.practice.href}
          className="mt-3 inline-flex items-center text-sm font-medium underline-offset-4 hover:underline"
        >
          {P.practice.hrefLabel}
          <OutboundMark href={P.practice.href} />
        </OfferLink>
        <ul className="mt-8 grid gap-4 sm:grid-cols-3">
          {P.practice.projects.map((project) => (
            <li key={project.id}>
              <OfferLink href={project.href} className="group block overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-700">
                <div className="relative aspect-[16/10]">
                  <Image src={project.image.src} alt={project.image.alt} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 33vw" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-neutral-900 group-hover:underline dark:text-neutral-50">
                    {project.title}
                    <OutboundMark href={project.href} />
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{project.body}</p>
                </div>
              </OfferLink>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        id="engagement"
        className={cn(SECTION_SCROLL, 'border-b border-[var(--cdc-border)] dark:border-neutral-800')}
      >
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
          {P.engagement.eyebrow}
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
          {P.engagement.title}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          {P.engagement.availability}
        </p>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {P.engagement.formats.map((format) => (
            <li key={format.id} className="rounded-lg border border-neutral-200 p-5 dark:border-neutral-700">
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-50">{format.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{format.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="contact" className={cn(SECTION_SCROLL, 'pb-20')}>
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
          {P.cta.eyebrow}
        </p>
        <CtaBlock
          headline={P.cta.title}
          body={P.cta.lead}
          primaryLabel={P.cta.calendlyLabel}
          primaryHref={P.cta.calendlyHref}
          secondaryLabel="Email DCC Miami"
          secondaryHref={`mailto:${P.cta.email}?subject=${encodeURIComponent(P.cta.emailSubject)}`}
        />
        <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-sm">
          {P.cta.secondaryLinks.map((link) => (
            <li key={link.href}>
              <OfferLink href={link.href} className="underline-offset-4 hover:underline">
                {link.label}
                <OutboundMark href={link.href} />
              </OfferLink>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
