'use client';

import React from 'react';
import { AppProvider } from '@/context/AppProvider';
import { StorefrontShell } from '@/components/storefront/StorefrontShell';

interface Props {
  categoryName: string;
}

/**
 * CategoryClient wraps the interactive storefront for a specific category.
 * Loaded with ssr: false from the parent page.tsx.
 */
export function CategoryClient({ categoryName }: Props) {
  return (
    <AppProvider>
      <StorefrontShell initialCategory={categoryName} />
    </AppProvider>
  );
}
