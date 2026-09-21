const CAPITAL = [
  'Artist fee',
  'Fabrication',
  'Screen, projector, or LED',
  'Computer',
  'Enclosure',
  'Electrical',
  'Installation',
]

const OPERATING = [
  'Power',
  'Connectivity',
  'Cloud services',
  'Licenses',
  'Replacement hardware',
  'Technical support',
  'Cybersecurity updates',
  'Maintenance',
  'Software migration',
  'Archival work',
]

export function BudgetPhaseCompare() {
  return (
    <div className="budget-phases">
      <section className="budget-phases__col">
        <h4 className="budget-phases__title">Capital phase</h4>
        <p className="budget-phases__kicker">Often funded as a project</p>
        <ul>
          {CAPITAL.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
      <section className="budget-phases__col">
        <h4 className="budget-phases__title">Operating phase</h4>
        <p className="budget-phases__kicker">How the work actually survives</p>
        <ul>
          {OPERATING.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </div>
  )
}
