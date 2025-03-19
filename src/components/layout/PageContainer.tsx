
import { ReactNode } from 'react';
import { motion } from 'framer-motion';

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1], // Custom ease curve
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1], // Custom ease curve
    }
  }
};

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export const PageContainer = ({
  children,
  className = ''
}: PageContainerProps) => {
  return (
    <motion.div
      className={`max-container min-h-screen pb-20 ${className}`}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      {children}
    </motion.div>
  );
};
