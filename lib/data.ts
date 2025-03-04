import { Announcement } from "@/types/announcement";
import {
  // PartyPopper,
  // Sparkles,
  // FileText,
  // Calendar,
  // Users,
  // MessageSquare,
  // BookOpen,
  // Palette,
  // Music,
  // Camera,
  // Theater,
  // Award,
  // Briefcase,
  // DollarSign,
  // Globe,
  // Mail,
  // ClipboardCheck,
  // FileQuestion,
  // Clock,
  // Bell,
  AlertTriangle,
  Building2,
  Hammer,
  Brush,
  CloudRainWind,
  ShieldAlert,
  CarFront,
  Package,
  // Add more icons as needed...
} from 'lucide-react';

// Helper function to convert date string to Date object
function getAnnouncementDate(announcement: Announcement): Date {
  // If there's a time, combine date and time
  if (announcement.time) {
    // Handle date ranges (take the first date)
    const dateStr = announcement.date.split('-')[0].trim();
    const timeStr = announcement.time.split('-')[0].trim();
    return new Date(`${dateStr} ${timeStr}`);
  }
  // Otherwise just use the date
  return new Date(announcement.date);
}

// Sort function for announcements
function sortAnnouncements(announcements: Announcement[]): Announcement[] {
  const now = new Date();

  return announcements.sort((a, b) => {
    const dateA = getAnnouncementDate(a);
    const dateB = getAnnouncementDate(b);

    // Only prioritize urgent announcements that aren't past
    if (dateA >= now && dateB >= now) {
      if (a.type === 'urgent' && b.type !== 'urgent') return -1;
      if (b.type === 'urgent' && a.type !== 'urgent') return 1;
    }

    // If both dates are in the future, show soonest first
    if (dateA > now && dateB > now) {
      return dateA.getTime() - dateB.getTime();
    }
    
    // If both dates are in the past, show most recent first
    if (dateA < now && dateB < now) {
      return dateB.getTime() - dateA.getTime();
    }
    
    // If one is future and one is past, show future first
    return dateA > now ? -1 : 1;
  });
}

