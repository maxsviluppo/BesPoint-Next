'use client';

import React from 'react';
import { motion } from 'motion/react';

interface ChoiceBlocksProps {
  items: any[];
  onSelect: (category: string) => void;
}

export function ChoiceBlocks({ items, onSelect }: ChoiceBlocksProps) {
  if (!items || items.length === 0) return null;

  return (
    <section className="px-4 mb-12">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="mb-6 flex items-center gap-3"
      >
        <div className="w-1.5 h-8 bg-brand-yellow rounded-full"></div>
        <h2 className="text-3xl font-black text-brand-dark uppercase tracking-tighter">
          LE SCELTE MIGLIORI PER TE
        </h2>
      </motion.div>
      <div className="flex overflow-x-auto lg:grid lg:grid-cols-12 lg:grid-rows-2 lg:h-[450px] no-scrollbar gap-4 pb-4">
        {items.map((item: any, idx: number) => (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 20 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{
              type: 'spring',
              stiffness: 100,
              damping: 15,
              delay: idx * 0.1,
            }}
            key={item.id || idx}
            onClick={() => {
              onSelect(item.category || 'Tutti');
            }}
            className={`${item.imageUrl ? 'bg-gray-800' : item.color || 'bg-brand-blue'} rounded-3xl p-6 h-48 lg:h-full min-w-[200px] flex flex-col justify-between overflow-hidden relative group cursor-pointer flex-shrink-0 shadow-lg ${
              idx === 0 ? 'lg:col-span-4 lg:row-span-2' :
              idx === 1 ? 'lg:col-span-4 lg:row-span-1' :
              idx === 2 ? 'lg:col-span-4 lg:row-span-1' :
              idx === 3 ? 'lg:col-span-2 lg:row-span-1' :
              idx === 4 ? 'lg:col-span-3 lg:row-span-1' :
              idx === 5 ? 'lg:col-span-3 lg:row-span-1' :
              'lg:hidden'
            }`}
          >
            {/* Background image if set */}
            {item.imageUrl && (
              <img
                src={item.imageUrl}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            )}
            {/* Dark overlay for readability */}
            {item.imageUrl && (
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
            )}
            
            <div className="z-10 relative">
              <h3 className="text-white font-black text-xl mb-1 drop-shadow-md uppercase tracking-tighter italic">
                {item.title}
              </h3>
              <p className={`${!item.imageUrl && item.color === 'bg-brand-yellow' ? 'text-brand-blue' : 'text-brand-yellow'} text-xs font-black uppercase tracking-widest drop-shadow-sm`}>
                {item.subtitle}
              </p>
            </div>

            {!item.imageUrl && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
                whileInView={{ opacity: 0.5, scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 + 0.3, type: 'spring' }}
                className="absolute right-[-20px] bottom-[-20px] w-32 h-32 bg-white/10 rounded-full group-hover:scale-110 transition-transform"
              />
            )}
            
            <div className="absolute bottom-6 right-6 z-10 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 transition-transform">
               <div className="w-10 h-10 bg-brand-yellow rounded-full flex items-center justify-center text-brand-dark shadow-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
               </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
