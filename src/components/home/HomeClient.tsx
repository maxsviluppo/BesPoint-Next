'use client';

import React from 'react';
import { AppProvider } from '@/context/AppProvider';
import { StorefrontShell } from '@/components/storefront/StorefrontShell';

/**
 * HomeClient wraps the entire interactive storefront with the AppProvider.
 * This is a 'use client' boundary — everything inside uses client-side React.
 * The parent page.tsx is a Server Component that provides SSR/SSG metadata.
 */
export function HomeClient() {
  const [mounted, setMounted] = React.useState(false);
  
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-16 h-16 bg-brand-yellow rounded-2xl flex items-center justify-center animate-pulse">
          <span className="text-brand-dark font-black text-2xl italic">B</span>
        </div>
      </div>
    );
  }

  return (
    <AppProvider>
      <StorefrontShell />
    </AppProvider>
  );
}
