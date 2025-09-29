// Use the dynamic workshops page with API data
import WorkshopsPage from '../../[slug]/workshops/page';

export default function OoliteWorkshopsPage() {
  // Use the dynamic workshops page that fetches data from API
  // Pass the slug as a prop since we're calling from a static route
  return <WorkshopsPage slug="oolite" />;
}
