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

const GROUP_DOT: Record<FunderMaterialGroup, string> = {
  core: 'bg-teal-500 dark:bg-teal-400',
  people: 'bg-orange-500 dark:bg-orange-400',
  program: 'bg-violet-600 dark:bg-violet-400',
  brand: 'bg-fuchsia-600 dark:bg-fuchsia-400',
};

function FileCard({ row }: { row: FunderMaterialRow }) {
  const ready = row.status === 'ready';
  return (
    <li
      className={cn(
        'flex h-full flex-col rounded-xl border border-neutral-200/90 bg-white p-4 shadow-sm ring-1 ring-black/[0.03] dark:border-neutral-700 dark:bg-neutral-900/90 dark:ring-white/[0.05]',
        GROUP_TOP[row.group]
      )}
    >
      <div className="flex items-start gap-3">
        <KnightFileKindIcon kind={row.kind} boxed />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
            {row.fileHint}
          </p>
          <p className="mt-1 font-medium leading-snug text-neutral-900 dark:text-neutral-100">
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
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-neutral-100 pt-3 dark:border-neutral-700/80">
        <span
          className={cn(
            'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
            ready
              ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/70 dark:text-emerald-200'
              : 'bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-200'
          )}
        >
          {statusLabel(row.status)}
        </span>
        {ready && row.href ? (
          <a
            href={row.href}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-teal-800 underline-offset-4 hover:underline dark:text-teal-300"
            {...(row.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            <FaArrowDownLong className="h-3.5 w-3.5" aria-hidden />
            Download
          </a>
        ) : (
          <span className="text-xs text-neutral-500 dark:text-neutral-400">File linked when ready</span>
        )}
      </div>
    </li>
  );
}

export function PacketDownloadList({ rows, intro, className, layout = 'list' }: PacketDownloadListProps) {
  if (layout === 'cards') {
    return (
      <div className={className}>
        {intro ? (
          <p className="max-w-2xl text-sm text-neutral-600 dark:text-neutral-400">{intro}</p>
        ) : null}
        <div className={intro ? 'mt-10 space-y-12' : 'mt-0 space-y-12'}>
          {FUNDER_MATERIAL_GROUP_ORDER.map((group) => {
            const groupRows = rows.filter((r) => r.group === group);
            if (groupRows.length === 0) return null;
            return (
              <div key={group}>
                <div className="flex items-center gap-2">
                  <span className={cn('h-2 w-2 rounded-full', GROUP_DOT[group])} aria-hidden />
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-800 dark:text-neutral-200">
                    {FUNDER_MATERIAL_GROUP_LABEL[group]}
                  </h3>
                </div>
                <ul className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {groupRows.map((row) => (
                    <FileCard key={row.id} row={row} />
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
            className="flex flex-col gap-2 border-b border-neutral-200 py-3 text-sm sm:flex-row sm:items-center sm:justify-between sm:gap-4 dark:border-neutral-700"
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
