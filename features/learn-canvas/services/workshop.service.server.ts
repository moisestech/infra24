import { WorkshopSummary, Workshop, Chapter, WorkshopProgress, Resource, Assignment, WorkshopWithChapters } from '@/shared/types/workshop'
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

interface WorkshopFilters {
  category?: string
  difficulty?: string
  featured?: boolean
  published?: boolean
}

class WorkshopService {
  private static instance: WorkshopService

  private constructor() {}

  static getInstance(): WorkshopService {
    if (!WorkshopService.instance) {
      WorkshopService.instance = new WorkshopService()
    }
    return WorkshopService.instance
  }

  /**
   * Load workshop data from syllabus.md file
   */
  private async loadWorkshopFromSyllabus(workshopSlug: string): Promise<WorkshopSummary | null> {
    try {
      const syllabusPath = path.join(process.cwd(), 'content', 'workshops', workshopSlug, 'syllabus.md');
      const content = await fs.readFile(syllabusPath, 'utf-8');
      const { data } = matter(content);
      
      return {
        id: workshopSlug,
        slug: data.slug || workshopSlug,
        title: data.title || 'Untitled Workshop',
        subtitle: data.subtitle || '',
        description: data.description || '',
        learning_objectives: data.learning_objectives || [],
        prerequisites: data.prerequisites || [],
        duration_weeks: Math.ceil((data.duration_hours || 3) / 2), // Convert hours to weeks (assuming 2 hours per week)
        difficulty_level: data.difficulty || 'beginner',
        category: data.category || 'media',
        featured: data.featured || false,
        published: data.published !== false,
        metadata: { 
          tracks: data.tracks || [],
          target_audience: data.target_audience || []
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        total_chapters: 8, // This will be calculated from actual chapters
        published_chapters: 1,
        avg_chapter_duration: Math.round((data.duration_hours || 3) * 60 / 8), // Convert to minutes per chapter
        image: `https://res.cloudinary.com/dck5rzi4h/image/upload/v1752600015/ai24/workshops/ai24-course-${workshopSlug}.png`
      };
    } catch (error) {
      console.error(`Error loading workshop from syllabus: ${workshopSlug}`, error);
      return null;
    }
  }

  /**
   * Get all workshops with optional filtering
   */
  async getWorkshops(filters?: WorkshopFilters): Promise<WorkshopSummary[]> {
    // Load AI video production workshop from syllabus file
    const aiVideoWorkshop = await this.loadWorkshopFromSyllabus('ai-video-production');
    
    // In a real implementation, this would fetch from Supabase
    // For now, return mock data with all 18 workshops
    const allWorkshops: WorkshopSummary[] = [
      // 🎬 Creative & Media (8 workshops)
      {
        id: '1',
        slug: 'ai-filmmaking',
        title: 'AI Filmmaking Fundamentals',
        subtitle: 'From script to screen with AI tools',
        description: 'Learn how to use AI tools to create incredible films. We\'ll take you from script to screen in this essential AI filmmaking course used by artists at every major studio.',
        learning_objectives: [
          'Master AI script generation and storyboarding',
          'Create compelling visual narratives with AI tools',
          'Understand film production workflows with AI integration',
          'Develop ethical filmmaking practices'
        ],
        prerequisites: [
          'Basic understanding of film concepts',
          'Familiarity with video editing software',
          'Access to AI filmmaking tools (provided in course)'
        ],
        duration_weeks: 6,
        difficulty_level: 'beginner',
        category: 'film',
        featured: true,
        published: true,
        metadata: { tier: 'creator' },
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
        total_chapters: 18,
        published_chapters: 1,
        avg_chapter_duration: 60,
        image: 'https://res.cloudinary.com/dck5rzi4h/image/upload/v1752600014/ai24/workshops/ai24-course-ai-filmmaking-fundamentals_bsxlra.png'
      },
      {
        id: '2',
        slug: 'advanced-ai-filmmaking',
        title: 'Advanced AI Filmmaking',
        subtitle: 'Hollywood-level production techniques',
        description: 'This course will help you take your skills to a completely new level. We will show you how to create AI Films nearly indistinguishable from Hollywood productions.',
        learning_objectives: [
          'Advanced AI cinematography techniques',
          'Professional post-production workflows',
          'Industry-standard AI film tools',
          'Complex narrative AI generation'
        ],
        prerequisites: [
          'AI Filmmaking Fundamentals or equivalent experience',
          'Advanced video editing skills',
          'Understanding of film production workflows'
        ],
        duration_weeks: 8,
        difficulty_level: 'advanced',
        category: 'film',
        featured: true,
        published: true,
        metadata: { tier: 'pro' },
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
        total_chapters: 18,
        published_chapters: 1,
        avg_chapter_duration: 90,
        image: 'https://res.cloudinary.com/dck5rzi4h/image/upload/v1752600921/ai24/workshops/ai24-course-advanced-filmmaking.png'
      },
      {
        id: '3',
        slug: 'ai-animation',
        title: 'AI Animation Studio',
        subtitle: 'Studio-quality animation with AI',
        description: 'Learn to create studio-quality animation films. We\'ve partnered with Storybook Studios to show you the AI tools and techniques you need to know to craft beautiful AI animation films.',
        learning_objectives: [
          'AI-powered character animation',
          'Storyboard to final animation workflow',
          'Studio-quality rendering techniques',
          'Animation industry best practices'
        ],
        prerequisites: [
          'Basic animation concepts',
          'Familiarity with animation software',
          'Understanding of storytelling principles'
        ],
        duration_weeks: 6,
        difficulty_level: 'intermediate',
        category: 'animation',
        featured: false,
        published: true,
        metadata: { tier: 'creator' },
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
        total_chapters: 18,
        published_chapters: 1,
        avg_chapter_duration: 75,
        image: 'https://res.cloudinary.com/dck5rzi4h/image/upload/v1752603985/ai24/workshops/ai24-course-ai-animation_ifhhhs.png'
      },
      {
        id: '4',
        slug: 'ai-documentary',
        title: 'AI Documentary Production',
        subtitle: 'Real-world stories enhanced by AI',
        description: 'AI has the power to improve the impact of real-world stories. This is the world\'s first course for AI documentary and unscripted production. Learn from one of the best in the biz.',
        learning_objectives: [
          'AI-enhanced storytelling techniques',
          'Documentary ethics and authenticity',
          'Real-world story preservation',
          'Impact-driven content creation'
        ],
        prerequisites: [
          'Basic documentary filmmaking knowledge',
          'Understanding of ethical storytelling',
          'Interest in real-world narratives'
        ],
        duration_weeks: 5,
        difficulty_level: 'intermediate',
        category: 'documentary',
        featured: false,
        published: true,
        metadata: { tier: 'creator' },
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
        total_chapters: 15,
        published_chapters: 1,
        avg_chapter_duration: 80,
        image: 'https://res.cloudinary.com/dck5rzi4h/image/upload/v1752600921/ai24/workshops/ai24-course-documentary-production_u9kcer.png'
      },
      {
        id: '5',
        slug: 'ai-vfx',
        title: 'AI VFX Mastery',
        subtitle: 'Revolutionary visual effects with AI',
        description: 'AI is revolutionizing the entire VFX industry. From simulating explosions and fire to creating photorealistic environments, we\'ve teamed up with industry professionals to teach you the latest VFX techniques.',
        learning_objectives: [
          'Advanced AI simulation techniques',
          'Photorealistic environment creation',
          'Industry-standard VFX workflows',
          'Real-time AI rendering'
        ],
        prerequisites: [
          'Advanced VFX experience',
          'Understanding of 3D software',
          'Knowledge of visual effects principles'
        ],
        duration_weeks: 8,
        difficulty_level: 'advanced',
        category: 'vfx',
        featured: false,
        published: true,
        metadata: { tier: 'pro' },
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
        total_chapters: 18,
        published_chapters: 1,
        avg_chapter_duration: 120,
        image: 'https://res.cloudinary.com/dck5rzi4h/image/upload/v1752603815/ai24/workshops/ai24-course-ai-vfx_lcbwj5.png'
      },
      {
        id: '6',
        slug: 'ai-advertising',
        title: 'AI Advertising & Marketing',
        subtitle: 'Create impressive advertising with AI',
        description: 'Create impressive advertising projects in this essential course from one of the best AI advertising experts in the world. This is an exciting deep-dive into advertising and marketing.',
        learning_objectives: [
          'AI-powered campaign creation',
          'Target audience analysis with AI',
          'Creative advertising strategies',
          'ROI measurement and optimization'
        ],
        prerequisites: [
          'Basic marketing concepts',
          'Understanding of advertising principles',
          'Interest in creative campaigns'
        ],
        duration_weeks: 4,
        difficulty_level: 'intermediate',
        category: 'marketing',
        featured: false,
        published: true,
        metadata: { tier: 'creator' },
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
        total_chapters: 12,
        published_chapters: 1,
        avg_chapter_duration: 60,
        image: 'https://res.cloudinary.com/dck5rzi4h/image/upload/v1752604140/ai24/workshops/ai24-course-ai-advertising-marketing_f9ierw.png'
      },
      {
        id: '7',
        slug: 'ai-art-fundamentals',
        title: 'AI Art Fundamentals',
        subtitle: 'Master AI-generated art and creative workflows',
        description: 'Master the basics of AI-generated art and creative workflows. Learn to create stunning visual content using the latest AI art tools.',
        learning_objectives: [
          'AI art generation principles',
          'Creative workflow optimization',
          'Style development and consistency',
          'Copyright and ethical considerations'
        ],
        prerequisites: [
          'Basic computer literacy',
          'Interest in art and design',
          'Access to AI art tools (provided)'
        ],
        duration_weeks: 4,
        difficulty_level: 'beginner',
        category: 'art',
        featured: true,
        published: true,
        metadata: { tier: 'creator' },
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
        total_chapters: 12,
        published_chapters: 3,
        avg_chapter_duration: 60,
        image: 'https://res.cloudinary.com/dck5rzi4h/image/upload/v1752600013/ai24/workshops/ai24-course-ai-art-fundamentals_nuavhb.png'
      },
      {
        id: '8',
        slug: 'ai-photography',
        title: 'AI Photography & Visual Storytelling',
        subtitle: 'Transform photography with AI tools',
        description: 'Transform your photography with AI tools. Learn to enhance, edit, and create compelling visual narratives using artificial intelligence.',
        learning_objectives: [
          'AI photo enhancement techniques',
          'Visual storytelling principles',
          'Post-processing workflows',
          'Authentic visual communication'
        ],
        prerequisites: [
          'Basic photography knowledge',
          'Familiarity with photo editing software',
          'Understanding of visual composition'
        ],
        duration_weeks: 4,
        difficulty_level: 'beginner',
        category: 'photography',
        featured: false,
        published: true,
        metadata: { tier: 'creator' },
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
        total_chapters: 12,
        published_chapters: 1,
        avg_chapter_duration: 60,
        image: 'https://res.cloudinary.com/dck5rzi4h/image/upload/v1752600014/ai24/workshops/ai24-course-ai-photography-visual-storytelling_xd3xv7.png'
      },

      // 🤖 Technical & Development (3 workshops)
      {
        id: '9',
        slug: 'llm-fundamentals',
        title: 'Large Language Models (LLMs) Fundamentals',
        subtitle: 'Understanding and working with LLMs',
        description: 'Understand the fundamentals of Large Language Models. Learn how to work with, fine-tune, and deploy LLMs for various applications.',
        learning_objectives: [
          'LLM architecture and principles',
          'Prompt engineering techniques',
          'Model fine-tuning basics',
          'Ethical LLM usage'
        ],
        prerequisites: [
          'Basic programming knowledge',
          'Understanding of machine learning concepts',
          'Interest in natural language processing'
        ],
        duration_weeks: 5,
        difficulty_level: 'beginner',
        category: 'technical',
        featured: false,
        published: true,
        metadata: { tier: 'creator' },
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
        total_chapters: 15,
        published_chapters: 1,
        avg_chapter_duration: 75,
        image: 'https://res.cloudinary.com/dck5rzi4h/image/upload/v1752600017/ai24/workshops/ai24-course-llm-fundamentals_zlot0g.png'
      },
      {
        id: '10',
        slug: 'vibecoding',
        title: 'VibeCoding: AI-Assisted Development',
        subtitle: 'Code with AI assistance intuitively',
        description: 'Learn to code with AI assistance in a more intuitive, creative way. Discover how to leverage AI tools for faster, more efficient development workflows.',
        learning_objectives: [
          'AI-assisted coding techniques',
          'Creative problem-solving with AI',
          'Development workflow optimization',
          'Code quality and testing with AI'
        ],
        prerequisites: [
          'Basic programming knowledge (any language)',
          'Familiarity with development tools',
          'Understanding of software development concepts'
        ],
        duration_weeks: 6,
        difficulty_level: 'intermediate',
        category: 'development',
        featured: true,
        published: true,
        metadata: { tier: 'pro' },
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
        total_chapters: 18,
        published_chapters: 1,
        avg_chapter_duration: 90,
        image: 'https://res.cloudinary.com/dck5rzi4h/image/upload/v1752600017/ai24/workshops/ai24-course-vibe-coding_r00fnx.png'
      },
      {
        id: '11',
        slug: 'ai-game-development',
        title: 'AI Game Development',
        subtitle: 'Create immersive gaming experiences with AI',
        description: 'Create immersive gaming experiences using AI. Learn to build intelligent NPCs, procedural content generation, and dynamic game worlds.',
        learning_objectives: [
          'AI-driven game mechanics',
          'Procedural content generation',
          'Intelligent NPC development',
          'Dynamic world building'
        ],
        prerequisites: [
          'Basic game development experience',
          'Understanding of programming concepts',
          'Familiarity with game engines'
        ],
        duration_weeks: 7,
        difficulty_level: 'intermediate',
        category: 'gaming',
        featured: false,
        published: true,
        metadata: { tier: 'pro' },
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
        total_chapters: 21,
        published_chapters: 1,
        avg_chapter_duration: 90,
        image: 'https://res.cloudinary.com/dck5rzi4h/image/upload/v1752600015/ai24/workshops/ai24-course-game-development_vqhy2x.png'
      },

      // 🧠 Ethical & Philosophical (4 workshops)
      {
        id: '12',
        slug: 'ethical-ai-journalism',
        title: 'Ethical AI Journalism',
        subtitle: 'Responsible news content with AI',
        description: 'Learn to use AI responsibly in journalism and content creation. Develop ethical guidelines and fact-checking workflows for AI-assisted reporting.',
        learning_objectives: [
          'AI bias identification and mitigation',
          'Fact-checking with AI tools',
          'Ethical journalism guidelines',
          'Transparent AI reporting'
        ],
        prerequisites: [
          'Basic computer literacy',
          'Interest in journalism or media',
          'Understanding of ethical principles'
        ],
        duration_weeks: 4,
        difficulty_level: 'intermediate',
        category: 'journalism',
        featured: true,
        published: true,
        metadata: { tier: 'creator' },
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
        total_chapters: 12,
        published_chapters: 3,
        avg_chapter_duration: 45,
        image: 'https://res.cloudinary.com/dck5rzi4h/image/upload/v1752604422/ai24/workshops/ai24-course-ethical-ai-journalism_zxwrjo.png'
      },
      {
        id: '13',
        slug: 'ai-ethics-governance',
        title: 'AI Ethics & Governance',
        subtitle: 'Responsible AI development and deployment',
        description: 'Explore the ethical implications of AI development and learn to implement responsible AI practices in your organization.',
        learning_objectives: [
          'AI ethics frameworks',
          'Responsible AI development',
          'Governance and compliance',
          'Stakeholder engagement'
        ],
        prerequisites: [
          'Understanding of AI concepts',
          'Interest in ethics and governance',
          'Experience in organizational leadership'
        ],
        duration_weeks: 6,
        difficulty_level: 'advanced',
        category: 'ethics',
        featured: false,
        published: true,
        metadata: { tier: 'pro' },
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
        total_chapters: 18,
        published_chapters: 1,
        avg_chapter_duration: 75,
        image: 'https://res.cloudinary.com/dck5rzi4h/image/upload/v1752600921/ai24/workshops/ai24-course-ai-ethics-governance.png'
      },
      {
        id: '14',
        slug: 'ai-social-impact',
        title: 'AI for Social Impact',
        subtitle: 'Using AI for positive social change',
        description: 'Learn how to use AI for positive social change. Discover tools and techniques for creating AI solutions that benefit communities and address real-world challenges.',
        learning_objectives: [
          'Social impact assessment',
          'Community-centered AI design',
          'Sustainable AI solutions',
          'Impact measurement'
        ],
        prerequisites: [
          'Basic AI understanding',
          'Interest in social impact',
          'Experience with community work'
        ],
        duration_weeks: 5,
        difficulty_level: 'intermediate',
        category: 'social-impact',
        featured: false,
        published: true,
        metadata: { tier: 'creator' },
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
        total_chapters: 15,
        published_chapters: 1,
        avg_chapter_duration: 60,
        image: 'https://res.cloudinary.com/dck5rzi4h/image/upload/v1752600921/ai24/workshops/ai24-course-social-impact.png'
      },
      {
        id: '15',
        slug: 'ai-philosophy',
        title: 'AI Philosophy & Critical Thinking',
        subtitle: 'Deep dive into AI consciousness and ethics',
        description: 'Deep dive into the philosophical implications of AI. Explore consciousness, creativity, and the future of human-AI collaboration.',
        learning_objectives: [
          'AI consciousness theories',
          'Creative AI philosophy',
          'Human-AI collaboration ethics',
          'Future of AI speculation'
        ],
        prerequisites: [
          'Background in philosophy or critical thinking',
          'Understanding of AI concepts',
          'Interest in consciousness and ethics'
        ],
        duration_weeks: 4,
        difficulty_level: 'advanced',
        category: 'philosophy',
        featured: false,
        published: true,
        metadata: { tier: 'org' },
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
        total_chapters: 12,
        published_chapters: 1,
        avg_chapter_duration: 90,
        image: 'https://res.cloudinary.com/dck5rzi4h/image/upload/v1752600016/ai24/workshops/ai24-course-philosophy-criticial-thinking_kho5fr.png'
      },

      // 💼 Business & Marketing (2 workshops)
      {
        id: '16',
        slug: 'vibe-marketing',
        title: 'Vibe Marketing: AI-Powered Brand Strategy',
        subtitle: 'Create authentic brand experiences with AI',
        description: 'Master the art of vibe marketing with AI. Learn to create authentic, emotionally resonant brand experiences that connect with your audience.',
        learning_objectives: [
          'Emotional brand positioning',
          'AI-powered audience insights',
          'Authentic marketing strategies',
          'Brand voice development'
        ],
        prerequisites: [
          'Basic marketing knowledge',
          'Understanding of brand strategy',
          'Interest in emotional marketing'
        ],
        duration_weeks: 4,
        difficulty_level: 'intermediate',
        category: 'marketing',
        featured: false,
        published: true,
        metadata: { tier: 'creator' },
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
        total_chapters: 12,
        published_chapters: 1,
        avg_chapter_duration: 60,
        image: 'https://res.cloudinary.com/dck5rzi4h/image/upload/v1752600016/ai24/workshops/ai24-course-vibe-marketing_f4wruw.png'
      },
      {
        id: '19',
        slug: 'ai-music-creation',
        title: 'AI Music Creation',
        subtitle: 'Compose and produce music using artificial intelligence',
        description: 'Learn to create original music using AI tools. From composition to production, discover how artificial intelligence can enhance your musical creativity.',
        learning_objectives: [
          'AI music composition techniques',
          'Sound design with AI tools',
          'Music production workflows',
          'Creative collaboration with AI'
        ],
        prerequisites: [
          'Basic music theory knowledge',
          'Interest in music production',
          'Familiarity with digital audio concepts'
        ],
        duration_weeks: 5,
        difficulty_level: 'beginner',
        category: 'music',
        featured: false,
        published: true,
        metadata: { tier: 'creator' },
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
        total_chapters: 15,
        published_chapters: 1,
        avg_chapter_duration: 60,
        image: 'https://res.cloudinary.com/dck5rzi4h/image/upload/v1752600015/ai24/workshops/ai24-course-ai-music-creation.png'
      },
      // Use loaded data from syllabus file, fallback to hardcoded if loading fails
      aiVideoWorkshop || {
        id: '20',
        slug: 'ai-video-production',
        title: 'AI Video Production',
        subtitle: 'Produce professional videos with AI assistance',
        description: 'Master AI-powered video production techniques. Learn to create professional-quality videos using cutting-edge AI tools and workflows.',
        learning_objectives: [
          'AI video editing techniques',
          'Automated video enhancement',
          'Professional production workflows',
          'AI-powered storytelling'
        ],
        prerequisites: [
          'Basic video editing experience',
          'Understanding of video production concepts',
          'Familiarity with editing software'
        ],
        duration_weeks: 6,
        difficulty_level: 'intermediate',
        category: 'video',
        featured: false,
        published: true,
        metadata: { tier: 'creator' },
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
        total_chapters: 18,
        published_chapters: 1,
        avg_chapter_duration: 75,
        image: 'https://res.cloudinary.com/dck5rzi4h/image/upload/v1752600015/ai24/workshops/ai24-course-ai-video-production.png'
      },
      {
        id: '21',
        slug: 'ai-writing-content',
        title: 'AI Writing & Content Creation',
        subtitle: 'Write compelling content using AI writing assistants',
        description: 'Learn to create engaging content with AI writing tools. From blog posts to marketing copy, discover how AI can enhance your writing process.',
        learning_objectives: [
          'AI writing tool mastery',
          'Content strategy development',
          'SEO-optimized writing',
          'Creative content generation'
        ],
        prerequisites: [
          'Basic writing skills',
          'Understanding of content marketing',
          'Interest in digital content creation'
        ],
        duration_weeks: 4,
        difficulty_level: 'beginner',
        category: 'writing',
        featured: false,
        published: true,
        metadata: { tier: 'creator' },
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
        total_chapters: 12,
        published_chapters: 1,
        avg_chapter_duration: 45,
        image: 'https://res.cloudinary.com/dck5rzi4h/image/upload/v1752600016/ai24/workshops/ai24-course-ai-writing-content.png'
      },
      {
        id: '22',
        slug: 'ai-data-visualization',
        title: 'AI Data Visualization',
        subtitle: 'Create compelling data visualizations using AI tools',
        description: 'Transform complex data into beautiful, insightful visualizations using AI. Learn to communicate data stories effectively with AI-powered tools.',
        learning_objectives: [
          'AI-powered data analysis',
          'Interactive visualization design',
          'Data storytelling techniques',
          'Automated chart generation'
        ],
        prerequisites: [
          'Basic data analysis skills',
          'Understanding of visualization principles',
          'Familiarity with spreadsheet software'
        ],
        duration_weeks: 5,
        difficulty_level: 'intermediate',
        category: 'data',
        featured: false,
        published: true,
        metadata: { tier: 'creator' },
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
        total_chapters: 15,
        published_chapters: 1,
        avg_chapter_duration: 60,
        image: 'https://res.cloudinary.com/dck5rzi4h/image/upload/v1752600015/ai24/workshops/ai24-course-ai-data-visualization.png'
      },
      {
        id: '17',
        slug: 'smart-sign-101',
        title: 'Smart-Sign 101: Digital Signage & AI',
        subtitle: 'AI-powered digital displays and engagement',
        description: 'Learn the basics of AI-powered digital signage. Create dynamic, intelligent displays that engage and inform your audience.',
        learning_objectives: [
          'Digital signage fundamentals',
          'AI content generation for displays',
          'Audience engagement strategies',
          'Real-time content optimization'
        ],
        prerequisites: [
          'Basic computer literacy',
          'Interest in digital displays',
          'Understanding of audience engagement'
        ],
        duration_weeks: 3,
        difficulty_level: 'beginner',
        category: 'digital-signage',
        featured: false,
        published: true,
        metadata: { tier: 'free' },
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
        total_chapters: 9,
        published_chapters: 1,
        avg_chapter_duration: 45,
        image: 'https://res.cloudinary.com/dck5rzi4h/image/upload/v1752600921/ai24/workshops/ai24-course-smart-sign.png'
      },

      // 🆓 Free & Foundation (1 workshop)
      {
        id: '18',
        slug: 'ai-literacy-digital-citizenship',
        title: 'AI Literacy & Digital Citizenship',
        subtitle: 'Essential AI knowledge for everyone',
        description: 'Build your AI literacy foundation. Learn to critically evaluate AI content, understand AI capabilities, and become a responsible digital citizen in the AI age.',
        learning_objectives: [
          'AI literacy fundamentals',
          'Critical AI evaluation',
          'Digital citizenship',
          'Responsible AI usage'
        ],
        prerequisites: [
          'Basic computer literacy',
          'Internet access',
          'Curiosity about AI technology'
        ],
        duration_weeks: 3,
        difficulty_level: 'beginner',
        category: 'education',
        featured: true,
        published: true,
        metadata: { tier: 'free' },
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
        total_chapters: 9,
        published_chapters: 1,
        avg_chapter_duration: 45,
        image: 'https://res.cloudinary.com/dck5rzi4h/image/upload/v1752600014/ai24/workshops/ai24-course-ai-literacy-digital-citizenship_vlw71z.png'
      }
    ]

    // Apply filters if provided
    if (!filters) {
      return allWorkshops
    }

    return allWorkshops.filter(workshop => {
      if (filters.category && workshop.category !== filters.category) return false
      if (filters.difficulty && workshop.difficulty_level !== filters.difficulty) return false
      if (filters.featured !== undefined && workshop.featured !== filters.featured) return false
      if (filters.published !== undefined && workshop.published !== filters.published) return false
      return true
    })
  }

  /**
   * Get a specific workshop by slug or ID
   */
  async getWorkshop(slugOrId: string): Promise<WorkshopWithChapters | null> {
    const workshops = await this.getWorkshops()
    const workshop = workshops.find(w => w.slug === slugOrId || w.id === slugOrId)
    
    if (!workshop) return null

    // Convert WorkshopSummary to WorkshopWithChapters
    return {
      ...workshop,
      chapters: await this.getChapters(workshop.slug)
    }
  }

  /**
   * Get chapters for a specific workshop
   */
  async getChapters(workshopIdOrSlug: string, language: string = 'en'): Promise<Chapter[]> {
    // Try to read chapters from the filesystem
    try {
      const chaptersDir = path.join(process.cwd(), 'content', 'workshops', workshopIdOrSlug, 'chapters');
      console.log(`[getChapters] Looking for chapters in: ${chaptersDir}`);
      const files = await fs.readdir(chaptersDir);
      console.log(`[getChapters] Found files:`, files);
      const chapters: Chapter[] = [];
      for (const file of files) {
        if (!file.endsWith('.md') && !file.endsWith('.mdx')) continue;
        
        // Determine which language file to load
        let targetFile = file;
        if (language === 'es') {
          // For Spanish, look for -es.md files
          const spanishFile = file.replace(/\.(md|mdx)$/, '-es.$1');
          if (files.includes(spanishFile)) {
            targetFile = spanishFile;
          }
        } else {
          // For English, skip Spanish versions
          if (file.includes('-es.md') || file.includes('-es.mdx')) continue;
        }
        const filePath = path.join(chaptersDir, targetFile);
        const raw = await fs.readFile(filePath, 'utf8');
        const { data, content } = matter(raw);
        const chapterObj = {
          id: file,
          workshop_id: workshopIdOrSlug,
          chapter_number: data.chapter_number || parseInt(file.match(/^(\d+)/)?.[1] || '0', 10),
          title: data.title || file.replace(/\.(md|mdx)$/, ''),
          slug: file.replace(/\.(md|mdx)$/, ''),
          content_markdown: content,
          learning_objectives: data.learning_objectives || [],
          estimated_duration_minutes: data.estimated_duration || 60,
          resources: data.resources || [],
          assignments: data.assignments || [],
          published: data.published !== false,
          created_at: data.created_at || null,
          updated_at: data.updated_at || null
        };
        console.log(`[getChapters] Parsed chapter:`, chapterObj);
        chapters.push(chapterObj);
      }
      // Sort by chapter_number
      chapters.sort((a, b) => (a.chapter_number || 0) - (b.chapter_number || 0));
      console.log(`[getChapters] Returning chapters:`, chapters.map(c => c.title));
      return chapters;
    } catch (err) {
      console.error(`[getChapters] Error reading chapters for ${workshopIdOrSlug}:`, err);
      // Fallback: return empty array if directory or files are missing
      return [];
    }
  }

  /**
   * Get a specific chapter by workshop ID and chapter slug
   */
  async getChapter(workshopId: string, chapterSlug: string, language: string = 'en'): Promise<Chapter | null> {
    const chapters = await this.getChapters(workshopId, language)
    return chapters.find(c => c.slug === chapterSlug) || null
  }

  /**
   * Get processed chapter content with MDX processing
   */
  async getProcessedChapter(workshopId: string, chapterSlug: string, language: string = 'en'): Promise<Chapter | null> {
    const chapter = await this.getChapter(workshopId, chapterSlug, language)
    if (!chapter) return null

    // Import MDX processor dynamically to avoid SSR issues
    try {
      const { mdxProcessor } = await import('./mdxProcessor')
      const processed = await mdxProcessor.processChapter(workshopId, chapterSlug)
      
      if (processed) {
        return {
          ...chapter,
          content_markdown: processed.content,
          metadata: processed.metadata,
          components: processed.components,
          toc: processed.toc
        }
      }
    } catch (error) {
      console.error('Error processing MDX:', error)
    }

    // Fallback to original content if MDX processing fails
    return chapter
  }

  /**
   * Get workshop progress for a user
   */
  async getWorkshopProgress(userId: string, workshopId: string): Promise<WorkshopProgress[]> {
    // Mock progress data
    return [
      {
        id: '1',
        user_id: userId,
        workshop_id: workshopId,
        chapter_id: '1',
        status: 'completed',
        completed_at: '2025-01-15T00:00:00Z',
        time_spent_minutes: 45,
        metadata: {},
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-15T00:00:00Z'
      },
      {
        id: '2',
        user_id: userId,
        workshop_id: workshopId,
        chapter_id: '2',
        status: 'in_progress',
        completed_at: undefined,
        time_spent_minutes: 20,
        metadata: {},
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-15T00:00:00Z'
      }
    ]
  }

  /**
   * Update chapter progress for a user
   */
  async updateChapterProgress(
    userId: string,
    chapterId: string,
    status: 'not_started' | 'in_progress' | 'completed',
    timeSpent?: number
  ): Promise<void> {
    // In a real implementation, this would update Supabase
    console.log(`Updating progress for user ${userId}, chapter ${chapterId}: ${status}`)
  }

  /**
   * Search workshops by query
   */
  async searchWorkshops(query: string): Promise<WorkshopSummary[]> {
    const workshops = await this.getWorkshops()
    const lowercaseQuery = query.toLowerCase()
    
    return workshops.filter(workshop => 
      (workshop.title.toLowerCase().includes(lowercaseQuery)) ||
      ((workshop.description || '').toLowerCase().includes(lowercaseQuery)) ||
      ((workshop.subtitle || '').toLowerCase().includes(lowercaseQuery))
    )
  }

  /**
   * Get workshops by category
   */
  async getWorkshopsByCategory(category: string): Promise<WorkshopSummary[]> {
    return this.getWorkshops({ category })
  }

  /**
   * Get featured workshops
   */
  async getFeaturedWorkshops(): Promise<WorkshopSummary[]> {
    return this.getWorkshops({ featured: true })
  }
}

// Export singleton instance
export const workshopService = WorkshopService.getInstance()
