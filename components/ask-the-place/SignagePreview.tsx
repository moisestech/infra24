import type { OutputBundle } from '@/lib/ask-the-place/types'

type SignagePreviewProps = {
  bundle: OutputBundle | null
}

export function SignagePreview({ bundle }: SignagePreviewProps) {
  const s = bundle?.signage
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#111827] to-[#05070A] shadow-2xl">
      <div className="border-b border-white/10 px-4 py-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Signage preview</p>
      </div>
      <div className="aspect-video p-6 md:p-8">
        {s ? (
          <div className="flex h-full flex-col justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-amber-200/80">{s.screenTitle}</p>
              <h3 className="mt-3 text-2xl font-medium tracking-tight text-white md:text-3xl">{s.headline}</h3>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-zinc-400">{s.body}</p>
            </div>
            <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
              <p className="text-sm font-medium text-teal-200/90">{s.cta}</p>
              <div className="flex h-20 w-20 items-center justify-center rounded-lg border border-dashed border-white/20 bg-white/[0.03] text-[10px] text-zinc-500">
                QR
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-zinc-600">
            Select a scenario to preview lobby or district screen content.
          </div>
        )}
      </div>
    </div>
  )
}
