import { PresentationSlide } from '../components/presentation/ChapterPresentationMode'

interface SlideContent {
  title: string
  content: string
  subtitle?: string
  type: 'title' | 'content' | 'interactive' | 'break'
  image?: string
  notes?: string
  duration?: number
}

export function generateSlidesFromChapter(chapter: any, language: 'en' | 'es' | 'fr' = 'en'): PresentationSlide[] {
  const slides: PresentationSlide[] = []
  
  // Extract content from chapter markdown
  const content = chapter.content_markdown || ''
  
  // Split content into sections based on headers
  const sections = splitContentIntoSections(content)
  
  // Generate slides for each section
  sections.forEach((section, index) => {
    if (section.type === 'title') {
      slides.push({
        id: `title-${index}`,
        title: section.title,
        content: section.subtitle || section.content,
        type: 'title',
        duration: 10,
        notes: section.notes
      })
    } else if (section.type === 'content') {
      // Split long content into multiple slides
      const contentSlides = splitContentIntoSlides(section.content, section.title)
      contentSlides.forEach((slideContent, slideIndex) => {
        slides.push({
          id: `content-${index}-${slideIndex}`,
          title: slideContent.title,
          content: slideContent.content || '',
          type: 'content',
          duration: 15,
          notes: slideContent.notes
        })
      })
    } else if (section.type === 'interactive') {
      slides.push({
        id: `interactive-${index}`,
        title: section.title,
        content: section.content,
        type: 'interactive',
        duration: 30,
        notes: section.notes
      })
    } else if (section.type === 'break') {
      slides.push({
        id: `break-${index}`,
        title: language === 'es' ? 'Pausa' : 'Break',
        content: language === 'es' 
          ? 'Tómate un momento para reflexionar sobre lo que has aprendido hasta ahora.'
          : 'Take a moment to reflect on what you\'ve learned so far.',
        type: 'break',
        duration: 60,
        notes: 'Use this time to answer questions or discuss key points with the audience.'
      })
    }
  })
  
  return slides
}

function splitContentIntoSections(content: string): SlideContent[] {
  const sections: SlideContent[] = []
  const lines = content.split('\n')
  
  let currentSection: SlideContent | null = null
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    
    // Check for headers
    if (line.startsWith('## ')) {
      // Save previous section
      if (currentSection) {
        sections.push(currentSection)
      }
      
      // Start new section
      currentSection = {
        title: line.replace('## ', ''),
        content: '',
        type: 'content'
      }
    } else if (line.startsWith('# ')) {
      // Title slide
      if (currentSection) {
        sections.push(currentSection)
      }
      
      currentSection = {
        title: line.replace('# ', ''),
        content: '',
        type: 'title'
      }
    } else if (line.startsWith('### ')) {
      // Subsection - could be interactive
      if (currentSection) {
        const subsectionTitle = line.replace('### ', '')
        if (subsectionTitle.toLowerCase().includes('exercise') || 
            subsectionTitle.toLowerCase().includes('quiz') ||
            subsectionTitle.toLowerCase().includes('activity')) {
          currentSection.type = 'interactive'
        }
      }
    } else if (line.startsWith('---')) {
      // Break slide
      if (currentSection) {
        sections.push(currentSection)
      }
      
      sections.push({
        title: 'Break',
        content: '',
        type: 'break'
      })
      
      currentSection = null
    } else if (currentSection && line) {
      // Add content to current section
      currentSection.content += line + '\n'
    }
  }
  
  // Add final section
  if (currentSection) {
    sections.push(currentSection)
  }
  
  return sections
}

function splitContentIntoSlides(content: string, title: string): Array<{
  title: string
  content: string
  notes?: string
}> {
  const slides: Array<{
    title: string
    content: string
    notes?: string
  }> = []
  
  const lines = content.split('\n').filter(line => line.trim())
  let currentContent = ''
  
  for (const line of lines) {
    if (line.startsWith('- ') || line.startsWith('* ')) {
      // Bullet point
      currentContent += line + '\n'
    } else if (line.trim()) {
      // Regular paragraph
      currentContent += line.trim() + '\n'
    }
  }
  
  // If content is too long, split into multiple slides
  const maxLength = 500 // characters per slide
  
  if (currentContent.length > maxLength) {
    // Split content across multiple slides
    const chunks = currentContent.match(new RegExp(`.{1,${maxLength}}`, 'g')) || [currentContent]
    chunks.forEach((chunk, index) => {
      slides.push({
        title: chunks.length > 1 ? `${title} (${index + 1})` : title,
        content: chunk.trim(),
        notes: ''
      })
    })
  } else {
    // Single slide
    slides.push({
      title: title,
      content: currentContent.trim(),
      notes: ''
    })
  }
  
  return slides
}

