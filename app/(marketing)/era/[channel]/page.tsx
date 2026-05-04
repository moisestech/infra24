import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageHero, Section } from '@/components/marketing/cdc';
import { EraInflectionCard } from '@/components/era/cards/EraInflectionCard';
import { EraKpiLadder } from '@/components/era/EraKpiLadder';
import {
  bornDigitalEra,
  bornDigitalEraChannels,
  getBornDigitalEraChannel,
  type BornDigitalEraChannelId,
} from '@/lib/marketing/content';
import { eraMetricLadders, getEraMetricLadder } from '@/lib/era/metrics';
import { eraAccentForChannel } from '@/lib/era/tokens';
import { getCdcBreadcrumbs, getEraChannelSlugs } from '@/lib/cdc/routes';
import { cdcPageMetadata } from '@/lib/cdc/metadata';

const MeshField = dynamic(
  () => import('@/components/era/effects/MeshField').then((m) => m.MeshField),
  { ssr: false }
);
const VenueNode3D = dynamic(
  () => import('@/components/era/effects/VenueNode3D').then((m) => m.VenueNode3D),
  { ssr: false }
);
const KnowledgeLattice = dynamic(
  () =>
    import('@/components/era/effects/KnowledgeLattice').then((m) => m.KnowledgeLattice),
  { ssr: false }
);
const SignalPulse = dynamic(
  () => import('@/components/era/effects/SignalPulse').then((m) => m.SignalPulse),
  { ssr: false }
);
const LiveLoop = dynamic(
  () => import('@/components/era/effects/LiveLoop').then((m) => m.LiveLoop),
  { ssr: false }
);
const CityScan = dynamic(
  () => import('@/components/era/effects/CityScan').then((m) => m.CityScan),
  { ssr: false }
);
const ParticleDispatch = dynamic(
  () =>
    import('@/components/era/effects/ParticleDispatch').then((m) => m.ParticleDispatch),
  { ssr: false }
);

type EraChannelParams = { channel: string };

export function generateStaticParams(): EraChannelParams[] {
  return getEraChannelSlugs().map((channel) => ({ channel }));
}

export function generateMetadata({ params }: { params: EraChannelParams }): Metadata {
  return cdcPageMetadata(`/era/${params.channel}`);
}

const ROADMAP_PHASES: Record<
  BornDigitalEraChannelId,
  ReadonlyArray<{ readonly title: string; readonly body: string }>
