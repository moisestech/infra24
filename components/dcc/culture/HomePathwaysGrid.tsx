'use client';

import { useMemo } from 'react';
import { EraChannelEffect } from '@/components/era/EraChannelEffect';
import { EraInflectionCard } from '@/components/era/cards/EraInflectionCard';
import type { HomePathway } from '@/lib/dcc/culture/home-pathways';
import { eraMetricLadders } from '@/lib/era/metrics';

export function HomePathwaysGrid({ pathways }: { pathways: HomePathway[] }) {
  const ladderById = useMemo(
    () => new Map(eraMetricLadders.map((l) => [l.channel, l])),
    []
  );

  return (
    <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {pathways.map((pathway) => {
        const ladder = pathway.eraChannelId
          ? ladderById.get(pathway.eraChannelId)
          : undefined;
        return (
          <li key={pathway.id} className="min-h-[22rem]" data-home-pathway={pathway.id}>
            <EraInflectionCard
              channel={{
                id: pathway.id,
                title: pathway.title,
                shortLabel: pathway.shortLabel,
                group: pathway.group,
                description: pathway.description,
                siteHref: pathway.href,
                eraHref: pathway.eraHref,
                converge: pathway.converge,
              }}
              accent={pathway.accent}
              kicker={pathway.kicker}
              joinLabel={pathway.label}
              ladder={ladder}
              effect={
                <EraChannelEffect name={pathway.cardEffect} channelId={pathway.id} />
              }
              className="h-full"
            />
          </li>
        );
      })}
    </ul>
  );
}
