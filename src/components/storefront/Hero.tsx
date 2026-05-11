'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroProps {
  slides: any[];
  overlayEnabled?: boolean;
}

export function Hero({ slides, overlayEnabled = false }: HeroProps) {
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) {
      setHeroIndex(0);
      return;
    }
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (!slides || slides.length === 0) return null;

  return (
    <section className="relative w-full overflow-hidden mb-8 origin-top h-[460px] sm:h-[550px]">
      <div className="h-full w-full relative">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-blue/40 to-transparent z-10" />
        <div className="w-full h-full relative">
          <AnimatePresence mode="wait">
            {slides.map((slide, idx) => (
              idx === heroIndex && (
                <motion.div
                  key={slide.id || idx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                  className="absolute inset-0 w-full h-full z-0"
                >
                  {overlayEnabled && (
                    <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none" />
                  )}

                  {slide.link ? (
                    <a href={slide.link} className="block w-full h-full">
                      <img
                        src={slide.url || "https://picsum.photos/seed/hero/1920/1080"}
                        alt={slide.alt || "Hero Context"}
                        title={slide.title || ""}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </a>
                  ) : (
                    <img
                      src={slide.url || "https://picsum.photos/seed/hero/1920/1080"}
                      alt={slide.alt || "Hero Context"}
                      title={slide.title || ""}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  )}
                </motion.div>
              )
            ))}
          </AnimatePresence>
        </div>

        {/* Navigation Arrows */}
        {slides.length > 1 && (
          <>
            <button
              onClick={() => setHeroIndex((prev) => (prev - 1 + slides.length) % slides.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => setHeroIndex((prev) => (prev + 1) % slides.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 transition-all"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 px-6 z-20 pointer-events-none">
          <motion.div
            key={`content-${heroIndex}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <h2 className="text-4xl sm:text-6xl font-black text-white mb-2 uppercase tracking-tighter drop-shadow-lg italic">
              {slides[heroIndex]?.title || "Le scelte migliori per te"}
            </h2>
            <p className="text-sm sm:text-lg text-white/90 mb-4 font-bold drop-shadow-md">
              {slides[heroIndex]?.alt || "Risparmia fino al 40% su tutta la tecnologia Bespoint."}
            </p>
          </motion.div>
        </div>

        {/* Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setHeroIndex(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                idx === heroIndex ? 'bg-brand-yellow w-8' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
