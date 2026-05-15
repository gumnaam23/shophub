import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className = '', hover = true }: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -5, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" } : {}}
      transition={{ duration: 0.3 }}
      className={`bg-white rounded-xl overflow-hidden shadow-md ${className}`}
    >
      {children}
    </motion.div>
  );
}