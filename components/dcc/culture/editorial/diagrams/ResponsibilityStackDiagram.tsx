const LAYERS = [
  { layer: 'Artwork', actors: 'Artist' },
  { layer: 'Hardware', actors: 'Facilities · vendor / fabricator' },
  { layer: 'Software', actors: 'Artist · vendor' },
  { layer: 'Network / data', actors: 'IT / security' },
  { layer: 'Operations', actors: 'Facilities · Public Art / Cultural Affairs' },
  { layer: 'Maintenance', actors: 'Facilities · conservator · vendor' },
  { layer: 'Conservation / migration', actors: 'Conservator · Public Art · artist' },
]

export function ResponsibilityStackDiagram() {
  return (
    <ol className="resp-stack" aria-label="Public digital art responsibility stack">
      {LAYERS.map((row, index) => (
        <li key={row.layer} className="resp-stack__row">
          <div className="resp-stack__layer">
            <span className="resp-stack__label">{row.layer}</span>
            {index < LAYERS.length - 1 ? (
              <span className="resp-stack__arrow" aria-hidden>
                ↓
              </span>
            ) : null}
          </div>
          <p className="resp-stack__actors">{row.actors}</p>
        </li>
      ))}
    </ol>
  )
}
