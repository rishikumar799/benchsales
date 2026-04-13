import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface RoleCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  path: string;
  benefits: string[];
  gradient?: string;
}

export default function RoleCard({ title, description, icon: Icon, path, benefits, gradient = 'premium-gradient' }: RoleCardProps) {
  const navigate = useNavigate();

  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="p-8 rounded-[40px] glass border border-app-border card-shadow flex flex-col h-full group"
    >
      <div className={`w-16 h-16 rounded-2xl ${gradient} flex items-center justify-center text-white mb-8 shadow-xl shadow-brand-blue/20`}>
        <Icon className="w-8 h-8" />
      </div>
      
      <h3 className="text-2xl font-display font-bold mb-4 tracking-tight">{title}</h3>
      <p className="text-app-muted text-sm leading-relaxed mb-8 flex-grow">{description}</p>
      
      <div className="space-y-4 mb-8">
        {benefits.map((benefit, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-blue" />
            <span className="text-xs font-bold text-app-text uppercase tracking-widest">{benefit}</span>
          </div>
        ))}
      </div>

      <button 
        onClick={() => navigate(path)}
        className="w-full py-4 rounded-2xl border border-brand-blue/20 text-brand-blue text-sm font-bold uppercase tracking-widest hover:bg-brand-blue hover:text-white transition-all flex items-center justify-center gap-2 group-hover:premium-gradient group-hover:text-white group-hover:border-transparent"
      >
        Learn More <ArrowRight className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
