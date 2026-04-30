import Link from 'next/link';

export function BudgetTransparencyCTA() {
  return (
    <aside className="rounded-2xl border border-neutral-200/90 bg-white p-8 dark:border-neutral-700 dark:bg-neutral-900/70">
      <p className="max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
        DCC will use the budget page, artist CRM, funder portal, and public reporting tools to track how funding becomes
        programming, participation, and network growth over time.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/knight"
          className="inline-flex items-center justify-center rounded-full border border-neutral-900 bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-800 dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white"
        >
          Knight pilot packet
        </Link>
        <Link
          href="/grants/materials"
          className="inline-flex items-center justify-center rounded-full border border-neutral-300 bg-white px-5 py-2.5 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-50 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
        >
          Grant materials
        </Link>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full border border-neutral-300 bg-white px-5 py-2.5 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-50 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
        >
          DCC home
        </Link>
        <a
          href="mailto:hello@dcc.miami"
          className="inline-flex items-center justify-center rounded-full border border-neutral-300 bg-transparent px-5 py-2.5 text-sm font-medium text-neutral-900 underline-offset-4 hover:underline dark:border-neutral-600 dark:text-neutral-100"
        >
          Contact the team
        </a>
      </div>
    </aside>
  );
}
