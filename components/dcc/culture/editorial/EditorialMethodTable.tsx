type EditorialMethodRow = {
  name: string
  definition: string
  why: string
  status: string
}

type EditorialMethodTableProps = {
  caption?: string
  rows: EditorialMethodRow[]
}

export function EditorialMethodTable({ caption, rows }: EditorialMethodTableProps) {
  return (
    <div data-editorial-method-table="" className="editorial-method">
      {caption ? <p className="editorial-method__lede">{caption}</p> : null}
      <div className="editorial-method__scroll">
        <table className="editorial-method__table">
          <caption className="editorial-method__caption-hidden">{caption ?? 'Methodology table'}</caption>
          <thead>
            <tr>
              <th scope="col">Measure</th>
              <th scope="col">Definition</th>
              <th scope="col">Why it matters</th>
              <th scope="col">Data status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.name}>
                <th scope="row">{row.name}</th>
                <td data-label="Definition">{row.definition}</td>
                <td data-label="Why it matters">{row.why}</td>
                <td data-label="Data status">{row.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
