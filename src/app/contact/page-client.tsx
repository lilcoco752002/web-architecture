'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useScrollReveal } from '@/lib/motion'

export default function ContactPageClient() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    projectType: '',
    budget: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          company: formData.company || null,
          source: 'WEBSITE',
          status: 'NEW',
          projectType: formData.projectType || null,
          budget: formData.budget || null,
          notes: formData.message || null,
        }),
      })

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          projectType: '',
          budget: '',
          message: '',
        })
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
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
              Get In Touch
            </div>
            <h1 className="mb-6 font-serif text-5xl font-light tracking-tight md:text-6xl lg:text-7xl">
              Let's Create Something
              <br />
              Beautiful Together
            </h1>
            <p className="mx-auto max-w-[600px] text-lg leading-relaxed text-[hsl(var(--foreground-secondary))]">
              Start with a free consultation. Our award-winning designers are ready to transform your vision into reality. Available in-person or virtually.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-[hsl(var(--foreground-secondary))]">
              <div className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                <span>Free Consultation</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                <span>24hr Response Time</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                <span>No Obligation</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="section-padding">
        <div className="container">
          <div className="grid gap-16 lg:grid-cols-12">
            {/* Contact Form */}
            <motion.div
              {...useScrollReveal()}
              className="lg:col-span-7"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="mb-2 block text-sm font-medium">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-[hsl(var(--border))] bg-background px-4 py-3 text-sm transition-smooth focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-medium">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-[hsl(var(--border))] bg-background px-4 py-3 text-sm transition-smooth focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="phone" className="mb-2 block text-sm font-medium">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-[hsl(var(--border))] bg-background px-4 py-3 text-sm transition-smooth focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  <div>
                    <label htmlFor="company" className="mb-2 block text-sm font-medium">
                      Company
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-[hsl(var(--border))] bg-background px-4 py-3 text-sm transition-smooth focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="Your Company"
                    />
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="projectType" className="mb-2 block text-sm font-medium">
                      Project Type
                    </label>
                    <select
                      id="projectType"
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-[hsl(var(--border))] bg-background px-4 py-3 text-sm transition-smooth focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="">Select type</option>
                      <option value="Residential">Residential Design</option>
                      <option value="Commercial">Commercial Space</option>
                      <option value="Renovation">Renovation</option>
                      <option value="Consultation">Consultation</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="budget" className="mb-2 block text-sm font-medium">
                      Budget Range
                    </label>
                    <select
                      id="budget"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-[hsl(var(--border))] bg-background px-4 py-3 text-sm transition-smooth focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="">Select budget</option>
                      <option value="< $50k">Less than $50k</option>
                      <option value="$50k - $100k">$50k - $100k</option>
                      <option value="$100k - $250k">$100k - $250k</option>
                      <option value="$250k+">$250k+</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="mb-2 block text-sm font-medium">
                    Tell us about your project *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full rounded-lg border border-[hsl(var(--border))] bg-background px-4 py-3 text-sm transition-smooth focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Share your vision, timeline, and any specific requirements..."
                  />
                </div>

                {submitStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-lg bg-green-50 p-4 text-sm text-green-800"
                  >
                    Thank you! We'll get back to you within 24 hours.
                  </motion.div>
                )}

                {submitStatus === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-lg bg-red-50 p-4 text-sm text-red-800"
                  >
                    Something went wrong. Please try again or email us directly.
                  </motion.div>
                )}

                <div className="space-y-2">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full rounded-full text-xs font-ui font-semibold tracking-[0.15em] uppercase sm:w-auto"
                  >
                    {isSubmitting ? 'Sending...' : 'Get Your Free Consultation'}
                  </Button>
                  <p className="text-xs text-[hsl(var(--foreground-tertiary))]">
                    By submitting, you agree to our privacy policy. We respond within 24 hours.
                  </p>
                </div>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              {...useScrollReveal()}
              className="lg:col-span-5"
            >
              <div className="sticky top-32 space-y-12">
                <div>
                  <h3 className="mb-6 font-serif text-2xl font-light">
                    Visit Our Studio
                  </h3>
                  <div className="space-y-4 text-sm text-[hsl(var(--foreground-secondary))]">
                    <p>123 Design Street<br />New York, NY 10001<br />United States</p>
                  </div>
                </div>

                <div>
                  <h3 className="mb-6 font-serif text-2xl font-light">
                    Get In Touch
                  </h3>
                  <div className="space-y-4 text-sm">
                    <p>
                      <span className="block text-xs font-ui font-semibold tracking-[0.15em] uppercase text-[hsl(var(--foreground-tertiary))] mb-1">
                        Email
                      </span>
                      <a href="mailto:hello@luxeinteriors.com" className="text-foreground transition-smooth hover:text-primary">
                        hello@luxeinteriors.com
                      </a>
                    </p>
                    <p>
                      <span className="block text-xs font-ui font-semibold tracking-[0.15em] uppercase text-[hsl(var(--foreground-tertiary))] mb-1">
                        Phone
                      </span>
                      <a href="tel:+15551234567" className="text-foreground transition-smooth hover:text-primary">
                        +1 (555) 123-4567
                      </a>
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="mb-6 font-serif text-2xl font-light">
                    Office Hours
                  </h3>
                  <div className="space-y-2 text-sm text-[hsl(var(--foreground-secondary))]">
                    <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p>Saturday: 10:00 AM - 4:00 PM</p>
                    <p>Sunday: Closed</p>
                  </div>
                </div>

                <div>
                  <h3 className="mb-6 font-serif text-2xl font-light">
                    Follow Us
                  </h3>
                  <div className="flex gap-4">
                    {['Instagram', 'Facebook', 'LinkedIn', 'Pinterest'].map((platform) => (
                      <a
                        key={platform}
                        href="#"
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-[hsl(var(--border))] text-[hsl(var(--foreground-secondary))] transition-smooth hover:border-foreground hover:text-foreground"
                        aria-label={platform}
                      >
                        <span className="text-xs">{platform[0]}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  )
}
