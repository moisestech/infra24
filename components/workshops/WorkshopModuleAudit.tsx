import Link from 'next/link'
import { ipAgeOfAiModuleAudit } from '@/data/ipAgeOfAiWorkshop'

const STATUS_LABEL: Record<string, string> = {
  done: 'Done',
  partial: 'In progress',
  pending: 'Next up',
}

export function WorkshopModuleAudit({ basePath }: { basePath: string }) {
  return (
    <section className="rounded-xl border border-border bg-card p-5 md:p-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Module build status</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Snapshot of scaffolding vs. content readiness. Update `ipAgeOfAiModuleAudit` in data as clips and
            transcripts land.
          </p>
        </div>
      </div>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
              <th className="py-2 pr-4 font-medium">Module</th>
              <th className="py-2 pr-4 font-medium">Build</th>
              <th className="py-2 pr-4 font-medium">Content</th>
              <th className="py-2 font-medium">Next step</th>
            </tr>
          </thead>
          <tbody>
            {ipAgeOfAiModuleAudit.map((row) => (
              <tr key={row.moduleId} className="border-b border-border/80 align-top">
                <td className="py-3 pr-4">
                  <Link href={`${basePath}/${row.moduleId}`} className="font-semibold text-primary-800 underline-offset-4 hover:underline">
                    {row.title}
                  </Link>
                  <div className="text-xs text-muted-foreground">{row.moduleId}</div>
                </td>
                <td className="py-3 pr-4">
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    {Object.entries(row.build).map(([key, status]) => (
                      <li key={key}>
                        <span className="font-medium text-foreground">{key}:</span> {STATUS_LABEL[status] ?? status}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="py-3 pr-4 text-xs font-semibold text-foreground">{STATUS_LABEL[row.content]}</td>
                <td className="py-3 text-xs text-muted-foreground">{row.nextStep}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
