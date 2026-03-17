'use client'

import { motion } from 'framer-motion'
import { useScrollReveal } from '@/lib/motion'

const trustSignals = [
  { icon: '⭐', text: 'Best of Houzz 2024' },
  { icon: '🏆', text: '500+ Projects Completed' },
  { icon: '💯', text: '98% Client Satisfaction' },
  { icon: '📜', text: 'NCIDQ Certified' },
]

export function TrustBar() {
  return (
    <motion.div
      {...useScrollReveal()}
      className="border-y border-[hsl(var(--border))] bg-[hsl(var(--muted))] py-6"
    >
      <div className="container">
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {trustSignals.map((signal, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-sm text-[hsl(var(--foreground-secondary))]"
            >
              <span className="text-xl">{signal.icon}</span>
              <span className="font-medium">{signal.text}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
