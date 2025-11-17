const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseKey) {
  console.log('❌ SUPABASE_SERVICE_ROLE_KEY not found');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function enableOoliteWorkshopLearnContent() {
  console.log('🎓 Enabling learn content for Oolite workshops...');
  
  // Workshop IDs from the API response
  const ownYourDigitalPresenceId = '6ec503ab-7292-4459-95d1-7cf45ce95748';
  const seoWorkshopId = '11195c3d-37c2-4994-a8ce-615c68f45126';
  
  // Enable learn content for "Own Your Digital Presence"
  console.log('📚 Enabling learn content for "Own Your Digital Presence"...');
  const { data: updateData, error: updateError } = await supabase
    .from('workshops')
    .update({
      has_learn_content: true,
      course_available: true,
      estimated_learn_time: 180, // 3 hours
      learn_difficulty: 'beginner',
      learn_prerequisites: ['No prior experience required', 'Basic computer skills helpful'],
      learn_materials: ['Laptop or tablet', 'Notebook and pen', 'Internet connection'],
      learn_syllabus: {
        overview: 'Learn how to create a professional online presence that showcases your work effectively.',
        objectives: [
          'Create professional portfolio',
          'Optimize online presence', 
          'Build personal brand',
          'Understand digital marketing basics'
        ],
        modules: [
          {
            title: 'Introduction to Digital Presence',
            duration: 30,
            topics: ['What is digital presence', 'Why it matters', 'Setting goals']
          },
          {
            title: 'Portfolio Creation',
            duration: 60,
            topics: ['Choosing a platform', 'Content organization', 'Visual design']
          },
          {
            title: 'Brand Building',
            duration: 60,
            topics: ['Personal branding', 'Consistent messaging', 'Visual identity']
          },
          {
            title: 'Optimization & Growth',
            duration: 30,
            topics: ['SEO basics', 'Social media integration', 'Analytics']
          }
        ]
      }
    })
    .eq('id', ownYourDigitalPresenceId);
    
  if (updateError) {
    console.error('❌ Error updating workshop:', updateError);
    return;
  }
  
  console.log('✅ Learn content enabled for "Own Your Digital Presence"');
  
  // Create chapters for "Own Your Digital Presence"
  console.log('📖 Creating chapters for "Own Your Digital Presence"...');
  
  const chapters = [
    {
      workshop_id: ownYourDigitalPresenceId,
      slug: 'introduction-to-digital-presence',
      title: 'Introduction to Digital Presence',
      content: `# Introduction to Digital Presence

Welcome to the "Own Your Digital Presence" workshop! In this first chapter, we'll explore what digital presence means and why it's crucial for artists and professionals.

## What is Digital Presence?

Your digital presence is how you appear online across all platforms and touchpoints. It includes:

- Your website or portfolio
- Social media profiles
- Professional networks
- Online publications and mentions
- Search engine results

## Why Digital Presence Matters

A strong digital presence helps you:

1. **Build Credibility**: Showcase your work professionally
2. **Reach More People**: Expand your audience beyond local connections
3. **Control Your Narrative**: Tell your story the way you want it told
4. **Create Opportunities**: Attract clients, collaborators, and opportunities

## Setting Your Goals

Before we dive into the technical aspects, let's establish clear goals for your digital presence:

- What do you want to achieve?
- Who is your target audience?
- What impression do you want to make?
- How will you measure success?

## Next Steps

In the following chapters, we'll cover:
- Portfolio creation and optimization
- Brand building strategies
- Growth and optimization techniques

Let's get started on building your professional digital presence!`,
      order_index: 1,
      estimated_duration: 30,
      is_premium: false,
      metadata: {
        type: 'introduction',
        difficulty: 'beginner',
        learning_objectives: [
          'Understand what digital presence means',
          'Identify the benefits of a strong online presence',
          'Set clear goals for your digital presence'
        ]
      }
    },
    {
      workshop_id: ownYourDigitalPresenceId,
      slug: 'portfolio-creation',
      title: 'Portfolio Creation',
      content: `# Portfolio Creation

Your portfolio is the centerpiece of your digital presence. In this chapter, we'll explore how to create a compelling portfolio that showcases your work effectively.

## Choosing the Right Platform

There are several options for creating your portfolio:

### Website Builders
- **Squarespace**: Great for artists, beautiful templates
- **Wix**: User-friendly, lots of customization
- **WordPress**: Maximum flexibility, requires more technical knowledge

### Portfolio-Specific Platforms
- **Behance**: Adobe's platform, great for creative professionals
- **Dribbble**: Popular among designers
- **ArtStation**: Focused on digital art and entertainment

### Custom Solutions
- **Webflow**: Design-focused, code-free
- **Framer**: Modern, interactive designs

## Content Organization

### Structure Your Portfolio
1. **Homepage**: Clear introduction and featured work
2. **About**: Your story, background, and approach
3. **Work/Portfolio**: Organized by project or category
4. **Contact**: Easy ways to reach you
5. **Blog/News**: Optional, for sharing updates

### Project Presentation
For each project, include:
- High-quality images or videos
- Project description and context
- Your role and contributions
- Tools and techniques used
- Results or outcomes

## Visual Design Principles

### Consistency
- Use a consistent color palette
- Maintain typography hierarchy
- Keep layout patterns consistent

### Navigation
- Make it easy to find information
- Use clear, descriptive labels
- Include a search function for larger portfolios

### Mobile Responsiveness
- Ensure your portfolio looks great on all devices
- Test on different screen sizes
- Optimize images for fast loading

## Best Practices

1. **Quality over Quantity**: Show your best work, not everything
2. **Tell a Story**: Each project should have context and narrative
3. **Keep it Updated**: Regularly add new work and remove outdated pieces
4. **Make it Personal**: Let your personality shine through
5. **Include Contact Information**: Make it easy for people to reach you

## Next Steps

In the next chapter, we'll explore how to build a consistent brand that supports your portfolio and overall digital presence.`,
      order_index: 2,
      estimated_duration: 60,
      is_premium: false,
      metadata: {
        type: 'practical',
        difficulty: 'beginner',
        learning_objectives: [
          'Choose the right platform for your portfolio',
          'Organize content effectively',
          'Apply visual design principles',
          'Implement best practices for portfolio creation'
        ]
      }
    },
    {
      workshop_id: ownYourDigitalPresenceId,
      slug: 'brand-building',
      title: 'Brand Building',
      content: `# Brand Building

Your personal brand is what people think and feel when they encounter your work. In this chapter, we'll explore how to build a consistent, authentic brand that supports your digital presence.

## What is Personal Branding?

Personal branding is the practice of marketing yourself and your career as brands. It involves:

- **Identity**: Who you are and what you stand for
- **Image**: How you present yourself visually
- **Voice**: How you communicate and express yourself
- **Values**: What you believe in and support

## Defining Your Brand

### Core Elements

1. **Mission Statement**: What you do and why
2. **Vision**: Where you want to be in the future
3. **Values**: What principles guide your work
4. **Unique Value Proposition**: What makes you different

### Brand Personality
Consider these dimensions:
- **Professional vs. Casual**: How formal should your brand be?
- **Traditional vs. Innovative**: Are you classic or cutting-edge?
- **Individual vs. Collaborative**: Do you work alone or with others?
- **Local vs. Global**: What's your geographic focus?

## Visual Identity

### Logo and Mark
- Create a simple, memorable logo
- Ensure it works at different sizes
- Consider how it represents your work

### Color Palette
- Choose 2-3 primary colors
- Consider color psychology
- Ensure accessibility and readability

### Typography
- Select 1-2 fonts that reflect your personality
- Ensure readability across platforms
- Maintain consistency in usage

### Photography Style
- Develop a consistent style for your photos
- Consider lighting, composition, and editing
- Use professional headshots when appropriate

## Brand Voice and Messaging

### Tone of Voice
- **Professional**: Authoritative, knowledgeable, reliable
- **Friendly**: Approachable, warm, personable
- **Creative**: Innovative, artistic, expressive
- **Expert**: Confident, specialized, experienced

### Key Messages
Develop 3-5 key messages that you want people to remember:
1. What you do
2. How you do it differently
3. Why it matters
4. Who you serve
5. What results you deliver

## Consistency Across Platforms

### Website
- Use your brand colors, fonts, and imagery
- Maintain consistent messaging
- Include your logo and contact information

### Social Media
- Use consistent profile photos and bios
- Apply your brand colors to graphics
- Maintain your tone of voice in posts

### Business Materials
- Business cards, letterhead, and proposals
- Email signatures and templates
- Presentation materials

## Building Brand Awareness

### Content Strategy
- Share your work regularly
- Provide value through tips and insights
- Tell your story and journey
- Engage with your community

### Networking
- Attend industry events
- Join professional organizations
- Connect with peers and mentors
- Collaborate with others

### Thought Leadership
- Write articles or blog posts
- Speak at events or workshops
- Share your expertise on social media
- Mentor others in your field

## Measuring Brand Success

### Metrics to Track
- Website traffic and engagement
- Social media followers and engagement
- Inquiries and opportunities
- Speaking or collaboration requests
- Media mentions or features

### Regular Review
- Assess your brand perception quarterly
- Update your messaging as you grow
- Refine your visual identity as needed
- Stay true to your core values

## Next Steps

In the final chapter, we'll explore how to optimize your digital presence for growth and measure your success.`,
      order_index: 3,
      estimated_duration: 60,
      is_premium: false,
      metadata: {
        type: 'strategic',
        difficulty: 'intermediate',
        learning_objectives: [
          'Define your personal brand identity',
          'Develop a consistent visual identity',
          'Create a brand voice and messaging strategy',
          'Implement brand consistency across platforms',
          'Build brand awareness and measure success'
        ]
      }
    },
    {
      workshop_id: ownYourDigitalPresenceId,
      slug: 'optimization-and-growth',
      title: 'Optimization & Growth',
      content: `# Optimization & Growth

Now that you have a strong foundation, let's explore how to optimize your digital presence for growth and measure your success.

## SEO Basics for Artists

### Keyword Research
- Identify terms people use to find your type of work
- Use tools like Google Keyword Planner
- Focus on long-tail keywords (more specific phrases)
- Consider local SEO if you serve a specific area

### On-Page Optimization
- Use relevant keywords in your content
- Optimize image alt text and file names
- Create descriptive page titles and meta descriptions
- Use header tags (H1, H2, H3) to structure content

### Technical SEO
- Ensure your website loads quickly
- Make it mobile-friendly
- Use clean, semantic HTML
- Submit your sitemap to Google Search Console

## Social Media Integration

### Platform Strategy
- **Instagram**: Visual storytelling, behind-the-scenes content
- **LinkedIn**: Professional networking, industry insights
- **Twitter**: Real-time updates, industry conversations
- **TikTok**: Creative, engaging short-form content
- **YouTube**: Tutorials, process videos, longer-form content

### Content Planning
- Create a content calendar
- Mix different types of content (work, process, personal)
- Use relevant hashtags
- Engage with your audience regularly

### Cross-Platform Promotion
- Share your website content on social media
- Include social media links on your website
- Use consistent branding across all platforms
- Cross-promote between platforms

## Analytics and Measurement

### Website Analytics
- **Google Analytics**: Track visitors, behavior, and conversions
- **Google Search Console**: Monitor search performance
- **Heat mapping tools**: Understand user behavior
- **Conversion tracking**: Measure goal completions

### Key Metrics to Track
- **Traffic**: Unique visitors, page views, session duration
- **Engagement**: Bounce rate, pages per session, time on site
- **Conversions**: Contact form submissions, email signups
- **Search Performance**: Rankings, click-through rates

### Social Media Analytics
- **Follower Growth**: Track your audience growth
- **Engagement Rate**: Likes, comments, shares relative to followers
- **Reach and Impressions**: How many people see your content
- **Click-through Rate**: How many people click your links

## Growth Strategies

### Content Marketing
- **Blog Posts**: Share insights, tutorials, and industry thoughts
- **Case Studies**: Show your process and results
- **Video Content**: Tutorials, process videos, client testimonials
- **Podcasts**: Share your expertise through audio content

### Email Marketing
- **Newsletter**: Regular updates to your audience
- **Automated Sequences**: Welcome series for new subscribers
- **Segmentation**: Different content for different audience groups
- **Personalization**: Use names and preferences in emails

### Networking and Collaboration
- **Industry Events**: Attend conferences, workshops, and meetups
- **Online Communities**: Participate in relevant forums and groups
- **Collaborations**: Work with other artists and professionals
- **Mentorship**: Both giving and receiving mentorship

### Paid Promotion
- **Social Media Ads**: Promote your best content
- **Google Ads**: Target people searching for your services
- **Influencer Partnerships**: Collaborate with relevant influencers
- **Sponsored Content**: Partner with brands and publications

## Automation and Tools

### Content Management
- **Scheduling Tools**: Hootsuite, Buffer, Later
- **Design Tools**: Canva, Adobe Creative Suite
- **Analytics Tools**: Google Analytics, Facebook Insights
- **Email Marketing**: Mailchimp, ConvertKit, Constant Contact

### Workflow Optimization
- **Templates**: Create reusable templates for common tasks
- **Batch Content Creation**: Create multiple pieces at once
- **Automated Responses**: Set up auto-replies for common inquiries
- **CRM Systems**: Track leads and client relationships

## Measuring Success

### Setting Goals
- **SMART Goals**: Specific, Measurable, Achievable, Relevant, Time-bound
- **Short-term**: Monthly or quarterly objectives
- **Long-term**: Annual or multi-year goals
- **Regular Review**: Assess progress monthly

### Key Performance Indicators (KPIs)
- **Website Traffic**: Monthly unique visitors
- **Lead Generation**: Number of inquiries per month
- **Conversion Rate**: Percentage of visitors who take desired action
- **Brand Awareness**: Mentions, shares, and recognition

### Continuous Improvement
- **A/B Testing**: Test different approaches and measure results
- **Feedback Collection**: Ask clients and audience for input
- **Competitor Analysis**: Monitor what others in your field are doing
- **Industry Trends**: Stay updated on new tools and strategies

## Conclusion

Building a strong digital presence is an ongoing process that requires consistent effort and adaptation. By implementing the strategies covered in this workshop, you'll be well-equipped to:

- Create a professional portfolio that showcases your work
- Build a consistent brand that resonates with your audience
- Optimize your presence for growth and visibility
- Measure your success and continuously improve

Remember, your digital presence is a reflection of your professional identity. Invest time in making it authentic, valuable, and engaging for your target audience.

## Next Steps

1. **Audit Your Current Presence**: Review all your online profiles and content
2. **Create an Action Plan**: Prioritize the improvements you want to make
3. **Set Up Analytics**: Start tracking your key metrics
4. **Begin Implementation**: Start with the most impactful changes
5. **Schedule Regular Reviews**: Set aside time monthly to assess and adjust

Good luck with building your digital presence!`,
      order_index: 4,
      estimated_duration: 30,
      is_premium: false,
      metadata: {
        type: 'advanced',
        difficulty: 'intermediate',
        learning_objectives: [
          'Implement SEO best practices for artists',
          'Integrate social media effectively',
          'Set up analytics and tracking',
          'Develop growth strategies',
          'Measure and optimize performance'
        ]
      }
    }
  ];
  
  // Insert chapters
  const { data: chapterData, error: chapterError } = await supabase
    .from('chapters')
    .insert(chapters);
    
  if (chapterError) {
    console.error('❌ Error creating chapters:', chapterError);
    return;
  }
  
  console.log('✅ Created 4 chapters for "Own Your Digital Presence"');
  
  // Now create chapters for the SEO Workshop
  console.log('📖 Creating chapters for "SEO Workshop"...');
  
  const seoChapters = [
    {
      workshop_id: seoWorkshopId,
      slug: 'seo-fundamentals',
      title: 'SEO Fundamentals',
      content: `# SEO Fundamentals

Welcome to the SEO Workshop! In this first chapter, we'll cover the essential concepts of Search Engine Optimization and why it matters for your digital presence.

## What is SEO?

Search Engine Optimization (SEO) is the practice of optimizing your website and content to rank higher in search engine results pages (SERPs). The goal is to increase organic (non-paid) traffic to your website.

## How Search Engines Work

### Crawling
Search engines use automated programs called "crawlers" or "spiders" to discover and index web pages.

### Indexing
Once crawled, pages are stored in a massive database called an "index."

### Ranking
When someone searches, the search engine uses algorithms to determine which pages best match the query and ranks them accordingly.

## Key SEO Concepts

### Keywords
- **Primary Keywords**: Main terms you want to rank for
- **Long-tail Keywords**: More specific, less competitive phrases
- **Semantic Keywords**: Related terms and synonyms
- **Local Keywords**: Location-based search terms

### On-Page SEO
- **Title Tags**: The clickable headline in search results
- **Meta Descriptions**: Brief descriptions that appear under titles
- **Header Tags**: H1, H2, H3 structure for content organization
- **Image Alt Text**: Descriptions for images
- **Internal Linking**: Links between pages on your site

### Off-Page SEO
- **Backlinks**: Links from other websites to yours
- **Social Signals**: Social media engagement and sharing
- **Local Citations**: Mentions of your business in directories
- **Brand Mentions**: References to your brand online

## SEO Benefits

1. **Increased Visibility**: More people can find your content
2. **Targeted Traffic**: Attract visitors interested in your topic
3. **Cost-Effective**: Organic traffic is free (unlike paid ads)
4. **Long-term Results**: SEO efforts compound over time
5. **Credibility**: Higher rankings can increase trust

## Common SEO Mistakes

- **Keyword Stuffing**: Overusing keywords unnaturally
- **Duplicate Content**: Having identical content on multiple pages
- **Poor Site Structure**: Confusing navigation and organization
- **Slow Loading Times**: Pages that take too long to load
- **Mobile Unfriendly**: Sites that don't work well on mobile devices

## Getting Started

1. **Audit Your Current Site**: Use tools to identify issues
2. **Research Keywords**: Find terms your audience searches for
3. **Optimize Existing Content**: Improve what you already have
4. **Create Quality Content**: Develop valuable, relevant content
5. **Build Authority**: Earn backlinks and mentions

## Next Steps

In the next chapter, we'll dive deeper into keyword research and how to find the right terms to target for your content.`,
      order_index: 1,
      estimated_duration: 30,
      is_premium: false,
      metadata: {
        type: 'introduction',
        difficulty: 'beginner',
        learning_objectives: [
          'Understand what SEO is and how it works',
          'Learn key SEO concepts and terminology',
          'Identify the benefits of SEO',
          'Recognize common SEO mistakes to avoid'
        ]
      }
    },
    {
      workshop_id: seoWorkshopId,
      slug: 'keyword-research',
      title: 'Keyword Research',
      content: `# Keyword Research

Keyword research is the foundation of any successful SEO strategy. In this chapter, we'll explore how to find and analyze the right keywords for your content.

## What is Keyword Research?

Keyword research is the process of finding and analyzing the search terms that people use to find information online. It helps you understand:

- What your audience is searching for
- How competitive different keywords are
- How much search volume different terms have
- What type of content to create

## Types of Keywords

### By Search Intent
- **Informational**: "How to create a portfolio"
- **Navigational**: "Adobe Creative Suite"
- **Transactional**: "Buy photography equipment"
- **Commercial**: "Best portfolio websites 2024"

### By Length
- **Short-tail**: "SEO" (1-2 words)
- **Long-tail**: "How to improve SEO for artists" (3+ words)
- **Question-based**: "What is the best portfolio platform?"

### By Competition
- **High Competition**: Popular, broad terms
- **Medium Competition**: Moderately popular terms
- **Low Competition**: Niche, specific terms

## Keyword Research Tools

### Free Tools
- **Google Keyword Planner**: Basic keyword ideas and search volume
- **Google Trends**: Search trend data over time
- **Google Search Console**: Your site's actual search queries
- **Answer The Public**: Question-based keyword ideas

### Paid Tools
- **Ahrefs**: Comprehensive keyword and competitor analysis
- **SEMrush**: Keyword research and competitive intelligence
- **Moz**: Keyword difficulty and ranking tracking
- **Ubersuggest**: Keyword suggestions and analysis

## Research Process

### 1. Brainstorm Seed Keywords
Start with broad terms related to your topic:
- Your main topic or service
- Industry terms and jargon
- Competitor names and brands
- Related products or services

### 2. Expand Your List
Use tools to find related keywords:
- **Related searches**: Google's suggestions at the bottom of results
- **People also ask**: Questions that appear in search results
- **Autocomplete**: Google's search suggestions
- **Tool suggestions**: Keywords from research tools

### 3. Analyze Keywords
For each keyword, consider:
- **Search Volume**: How many people search for this term
- **Competition**: How difficult it is to rank for this term
- **Relevance**: How well it matches your content
- **Intent**: What the searcher is trying to accomplish

### 4. Prioritize Keywords
Rank keywords by:
- **Search Volume**: Higher volume = more potential traffic
- **Competition**: Lower competition = easier to rank
- **Relevance**: More relevant = better user experience
- **Business Value**: How important it is for your goals

## Keyword Analysis Metrics

### Search Volume
- **High Volume**: 10,000+ searches per month
- **Medium Volume**: 1,000-10,000 searches per month
- **Low Volume**: 100-1,000 searches per month
- **Very Low Volume**: Under 100 searches per month

### Keyword Difficulty
- **Easy**: 0-30 (good for beginners)
- **Medium**: 31-60 (moderate effort required)
- **Hard**: 61-100 (significant effort and resources needed)

### Click-Through Rate (CTR)
- **Position 1**: ~28% CTR
- **Position 2**: ~15% CTR
- **Position 3**: ~11% CTR
- **Position 4-10**: 5-8% CTR

## Long-tail Keyword Strategy

### Benefits of Long-tail Keywords
- **Less Competition**: Easier to rank for
- **Higher Intent**: More specific search intent
- **Better Conversion**: More qualified traffic
- **Niche Targeting**: Reach specific audiences

### Finding Long-tail Keywords
- **Question-based**: "How to optimize images for web"
- **Problem-solving**: "Why is my website loading slowly"
- **Comparison**: "Squarespace vs WordPress for artists"
- **Local**: "Photography services in Miami"

## Competitor Analysis

### Identify Competitors
- **Direct Competitors**: Same industry and target audience
- **Indirect Competitors**: Different industry, same audience
- **Content Competitors**: Similar content topics

### Analyze Their Keywords
- **What keywords are they ranking for?**
- **What content gaps can you fill?**
- **What opportunities are they missing?**
- **How can you do better?**

## Keyword Mapping

### Content Planning
Map keywords to specific pages or content pieces:
- **Homepage**: Primary brand keywords
- **Service Pages**: Service-specific keywords
- **Blog Posts**: Long-tail and question-based keywords
- **Landing Pages**: Campaign-specific keywords

### Content Clusters
Group related keywords into content clusters:
- **Pillar Content**: Comprehensive guide on main topic
- **Supporting Content**: Detailed articles on subtopics
- **Internal Linking**: Connect related content pieces

## Tools and Resources

### Free Resources
- **Google Search Console**: Your site's performance data
- **Google Analytics**: Traffic and user behavior data
- **Google Trends**: Search trend analysis
- **Ubersuggest**: Free keyword suggestions

### Paid Tools
- **Ahrefs**: $99/month - Comprehensive SEO toolkit
- **SEMrush**: $119/month - Marketing and SEO platform
- **Moz Pro**: $99/month - SEO software and tools
- **Serpstat**: $19/month - Affordable SEO platform

## Best Practices

1. **Focus on User Intent**: Match keywords to what users actually want
2. **Use Natural Language**: Write for humans, not just search engines
3. **Monitor Performance**: Track how your keywords perform over time
4. **Update Regularly**: Keyword trends change, keep your research current
5. **Think Long-term**: SEO is a marathon, not a sprint

## Next Steps

In the next chapter, we'll explore on-page optimization techniques to help your content rank better for your target keywords.`,
      order_index: 2,
      estimated_duration: 45,
      is_premium: false,
      metadata: {
        type: 'practical',
        difficulty: 'beginner',
        learning_objectives: [
          'Understand different types of keywords',
          'Learn keyword research tools and techniques',
          'Analyze keyword metrics and competition',
          'Develop a keyword strategy',
          'Map keywords to content'
        ]
      }
    },
    {
      workshop_id: seoWorkshopId,
      slug: 'on-page-optimization',
      title: 'On-Page Optimization',
      content: `# On-Page Optimization

On-page optimization involves optimizing individual web pages to rank higher and earn more relevant traffic. In this chapter, we'll cover the key elements you need to optimize.

## Title Tags

### What are Title Tags?
Title tags are HTML elements that specify the title of a web page. They appear in:
- Browser tabs
- Search engine results pages (SERPs)
- Social media shares

### Best Practices
- **Length**: 50-60 characters (to avoid truncation)
- **Include Primary Keyword**: Place it near the beginning
- **Be Descriptive**: Clearly describe the page content
- **Unique**: Each page should have a unique title
- **Brand**: Include your brand name when relevant

### Examples
- ❌ "Home"
- ✅ "Professional Photography Services | Miami Wedding Photographer"
- ❌ "About"
- ✅ "About Sarah Johnson - Award-Winning Portrait Photographer"

## Meta Descriptions

### What are Meta Descriptions?
Meta descriptions are HTML attributes that provide a summary of a web page's content. They appear under the title in search results.

### Best Practices
- **Length**: 150-160 characters
- **Include Keywords**: Naturally incorporate target keywords
- **Call to Action**: Encourage clicks with action words
- **Unique**: Each page should have a unique description
- **Accurate**: Accurately describe the page content

### Examples
- ❌ "Learn about our services"
- ✅ "Professional photography services in Miami. Specializing in weddings, portraits, and events. Book your session today!"

## Header Tags (H1, H2, H3)

### Structure Your Content
- **H1**: Main page title (one per page)
- **H2**: Major section headings
- **H3**: Subsection headings
- **H4-H6**: Further subdivisions

### Best Practices
- **Include Keywords**: Naturally incorporate target keywords
- **Logical Hierarchy**: Use headers in proper order
- **Descriptive**: Clearly describe the content below
- **Scannable**: Make content easy to scan

### Example Structure
\`\`\`
H1: Professional Photography Services in Miami
  H2: Wedding Photography
    H3: Engagement Sessions
    H3: Ceremony Coverage
  H2: Portrait Photography
    H3: Family Portraits
    H3: Corporate Headshots
\`\`\`

## Image Optimization

### Alt Text
- **Describe the Image**: What does the image show?
- **Include Keywords**: When relevant and natural
- **Be Specific**: "Wedding ceremony" not just "wedding"
- **Keep it Concise**: Usually under 125 characters

### File Names
- **Descriptive**: "miami-wedding-photography.jpg" not "IMG_001.jpg"
- **Use Hyphens**: Separate words with hyphens
- **Include Keywords**: When relevant

### Image Size and Format
- **Optimize File Size**: Compress without losing quality
- **Use Appropriate Formats**: JPEG for photos, PNG for graphics
- **Responsive Images**: Ensure images work on all devices

## Content Optimization

### Keyword Placement
- **Natural Integration**: Use keywords naturally in content
- **Keyword Density**: Aim for 1-2% keyword density
- **Semantic Keywords**: Use related terms and synonyms
- **LSI Keywords**: Latent Semantic Indexing keywords

### Content Quality
- **Original Content**: Create unique, valuable content
- **Comprehensive Coverage**: Thoroughly cover your topic
- **Regular Updates**: Keep content fresh and current
- **User-Focused**: Write for your audience, not just search engines

### Content Structure
- **Scannable**: Use bullet points, numbered lists, and short paragraphs
- **Internal Linking**: Link to other relevant pages on your site
- **External Linking**: Link to authoritative, relevant sources
- **Call to Action**: Include clear next steps for users

## URL Structure

### Best Practices
- **Descriptive**: URLs should describe the page content
- **Include Keywords**: When relevant and natural
- **Use Hyphens**: Separate words with hyphens
- **Keep it Short**: Shorter URLs are generally better
- **Avoid Parameters**: Use clean, static URLs when possible

### Examples
- ❌ "/page.php?id=123"
- ✅ "/miami-wedding-photography"
- ❌ "/about-us"
- ✅ "/about-sarah-johnson-photographer"

## Internal Linking

### Benefits
- **Page Authority**: Distribute link equity throughout your site
- **User Experience**: Help users navigate your site
- **Crawlability**: Help search engines discover your pages
- **Keyword Relevance**: Reinforce topic relevance

### Best Practices
- **Relevant Links**: Link to related, relevant content
- **Descriptive Anchor Text**: Use descriptive link text
- **Natural Placement**: Integrate links naturally in content
- **Strategic Placement**: Link to important pages from multiple locations

## Page Speed Optimization

### Why Speed Matters
- **User Experience**: Faster sites provide better user experience
- **Search Rankings**: Google considers page speed in rankings
- **Conversion Rates**: Faster sites typically convert better
- **Mobile Experience**: Especially important for mobile users

### Optimization Techniques
- **Image Optimization**: Compress and optimize images
- **Minify Code**: Remove unnecessary characters from code
- **Use CDN**: Content Delivery Networks for faster loading
- **Enable Caching**: Browser and server-side caching
- **Optimize CSS and JavaScript**: Minimize and combine files

## Mobile Optimization

### Mobile-First Design
- **Responsive Design**: Ensure your site works on all devices
- **Touch-Friendly**: Make buttons and links easy to tap
- **Fast Loading**: Optimize for mobile connection speeds
- **Readable Text**: Ensure text is readable without zooming

### Mobile SEO Considerations
- **Mobile-Friendly Test**: Use Google's mobile-friendly test
- **Page Speed**: Optimize for mobile loading speeds
- **Local SEO**: Important for mobile users searching locally
- **Voice Search**: Consider how people search on mobile

## Tools for On-Page Optimization

### Free Tools
- **Google PageSpeed Insights**: Analyze page speed
- **Google Mobile-Friendly Test**: Check mobile optimization
- **Google Search Console**: Monitor search performance
- **GTmetrix**: Comprehensive page speed analysis

### Paid Tools
- **Screaming Frog**: Technical SEO analysis
- **SEMrush**: On-page SEO analysis
- **Ahrefs**: Content and technical SEO tools
- **Moz**: On-page optimization recommendations

## Common On-Page SEO Mistakes

1. **Duplicate Title Tags**: Using the same title on multiple pages
2. **Missing Meta Descriptions**: Not writing compelling descriptions
3. **Poor Header Structure**: Not using headers logically
4. **Missing Alt Text**: Not describing images for accessibility
5. **Keyword Stuffing**: Overusing keywords unnaturally
6. **Slow Loading**: Not optimizing for page speed
7. **Mobile Issues**: Not optimizing for mobile devices

## Next Steps

In the final chapter, we'll explore how to measure and analyze your SEO performance to ensure your optimization efforts are working effectively.`,
      order_index: 3,
      estimated_duration: 45,
      is_premium: false,
      metadata: {
        type: 'technical',
        difficulty: 'intermediate',
        learning_objectives: [
          'Optimize title tags and meta descriptions',
          'Structure content with proper header tags',
          'Optimize images for SEO',
          'Improve page speed and mobile optimization',
          'Implement internal linking strategies'
        ]
      }
    }
  ];
  
  // Insert SEO chapters
  const { data: seoChapterData, error: seoChapterError } = await supabase
    .from('chapters')
    .insert(seoChapters);
    
  if (seoChapterError) {
    console.error('❌ Error creating SEO chapters:', seoChapterError);
    return;
  }
  
  console.log('✅ Created 3 chapters for "SEO Workshop"');
  
  console.log('\n🎉 Oolite workshop learn content setup completed!');
  console.log('📚 "Own Your Digital Presence": 4 chapters created');
  console.log('📚 "SEO Workshop": 3 chapters created');
  console.log('\n🌐 Test the workshops at:');
  console.log(`   http://localhost:3000/learn/${ownYourDigitalPresenceId}`);
  console.log(`   http://localhost:3000/learn/${seoWorkshopId}`);
}

enableOoliteWorkshopLearnContent().catch(console.error);
