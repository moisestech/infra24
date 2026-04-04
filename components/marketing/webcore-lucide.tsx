import {
  AlertCircle,
  BookOpen,
  Building2,
  Cpu,
  FileSpreadsheet,
  GraduationCap,
  LayoutPanelLeft,
  Lightbulb,
  MapPin,
  Radio,
  ShieldCheck,
  Signpost,
  Sparkles,
  Users,
  Wrench,
  type LucideIcon,
} from 'lucide-react';

export const WEBCORE_ICONS = {
  AlertCircle,
  Radio,
  Cpu,
  MapPin,
  GraduationCap,
  LayoutPanelLeft,
  FileSpreadsheet,
  Users,
  Signpost,
  BookOpen,
  Building2,
  Lightbulb,
  Sparkles,
  Wrench,
  ShieldCheck,
} as const satisfies Record<string, LucideIcon>;

export type WebcoreIconName = keyof typeof WEBCORE_ICONS;

export function WebcoreIcon({
  name,
  className,
}: {
  name: WebcoreIconName;
  className?: string;
}) {
  const I = WEBCORE_ICONS[name];
  return <I className={className} aria-hidden />;
}
