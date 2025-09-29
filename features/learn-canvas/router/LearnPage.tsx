import { useEffect, useState } from 'react';
import { WorkshopCard } from '../components/WorkshopCard';
import { WorkshopSummary } from '@/shared/types/workshop';
import { LiquidLoader } from '@/shared/components/ui/LiquidLoader';

export default function LearnPage() {
  const [workshops, setWorkshops] = useState<WorkshopSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/workshops')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.workshops) {
          setWorkshops(data.workshops);
        } else {
          setError(data.error || 'Failed to load workshops');
        }
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load workshops');
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <LiquidLoader size="md" className="mb-4" />
        <p className="text-[#00ff00]">Loading workshops...</p>
      </div>
    </div>
  );
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Workshops</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workshops.map(w => (
            <WorkshopCard key={w.slug} workshop={w} />
          ))}
        </div>
      </div>
    </div>
  );
} 