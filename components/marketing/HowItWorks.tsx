const steps = [
  {
    title: 'Conversation',
    description: 'We align on what “public-facing” means for your organization and where pain shows up.',
  },
  {
    title: 'Audit (when it fits)',
    description:
      'Optional structured review of systems, surfaces, and handoffs—documented so leadership can agree on facts.',
  },
  {
    title: 'Pilot scope',
    description: 'We define a bounded experiment: audience, success signals, and what “done” looks like.',
  },
  {
    title: 'Implementation',
    description: 'Build, train, and hand off workflows so updates stay manageable after we leave.',
  },
];

export function HowItWorks() {
  return (
    <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {steps.map((step, i) => (
        <li key={step.title} className="relative flex flex-col">
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-300 text-sm font-semibold text-neutral-800">
            {i + 1}
          </span>
          <h3 className="mt-4 text-sm font-semibold text-neutral-900">{step.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-neutral-600">{step.description}</p>
        </li>
      ))}
    </ol>
  );
}
