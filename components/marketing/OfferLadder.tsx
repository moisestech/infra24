import Link from 'next/link';

const steps = [
  {
    title: 'Communication Infrastructure Audit',
    description:
      'A focused assessment of signs, screens, maps, event information, update bottlenecks, and public-facing gaps—with pilot recommendations and a practical roadmap.',
    href: '/audit',
  },
  {
    title: 'Pilot deployment',
    description:
      'One contained system in the real world: smart sign, map, kiosk, event layer, portal, or QR-based navigation—scoped to prove value before a larger commitment.',
    href: '/pilots',
  },
  {
    title: 'Support + reporting',
    description:
      'Ongoing help so the system stays current, usable, and legible to staff, leadership, and funders—content rhythm, onboarding, usage snapshots, and optimization.',
    href: '/contact',
  },
];

export function OfferLadder() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {steps.map((step, i) => (
        <div
          key={step.title}
          className="flex flex-col rounded-lg border border-neutral-200 bg-white p-6"
        >
          <span className="text-xs font-medium uppercase tracking-wide text-neutral-500">
            Step {i + 1}
          </span>
          <h3 className="mt-2 text-lg font-semibold text-neutral-900">{step.title}</h3>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-600">
            {step.description}
          </p>
          <Link
            href={step.href}
            className="mt-4 text-sm font-medium text-neutral-900 underline-offset-4 hover:underline"
          >
            Learn more
          </Link>
        </div>
      ))}
    </div>
  );
}
