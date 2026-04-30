import { Button } from '@/components/ui/button'
import type { ToolkitAsset } from '@/data/ipAgeOfAiWorkshop'

type DownloadableToolkitPageProps = {
  assets: ToolkitAsset[]
  /** When embedded inside another page, use a subheading to avoid duplicate h1 landmarks. */
  variant?: 'page' | 'embedded'
}

export function DownloadableToolkitPage({ assets, variant = 'page' }: DownloadableToolkitPageProps) {
  const titleClass = 'text-3xl font-semibold tracking-tight text-foreground'
  const cardTitleClass = 'text-base font-semibold text-foreground'

  return (
    <section className="space-y-4">
      {variant === 'embedded' ? (
        <h3 className={titleClass}>Artist Rights Toolkit</h3>
      ) : (
        <h1 className={titleClass}>Artist Rights Toolkit</h1>
      )}
      <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
        Central workbook hub for practical worksheets, checklists, and preparation guides. Assets can be
        updated one-by-one as final downloads are published.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        {assets.map((asset) => (
          <article key={asset.title} className="rounded-xl border border-border bg-card p-5">
            {variant === 'embedded' ? (
              <h4 className={cardTitleClass}>{asset.title}</h4>
            ) : (
              <h2 className={cardTitleClass}>{asset.title}</h2>
            )}
            <p className="mt-2 text-sm text-muted-foreground">{asset.description}</p>
            <Button variant="outline" className="mt-4">
              {asset.status}
            </Button>
          </article>
        ))}
      </div>
    </section>
  )
}
