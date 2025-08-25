import { Palette, Video, Music, Camera, Film, Mic, Guitar, Brush, Camera as CameraIcon } from 'lucide-react'

interface ArtistIconProps {
  organization?: {
    artist_icon?: string
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

export default function ArtistIcon({ organization, className = "h-5 w-5 text-purple-600 dark:text-purple-400", size = 20 }: ArtistIconProps) {
  const iconName = organization?.artist_icon || 'Palette'
  const IconComponent = iconMap[iconName] || Palette

  return <IconComponent className={className} size={size} />
}
