import { useEffect, useState } from 'react';
// useParams not available - using Next.js router instead
import { useParams } from 'next/navigation';
import { ChapterReader } from '../components/ChapterReader';
import { useEnrollment } from '../hooks/useEnrollment';
import { workshopClientService } from '../services/workshop.client.service';
import { serialize } from 'next-mdx-remote-client/serialize';
import { findChapterContext } from '../utils/curriculumTree';
import { aiFilmmakingCurriculum } from '../curriculum/ai-filmmaking';
import { aiLiteracyCurriculum } from '../curriculum/ai-literacy-digital-citizenship';
import { aiArtFundamentalsCurriculum } from '../curriculum/ai-art-fundamentals';
import { vibecodingCurriculum } from '../curriculum/vibecoding';
import { aiVideoProductionCurriculum } from '../curriculum/ai-video-production';
// LiquidLoader not available

const curriculumMap: Record<string, any> = {
  'ai-filmmaking': aiFilmmakingCurriculum,
  'ai-literacy-digital-citizenship': aiLiteracyCurriculum,
  'ai-art-fundamentals': aiArtFundamentalsCurriculum,
  'vibecoding': vibecodingCurriculum,
  'ai-video-production': aiVideoProductionCurriculum,
};

export default function ChapterPage() {
  const { workshopSlug, chapterSlug } = useParams();
  const [chapter, setChapter] = useState<any>(null);
  const [mdxSource, setMdxSource] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { canAccessChapter } = useEnrollment();

  useEffect(() => {
    async function fetchData() {
      if (!workshopSlug || !chapterSlug) {
        setError('Missing workshop or chapter slug');
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const data = await workshopClientService.getChapter(String(workshopSlug), String(chapterSlug));
        if (data) {
          setChapter(data);
          const mdx = await serialize({
            source: data.content_markdown || '',
            options: {
              mdxOptions: {
                remarkPlugins: [],
                rehypePlugins: [],
                format: 'mdx',
              },
            },
          });
          setMdxSource(mdx);
        } else {
          setError('Chapter not found');
        }
      } catch (err) {
        setError('Failed to load chapter');
      }
      setLoading(false);
    }
    fetchData();
  }, [workshopSlug, chapterSlug]);

  if (loading) return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00ff00] mx-auto mb-4"></div>
        <p className="text-[#00ff00]">Loading chapter...</p>
      </div>
    </div>
  );
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!chapter) return <div className="p-8 text-center text-white">Chapter not found.</div>;
  if (!workshopSlug) return <div className="p-8 text-center text-red-500">Missing workshop slug.</div>;

  if (!canAccessChapter(String(workshopSlug), chapter.chapter_number)) {
    return (
      <div className="p-8 text-center text-yellow-400">
        <h2 className="text-2xl font-bold mb-4">Upgrade Required</h2>
        <p className="mb-6">You need an active subscription to access this chapter. Please upgrade your plan to continue learning.</p>
        <a href="/pricing" className="inline-block bg-[#00ff00] hover:bg-[#00cc00] text-black font-bold py-3 px-6 rounded-lg transition">View Pricing</a>
      </div>
    );
  }

  // Find curriculum and chapter context if available
  const curriculum = curriculumMap[String(workshopSlug)];
  const chapterContext = curriculum ? findChapterContext(curriculum, String(chapterSlug)) : undefined;

  return (
    <div className="min-h-screen bg-black text-white p-8 learn-page">
      <div className="max-w-4xl mx-auto">
        <ChapterReader
          workshopSlug={String(workshopSlug)}
          chapterSlug={String(chapterSlug)}
          chapter={chapter}
          chapterContext={chapterContext}
          mdxSource={mdxSource}
        />
      </div>
    </div>
  );
}