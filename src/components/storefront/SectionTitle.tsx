'use client';

import React from 'react';
import { motion } from 'motion/react';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  accentColor?: string;
}

export function SectionTitle({ title, subtitle, accentColor = 'bg-brand-yellow' }: SectionTitleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="flex items-center justify-between mb-8"
    >
      <div className="flex items-center gap-4">
        <div className={`w-2 h-10 ${accentColor} rounded-full`}></div>
        <div>
          <h2 className="text-4xl font-black text-brand-dark uppercase tracking-tighter italic leading-none">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
