'use client';

import dynamic from 'next/dynamic';
import type { BornDigitalEraChannel } from '@/lib/marketing/content';

const MeshField = dynamic(
  () => import('@/components/era/effects/MeshField').then((m) => m.MeshField),
  { ssr: false }
);
const VenueNode3D = dynamic(
  () => import('@/components/era/effects/VenueNode3D').then((m) => m.VenueNode3D),
  { ssr: false }
);
const KnowledgeLattice = dynamic(
  () =>
    import('@/components/era/effects/KnowledgeLattice').then((m) => m.KnowledgeLattice),
  { ssr: false }
);
const SignalPulse = dynamic(
  () => import('@/components/era/effects/SignalPulse').then((m) => m.SignalPulse),
  { ssr: false }
);
const LiveLoop = dynamic(
  () => import('@/components/era/effects/LiveLoop').then((m) => m.LiveLoop),
  { ssr: false }
);
const CityScan = dynamic(
  () => import('@/components/era/effects/CityScan').then((m) => m.CityScan),
  { ssr: false }
);
const ParticleDispatch = dynamic(
  () =>
    import('@/components/era/effects/ParticleDispatch').then((m) => m.ParticleDispatch),
  { ssr: false }
);

type EraChannelEffectName = BornDigitalEraChannel['cardEffect'];

export function EraChannelEffect({
  name,
  channelId,
}: {
  name: EraChannelEffectName;
  channelId?: string;
}) {
  switch (name) {
    case 'mesh-field':
      return <MeshField channelId={channelId} />;
    case 'venue-node':
      return <VenueNode3D />;
    case 'knowledge-lattice':
      return <KnowledgeLattice />;
    case 'signal-pulse':
      return <SignalPulse />;
    case 'live-loop':
      return <LiveLoop />;
    case 'city-scan':
      return <CityScan />;
    case 'particle-dispatch':
      return <ParticleDispatch />;
    default:
      return null;
  }
}
