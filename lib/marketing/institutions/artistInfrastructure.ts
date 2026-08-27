/**
 * DCC Miami /artist-infrastructure — incubator / guest teaching offer.
 * Subject is DCC Miami / we. Studio practice links out to moises.tech.
 */

import {
  DCC_WORKSHOPS_CATALOG,
  DCC_WORKSHOP_RESIN,
  DCC_WORKSHOP_VIBE_CODING,
  INSTITUTIONAL_CALENDLY_URL,
  INSTITUTIONAL_COLLABORATION_AVAILABILITY,
  INSTITUTIONAL_EMAIL,
  OOLITE_CONTRACT_CONTEXT,
  type LogoBandItem,
} from './shared';
import { media } from './media';
import {
  ARTIST_INFRASTRUCTURE_BANNER_WIDE,
  CREATIVE_DIRECTION_SPATIAL_INTERFACE,
  POSITIONING_ARTIST,
  POSITIONING_EDUCATOR,
  POSITIONING_SYSTEMS,
  SOFTWARE_INTERFACES_CREATOR_TOOL,
} from './artistInfrastructureMedia';

export type InstMedia = {
  src: string;
  alt: string;
  caption?: string;
  credit?: string;
  date?: string;
  category?: 'wide' | 'medium' | 'detail';
};

export type DeliveryStatus = 'active' | 'in-progress' | 'prototype' | 'proposed' | 'completed';

export const artistInfrastructureLogoBand: LogoBandItem[] = [
  { alt: 'n8n' },
  { alt: 'Notion' },
  { alt: 'Cursor' },
  { alt: 'Figma' },
  { src: media.airtableLogo.src, alt: media.airtableLogo.alt, height: 36 },
  { alt: 'QuickBooks' },
  { src: media.openaiLogo.src, alt: media.openaiLogo.alt, height: 36 },
  { alt: 'Anthropic' },
  { src: media.comfyLogo.src, alt: media.comfyLogo.alt, height: 36 },
  { src: media.pythonLogo.src, alt: media.pythonLogo.alt, height: 40 },
  { alt: 'GitHub' },
  { alt: 'Vercel' },
  { alt: 'Next.js' },
  { src: media.fireflyLogo.src, alt: media.fireflyLogo.alt, height: 36 },
];

