import { generateMetadata as genMeta, generateBreadcrumbSchema, generateServiceSchema, KEYWORDS } from '@/lib/seo'
import ServicesPageClient from './page-client'

export const metadata = genMeta({
  title: 'Interior Design Services - Residential & Commercial | Luxe Interiors',
  description: 'Full-service interior design: Residential, Commercial, Space Planning, Renovations, Furniture Design & Consultation. 500+ projects, 15+ years experience. Free quote.',
  keywords: [...KEYWORDS.primary, ...KEYWORDS.service, 'residential interior design', 'commercial interior design', 'space planning services', 'interior design consultation'],
  canonical: '/services',
})

export default function ServicesPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Services', url: '/services' },
  ])

  const servicesSchemas = [
    generateServiceSchema({
      name: 'Residential Interior Design',
      description: 'Complete home design services including room-by-room styling, furniture selection, and space planning',
      provider: 'Luxe Interiors',
      priceRange: '$$$',
    }),
    generateServiceSchema({
      name: 'Commercial Interior Design',
      description: 'Professional office, retail, and restaurant interior design with brand integration',
      provider: 'Luxe Interiors',
      priceRange: '$$$',
    }),
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      {servicesSchemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
          }}
        />
      ))}
      <ServicesPageClient />
    </>
  )
}
