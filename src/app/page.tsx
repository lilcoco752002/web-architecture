import { publicProject } from '@/lib/public-project'
export const dynamic = 'force-dynamic'

import { ProjectService } from '@/services/project.service'
import PremiumHomePage from './page-premium'
import { generateMetadata as genMeta, generateOrganizationSchema, KEYWORDS } from '@/lib/seo'

export const metadata = genMeta({
  title: 'Luxury Interior Design Services | Award-Winning Design Studio',
  description: 'Transform your space with world-class interior design. Specializing in luxury residential & commercial design. 500+ projects, 98% satisfaction. Free consultation.',
  keywords: [...KEYWORDS.primary, ...KEYWORDS.style, ...KEYWORDS.location],
  canonical: '/',
})

export default async function Home() {
  const featuredProjects = await ProjectService.getFeaturedProjects(3)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateOrganizationSchema()),
        }}
      />
      <PremiumHomePage featuredProjects={featuredProjects.map(publicProject)} />
    </>
  )
}
