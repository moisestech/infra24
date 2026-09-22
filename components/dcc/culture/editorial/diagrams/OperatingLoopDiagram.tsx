const STEPS: { label: string; lane: 'coordination' | 'judgment' }[] = [
  { label: 'Inquiry', lane: 'coordination' },
  { label: 'Scope', lane: 'judgment' },
  { label: 'Quote', lane: 'judgment' },
  { label: 'Payment', lane: 'coordination' },
  { label: 'Production', lane: 'judgment' },
  { label: 'Review', lane: 'judgment' },
  { label: 'Delivery', lane: 'judgment' },
  { label: 'Documentation', lane: 'coordination' },
  { label: 'Archive', lane: 'coordination' },
]

export function OperatingLoopDiagram() {
  return (
    <div className="operating-loop">
      <ol className="operating-loop__steps" aria-label="DCC operating loop">
        {STEPS.map((step, index) => (
          <li
            key={step.label}
            className="operating-loop__step"
            data-lane={step.lane}
          >
            <span className="operating-loop__n">{String(index + 1).padStart(2, '0')}</span>
            <span className="operating-loop__label">{step.label}</span>
            <span className="operating-loop__lane">
              {step.lane === 'coordination' ? 'Coordination' : 'Judgment'}
            </span>
          </li>
        ))}
      </ol>
    </div>
  )
}
