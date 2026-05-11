import type { Metadata } from 'next';
import { CATEGORIES } from '@/lib/data';

export const metadata: Metadata = {
  title: 'BesPoint — Illuminazione, Sicurezza e Fai-da-te',
  description: 'Scopri il miglior store online per illuminazione LED, sistemi di sicurezza smart e strumenti per il bricolage.',
  // ... (rest of metadata)
};

export default function Home() {
  // The layout StorefrontShell automatically renders ModularStorefront for the home path.
  // We return null here to avoid duplication, as the shell persists in the layout.
  return null;
}