// Your existing announcements array
const unsortedAnnouncements: Announcement[] = [
  // URGENT ANNOUNCEMENTS
  {
    id: "urgent-1",
    type: "urgent",
    subType: "weather",
    template: "pattern",
    patternType: "stripes",
    title: "BUILDING CLOSURE: Storm Safety Protocol",
    date: "October 8, 2024",
    time: "8:00 PM - October 11, 8:00 AM",
    location: "Bakehouse Art Complex",
    description: "Building closed for storm safety. No access permitted. Remove vehicles from property. Protect studio items: use tarps, unplug electronics, elevate items.",
    additional_info: "Take immediate action to secure artwork and equipment in studios",
    visibility: "internal",
    expires_at: "2024-10-11",
  },
  
  // FACILITY ANNOUNCEMENTS
  {
    id: "facility-1",
    type: "facility",
    subType: "cleaning",
    template: "pattern",
    title: "KITCHEN CLEANUP & REORGANIZATION",
    date: "October 1, 2024",
    location: "Kitchen Area",
    description: "Major kitchen reorganization in progress. Drawers labeled, lockers available. Remove personal items from shared spaces. Items left behind will be disposed.",
    additional_info: "Items for taking available on tables outside kitchen until Monday afternoon",
    visibility: "internal",
    expires_at: "2024-10-02",
  },
  
  // MAJOR EVENTS
  {
    id: "event-1",
    type: "event",
    subType: "social",
    template: "pattern",
    patternType: "confetti",
    title: "MIAMI ART WEEK: Baker's Brunch",
    date: "December 5, 2024",
    time: "9:00 AM - 12:00 PM",
    location: "Bakehouse Art Complex",
    description: "Join us for our annual Miami Art Week celebration featuring local artists and special exhibitions.",
    primary_link: "https://eventbrite.com/bakers-brunch-2024",
    visibility: "external",
    expires_at: "2024-12-06",
  },
  {
    id: "event-2",
    type: "event",
    subType: "workshop",
    template: "pattern",
    title: "ADVENTURE-LEGGERS",
    date: "October 26, 2024",
    time: "11:00 AM - 5:00 PM",
    location: "Bakehouse Art Complex",
    description: "Full day of multimedia programming celebrating literature, art, and hands-on learning. Special parking restrictions in effect.",
    additional_info: "Use street parking or school lot across street. Lot closed until 6:00 PM",
    visibility: "both",
    expires_at: "2024-10-27",
  },

  // OPPORTUNITIES
  {
    id: "opportunity-1",
    type: "opportunity",
    subType: "open_call",
    template: "pattern",
    title: "FLOWING PATHWAYS: Performance Call",
    date: "December 6, 2024",
    location: "MOAD",
    description: "Seeking dancers and musicians for GeoVanna Gonzalez's installation exploring gender, identity, and power through river metaphors.",
    additional_info: "Application deadline: October 21, midnight",
    primary_link: "https://example.com/flowing-pathways-application",
    visibility: "external",
    expires_at: "2024-10-21",
  },
  {
    id: "opportunity-2",
    type: "opportunity",
    subType: "commission",
    template: "pattern",
    title: "PUBLIC ART COMMISSION: Bayshore Park",
    date: "September 5, 2024",
    location: "Miami Beach",
    description: "Create site-specific artworks for Bayshore Park. Seeking innovative approaches to enhance visitor experience and park identity.",
    additional_info: "Deadline: September 5, 2024, 5:00 PM",
    primary_link: "https://example.com/bayshore-park-application",
    visibility: "external",
    expires_at: "2024-09-05",
  },

  // ADMINISTRATIVE
  {
    id: "admin-1",
    type: "administrative",
    subType: "survey",
    template: "pattern",
    title: "2024 ANNUAL ARTIST SURVEY",
    date: "September 23, 2024",
    time: "Due by 11:59 PM EST",
    description: "Required annual survey for lease and membership renewal. Submit confirmation screenshot to lnovoa@bacfl.org",
    additional_info: "Coffee and breakfast available during survey period at Bookleggers on Fridays",
    primary_link: "https://example.com/artist-survey-2024",
    visibility: "internal",
    expires_at: "2024-09-24",
  },

  // SPECIAL VISITS

  // EXHIBITIONS
  {
    id: "event-4",
    type: "event",
    subType: "exhibition",
    template: "pattern",
    title: "DUAL EXHIBITION OPENING: Ephemeral Pillars & Seeds Become Futures",
    date: "March 1, 2025",
    time: "6:00 PM - 8:00 PM",
    location: "Tunnel Projects",
    description: "Opening reception featuring Gabriela García D'Alta's 'Ephemeral Pillars' and Nicole Salcedo's 'Seeds Become Futures'",
    primary_link: "https://example.com/exhibition-opening",
    visibility: "external",
    key_people: [
      {
        name: "Gabriela García D'Alta",
        role: "Artist"
      },
      {
        name: "Nicole Salcedo",
        role: "Artist"
      }
    ],
    expires_at: "2025-03-02",
  },

  // WORKSHOPS
  {
    id: "event-5",
    type: "event",
    subType: "workshop",
    template: "pattern",
    title: "ARTIST WORKSHOP: Pico Radial with Pati Monclús",
    date: "March 4, 2025",
    time: "6:30 PM - 8:30 PM",
    location: "Swenson Gallery",
    description: "Artist-led workshop featuring 16mm film projections by Katharine Labuda of Strange Pursuits",
    key_people: [
      {
        name: "Pati Monclús",
        role: "Artist"
      },
      {
        name: "Katharine Labuda",
        role: "Strange Pursuits"
      }
    ],
    visibility: "both",
    expires_at: "2025-03-05",
  },

  // OPEN STUDIOS
  {
    id: "event-6",
    type: "event",
    subType: "open_studios",
    template: "pattern",
    title: "FIRST OPEN STUDIOS 2025",
    date: "March 11, 2025",
    time: "6:00 PM - 9:00 PM",
    location: "Bakehouse Art Complex",
    description: "Join us for our first open studios of the year! Already 175+ RSVPs!",
    additional_info: "Promotional graphics by Freaks Design Co.",
    visibility: "both",
    organizations: [
      {
        name: "Freaks Design Co.",
        asset: "https://example.com/freaks-design-logo.jpg"
      }
    ],
    expires_at: "2025-03-12",
  },

  // ADMINISTRATIVE DEADLINES
  {
    id: "admin-2",
    type: "administrative",
    subType: "deadline",
    template: "pattern",
    title: "RESIDENCY AGREEMENT DEADLINE",
    date: "March 12, 2024",
    description: "Last day to schedule appointment for signing residency agreement. Review orientation documents on pages 9-10 of artist meeting PDF.",
    additional_info: "15-minute appointments required for signing",
    visibility: "internal",
    primary_link: "https://example.com/appointment-scheduling",
    expires_at: "2024-03-13",
  },

  // PARTNER EVENTS
  {
    id: "event-7",
    type: "event",
    subType: "social",
    template: "pattern",
    title: "BOOKLEGGERS LIBRARY: New Saturday Hours",
    date: "March 2, 2025",
    time: "12:00 PM - 5:00 PM",
    location: "Bookleggers Library",
    description: "Bookleggers Library now open to public on Saturdays! Support our resident organization.",
    visibility: "external",
    organizations: [
      {
        name: "Bookleggers Library"
      }
    ],
    expires_at: "2025-03-02",
  },

  // OFFSITE EVENTS
  {
    id: "event-8",
    type: "event",
    subType: "performance",
    template: "pattern",
    title: "ZINE RELEASE: Cradle of Mangroves",
    date: "March 2, 2025",
    time: "3:00 PM - 5:00 PM",
    location: "Bill Baggs Park (Area D), 1200 Crandon Blvd, Key Biscayne FL",
    description: "Celebrate Nicole Salcedo's EXILE Books Zine Release in nature",
    primary_link: "https://example.com/zine-release",
    visibility: "external",
    organizations: [
      {
        name: "EXILE Books"
      }
    ],
    key_people: [
      {
        name: "Nicole Salcedo",
        role: "Artist"
      }
    ],
    expires_at: "2025-03-03",
  },

  {
    id: "opportunity-1",
    type: "opportunity",
    subType: "open_call",
    template: "pattern",
    patternType: "bauhaus",
    title: "Laundromat Art Space Solo Show Applications Open",
    date: "March 13, 2025",
    time: "11:59 PM EST",
    location: "Laundromat Art Space",
    description: "Laundromat Art Space is now accepting applications for a solo show in their 1,500 square foot gallery exhibition space. The application deadline is Thursday, March 13 at 11:59 PM EST.",
    primary_link: "https://example.com/laundromat-application", // Replace with actual link
    visibility: "external",
    expires_at: "March 14, 2025",
    key_people: [
      {
        name: "Curatorial Team",
        role: "Selection Committee"
      }
    ],
    organizations: [
      {
        name: "Laundromat Art Space"
      }
    ],
    visual_style: {
      accent_color: "#FF5733",
      background_pattern: "waves"
    },
    icon: Brush
  },
  {
    id: "opportunity-2",
    type: "opportunity",
    subType: "residency",
    template: "pattern",
    patternType: "grid",
    title: "The Wolfsonian's Creative Fellowship Applications Open",
    date: "April 30, 2025",
    description: "Applications are now open for The Wolfsonian's Creative Fellowship program, which invites visual artists, designers, writers, filmmakers, performers, and musicians to immerse themselves in the museum’s collection.",
    primary_link: "https://example.com/wolfsonian-fellowship", // Replace with actual link
    visibility: "external",
    expires_at: "May 1, 2025",
    key_people: [
      {
        name: "Fellowship Coordinator",
        role: "Program Manager"
      }
    ],
    organizations: [
      {
        name: "The Wolfsonian Museum"
      }
    ],
    visual_style: {
      accent_color: "#3366FF",
      background_pattern: "lines"
    },
    icon: Briefcase
  },
  {
    id: "event-3",
    type: "event",
    subType: "workshop",
    template: "pattern",
    patternType: "geometric",
    title: "Artist-Led Workshop with Pati Monclús & Katharine Labuda",
    date: "March 4, 2025",
    time: "6:30 - 8:30 PM",
    location: "Swenson Gallery",
    description: "Join us in the Swenson Gallery for an artist-led workshop facilitated by Pati Monclús and inspired by her current exhibition, Pico Radial. Special guest Katharine Labuda of Strange Pursuits will project a selection of 16 mm films, contextualizing the exhibition’s themes.",
    visibility: "both",
    expires_at: "March 5, 2025",
    icon: Calendar
  },
  {
    id: "notice-1",
    type: "administrative",
    subType: "policy",
    template: "pattern",
    title: "Private Events Notice",
    date: "March 5-6, 2025",
    description: "We are hosting private events on Wednesday, March 5 from 6:30 - 9:30 PM and Thursday, March 6 from 4:00 - 6:00 PM. We appreciate your patience!",
    visibility: "internal",
    expires_at: "March 7, 2025",
    icon: Calendar
  },
  {
    id: "event-4",
    type: "event",
    subType: "open_studios",
    template: "pattern",
    patternType: "minimal",
    title: "Open Studios",
    date: "March 11, 2025",
    time: "6:00 - 9:00 PM",
    description: "A calendar invite has been sent out for Open Studios on Tuesday, March 11 from 6:00 - 9:00 PM. Looking forward to seeing you all there!",
    visibility: "both",
    expires_at: "March 12, 2025",
    icon: Calendar
  }
];

