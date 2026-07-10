export type { EdgeZonesModuleStatus, EdgeZonesSupportModule } from './edgezones/types'
export * from './edgezones/edgezones-locale'
export * from './edgezones/content'
export { edgeZonesModuleStatusClass } from './edgezones/status'

/** Proposal-phase attribution defaults (PDF QR + join funnel). */
export const edgeZonesProposalAttribution = {
  signupSource: 'edgezones',
  utmSource: 'edgezones',
  utmMedium: 'proposal',
  utmCampaign: 'dcc_edgezones_launch',
  utmContent: 'partnership_pdf',
  qrCodeId: 'dcc_edgezones_main',
} as const
