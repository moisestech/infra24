type PracticalTakeawaysProps = {
  takeaways: string[]
}

export function PracticalTakeaways({ takeaways }: PracticalTakeawaysProps) {
  return (
    <section className="rounded-xl border border-border bg-card p-5 md:p-6">
      <h2 className="text-xl font-semibold tracking-tight text-foreground">Practical takeaways</h2>
      <ul className="mt-4 space-y-2 text-sm text-foreground">
        {takeaways.map((takeaway) => (
          <li
            key={takeaway}
            className="rounded-lg border border-primary/25 bg-primary/5 p-3 dark:border-primary/30 dark:bg-primary/10"
          >
            {takeaway}
          </li>
        ))}
      </ul>
    </section>
  )
}
