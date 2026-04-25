import type { GlossaryPattern } from '@/lib/course/types'

type GlossaryPatternBackgroundProps = {
  pattern?: GlossaryPattern
}

export function GlossaryPatternBackground({ pattern = 'none' }: GlossaryPatternBackgroundProps) {
  const patternClass =
    pattern === 'grid'
      ? 'bg-[linear-gradient(to_right,rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:18px_18px] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)]'
      : pattern === 'dots'
        ? 'bg-[radial-gradient(rgba(0,0,0,0.07)_1px,transparent_1px)] bg-[size:16px_16px] dark:bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)]'
        : pattern === 'diagonal'
          ? 'bg-[repeating-linear-gradient(135deg,rgba(0,0,0,0.045),rgba(0,0,0,0.045)_2px,transparent_2px,transparent_10px)] dark:bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.05),rgba(255,255,255,0.05)_2px,transparent_2px,transparent_10px)]'
          : pattern === 'radial'
            ? 'bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.06),transparent_60%)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.07),transparent_60%)]'
            : pattern === 'scanlines'
              ? 'bg-[repeating-linear-gradient(to_bottom,rgba(0,0,0,0.05),rgba(0,0,0,0.05)_1px,transparent_1px,transparent_4px)] dark:bg-[repeating-linear-gradient(to_bottom,rgba(255,255,255,0.06),rgba(255,255,255,0.06)_1px,transparent_1px,transparent_4px)]'
              : ''

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 rounded-3xl opacity-60 ${patternClass}`}
    />
  )
}