// Predefined slide sets for specific chapters
export const aiVideoWorkshopSlides = {
  '01-introduction-to-ai-video': [
    {
      id: 'title',
      title: 'The History of AI Video',
      content: 'From Deepfakes to Dream Machines\n\n🎬',
      type: 'title' as const,
      duration: 10,
      image: '/img/ai-video-timeline-hero.jpg',
      video: 'https://stream.mux.com/your-timeline-video-id.m3u8',
      assetKey: 'title-slide',
      researchLinks: [
        {
          title: 'Generative Insights in AI: A Generative AI Video Timeline',
          url: 'https://www.briansolis.com/2024/01/generative-insights-in-ai-a-generative-ai-video-timeline-of-the-top-players/',
          type: 'article'
        },
        {
          title: 'Deepfake | History & Facts',
          url: 'https://www.britannica.com/technology/deepfake',
          type: 'article'
        },
        {
          title: 'Google answers Meta\'s video-generating AI with Imagen Video',
          url: 'https://techcrunch.com/2022/10/05/google-answers-metas-video-generating-ai-with-imagen-video/',
          type: 'article'
        }
      ],
      notes: 'Welcome everyone to our AI Video workshop. Today we\'ll explore the complete evolution of AI video technology.'
    },
    {
      id: 'learning-objectives',
      title: 'Learning Objectives',
      content: '• Understand the complete evolution of AI video from 2017-2025\n• Recognize the impact of deepfakes on public perception\n• Identify key milestones in AI video development\n• Appreciate ethical implications and responsible use\n• Learn how AI video generation actually works',
      type: 'content' as const,
      duration: 20,
      image: '/img/learning-objectives.jpg',
      notes: 'These are the key learning outcomes for this chapter. Make sure to emphasize the practical applications.'
    },
    {
      id: 'journey-begins',
      title: 'The Journey Begins',
      content: '2017: A Reddit user named "deepfakes" creates the first viral AI face-swapping videos\n\nThis moment marked the beginning of public awareness about AI video capabilities\n\nWhat started as a controversial experiment became the foundation for today\'s creative tools',
      type: 'content' as const,
      duration: 15,
      image: '/img/deepfake-origins.jpg',
      video: 'https://stream.mux.com/your-deepfake-origins-video-id.m3u8',
      assetKey: 'journey-begins',
      researchLinks: [
        {
          title: 'Deepfakes Reddit Community',
          url: 'https://www.reddit.com/r/deepfakes/',
          type: 'demo'
        },
        {
          title: 'FaceSwap: The Original Deepfake Tool',
          url: 'https://github.com/deepfakes/faceswap',
          type: 'github'
        },
        {
          title: 'The Rise of Deepfakes',
          url: 'https://www.wired.com/story/the-rise-of-deepfakes/',
          type: 'article'
        }
      ],
      notes: 'Emphasize how this seemingly small moment changed everything. The technology was there, but this made it accessible.'
    },
    {
      id: 'early-technical-approach',
      title: 'Early Technical Approach',
      content: '• GANs (Generative Adversarial Networks) for face swapping\n• Required large datasets of target faces\n• Computationally intensive training\n• Limited to face replacement only\n• No temporal consistency considerations',
      type: 'content' as const,
      duration: 15,
      image: '/img/gan-architecture.jpg',
      video: 'https://stream.mux.com/your-gan-architecture-video-id.m3u8',
      researchLinks: [
        {
          title: 'Generative Adversarial Networks',
          url: 'https://arxiv.org/abs/1406.2661',
          type: 'paper'
        },
        {
          title: 'Face Swapping with GANs',
          url: 'https://arxiv.org/abs/1802.00157',
          type: 'paper'
        },
        {
          title: 'GAN Architecture Explained',
          url: 'https://www.youtube.com/watch?v=Sw9r8CL98qI',
          type: 'video'
        }
      ],
      notes: 'Explain how GANs work: generator vs discriminator. This was the foundation that everything else built upon.'
    },
    {
      id: 'expanding-beyond-faces',
      title: 'Expanding Beyond Faces',
      content: '2019-2020: Research expands the scope\n\n• Video GANs for full video generation\n• Style transfer applied to video\n• Motion synthesis and animation\n• Beyond simple face swapping\n• Early attempts at scene generation',
      type: 'content' as const,
      duration: 15,
      image: '/img/video-gans.jpg',
      notes: 'This was when researchers realized the potential was much bigger than just face swapping.'
    },
    {
      id: 'temporal-coherence-challenge',
      title: 'The Challenge: Temporal Coherence',
      content: 'The biggest technical hurdle:\n\n• Objects must remain consistent across frames\n• Lighting and shadows must be realistic\n• Motion must follow physics\n• Characters can\'t randomly change appearance\n• Background elements must stay stable',
      type: 'content' as const,
      duration: 20,
      image: '/img/temporal-coherence.jpg',
      notes: 'This is still a major challenge today. Show examples of good vs bad temporal coherence.'
    },
    {
      id: 'text-to-video-breakthrough',
      title: 'Text-to-Video Breakthrough',
      content: '2021: First text-to-video prototypes\n\n• CogVideo by Tsinghua University\n• Video-ChatGPT integration\n• Video-CLIP connections\n• Short duration (1-2 seconds)\n• Limited quality but promising results',
      type: 'content' as const,
      duration: 15,
      image: '/img/text-to-video-early.jpg',
      notes: 'This was the first time we could describe what we wanted and get a video back. Revolutionary concept.'
    },
    {
      id: 'ai-video-mainstream',
      title: 'The Year AI Video Went Mainstream',
      content: '2023: The breakthrough year\n\n• Meta Make-A-Video (September 2022)\n• Google Imagen Video (October 2022)\n• Runway Gen-2 (March 2023)\n• Open source models democratize access\n• Quality improvements make it practical',
      type: 'content' as const,
      duration: 20,
      image: '/img/2023-breakthrough.jpg',
      notes: '2023 was when everything changed. Suddenly everyone could create AI video, not just researchers.'
    },
    {
      id: 'runway-gen2',
      title: 'Runway ML Gen-2',
      content: 'The game-changer:\n\n• First truly accessible AI video tool\n• Web-based interface\n• 1080p quality output\n• Multiple generation modes\n• Affordable subscription model\n• No technical knowledge required',
      type: 'content' as const,
      duration: 15,
      image: '/img/runway-gen2.jpg',
      video: 'https://stream.mux.com/your-runway-gen2-demo-video-id.m3u8',
      assetKey: 'runway-gen2',
      researchLinks: [
        {
          title: 'Runway Gen-2: Everything you need to know',
          url: 'https://www.pcguide.com/apps/runway-gen-2/',
          type: 'article'
        },
        {
          title: 'AI Video Pricing: Compare Runway, Synthesia & Invideo AI',
          url: 'https://research.aimultiple.com/ai-video-pricing/',
          type: 'article'
        },
        {
          title: 'Runway ML Official Site',
          url: 'https://runwayml.com/',
          type: 'demo'
        }
      ],
      notes: 'Runway Gen-2 was the iPhone moment for AI video. It made the technology accessible to everyone.'
    },
    {
      id: 'creative-adoption',
      title: 'The Creative Adoption',
      content: 'How creators embraced AI video:\n\n• Social media content creation\n• Marketing and advertising\n• Educational content\n• Prototyping and pre-visualization\n• Independent filmmaking\n• Rapid iteration and experimentation\n\n🎵 Case Study: Linkin Park\'s "Lost" music video used AI video generation',
      type: 'content' as const,
      duration: 15,
      image: '/img/creative-adoption.jpg',
      video: 'https://stream.mux.com/your-creative-adoption-video-id.m3u8',
      researchLinks: [
        {
          title: 'The Story Behind Linkin Park\'s "Lost" Music Video',
          url: 'https://phill.ai/the-story-behind-linkin-parks-lost-music-video-how-ai-brought-the-archives-to-life/',
          type: 'article'
        },
        {
          title: 'How to Generate Videos with HuggingFace ModelScope Text-to-Video',
          url: 'https://www.atlantic.net/cloud-hosting/how-to-generate-videos-with-huggingface-modelscope/',
          type: 'article'
        }
      ],
      notes: 'Show examples of how different industries started using AI video. This is where the real impact began.'
    },
    {
      id: 'quality-control-revolution',
      title: 'The Quality and Control Revolution',
      content: '2024-2025: Professional-grade tools\n\n• Runway Gen-3: Cinematic quality\n• OpenAI Sora: 60-second videos\n• Veo 3: Developer APIs\n• Higgsfield: Professional control\n• Better temporal consistency\n• More precise prompting',
      type: 'content' as const,
      duration: 20,
      image: '/img/quality-revolution.jpg',
      video: 'https://stream.mux.com/your-quality-revolution-video-id.m3u8',
      researchLinks: [
        {
          title: 'Higgsfield Camera Controls – 50+ Cinematic AI-Motion Presets',
          url: 'https://higgsfield.ai/camera-controls',
          type: 'demo'
        },
        {
          title: 'Higgsfield x Google: Bring Your AI Characters to Life with Veo 3',
          url: 'https://higgsfield.ai/posts/44H5GkMB774TpmwkzLSUbQ',
          type: 'article'
        },
        {
          title: 'Meet Firefly Video Model: AI-Powered creation with unparalleled creative control',
          url: 'https://blog.adobe.com/en/publish/2025/02/12/meet-firefly-video-model-ai-powered-creation-with-unparalleled-creative-control',
          type: 'article'
        },
        {
          title: 'Adobe\'s Sora-rivaling AI video generator is now available for everyone',
          url: 'https://www.theverge.com/news/610876/adobe-generate-video-ai-public-beta-available',
          type: 'article'
        }
      ],
      notes: 'We\'re now seeing tools that can compete with traditional video production in many areas.'
    },
    {
      id: 'technical-evolution',
      title: 'Technical Evolution: How AI Video Actually Works',
      content: 'Modern approach:\n\n• Diffusion models extended to video\n• Temporal conditioning\n• 3D neural networks\n• Attention mechanisms across time\n• Latent space manipulation\n• Multi-modal understanding',
      type: 'content' as const,
      duration: 20,
      image: '/img/diffusion-models.jpg',
      video: 'https://stream.mux.com/your-diffusion-models-video-id.m3u8',
      keyFigures: [
        {
          name: 'Ian Goodfellow',
          role: 'Creator of GANs',
          contribution: 'Invented Generative Adversarial Networks in 2014, foundational for early AI video generation',
          year: '2014',
          organization: 'Google Brain'
        },
        {
          name: 'Jonathan Ho',
          role: 'Diffusion Models Pioneer',
          contribution: 'Co-authored "Denoising Diffusion Probabilistic Models" - the foundation of modern AI video',
          year: '2020',
          organization: 'Google Research'
        }
      ],
      diagrams: [
        {
          id: 'gan-vs-diffusion',
          title: 'GAN vs Diffusion Model Architecture',
          description: 'Comparison of how GANs and Diffusion models generate video frames differently',
          type: 'comparison',
          content: 'GAN: Generator vs Discriminator\nDiffusion: Noise → Clean Image\nVideo: Temporal consistency across frames'
        },
        {
          id: 'temporal-coherence',
          title: 'Temporal Coherence in Video Generation',
          description: 'How AI models maintain consistency across video frames',
          type: 'architecture',
          content: 'Frame 1 → Frame 2 → Frame 3\nConsistent object tracking\nSmooth motion interpolation'
        }
      ],
      researchLinks: [
        {
          title: 'How to Generate Videos with HuggingFace ModelScope Text-to-Video',
          url: 'https://www.atlantic.net/cloud-hosting/how-to-generate-videos-with-huggingface-modelscope/',
          type: 'article'
        }
      ],
      notes: 'Explain the shift from GANs to diffusion models. This is the technical foundation of modern AI video.'
    },
    {
      id: 'ethical-journey',
      title: 'The Ethical Journey',
      content: 'From controversy to creative tool:\n\n• Deepfake concerns → Responsible use guidelines\n• Misinformation fears → Content provenance\n• Consent issues → Ethical frameworks\n• Copyright questions → Fair use principles\n• Transparency requirements → Disclosure standards',
      type: 'content' as const,
      duration: 20,
      image: '/img/ethical-evolution.jpg',
      notes: 'The ethical conversation has evolved significantly. We\'ve learned from the deepfake controversy.'
    },
    {
      id: 'history-lessons',
      title: 'What This History Teaches Us',
      content: 'Key insights:\n\n• Technology evolves faster than regulation\n• Accessibility drives adoption\n• Quality improvements follow accessibility\n• Ethical considerations are crucial\n• We\'re still in the early days\n• The best is yet to come',
      type: 'content' as const,
      duration: 20,
      image: '/img/history-lessons.jpg',
      notes: 'These lessons help us understand where we are and where we\'re going.'
    },
    {
      id: 'key-takeaways',
      title: 'Key Takeaways',
      content: '• AI video evolved rapidly from controversial deepfakes to creative tools\n• 2023 was the breakout year when AI video went mainstream\n• Temporal coherence remains the biggest technical challenge\n• Accessibility is as important as quality\n• Ethical considerations are essential for responsible use\n• We\'re still in the early days of this technology',
      type: 'content' as const,
      duration: 20,
      image: '/img/key-takeaways.jpg',
      notes: 'Summarize the main points. This is what students should remember.'
    },
    {
      id: 'reflection-questions',
      title: 'Reflection Questions',
      content: '• How has your perception of AI video changed?\n• What aspects seem most promising?\n• What concerns do you have?\n• How might you use AI video in your work?\n• What ethical considerations are most important to you?',
      type: 'interactive' as const,
      duration: 30,
      image: '/img/reflection.jpg',
      notes: 'Use this time for discussion. Encourage students to share their thoughts and experiences.'
    },
    {
      id: 'next-steps',
      title: 'Next Steps',
      content: 'Coming up in this workshop:\n\n• Platform landscape and tool comparison\n• Hands-on video creation exercises\n• Ethical guidelines and best practices\n• Advanced techniques and workflows\n• Real-world applications and case studies\n• Future trends and opportunities',
      type: 'content' as const,
      duration: 15,
      image: '/img/next-steps.jpg',
      notes: 'Preview what\'s coming next. Build excitement for the practical sessions.'
    }
  ],
  
  '02-ai-video-platform-landscape': [
    {
      id: 'title',
      title: 'AI Video Platform Landscape',
      content: 'Tools, Pricing, and Quality Analysis\n\n🛠️',
      type: 'title' as const,
      duration: 10,
      notes: 'Now let\'s explore the current landscape of AI video tools and understand what each platform offers.'
    },
    {
      id: 'platform-comparison',
      title: 'Platform Comparison',
      content: 'Runway ML: Professional work • 4-10s • 1080p • $12-76/month\n\nPika Labs: Social media • 3-4s • 720p • $10-20/month\n\nSynthesia: Talking heads • Up to 10min • 1080p • $30-179/month\n\nLuma Dream: Quick ideation • 4-6s • 720p • $10-30/month',
      type: 'content' as const,
      duration: 20,
      notes: 'Each platform has its strengths. Choose based on your specific needs and budget.'
    }
  ]
}

