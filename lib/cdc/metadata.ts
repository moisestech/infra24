import type { Metadata } from 'next';
import { getCdcPageByPath } from './routes';

export function cdcPageMetadata(path: string): Metadata {
  const d = getCdcPageByPath(path);
  if (!d) {
    return { title: 'Not found' };
  }
  return {
    title: d.title,
    description: d.description,
    alternates: { canonical: path },
    openGraph: {
      title: d.title,
      description: d.description,
      url: path,
    },
    twitter: {
      title: d.title,
      description: d.description,
    },
  };
}
