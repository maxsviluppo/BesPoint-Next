'use client';

/**
 * StorefrontShell — the main interactive shell of BesPoint.
 *
 * This is a direct port of the original Vite+React App.tsx rendered view,
 * wrapped inside the Next.js App Router architecture.
 * All original functionality is preserved: product browsing, cart, auth,
 * checkout, admin panel, etc.
 *
 * The original src/App.tsx from the Vite project is imported at build time
 * via a path alias. This avoids duplication and keeps both projects in sync.
 *
 * Router: next/navigation replaces react-router-dom.
 * The useRouter / usePathname hooks from next/navigation are injected below.
 */

import { useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useApp } from '@/context/AppProvider';
import { slugify, CATEGORIES } from '@/lib/data';
import { motion, AnimatePresence } from 'motion/react';

// ─── Lazy-import the original heavy App component ────────────────────────────
// We re-export the original Vite App.tsx render body here, keeping the
// visual implementation identical. Rather than duplicating 8k lines,
// we import the BespointApp barrel which re-exports the render.
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import { ModularStorefront } from '@/components/storefront/ModularStorefront';
import { BespointApp } from '@/components/storefront/BespointApp';

interface Props {
  initialCategory?: string;
  initialProductId?: string;
  children?: React.ReactNode;
}

export function StorefrontShell({ children }: { children?: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const {
    products,
    setSelectedCategory,
    setSelectedProduct,
    setSelectedSubcategory,
    selectedCategory,
    selectedProduct,
    pageSettings,
    isAdminOpen,
    isCartOpen,
    isCheckoutOpen,
    isAuthOpen,
    handleCategorySelect,
  } = useApp();

  // ── Sync state with URL automatically ──────────────────────────────────────
  useEffect(() => {
    const parts = pathname.split('/').filter(Boolean);
    
    if (parts[0] === 'prodotto' && parts[1]) {
      const productId = parts[1];
      const product = products.find((p) => p.id === productId);
      if (product) {
        setSelectedProduct(product);
      }
    } else {
      // If we are NOT on a product page, always clear selectedProduct
      if (selectedProduct) setSelectedProduct(null);
      
      if (parts[0] === 'categoria' && parts[1]) {
        const catSlug = parts[1];
        const realCategory = CATEGORIES.find((c) => slugify(c).toLowerCase() === catSlug.toLowerCase());
        
        if (realCategory && realCategory !== selectedCategory) {
          setSelectedCategory(realCategory);
          const subcats = pageSettings.subcategories[realCategory] || [];
          setSelectedSubcategory(subcats.length > 0 ? subcats[0] : 'Tutti');
        }
      } else if (pathname === '/') {
        if (selectedCategory !== 'Tutti') {
          setSelectedCategory('Tutti');
        }
      }
    }
  }, [pathname, products, pageSettings.subcategories]);

  const isProductPage = pathname.startsWith('/prodotto');

  const wasAdminOpen = useRef(isAdminOpen);
  useEffect(() => {
    if (wasAdminOpen.current && !isAdminOpen) {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
    wasAdminOpen.current = isAdminOpen;
  }, [isAdminOpen]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative">
      {/* Browsing Layer (Header is shared) */}
      <Header onCategorySelect={handleCategorySelect} />
      
      <main className="flex-grow">
        <ModularStorefront />
        {isProductPage && children}
      </main>
      
      <Footer />

      {/* Headless Layer (Legacy Modals & Admin) */}
      <BespointApp />
    </div>
  );
}