// Export sorted announcements
export const announcements = sortAnnouncements(unsortedAnnouncements);

export const announcementStyles = {
  urgent: {
    gradient: "bg-gradient-to-br from-red-600 via-red-500 to-orange-500",
    overlay: "bg-black/20",
    accent: "from-red-300 to-orange-300",
    badge: "bg-red-500",
    text: "text-white",
    dateStyle: "bg-red-700/90 text-white",
    backgroundPattern: "radial-gradient-dots",
    icons: {
      closure: AlertTriangle,
      weather: CloudRainWind,
      safety: ShieldAlert,
      parking: CarFront
    },
    templates: {
      minimal: {
        titleClass: "text-8xl font-black tracking-tight",
        dateClass: "text-6xl font-bold",
        gradient: "from-red-600 via-red-500 to-orange-500"
      },
      dynamic: {
        // Different style configuration
      }
      // ... other templates
    }
  },
  facility: {
    backgroundPattern: "diagonal-lines",
    icons: {
      maintenance: Hammer,
      cleaning: Brush,
      storage: Package,
      renovation: Building2
    },
    // ... style configurations
  },
  // ... continue for other types
};

// Template variations for the carousel
export const carouselTemplates = {
  minimal: {
    layout: "grid-cols-1",
    typography: {
      title: "text-9xl font-black tracking-tighter",
      date: "text-7xl font-bold text-accent",
      description: "text-2xl leading-relaxed"
    },
    spacing: "gap-16",
    animation: "fade-in-up"
  },
  dynamic: {
    layout: "grid-cols-12 gap-4",
    // ... more template configurations
  }
  // ... other templates
}; 
