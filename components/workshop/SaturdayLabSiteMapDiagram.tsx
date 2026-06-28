import { SaturdayLabIcon } from '@/components/workshop/SaturdayLabIcon'
import type { SaturdayLabIconKey } from '@/lib/workshops/saturday-lab-media'

const SITE_PAGES: { label: string; icon: SaturdayLabIconKey }[] = [
  { label: 'Home', icon: 'homepage' },
  { label: 'Work', icon: 'projects' },
  { label: 'About', icon: 'about' },
  { label: 'CV / Press', icon: 'cv' },
  { label: 'Contact', icon: 'contact' },
]

/** Simple site map + same-artist-two-ways diagram for Saturday Lab demo. */
export function SaturdayLabSiteMapDiagram() {
  return (
    <section className="space-y-6 2xl:space-y-10">
      <div>
        <h2 className="sl-section-title text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Site map (everyone)
        </h2>
        <div className="mt-3 flex flex-wrap items-center gap-2 2xl:mt-5 2xl:gap-4">
          {SITE_PAGES.map((page, i) => (
            <span key={page.label} className="flex items-center gap-2 2xl:gap-4">
              <span className="flex items-center gap-2 rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-900 2xl:gap-4 2xl:px-5 2xl:py-4 2xl:text-xl 2xl:font-bold">
                <SaturdayLabIcon icon={page.icon} label={page.label} size={18} tripleOnWide />
                {page.label}
              </span>
              {i < SITE_PAGES.length - 1 ? (
                <span className="text-neutral-400 2xl:text-2xl" aria-hidden>
                  →
                </span>
              ) : null}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h2 className="sl-section-title text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Same artist, two ways
        </h2>
        <p className="mt-1 text-sm text-neutral-600 2xl:text-lg">
          Both groups answer the same questions — beginners through structure, vibe coders through
          prototype.
        </p>
        <div className="mt-3 overflow-x-auto rounded-lg border border-neutral-200 bg-white text-sm 2xl:mt-5 2xl:text-lg">
          <table className="w-full min-w-[320px]">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50 text-left">
                <th className="px-4 py-2 font-medium text-neutral-800 2xl:px-6 2xl:py-4 2xl:text-xl 2xl:font-bold">
                  Beginner path
                </th>
                <th className="px-4 py-2 font-medium text-neutral-800 2xl:px-6 2xl:py-4 2xl:text-xl 2xl:font-bold">
                  Vibe coding path
                </th>
              </tr>
            </thead>
            <tbody className="text-neutral-700">
              {[
                ['Sitemap', 'sitemap', 'HTML sections', 'code'],
                ['Homepage intro', 'homepage', 'Hero section', 'homepage'],
                ['Project list', 'projects', 'Project grid', 'projects'],
                ['About / bio', 'about', 'About section', 'about'],
                ['Contact info', 'contact', 'Contact link', 'contact'],
                ['Platform choice', 'path', 'Publish path (CodePen → Replit → Pages)', 'publish'],
              ].map(([beginner, beginnerIcon, vibe, vibeIcon]) => (
                <tr key={beginner} className="border-b border-neutral-50 last:border-0">
                  <td className="px-4 py-2 2xl:px-6 2xl:py-4">
                    <span className="inline-flex items-center gap-2 2xl:gap-4">
                      <SaturdayLabIcon
                        icon={beginnerIcon as SaturdayLabIconKey}
                        label={beginner}
                        size={16}
                        tripleOnWide
                      />
                      {beginner}
                    </span>
                  </td>
                  <td className="px-4 py-2 2xl:px-6 2xl:py-4">
                    <span className="inline-flex items-center gap-2 2xl:gap-4">
                      <SaturdayLabIcon
                        icon={vibeIcon as SaturdayLabIconKey}
                        label={vibe}
                        size={16}
                        tripleOnWide
                      />
                      {vibe}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