export const artistInfrastructurePage = {
  meta: {
    title: 'Creative Infrastructure for Artists — DCC Miami',
    description:
      'Workshops, tools, and operational systems from Digital Culture Center Miami that help artists move from idea to working prototype—across AI, vibe coding, digital fabrication, and studio automation.',
    url: 'https://dcc.miami/artist-infrastructure',
    ogImage: ARTIST_INFRASTRUCTURE_BANNER_WIDE.src,
  },

  logoBand: artistInfrastructureLogoBand,
  logoBandLabel: 'Tools and systems named in this offer',

  hero: {
    kicker: 'Artist · Educator · Systems Builder',
    category: 'Artist infrastructure · Workshops · Institutional collaboration',
    headline: 'Creative infrastructure for artists',
    subhead:
      'DCC Miami designs workshops, tools, and operational systems that help artists move from an idea to a working prototype—across AI, vibe coding, digital fabrication, and studio automation.',
    availability: INSTITUTIONAL_COLLABORATION_AVAILABILITY,
    primaryCta: {
      label: 'Discuss a guest session',
      href: INSTITUTIONAL_CALENDLY_URL,
      external: true,
    },
    secondaryCta: {
      label: 'Explore the Oolite Digital Lab',
      href: 'https://moises.tech/oolite-arts',
    },
    image: {
      src: media.artTechCoding.src,
      alt: media.artTechCoding.alt,
      caption:
        'Art-tech coding workshop in the Oolite Arts Digital Lab — teaching from a working environment.',
      credit: media.artTechCoding.credit,
      category: 'wide' as const,
    } satisfies InstMedia,
    imageNote: 'Workshops given — swipe or use arrows. Each slide links to curriculum or a landing.',
    carousel: [
      {
        src: media.artTechCoding.src,
        alt: media.artTechCoding.alt,
        title: 'Art-tech coding · Digilab',
        caption: 'Teaching from a working lab — artists leave with a method, not a demo reel.',
        credit: media.artTechCoding.credit,
        sectionId: 'curriculum',
        sectionLabel: 'View curriculum',
      },
      {
        src: media.vibeDocs.src,
        alt: media.vibeDocs.alt,
        title: 'Vibe coding · Digilab',
        caption: 'Hands-on vibe coding session — screens, participants, and live iteration.',
        credit: 'Oolite Arts Digital Lab',
        sectionId: 'curriculum',
        sectionLabel: 'Vibe coding module',
      },
      {
        src: media.vibeNetArt.src,
        alt: media.vibeNetArt.alt,
        title: 'Vibe Code & Net Art',
        caption: 'Workshop banner — interfaces and browser-native experiments as artistic method.',
        credit: 'Oolite Arts Digital Lab',
        href: DCC_WORKSHOP_VIBE_CODING,
        sectionLabel: 'Open workshop',
      },
      {
        src: media.artistWebsites.src,
        alt: media.artistWebsites.alt,
        title: 'Artist Websites for Beginners',
        caption: 'Digital Lab workshop — structure, writing, and a publishable website spine.',
        credit: 'Oolite Arts Digital Lab',
        href: DCC_WORKSHOPS_CATALOG,
        sectionLabel: 'Workshops catalog',
      },
      {
        src: media.seoBanner.src,
        alt: media.seoBanner.alt,
        title: 'SEO for Artists',
        caption: 'Discoverability for artist practices — search, metadata, and AI-era visibility.',
        credit: 'Oolite Arts Digital Lab',
        href: DCC_WORKSHOPS_CATALOG,
        sectionLabel: 'Workshops catalog',
      },
      {
        src: media.resin2026.src,
        alt: media.resin2026.alt,
        title: '3D Resin Printing for Artists',
        caption: 'Fabrication literacy in the Digilab — file prep through supervised production.',
        credit: 'Oolite Arts Digital Lab',
        href: DCC_WORKSHOP_RESIN,
        sectionLabel: 'Open workshop',
      },
      {
        src: media.locustAiAgents.src,
        alt: media.locustAiAgents.alt,
        title: 'The Art of AI Agents · Locust',
        caption: media.locustAiAgents.caption,
        credit: media.locustAiAgents.credit,
        href: DCC_WORKSHOPS_CATALOG,
        sectionLabel: 'Workshops catalog',
      },
      {
        src: media.quickbooksBanner.src,
        alt: media.quickbooksBanner.alt,
        title: 'QuickBooks Automation for Artists',
        caption: 'Studio bookkeeping made legible — light automation with human review gates.',
        href: DCC_WORKSHOPS_CATALOG,
        sectionLabel: 'Workshops catalog',
      },
    ],
  },

  contextProof: {
    eyebrow: 'Context',
    items: [
      {
        id: 'oolite',
        label: 'Oolite Arts',
        body: 'Technical Director, Digital Lab · 2025–2026',
      },
      {
        id: 'miami',
        label: 'Miami-based',
        body: 'Artist practice, education, and cultural technology',
      },
      {
        id: 'engagements',
        label: 'Engagements',
        body: 'Guest sessions · Curriculum modules · Institutional pilots',
      },
    ],
  },

  positioning: {
    eyebrow: 'Positioning',
    title: 'One practice, three connected roles',
    lead: 'Artist, educator, and systems builder are overlapping roles—not three unrelated service cards.',
    cards: [
      {
        id: 'artist',
        title: 'Artist',
        body: 'Technology as material, culture, and subject—examining how interfaces, automation, platforms, and machines shape everyday life. The founder’s studio practice lives at moises.tech.',
        href: 'https://moises.tech',
        hrefLabel: 'Selected works on moises.tech',
        image: { src: POSITIONING_ARTIST.src, alt: POSITIONING_ARTIST.alt },
      },
      {
        id: 'educator',
        title: 'Educator',
        body: 'Accessible learning experiences in which artists leave with a working artifact, a repeatable method, and resources they can continue using.',
        href: '#curriculum',
        hrefLabel: 'View curriculum modules',
        image: { src: POSITIONING_EDUCATOR.src, alt: POSITIONING_EDUCATOR.alt },
      },
      {
        id: 'systems',
        title: 'Systems Builder',
        body: 'Infrastructure around creative work: documentation, equipment workflows, interfaces, automation, permissions, and tools that institutions can maintain.',
        href: '/institutions',
        hrefLabel: 'Institutional systems',
        image: { src: POSITIONING_SYSTEMS.src, alt: POSITIONING_SYSTEMS.alt },
      },
    ],
  },

  curriculum: {
    eyebrow: 'Incubator offer',
    title: 'What DCC can bring to an incubator',
    lead:
      'These modules complement entrepreneurship and digital-presence programs by focusing on the operational and technical layer underneath an artist’s practice. Expand a card for audience, formats, and take-homes.',
    modules: [
      {
        id: 'studio-automation',
        title: 'Studio Automation for Artists',
        promise:
          'Identify repetitive studio work and turn it into practical, human-supervised workflows — including n8n agent labs from The Art of AI Agents.',
        audience:
          'Artists, residents, and studio managers comfortable with everyday digital tools; no CS degree required.',
        formats: ['90-minute introduction', 'Half-day lab', 'Three-session curriculum'],
        artifact: 'A mapped studio workflow plus one small working automation or reusable operating template.',
        takeHome:
          'A reusable checklist, prompt/agent notes with human review gates, and next-step tooling options.',
        equipment: 'Laptops, projector, stable Wi-Fi; optional shared Notion / Drive / email accounts for demos.',
        options: ['Guest session', 'Co-taught module', 'Short curriculum block'],
        href: DCC_WORKSHOPS_CATALOG,
        image: { src: media.locustAiAgents.src, alt: media.locustAiAgents.alt },
      },
      {
        id: 'quickbooks-automation',
        title: 'QuickBooks Automation for Artists',
        promise:
          'Make studio bookkeeping legible — invoices, expenses, and categories with light automation and clear human review.',
        audience:
          'Artists and studio managers who already touch QuickBooks (or should) and need a maintainable operating template.',
        formats: ['90-minute introduction', 'Half-day lab'],
        artifact: 'A cleaned category map plus a simple bookkeeping runbook for ongoing use.',
        takeHome: 'Templates for invoices/expenses hygiene and a checklist of what stays human-approved.',
        equipment: 'Laptops, projector, QuickBooks Online demo account or screenshots.',
        options: ['Guest session', 'Co-taught module', 'Short curriculum block'],
        href: DCC_WORKSHOPS_CATALOG,
        image: { src: media.quickbooksBanner.src, alt: media.quickbooksBanner.alt },
      },
      {
        id: 'vibe-coding',
        title: 'Vibe Coding as Artistic Method',
        promise:
          'Use conversational coding tools to build small websites, interfaces, artist tools, and browser-native experiments without requiring a traditional computer-science background.',
        audience:
          'Artists and creative practitioners new to code; incubators seeking method over product tutorials.',
        formats: ['90-minute demonstration', 'Half-day build lab', 'Multi-session studio'],
        artifact: 'A functional browser-based prototype or net-art experiment, plus a documented iteration path.',
        takeHome: 'A published or exportable project plus a maintainable workflow for continuing iteration.',
        equipment: 'Laptops, browsers, projector; optional GitHub / hosting accounts.',
        options: ['Guest session', 'Co-taught module', 'Short curriculum block'],
        href: DCC_WORKSHOP_VIBE_CODING,
        image: { src: SOFTWARE_INTERFACES_CREATOR_TOOL.src, alt: SOFTWARE_INTERFACES_CREATOR_TOOL.alt },
      },
      {
        id: 'creative-tech-infra',
        title: 'Creative-Technology Infrastructure',
        promise:
          'Build a practical production system around digital fabrication, equipment, archives, collaborative work, and public presentation.',
        audience:
          'Digital labs, fabrication programs, and institutions standing up artist-facing tech capacity.',
        formats: ['Guest session', 'Technical clinic', 'Project-based short curriculum'],
        artifact: 'A production plan, tested prototype step, and reusable documentation package.',
        takeHome: 'Equipment/readiness notes, safety-aware process framing, and templates for open lab support.',
        equipment: 'Access to lab tools under supervision; projector; printed or digital guides.',
        options: ['Guest session', 'Co-taught module', 'Short curriculum block'],
        href: 'https://moises.tech/oolite-arts',
        image: { src: CREATIVE_DIRECTION_SPATIAL_INTERFACE.src, alt: CREATIVE_DIRECTION_SPATIAL_INTERFACE.alt },
      },
    ],
  },

  ooliteProof: {
    eyebrow: 'Flagship institutional case study',
    title: 'From a physical room to a repeatable artist-facing program',
    lead:
      'At Oolite Arts’ Digital Lab, DCC lead Moises Sanabria worked across physical infrastructure, artist education, fabrication workflows, digital systems, and documentation. The goal was not only to make equipment available, but to create pathways artists could understand, use, and build upon.',
    credit:
      'Developed with Director of Digital Lab Fabiola Larios, then technical direction by Moises Sanabria, Oolite Arts staff, participating artists, and institutional partners.',
    contractNote: OOLITE_CONTRACT_CONTEXT,
    href: 'https://moises.tech/oolite-arts',
    hrefLabel: 'View the Oolite case study',
    points: [
      'Access and orientation — making tools and workflows legible',
      'Workshops and learning — curriculum, facilitation, participant artifacts',
      'Fabrication and production — scanning, printing, prototyping support',
      'Systems and continuity — documentation, booking, communications, handoff',
    ],
    gallery: [
      {
        src: media.digilabRoom.src,
        alt: media.digilabRoom.alt,
        caption: 'Digital Lab environment — stations ready for teaching and open lab.',
        category: 'wide' as const,
      },
      {
        src: media.artTechCoding.src,
        alt: media.artTechCoding.alt,
        caption: 'Art-tech coding workshop — teaching in the working room.',
        category: 'medium' as const,
      },
      {
        src: media.vibeDocs.src,
        alt: media.vibeDocs.alt,
        caption: 'Vibe coding workshop in progress — screens and participants.',
        category: 'detail' as const,
      },
      {
        src: media.vibeNetArt.src,
        alt: media.vibeNetArt.alt,
        caption: 'Public Digital Lab workshop track — vibe coding and net art.',
        category: 'medium' as const,
      },
      {
        src: media.resin2026.src,
        alt: media.resin2026.alt,
        caption: '3D resin printing for artists — Digilab fabrication track.',
        category: 'medium' as const,
      },
      {
        src: media.digilabEntrance.src,
        alt: media.digilabEntrance.alt,
        caption: 'Digilab entrance — public-facing Studio 105 frontage.',
        category: 'wide' as const,
      },
    ] satisfies InstMedia[],
  },

  engagementProcess: {
    eyebrow: 'How an engagement works',
    title: 'From institutional need to reusable artist resource',
    valueLine:
      'The workshop is the visible event. The durable value is the method, documentation, participant artifact, and pathway for continued use.',
    steps: [
      {
        id: 'listen',
        title: 'Listen and map',
        body: 'Clarify the cohort, goals, constraints, access needs, and existing programming.',
      },
      {
        id: 'adapt',
        title: 'Adapt the module',
        body: 'Shape examples, tools, pacing, equipment, and participant output for the institution.',
      },
      {
        id: 'teach',
        title: 'Teach and build',
        body: 'Facilitate a hands-on session centered on a working artifact.',
      },
      {
        id: 'document',
        title: 'Document and extend',
        body: 'Deliver resources, capture approved outcomes, and identify what should repeat or grow.',
      },
    ],
  },

  supportingProof: {
    eyebrow: 'Supporting proof',
    title: 'Systems and tools underneath the practice',
    lead: 'A small number of verified proof cards—not a product pitch or logo wall.',
    cards: [
      {
        id: 'art-of-ai-agents',
        title: 'The Art of AI Agents',
        org: 'Locust Projects · The Dill',
        body: 'Artist Task Automation + Email Inbox Organizer — n8n AI agents with public chapter materials, handout prompts, and workflow screenshots.',
        status: 'completed' as DeliveryStatus,
        statusNote: 'Public workshop; catalog landing lives on /workshops until a dedicated DCC syllabus ships.',
        href: DCC_WORKSHOPS_CATALOG,
        image: {
          src: media.locustAiAgents.src,
          alt: media.locustAiAgents.alt,
          caption: media.locustAiAgents.caption,
          category: 'medium' as const,
        } satisfies InstMedia,
      },
      {
        id: 'bakehouse',
        title: 'Bakehouse SmartSigns',
        org: 'Bakehouse Art Complex',
        body: 'Artist-facing digital signage and kiosk infrastructure connecting spatial communication, staff-updatable programming, and maintainable technical workflows at Bakehouse Art Complex.',
        status: 'in-progress' as DeliveryStatus,
        statusNote: 'Active implementation / in progress. Dedicated install photography pending on the Bakehouse page.',
        href: 'https://moises.tech/bakehouse',
        image: {
          src: media.bakehouseOpenStudios.src,
          alt: 'Bakehouse Art Complex open studios — institutional context for SmartSign systems',
          caption: 'Bakehouse context image. Dedicated SmartSign install photography pending.',
          category: 'medium' as const,
        } satisfies InstMedia,
      },
      {
        id: 'ai24-infra24',
        title: 'AI24 / Infra24',
        org: 'Artist tools + public display systems',
        body: 'Experimental tools and publishing systems exploring artist workflows, grounded retrieval, permissions, human review, and approval-governed automation.',
        status: 'prototype' as DeliveryStatus,
        statusNote: 'Prototype and experimental systems—see project pages for scope boundaries.',
        href: 'https://moises.tech/ai24',
        secondaryHref: '/infra24',
        secondaryLabel: 'Infra24',
        image: {
          src: media.ai24Hero.src,
          alt: media.ai24Hero.alt,
          caption: 'AI24 program and tools hub.',
          category: 'medium' as const,
        } satisfies InstMedia,
      },
    ],
  },

  practice: {
    eyebrow: 'Artistic practice',
    title: 'Teaching from a live artistic practice',
    lead:
      'The curriculum grows from an active practice concerned with technology not only as a tool, but as an environment that shapes attention, labor, identity, and cultural memory.',
    href: 'https://moises.tech/selected-works',
    hrefLabel: 'Selected works',
    projects: [
      {
        id: 'moisesgpt',
        title: 'MoisesGPT / AI24',
        body: 'Editorial and conversational systems where generative tools meet human review—practice as public interface.',
        href: 'https://moises.tech/ai24',
        image: {
          src: media.ai24Hero.src,
          alt: media.ai24Hero.alt,
          category: 'detail' as const,
        } satisfies InstMedia,
      },
      {
        id: 'smart-shoppers',
        title: 'Smart Shoppers',
        body: 'Cognition staged as consumer product—object and interface as critique.',
        href: 'https://moises.tech/art/smart-shoppers',
        image: {
          src: media.smartShoppers.src,
          alt: 'Smart Shoppers — sculptural consumer cognition work',
          category: 'detail' as const,
        } satisfies InstMedia,
      },
      {
        id: 'doomscrolling',
        title: 'Doomscrolling Treadmill',
        body: 'Installed work from Born into the Machine — attention, body, and platform governance.',
        href: 'https://moises.tech/art/doomscrolling_treadmill',
        image: {
          src: media.touchGrass.src,
          alt: 'Doomscrolling Treadmill installation — touchgrass stations',
          category: 'wide' as const,
        } satisfies InstMedia,
      },
    ],
  },

  engagement: {
    eyebrow: 'Engagement',
    title: 'Ways to work together',
    availability: INSTITUTIONAL_COLLABORATION_AVAILABILITY,
    formats: [
      {
        id: 'guest',
        title: 'Guest session',
        body: 'A focused talk, demonstration, or hands-on workshop adapted to an existing class, cohort, or public program.',
      },
      {
        id: 'co-taught',
        title: 'Co-taught curriculum module',
        body: 'A short sequence developed with faculty or program staff, connecting the institution’s existing goals to a participant-made artifact.',
      },
      {
        id: 'pilot',
        title: 'Institutional pilot',
        body: 'A combined program and systems engagement that tests curriculum, documents outcomes, and identifies a repeatable model.',
      },
      {
        id: 'collaboration',
        title: 'Research or teaching collaboration',
        body: 'A longer relationship joining artistic research, curriculum development, prototypes, public programming, or institutional infrastructure.',
      },
    ],
  },

  cta: {
    eyebrow: 'Next step',
    title: 'Build the next layer of artist infrastructure',
    lead: 'Tell us about the artists you support, the systems or skills they need, and what you want participants to leave with. DCC will recommend a format and a practical next step.',
    email: INSTITUTIONAL_EMAIL,
    emailSubject: 'Creative infrastructure for artists — guest teaching / curriculum',
    calendlyHref: INSTITUTIONAL_CALENDLY_URL,
    calendlyLabel: 'Start an institutional conversation',
    secondaryLinks: [
      { label: 'Bookable workshops hub', href: DCC_WORKSHOPS_CATALOG },
      { label: 'Oolite Arts case study', href: 'https://moises.tech/oolite-arts' },
      { label: 'Institutions services', href: '/institutions' },
    ],
  },
} as const;
