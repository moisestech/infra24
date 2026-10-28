import type { Metadata } from 'next';
import Link from 'next/link';
import { CalendarDays, Clock3, MapPin, Users } from 'lucide-react';
import { fiuRatcliffeEvent as event } from '@/lib/dcc/events/fiu-ratcliffe';

const canonical = 'https://www.dcc.miami' + event.path;

export const metadata: Metadata = {
  title: event.title,
  description: event.summary,
  alternates: { canonical },
  openGraph: {
    title: event.title,
    description: 'Tuesday, November 10 · 6:00–7:30 PM EST · FIU Biscayne Bay Campus. Bring a project, a question, or your curiosity.',
    type: 'website',
    url: canonical,
    siteName: 'DCC Miami',
  },
  twitter: { card: 'summary', title: event.title, description: event.summary },
};

export default function FiuRatcliffeEventPage() {
  const mapsUrl = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(event.locationQuery);
  return (
    <article className="mx-auto max-w-5xl px-4 pb-20 pt-12 sm:px-6 sm:pt-20">
      <Link href="/events" className="text-sm font-medium text-teal-700 underline-offset-4 hover:underline dark:text-teal-300">← All events</Link>
      <div className="mt-8 grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:items-start">
        <div>
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-teal-700 dark:text-teal-300">DCC Miami × FIU Ratcliffe · Community gathering</p>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-neutral-950 dark:text-neutral-50 sm:text-6xl">{event.title}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-neutral-700 dark:text-neutral-300">{event.summary}</p>
          <div className="mt-9 rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
            <h2 className="text-xl font-semibold">What to expect</h2>
            <p className="mt-3 leading-relaxed text-neutral-700 dark:text-neutral-300">
              A relaxed working session to meet other creatives, share a project or problem, and explore possible collaborations. This gathering is a conversation around the Artist Infrastructure Lab idea — not an established course or a formal class.
            </p>
            <h2 className="mt-7 text-xl font-semibold">What to bring</h2>
            <p className="mt-3 leading-relaxed text-neutral-700 dark:text-neutral-300">
              Bring a project, a question, something you are experimenting with, or simply your curiosity. You do not need to prepare a presentation.
            </p>
          </div>
          <p className="mt-7 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            Photos may be taken at the session. You can ask the organizers not to photograph you. Attending does not mean you have agreed to publish your profile or work.
          </p>
        </div>
        <aside className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-800 dark:bg-neutral-900 sm:p-7">
          <h2 className="text-lg font-semibold">Event details</h2>
          <dl className="mt-6 space-y-5">
            <div className="flex gap-3"><CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-teal-700 dark:text-teal-300" aria-hidden /><div><dt className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Date</dt><dd className="mt-1 font-medium">Tuesday, November 10, 2026</dd></div></div>
            <div className="flex gap-3"><Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-teal-700 dark:text-teal-300" aria-hidden /><div><dt className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Time</dt><dd className="mt-1 font-medium">6:00–7:30 PM EST (Miami)</dd></div></div>
            <div className="flex gap-3"><MapPin className="mt-0.5 h-5 w-5 shrink-0 text-teal-700 dark:text-teal-300" aria-hidden /><div><dt className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Location</dt><dd className="mt-1 font-medium">{event.venue}</dd><dd className="mt-2"><a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-teal-700 underline underline-offset-4 dark:text-teal-300">Find FIU Biscayne Bay Campus on maps</a></dd></div></div>
            <div className="flex gap-3"><Users className="mt-0.5 h-5 w-5 shrink-0 text-teal-700 dark:text-teal-300" aria-hidden /><div><dt className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Who it's for</dt><dd className="mt-1">Artists, makers, engineers, designers, architects, and curious collaborators.</dd></div></div>
          </dl>
          <a href={event.path + '/calendar.ics'} className="mt-7 flex min-h-11 items-center justify-center rounded-full border border-neutral-300 px-5 py-3 text-center text-sm font-semibold hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800">
            Add to calendar (.ics)
          </a>
          <div className="mt-5 border-t border-neutral-200 pt-5 dark:border-neutral-700" aria-live="polite">
            <p className="font-semibold">RSVP opening soon</p>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              Registration is not yet open on this page. Please check back for the RSVP form. Arrival and parking instructions are being finalized with the host.
            </p>
          </div>
        </aside>
      </div>
    </article>
  );
}
