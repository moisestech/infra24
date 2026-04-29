import type { FunderMaterialRow } from '@/lib/marketing/knight-packet';

type PacketDownloadListProps = {
  rows: FunderMaterialRow[];
  intro?: string;
  className?: string;
};

function statusLabel(status: FunderMaterialRow['status']) {
  return status === 'ready' ? 'Available' : 'In preparation';
}

export function PacketDownloadList({ rows, intro, className }: PacketDownloadListProps) {
  return (
    <div className={className}>
      {intro ? <p className="max-w-2xl text-sm text-neutral-600">{intro}</p> : null}
      <ul className={intro ? 'mt-8 space-y-3' : 'mt-0 space-y-3'}>
        {rows.map((row) => (
          <li
            key={row.id}
            className="flex flex-col gap-1 border-b border-neutral-200 pb-3 text-sm sm:flex-row sm:items-center sm:justify-between"
          >
            <span className="font-medium text-neutral-900">
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
            <span className="text-neutral-500">{statusLabel(row.status)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
