import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { atlasReadConfigured, readPublicAtlas } from '@/lib/dcc/community/airtable-atlas'
import { INTERESTS } from '@/lib/dcc/community/atlas'

export const dynamic = 'force-dynamic'
export const revalidate = 0

type Props = { params: { slug: string } }

/**
 * Only the reviewed, consented allowlist is eligible for a public permalink.
 * No direct queries to member drafts, People private fields or Clerk identities.
 */
async function publicProfile(slug: string) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 100) return null
  if (!atlasReadConfigured()) return null
  const profiles = await readPublicAtlas()
  return profiles.find(profile => profile.slug === slug) ?? null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // On outage, don't produce stale name-based HTML metadata.
  try {
    const profile = await publicProfile(params.slug)
    if (!profile) return {
      title: 'Profile not published — DCC Miami',
      description: 'Explore approved members of the DCC Miami Community Atlas.',
      robots: { index: false, follow: false },
    }
    return {
      title: `${profile.name} — DCC Community Atlas`,
      description: profile.summary,
      alternates: { canonical: `/network/community/${profile.slug}` },
      openGraph: {
        type: 'profile',
        title: `${profile.name} — DCC Community Atlas`,
        description: profile.summary,
        url: `/network/community/${profile.slug}`,
      },
    }
  } catch {
    return { title: 'Community Atlas — DCC Miami', robots: { index: false, follow: false } }
  }
}

export default async function PublicAtlasProfilePage({ params }: Props) {
  const profile = await publicProfile(params.slug)
  if (!profile) notFound()
  return <main className="dcc-network-theme min-h-screen bg-[var(--dn-bg)] px-4 py-10 text-[var(--dn-ink)] sm:px-6 sm:py-14">
    <article className="mx-auto max-w-3xl">
      <Link href="/network/community" className="inline-flex min-h-[44px] items-center text-sm font-medium text-[var(--dn-link)] underline underline-offset-4">← Explore Community Atlas</Link>
      <div className="mt-6 rounded-2xl border border-[var(--dn-line)] bg-[var(--dn-panel)] p-6 sm:p-10">
        <p className="font-mono text-xs uppercase tracking-[.15em] text-[var(--dn-subtle)]">DCC Miami / Approved public profile</p>
        <h1 className="mt-4 break-words text-4xl font-light tracking-[-.06em] sm:text-5xl">{profile.name}</h1>
        <p className="mt-5 max-w-2xl whitespace-pre-wrap break-words text-base leading-relaxed text-[var(--dn-muted)]">{profile.summary}</p>
        {profile.practice.length > 0 && <section className="mt-8">
          <h2 className="text-xs font-semibold uppercase tracking-[.13em] text-[var(--dn-subtle)]">Practices</h2>
          <div className="mt-3 flex flex-wrap gap-2">{profile.practice.map(item=><span key={item} className="rounded-full border border-[var(--dn-line)] px-3 py-2 text-sm">{item}</span>)}</div>
        </section>}
        {profile.interests.length > 0 && <section className="mt-8">
          <h2 className="text-xs font-semibold uppercase tracking-[.13em] text-[var(--dn-subtle)]">Explore through</h2>
          <div className="mt-3 flex flex-wrap gap-2">{profile.interests.map(id=>{
            const interest=INTERESTS.find(item=>item.id===id)
            return interest ? <Link key={id} href={'/network/community?practice='+encodeURIComponent(id)} className="inline-flex min-h-[44px] items-center rounded-full border border-[var(--dn-line)] px-4 text-sm hover:border-[var(--dn-line-strong)]">{interest.label}</Link> : null
          })}</div>
        </section>}
        {profile.links && profile.links.length > 0 && <section className="mt-8 border-t border-[var(--dn-line)] pt-6">
          <h2 className="text-xs font-semibold uppercase tracking-[.13em] text-[var(--dn-subtle)]">Public links</h2>
          <div className="mt-3 flex flex-wrap gap-3">{profile.links.map(link=><a key={link.url} href={link.url} rel="noopener noreferrer" target="_blank" className="inline-flex min-h-[44px] items-center rounded-full border border-[var(--dn-line)] px-4 text-sm font-medium text-[var(--dn-link)] underline underline-offset-4">{link.label} ↗</a>)}</div>
        </section>}
      </div>
      <p className="mt-6 max-w-2xl text-sm leading-relaxed text-[var(--dn-muted)]">
        Profiles are published only with explicit permission and DCC review. Member information not approved for publication stays private.
      </p>
      <div className="mt-6 flex flex-wrap gap-4">
        <Link href="/network/community" className="inline-flex min-h-[44px] items-center text-sm font-semibold text-[var(--dn-link)] underline underline-offset-4">Discover more people</Link>
        <Link href="/join" className="inline-flex min-h-[44px] items-center text-sm font-semibold text-[var(--dn-link)] underline underline-offset-4">Join DCC</Link>
      </div>
    </article>
  </main>
}
