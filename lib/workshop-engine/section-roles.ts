import type { LucideIcon } from 'lucide-react'
import {
  Bookmark,
  BookOpenText,
  ClipboardList,
  Eye,
  FlaskConical,
  HelpCircle,
  Lightbulb,
  MessagesSquare,
  Mic,
  PlayCircle,
  Sparkles,
} from 'lucide-react'

/**
 * Semantic section roles for teaching surfaces.
 * Color is always paired with a distinct icon + label (never color alone).
 */
export type TeachingSectionRole =
  | 'outcome'
  | 'watch'
  | 'ideas'
  | 'tip'
  | 'vocab'
  | 'activity'
  | 'discussion'
  | 'checkpoint'
  | 'evidence'
  | 'facilitator'
  | 'video'
  | 'media'

export type TeachingSectionClasses = {
  label: string
  heading: string
  iconWrap: string
  icon: string
  surface: string
  border: string
  Icon: LucideIcon
}

export const TEACHING_SECTION_ROLES: Record<
  TeachingSectionRole,
  TeachingSectionClasses
> = {
  outcome: {
    label: 'Learning outcome',
    heading: 'text-cyan-900',
    iconWrap: 'bg-cyan-700 text-white',
    icon: 'text-cyan-700',
    surface: 'bg-gradient-to-br from-cyan-50 via-sky-50/40 to-white',
    border: 'border-cyan-200',
    Icon: Sparkles,
  },
  watch: {
    label: 'Watch / notice',
    heading: 'text-sky-900',
    iconWrap: 'bg-sky-700 text-white',
    icon: 'text-sky-700',
    surface: 'bg-gradient-to-br from-sky-50/80 via-white to-white',
    border: 'border-sky-200',
    Icon: Eye,
  },
  ideas: {
    label: 'Key ideas',
    heading: 'text-indigo-900',
    iconWrap: 'bg-indigo-700 text-white',
    icon: 'text-indigo-700',
    surface: 'bg-gradient-to-br from-indigo-50/70 via-white to-white',
    border: 'border-indigo-200',
    Icon: Lightbulb,
  },
  tip: {
    label: 'Tip',
    heading: 'text-amber-950',
    iconWrap: 'bg-amber-400 text-amber-950',
    icon: 'text-amber-800',
    surface: 'bg-gradient-to-br from-amber-50 via-orange-50/50 to-white',
    border: 'border-amber-300',
    Icon: Bookmark,
  },
  vocab: {
    label: 'Key vocab',
    heading: 'text-rose-950',
    iconWrap: 'bg-rose-700 text-white',
    icon: 'text-rose-700',
    surface: 'bg-gradient-to-br from-rose-50 via-pink-50/40 to-white',
    border: 'border-rose-200',
    Icon: BookOpenText,
  },
  activity: {
    label: 'Try it',
    heading: 'text-violet-950',
    iconWrap: 'bg-violet-700 text-white',
    icon: 'text-violet-700',
    surface: 'bg-gradient-to-br from-violet-50/80 via-white to-white',
    border: 'border-violet-200',
    Icon: FlaskConical,
  },
  discussion: {
    label: 'Discussion',
    heading: 'text-fuchsia-950',
    iconWrap: 'bg-fuchsia-700 text-white',
    icon: 'text-fuchsia-700',
    surface: 'bg-gradient-to-br from-fuchsia-50 via-violet-50/40 to-white',
    border: 'border-fuchsia-200',
    Icon: MessagesSquare,
  },
  checkpoint: {
    label: 'Checkpoint',
    heading: 'text-teal-950',
    iconWrap: 'bg-teal-700 text-white',
    icon: 'text-teal-700',
    surface: 'bg-gradient-to-br from-teal-50 via-cyan-50/40 to-white',
    border: 'border-teal-200',
    Icon: HelpCircle,
  },
  evidence: {
    label: 'Physical evidence',
    heading: 'text-emerald-950',
    iconWrap: 'bg-emerald-700 text-white',
    icon: 'text-emerald-800',
    surface: 'bg-gradient-to-br from-emerald-50 via-teal-50/30 to-white',
    border: 'border-emerald-200',
    Icon: ClipboardList,
  },
  facilitator: {
    label: 'Facilitator cues',
    heading: 'text-slate-900',
    iconWrap: 'bg-slate-800 text-white',
    icon: 'text-slate-700',
    surface: 'bg-gradient-to-br from-slate-50 via-sky-50/40 to-white',
    border: 'border-slate-300',
    Icon: Mic,
  },
  video: {
    label: 'Tutorial video',
    heading: 'text-blue-950',
    iconWrap: 'bg-blue-700 text-white',
    icon: 'text-blue-700',
    surface: 'bg-gradient-to-br from-blue-50 via-sky-50/40 to-white',
    border: 'border-blue-200',
    Icon: PlayCircle,
  },
  media: {
    label: 'Related visuals',
    heading: 'text-slate-800',
    iconWrap: 'bg-slate-700 text-white',
    icon: 'text-slate-600',
    surface: 'bg-gradient-to-br from-slate-50 to-white',
    border: 'border-slate-200',
    Icon: Eye,
  },
}
