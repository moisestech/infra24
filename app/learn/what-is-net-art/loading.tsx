import { cn } from '@/lib/utils'

export default function WhatIsNetArtLoading() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-4xl space-y-6 px-4 py-10 md:px-6 lg:max-w-5xl">
        <div className="h-4 w-40 animate-pulse rounded bg-muted" />
        <div className="h-10 w-3/4 max-w-lg animate-pulse rounded bg-muted" />
        <div className="h-28 animate-pulse rounded-3xl bg-muted" />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="h-56 animate-pulse rounded-3xl bg-muted" />
          <div className="h-56 animate-pulse rounded-3xl bg-muted" />
        </div>
        <div className={cn('h-40 animate-pulse rounded-3xl bg-muted')} />
      </div>
    </main>
  )
}
