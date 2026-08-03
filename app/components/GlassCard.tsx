'use client';

import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  glow?: 'emerald' | 'cyan' | 'violet' | 'none';
}

export function GlassCard({ children, className, delay = 0, glow = 'none' }: GlassCardProps) {
  const glowMap = {
    emerald: 'shadow-neon-emerald border-neon-emerald/30',
    cyan: 'shadow-neon-cyan border-neon-cyan/30',
    violet: 'shadow-neon-violet border-neon-violet/30',
    none: ''
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={cn(
        'glass-panel p-6 transition-all duration-300 hover:bg-glass-hover',
        glowMap[glow],
        className
      )}
    >
      {children}
    </motion.div>
  );
}
