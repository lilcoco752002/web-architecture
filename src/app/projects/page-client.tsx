'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { variants, useScrollReveal, useStaggerChildren } from '@/lib/motion'

interface Project {
  id: string
  slug: string
  title: string
  shortDescription: string | null
  type: string
  featuredImage: string | null
  tags: string[]
  createdAt: string
}

export default function ProjectsPageClient() {
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [selectedFilter, setSelectedFilter] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(true)

  const filters = [
    { label: 'All Projects', value: 'all' },
    { label: 'Web Design', value: 'WEB_DESIGN' },
    { label: 'Web Development', value: 'WEB_DEVELOPMENT' },
    { label: 'Mobile Apps', value: 'MOBILE_APP' },
    { label: 'Branding', value: 'BRANDING' },
    { label: 'SEO', value: 'SEO' },
    { label: 'Consulting', value: 'CONSULTING' },
    { label: 'Other', value: 'OTHER' },
  ]

  useEffect(() => {
    fetchProjects()
  }, [])

  useEffect(() => {
    if (selectedFilter === 'all') {
      setFilteredProjects(projects)
    } else {
      setFilteredProjects(projects.filter(p => p.type === selectedFilter))
    }
  }, [selectedFilter, projects])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects')
      if (response.ok) {
        const data = await response.json()
        setProjects(data.data || [])
        setFilteredProjects(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="section-padding-sm bg-surface">
        <div className="container">
          <motion.div
            {...useScrollReveal()}
            className="mx-auto max-w-[800px] text-center"
          >
            <div className="mb-6 inline-block text-[10px] font-ui font-semibold tracking-[0.2em] uppercase text-primary">
              Portfolio
            </div>
            <h1 className="mb-6 font-serif text-5xl font-light tracking-tight md:text-6xl lg:text-7xl">
              Our Work
            </h1>
            <p className="mx-auto max-w-[600px] text-lg leading-relaxed text-[hsl(var(--foreground-secondary))]">
              Explore 500+ completed projects across residential, commercial, and hospitality sectors. Each project showcases our award-winning approach to luxury interior design.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter */}
      <section className="border-b border-[hsl(var(--border))]">
        <div className="container">
          <motion.div
            {...useScrollReveal()}
            className="flex flex-wrap items-center justify-center gap-4 py-8"
          >
            {filters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setSelectedFilter(filter.value)}
                className={`rounded-full px-6 py-2 text-xs font-ui font-semibold tracking-[0.15em] uppercase transition-smooth ${
                  selectedFilter === filter.value
                    ? 'bg-foreground text-background'
                    : 'border border-[hsl(var(--border))] hover:border-foreground'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="section-padding">
        <div className="container">
          {isLoading ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[4/3] rounded-2xl bg-[hsl(var(--muted))]" />
                  <div className="mt-4 space-y-3">
                    <div className="h-4 w-24 rounded bg-[hsl(var(--muted))]" />
                    <div className="h-6 w-3/4 rounded bg-[hsl(var(--muted))]" />
                    <div className="h-4 w-full rounded bg-[hsl(var(--muted))]" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            <motion.div
              {...useScrollReveal()}
              className="py-20 text-center"
            >
              <p className="text-lg text-[hsl(var(--foreground-secondary))]">
                No projects found in this category.
              </p>
            </motion.div>
          ) : (
            <motion.div
              {...useStaggerChildren(0.1)}
              className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
            >
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  variants={variants.fadeInUp}
                >
                  <ProjectCard project={project} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </main>
  )
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      className="group"
    >
      <Link href={`/projects/${project.slug}`} className="block">
        <div className="mb-6 overflow-hidden rounded-2xl">
          {project.featuredImage ? (
            <div className="aspect-[4/3] overflow-hidden bg-[hsl(var(--muted))]">
              <motion.img
                src={project.featuredImage}
                alt={project.title}
                className="h-full w-full object-cover"
                variants={variants.imageZoom}
              />
            </div>
          ) : (
            <div className="aspect-[4/3] flex items-center justify-center bg-[hsl(var(--muted))]">
              <span className="text-4xl opacity-20">🏡</span>
            </div>
          )}
        </div>

        <div>
          <div className="mb-3 flex items-center gap-2 text-[10px] font-ui font-semibold tracking-[0.15em] uppercase text-[hsl(var(--foreground-tertiary))]">
            <span>{project.type}</span>
            <span>•</span>
            <span>{new Date(project.createdAt).getFullYear()}</span>
          </div>

          <h3 className="mb-3 font-serif text-2xl font-light tracking-tight transition-colors group-hover:text-primary">
            {project.title}
          </h3>

          <p className="text-sm leading-relaxed text-[hsl(var(--foreground-secondary))] line-clamp-2">
            {project.shortDescription || 'Luxury interior design project'}
          </p>
        </div>
      </Link>
    </motion.div>
  )
}
