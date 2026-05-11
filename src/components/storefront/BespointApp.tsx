'use client';

/**
 * BespointApp — direct port of the original Vite/React App.tsx render body.
 *
 * Rather than duplicating 8000+ lines, this file:
 * 1. Imports all the original sub-components from the Vite source via the
 *    path alias `@bespoint-src` configured in next.config.ts
 * 2. Provides a thin wrapper that replaces react-router-dom navigation
 *    with the Next.js router callbacks passed from StorefrontShell.
 *
 * The original source files (App.tsx, AdminSingleProduct.tsx, etc.) are NOT
 * modified — they are read-only references.
 */

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Lazy-load the heavy original App to avoid SSR issues
// (it uses browser APIs like localStorage heavily)
const OriginalAppInner = dynamic(
  () => import('./OriginalAppInner'),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-brand-yellow rounded-2xl flex items-center justify-center animate-pulse shadow-xl">
            <span className="text-brand-dark font-black text-2xl italic">B</span>
          </div>
          <p className="text-xs font-black uppercase tracking-widest text-gray-400 animate-pulse">
            Caricamento BesPoint...
          </p>
        </div>
      </div>
    ),
  }
);

interface Props {
  onCategorySelect: (cat: string) => void;
  onProductSelect: (p: any | null) => void;
}

export function BespointApp({ onCategorySelect, onProductSelect }: Props) {
  return (
    <Suspense>
      <OriginalAppInner
        onCategorySelect={onCategorySelect}
        onProductSelect={onProductSelect}
      />
    </Suspense>
  );
}
