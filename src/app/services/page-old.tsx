export default function ServicesPage() {
  const services = [
    {
      name: 'Web Design',
      slug: 'web-design',
      description: 'Beautiful, user-centered designs that convert visitors into customers',
      icon: '🎨',
      features: [
        'UI/UX Design',
        'Responsive Layouts',
        'Prototyping',
        'Design Systems',
      ],
    },
    {
      name: 'Web Development',
      slug: 'web-development',
      description: 'Fast, secure, and scalable web applications built with modern technologies',
      icon: '💻',
      features: [
        'Full-Stack Development',
        'React & Next.js',
        'API Development',
        'Performance Optimization',
      ],
    },
    {
      name: 'Branding & Identity',
      slug: 'branding',
      description: 'Create a memorable brand identity that resonates with your audience',
      icon: '🎯',
      features: [
        'Logo Design',
        'Brand Guidelines',
        'Visual Identity',
        'Marketing Materials',
      ],
    },
    {
      name: 'E-Commerce Solutions',
      slug: 'ecommerce',
      description: 'Complete online stores with payment processing and inventory management',
      icon: '🛒',
      features: [
        'Shopify Development',
        'Custom E-Commerce',
        'Payment Integration',
        'Inventory Systems',
      ],
    },
    {
      name: 'SEO & Marketing',
      slug: 'seo-marketing',
      description: 'Drive traffic and increase conversions with data-driven strategies',
      icon: '📈',
      features: [
        'Search Engine Optimization',
        'Content Marketing',
        'Social Media',
        'Analytics & Reporting',
      ],
    },
    {
      name: 'Maintenance & Support',
      slug: 'maintenance',
      description: 'Keep your website running smoothly with ongoing support and updates',
      icon: '🔧',
      features: [
        'Regular Updates',
        'Security Monitoring',
        'Performance Tuning',
        'Technical Support',
      ],
    },
  ]

  return (
    <main>
      <section className="section-padding bg-gradient-to-br from-slate-50 to-white">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-5xl font-bold tracking-tight">Our Services</h1>
            <p className="text-xl text-muted-foreground">
              Comprehensive digital solutions tailored to your business needs
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.slug}
                className="group rounded-lg border bg-card p-8 transition-all hover:shadow-lg"
              >
                <div className="mb-4 text-5xl">{service.icon}</div>
                <h3 className="mb-3 text-2xl font-semibold">{service.name}</h3>
                <p className="mb-6 text-muted-foreground">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center text-sm">
                      <svg
                        className="mr-2 h-4 w-4 text-primary"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M5 13l4 4L19 7"></path>
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-slate-50">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-4xl font-bold">Ready to Get Started?</h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Let's discuss how we can help bring your vision to life
            </p>
            <div className="flex justify-center gap-4">
              <a
                href="/contact"
                className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90"
              >
                Contact Us
              </a>
              <a
                href="/projects"
                className="inline-flex h-11 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                View Projects
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
