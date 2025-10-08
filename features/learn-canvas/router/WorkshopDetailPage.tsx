import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { WorkshopDetail } from '../components/WorkshopDetail';
import { Workshop } from '@/types/workshop';
// LiquidLoader not available

export default function WorkshopDetailPage() {
  const { workshopSlug } = useParams();
  const [workshop, setWorkshop] = useState<Workshop | null>(null);
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00ff00] mx-auto mb-4"></div>
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
          chapters={[]}
          user_progress={undefined}
        />
      </div>
    </div>
  );
} 