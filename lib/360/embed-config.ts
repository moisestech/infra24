export interface EmbedItem {
  id: string
  title: string
  url: string
  description?: string
  thumbnail?: string
  aspectRatio?: string // "16:9", "4:3", "1:1", etc.
}

// Mock embed configurations
// In production, these would be stored in a database and managed by admins
export function getEmbedItems(organizationSlug: string): EmbedItem[] {
  // Return different embeds based on organization
  // For now, return mock data with example web applications
  
  const baseEmbeds: EmbedItem[] = [
    {
      id: '1',
      title: 'Interactive Data Dashboard',
      url: 'https://observablehq.com/@d3/bar-chart',
      description: 'Real-time analytics and data visualization',
      aspectRatio: '16:9',
      thumbnail: 'https://source.unsplash.com/800x450/?dashboard,analytics'
    },
    {
      id: '2',
      title: '3D Model Viewer',
      url: 'https://modelviewer.dev/examples/augmented-reality/index.html',
      description: 'Interactive 3D model exploration',
      aspectRatio: '16:9',
      thumbnail: 'https://source.unsplash.com/800x450/?3d,model'
    },
    {
      id: '3',
      title: 'Code Playground',
      url: 'https://codepen.io/pen/',
      description: 'Live code editor and preview',
      aspectRatio: '16:9',
      thumbnail: 'https://source.unsplash.com/800x450/?code,programming'
    },
    {
      id: '4',
      title: 'Interactive Map',
      url: 'https://www.openstreetmap.org/export/embed.html?bbox=-80.3,25.7,-80.1,25.9&layer=mapnik',
      description: 'Geographic data visualization',
      aspectRatio: '16:9',
      thumbnail: 'https://source.unsplash.com/800x450/?map,geography'
    },
    {
      id: '5',
      title: 'Design Tool',
      url: 'https://www.figma.com/embed?embed_host=share&url=https://www.figma.com/file/example',
      description: 'Collaborative design workspace',
      aspectRatio: '16:9',
      thumbnail: 'https://source.unsplash.com/800x450/?design,creative'
    }
  ]
  
  // Organization-specific embeds can be added here
  if (organizationSlug === 'oolite') {
    return [
      ...baseEmbeds,
      {
        id: '6',
        title: 'XR Experience Viewer',
        url: 'https://aframe.io/aframe/examples/boilerplate/hello-world/',
        description: 'WebXR immersive experiences',
        aspectRatio: '16:9',
        thumbnail: 'https://source.unsplash.com/800x450/?vr,ar'
      }
    ]
  }
  
  return baseEmbeds
}

export function getAspectRatioClass(aspectRatio?: string): string {
  switch (aspectRatio) {
    case '16:9':
      return 'aspect-video'
    case '4:3':
      return 'aspect-[4/3]'
    case '1:1':
      return 'aspect-square'
    case '21:9':
      return 'aspect-[21/9]'
    default:
      return 'aspect-video' // Default to 16:9
  }
}


