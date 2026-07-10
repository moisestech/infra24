import type { EdgeZonesIconAccent, EdgeZonesSupportIconKey } from '@/lib/marketing/edgezones-icons'

export type EdgeZonesModuleStatus = 'live' | 'in-development' | 'materials-needed' | 'coming-soon'

export type EdgeZonesSupportModule = {
  id: string
  number: string
  title: string
  description: string
  materialsNote?: string
  href?: string
  status: EdgeZonesModuleStatus
  icon: EdgeZonesSupportIconKey
  accent: EdgeZonesIconAccent
}

export type EdgeZonesUiCopy = {
  roleLabel: string
  keyThemes: string
  possibleFormats: string
  programsBannerCaption: string
  archiveBannerCaption: string
  hostSpaceBadge: string
  invitedCuratorBadge: string
  participatingArtistBadge: string
  participatingArtistBadgeShort: string
  workImageComingSoon: string
  artistMaterialsPending: string
  openResearchMap: string
  materialsNeededPrefix: string
  partnershipContactTitle: string
  partnershipContactBody: string
  emailDccTeam: string
  downloadPartnershipPdf: string
  openPdfNewTab: string
  bookletDescription: string
  bookletLabel: string
  bookletAriaLabel: string
  instagram: string
  website: string
  jumpTo: string
}

export type EdgeZonesNavAnchor = { id: string; label: string }

export type EdgeZonesPortalContent = {
  slug: string
  path: string
  creditLine: string
  shortDescription: string
  metaTitle: string
  hero: {
    eyebrow: string
    title: string
    subtitle: string
    intro: string
    statusChips: readonly string[]
  }
  primaryCtas: readonly { label: string; href: string }[]
  rolesMatrix: {
    title: string
    intro: string
    edgeZones: {
      title: string
      subtitle: string
      intro: string
      items: string[]
      accent: 'coral'
      href: string
      hrefLabel: string
    }
    jordanHorton: {
      title: string
      subtitle: string
      intro: string
      items: string[]
      accent: 'indigo'
      href: string
      hrefLabel: string
    }
    dccMiami: {
      title: string
      subtitle: string
      intro: string
      items: string[]
      accent: 'teal'
      href: string
      hrefLabel: string
    }
  }
  concept: {
    title: string
    subtitle: string
    paragraphs: string[]
    paragraphStages: { label: string; caption: string }[]
    themes: { label: string; description: string; keywords: string[] }[]
    diagram: string[]
  }
  artists: { title: string; intro: string }
  sections: {
    support: {
      id: string
      title: string
      intro: string
      modules: EdgeZonesSupportModule[]
    }
    publicProgram: {
      id: string
      title: string
      intro: string
      formats: string[]
      dateLabel: string
      formatLabel: string
      ctaHref: string
      ctaLabel: string
    }
    archive: {
      id: string
      title: string
      intro: string
      deliverables: string[]
      status: string
    }
    pdf: {
      id: string
      title: string
      description: string
      note: string
    }
    join: {
      id: string
      title: string
      intro: string
      formIntro: string
      signupHref: string
      signupLabel: string
      suggestHref: string
      suggestLabel: string
    }
  }
  footer: { blurb: string; credit: string }
  exhibition: {
    workingTitle: string
    curator: string
    location: string
    dates: string
    artistNames: readonly string[]
  }
  ui: EdgeZonesUiCopy
  navAnchors: EdgeZonesNavAnchor[]
  moduleStatusLabels: Record<EdgeZonesModuleStatus, string>
}
