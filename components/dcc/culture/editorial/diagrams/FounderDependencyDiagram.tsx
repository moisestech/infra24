const STAGES = [
  'Founder-centered',
  'Founder + steward',
  'Distributed operators + documentation',
  'Institutional knowledge with no single critical dependency',
]

export function FounderDependencyDiagram() {
  return (
    <ol className="founder-dep" aria-label="Founder dependency progression">
      {STAGES.map((stage, index) => (
        <li key={stage} className="founder-dep__stage">
          <span className="founder-dep__n">{String(index + 1).padStart(2, '0')}</span>
          <span className="founder-dep__label">{stage}</span>
        </li>
      ))}
    </ol>
  )
}
