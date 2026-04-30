import type { LucideIcon } from 'lucide-react';
import { Briefcase, Globe, MonitorSmartphone, Network, Presentation } from 'lucide-react';
import type { DccServiceIconId } from '@/lib/marketing/dcc-services';

const SERVICE_ICONS: Record<DccServiceIconId, LucideIcon> = {
  globe: Globe,
  monitor: MonitorSmartphone,
  presentation: Presentation,
  briefcase: Briefcase,
  network: Network,
};

export function getDccServiceIcon(id: DccServiceIconId): LucideIcon {
  return SERVICE_ICONS[id];
}
