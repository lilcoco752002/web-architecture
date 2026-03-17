'use client'

import { motion } from 'framer-motion'
import { useScrollReveal, useStaggerChildren } from '@/lib/motion'

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Residential Client',
    image: '👤',
    quote: 'Transformed our home into a stunning masterpiece. The attention to detail was incredible.',
    rating: 5,
  },
  {
    name: 'Michael Chen',
    role: 'Commercial Client',
    image: '👤',
    quote: 'Professional, creative, and delivered beyond our expectations. Highly recommend!',
    rating: 5,
  },
  {
    name: 'Emma Williams',
    role: 'Residential Client',
    image: '👤',
    quote: 'Best investment we made for our home. The design is timeless and functional.',
    rating: 5,
  },
]

export function SocialProof() {
  return (
    <section className="section-padding bg-[hsl(var(--muted))]">
      <div className="container">
        <motion.div
          {...useScrollReveal()}
          className="mb-12 text-center"
        >
          <div className="mb-4 inline-block text-[10px] font-ui font-semibold tracking-[0.2em] uppercase text-primary">
            Client Reviews
          </div>
          <h2 className="mb-4 font-serif text-3xl font-light tracking-tight md:text-4xl">
            What Our Clients Say
          </h2>
          <div className="flex items-center justify-center gap-2 text-sm">
            <div className="flex gap-1 text-yellow-500">
              {'★★★★★'.split('').map((star, i) => (
                <span key={i}>{star}</span>
              ))}
            </div>
            <span className="text-[hsl(var(--foreground-secondary))]">
              4.9/5 from 250+ reviews
            </span>
          </div>
        </motion.div>

        <motion.div
          {...useStaggerChildren(0.15)}
          className="grid gap-6 md:grid-cols-3"
        >
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function TestimonialCard({ testimonial }: { testimonial: typeof testimonials[0] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="card-elevated p-6"
    >
      <div className="mb-4 flex gap-1 text-yellow-500">
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <span key={i}>★</span>
        ))}
      </div>
      
      <p className="mb-6 text-sm leading-relaxed text-[hsl(var(--foreground-secondary))]">
        "{testimonial.quote}"
      </p>

      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[hsl(var(--muted))] text-2xl">
          {testimonial.image}
        </div>
        <div>
          <p className="font-medium">{testimonial.name}</p>
          <p className="text-xs text-[hsl(var(--foreground-tertiary))]">
            {testimonial.role}
          </p>
        </div>
      </div>
    </motion.div>
  )
}
