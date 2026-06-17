import type { ParmmAnswer, ParmmDimension, ParmmScore, ServiceModel } from './types';

export const parmmDimensions: ParmmDimension[] = [
  {
    id: 'ad-stack',
    label: 'Ad tech stack',
    question: 'How mature is your current monetization stack?',
    lowLabel: 'AdSense or single demand source',
    highLabel: 'Unified platform (header bidding + serving + analytics)',
    weight: 1.2,
  },
  {
    id: 'demand-strategy',
    label: 'Demand strategy',
    question: 'How diversified is your demand path?',
    lowLabel: 'One or two programmatic partners',
    highLabel: 'Header bidding + direct + curated deals',
    weight: 1.0,
  },
  {
    id: 'analytics',
    label: 'Analytics latency',
    question: 'How quickly do you see revenue performance?',
    lowLabel: '24–48 hour delays',
    highLabel: 'Real-time dashboards and alerts',
    weight: 1.1,
  },
  {
    id: 'format-mix',
    label: 'Format mix',
    question: 'How optimized is your format strategy?',
    lowLabel: 'Standard IAB display only',
    highLabel: 'Display + video + high-impact (Flex) coordinated',
    weight: 1.0,
  },
  {
    id: 'ops-model',
    label: 'Operations model',
    question: 'Who runs day-to-day yield and ad ops?',
    lowLabel: 'Publisher team stretched thin',
    highLabel: 'Dedicated yield ops with full visibility',
    weight: 1.15,
  },
  {
    id: 'transparency',
    label: 'Transparency',
    question: 'How visible are auction settings and partner economics?',
    lowLabel: 'Black-box reporting',
    highLabel: 'Full auction visibility and explainable optimization',
    weight: 1.0,
  },
];

export function computeParmmMaturity(answers: ParmmAnswer[]): number {
  if (answers.length === 0) return 0;
  let weightedSum = 0;
  let totalWeight = 0;
  for (const answer of answers) {
    const dim = parmmDimensions.find((d) => d.id === answer.dimensionId);
    const w = dim?.weight ?? 1;
    weightedSum += answer.score * w;
    totalWeight += w;
  }
  return Math.round((weightedSum / totalWeight) * 10) / 10;
}

export function recommendServiceModel(maturity: number, opsScore?: ParmmScore): ServiceModel {
  const ops = opsScore ?? 3;
  if (maturity >= 4 && ops >= 4) return 'self-service';
  if (maturity <= 2.5 || ops <= 2) return 'managed';
  return maturity >= 3.5 ? 'self-service' : 'managed';
}

export const defaultParmmAnswers: ParmmAnswer[] = parmmDimensions.map((d) => ({
  dimensionId: d.id,
  score: 3,
}));
