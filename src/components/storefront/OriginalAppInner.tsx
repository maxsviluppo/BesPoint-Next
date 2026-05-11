'use client';

// This file bridges the original Vite App.tsx with Next.js.
// It re-exports the entire original App as-is, replacing only the router.

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useApp } from '@/context/AppProvider';

// Original sub-components (path alias @bespoint-src → bespoint-main/src)
// These files are NOT modified.
import { AdminSingleProduct } from '@bespoint-src/AdminSingleProduct';
import { AdminMassiveImport } from '@bespoint-src/AdminMassiveImport';
import { AdminImageLinker } from '@bespoint-src/AdminImageLinker';
import { AdminOrders, INITIAL_ORDERS } from '@bespoint-src/AdminOrders';
import { AdminCouriers } from '@bespoint-src/AdminCouriers';
import { AdminReturns } from '@bespoint-src/AdminReturns';
import { AdminUsers } from '@bespoint-src/AdminUsers';
import { AdminReviews } from '@bespoint-src/AdminReviews';
import { PRODUCTS, CATEGORIES, SUBCATEGORIES } from '@bespoint-src/data';

interface Props {
  onCategorySelect: (cat: string) => void;
  onProductSelect: (p: any | null) => void;
}

export default function OriginalAppInner({ onCategorySelect, onProductSelect }: Props) {
  const app = useApp();

  // Mount the original App logic but replace navigate() with Next.js callbacks
  // We dynamically import App.tsx render body and pass props through
  const AppComponent = React.lazy(() =>
    import('@bespoint-src/App').then((mod) => {
      return { default: mod.default };
    })
  );

  // Use the BrowserRouter from our shim (which is aliased to react-router-dom)
  // to provide the necessary context for the legacy App.
  const { BrowserRouter } = require('react-router-dom');

  return (
    <React.Suspense fallback={null}>
      <BrowserRouter>
        <AppComponent />
      </BrowserRouter>
    </React.Suspense>
  );
}
