/** Airtable column names for INFRA24 CRM Seed Candidates table. */
export type SeedCandidatesFieldMap = {
  candidateName: string
  roleType: string
  institutionSource: string
  relevantExhibitionProgram: string
  sourceUrl: string
  website: string
  instagram: string
  linkedin: string
  city: string
  digitalOrientationSignal: string
  suggestedPracticeTags: string
  suggestedInterestTags: string
  whyDccFit: string
  seedFitScore: string
  confidence: string
  reviewStatus: string
  recommendedBucket: string
  suggestedOutreachAngle: string
  relatedCampaign: string
  constituentLabel: string
  contextLinks: string
  miamiConnectionType: string
  nodePriority: string
  graphLayer: string
  demoReadiness: string
  publicNodeSummary: string
  imagePortraitUrl: string
  addToPeople: string
}

export const DEFAULT_SEED_CANDIDATES_FIELD_MAP: SeedCandidatesFieldMap = {
  candidateName: 'Candidate Name',
  roleType: 'Role Type',
  institutionSource: 'Institution / Source',
  relevantExhibitionProgram: 'Relevant Exhibition / Program',
  sourceUrl: 'Source URL',
  website: 'Website',
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  city: 'City',
  digitalOrientationSignal: 'Digital Orientation Signal',
  suggestedPracticeTags: 'Suggested Practice Tags',
  suggestedInterestTags: 'Suggested Interest Tags',
  whyDccFit: 'Why DCC Fit',
  seedFitScore: 'Seed Fit Score',
  confidence: 'Confidence',
  reviewStatus: 'Review Status',
  recommendedBucket: 'Recommended Bucket',
  suggestedOutreachAngle: 'Suggested Outreach Angle',
  relatedCampaign: 'Related Campaign',
  constituentLabel: 'Constituent Label',
  contextLinks: 'Context Links',
  miamiConnectionType: 'Miami Connection Type',
  nodePriority: 'Node Priority',
  graphLayer: 'Graph Layer',
  demoReadiness: 'Demo Readiness',
  publicNodeSummary: 'Public Node Summary',
  imagePortraitUrl: 'Image / Portrait URL',
  addToPeople: 'Add to People?',
}
