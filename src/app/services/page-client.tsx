'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { variants, useScrollReveal, useStaggerChildren } from '@/lib/motion'

const services = [
  {
    name: 'Residential Design',
    slug: 'residential-design',
    icon: '🏡',
    shortDescription: 'Creating personalized sanctuaries that reflect your lifestyle',
    features: [
      'Complete home design',
      'Room-by-room styling',
      'Furniture selection',
      'Color consultation',
      'Space planning',
      'Custom millwork design',
    ],
    process: [
      'Initial consultation',
      'Concept development',
      'Design presentation',
      'Implementation',
    ],
  },
  {
    name: 'Commercial Spaces',
    slug: 'commercial-design',
    icon: '🏢',
    shortDescription: 'Inspiring work environments that enhance productivity',
    features: [
      'Office design',
      'Retail spaces',
      'Restaurant interiors',
      'Brand integration',
      'Workplace strategy',
      'FF&E procurement',
    ],
    process: [
      'Brand discovery',
      'Space analysis',
      'Design development',
      'Project management',
    ],
  },
  {
    name: 'Space Planning',
    slug: 'space-planning',
    icon: '📐',
    shortDescription: 'Optimizing layouts for functionality and flow',
    features: [
      'Floor plan optimization',
      'Traffic flow analysis',
      'Furniture layouts',
      'Lighting design',
      'Storage solutions',
      '3D visualization',
    ],
    process: [
      'Site assessment',
      'Concept sketches',
      'Technical drawings',
      'Implementation support',
    ],
  },
  {
    name: 'Renovations',
    slug: 'renovations',
    icon: '🔨',
    shortDescription: 'Transforming existing spaces with fresh vision',
    features: [
      'Full home renovations',
      'Kitchen remodeling',
      'Bathroom updates',
      'Historic restoration',
      'Contractor coordination',
      'Project oversight',
    ],
    process: [
      'Condition assessment',
      'Design planning',
      'Contractor selection',
      'Construction management',
    ],
  },
  {
    name: 'Furniture & Styling',
    slug: 'furniture-styling',
    icon: '🛋️',
    shortDescription: 'Curating the perfect pieces to complete your vision',
    features: [
      'Custom furniture design',
      'Art curation',
      'Accessory selection',
      'Textile sourcing',
      'Installation coordination',
      'Styling services',
    ],
    process: [
      'Style consultation',
      'Source & selection',
      'Ordering & tracking',
      'Final installation',
    ],
  },
  {
    name: 'Design Consultation',
    slug: 'consultation',
    icon: '💡',
    shortDescription: 'Expert guidance for informed design decisions',
    features: [
      'Color schemes',
      'Layout advice',
      'Material selection',
      'Budget planning',
      'DIY support',
      'Virtual consultations',
    ],
    process: [
      'Initial meeting',
      'Site review',
      'Recommendations',
      'Follow-up support',
    ],
  },
]

export default function ServicesPageClient() {
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
              Our Services
            </div>
            <h1 className="mb-6 font-serif text-5xl font-light tracking-tight md:text-6xl lg:text-7xl">
              Comprehensive Design Solutions
            </h1>
            <p className="mx-auto max-w-[600px] text-lg leading-relaxed text-[hsl(var(--foreground-secondary))]">
              Award-winning full-service interior design for residential and commercial spaces. 500+ projects completed, 15+ years experience. Get your free consultation today.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding">
        <div className="container">
          <motion.div
            {...useStaggerChildren(0.15)}
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
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

      {/* Process Section */}
      <section className="section-padding bg-surface">
        <div className="container">
          <motion.div
            {...useScrollReveal()}
            className="mb-16 text-center"
          >
            <div className="mb-4 inline-block text-[10px] font-ui font-semibold tracking-[0.2em] uppercase text-primary">
              Our Process
            </div>
            <h2 className="mb-6 font-serif text-4xl font-light tracking-tight md:text-5xl">
              How We Work
            </h2>
            <p className="mx-auto max-w-[600px] text-base leading-relaxed text-[hsl(var(--foreground-secondary))]">
              A streamlined, collaborative approach that ensures your vision comes to life seamlessly
            </p>
          </motion.div>

          <motion.div
            {...useStaggerChildren(0.2)}
            className="mx-auto grid max-w-[900px] gap-8 md:grid-cols-2 lg:grid-cols-4"
          >
            {[
              {
                step: '01',
                title: 'Discovery',
                description: 'Understanding your vision, lifestyle, and requirements',
              },
              {
                step: '02',
                title: 'Concept',
                description: 'Developing design concepts and mood boards',
              },
              {
                step: '03',
                title: 'Design',
                description: 'Creating detailed plans and specifications',
              },
              {
                step: '04',
                title: 'Execution',
                description: 'Bringing your vision to life with precision',
              },
            ].map((step) => (
              <motion.div
                key={step.step}
                variants={variants.fadeInUp}
                className="text-center"
              >
                <div className="mb-4 text-4xl font-serif font-light text-primary">
                  {step.step}
                </div>
                <h3 className="mb-3 font-serif text-xl font-light">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-[hsl(var(--foreground-secondary))]">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding-sm">
        <div className="container">
          <motion.div
            {...useScrollReveal()}
            className="relative overflow-hidden rounded-3xl bg-foreground px-12 py-20 text-center md:px-16 md:py-24"
          >
            <div className="absolute inset-0 opacity-5 pattern-grid" />
            <div className="relative">
              <h2 className="mb-6 font-serif text-3xl font-light tracking-tight text-background md:text-4xl lg:text-5xl">
                Ready to Start<br />Your Project?
              </h2>
              <p className="mb-10 mx-auto max-w-[500px] text-base leading-relaxed text-background/70 md:text-lg">
                Join 500+ satisfied clients. Get a free consultation and custom quote for your project. No obligation, expert advice included.
              </p>
              <Button
                size="lg"
                variant="secondary"
                asChild
                className="rounded-full text-xs font-ui font-semibold tracking-[0.15em] uppercase"
              >
                <Link href="/contact">Get Free Consultation & Quote</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}

function ServiceCard({ service }: { service: typeof services[0] }) {
  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      className="group h-full"
    >
      <motion.div
        variants={variants.hoverLift}
        className="card-elevated h-full p-8"
      >
        <motion.div
          className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/5"
          variants={{
            rest: { scale: 1, opacity: 0.5 },
            hover: { scale: 1.5, opacity: 1 },
          }}
        />

        <div className="relative">
          <motion.div
            className="mb-6 text-4xl"
            variants={{
              rest: { scale: 1 },
              hover: { scale: 1.1, rotate: 5 },
            }}
          >
            {service.icon}
          </motion.div>

          <h3 className="mb-4 font-serif text-2xl font-light tracking-tight">
            {service.name}
          </h3>

          <p className="mb-6 text-sm leading-relaxed text-[hsl(var(--foreground-secondary))]">
            {service.shortDescription}
          </p>

          <div className="mb-6 space-y-2">
            <p className="text-xs font-ui font-semibold tracking-[0.15em] uppercase text-[hsl(var(--foreground-tertiary))]">
              What's Included
            </p>
            <ul className="space-y-1 text-sm text-[hsl(var(--foreground-secondary))]">
              {service.features.slice(0, 4).map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <span className="mt-1 text-primary">•</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <Link
            href={`/contact`}
            className="group/link inline-flex items-center gap-2 text-xs font-ui font-semibold tracking-wide text-primary"
          >
            Get Free Quote
            <motion.svg
              className="h-3 w-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              variants={{
                rest: { x: 0 },
                hover: { x: 4 },
              }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </motion.svg>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  )
}
