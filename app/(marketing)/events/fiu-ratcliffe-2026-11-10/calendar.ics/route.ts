import { fiuRatcliffeCalendar as dates, fiuRatcliffeEvent as event } from '@/lib/dcc/events/fiu-ratcliffe';

function escapeIcs(value: string) {
  return value.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
}

export async function GET() {
  const description = 'Bring a project, a question, or your curiosity. Arrival and parking instructions to be confirmed.';
  const ics = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//DCC Miami//Events//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
    'BEGIN:VEVENT', 'UID:' + event.id + '@dcc.miami', 'DTSTAMP:20261028T000000Z',
    'DTSTART:' + dates.startUtc, 'DTEND:' + dates.endUtc,
    'SUMMARY:' + escapeIcs(event.title), 'LOCATION:' + escapeIcs(event.venue),
    'DESCRIPTION:' + escapeIcs(description), 'URL:https://www.dcc.miami' + event.path,
    'END:VEVENT', 'END:VCALENDAR', '',
  ].join('\r\n');
  return new Response(ics, { headers: { 'Content-Type': 'text/calendar; charset=utf-8', 'Content-Disposition': 'attachment; filename="dcc-fiu-ratcliffe-2026-11-10.ics"', 'Cache-Control': 'public, max-age=3600' } });
}
