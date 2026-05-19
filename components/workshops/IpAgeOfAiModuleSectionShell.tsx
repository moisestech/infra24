import { IpAgeOfAiModuleTopicBanner } from '@/components/workshops/IpAgeOfAiModuleTopicBanner'
import { ipAgeOfAiModuleSectionPlaceholderBySlug } from '@/lib/workshops/ip-age-of-ai-module-placeholders'

export function IpAgeOfAiModuleSectionShell({
  id,
  bannerKey,
  children,
}: {
  id: string
  /** Key into `ipAgeOfAiModuleSectionPlaceholderBySlug`; omit for no banner */
  bannerKey?: keyof typeof ipAgeOfAiModuleSectionPlaceholderBySlug
  children: React.ReactNode
}) {
  const src = bannerKey ? ipAgeOfAiModuleSectionPlaceholderBySlug[bannerKey] : undefined
  return (
    <div id={id} role="region" className="scroll-mt-28 space-y-4">
      {src ? <IpAgeOfAiModuleTopicBanner src={src} alt="" /> : null}
      {children}
    </div>
  )
}
