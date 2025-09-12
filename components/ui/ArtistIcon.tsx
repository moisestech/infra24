import { Palette, Video, Music, Camera, Film, Mic, Guitar, Brush, Camera as CameraIcon } from 'lucide-react'

interface ArtistIconProps {
  organization?: {
    artist_icon?: string
    slug?: string
  }
  className?: string
  size?: number
}

const iconMap: { [key: string]: any } = {
  'Palette': Palette,
  'Video': Video,
  'Music': Music,
  'Camera': Camera,
  'Film': Film,
  'Mic': Mic,
  'Guitar': Guitar,
  'Brush': Brush,
  'CameraIcon': CameraIcon
}

export default function ArtistIcon({ organization, className, size = 20 }: ArtistIconProps) {
  const iconName = organization?.artist_icon || 'Palette'
  const IconComponent = iconMap[iconName] || Palette
  
  // Get organization-specific color classes
  const getOrganizationColorClass = (orgSlug?: string) => {
    switch (orgSlug) {
      case 'bakehouse':
        return "h-5 w-5 text-yellow-600 dark:text-yellow-400"
      case 'midnight-gallery':
        return "h-5 w-5 text-purple-600 dark:text-purple-400"
      case 'sunset-studios':
        return "h-5 w-5 text-orange-600 dark:text-orange-400"
      case 'ocean-workshop':
        return "h-5 w-5 text-blue-600 dark:text-blue-400"
      case 'forest-collective':
        return "h-5 w-5 text-green-600 dark:text-green-400"
      default:
        return "h-5 w-5 text-purple-600 dark:text-purple-400"
    }
  }
  
  const defaultClassName = getOrganizationColorClass(organization?.slug)
  const finalClassName = className || defaultClassName

  return <IconComponent className={finalClassName} size={size} />
}
