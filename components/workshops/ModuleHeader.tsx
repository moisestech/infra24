type ModuleHeaderProps = {
  moduleNumber: number
  title: string
  subtitle: string
  thesis: string
  videoDuration: string
  currentModule: number
  totalModules: number
}

export function ModuleHeader({
  moduleNumber,
  title,
  subtitle,
  thesis,
  videoDuration,
  currentModule,
  totalModules,
}: ModuleHeaderProps) {
  return (
    <header className="rounded-2xl border border-primary-200 bg-primary-50/60 p-6 md:p-8">
      <p className="text-xs font-semibold uppercase tracking-wide text-primary-900">
        Module {moduleNumber} of {totalModules}
      </p>
      <h1 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-foreground">{title}</h1>
      <p className="mt-2 text-base text-muted-foreground">{subtitle}</p>
      <p className="mt-4 rounded-lg border border-border bg-background p-4 text-sm leading-relaxed text-muted-foreground">
        <strong className="text-foreground">Short thesis:</strong> {thesis}
      </p>
      <div className="mt-4 text-xs text-muted-foreground">
        <span>Estimated video duration: {videoDuration || 'TBD'}</span>
        <span className="mx-2">•</span>
        <span>
          Lesson progress: {currentModule}/{totalModules}
        </span>
      </div>
    </header>
  )
}
