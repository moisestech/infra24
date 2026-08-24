import type { Metadata } from 'next';
import { PageHero, Section } from '@/components/marketing/cdc';
import { CultureRecordCard } from '@/components/dcc/culture/CultureRecordCard';
import { getCdcBreadcrumbs } from '@/lib/cdc/routes';
import { cdcPageMetadata } from '@/lib/cdc/metadata';
import {
  ARTISTS_EMPTY,
  ARTISTS_INDEX_INTRO,
  artistHref,
  getProgramPublicPath,
  getProgramsForArtist,
  listArtists,
  listFeaturedArtists,
} from '@/lib/dcc/culture';

const path = '/artists';

export const metadata: Metadata = cdcPageMetadata(path);

export default function ArtistsIndexPage() {
  const featured = listFeaturedArtists();
  const artists = listArtists();

  return (
    <>
      <PageHero
        eyebrow="Artists"
        title="Artists"
        description={ARTISTS_INDEX_INTRO}
        breadcrumbs={getCdcBreadcrumbs(path)}
      />
      <Section className="bg-[#fafafa] pb-16">
        {artists.length === 0 ? (
          <p className="max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            {ARTISTS_EMPTY}
          </p>
        ) : (
          <>
            {featured.length > 0 ? (
              <div className="mb-14">
                <h2 className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500">
                  Featured
                </h2>
                <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {featured.map((artist) => {
                    const program = getProgramsForArtist(artist)[0];
                    return (
                      <CultureRecordCard
                        key={artist.id}
                        href={artistHref(artist.slug)}
                        title={artist.name}
                        meta={[artist.location, program?.title].filter(Boolean).join(' · ')}
                        description={artist.practiceTags?.join(' · ')}
                        image={artist.portrait ?? artist.heroImage}
                        imageAlt={artist.portraitAlt ?? artist.name}
                        fallbackLabel="Portrait forthcoming"
                      />
                    );
                  })}
                </ul>
              </div>
            ) : null}
            <h2 className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500">
              All artists
            </h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {artists.map((artist) => {
                const program = getProgramsForArtist(artist)[0];
                return (
                  <CultureRecordCard
                    key={artist.id}
                    href={artistHref(artist.slug)}
                    title={artist.name}
                    meta={[artist.location, program?.title].filter(Boolean).join(' · ')}
                    description={artist.practiceTags?.join(' · ')}
                    image={artist.portrait ?? artist.heroImage}
                    imageAlt={artist.portraitAlt ?? artist.name}
                    fallbackLabel="Portrait forthcoming"
                  />
                );
              })}
            </ul>
          </>
        )}
      </Section>
    </>
  );
}
