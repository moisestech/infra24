import { NextResponse } from 'next/server';
import { workshopSlugHasPublicMarkdownChapters } from '@/lib/workshops/public-chapter-slugs';
import { listPublicWorkshopChapters } from '@/lib/workshops/public-markdown-chapters';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  if (!workshopSlugHasPublicMarkdownChapters(slug)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  const chapters = await listPublicWorkshopChapters(slug);
  return NextResponse.json({ chapters });
}
