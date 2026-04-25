import { cn } from '@/lib/utils'

type OnboardingIntroCalloutProps = {
  className?: string
}

export function OnboardingIntroCallout({ className }: OnboardingIntroCalloutProps) {
  return (
    <div className={cn('space-y-6 rounded-3xl border border-dashed border-border bg-muted/20 p-6 md:p-8', className)}>
      <p className="text-base leading-relaxed text-foreground/90">
        Vibecoding is a way of building creative digital work by combining <strong>prompts</strong>,{' '}
        <strong>visual intuition</strong>, <strong>code</strong>, and <strong>iterative editing</strong>. In this course,
        you do <strong>not</strong> need to learn every tool at once. You only need to understand the landscape, choose a
        starting lane, and make your first small project.
      </p>
      <blockquote className="border-l-4 border-primary pl-4 text-muted-foreground">
        <p className="text-sm font-medium leading-relaxed text-foreground">
          This chapter is about getting situated, not getting perfect.
        </p>
      </blockquote>
      <div className="flex flex-wrap gap-2">
        <span className="rounded-full border border-border bg-background/80 px-3 py-1 text-xs text-muted-foreground">
          I want the fastest route
        </span>
        <span className="rounded-full border border-border bg-background/80 px-3 py-1 text-xs text-muted-foreground">
          I want a normal file-based route
        </span>
        <span className="rounded-full border border-border bg-background/80 px-3 py-1 text-xs text-muted-foreground">
          I want AI inside the editor
        </span>
      </div>
    </div>
  )
}
