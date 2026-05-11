'use client';

import React, { useRef, useState } from 'react';
import { motion, useScroll, useSpring, useTransform, useMotionValueEvent, AnimatePresence } from 'motion/react';
import { 
  Menu, 
  Search, 
  User, 
  ShoppingCart, 
  Home, 
  ChevronRight,
  X
} from 'lucide-react';
import { useApp } from '@/context/AppProvider';
import { slugify } from '@/lib/data';

interface HeaderProps {
  onCategorySelect: (cat: string) => void;
}

export function Header({ onCategorySelect }: HeaderProps) {
  const {
    companySettings,
    pageSettings,
    selectedCategory,
    selectedSubcategory,
    setSelectedSubcategory,
    searchQuery,
    setSearchQuery,
    cartCount,
    setIsCartOpen,
    setIsSideMenuOpen,
    setIsAuthOpen,
    currentUser,
    setAuthStep,
    cartTrigger,
    isDesktop
  } = useApp();

  const { scrollY } = useScroll();
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const lastScrollY = useRef(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsHeaderHidden(latest > 100);
    lastScrollY.current = latest;
  });

  const smoothScrollY = useSpring(scrollY, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Header animations - define all transforms unconditionally to follow Rules of Hooks
  const desktopHeight = useTransform(smoothScrollY, [0, 1], [64, 64]);
  const mobileHeight = useTransform(smoothScrollY, [0, 100], [64, 0]);
  const headerTopHeight = useSpring(isDesktop ? desktopHeight : mobileHeight, { stiffness: 400, damping: 40 });
  
  const desktopOpacity = useTransform(smoothScrollY, [0, 1], [1, 1]);
  const mobileOpacity = useTransform(smoothScrollY, [0, 80], [1, 0]);
  const headerTopOpacity = useSpring(isDesktop ? desktopOpacity : mobileOpacity, { stiffness: 400, damping: 40 });
  
  const desktopScale = useTransform(smoothScrollY, [0, 1], [1, 1]);
  const mobileScale = useTransform(smoothScrollY, [0, 100], [1, 0.98]);
  const headerTopScale = useSpring(isDesktop ? desktopScale : mobileScale, { stiffness: 400, damping: 40 });

  const headerShadowOpacity = useTransform(smoothScrollY, [0, 100], [0, 0.2]);

  return (
    <motion.header 
      style={{ 
        boxShadow: useTransform(headerShadowOpacity, (v) => `0 10px 30px -10px rgba(0,0,0,${v})`)
      }}
      className="sticky top-0 z-40 bg-gradient-to-b from-[#111111] to-black"
    >
      {/* Top Bar (Promo Marquee) */}
      <div className="bg-gradient-to-r from-neutral-900 via-black to-neutral-900 border-b border-gray-800 text-white overflow-hidden relative" style={{ height: '36px' }}>
        {pageSettings.topBarMode === 'image' && pageSettings.topBarImage ? (
          <img src={pageSettings.topBarImage} className="w-full h-full object-cover" />
        ) : pageSettings.topBarMode === 'marquee' ? (
          <div className="h-full flex items-center">
            <motion.div
              animate={{ x: ["100%", "-100%"] }}
              transition={{ duration: pageSettings.topBarMarqueeSpeed || 20, repeat: Infinity, ease: "linear" }}
              className="whitespace-nowrap text-[10px] font-black uppercase tracking-[0.2em] px-4"
            >
              {pageSettings.topBarMarqueeText || "Consegna rapida in tutta Italia | Resi facili entro 30 giorni | Supporto clienti 24/7"}
            </motion.div>
          </div>
        ) : (
          <div className="px-4 h-full flex items-center justify-between text-[10px] font-black uppercase tracking-widest w-full opacity-70">
            <div className="flex items-center gap-2">
              <span>{pageSettings.topBarLeftText || `Consegna a Massimo - Roma`}</span>
            </div>
            <div className="flex items-center gap-4">
              <span>{pageSettings.topBarRightText || `Aiuto Resi e Ordine`}</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Header Row */}
      <motion.div 
        style={{ height: headerTopHeight, opacity: headerTopOpacity, scale: headerTopScale }}
        className="px-4 flex items-center justify-between gap-4 overflow-hidden origin-top"
      >
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsSideMenuOpen(true)}
            className="text-white hover:text-brand-yellow transition-colors"
          >
            <Menu className="w-7 h-7" />
          </button>
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onCategorySelect("Tutti")}>
            <div className={companySettings.imageLogo ? "h-10 flex items-center" : "w-10 h-10 bg-brand-yellow rounded-xl flex items-center justify-center overflow-hidden shadow-lg shadow-brand-yellow/10"}>
              {companySettings.imageLogo ? (
                <img src={companySettings.imageLogo} alt="Logo" className="h-full object-contain" referrerPolicy="no-referrer" />
              ) : (
                <span className="text-brand-dark font-black text-2xl italic">{companySettings.logo || 'B'}</span>
              )}
            </div>
            {!companySettings.imageLogo && (
              <h1 className="text-2xl font-black tracking-tighter text-white italic uppercase">{companySettings.name}</h1>
            )}
          </div>
        </div>
        
        {/* Desktop Search */}
        <div className="flex-1 relative hidden md:block max-w-xl">
          <input 
            type="text" 
            placeholder={`Cerca su ${companySettings.name}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 bg-white rounded-xl pl-5 pr-12 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-brand-yellow/20 transition-all"
          />
          <button className="absolute right-0 top-0 h-full px-4 text-brand-dark hover:text-brand-blue transition-colors">
            <Search className="w-5 h-5" />
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              if (currentUser) {
                setAuthStep('profile');
              } else {
                setAuthStep('email');
              }
              setIsAuthOpen(true);
            }}
            className="flex flex-col items-center text-white hover:text-brand-yellow transition-all group"
          >
            <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest mt-1">{currentUser ? currentUser.name.split(' ')[0] : 'Accedi'}</span>
          </button>
          
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center text-white gap-2 group"
          >
            <motion.div 
              key={cartTrigger}
              animate={cartTrigger > 0 ? { scale: [1, 1.2, 1], rotate: [0, -10, 10, 0] } : {}}
              className="relative"
            >
              <ShoppingCart className="w-7 h-7 group-hover:text-brand-yellow transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-yellow text-brand-dark text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-brand-dark shadow-lg">
                  {cartCount}
                </span>
              )}
            </motion.div>
            <div className="hidden sm:flex flex-col items-start leading-none">
               <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Il tuo</span>
               <span className="text-sm font-black uppercase tracking-tighter">Carrello</span>
            </div>
          </button>
        </div>
      </motion.div>

      {/* Navigation / Categories Row - Liquid Design */}
      <div className="bg-[#0f0f0f]/80 backdrop-blur-xl border-t border-white/5 px-4 py-4 flex items-center overflow-hidden">
        <div className="flex overflow-x-auto no-scrollbar gap-2 items-center flex-1 scroll-smooth">
          {/* Home Button */}
          <button 
            onClick={() => onCategorySelect("Tutti")}
            className="relative flex-shrink-0 mr-4"
          >
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 ${selectedCategory === "Tutti" ? "bg-brand-yellow text-brand-dark shadow-[0_0_20px_rgba(255,216,20,0.3)]" : "bg-white/5 text-white/40 hover:bg-white/10"}`}>
              <Home className="w-5 h-5" />
            </div>
          </button>

          <div className="h-6 w-[1px] bg-white/10 mr-4 flex-shrink-0" />

          {/* Categories List */}
          <div className="flex items-center gap-1">
            {selectedCategory === "Tutti" ? (
              // Case 1: Main Categories view
              pageSettings.categories.filter((c: string) => c !== "Tutti").map((cat: string, idx: number) => (
                <button
                  key={`main-${cat}`}
                  onClick={() => onCategorySelect(cat)}
                  className="relative px-6 py-2.5 flex-shrink-0 transition-all duration-500 group"
                >
                  <span className="relative z-10 text-[13px] font-black uppercase tracking-tight italic text-white/40 group-hover:text-white transition-colors">
                    {cat}
                  </span>
                </button>
              ))
            ) : (
              // Case 2: Selected Category + its Subcategories
              <div className="flex items-center gap-1">
                {/* The Active Main Category */}
                <button
                  onClick={() => onCategorySelect("Tutti")}
                  className="relative px-6 py-2.5 flex-shrink-0 transition-all duration-500"
                >
                  <motion.div 
                    layoutId="activePill"
                    className="absolute inset-0 bg-brand-yellow rounded-2xl shadow-[0_0_20px_rgba(255,216,20,0.2)]"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                  <span className="relative z-10 text-[13px] font-black uppercase tracking-tight italic text-brand-dark">
                    {selectedCategory}
                  </span>
                </button>

                <div className="h-4 w-[1px] bg-white/10 mx-2 flex-shrink-0" />

                {/* Subcategories */}
                {(pageSettings.subcategories[selectedCategory] || []).filter((c: string) => c !== "Tutti").map((sub: string, idx: number) => {
                  const isSubActive = selectedSubcategory === sub;
                  return (
                    <motion.button
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      key={`sub-${sub}`}
                      onClick={() => setSelectedSubcategory(sub)}
                      className="relative px-5 py-2.5 flex-shrink-0 transition-all duration-500 group"
                    >
                      {isSubActive && (
                        <motion.div 
                          layoutId="activeSubPill"
                          className="absolute inset-b-0 bottom-1 left-5 right-5 h-0.5 bg-brand-yellow rounded-full"
                        />
                      )}
                      <span className={`relative z-10 text-[12px] font-bold uppercase tracking-tight italic transition-colors ${isSubActive ? "text-white" : "text-white/40 group-hover:text-white"}`}>
                        {sub}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search (Hidden on scroll down) */}
      <AnimatePresence>
        {!isHeaderHidden && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-4 py-3 md:hidden border-t border-white/5 bg-black/20"
          >
            <div className="relative">
              <input 
                type="text" 
                placeholder="Cerca su Bespoint..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 bg-white rounded-xl pl-5 pr-12 text-base font-bold shadow-2xl focus:outline-none"
              />
              <button className="absolute right-0 top-0 h-full px-5 text-brand-dark">
                <Search className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