> = {
  network: [
    {
      title: 'Phase 1 — First profiles',
      body: 'We seed the map from the people already in the room — Bakehouse, Oolite, and friends — and publish artist profiles for anyone who wants to be on it.',
    },
    {
      title: 'Phase 2 — Visible field',
      body: 'Every workshop, event, and clinic adds the people who show up. The map starts to feel current, not curated from above.',
    },
    {
      title: 'Phase 3 — Real infrastructure',
      body: 'Other organizations start using the network too — to find artists, plan programs, and surface opportunities to people who would actually use them.',
    },
  ],
  'irl-events': [
    {
      title: 'Phase 1 — First room',
      body: 'Born-Digital Era: Open Studio #1 at Bakehouse. Open hours, a short talk, and four show-and-tells from the other pathways.',
    },
    {
      title: 'Phase 2 — A regular thing',
      body: 'A quarterly mixer, plus smaller monthly events hosted at partner venues so the field meets in different parts of the city.',
    },
    {
      title: 'Phase 3 — Across neighborhoods',
      body: 'Programming spread across Wynwood, Little Haiti, and other corridors so the field is felt city-wide, not only at one studio.',
    },
  ],
  workshops: [
    {
      title: 'Phase 1 — First cohorts',
      body: 'Six workshop titles already in the catalog run as paid and scholarship cohorts. People walk out with a real project.',
    },
    {
      title: 'Phase 2 — Monthly rhythm',
      body: 'A workshop happens every month. Alumni stay in the network and start showing up for each other in clinics and open lab.',
    },
    {
      title: 'Phase 3 — Open learning',
      body: 'Course materials live in the open. Partner organizations run their own cohorts. Facilitators come from inside the network.',
    },
  ],
  clinics: [
    {
      title: 'Phase 1 — Proof',
      body: 'Twelve clinics that each end in something tangible — a website plan, an application packet, an audit, a fix. Not just a conversation.',
    },
    {
      title: 'Phase 2 — Weekly slots',
      body: 'Open weekly clinic windows on Calendly. Folks come back for the next thing on their list, not just one appointment.',
    },
    {
      title: 'Phase 3 — Plug into other orgs',
      body: 'A documented service path other organizations can point their artists toward when they need 1:1 time DCC can hold.',
    },
  ],
  'open-lab': [
    {
      title: 'Phase 1 — First open days',
      body: 'Mondays and Fridays at Bakehouse, 3 – 7 pm. Open door, real chairs, a screen running a sketch. People show up.',
    },
    {
      title: 'Phase 2 — Known hours',
      body: 'The schedule stays steady. People stop by for fifteen minutes, an hour, or the full window — whatever they need that day.',
    },
    {
      title: 'Phase 3 — More than one room',
      body: 'Open lab hours travel: satellite drop-ins at partner spaces so the door is open in more than one neighborhood.',
    },
  ],
  'public-corridor': [
    {
      title: 'Phase 1 — First surface',
      body: 'A working public interface at Bakehouse — a hallway screen running real artist work and current programs, not stock loops.',
    },
    {
      title: 'Phase 2 — Three sites',
      body: 'Two more venues join in. Screens, smart signs, or kiosks pulling from the same source so updates land everywhere at once.',
    },
    {
      title: 'Phase 3 — Around the city',
      body: 'Eight active surfaces around Miami. Hosts manage their own schedules; artists submit once and show up where their work fits.',
    },
  ],
  newsletter: [
    {
      title: 'Phase 1 — Find the voice',
      body: 'A weekly digest covering the next workshop, the next event, open clinic slots, an artist or organization to know, and one piece of writing.',
    },
    {
      title: 'Phase 2 — Stays warm',
      body: 'People actually open it. Tailored sections so artists, organizations, and partners each see what is most useful for them.',
    },
    {
      title: 'Phase 3 — Public archive',
      body: 'A searchable archive at /journal so the back catalogue stays useful long after the email lands.',
    },
  ],
};

function effectFor(effectId: string) {
  switch (effectId) {
    case 'mesh-field':
      return <MeshField />;
    case 'venue-node':
      return <VenueNode3D />;
    case 'knowledge-lattice':
      return <KnowledgeLattice />;
    case 'signal-pulse':
      return <SignalPulse />;
    case 'live-loop':
      return <LiveLoop />;
    case 'city-scan':
      return <CityScan />;
    case 'particle-dispatch':
      return <ParticleDispatch />;
    default:
      return null;
  }
}

