import { cn } from '@/lib/utils'

export function OnboardingWeakStrong({ className }: { className?: string }) {
  return (
    <div className={cn('grid gap-4 md:grid-cols-2', className)}>
      <div className="rounded-2xl border border-border bg-background/60 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Weak</p>
        <pre className="mt-2 font-mono text-sm text-muted-foreground">make it better</pre>
      </div>
      <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Better</p>
        <pre className="mt-2 whitespace-pre-wrap font-mono text-sm leading-relaxed text-foreground">
          Turn this into a poetic net art homepage with large serif text, a black background, slow fade-in animation,
          and one floating image. Keep it simple and explain every change.
        </pre>
      </div>
    </div>
  )
}
