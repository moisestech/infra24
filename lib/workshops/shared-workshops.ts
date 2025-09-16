export interface Workshop {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  maxParticipants: number;
  price: number;
  instructor: string;
  prerequisites?: string[];
  materials?: string[];
  outcomes: string[];
  isActive: boolean;
  organization: string;
}

export const allWorkshops: Workshop[] = [
  {
    id: 'ai-video-basics',
    title: 'AI Video Generation Fundamentals',
    description: 'Learn the basics of AI-powered video creation using cutting-edge tools.',
    category: 'AI & Technology',
    duration: '3 hours',
    level: 'beginner',
    maxParticipants: 12,
    price: 75,
    instructor: 'AI24 Team',
    prerequisites: ['Basic computer skills'],
    materials: ['Laptop', 'Creative mindset'],
    outcomes: ['Understand AI video concepts', 'Create your first AI video', 'Know available tools'],
    isActive: true,
    organization: 'oolite'
  },
  {
    id: '3d-printing-intro',
    title: 'Introduction to 3D Printing',
    description: 'Get hands-on experience with 3D printing technology and design.',
    category: 'Digital Fabrication',
    duration: '4 hours',
    level: 'beginner',
    maxParticipants: 8,
    price: 85,
    instructor: 'Digital Lab Staff',
    prerequisites: [],
    materials: ['Design software access'],
    outcomes: ['Design 3D models', 'Operate 3D printer', 'Complete a print project'],
    isActive: true,
    organization: 'oolite'
  },
  {
    id: 'creative-coding',
    title: 'Creative Coding with Processing',
    description: 'Explore the intersection of art and code through visual programming.',
    category: 'Creative Technology',
    duration: '6 hours',
    level: 'intermediate',
    maxParticipants: 10,
    price: 95,
    instructor: 'Creative Technologist',
    prerequisites: ['Basic programming knowledge'],
    materials: ['Processing IDE', 'Laptop'],
    outcomes: ['Create generative art', 'Understand visual programming', 'Build interactive installations'],
    isActive: true,
    organization: 'oolite'
  },
  {
    id: 'digital-photography',
    title: 'Digital Photography & Editing',
    description: 'Master digital photography techniques and post-processing workflows.',
    category: 'Digital Media',
    duration: '5 hours',
    level: 'beginner',
    maxParticipants: 15,
    price: 65,
    instructor: 'Professional Photographer',
    prerequisites: [],
    materials: ['Camera (DSLR or mirrorless)', 'Laptop with editing software'],
    outcomes: ['Compose compelling photos', 'Edit and enhance images', 'Develop personal style'],
    isActive: true,
    organization: 'oolite'
  },
  {
    id: 'web-design-basics',
    title: 'Web Design for Artists',
    description: 'Learn to create beautiful, functional websites to showcase your art.',
    category: 'Web Development',
    duration: '4 hours',
    level: 'beginner',
    maxParticipants: 12,
    price: 70,
    instructor: 'Web Designer',
    prerequisites: ['Basic computer skills'],
    materials: ['Laptop', 'Design software'],
    outcomes: ['Design responsive layouts', 'Create artist portfolios', 'Understand web standards'],
    isActive: true,
    organization: 'oolite'
  },
  {
    id: 'sound-design',
    title: 'Digital Sound Design',
    description: 'Create immersive audio experiences using digital tools and techniques.',
    category: 'Audio Production',
    duration: '4 hours',
    level: 'intermediate',
    maxParticipants: 8,
    price: 80,
    instructor: 'Sound Designer',
    prerequisites: ['Basic audio knowledge'],
    materials: ['Audio editing software', 'Headphones'],
    outcomes: ['Design soundscapes', 'Edit audio professionally', 'Create immersive experiences'],
    isActive: true,
    organization: 'oolite'
  },
  {
    id: 'vr-art-creation',
    title: 'VR Art Creation',
    description: 'Explore virtual reality as a medium for artistic expression.',
    category: 'Immersive Technology',
    duration: '6 hours',
    level: 'advanced',
    maxParticipants: 6,
    price: 120,
    instructor: 'VR Artist',
    prerequisites: ['3D modeling experience'],
    materials: ['VR headset', '3D modeling software'],
    outcomes: ['Create VR artworks', 'Understand spatial design', 'Build immersive experiences'],
    isActive: true,
    organization: 'oolite'
  },
  {
    id: 'digital-printmaking',
    title: 'Digital Printmaking Techniques',
    description: 'Combine traditional printmaking with digital tools and processes.',
    category: 'Printmaking',
    duration: '5 hours',
    level: 'intermediate',
    maxParticipants: 10,
    price: 75,
    instructor: 'Printmaker',
    prerequisites: ['Basic art experience'],
    materials: ['Digital tools', 'Printing materials'],
    outcomes: ['Master digital printmaking', 'Create unique prints', 'Understand color management'],
    isActive: true,
    organization: 'oolite'
  }
];

export function getWorkshopsForOrganization(organization: string): Workshop[] {
  return allWorkshops.filter(workshop => 
    workshop.organization === organization && workshop.isActive
  );
}

export function getWorkshopCategories(): string[] {
  const categories = new Set(allWorkshops.map(workshop => workshop.category));
  return Array.from(categories).sort();
}

export function getWorkshopById(id: string): Workshop | undefined {
  return allWorkshops.find(workshop => workshop.id === id);
}

export function getWorkshopsByCategory(category: string): Workshop[] {
  return allWorkshops.filter(workshop => 
    workshop.category === category && workshop.isActive
  );
}

export function getWorkshopsByLevel(level: string): Workshop[] {
  return allWorkshops.filter(workshop => 
    workshop.level === level && workshop.isActive
  );
}