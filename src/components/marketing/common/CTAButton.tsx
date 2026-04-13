import React from 'react';
import { motion } from 'motion/react';

interface CTAButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  type?: 'button' | 'submit';
}

export default function CTAButton({ children, onClick, className = '', variant = 'primary', type = 'button' }: CTAButtonProps) {
  const variants = {
    primary: 'premium-gradient text-white shadow-xl shadow-brand-blue/20',
    secondary: 'bg-white text-brand-blue shadow-xl shadow-white/10',
    outline: 'glass border border-app-border text-app-text hover:border-brand-blue'
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      type={type}
      onClick={onClick}
      className={`px-8 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all ${variants[variant]} ${className}`}
    >
      {children}
    </motion.button>
  );
}
