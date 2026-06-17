export type AdFormatType = 'display' | 'video' | 'native' | 'flex';

export type PublisherStack = 'adsense' | 'header-bidding' | 'ramp-managed' | 'ramp-self';

export type ServiceModel = 'managed' | 'self-service';

export type PublisherPersonaId = 'studyHub' | 'arenaNews' | 'gameGrid';

export type PublisherPersona = {
  id: PublisherPersonaId;
  name: string;
  vertical: string;
  monthlyPageviews: number;
  primaryFormats: AdFormatType[];
  currentStack: PublisherStack;
  painPoints: string[];
  description: string;
};

export type MetricSnapshot = {
  rpm: number;
  cpm: number;
  fillRate: number;
  viewability: number;
  adRequests: number;
  revenueLiftPct: number;
  priceFloorRules: number;
  byDevice: { mobile: number; desktop: number };
  bidders: { name: string; share: number; cpm: number }[];
};

export type ParmmScore = 1 | 2 | 3 | 4 | 5;

export type ParmmDimension = {
  id: string;
  label: string;
  question: string;
  lowLabel: string;
  highLabel: string;
  weight: number;
};

export type ParmmAnswer = {
  dimensionId: string;
  score: ParmmScore;
};

export type PublisherFaq = {
  id: string;
  question: string;
  answer: string;
};

export type AdFormat = {
  id: string;
  name: string;
  type: AdFormatType;
  description: string;
  rpmLiftPct: number;
};

export type JourneyStep = 'persona' | 'parmm' | 'dashboard' | 'faq';
