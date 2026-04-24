// Framer Motion Animation Variants for FinanceTracker

// Container animations for staggered children
export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

// Item animations
export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15
    }
  }
};

// Header fade and slide animations
export const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      delay: 0.1
    }
  }
};

// Sidebar slide in from left
export const sidebarVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      delay: 0.2
    }
  }
};

// Content slide in from right
export const contentVariants = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      delay: 0.3
    }
  }
};

// Page transitions
export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: 20, transition: { duration: 0.3 } }
};

// Card hover effect
export const cardHoverVariants = {
  initial: { scale: 1, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  whileHover: { 
    scale: 1.05, 
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    transition: { duration: 0.3 }
  },
  whileTap: { scale: 0.98 }
};

// Button animations
export const buttonVariants = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 },
  transition: { duration: 0.2 }
};

// Input focus animation
export const inputVariants = {
  whileFocus: { scale: 1.02 },
  transition: { duration: 0.2 }
};

// Search bar animation
export const searchVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { 
    opacity: 1, 
    scale: 1, 
    transition: { delay: 0.3, duration: 0.4 } 
  },
  whileFocus: { scale: 1.02 }
};

// List item animations
export const listItemVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  whileHover: { x: 5 }
};

// Badge/badge animations
export const badgeVariants = {
  initial: { scale: 0, rotate: -180 },
  animate: { scale: 1, rotate: 0, transition: { duration: 0.4 } },
  exit: { scale: 0, rotate: 180 }
};

// Modal animations
export const modalVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
  transition: { duration: 0.3 }
};

// Success/error animations
export const notificationVariants = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 }
};

// Chart animations
export const chartVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, delay: 0.3 }
  }
};

// Form input animations
export const formInputVariants = {
  initial: { opacity: 0, y: 10 },
  animate: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.4
    }
  })
};

// Slide in animations
export const slideInLeft = {
  initial: { opacity: 0, x: -100 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.5 } }
};

export const slideInRight = {
  initial: { opacity: 0, x: 100 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.5 } }
};

export const slideInUp = {
  initial: { opacity: 0, y: 100 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export const slideInDown = {
  initial: { opacity: 0, y: -100 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

// Fade animations
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4 } }
};

export const fadeInScale = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.4 } }
};
