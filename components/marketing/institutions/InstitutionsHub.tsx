import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { CtaBlock, Section } from '@/components/marketing/cdc';
import { institutionsHub as H } from '@/lib/marketing/institutions/hub';
import { isExternalHref } from '@/lib/marketing/institutions/shared';
import { cn } from '@/lib/utils';
import { LogoBand } from './LogoBand';
import { OfferLink } from './OfferLink';

/** Header (~85px) + family strip (~57px). Literal so Tailwind JIT can see it. */
const SECTION_SCROLL = 'scroll-mt-44';

function OutboundMark({ href }: { href: string }) {
  if (!isExternalHref(href) || href.startsWith('mailto:')) return null;
  return <ArrowUpRight className="ml-1 inline h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden />;
}

export function InstitutionsHub() {
  return (
    <>
      <nav
        aria-label="Page sections"
        className="border-b border-[var(--cdc-border)] bg-white dark:border-neutral-800 dark:bg-neutral-950"
      >
        <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 py-2 sm:px-6 lg:px-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {H.nav.map((item) => (
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
        <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{H.hero.availabilityLabel}</p>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          {H.hero.support}
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[H.hero.collage.main, H.hero.collage.teaching, H.hero.collage.workflow].map((img) => (
            <figure key={img.src} className="overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-700">
              <div className="relative aspect-[16/10]">
                <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="(max-width: 640px) 100vw, 33vw" />
              </div>
              <figcaption className="px-3 py-2 text-xs text-neutral-500 dark:text-neutral-400">{img.caption}</figcaption>
            </figure>
          ))}
        </div>
        <p className="cdc-font-mono-accent mt-4 text-[10px] uppercase tracking-[0.14em] text-neutral-500">
          {H.hero.collage.captionCard}
        </p>
      </Section>

      <Section className="border-b border-[var(--cdc-border)] bg-white dark:border-neutral-800 dark:bg-neutral-950">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
          {H.proof.eyebrow}
        </p>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {H.proof.items.map((item) => (
            <li
              key={item.id}
              className="rounded-lg border border-neutral-200 bg-[#fafafa] p-4 dark:border-neutral-700 dark:bg-neutral-900"
            >
              <OfferLink
                href={item.href}
                className="text-sm font-semibold text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-50"
              >
                {item.name}
                <OutboundMark href={item.href} />
              </OfferLink>
              <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">{item.role}</p>
              <p className="mt-1 text-xs text-neutral-500">{item.dates}</p>
            </li>
          ))}
        </ul>
        <LogoBand items={H.logoBand} label={H.logoBandLabel} className="mt-10 border-b-0 pb-0" />
      </Section>

      <Section
        id="services"
        className={cn(SECTION_SCROLL, 'border-b border-[var(--cdc-border)] dark:border-neutral-800')}
      >
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">Four practice lanes</h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {H.lanes.map((lane) => (
            <li
              key={lane.id}
              className="rounded-lg border border-neutral-200 bg-white p-5 dark:border-neutral-700 dark:bg-neutral-900 sm:p-6"
            >
              <p className="cdc-font-mono-accent text-[10px] uppercase tracking-[0.16em] text-neutral-500">
                {lane.index}
              </p>
              <h3 className="mt-2 text-lg font-semibold text-neutral-900 dark:text-neutral-50">{lane.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{lane.description}</p>
              <p className="mt-3 text-sm text-neutral-800 dark:text-neutral-200">{lane.solves}</p>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {lane.proofTags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-md border border-neutral-200 px-2 py-0.5 text-[11px] text-neutral-600 dark:border-neutral-700 dark:text-neutral-400"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
              <OfferLink
                href={lane.href}
                className="mt-4 inline-flex text-sm font-medium text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-100"
              >
                {lane.linkLabel}
              </OfferLink>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        id="system"
        className={cn(
          SECTION_SCROLL,
          'border-b border-[var(--cdc-border)] bg-white dark:border-neutral-800 dark:bg-neutral-950'
        )}
      >
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
          {H.system.eyebrow}
        </p>
        <h2 className="mt-2 max-w-3xl text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
          {H.system.title}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{H.system.caption}</p>
        <ol className="mt-8 grid gap-4 sm:grid-cols-5">
          {H.system.steps.map((step, i) => (
            <li key={step.id} className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-700">
              <p className="cdc-font-mono-accent text-[10px] uppercase tracking-[0.16em] text-neutral-500">
                {String(i + 1).padStart(2, '0')}
              </p>
              <h3 className="mt-2 text-sm font-semibold text-neutral-900 dark:text-neutral-50">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{step.body}</p>
            </li>
          ))}
        </ol>
        <p className="mt-8 max-w-2xl border-l-2 border-[var(--cdc-teal)] pl-4 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
          {H.system.callout}
        </p>
      </Section>

      <Section id="work" className={cn(SECTION_SCROLL, 'border-b border-[var(--cdc-border)] dark:border-neutral-800')}>
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
          Flagship case studies
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-neutral-600 dark:text-neutral-400">
          Full write-ups still live on moises.tech until DCC ports them.
        </p>
        <ul className="mt-10 space-y-12">
          {H.flagship.map((study) => (
            <li
              key={study.id}
              id={`work-${study.id}`}
              className={cn(SECTION_SCROLL, 'grid gap-6 lg:grid-cols-2 lg:items-start')}
            >
              <div>
                <p className="cdc-font-mono-accent text-[10px] uppercase tracking-[0.16em] text-neutral-500">
                  {study.institution} · {study.dates}
                </p>
                <h3 className="mt-2 text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
                  {study.headline}
                </h3>
                <p className="mt-1 text-sm text-neutral-500">
                  {study.role} · {study.statusLabel}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{study.summary}</p>
                <ol className="mt-4 space-y-2">
                  {study.proofSequence.map((row) => (
                    <li key={row.stage} className="text-sm text-neutral-700 dark:text-neutral-300">
                      <span className="font-medium">{row.stage}.</span> {row.text}
                    </li>
                  ))}
                </ol>
                <dl className="mt-4 grid grid-cols-2 gap-3">
                  {study.facts.map((fact) => (
                    <div key={fact.label}>
                      <dt className="text-xs text-neutral-500">{fact.label}</dt>
                      <dd className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">{fact.value}</dd>
                    </div>
                  ))}
                </dl>
                {'modules' in study && study.modules ? (
                  <ul className="mt-4 space-y-2">
                    {study.modules.map((mod) => (
                      <li key={mod.text} className="text-sm text-neutral-700 dark:text-neutral-300">
                        <span className="font-medium">{mod.label}.</span> {mod.text}
                      </li>
                    ))}
                  </ul>
                ) : null}
                <OfferLink
                  href={study.href}
                  className="mt-5 inline-flex items-center text-sm font-semibold text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-100"
                >
                  {study.cta}
                  <OutboundMark href={study.href} />
                </OfferLink>
              </div>
              <div className="grid gap-3">
                {study.media.map((img) => (
                  <div
                    key={img.src}
                    className="relative aspect-[16/10] overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-700"
                  >
                    <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
                  </div>
                ))}
                {study.id === 'ica' ? (
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">{H.icaNotions.caption}</p>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        id="evidence"
        className={cn(
          SECTION_SCROLL,
          'border-b border-[var(--cdc-border)] bg-white dark:border-neutral-800 dark:bg-neutral-950'
        )}
      >
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
          Additional evidence
        </h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {H.additionalEvidence.map((item) => (
            <li key={item.id}>
              <OfferLink
                href={item.href}
                className="group flex h-full flex-col overflow-hidden rounded-lg border border-neutral-200 bg-[#fafafa] dark:border-neutral-700 dark:bg-neutral-900"
              >
                <div className="relative aspect-[16/10]">
                  <Image src={item.imageSrc} alt={item.imageAlt} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 33vw" />
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <p className="cdc-font-mono-accent text-[10px] uppercase tracking-[0.16em] text-neutral-500">
                    {item.kindLabel}
                  </p>
                  <h3 className="mt-1 font-semibold text-neutral-900 group-hover:underline dark:text-neutral-50">
                    {item.title}
                    <OutboundMark href={item.href} />
                  </h3>
                  <p className="mt-1 text-xs text-neutral-500">{item.org}</p>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{item.body}</p>
                </div>
              </OfferLink>
            </li>
          ))}
        </ul>
      </Section>

      <Section className={cn('border-b border-[var(--cdc-border)] dark:border-neutral-800')}>
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
          {H.process.eyebrow}
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
          {H.process.title}
        </h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {H.process.reassurance.map((item) => (
            <li
              key={item}
              className="rounded-md border border-neutral-200 px-3 py-1.5 text-xs text-neutral-700 dark:border-neutral-700 dark:text-neutral-300"
            >
              {item}
            </li>
          ))}
        </ul>
        <ol className="mt-8 grid gap-4 sm:grid-cols-3">
          {H.process.steps.map((step) => (
            <li key={step.id} className="rounded-lg border border-neutral-200 p-5 dark:border-neutral-700">
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-50">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{step.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section
        id="engage"
        className={cn(
          SECTION_SCROLL,
          'border-b border-[var(--cdc-border)] bg-white dark:border-neutral-800 dark:bg-neutral-950'
        )}
      >
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
          {H.engagement.eyebrow}
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
          {H.engagement.title}
        </h2>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{H.engagement.lead}</p>
        <ul className="mt-8 grid gap-4 sm:grid-cols-3">
          {H.engagement.modes.map((mode) => (
            <li key={mode.id} className="rounded-lg border border-neutral-200 p-5 dark:border-neutral-700">
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-50">{mode.title}</h3>
              <p className="mt-1 text-xs text-neutral-500">{mode.duration}</p>
              <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{mode.outcome}</p>
              <p className="mt-3 text-sm text-neutral-800 dark:text-neutral-200">{mode.bestFor}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        id="archive"
        className={cn(SECTION_SCROLL, 'border-b border-[var(--cdc-border)] dark:border-neutral-800')}
      >
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
          Experience archive
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-neutral-600 dark:text-neutral-400">{H.honestyNote}</p>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {H.organizations.map((org) => (
            <li
              key={org.id}
              className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-700"
            >
              {org.href ? (
                <OfferLink
                  href={org.href}
                  className="font-semibold text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-50"
                >
                  {org.name}
                  <OutboundMark href={org.href} />
                </OfferLink>
              ) : (
                <p className="font-semibold text-neutral-900 dark:text-neutral-50">{org.name}</p>
              )}
              <p className="mt-1 text-xs text-neutral-500">
                {org.location} · {org.relationshipLabel}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{org.summary}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section className="border-b border-[var(--cdc-border)] bg-white dark:border-neutral-800 dark:bg-neutral-950">
        <h2 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">{H.artBand.title}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{H.artBand.body}</p>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {H.artBand.items.map((item) => (
            <li key={item.href + item.label}>
              <OfferLink href={item.href} className="group block">
                <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-700">
                  <Image src={item.src} alt={item.alt} fill className="object-cover" sizes="(max-width: 1024px) 50vw, 25vw" />
                </div>
                <p className="mt-2 text-xs font-medium text-neutral-800 group-hover:underline dark:text-neutral-200">
                  {item.label}
                  <OutboundMark href={item.href} />
                </p>
              </OfferLink>
            </li>
          ))}
        </ul>
      </Section>

      <Section className="pb-20">
        <CtaBlock
          headline={H.contact.headline}
          body={H.contact.body}
          primaryLabel={H.engagement.primaryCta.label}
          primaryHref={H.engagement.primaryCta.href}
          secondaryLabel={H.engagement.secondaryCta.label}
          secondaryHref={H.engagement.secondaryCta.href}
        />
        <p className="mt-4 text-xs text-neutral-500">
          Founder CV:{' '}
          <OfferLink href={H.contact.cvHref} className="underline-offset-4 hover:underline">
            moises.tech/cv/tech
            <OutboundMark href={H.contact.cvHref} />
          </OfferLink>
        </p>
      </Section>
    </>
  );
}
