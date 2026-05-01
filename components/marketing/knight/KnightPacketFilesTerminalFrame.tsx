import type { ReactNode } from 'react';

type KnightPacketFilesTerminalFrameProps = {
  title: string;
  children: ReactNode;
  /** Optional intro under the title (links allowed). */
  description?: ReactNode;
};

const REVIEWER_TERMINAL_ASCII = `
 ╭──────────────────────────╮
 │ Knight · DCC pilot packet │
 │    ★ materials_index ★    │
 ╰──────────────────────────╯`.trimStart();

/**
 * CLI-style chrome around the packet file list — Knight reviewer framing,
 * theme-aware bezel + inset “screen”, optional ASCII flourish.
 */
export function KnightPacketFilesTerminalFrame({
  title,
  description,
  children,
}: KnightPacketFilesTerminalFrameProps) {
  return (
    <div className="knight-packet-files-terminal mx-auto w-full max-w-5xl overflow-hidden rounded-2xl border-2 shadow-lg">
      <header className="knight-packet-files-terminal__header border-b px-4 py-3.5 sm:px-6 sm:py-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
          <div className="min-w-0 flex-1 lg:pr-2">
            <p className="knight-packet-files-terminal__prompt font-[family-name:var(--font-dcc-mono)] text-[10px] font-medium uppercase tracking-[0.16em] sm:text-[11px]">
              Knight Foundation · DCC pilot · materials_index · read-only
            </p>
            <h2 className="knight-packet-files-terminal__title mt-2 text-base font-semibold tracking-tight sm:text-lg">
              {title}
            </h2>
            {description ? (
              <div className="knight-packet-files-terminal__sub mt-2 max-w-2xl text-sm leading-relaxed sm:mt-2.5">
                {description}
              </div>
            ) : null}
          </div>
          <pre
            className="knight-packet-files-terminal__ascii mx-auto w-fit max-w-full shrink-0 select-none font-[family-name:var(--font-dcc-mono)] text-[9px] leading-[1.35] sm:text-[10px] lg:mx-0"
            aria-hidden
          >
            {REVIEWER_TERMINAL_ASCII}
          </pre>
        </div>
      </header>
      <div className="knight-packet-files-terminal__body relative p-4 sm:p-6">
        <div className="knight-packet-files-terminal__scan pointer-events-none absolute inset-0" aria-hidden />
        <div className="relative z-[1]">{children}</div>
      </div>
    </div>
  );
}
