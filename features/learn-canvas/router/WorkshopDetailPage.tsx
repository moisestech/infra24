import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { WorkshopDetail } from '../components/WorkshopDetail';
import { WorkshopWithChapters } from '@/shared/types/workshop';
import { ChapterNavigation } from '@/shared/types/workshop';
import { LiquidLoader } from '@/shared/components/ui/LiquidLoader';

export default function WorkshopDetailPage() {
  const { workshopSlug } = useParams();
  const [workshop, setWorkshop] = useState<WorkshopWithChapters | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log('WorkshopDetailPage rendered with params:', { workshopSlug });

  useEffect(() => {
    console.log('WorkshopDetailPage useEffect triggered with:', { workshopSlug });
    
    if (!workshopSlug) {
      setError('Missing workshop slug');
      setLoading(false);
      return;
    }

    fetch(`/api/workshops?slug=${workshopSlug}`)
      .then(res => res.json())
      .then(data => {
        console.log('WorkshopDetailPage API response:', data);
        if (data.success && data.workshop) {
          setWorkshop(data.workshop);
        } else {
          setError(data.error || 'Workshop not found');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('WorkshopDetailPage API error:', err);
        setError('Failed to load workshop');
        setLoading(false);
      });
  }, [workshopSlug]);

  if (loading) return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <LiquidLoader size="md" className="mb-4" />
        <p className="text-[#00ff00]">Loading workshop...</p>
      </div>
    </div>
  );
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!workshop) return <div className="p-8 text-center text-white">Workshop not found.</div>;

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <WorkshopDetail 
          workshop={workshop}
          chapters={(workshop.chapters || []).map(ch => ({ ...ch, workshop_slug: workshop.slug }))}
          user_progress={undefined}
        />
      </div>
    </div>
  );
} 