import { cn } from '@/lib/utils'

const ITEMS: { title: string; body: string }[] = [
  {
    title: 'What is GitHub?',
    body: 'A place to store project files online, track changes over time, and share or publish work. In this course we use it as a “studio folder with memory”—not something you must master in one sitting.',
  },
  {
    title: 'What is an IDE?',
    body: 'People say “IDE” loosely. Here it means your main coding workspace: files on the left, editor in the center, sometimes a terminal or AI panel. VS Code is a common example; Cursor adds AI-native help on top of a similar layout.',
  },
  {
    title: 'What if I get stuck?',
    body: 'Drop down a lane: use CodePen if installs are blocking you, or stay in chat/AI for language only. Tell your instructor which step failed (account, clone, first file, first commit). Small screenshots help.',
  },
  {
    title: 'VS Code vs Cursor?',
    body: 'VS Code is great for learning file trees and fundamentals. Cursor helps when you already have a folder open and want guided edits—still read every change before you keep it.',
  },
]

type OnboardingHelpDrawersProps = {
  className?: string
}

export function OnboardingHelpDrawers({ className }: OnboardingHelpDrawersProps) {
  return (
    <section className={cn('rounded-3xl border border-border bg-card/50 p-6 shadow-sm md:p-8', className)}>
      <h2 className="text-2xl font-semibold tracking-tight text-foreground">Quick help</h2>
      <p className="mt-2 text-sm text-muted-foreground">Expand a topic when a term still feels fuzzy.</p>
      <div className="mt-4 space-y-2">
        {ITEMS.map((item) => (
          <details
            key={item.title}
            className="group rounded-2xl border border-border bg-background/60 px-4 py-2 [&_summary::-webkit-details-marker]:hidden"
          >
            <summary className="cursor-pointer list-none py-2 text-sm font-medium text-foreground marker:content-none">
              <span className="mr-2 text-muted-foreground group-open:rotate-90">▸</span>
              {item.title}
            </summary>
            <p className="border-t border-border/80 pb-3 pt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
