import { Metadata } from 'next'

export interface SEOConfig {
  title: string
  description: string
  keywords?: string[]
  canonical?: string
  ogImage?: string
  noindex?: boolean
}

const SITE_NAME = 'Luxe Interiors'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://luxeinteriors.com'
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`

export function generateMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    keywords = [],
    canonical,
    ogImage = DEFAULT_OG_IMAGE,
    noindex = false,
  } = config

  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`
  const url = canonical || SITE_URL

  return {
    title: fullTitle,
    description,
    keywords: keywords.join(', '),
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    robots: noindex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
      creator: '@luxeinteriors',
    },
  }
}

// Structured data schemas for rich snippets
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'InteriorDesignCompany',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description: 'Award-winning interior design studio specializing in luxury residential and commercial spaces',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 Design Street',
      addressLocality: 'New York',
      addressRegion: 'NY',
      postalCode: '10001',
      addressCountry: 'US',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-555-123-4567',
      contactType: 'Customer Service',
      email: 'hello@luxeinteriors.com',
      availableLanguage: ['English'],
    },
    sameAs: [
      'https://instagram.com/luxeinteriors',
      'https://facebook.com/luxeinteriors',
      'https://linkedin.com/company/luxeinteriors',
      'https://pinterest.com/luxeinteriors',
    ],
    priceRange: '$$$',
    openingHours: 'Mo-Fr 09:00-18:00, Sa 10:00-16:00',
  }
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  }
}

export function generateServiceSchema(service: {
  name: string
  description: string
  provider: string
  areaServed?: string
  priceRange?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    provider: {
      '@type': 'Organization',
      name: service.provider,
    },
    areaServed: service.areaServed || 'New York, NY',
    category: 'Interior Design',
    priceRange: service.priceRange || '$$$',
  }
}

export function generateProjectSchema(project: {
  name: string
  description: string
  image: string
  dateCreated: string
  category: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.name,
    description: project.description,
    image: project.image,
    dateCreated: project.dateCreated,
    creator: {
      '@type': 'Organization',
      name: SITE_NAME,
    },
    genre: project.category,
  }
}

export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

// International keyword sets
export const KEYWORDS = {
  primary: [
    'luxury interior design',
    'interior designer',
    'interior design services',
    'home interior design',
    'residential interior design',
    'commercial interior design',
  ],
  secondary: [
    'interior decorator',
    'interior design consultation',
    'space planning',
    'furniture design',
    'renovation design',
    'interior architecture',
  ],
  location: [
    'interior designer New York',
    'NYC interior design',
    'Manhattan interior designer',
    'New York home design',
  ],
  style: [
    'modern interior design',
    'contemporary interior design',
    'minimalist interior design',
    'luxury home design',
    'high-end interior design',
    'boutique interior design',
  ],
  service: [
    'full-service interior design',
    'turnkey interior design',
    'interior design project management',
    'custom furniture design',
    'interior design consultation',
  ],
  international: [
    'international interior design',
    'global interior designer',
    'world-class interior design',
    'award-winning interior design',
    'premium interior design',
  ],
}

// Conversion-focused CTAs
export const CTAS = {
  primary: {
    text: 'Schedule Free Consultation',
    urgency: 'Book Your Design Session Today',
    benefit: 'Transform Your Space - Free Consultation',
  },
  secondary: {
    text: 'View Our Portfolio',
    urgency: 'See Our Latest Projects',
    benefit: 'Get Inspired by Our Work',
  },
  tertiary: {
    text: 'Get a Quote',
    urgency: 'Request Your Custom Quote',
    benefit: 'Free Project Estimate',
  },
}

// Trust signals for conversion
export const TRUST_SIGNALS = {
  awards: [
    'Best of Houzz 2024',
    'Interior Design Excellence Award',
    'Top 100 Interior Designers',
  ],
  metrics: [
    '500+ Projects Completed',
    '98% Client Satisfaction',
    '15+ Years Experience',
  ],
  certifications: [
    'NCIDQ Certified',
    'LEED Accredited Professional',
    'Certified Interior Designer',
  ],
}
