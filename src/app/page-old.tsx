import { ProjectService } from '@/services/project.service'
import PremiumHomePage from './page-premium'

export default async function Home() {
  const featuredProjects = await ProjectService.getFeaturedProjects(3)

  return <PremiumHomePage featuredProjects={featuredProjects} />
}
