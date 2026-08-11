export {
  RESIN_PRINTING_MODULES,
  RESIN_PRINTING_WORKSHOP,
  RESIN_BREAK_MODULE,
  getResinModuleBySlug,
  getResinModuleById,
  getResinModuleNav,
} from '@/lib/workshop-engine/resin-printing/curriculum'

export { RESIN_VENUES, getResinVenue } from '@/lib/workshop-engine/resin-printing/venues'

export {
  RESIN_RESOURCES,
  RESIN_GLOSSARY,
  RESIN_BOOKLET_DRAFT_HREF,
  RESIN_BOOKLET_PDF_HREF,
} from '@/lib/workshop-engine/resin-printing/resources'

export {
  RESIN_HERO_MEDIA,
  RESIN_MODULE_PRIMARY_MEDIA,
  RESIN_MODULE_MEDIA_IDS,
  RESIN_ASSET_PATHS,
} from '@/lib/workshop-engine/resin-printing/media'

export {
  RESIN_MODULE_BANNERS,
  RESIN_BANNER_SIZE,
} from '@/lib/workshop-engine/resin-printing/banners'

export {
  RESIN_BOOKLET_EDITION,
  RESIN_BOOKLET_ID,
  resinBookletRef,
  guidePagePreviewHref,
  isMissingLogicalPage,
  bookletDownloadHref,
  formatLogicalPageLabel,
} from '@/lib/workshop-engine/resin-printing/booklet'

export {
  MODULE_COLOR_TOKENS,
  RESIN_MODULE_VISUALS,
  VENUE_ACCENTS,
  getColorTokenClasses,
  getVenueAccent,
  DEFAULT_MODULE_VISUAL,
} from '@/lib/workshop-engine/resin-printing/theme'
