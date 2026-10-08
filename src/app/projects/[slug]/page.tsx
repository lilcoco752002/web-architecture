import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ProjectService } from '@/services/project.service'

export const dynamic = 'force-dynamic'

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const project = await ProjectService.getProjectBySlug(params.slug)
  if (!project?.published) notFound()
  return (
    <main className="container py-16">
      <Link href="/projects" className="text-primary">← All projects</Link>
      <h1 className="mt-8 font-serif text-5xl">{project.title}</h1>
      {project.featuredImage && <img src={project.featuredImage} alt={project.title} className="my-8 w-full rounded-lg object-cover" />}
      <p className="my-8 whitespace-pre-wrap text-lg">{project.description}</p>
      <div className="grid gap-6 md:grid-cols-2">
        {project.images.map(image => <figure key={image.id}>
          <img src={image.url} alt={image.altText || project.title} className="w-full rounded-lg" />
          {image.caption && <figcaption className="mt-2 text-sm">{image.caption}</figcaption>}
        </figure>)}
      </div>
      {project.testimonial?.published && <blockquote className="my-8 border-l-2 pl-6">{project.testimonial.content}</blockquote>}
      <Link href="/contact" className="mt-8 inline-block text-primary">Discuss your project →</Link>
    </main>
  )
}
