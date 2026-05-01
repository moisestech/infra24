import Image from 'next/image';
import type { FunderMaterialGroup, FunderMaterialRow } from '@/lib/marketing/knight-packet';
import {
  FUNDER_MATERIAL_GROUP_LABEL,
  FUNDER_MATERIAL_GROUP_ORDER,
} from '@/lib/marketing/knight-packet';
import { KnightFileKindIcon } from '@/components/marketing/knight/KnightFileKindIcon';
import { FaArrowDownLong } from 'react-icons/fa6';
import { cn } from '@/lib/utils';

type PacketDownloadListProps = {
  rows: FunderMaterialRow[];
  intro?: string;
  className?: string;
  /** `list` — compact rows (e.g. /grants/materials). `cards` — grouped tiles for /knight. */
  layout?: 'list' | 'cards';
  /** CLI-style panel + card chrome (e.g. /knight packet files inside `KnightPacketFilesTerminalFrame`). */
  terminalChrome?: boolean;
};

function statusLabel(status: FunderMaterialRow['status']) {
  return status === 'ready' ? 'Available' : 'In preparation';
}

const GROUP_TOP: Record<FunderMaterialGroup, string> = {
  core: 'border-t-4 border-t-teal-500 dark:border-t-teal-400',
  people: 'border-t-4 border-t-orange-500 dark:border-t-orange-400',
  program: 'border-t-4 border-t-violet-600 dark:border-t-violet-400',
  brand: 'border-t-4 border-t-fuchsia-600 dark:border-t-fuchsia-400',
};

const GROUP_LEFT: Record<FunderMaterialGroup, string> = {
  core: 'border-l-[3px] border-l-teal-400',
  people: 'border-l-[3px] border-l-orange-400',
  program: 'border-l-[3px] border-l-violet-400',
  brand: 'border-l-[3px] border-l-fuchsia-400',
};

const GROUP_DOT: Record<FunderMaterialGroup, string> = {
  core: 'bg-teal-500 dark:bg-teal-400',
  people: 'bg-orange-500 dark:bg-orange-400',
  program: 'bg-violet-600 dark:bg-violet-400',
  brand: 'bg-fuchsia-600 dark:bg-fuchsia-400',
};

function previewScrimClass(terminalChrome: boolean | undefined) {
  if (terminalChrome) {
    return 'knight-packet-files-terminal__preview-scrim';
  }
  return 'bg-[linear-gradient(to_right,#ffffff_0%,#ffffff_22%,rgba(255,255,255,0.97)_38%,rgba(255,255,255,0.62)_58%,rgba(255,255,255,0.15)_82%,transparent_100%)] dark:bg-[linear-gradient(to_right,rgb(23_23_23)_0%,rgb(23_23_23)_22%,rgba(23,23,23,0.97)_38%,rgba(23,23,23,0.52)_58%,rgba(23,23,23,0.12)_82%,transparent_100%)]';
}

