import React from 'react';
import { motion } from 'motion/react';

interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  containerClassName?: string;
}

export default function SectionWrapper({ children, className = '', id, containerClassName = '' }: SectionWrapperProps) {
  return (
    <section id={id} className={`py-24 overflow-hidden ${className}`}>
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${containerClassName}`}>
        {children}
      </div>
    </section>
  );
}
