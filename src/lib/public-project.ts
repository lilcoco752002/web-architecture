import type { Project } from '@prisma/client'

// Explicit allowlist: never expose internal costs, client IDs or CRM relations.
export function publicProject(project: Project) {
  return {
    id: project.id, slug: project.slug, title: project.title,
    description: project.description, shortDescription: project.shortDescription,
    type: project.type, featured: project.featured, featuredImage: project.featuredImage,
    coverImage: project.coverImage, tags: project.tags, websiteUrl: project.websiteUrl,
    metaTitle: project.metaTitle, metaDescription: project.metaDescription,
    createdAt: project.createdAt,
  }
}
