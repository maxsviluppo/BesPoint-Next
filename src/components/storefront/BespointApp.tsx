'use client';

import dynamic from 'next/dynamic';

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

export function BespointApp() {
  return <OriginalAppInner />;
}
