import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArtistDirectoryProfileClient } from '@/components/artists/ArtistDirectoryProfileClient';
import { ArtistDetail } from '@/components/dcc/culture/ArtistDetail';
import {
  culturePageMetadata,
  getPublishedArtistBySlug,
  listArtists,
  looksLikeUuid,
} from '@/lib/dcc/culture';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return listArtists().map((artist) => ({ slug: artist.slug }));
}

export async function generateMetadata({ params: pendingParams }: Props): Promise<Metadata> {
  const params = await pendingParams
  const artist = getPublishedArtistBySlug(params.slug);
  if (!artist) {
    return { title: looksLikeUuid(params.slug) ? 'Artist profile' : 'Artist' };
  }
  return culturePageMetadata({
    title: artist.seoTitle ?? artist.name,
    description: artist.seoDescription ?? artist.shortBio ?? artist.bio ?? artist.name,
    path: `/artists/${artist.slug}`,
    image: artist.heroImage ?? artist.portrait,
  });
}

export default async function ArtistSlugPage({ params: pendingParams }: Props) {
  const params = await pendingParams
  const artist = getPublishedArtistBySlug(params.slug);
  if (artist) {
    return <ArtistDetail artist={artist} />;
  }
  if (looksLikeUuid(params.slug)) {
    return <ArtistDirectoryProfileClient artistId={params.slug} />;
  }
  notFound();
}
