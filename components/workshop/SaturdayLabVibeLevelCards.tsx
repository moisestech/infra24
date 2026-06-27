import Image from 'next/image'
import Link from 'next/link'
import { SATURDAY_LAB_STARTER_ZIP } from '@/lib/workshops/saturday-lab-public-assets'
import { SATURDAY_LAB_VIBE_TOOLS } from '@/lib/workshops/saturday-lab-media'

export function SaturdayLabVibeLevelCards() {
  return (
    <section id="choose-your-vibe-coding-level" className="space-y-4">
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Choose your vibe coding level
        </h2>
        <p className="mt-1 text-sm text-neutral-600">
          You do not need to start with Cursor. ChatGPT & Claude help you think. CodePen helps you
          test. Replit helps you share. Cursor helps you edit files.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {SATURDAY_LAB_VIBE_TOOLS.map((item) => (
          <article
            key={item.key}
            className="flex flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white"
          >
            <div className="relative aspect-video bg-neutral-100">
              <Image
                src={item.screenshot}
                alt={item.screenshotAlt}
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <div className="flex flex-1 flex-col p-4">
              <div className="mb-2 flex items-center gap-2">
                <Image
                  src={item.logo}
                  alt=""
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-md object-contain"
                  aria-hidden
                />
                <div>
                  <p className="text-xs font-medium uppercase text-neutral-500">
                    Level {item.level}
                  </p>
                  <h3 className="font-semibold text-neutral-950">{item.title}</h3>
                </div>
              </div>
              <p className="text-sm font-medium text-neutral-700">{item.subtitle}</p>
              <Link
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block text-sm font-medium text-neutral-900 underline-offset-4 hover:underline"
              >
                Open {item.title} →
              </Link>
              {item.level === 3 ? (
                <a
                  href={SATURDAY_LAB_STARTER_ZIP}
                  download
                  className="mt-2 inline-block text-sm text-neutral-600 underline underline-offset-2"
                >
                  Download starter zip →
                </a>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
