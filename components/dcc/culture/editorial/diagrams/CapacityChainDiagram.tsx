export function CapacityChainDiagram() {
  const steps = [
    'Technical literacy',
    'Institutional agency',
    'Operational capacity',
    'Human capacity',
    'Cultural impact',
  ]

  return (
    <ol className="capacity-chain" aria-label="Capacity chain">
      {steps.map((step, index) => (
        <li key={step} className="capacity-chain__step">
          <span className="capacity-chain__label">{step}</span>
          {index < steps.length - 1 ? (
            <span className="capacity-chain__arrow" aria-hidden>
              ↓
            </span>
          ) : null}
        </li>
      ))}
    </ol>
  )
}
