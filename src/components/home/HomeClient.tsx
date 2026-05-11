'use client';

import React from 'react';
import { AppProvider } from '@/context/AppProvider';
import { StorefrontShell } from '@/components/storefront/StorefrontShell';

/**
 * HomeClient wraps the entire interactive storefront with the AppProvider.
 * This component is loaded with ssr: false from the parent page.tsx.
 */
export function HomeClient() {
  return (
    <AppProvider>
      <StorefrontShell />
    </AppProvider>
  );
}
