'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { AppProvider } from '@/context/AppProvider';

// Move dynamic import HERE
const StorefrontShell = dynamic(
  () => import('@/components/storefront/StorefrontShell').then(mod => mod.StorefrontShell),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-16 h-16 bg-brand-yellow rounded-2xl flex items-center justify-center animate-pulse">
          <span className="text-brand-dark font-black text-2xl italic">B</span>
        </div>
      </div>
    )
  }
);

interface Props {
  categoryName: string;
}

/**
 * CategoryClient wraps the interactive storefront for a specific category.
 * This is a 'use client' boundary.
 */
export function CategoryClient({ categoryName }: Props) {
  return (
    <AppProvider>
      <StorefrontShell initialCategory={categoryName} />
    </AppProvider>
  );
}