export default function EraChannelPage({ params }: { params: EraChannelParams }) {
  const channel = getBornDigitalEraChannel(params.channel as BornDigitalEraChannelId);
  if (!channel) {
    return notFound();
  }
  const ladder = getEraMetricLadder(channel.id);
  const accent = eraAccentForChannel(channel.id);
  const roadmap = ROADMAP_PHASES[channel.id];
  const otherChannels = bornDigitalEraChannels.filter((c) => c.id !== channel.id);

  return (
    <>
      <PageHero
        eyebrow={`${bornDigitalEra.eyebrow} · ${channel.shortLabel}`}
        title={channel.title}
        description={channel.description}
        breadcrumbs={getCdcBreadcrumbs(`/era/${params.channel}`)}
      />

      <Section className="bg-[#fafafa] dark:bg-neutral-950">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_1fr] lg:items-stretch">
          <div className="min-h-[28rem]">
            <EraInflectionCard
              channel={channel}
              ladder={ladder}
              effect={effectFor(channel.cardEffect)}
              className="h-full"
            />
          </div>
          <div className="rounded-2xl border border-[var(--cdc-border)] bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
            <p
              className="cdc-font-mono-accent font-mono text-[11px] font-semibold uppercase tracking-[0.22em]"
              style={{ color: accent }}
            >
              Where it is now
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
              How you can see this growing
            </h2>
            {ladder ? (
              <div className="mt-6">
                <EraKpiLadder ladder={ladder} accentColor={accent} density="full" />
              </div>
            ) : (
              <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
                Numbers will land here once the first window is real.
              </p>
            )}
            <p className="mt-6 text-xs font-mono uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
              Updated as the work happens.
            </p>
          </div>
        </div>
      </Section>

      <Section className="bg-white dark:bg-neutral-900">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-start">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
              How this grows
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              Three phases tied to real public moments. We do not skip ahead — each one has to be
              true in the field before the next begins.
            </p>
            <ol className="mt-6 space-y-5">
              {roadmap.map((phase) => (
                <li
                  key={phase.title}
                  className="rounded-xl border border-[var(--cdc-border)] bg-[#fafafa] p-5 dark:border-neutral-800 dark:bg-neutral-950"
                >
                  <p
                    className="cdc-font-mono-accent font-mono text-[11px] font-semibold uppercase tracking-[0.2em]"
                    style={{ color: accent }}
                  >
                    {phase.title}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                    {phase.body}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          <aside>
            <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
              How it connects
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              {channel.converge}
            </p>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              All seven pathways feed the same field. Here is where this one touches the others:
            </p>
            <ul className="mt-4 space-y-2 font-mono text-[11px] uppercase tracking-[0.16em] text-neutral-600 dark:text-neutral-400">
              {otherChannels.map((other) => (
                <li key={other.id}>
                  ↳ {other.title} · <Link className="underline-offset-4 hover:underline" href={other.eraHref}>{other.shortLabel}</Link>
                </li>
              ))}
            </ul>

            {(() => {
              const joinHref = ladder?.joinAction.href ?? channel.siteHref;
              const isExternalJoin = /^https?:\/\//.test(joinHref);
              const isExternalSurface = /^https?:\/\//.test(channel.siteHref);
              return (
                <div
                  className="mt-8 rounded-2xl border p-5"
                  style={{ borderColor: `${accent}55`, backgroundColor: `${accent}0d` }}
                >
                  <p
                    className="cdc-font-mono-accent font-mono text-[11px] font-semibold uppercase tracking-[0.22em]"
                    style={{ color: accent }}
                  >
                    Take the next step
                  </p>
                  <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">
                    The fastest way to get involved.
                  </p>
                  <Link
                    href={joinHref}
                    {...(isExternalJoin
                      ? { target: '_blank', rel: 'noopener noreferrer' }
                      : {})}
                    className="mt-4 inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold text-neutral-50 transition-opacity hover:opacity-90 dark:text-neutral-900"
                    style={{ backgroundColor: accent }}
                  >
                    {ladder?.joinAction.label ?? `Open ${channel.shortLabel}`}
                    <span aria-hidden>→</span>
                  </Link>
                  <p className="mt-3">
                    <Link
                      href={channel.siteHref}
                      {...(isExternalSurface
                        ? { target: '_blank', rel: 'noopener noreferrer' }
                        : {})}
                      className="text-sm font-medium text-neutral-700 underline-offset-4 hover:underline dark:text-neutral-300"
                    >
                      Open {channel.title}
                      <span aria-hidden> →</span>
                    </Link>
                  </p>
                </div>
              );
            })()}
          </aside>
        </div>
      </Section>

      <Section className="bg-[#fafafa] pb-20 dark:bg-neutral-950">
        <p className="cdc-font-mono-accent font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--cdc-teal)]">
          {bornDigitalEra.eyebrow}
        </p>
        <div className="mt-3 flex flex-wrap items-baseline justify-between gap-4">
          <h2 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
            Other channels
          </h2>
          <Link href="/era" className="text-sm font-medium text-neutral-700 underline-offset-4 hover:underline dark:text-neutral-300">
            All seven →
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {otherChannels.map((other) => {
            const otherLadder = eraMetricLadders.find((l) => l.channel === other.id);
            return (
              <Link
                key={other.id}
                href={other.eraHref}
                className="group block rounded-xl border border-[var(--cdc-border)] bg-white p-4 transition-colors hover:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-600"
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
                  {other.shortLabel}
                </p>
                <p className="mt-1 text-base font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                  {other.title}
                </p>
                {otherLadder ? (
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
                    {otherLadder.metric} · {otherLadder.current}
                  </p>
                ) : null}
              </Link>
            );
          })}
        </div>
      </Section>
    </>
  );
}
