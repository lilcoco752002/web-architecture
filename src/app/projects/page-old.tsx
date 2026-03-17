import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { ProjectService } from '@/services/project.service'

export default async function ProjectsPage() {
  const result = await ProjectService.listProjects({ published: true, pageSize: 50 })
  const projects = result.data

  return (
    <main>
      <section className="section-padding bg-gradient-to-br from-slate-50 to-white">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-5xl font-bold tracking-tight">Our Projects</h1>
            <p className="text-xl text-muted-foreground">
              Explore our portfolio of successful digital projects and case studies
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project: any) => (
              <Link
                key={project.id}
                href={`/projects/${project.slug}`}
                className="group"
              >
                <Card className="overflow-hidden transition-all hover:shadow-lg">
                  {project.featuredImage && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={project.featuredImage}
                        alt={project.title}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                        {project.type}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {project.status}
                      </span>
                    </div>
                    <h3 className="mb-2 text-xl font-semibold">{project.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {project.shortDescription}
                    </p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          {projects.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">No projects found.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
