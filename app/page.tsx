import { announcements } from "@/lib/data";
import { LandingPage } from "@/components/LandingPage";

export default function Home() {
  return (
    <main className="bg-white">
      <LandingPage announcements={announcements} />
    </main>
  );
}
