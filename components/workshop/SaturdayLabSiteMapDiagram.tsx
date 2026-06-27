/** Simple site map + same-artist-two-ways diagram for Saturday Lab demo. */
export function SaturdayLabSiteMapDiagram() {
  const pages = ['Home', 'Work', 'About', 'CV / Press', 'Contact']

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Site map (everyone)
        </h2>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {pages.map((page, i) => (
            <span key={page} className="flex items-center gap-2">
              <span className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-900">
                {page}
              </span>
              {i < pages.length - 1 ? (
                <span className="text-neutral-400" aria-hidden>
                  →
                </span>
              ) : null}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Same artist, two ways
        </h2>
        <p className="mt-1 text-sm text-neutral-600">
          Both groups answer the same questions — beginners through structure, vibe coders through
          prototype.
        </p>
        <div className="mt-3 overflow-x-auto rounded-lg border border-neutral-200 bg-white text-sm">
          <table className="w-full min-w-[320px]">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50 text-left">
                <th className="px-4 py-2 font-medium text-neutral-800">Beginner path</th>
                <th className="px-4 py-2 font-medium text-neutral-800">Vibe coding path</th>
              </tr>
            </thead>
            <tbody className="text-neutral-700">
              {[
                ['Sitemap', 'HTML sections'],
                ['Homepage intro', 'Hero section'],
                ['Project list', 'Project grid'],
                ['About / bio', 'About section'],
                ['Contact info', 'Contact link'],
                ['Platform choice', 'Publish path (CodePen → Replit → Pages)'],
              ].map(([beginner, vibe]) => (
                <tr key={beginner} className="border-b border-neutral-50 last:border-0">
                  <td className="px-4 py-2">{beginner}</td>
                  <td className="px-4 py-2">{vibe}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
