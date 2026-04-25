import { cn } from '@/lib/utils'

export default function GettingStartedLoading() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-4xl space-y-6 px-4 py-10 md:px-6 lg:max-w-5xl">
        <div className="h-4 w-32 animate-pulse rounded bg-muted" />
        <div className="h-10 w-2/3 max-w-md animate-pulse rounded bg-muted" />
        <div className="h-24 animate-pulse rounded-3xl bg-muted" />
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
        <div className={cn('h-48 animate-pulse rounded-3xl bg-muted')} />
      </div>
    </main>
  )
}
