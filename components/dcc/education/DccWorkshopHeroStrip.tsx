import Link from 'next/link'
import { listCurriculumHeroAssets } from '@/lib/dcc/education/3d-curriculum/assets'
import { THREE_D_SCHOOL_PATH } from '@/lib/dcc/education/3d-curriculum/types'

export function DccWorkshopHeroStrip() {
  const heroes = listCurriculumHeroAssets()
  if (heroes.length === 0) return null

  return (
    <section
      aria-label="3D School workshop stills"
      className="relative left-1/2 w-screen -translate-x-1/2 border-b border-[var(--cdc-border)] bg-neutral-950"
    >
      <div className="flex gap-px overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {heroes.map((asset) => {
          const href = asset.usedOn[0]?.split('#')[0] ?? THREE_D_SCHOOL_PATH
          return (
            <Link
              key={asset.id}
              href={href}
              className="group relative block min-w-[58vw] overflow-hidden sm:min-w-[38vw] md:min-w-0 md:flex-1"
            >
              <div className="aspect-[16/9] w-full bg-neutral-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={asset.src}
                  alt={asset.alt}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent px-3 py-3 text-[11px] font-medium uppercase tracking-[0.14em] text-white/90">
                {asset.title.replace(/ hero$/i, '')}
              </span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
