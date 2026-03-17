import { generateMetadata as genMeta, generateBreadcrumbSchema, KEYWORDS } from '@/lib/seo'
import ProjectsPageClient from './page-client'

export const metadata = genMeta({
  title: 'Interior Design Portfolio - Luxury Projects | Luxe Interiors',
  description: '500+ completed interior design projects. View our portfolio of luxury residential, commercial, and hospitality spaces. Award-winning design solutions.',
  keywords: [...KEYWORDS.primary, 'interior design portfolio', 'design projects', 'luxury interiors', 'completed projects', 'interior design examples'],
  canonical: '/projects',
})

export default function ProjectsPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Projects', url: '/projects' },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <ProjectsPageClient />
    </>
  )
}
