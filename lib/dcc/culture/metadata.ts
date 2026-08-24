import type { Metadata } from 'next'

type CultureMetaInput = {
  title: string
  description: string
  path: string
  image?: string
}

export function culturePageMetadata({
  title,
  description,
  path,
  image,
}: CultureMetaInput): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: {
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  }
}
