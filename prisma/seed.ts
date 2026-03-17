import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create Admin User
  const adminPassword = await hash('Admin123!', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@agency.com' },
    update: {},
    create: {
      email: 'admin@agency.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  })
  console.log('✓ Created admin user:', admin.email)

  // Create Staff User
  const staffPassword = await hash('Staff123!', 12)
  const staff = await prisma.user.upsert({
    where: { email: 'staff@agency.com' },
    update: {},
    create: {
      email: 'staff@agency.com',
      password: staffPassword,
      name: 'Staff User',
      role: 'STAFF',
      status: 'ACTIVE',
    },
  })
  console.log('✓ Created staff user:', staff.email)

  // Create Services
  const services = [
    {
      name: 'Web Design',
      slug: 'web-design',
      description:
        'Create stunning, user-friendly websites that captivate your audience and drive conversions. Our design team combines aesthetics with functionality to deliver exceptional digital experiences.',
      shortDescription:
        'Beautiful, user-friendly interfaces that captivate your audience.',
      icon: '🎨',
      startingPrice: 3000,
      published: true,
      featured: true,
      order: 1,
      features: JSON.stringify([
        'Custom UI/UX Design',
        'Responsive Layouts',
        'Brand Integration',
        'Wireframes & Prototypes',
        'Design System Creation',
      ]),
      benefits: JSON.stringify([
        'Increased User Engagement',
        'Better Conversion Rates',
        'Professional Brand Image',
        'Mobile-First Approach',
      ]),
    },
    {
      name: 'Web Development',
      slug: 'web-development',
      description:
        'Build robust, scalable web applications with cutting-edge technologies. From simple websites to complex enterprise solutions, we deliver high-performance applications.',
      shortDescription: 'Robust, scalable web applications built with modern tech.',
      icon: '💻',
      startingPrice: 5000,
      published: true,
      featured: true,
      order: 2,
      features: JSON.stringify([
        'Full-Stack Development',
        'API Integration',
        'Database Design',
        'Performance Optimization',
        'Security Best Practices',
      ]),
    },
    {
      name: 'Branding',
      slug: 'branding',
      description:
        'Develop a complete brand identity that makes your business memorable and distinguishes you from competitors.',
      shortDescription: 'Complete brand identity solutions that stand out.',
      icon: '✨',
      startingPrice: 2500,
      published: true,
      featured: true,
      order: 3,
    },
    {
      name: 'Mobile App Development',
      slug: 'mobile-apps',
      description:
        'Create native and cross-platform mobile applications for iOS and Android that your users will love.',
      shortDescription: 'Native and cross-platform mobile apps.',
      icon: '📱',
      startingPrice: 8000,
      published: true,
      order: 4,
    },
    {
      name: 'SEO & Marketing',
      slug: 'seo-marketing',
      description:
        'Data-driven digital marketing strategies to increase your online visibility and drive sustainable growth.',
      shortDescription: 'Increase your online visibility and growth.',
      icon: '📈',
      startingPrice: 1500,
      published: true,
      order: 5,
    },
  ]

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: service,
      create: service,
    })
  }
  console.log('✓ Created services')

  // Create Sample Clients
  const clients = [
    {
      name: 'Tech Innovations Inc',
      email: 'contact@techinnovations.com',
      phone: '(555) 123-4567',
      company: 'Tech Innovations Inc',
      website: 'https://techinnovations.com',
      source: 'REFERRAL',
      status: 'ACTIVE',
      priority: 1,
      country: 'United States',
      city: 'San Francisco',
      industry: 'Technology',
      budget: 50000,
      createdById: admin.id,
    },
    {
      name: 'Global Commerce Ltd',
      email: 'hello@globalcommerce.com',
      phone: '(555) 234-5678',
      company: 'Global Commerce Ltd',
      website: 'https://globalcommerce.com',
      source: 'WEBSITE',
      status: 'QUALIFIED',
      priority: 2,
      country: 'United Kingdom',
      city: 'London',
      industry: 'E-commerce',
      budget: 35000,
      createdById: admin.id,
    },
    {
      name: 'Creative Studio',
      email: 'info@creativestudio.com',
      phone: '(555) 345-6789',
      company: 'Creative Studio',
      website: 'https://creativestudio.com',
      source: 'SOCIAL_MEDIA',
      status: 'NEW',
      priority: 3,
      country: 'Canada',
      city: 'Toronto',
      industry: 'Design',
      budget: 20000,
      createdById: staff.id,
    },
  ]

  const createdClients = []
  for (const clientData of clients) {
    const client = await prisma.client.create({
      data: {
        ...clientData,
        source: clientData.source as any,
        status: clientData.status as any,
      },
    })
    createdClients.push(client)
  }
  console.log('✓ Created sample clients')

  // Create Sample Projects
  const webDesignService = await prisma.service.findUnique({
    where: { slug: 'web-design' },
  })
  const webDevService = await prisma.service.findUnique({
    where: { slug: 'web-development' },
  })

  const projects = [
    {
      title: 'E-commerce Platform Redesign',
      slug: 'ecommerce-platform-redesign-x1y2z3',
      description:
        'Complete redesign of a multi-vendor e-commerce platform serving over 100,000 users. Improved user experience, increased conversion rates by 45%, and reduced cart abandonment.',
      shortDescription:
        'Complete redesign of multi-vendor e-commerce platform',
      type: 'WEB_DESIGN',
      status: 'COMPLETED',
      clientId: createdClients[0].id,
      clientName: createdClients[0].name,
      budget: 45000,
      actualCost: 43500,
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-04-30'),
      published: true,
      featured: true,
      featuredImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f',
      tags: ['E-commerce', 'UI/UX', 'Redesign'],
      websiteUrl: 'https://example-ecommerce.com',
      createdById: admin.id,
    },
    {
      title: 'Corporate Website Development',
      slug: 'corporate-website-development-a4b5c6',
      description:
        'Modern, responsive corporate website with CMS integration, multi-language support, and advanced SEO optimization.',
      shortDescription: 'Modern corporate website with CMS',
      type: 'WEB_DEVELOPMENT',
      status: 'IN_PROGRESS',
      clientId: createdClients[1].id,
      clientName: createdClients[1].name,
      budget: 35000,
      startDate: new Date('2024-05-01'),
      published: true,
      featured: true,
      featuredImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c',
      tags: ['Corporate', 'CMS', 'SEO'],
      createdById: admin.id,
    },
  ]

  for (const projectData of projects) {
    const project = await prisma.project.create({
      data: {
        ...projectData,
        type: projectData.type as any,
        status: projectData.status as any,
        services: {
          create: [
            { serviceId: webDesignService!.id },
            { serviceId: webDevService!.id },
          ],
        },
      },
    })

    // Add project images
    await prisma.projectImage.createMany({
      data: [
        {
          projectId: project.id,
          url: 'https://images.unsplash.com/photo-1547658719-da2b51169166',
          altText: 'Project Screenshot 1',
          order: 1,
        },
        {
          projectId: project.id,
          url: 'https://images.unsplash.com/photo-1551650975-87deedd944c3',
          altText: 'Project Screenshot 2',
          order: 2,
        },
      ],
    })
  }
  console.log('✓ Created sample projects')

  // Create Sample Testimonials
  await prisma.testimonial.createMany({
    data: [
      {
        clientName: 'John Smith',
        clientRole: 'CEO',
        clientCompany: 'Tech Innovations Inc',
        content:
          'Working with this agency was an absolute pleasure. They delivered beyond our expectations and the results speak for themselves. Highly recommended!',
        rating: 5,
        featured: true,
        published: true,
      },
      {
        clientName: 'Sarah Johnson',
        clientRole: 'Marketing Director',
        clientCompany: 'Global Commerce Ltd',
        content:
          'Professional, creative, and results-driven. The team understood our vision and brought it to life perfectly.',
        rating: 5,
        featured: true,
        published: true,
      },
    ],
  })
  console.log('✓ Created testimonials')

  // Create Sample Blog Posts
  await prisma.blogPost.createMany({
    data: [
      {
        title: '10 Web Design Trends for 2024',
        slug: '10-web-design-trends-2024-x1y2z3',
        excerpt:
          'Explore the latest web design trends that will shape the digital landscape in 2024.',
        content:
          'Full article content here... Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        featuredImage: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb',
        status: 'PUBLISHED',
        featured: true,
        tags: ['Web Design', 'Trends', '2024'],
        category: 'Design',
        authorId: admin.id,
        authorName: admin.name,
        publishedAt: new Date(),
        readTime: 5,
      },
      {
        title: 'The Importance of User Experience',
        slug: 'importance-of-user-experience-a4b5c6',
        excerpt:
          'Why UX should be at the center of your digital strategy.',
        content:
          'Full article content here... Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        featuredImage: 'https://images.unsplash.com/photo-1586717799252-bd134ad00e26',
        status: 'PUBLISHED',
        tags: ['UX', 'Design', 'Strategy'],
        category: 'User Experience',
        authorId: admin.id,
        authorName: admin.name,
        publishedAt: new Date(),
        readTime: 7,
      },
    ],
  })
  console.log('✓ Created blog posts')

  // Create Sample Leads
  await prisma.lead.createMany({
    data: [
      {
        name: 'Michael Brown',
        email: 'michael@startup.com',
        phone: '(555) 456-7890',
        company: 'Startup XYZ',
        source: 'WEBSITE',
        status: 'NEW',
        priority: 2,
        interestedIn: 'Web Development',
        message: 'Looking for a full-stack development team for our SaaS product.',
        budget: 'USD 40,000-60,000',
        timeline: '3-4 months',
        createdById: admin.id,
      },
      {
        name: 'Emily Davis',
        email: 'emily@boutique.com',
        phone: '(555) 567-8901',
        company: 'Fashion Boutique',
        source: 'SOCIAL_MEDIA',
        status: 'CONTACTED',
        priority: 3,
        interestedIn: 'E-commerce Website',
        message: 'Need an e-commerce website for my fashion boutique.',
        budget: 'USD 10,000-20,000',
        timeline: '2 months',
        createdById: staff.id,
      },
    ],
  })
  console.log('✓ Created sample leads')

  // Create Sample Bookings
  await prisma.booking.createMany({
    data: [
      {
        name: 'Robert Wilson',
        email: 'robert@company.com',
        phone: '(555) 678-9012',
        company: 'Wilson & Co',
        type: 'CONSULTATION',
        status: 'PENDING',
        interestedIn: 'Branding',
        message: 'Would like to discuss rebranding our company.',
        budget: 'USD 15,000-25,000',
        timeline: '2-3 months',
        preferredDate: new Date('2024-06-15'),
      },
    ],
  })
  console.log('✓ Created sample bookings')

  // Create Team Members
  await prisma.teamMember.createMany({
    data: [
      {
        name: 'Alex Thompson',
        role: 'Founder & CEO',
        bio: 'Visionary leader with 15+ years of experience in digital transformation.',
        avatar: 'https://i.pravatar.cc/300?img=33',
        email: 'alex@agency.com',
        linkedIn: 'https://linkedin.com/in/alexthompson',
        order: 1,
        published: true,
      },
      {
        name: 'Jessica Lee',
        role: 'Creative Director',
        bio: 'Award-winning designer passionate about creating memorable brand experiences.',
        avatar: 'https://i.pravatar.cc/300?img=47',
        email: 'jessica@agency.com',
        linkedIn: 'https://linkedin.com/in/jessicalee',
        order: 2,
        published: true,
      },
      {
        name: 'David Chen',
        role: 'Lead Developer',
        bio: 'Full-stack engineer specializing in scalable web applications.',
        avatar: 'https://i.pravatar.cc/300?img=12',
        email: 'david@agency.com',
        linkedIn: 'https://linkedin.com/in/davidchen',
        github: 'https://github.com/davidchen',
        order: 3,
        published: true,
      },
    ],
  })
  console.log('✓ Created team members')

  console.log('✅ Database seeded successfully!')
  console.log('\n📝 Login credentials:')
  console.log('Admin: admin@agency.com / Admin123!')
  console.log('Staff: staff@agency.com / Staff123!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
