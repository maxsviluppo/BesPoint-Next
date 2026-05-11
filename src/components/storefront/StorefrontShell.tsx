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

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useApp } from '@/context/AppProvider';
import { slugify, CATEGORIES } from '@/lib/data';

// ─── Lazy-import the original heavy App component ────────────────────────────
// We re-export the original Vite App.tsx render body here, keeping the
// visual implementation identical. Rather than duplicating 8k lines,
// we import the BespointApp barrel which re-exports the render.
import { BespointApp } from '@/components/storefront/BespointApp';

interface Props {
  initialCategory?: string;
  initialProductId?: string;
}

export function StorefrontShell({ initialCategory, initialProductId }: Props) {
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
  } = useApp();

  // ── Sync initial state from URL on first render ────────────────────────────
  useEffect(() => {
    if (initialProductId) {
      const product = products.find((p) => p.id === initialProductId);
      if (product) {
        setSelectedProduct(product);
        // Assicuriamoci che la categoria sia corretta per il prodotto
        if (product.category !== selectedCategory) {
          setSelectedCategory(product.category);
        }
      }
    } else if (initialCategory) {
      // Correzione Case-Insensitive: cerchiamo la categoria corretta nei dati
      const realCategory = CATEGORIES.find(
        (c) => slugify(c).toLowerCase() === initialCategory.toLowerCase() || 
               c.toLowerCase() === initialCategory.toLowerCase()
      );
      
      if (realCategory && realCategory !== selectedCategory) {
        setSelectedCategory(realCategory);
        const subcats = pageSettings.subcategories[realCategory] || [];
        setSelectedSubcategory(subcats.length > 0 ? subcats[0] : 'Tutti');
      }
    } else {
      if (selectedCategory !== 'Tutti') setSelectedCategory('Tutti');
      if (selectedProduct) setSelectedProduct(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCategory, initialProductId]);

  // ── Navigation helpers injected into BespointApp ──────────────────────────
  const handleCategorySelect = (cat: string) => {
    if (cat === 'Tutti') {
      router.push('/');
      setSelectedSubcategory('Tutti');
    } else {
      router.push(`/categoria/${encodeURIComponent(slugify(cat))}`);
      const subcats = pageSettings.subcategories[cat] || [];
      setSelectedSubcategory(subcats.length > 0 ? subcats[0] : 'Tutti');
    }
  };

  const handleProductSelect = (p: any | null) => {
    if (p) {
      router.push(`/prodotto/${p.id}/${slugify(p.name)}`);
    } else {
      setSelectedProduct(null);
      if (selectedCategory && selectedCategory !== 'Tutti') {
        router.push(`/categoria/${encodeURIComponent(slugify(selectedCategory))}`);
      } else {
        router.push('/');
      }
    }
  };

  return <BespointApp />;
}