function FileCard({ row, terminalChrome }: { row: FunderMaterialRow; terminalChrome?: boolean }) {
  const ready = row.status === 'ready';
  const hasPreview = Boolean(row.previewSrc && row.previewAlt);

  const title = row.href ? (
    <a
      href={row.href}
      className={cn(
        'underline-offset-4 hover:underline',
        terminalChrome &&
          'text-neutral-900 hover:text-teal-800 dark:text-emerald-50/95 dark:hover:text-white'
      )}
      {...(row.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {row.label}
    </a>
  ) : (
    <span
      className={cn(
        terminalChrome && 'text-neutral-900 dark:text-emerald-50/95'
      )}
    >
      {row.label}
    </span>
  );

  return (
    <li
      className={cn(
        'relative isolate flex min-h-0 flex-col overflow-hidden rounded-xl border border-[var(--cdc-border)] bg-white shadow-sm ring-1 ring-black/[0.03] dark:bg-neutral-900/95 dark:ring-white/[0.06]',
        hasPreview && 'min-h-[240px] md:min-h-[260px]',
        terminalChrome &&
          'knight-packet-files-terminal__card border-teal-200/85 bg-white ring-1 ring-black/[0.05] dark:border-emerald-400/22 dark:bg-black/45 dark:ring-emerald-400/15',
        terminalChrome ? GROUP_LEFT[row.group] : GROUP_TOP[row.group]
      )}
    >
      {hasPreview ? (
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          {/*
            Image is 200% of card width, right-aligned; overflow clips the left side so only the
            right half of the photo is visible (tighter “slice” than full-bleed cover).
          */}
          <Image
            src={row.previewSrc!}
            alt={row.previewAlt!}
            fill
            className="!left-auto !right-0 !top-0 !h-full !w-[200%] !max-w-none object-cover object-right"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 480px"
          />
          <div className={cn('absolute inset-0', previewScrimClass(terminalChrome))} aria-hidden />
        </div>
      ) : null}

      <div
        className={cn(
          'relative z-10 flex h-full min-h-0 flex-1 flex-col justify-between p-4 md:p-5',
          hasPreview && 'max-w-full md:max-w-[58%] lg:max-w-[55%]'
        )}
      >
        <div className="flex flex-col">
          <KnightFileKindIcon
            kind={row.kind}
            boxed
            size="lg"
            variant={terminalChrome ? 'terminal' : 'default'}
          />
          <p
            className={cn(
              'mt-1.5 text-[13px] font-semibold uppercase tracking-wide text-neutral-600 dark:text-neutral-300 md:mt-2 md:text-sm md:leading-snug',
              terminalChrome && 'text-neutral-600 dark:text-emerald-200/75'
            )}
          >
            {row.fileHint}
          </p>
          <p
            className={cn(
              'mt-3 font-medium leading-snug text-neutral-900 dark:text-neutral-100 md:mt-4 md:text-[1.0625rem] md:leading-snug',
            )}
          >
            {title}
          </p>
        </div>
        <div
          className={cn(
            'mt-6 flex flex-wrap items-center justify-between gap-2 border-t pt-3 md:mt-8',
            terminalChrome
              ? hasPreview
                ? 'border-neutral-200/95 dark:border-emerald-500/35'
                : 'border-neutral-200 dark:border-emerald-500/25'
              : hasPreview
                ? 'border-neutral-200/80 dark:border-neutral-600/50'
                : 'border-[var(--cdc-border)]'
          )}
        >
          <span
            className={cn(
              'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
              ready
                ? cn(
                    'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/70 dark:text-emerald-200',
                    terminalChrome && 'dark:bg-emerald-500/20 dark:text-emerald-100'
                  )
                : cn(
                    'bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-200',
                    terminalChrome && 'dark:bg-amber-500/20 dark:text-amber-100'
                  ),
              hasPreview && 'shadow-sm ring-1 ring-black/[0.04] dark:ring-white/[0.06]'
            )}
          >
            {statusLabel(row.status)}
          </span>
          {ready && row.href ? (
            <a
              href={row.href}
              className={cn(
                'inline-flex items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline [color:var(--cdc-teal)] opacity-90 hover:opacity-100 dark:opacity-100 dark:hover:text-teal-100',
                terminalChrome && 'dark:text-teal-300 dark:hover:text-teal-200'
              )}
              {...(row.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              <FaArrowDownLong className="h-3.5 w-3.5" aria-hidden />
              Download
            </a>
          ) : (
            <span
              className={cn(
                'text-xs text-neutral-500 dark:text-neutral-400',
                terminalChrome && 'text-neutral-500 dark:text-emerald-200/55'
              )}
            >
              File linked when ready
            </span>
          )}
        </div>
      </div>
    </li>
  );
}

export function PacketDownloadList({
  rows,
  intro,
  className,
  layout = 'list',
  terminalChrome = false,
}: PacketDownloadListProps) {
  if (layout === 'cards') {
    return (
      <div className={className}>
        {intro ? (
          <p
            className={cn(
              'max-w-2xl text-sm text-neutral-600 dark:text-neutral-400',
              terminalChrome && 'text-neutral-600 dark:text-emerald-100/75'
            )}
          >
            {intro}
          </p>
        ) : null}
        <div className={intro ? 'mt-10 space-y-12' : 'mt-0 space-y-12'}>
          {FUNDER_MATERIAL_GROUP_ORDER.map((group) => {
            const groupRows = rows.filter((r) => r.group === group);
            if (groupRows.length === 0) return null;
            return (
              <div key={group}>
                <div className="flex items-center gap-2">
                  <span className={cn('h-2 w-2 rounded-full', GROUP_DOT[group])} aria-hidden />
                  <h3
                    className={cn(
                      terminalChrome
                        ? 'knight-packet-files-terminal__group-label font-mono text-[11px] font-semibold uppercase tracking-[0.14em]'
                        : 'text-sm font-semibold uppercase tracking-wide text-neutral-800 dark:text-neutral-200'
                    )}
                  >
                    {FUNDER_MATERIAL_GROUP_LABEL[group]}
                  </h3>
                </div>
                <ul className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:gap-6">
                  {groupRows.map((row) => (
                    <FileCard key={row.id} row={row} terminalChrome={terminalChrome} />
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {intro ? (
        <p className="max-w-2xl text-sm text-neutral-600 dark:text-neutral-400">{intro}</p>
      ) : null}
      <ul className={intro ? 'mt-8 space-y-2' : 'mt-0 space-y-2'}>
        {rows.map((row) => (
          <li
            key={row.id}
            className="flex flex-col gap-2 border-b border-[var(--cdc-border)] py-3 text-sm sm:flex-row sm:items-center sm:justify-between sm:gap-4"
          >
            <div className="flex min-w-0 flex-1 items-start gap-3 sm:items-center">
              <KnightFileKindIcon kind={row.kind} boxed />
              <div className="min-w-0">
                <span className="font-medium text-neutral-900 dark:text-neutral-100">
                  {row.href ? (
                    <a
                      href={row.href}
                      className="underline-offset-4 hover:underline"
                      {...(row.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    >
                      {row.label}
                    </a>
                  ) : (
                    row.label
                  )}
                </span>
                <span className="mt-0.5 block text-xs text-neutral-500 sm:mt-0 sm:ml-2 sm:inline dark:text-neutral-400">
                  {row.fileHint}
                </span>
              </div>
            </div>
            <span className="shrink-0 text-xs font-medium text-neutral-500 sm:text-sm dark:text-neutral-400">
              {statusLabel(row.status)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
