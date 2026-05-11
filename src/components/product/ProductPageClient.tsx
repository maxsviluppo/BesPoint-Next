'use client';

import React from 'react';
import { AppProvider } from '@/context/AppProvider';
import { StorefrontShell } from '@/components/storefront/StorefrontShell';

interface Props {
  productId: string;
}

export function ProductPageClient({ productId }: Props) {
  const [mounted, setMounted] = React.useState(false);
  
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <AppProvider>
      <StorefrontShell initialProductId={productId} />
    </AppProvider>
  );
}
