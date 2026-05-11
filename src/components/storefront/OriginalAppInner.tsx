'use client';

// This file bridges the original Vite App.tsx with Next.js.
// BrowserRouter is imported statically from the router-shim alias.
// AppComponent is memoised outside the component to avoid re-mounting loops.

import React, { Suspense, memo } from 'react';
// react-router-dom is aliased to src/lib/router-shim.tsx in next.config.ts
// so BrowserRouter here is actually our no-op shim that satisfies the context.
import { BrowserRouter } from 'react-router-dom';

// Lazy-import the heavy original App ONCE, outside the component.
const AppComponent = React.lazy(() =>
  import('@bespoint-src/App').then((mod) => ({ default: mod.default }))
);

const Loader = () => (
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
);

interface Props {
  onCategorySelect?: (cat: string) => void;
  onProductSelect?: (p: any | null) => void;
}

function OriginalAppInner({ onCategorySelect, onProductSelect }: Props) {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <AppComponent />
      </Suspense>
    </BrowserRouter>
  );
}

export default memo(OriginalAppInner);
