import type { Metadata } from 'next';
import { getCdcPageByPath } from './routes';

type CdcPageMetadataOptions = {
  /** Bypass the layout `%s | Digital Culture Center Miami` template. */
  absoluteTitle?: string;
};

export function cdcPageMetadata(path: string, options?: CdcPageMetadataOptions): Metadata {
  const d = getCdcPageByPath(path);
  if (!d) {
    return { title: 'Not found' };
  }
  const title = options?.absoluteTitle
    ? { absolute: options.absoluteTitle }
    : d.title;
  const ogTitle = options?.absoluteTitle ?? d.title;
  return {
    title,
    description: d.description,
    alternates: { canonical: path },
    openGraph: {
      title: ogTitle,
      description: d.description,
      url: path,
    },
    twitter: {
      title: ogTitle,
      description: d.description,
    },
  };
}
