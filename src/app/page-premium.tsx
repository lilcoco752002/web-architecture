'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { 
  variants, 
  transitions,
  useScrollReveal,
  useStaggerChildren 
} from '@/lib/motion'

interface Service {
  name: string
  slug: string
  description: string
  icon: string
}

interface Project {
  id: string
  slug: string
  title: string
  shortDescription: string | null
  featuredImage: string | null
  type: string
}

export default function PremiumHomePage({
  featuredProjects = []
}: {
  featuredProjects?: Project[]
}) {
  return (
    <main className="overflow-hidden">
      {/* Hero Section - Minimal, Typography-Focused */}
      <section className="relative min-h-[92vh] flex items-center justify-center pattern-dots">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80" />
        
        <motion.div 
          className="container relative"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2,
              },
            },
          }}
        >
          <div className="mx-auto max-w-[900px] text-center">
            {/* Small Badge */}
            <motion.div
              variants={variants.fadeInUp}
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-border-subtle bg-surface px-4 py-2"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-xs font-ui font-semibold tracking-[0.15em] uppercase text-foreground-secondary">
                Award-Winning Design Studio
              </span>
            </motion.div>
            
            {/* Main Headline - Light, Elegant */}
            <motion.h1
              variants={variants.fadeInUp}
              className="mb-8 font-serif text-6xl font-light leading-[1.1] tracking-tighter text-foreground md:text-7xl lg:text-8xl"
            >
              Spaces that
              <br />
              <span className="gradient-text-accent animate-gradient">
                Define Living
              </span>
            </motion.h1>
            
            {/* Subheadline */}
            <motion.p
              variants={variants.fadeInUp}
              className="mb-12 mx-auto max-w-[600px] text-lg leading-relaxed text-foreground-secondary md:text-xl"
            >
              We create sophisticated, timeless interiors where luxury meets functionality—crafted with meticulous attention to every detail.
            </motion.p>
            
            {/* CTAs */}
            <motion.div
              variants={variants.fadeInUp}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={transitions.quick}
              >
                <Button 
                  size="lg" 
                  asChild 
                  className="h-12 rounded-full px-8 text-xs font-ui font-semibold tracking-[0.15em] uppercase shadow-lg"
                >
                  <Link href="/contact">Schedule Consultation</Link>
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={transitions.quick}
              >
                <Button 
                  size="lg" 
                  variant="outline" 
                  asChild 
                  className="h-12 rounded-full px-8 text-xs font-ui font-semibold tracking-[0.15em] uppercase"
                >
                  <Link href="/projects">View Portfolio</Link>
                </Button>
              </motion.div>
            </motion.div>
            
            {/* Stats - Elegant, Subtle */}
            <motion.div
              variants={variants.fadeInUp}
              className="mt-20 grid grid-cols-3 gap-8 border-t border-border-subtle pt-12"
            >
              {[
                { value: '150+', label: 'Projects' },
                { value: '12+', label: 'Years' },
                { value: '98%', label: 'Satisfaction' },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="mb-2 font-serif text-3xl font-light tracking-tight text-primary md:text-4xl">
                    {stat.value}
                  </div>
                  <div className="text-xs font-ui font-semibold tracking-[0.15em] uppercase text-foreground-tertiary">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
        
        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2 text-foreground-tertiary"
          >
            <span className="text-[10px] font-ui font-semibold tracking-[0.2em] uppercase">
              Scroll
            </span>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </motion.div>
      </section>

      {/* Services Section */}
      <section className="section-padding bg-surface">
        <div className="container">
          <motion.div 
            {...useScrollReveal()}
            className="mb-20 text-center"
          >
            <div className="mb-4 inline-block text-[10px] font-ui font-semibold tracking-[0.2em] uppercase text-primary">
              Our Expertise
            </div>
            <h2 className="mb-6 font-serif text-4xl font-light tracking-tight md:text-5xl lg:text-6xl">
              Design Services
            </h2>
            <p className="mx-auto max-w-[600px] text-base leading-relaxed text-foreground-secondary md:text-lg">
              From concept to completion, we offer comprehensive solutions tailored to your vision
            </p>
          </motion.div>

          <motion.div
            {...useStaggerChildren(0.15)}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {services.map((service) => (
              <motion.div
                key={service.slug}
                variants={variants.fadeInUp}
              >
                <ServiceCard service={service} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <section className="section-padding">
          <div className="container">
            <motion.div 
              {...useScrollReveal()}
              className="mb-16 flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-end"
            >
              <div>
                <div className="mb-4 text-[10px] font-ui font-semibold tracking-[0.2em] uppercase text-primary">
                  Portfolio
                </div>
                <h2 className="font-serif text-4xl font-light tracking-tight md:text-5xl">
                  Featured Work
                </h2>
              </div>
              
              <motion.div
                whileHover={{ x: 4 }}
                transition={transitions.quick}
              >
                <Link
                  href="/projects"
                  className="group inline-flex items-center gap-2 text-sm font-ui font-semibold tracking-wide text-foreground-secondary transition-smooth hover:text-foreground"
                >
                  View All Projects
                  <svg 
                    className="h-4 w-4 transition-transform group-hover:translate-x-1" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              {...useStaggerChildren(0.2)}
              className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
            >
              {featuredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  variants={variants.fadeInUp}
                >
                  <ProjectCard project={project} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* CTA Section - Minimal, Elegant */}
      <section className="section-padding-sm">
        <div className="container">
          <motion.div
            {...useScrollReveal()}
            className="relative overflow-hidden rounded-3xl bg-foreground px-12 py-20 text-center md:px-16 md:py-24"
          >
            {/* Decorative Pattern */}
            <div className="absolute inset-0 opacity-5 pattern-grid" />
            
            <div className="relative">
              <h2 className="mb-6 font-serif text-3xl font-light tracking-tight text-background md:text-4xl lg:text-5xl">
                Ready to Transform
                <br />
                Your Space?
              </h2>
              <p className="mb-10 mx-auto max-w-[500px] text-base leading-relaxed text-background/70 md:text-lg">
                Let's discuss how we can bring your vision to life with our expert design services.
              </p>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={transitions.quick}
              >
                <Button 
                  size="lg" 
                  variant="secondary" 
                  asChild
                  className="h-12 rounded-full px-8 text-xs font-ui font-semibold tracking-[0.15em] uppercase shadow-xl"
                >
                  <Link href="/contact">Get in Touch</Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}

// Service Card Component
function ServiceCard({ service }: { service: Service }) {
  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      className="group relative h-full"
    >
      <motion.div
        variants={variants.hoverLift}
        className="card-elevated h-full p-8"
      >
        {/* Background Circle Animation */}
        <motion.div
          className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/5"
          variants={{
            rest: { scale: 1, opacity: 0.5 },
            hover: { scale: 1.5, opacity: 1 },
          }}
          transition={transitions.smooth}
        />
        
        <div className="relative">
          <motion.div 
            className="mb-6 text-4xl"
            variants={{
              rest: { scale: 1 },
              hover: { scale: 1.1, rotate: 5 },
            }}
            transition={transitions.quick}
          >
            {service.icon}
          </motion.div>
          
          <h3 className="mb-4 font-serif text-2xl font-light tracking-tight">
            {service.name}
          </h3>
          
          <p className="mb-6 text-sm leading-relaxed text-foreground-secondary">
            {service.description}
          </p>
          
          <Link
            href="/services"
            className="group/link inline-flex items-center gap-2 text-xs font-ui font-semibold tracking-wide text-primary"
          >
            Explore Service
            <motion.svg 
              className="h-3 w-3" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              variants={{
                rest: { x: 0 },
                hover: { x: 4 },
              }}
              transition={transitions.quick}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </motion.svg>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Project Card Component
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
            <div className="aspect-[4/3] overflow-hidden bg-secondary">
              <motion.img
                src={project.featuredImage}
                alt={project.title}
                className="h-full w-full object-cover"
                variants={variants.imageZoom}
              />
            </div>
          ) : (
            <div className="aspect-[4/3] bg-surface flex items-center justify-center">
              <span className="text-4xl opacity-20">{services[0].icon}</span>
            </div>
          )}
        </div>
        
        <div>
          <div className="mb-3 flex items-center gap-2 text-[10px] font-ui font-semibold tracking-[0.15em] uppercase text-foreground-tertiary">
            <span>{project.type}</span>
            <span>•</span>
            <span>2024</span>
          </div>
          
          <h3 className="mb-3 font-serif text-2xl font-light tracking-tight transition-colors group-hover:text-primary">
            {project.title}
          </h3>
          
          <p className="text-sm leading-relaxed text-foreground-secondary line-clamp-2">
            {project.shortDescription || 'Luxury interior design project'}
          </p>
        </div>
      </Link>
    </motion.div>
  )
}

const services: Service[] = [
  {
    name: 'Residential Design',
    slug: 'residential-design',
    description: 'Transform your home into a personalized sanctuary with our comprehensive residential design services',
    icon: '🏡',
  },
  {
    name: 'Commercial Spaces',
    slug: 'commercial-design',
    description: 'Create inspiring work environments that enhance productivity and reflect your brand identity',
    icon: '🏢',
  },
  {
    name: 'Space Planning',
    slug: 'space-planning',
    description: 'Optimize your layout for functionality and flow with expert spatial design solutions',
    icon: '📐',
  },
  {
    name: 'Renovations',
    slug: 'renovations',
    description: 'Breathe new life into existing spaces with our comprehensive renovation services',
    icon: '🔨',
  },
  {
    name: 'Furniture & Styling',
    slug: 'furniture-styling',
    description: 'Curate the perfect pieces and accessories to complete your interior vision',
    icon: '🛋️',
  },
  {
    name: 'Design Consultation',
    slug: 'consultation',
    description: 'Expert guidance and professional advice to help you make informed design decisions',
    icon: '💡',
  },
]