// Spanish version of slides
export const aiVideoWorkshopSlidesES = {
  '01-introduction-to-ai-video': [
    {
      id: 'title',
      title: 'La Historia del Video con IA',
      content: 'De Deepfakes a Máquinas de Sueños\n\n🎬',
      type: 'title' as const,
      duration: 10,
      image: '/img/ai-video-timeline-hero.jpg',
      notes: 'Bienvenidos a nuestro taller de Video con IA. Hoy exploraremos la evolución completa de la tecnología de video con IA.'
    },
    {
      id: 'learning-objectives',
      title: 'Objetivos de Aprendizaje',
      content: '• Comprender la evolución completa del video con IA desde 2017-2025\n• Reconocer el impacto de los deepfakes en la percepción pública\n• Identificar hitos clave en el desarrollo de video con IA\n• Apreciar las implicaciones éticas y el uso responsable\n• Aprender cómo funciona realmente la generación de video con IA',
      type: 'content' as const,
      duration: 20,
      image: '/img/learning-objectives.jpg',
      notes: 'Estos son los resultados clave de aprendizaje para este capítulo. Asegúrate de enfatizar las aplicaciones prácticas.'
    },
    {
      id: 'journey-begins',
      title: 'El Viaje Comienza',
      content: '2017: Un usuario de Reddit llamado "deepfakes" crea los primeros videos virales de intercambio de rostros con IA\n\nEste momento marcó el inicio de la conciencia pública sobre las capacidades del video con IA\n\nLo que comenzó como un experimento controvertido se convirtió en la base de las herramientas creativas de hoy',
      type: 'content' as const,
      duration: 15,
      image: '/img/deepfake-origins.jpg',
      notes: 'Enfatiza cómo este momento aparentemente pequeño cambió todo. La tecnología estaba ahí, pero esto la hizo accesible.'
    },
    {
      id: 'early-technical-approach',
      title: 'Enfoque Técnico Temprano',
      content: '• GANs (Redes Generativas Adversariales) para intercambio de rostros\n• Requería grandes conjuntos de datos de rostros objetivo\n• Entrenamiento computacionalmente intensivo\n• Limitado solo al reemplazo de rostros\n• Sin consideraciones de consistencia temporal',
      type: 'content' as const,
      duration: 15,
      image: '/img/gan-architecture.jpg',
      notes: 'Explica cómo funcionan las GANs: generador vs discriminador. Esta fue la base sobre la que todo lo demás se construyó.'
    },
    {
      id: 'expanding-beyond-faces',
      title: 'Expansión Más Allá de los Rostros',
      content: '2019-2020: La investigación expande el alcance\n\n• Video GANs para generación de video completa\n• Transferencia de estilo aplicada a video\n• Síntesis de movimiento y animación\n• Más allá del simple intercambio de rostros\n• Primeros intentos de generación de escenas',
      type: 'content' as const,
      duration: 15,
      image: '/img/video-gans.jpg',
      notes: 'Fue entonces cuando los investigadores se dieron cuenta de que el potencial era mucho mayor que solo el intercambio de rostros.'
    },
    {
      id: 'temporal-coherence-challenge',
      title: 'El Desafío: Coherencia Temporal',
      content: 'El mayor obstáculo técnico:\n\n• Los objetos deben permanecer consistentes entre frames\n• La iluminación y sombras deben ser realistas\n• El movimiento debe seguir la física\n• Los personajes no pueden cambiar de apariencia aleatoriamente\n• Los elementos de fondo deben permanecer estables',
      type: 'content' as const,
      duration: 20,
      image: '/img/temporal-coherence.jpg',
      notes: 'Este sigue siendo un desafío importante hoy. Muestra ejemplos de buena vs mala coherencia temporal.'
    },
    {
      id: 'text-to-video-breakthrough',
      title: 'Avance de Texto a Video',
      content: '2021: Primeros prototipos de texto a video\n\n• CogVideo por la Universidad de Tsinghua\n• Integración Video-ChatGPT\n• Conexiones Video-CLIP\n• Duración corta (1-2 segundos)\n• Calidad limitada pero resultados prometedores',
      type: 'content' as const,
      duration: 15,
      image: '/img/text-to-video-early.jpg',
      notes: 'Esta fue la primera vez que pudimos describir lo que queríamos y obtener un video de vuelta. Concepto revolucionario.'
    },
    {
      id: 'ai-video-mainstream',
      title: 'El Año que el Video con IA se Volvió Mainstream',
      content: '2023: El año del avance\n\n• Meta Make-A-Video (Septiembre 2022)\n• Google Imagen Video (Octubre 2022)\n• Runway Gen-2 (Marzo 2023)\n• Modelos de código abierto democratizan el acceso\n• Mejoras de calidad lo hacen práctico',
      type: 'content' as const,
      duration: 20,
      image: '/img/2023-breakthrough.jpg',
      notes: '2023 fue cuando todo cambió. De repente todos podían crear video con IA, no solo investigadores.'
    },
    {
      id: 'runway-gen2',
      title: 'Runway ML Gen-2',
      content: 'El cambio de juego:\n\n• Primera herramienta de video con IA verdaderamente accesible\n• Interfaz basada en web\n• Salida de calidad 1080p\n• Múltiples modos de generación\n• Modelo de suscripción asequible\n• Sin necesidad de conocimiento técnico',
      type: 'content' as const,
      duration: 15,
      image: '/img/runway-gen2.jpg',
      notes: 'Runway Gen-2 fue el momento iPhone para el video con IA. Hizo la tecnología accesible para todos.'
    },
    {
      id: 'creative-adoption',
      title: 'La Adopción Creativa',
      content: 'Cómo los creadores abrazaron el video con IA:\n\n• Creación de contenido para redes sociales\n• Marketing y publicidad\n• Contenido educativo\n• Prototipado y previsualización\n• Cine independiente\n• Iteración rápida y experimentación',
      type: 'content' as const,
      duration: 15,
      image: '/img/creative-adoption.jpg',
      notes: 'Muestra ejemplos de cómo diferentes industrias comenzaron a usar video con IA. Aquí es donde comenzó el verdadero impacto.'
    },
    {
      id: 'quality-control-revolution',
      title: 'La Revolución de Calidad y Control',
      content: '2024-2025: Herramientas de nivel profesional\n\n• Runway Gen-3: Calidad cinematográfica\n• OpenAI Sora: Videos de 60 segundos\n• Veo 3: APIs para desarrolladores\n• Higgsfield: Control profesional\n• Mejor consistencia temporal\n• Prompting más preciso',
      type: 'content' as const,
      duration: 20,
      image: '/img/quality-revolution.jpg',
      notes: 'Ahora estamos viendo herramientas que pueden competir con la producción de video tradicional en muchas áreas.'
    },
    {
      id: 'technical-evolution',
      title: 'Evolución Técnica: Cómo Funciona Realmente el Video con IA',
      content: 'Enfoque moderno:\n\n• Modelos de difusión extendidos a video\n• Condicionamiento temporal\n• Redes neuronales 3D\n• Mecanismos de atención a través del tiempo\n• Manipulación del espacio latente\n• Comprensión multimodal',
      type: 'content' as const,
      duration: 20,
      image: '/img/diffusion-models.jpg',
      notes: 'Explica el cambio de GANs a modelos de difusión. Esta es la base técnica del video con IA moderno.'
    },
    {
      id: 'ethical-journey',
      title: 'El Viaje Ético',
      content: 'De controversia a herramienta creativa:\n\n• Preocupaciones de deepfakes → Guías de uso responsable\n• Temores de desinformación → Proveniencia de contenido\n• Problemas de consentimiento → Marcos éticos\n• Preguntas de copyright → Principios de uso justo\n• Requisitos de transparencia → Estándares de divulgación',
      type: 'content' as const,
      duration: 20,
      image: '/img/ethical-evolution.jpg',
      notes: 'La conversación ética ha evolucionado significativamente. Hemos aprendido de la controversia de los deepfakes.'
    },
    {
      id: 'history-lessons',
      title: 'Lo que Esta Historia Nos Enseña',
      content: 'Insights clave:\n\n• La tecnología evoluciona más rápido que la regulación\n• La accesibilidad impulsa la adopción\n• Las mejoras de calidad siguen a la accesibilidad\n• Las consideraciones éticas son cruciales\n• Aún estamos en los primeros días\n• Lo mejor está por venir',
      type: 'content' as const,
      duration: 20,
      image: '/img/history-lessons.jpg',
      notes: 'Estas lecciones nos ayudan a entender dónde estamos y hacia dónde vamos.'
    },
    {
      id: 'key-takeaways',
      title: 'Puntos Clave',
      content: '• El video con IA evolucionó rápidamente de deepfakes controvertidos a herramientas creativas\n• 2023 fue el año de ruptura cuando el video con IA se volvió mainstream\n• La coherencia temporal sigue siendo el mayor desafío técnico\n• La accesibilidad es tan importante como la calidad\n• Las consideraciones éticas son esenciales para el uso responsable\n• Aún estamos en los primeros días de esta tecnología',
      type: 'content' as const,
      duration: 20,
      image: '/img/key-takeaways.jpg',
      notes: 'Resume los puntos principales. Esto es lo que los estudiantes deben recordar.'
    },
    {
      id: 'reflection-questions',
      title: 'Preguntas de Reflexión',
      content: '• ¿Cómo ha cambiado tu percepción del video con IA?\n• ¿Qué aspectos parecen más prometedores?\n• ¿Qué preocupaciones tienes?\n• ¿Cómo podrías usar video con IA en tu trabajo?\n• ¿Qué consideraciones éticas son más importantes para ti?',
      type: 'interactive' as const,
      duration: 30,
      image: '/img/reflection.jpg',
      notes: 'Usa este tiempo para discusión. Anima a los estudiantes a compartir sus pensamientos y experiencias.'
    },
    {
      id: 'next-steps',
      title: 'Próximos Pasos',
      content: 'Próximamente en este taller:\n\n• Panorama de plataformas y comparación de herramientas\n• Ejercicios prácticos de creación de video\n• Guías éticas y mejores prácticas\n• Técnicas avanzadas y flujos de trabajo\n• Aplicaciones del mundo real y casos de estudio\n• Tendencias futuras y oportunidades',
      type: 'content' as const,
      duration: 15,
      image: '/img/next-steps.jpg',
      notes: 'Vista previa de lo que viene. Genera emoción por las sesiones prácticas.'
    }
  ],
  '02-ai-video-platform-landscape': [
    {
      id: 'title',
      title: 'El Panorama de Plataformas de Video con IA',
      content: 'Herramientas, Precios y Calidad\n\n🏗️',
      type: 'title' as const,
      duration: 10,
      image: '/img/platform-landscape-hero.jpg',
      video: 'https://stream.mux.com/your-platform-landscape-video-id.m3u8',
      researchLinks: [
        {
          title: 'AI Video Pricing: Compare Runway, Synthesia & Invideo AI',
          url: 'https://research.aimultiple.com/ai-video-pricing/',
          type: 'article'
        },
        {
          title: 'Runway Gen-2: Everything you need to know',
          url: 'https://www.pcguide.com/apps/runway-gen-2/',
          type: 'article'
        }
      ],
      notes: 'Exploraremos todas las principales plataformas de video con IA y cómo elegir la adecuada para tus necesidades.'
    },
    {
      id: 'runway-ml',
      title: 'Runway ML - El Estándar Profesional',
      content: 'La plataforma más establecida:\n\n• Gen-3 Alpha: Clips de 10 segundos\n• Múltiples modos de generación\n• Motion Brush para animación selectiva\n• Edición profesional integrada\n• Acceso API para desarrolladores',
      type: 'content' as const,
      duration: 15,
      image: '/img/runway-ml.jpg',
      video: 'https://stream.mux.com/your-runway-ml-demo-video-id.m3u8',
      researchLinks: [
        {
          title: 'Runway Gen-2: Everything you need to know',
          url: 'https://www.pcguide.com/apps/runway-gen-2/',
          type: 'article'
        }
      ],
      notes: 'Runway es el "Photoshop del video con IA" - costoso pero estándar de la industria.'
    }
  ],
  '03-hands-on-ai-video-creation': [
    {
      id: 'title',
      title: 'Creación Práctica de Video con IA',
      content: 'Del Prompt a la Producción\n\n🎬',
      type: 'title' as const,
      duration: 10,
      image: '/img/hands-on-creation-hero.jpg',
      video: 'https://stream.mux.com/your-hands-on-creation-video-id.m3u8',
      researchLinks: [
        {
          title: 'How to Generate Videos with HuggingFace ModelScope Text-to-Video',
          url: 'https://www.atlantic.net/cloud-hosting/how-to-generate-videos-with-huggingface-modelscope/',
          type: 'article'
        }
      ],
      notes: 'Este capítulo es todo sobre hacer. Aprenderemos técnicas prácticas para crear mejores videos con IA.'
    },
    {
      id: 'prompt-engineering',
      title: 'Prompt Engineering para Video con IA',
      content: 'La anatomía de un buen prompt:\n\n• Sujeto + Acción + Ambiente + Estilo + Técnico\n• Lenguaje específico de movimiento\n• Especificaciones de calidad\n• Consideraciones de tiempo y coherencia',
      type: 'content' as const,
      duration: 20,
      image: '/img/prompt-engineering.jpg',
      video: 'https://stream.mux.com/your-prompt-engineering-video-id.m3u8',
      keyFigures: [
        {
          name: 'Prompt Engineering Expert',
          role: 'Especialista en Prompts',
          contribution: 'Desarrolla técnicas para crear prompts efectivos que generen resultados consistentes y de alta calidad',
          year: '2024',
          organization: 'Comunidad AI Video'
        }
      ],
      notes: 'Los prompts de video con IA son más complejos que los de imagen - necesitan considerar movimiento, tiempo y coherencia.'
    }
  ],
  '04-ethical-ai-video-creation': [
    {
      id: 'title',
      title: 'Creación Ética de Video con IA',
      content: 'Uso Responsable y Conciencia sobre Deepfakes\n\n🛡️',
      type: 'title' as const,
      duration: 10,
      image: '/img/ethical-ai-video-hero.jpg',
      video: 'https://stream.mux.com/your-ethical-ai-video-video-id.m3u8',
      researchLinks: [
        {
          title: 'AI Video Ethics Guidelines',
          url: 'https://example.com/ai-video-ethics',
          type: 'guide'
        },
        {
          title: 'Deepfake Detection Tools',
          url: 'https://example.com/deepfake-detection',
          type: 'tools'
        }
      ],
      notes: 'Este capítulo cubre consideraciones éticas críticas para la creación de video con IA. Comprender estos principios es esencial para el uso responsable.'
    },
    {
      id: 'ethical-framework',
      title: 'Marco Ético para Video con IA',
      content: 'Los Cuatro Pilares:\n\n• Consentimiento y Permiso\n• Transparencia y Divulgación\n• Verdad y Precisión\n• Prevención de Daño',
      type: 'content' as const,
      duration: 20,
      image: '/img/ethical-framework.jpg',
      video: 'https://stream.mux.com/your-ethical-framework-video-id.m3u8',
      keyFigures: [
        {
          name: 'Ética en IA',
          role: 'Especialista en Ética',
          contribution: 'Desarrolla marcos éticos para el uso responsable de tecnologías de IA',
          year: '2024',
          organization: 'Comunidad de Ética en IA'
        }
      ],
      notes: 'Estos cuatro pilares proporcionan una base sólida para la creación ética de video con IA.'
    }
  ],
  '05-advanced-techniques-workflows': [
    {
      id: 'title',
      title: 'Técnicas Avanzadas y Flujos de Trabajo',
      content: 'Producción Profesional de Video con IA\n\n⚙️',
      type: 'title' as const,
      duration: 10,
      image: '/img/advanced-techniques-hero.jpg',
      video: 'https://stream.mux.com/your-advanced-techniques-video-id.m3u8',
      researchLinks: [
        {
          title: 'Professional AI Video Workflows',
          url: 'https://example.com/ai-video-workflows',
          type: 'guide'
        },
        {
          title: 'Advanced Prompt Engineering',
          url: 'https://example.com/advanced-prompts',
          type: 'library'
        }
      ],
      notes: 'Este capítulo cubre técnicas avanzadas para producción profesional de video con IA, incluyendo optimización de flujos de trabajo e integración multi-herramienta.'
    },
    {
      id: 'multi-tool-approach',
      title: 'Enfoque Multi-Herramienta',
      content: 'Estrategia de Selección:\n\n• Herramienta Principal: Basada en calidad, presupuesto, capacidades\n• Herramientas Secundarias: Características específicas, respaldo\n• Herramientas de Apoyo: Edición tradicional, audio, gestión',
      type: 'content' as const,
      duration: 20,
      image: '/img/multi-tool-approach.jpg',
      video: 'https://stream.mux.com/your-multi-tool-video-id.m3u8',
      notes: 'La producción profesional a menudo involucra combinar múltiples herramientas para lograr los mejores resultados.'
    }
  ],
  '06-real-world-applications': [
    {
      id: 'title',
      title: 'Aplicaciones del Mundo Real',
      content: 'Video con IA en Acción\n\n🌍',
      type: 'title' as const,
      duration: 10,
      image: '/img/real-world-applications-hero.jpg',
      video: 'https://stream.mux.com/your-real-world-applications-video-id.m3u8',
      researchLinks: [
        {
          title: 'AI Video Case Study Library',
          url: 'https://example.com/ai-video-cases',
          type: 'library'
        },
        {
          title: 'Industry Applications Guide',
          url: 'https://example.com/ai-video-industries',
          type: 'guide'
        }
      ],
      notes: 'Este capítulo explora aplicaciones del mundo real de la tecnología de video con IA en diferentes industrias.'
    },
    {
      id: 'industry-transformation',
      title: 'Transformación Industrial',
      content: 'Industrias Transformadas:\n\n• Entretenimiento y Medios\n• Educación y Entrenamiento\n• Marketing y Publicidad\n• Salud y Medicina',
      type: 'content' as const,
      duration: 20,
      image: '/img/industry-transformation.jpg',
      video: 'https://stream.mux.com/your-industry-transformation-video-id.m3u8',
      notes: 'El video con IA está transformando múltiples industrias, creando nuevas posibilidades y oportunidades.'
    }
  ],
  '07-future-of-ai-video': [
    {
      id: 'title',
      title: 'El Futuro del Video con IA',
      content: 'Tendencias, Predicciones y Oportunidades\n\n🚀',
      type: 'title' as const,
      duration: 10,
      image: '/img/future-ai-video-hero.jpg',
      video: 'https://stream.mux.com/your-future-ai-video-video-id.m3u8',
      researchLinks: [
        {
          title: 'AI Video Research and Development',
          url: 'https://example.com/ai-video-research',
          type: 'research'
        },
        {
          title: 'Future Technology Predictions',
          url: 'https://example.com/ai-video-future',
          type: 'analysis'
        }
      ],
      notes: 'Este capítulo explora el futuro de la tecnología de video con IA, incluyendo tendencias emergentes y predicciones tecnológicas.'
    },
    {
      id: 'emerging-trends',
      title: 'Tendencias Emergentes',
      content: 'Desarrollos Futuros:\n\n• Generación de Video Más Larga\n• Generación en Tiempo Real\n• Control y Personalización Mejorados\n• Mejoras de Calidad y Resolución',
      type: 'content' as const,
      duration: 20,
      image: '/img/emerging-trends.jpg',
      video: 'https://stream.mux.com/your-emerging-trends-video-id.m3u8',
      notes: 'La tecnología de video con IA está evolucionando a un ritmo sin precedentes.'
    }
  ],
  '09-ai-video-in-gaming': [
    {
      id: 'title',
      title: 'Video con IA en Juegos',
      content: 'De Cutscenes a Generación en Tiempo Real\n\n🎮',
      type: 'title' as const,
      duration: 10,
      image: '/img/ai-video-gaming-hero.jpg',
      video: 'https://stream.mux.com/your-ai-video-gaming-video-id.m3u8',
      researchLinks: [
        {
          title: 'NVIDIA ACE Developer Guide',
          url: 'https://developer.nvidia.com/ace',
          type: 'guide'
        },
        {
          title: 'Unity AI Tools Documentation',
          url: 'https://unity.com/ai',
          type: 'guide'
        },
        {
          title: 'Inworld Character Development',
          url: 'https://inworld.ai',
          type: 'guide'
        }
      ],
      notes: 'Este capítulo explora las aplicaciones innovadoras de video con IA en la industria de los videojuegos, desde cutscenes generadas por IA hasta animación de personajes en tiempo real.'
    },
    {
      id: 'cutscenes-trailers',
      title: 'Cutscenes y Trailers Generados por IA',
      content: 'Revolucionando las Cinemáticas de Juegos:\n\n• Generación de Trailers: Contenido promocional sin activos completos\n• Secuencias de Historia: Cutscenes narrativas con modelos consistentes\n• Materiales de Marketing: Teasers y videos promocionales a escala',
      type: 'content' as const,
      duration: 20,
      image: '/img/ai-cutscenes-gaming.jpg',
      video: 'https://stream.mux.com/your-ai-cutscenes-video-id.m3u8',
      assetKey: 'leo-castaneda',
      keyFigures: [
        {
          name: 'Leo Castaneda',
          role: 'Artista Conceptual de Juegos',
          contribution: 'Pionero en el uso de video con IA para desarrollo conceptual de juegos',
          year: '2024',
          organization: 'Desarrollador Indie'
        }
      ],
      notes: 'La generación de cutscenes con IA está transformando cómo los desarrolladores crean contenido cinematográfico para juegos.'
    },
    {
      id: 'character-animation',
      title: 'Animación de Personajes y Movimiento Facial',
      content: 'NVIDIA ACE y Inworld AI:\n\n• Animación Facial en Tiempo Real: Impulsada por entrada de voz\n• Procesamiento de Lenguaje Natural: Respuestas naturales de personajes\n• Modelado de Estado Emocional: Expresiones auténticas\n• NPCs Dinámicos: Personalidades que evolucionan con el jugador',
      type: 'content' as const,
      duration: 25,
      image: '/img/character-animation-ai.jpg',
      video: 'https://stream.mux.com/your-character-animation-video-id.m3u8',
      assetKey: 'nvidia-ace',
      diagrams: [
        {
          id: 'nvidia-ace-architecture',
          title: 'Arquitectura de NVIDIA ACE',
          description: 'Sistema de procesamiento en la nube para animación de personajes con IA',
          type: 'architecture',
          image: '/img/nvidia-ace-architecture.jpg'
        }
      ],
      notes: 'Las herramientas como NVIDIA ACE están permitiendo personajes de juego verdaderamente interactivos con emociones y respuestas naturales.'
    },
    {
      id: 'real-time-generation',
      title: 'Generación de Video en Tiempo Real',
      content: 'Lo que Tiempo Real Significa en la Práctica:\n\n• Activos Pre-Generados: Cutscenes procedimentales durante desarrollo\n• Generación en Vivo: Animaciones para personajes no críticos\n• Efectos Dinámicos: Clima e iluminación procedimentales\n• Optimización de Rendimiento: LOD y sistemas de caché',
      type: 'content' as const,
      duration: 20,
      image: '/img/real-time-ai-generation.jpg',
      video: 'https://stream.mux.com/your-real-time-generation-video-id.m3u8',
      notes: 'La generación en tiempo real está abriendo nuevas posibilidades para gameplay dinámico y narrativa adaptativa.'
    },
    {
      id: 'indie-developer-success',
      title: 'Historias de Éxito de Desarrolladores Indie',
      content: 'Ventajas de Equipos Pequeños:\n\n• Iteración Rápida: Experimentación con conceptos de juegos\n• Prototipado Rentable: Elementos cinematográficos de bajo costo\n• Libertad Creativa: Exploración artística sin restricciones corporativas\n• Construcción de Comunidad: Contenido generado por IA para engagement',
      type: 'content' as const,
      duration: 20,
      image: '/img/indie-developer-ai.jpg',
      video: 'https://stream.mux.com/your-indie-developer-video-id.m3u8',
      notes: 'Los desarrolladores indie están liderando la innovación en el uso de video con IA para juegos.'
    },
    {
      id: 'aaa-studio-integration',
      title: 'Integración de Estudios AAA',
      content: 'Unity y Unreal Engine:\n\n• Unity: Herramientas nativas de IA, pipeline de activos, optimización\n• Unreal Engine: Renderizado de alta fidelidad, ray tracing, sistemas de materiales\n• Flujos de Trabajo de Producción: Herramientas cinematográficas, sistemas de animación\n• Optimización de Rendimiento: Para integración de IA en tiempo real',
      type: 'content' as const,
      duration: 25,
      image: '/img/aaa-studio-integration.jpg',
      video: 'https://stream.mux.com/your-aaa-integration-video-id.m3u8',
      diagrams: [
        {
          id: 'game-engine-integration',
          title: 'Integración con Motores de Juego',
          description: 'Flujo de trabajo para integrar video con IA en Unity y Unreal Engine',
          type: 'workflow',
          image: '/img/game-engine-integration.jpg'
        }
      ],
      notes: 'Los estudios AAA están integrando video con IA en sus pipelines de producción existentes.'
    },
    {
      id: 'tools-platforms',
      title: 'Herramientas y Plataformas',
      content: 'Ecosistema de Herramientas de IA para Juegos:\n\n• Animación de Personajes: NVIDIA ACE, Inworld, Ready Player Me\n• Generación Ambiental: Runway Gen-3, Pika Labs, Stable Video Diffusion\n• Integración: Unity AI Tools, Unreal Engine Plugins, APIs personalizadas\n• Mejores Prácticas: Gestión de activos, control de calidad, cumplimiento legal',
      type: 'content' as const,
      duration: 20,
      image: '/img/ai-gaming-tools.jpg',
      video: 'https://stream.mux.com/your-ai-gaming-tools-video-id.m3u8',
      notes: 'El ecosistema de herramientas de IA para juegos está madurando rápidamente.'
    },
    {
      id: 'future-opportunities',
      title: 'Tendencias Futuras y Oportunidades',
      content: 'Próxima Generación de Video con IA:\n\n• Generación en Tiempo Real: 60fps para gameplay\n• Personajes Interactivos: Rango emocional completo\n• Narrativa Procedimental: Adaptación a elecciones del jugador\n• Nuevas Carreras: Especialistas en Video con IA, Artistas Procedimentales',
      type: 'content' as const,
      duration: 20,
      image: '/img/future-gaming-ai.jpg',
      video: 'https://stream.mux.com/your-future-gaming-video-id.m3u8',
      notes: 'El futuro del video con IA en juegos promete experiencias más inmersivas y dinámicas.'
    },
    {
      id: 'practical-exercises',
      title: 'Ejercicios Prácticos',
      content: 'Proyectos de Aplicación:\n\n• Ejercicio 1: Trailer de Juego Generado por IA (30 segundos)\n• Ejercicio 2: Interacción de Personaje con IA (NPC dinámico)\n• Ejercicio 3: Video Ambiental Procedimental (secuencias dinámicas)\n• Documentación: Proceso y lecciones aprendidas',
      type: 'interactive' as const,
      duration: 30,
      image: '/img/gaming-practical-exercises.jpg',
      video: 'https://stream.mux.com/your-gaming-exercises-video-id.m3u8',
      notes: 'Estos ejercicios prácticos te permitirán aplicar conceptos de video con IA en desarrollo de juegos.'
    }
  ],
  '08-your-ai-video-journey': [
    {
      id: 'title',
      title: 'Tu Viaje de Video con IA',
      content: 'Próximos Pasos y Recursos\n\n🧭',
      type: 'title' as const,
      duration: 10,
      image: '/img/ai-video-journey-hero.jpg',
      video: 'https://stream.mux.com/your-ai-video-journey-video-id.m3u8',
      researchLinks: [
        {
          title: 'AI Video Learning Resources',
          url: 'https://example.com/ai-video-resources',
          type: 'library'
        },
        {
          title: 'Community and Networking',
          url: 'https://example.com/ai-video-community',
          type: 'community'
        }
      ],
      notes: '¡Felicidades! Has completado el taller de Dominio de Video con IA. Este capítulo final te ayudará a planificar tus próximos pasos.'
    },
    {
      id: 'action-plan',
      title: 'Plan de Acción Personal',
      content: 'Metas y Hitos:\n\n• Metas a Corto Plazo (3 meses)\n• Metas a Mediano Plazo (3-12 meses)\n• Metas a Largo Plazo (1-5 años)\n• Recursos y Comunidades',
      type: 'content' as const,
      duration: 20,
      image: '/img/action-plan.jpg',
      video: 'https://stream.mux.com/your-action-plan-video-id.m3u8',
      notes: 'Crea un plan de acción personal para tu viaje continuo de video con IA.'
    }
  ]
}
