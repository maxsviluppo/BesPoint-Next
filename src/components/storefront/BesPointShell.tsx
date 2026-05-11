'use client';

/**
 * BesPointShell — the true client-side entry point.
 * This file runs ONLY in the browser (loaded via ssr: false from HomeClient).
 * It safely imports AppProvider and the legacy app code.
 */

import React from 'react';
import { AppProvider } from '@/context/AppProvider';
import { BespointApp } from '@/components/storefront/BespointApp';

export default function BesPointShell() {
  return (
    <AppProvider>
      <BespointApp />
    </AppProvider>
  );
}
