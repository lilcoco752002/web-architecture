import { generateMetadata as genMeta, generateBreadcrumbSchema, KEYWORDS } from '@/lib/seo'
import ContactPageClient from './page-client'

export const metadata = genMeta({
  title: 'Contact Us - Free Design Consultation | Luxe Interiors',
  description: 'Get a free interior design consultation. Discuss your project with our award-winning designers. Located in New York. Book your appointment today.',
  keywords: [...KEYWORDS.primary, 'interior design consultation', 'free design consultation', 'contact interior designer', 'book design appointment'],
  canonical: '/contact',
})

export default function ContactPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Contact', url: '/contact' },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <ContactPageClient />
    </>
  )
}
