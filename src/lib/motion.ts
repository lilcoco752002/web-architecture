/**
 * Motion Library - Premium Micro-Interactions
 * World-class animation system for luxury interfaces
 */

export const transitions = {
  // Smooth, natural movement (default for most interactions)
  smooth: {
    type: "spring" as const,
    stiffness: 300,
    damping: 30,
  },
  
  // Quick UI responses (buttons, hovers)
  quick: {
    type: "spring" as const,
    stiffness: 400,
    damping: 35,
  },
  
  // Slow, luxurious reveals (hero sections, large images)
  luxury: {
    type: "spring" as const,
    stiffness: 100,
    damping: 25,
  },
  
  // Tween for precise control (page transitions)
  precise: {
    duration: 0.3,
    ease: [0.43, 0.13, 0.23, 0.96] as [number, number, number, number],
  },
  
  // Bouncy (playful interactions)
  bouncy: {
    type: "spring" as const,
    stiffness: 500,
    damping: 20,
  },
}

export const variants = {
  // Fade in from bottom (scroll reveals)
  fadeInUp: {
    initial: { 
      opacity: 0, 
      y: 24 
    },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: transitions.smooth,
    },
    exit: { 
      opacity: 0, 
      y: -24,
      transition: transitions.quick,
    },
  },
  
  // Scale in (modals, dropdowns)
  scaleIn: {
    initial: { 
      opacity: 0, 
      scale: 0.95 
    },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: transitions.smooth,
    },
    exit: { 
      opacity: 0, 
      scale: 0.95,
      transition: transitions.quick,
    },
  },
  
  // Slide in from left
  slideInLeft: {
    initial: { 
      opacity: 0, 
      x: -24 
    },
    animate: { 
      opacity: 1, 
      x: 0,
      transition: transitions.smooth,
    },
  },
  
  // Slide in from right
  slideInRight: {
    initial: { 
      opacity: 0, 
      x: 24 
    },
    animate: { 
      opacity: 1, 
      x: 0,
      transition: transitions.smooth,
    },
  },
  
  // Staggered children container
  staggerContainer: {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
      },
    },
  },
  
  // Hover lift (cards)
  hoverLift: {
    rest: { 
      y: 0, 
      scale: 1 
    },
    hover: { 
      y: -8, 
      scale: 1.01,
      transition: transitions.quick,
    },
    tap: {
      y: -4,
      scale: 0.99,
      transition: transitions.quick,
    },
  },
  
  // Image zoom on hover
  imageZoom: {
    rest: { scale: 1 },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.6,
        ease: [0.43, 0.13, 0.23, 0.96],
      },
    },
  },
  
  // Reveal mask (text reveals)
  revealMask: {
    initial: {
      clipPath: 'inset(0 100% 0 0)',
    },
    animate: {
      clipPath: 'inset(0 0% 0 0)',
      transition: {
        duration: 0.8,
        ease: [0.77, 0, 0.175, 1],
      },
    },
  },
  
  // Line draw (decorative lines)
  lineDraw: {
    initial: {
      pathLength: 0,
      opacity: 0,
    },
    animate: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 1, ease: "easeInOut" },
        opacity: { duration: 0.01 },
      },
    },
  },
}

/**
 * Scroll reveal hook
 * Usage: <motion.div {...useScrollReveal()}>
 */
export const useScrollReveal = (options = {}) => ({
  initial: "hidden",
  whileInView: "visible",
  viewport: { once: true, margin: "-100px", ...options },
  variants: {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.43, 0.13, 0.23, 0.96],
      },
    },
  },
})

/**
 * Stagger children hook
 * Usage: <motion.div {...useStaggerChildren()}>
 */
export const useStaggerChildren = (stagger = 0.1, delay = 0) => ({
  initial: "hidden",
  animate: "visible",
  variants: {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  },
})

/**
 * Page transition variants
 */
export const pageTransition = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.43, 0.13, 0.23, 0.96],
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: [0.43, 0.13, 0.23, 0.96],
    },
  },
}

/**
 * Magnetic cursor effect
 * Apply to buttons/links for premium feel
 */
export const useMagnetic = (strength = 0.3) => {
  return {
    onMouseMove: (e: React.MouseEvent<HTMLElement>) => {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2
      
      e.currentTarget.style.transform = `translate(${x * strength}px, ${y * strength}px)`
    },
    onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
      e.currentTarget.style.transform = 'translate(0, 0)'
    },
  }
}

/**
 * Smooth scroll to element
 */
export const smoothScrollTo = (elementId: string) => {
  const element = document.getElementById(elementId)
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }
}
