import { announcements } from "@/lib/data";
import { LandingPage } from "@/components/LandingPage";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Announcements & Updates',
  description: 'Stay informed about the latest news, events, opportunities, and updates from the Bakehouse Art Complex community.',
  openGraph: {
    title: 'Announcements & Updates | Bakehouse Art Complex',
    description: 'Latest news, events, and opportunities from Miami\'s premier artist community.',
    images: [
      {
        url: '/og-announcements.jpg', // Create a specific OG image for announcements
        width: 1200,
        height: 630,
        alt: 'Bakehouse Art Complex Announcements'
      }
    ]
  }
};

export default function Home() {
  return (
    <main className="bg-white">
      <LandingPage announcements={announcements} />
    </main>
  );
}
