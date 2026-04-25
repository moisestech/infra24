import type { ModuleKey } from './types'

export type VcnModuleCard = {
  key: ModuleKey
  title: string
  chapterRange: string
  description: string
  accentClass: string
}

export const VCN_MODULES: VcnModuleCard[] = [
  {
    key: 'orientation',
    title: 'Orientation',
    chapterRange: 'Chapters 0–1',
    description: 'Tool ecology, definitions, and a first orientation to net art and vibecoding.',
    accentClass: 'border-blue-500/40 bg-blue-500/5',
  },
  {
    key: 'browser-language',
    title: 'Browser language',
    chapterRange: 'Chapters 2–5',
    description: 'Pages, links, interface, motion, and browser behavior as artistic material.',
    accentClass: 'border-violet-500/40 bg-violet-500/5',
  },
  {
    key: 'cultural-social-web',
    title: 'Cultural and social web',
    chapterRange: 'Chapters 6–8',
    description: 'Remix, identity, presence, and systems as subjects of internet-based art.',
    accentClass: 'border-rose-500/40 bg-rose-500/5',
  },
  {
    key: 'public-work-advanced',
    title: 'Public work and advanced pathways',
    chapterRange: 'Chapters 9–11',
    description: 'Publishing, liveness, advanced paths, and the capstone artwork.',
    accentClass: 'border-emerald-500/40 bg-emerald-500/5',
  },
]
