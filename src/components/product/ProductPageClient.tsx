'use client';

import React from 'react';
import { AppProvider } from '@/context/AppProvider';
import { StorefrontShell } from '@/components/storefront/StorefrontShell';

interface Props {
  productId: string;
}

/**
 * ProductPageClient wraps the interactive storefront for a specific product.
 * Loaded with ssr: false from the parent page.tsx.
 */
export function ProductPageClient({ productId }: Props) {
  return (
    <AppProvider>
      <StorefrontShell initialProductId={productId} />
    </AppProvider>
  );
}
