type PracticalTakeawaysProps = {
  takeaways: string[]
}

export function PracticalTakeaways({ takeaways }: PracticalTakeawaysProps) {
  return (
    <section className="rounded-xl border bg-card p-5">
      <h2 className="text-xl font-semibold text-slate-900">Practical takeaways</h2>
      <ul className="mt-4 space-y-2 text-sm text-slate-700">
        {takeaways.map((takeaway) => (
          <li key={takeaway} className="rounded-lg border border-cyan-100 bg-cyan-50 p-3">
            {takeaway}
          </li>
        ))}
      </ul>
    </section>
  )
}
