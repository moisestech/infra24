import type { TimelineEvent } from '../components/interactive/FilmstripTimeline'

export const aiVideoTimelineData: TimelineEvent[] = [
  {
    id: 'deepfakes-emerge',
    date: '2017-11-01',
    title: 'Deepfakes Emerge',
    summary: 'AI face-swapping goes viral on Reddit, marking the beginning of AI video manipulation',
    category: 'milestone',
    tags: ['deepfakes', 'face-swapping', 'reddit'],
    image: '/img/ai-video-timeline/2017-deepfakes.jpg'
  },
  {
    id: 'deepfake-controversy',
    date: '2018-03-15',
    title: 'Deepfake Controversy',
    summary: 'Ethical concerns spread as deepfakes are used maliciously, raising awareness of AI video risks',
    category: 'controversy',
    tags: ['ethics', 'misinformation', 'awareness'],
    image: '/img/ai-video-timeline/2018-controversy.jpg'
  },
  {
    id: 'video-gans-expansion',
    date: '2019-06-01',
    title: 'Video GANs Expansion',
    summary: 'Research expands beyond faces to include style transfer and general video generation',
    category: 'research',
    tags: ['GANs', 'style-transfer', 'research'],
    image: '/img/ai-video-timeline/2019-gans.jpg'
  },
  {
    id: 'temporal-coherence-focus',
    date: '2020-09-01',
    title: 'Temporal Coherence Focus',
    summary: 'Research focuses on solving the challenge of maintaining consistency across video frames',
    category: 'research',
    tags: ['temporal-coherence', 'consistency', 'research'],
    image: '/img/ai-video-timeline/2020-temporal.jpg'
  },
  {
    id: 'early-text-to-video',
    date: '2021-12-01',
    title: 'Early Text-to-Video',
    summary: 'First text-to-video prototypes like CogVideo demonstrate the potential of AI video generation',
    category: 'breakthrough',
    tags: ['text-to-video', 'CogVideo', 'prototypes'],
    image: '/img/ai-video-timeline/2021-text-to-video.jpg'
  },
  {
    id: 'major-breakthroughs',
    date: '2022-09-01',
    title: 'Major Breakthroughs',
    summary: 'Meta Make-A-Video and Google Imagen Video show significant quality improvements',
    category: 'breakthrough',
    tags: ['Meta', 'Google', 'Make-A-Video', 'Imagen'],
    image: '/img/ai-video-timeline/2022-breakthroughs.jpg'
  },
  {
    id: 'ai-video-mainstream',
    date: '2023-03-01',
    title: 'AI Video Goes Mainstream',
    summary: 'Runway Gen-2 and open source models make AI video accessible to everyone',
    category: 'release',
    tags: ['Runway', 'Gen-2', 'open-source', 'accessibility'],
    image: '/img/ai-video-timeline/2023-mainstream.jpg'
  },
  {
    id: 'quality-improvements',
    date: '2024-02-01',
    title: 'Quality Improvements',
    summary: 'Runway Gen-3 and OpenAI Sora demonstrate major advances in video length and quality',
    category: 'breakthrough',
    tags: ['Runway', 'Gen-3', 'OpenAI', 'Sora'],
    image: '/img/ai-video-timeline/2024-quality.jpg'
  },
  {
    id: 'professional-control',
    date: '2025-01-01',
    title: 'Professional Control',
    summary: 'Veo 3 and Higgsfield bring professional-level control and API access to AI video',
    category: 'release',
    tags: ['Veo-3', 'Higgsfield', 'professional', 'API'],
    image: '/img/ai-video-timeline/2025-professional.jpg'
  }
]

// Convert to the format expected by the original Timeline component
export const aiVideoTimelineEvents = aiVideoTimelineData.map(event => ({
  year: new Date(event.date).getFullYear().toString(),
  title: event.title,
  description: event.summary,
  category: event.category as 'milestone' | 'breakthrough' | 'release' | 'research'
}))
