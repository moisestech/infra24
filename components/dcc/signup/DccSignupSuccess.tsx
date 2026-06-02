import Link from 'next/link'

type Props = {
  message: string
  onSubmitAnother?: () => void
}

export function DccSignupSuccess({ message, onSubmitAnother }: Props) {
  return (
    <div className="rounded-xl border border-teal-200 bg-teal-50 p-6 text-sm leading-relaxed text-teal-950 dark:border-teal-800 dark:bg-teal-950/40 dark:text-teal-100">
      <p className="text-base font-semibold">You&apos;re in.</p>
      <p className="mt-2 whitespace-pre-line">{message}</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/network"
          className="inline-flex rounded-full bg-[var(--cdc-teal)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
        >
          Explore network
        </Link>
        <Link
          href="/programs"
          className="inline-flex rounded-full border border-teal-700/30 px-4 py-2 text-sm font-semibold text-teal-900 hover:border-[var(--cdc-teal)] dark:text-teal-100"
        >
          View programs
        </Link>
        <Link
          href="/workshops"
          className="inline-flex rounded-full border border-teal-700/30 px-4 py-2 text-sm font-semibold text-teal-900 hover:border-[var(--cdc-teal)] dark:text-teal-100"
        >
          Workshops
        </Link>
      </div>
      {onSubmitAnother ? (
        <button
          type="button"
          className="mt-4 text-sm font-medium text-teal-800 underline-offset-4 hover:underline dark:text-teal-200"
          onClick={onSubmitAnother}
        >
          Submit another response
        </button>
      ) : null}
    </div>
  )
}
