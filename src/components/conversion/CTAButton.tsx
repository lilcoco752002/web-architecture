'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

interface CTAButtonProps {
  href: string
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  urgency?: string
  className?: string
}

export function CTAButton({
  href,
  children,
  variant = 'primary',
  size = 'md',
  urgency,
  className = '',
}: CTAButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center gap-2 rounded-full font-ui font-semibold tracking-[0.15em] uppercase transition-smooth'
  
  const variantClasses = {
    primary: 'bg-foreground text-background hover:bg-foreground/90',
    secondary: 'border-2 border-foreground text-foreground hover:bg-foreground hover:text-background',
  }
  
  const sizeClasses = {
    sm: 'px-6 py-2 text-[10px]',
    md: 'px-8 py-3 text-xs',
    lg: 'px-10 py-4 text-xs',
  }

  return (
    <div className="inline-flex flex-col items-center gap-2">
      <motion.div
        initial="rest"
        whileHover="hover"
        whileTap="tap"
      >
        <Link
          href={href}
          className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        >
          <motion.span>{children}</motion.span>
          <motion.svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            variants={{
              rest: { x: 0 },
              hover: { x: 4 },
              tap: { scale: 0.95 },
            }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </motion.svg>
        </Link>
      </motion.div>
      {urgency && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xs text-[hsl(var(--foreground-tertiary))]"
        >
          {urgency}
        </motion.p>
      )}
    </div>
  )
}
