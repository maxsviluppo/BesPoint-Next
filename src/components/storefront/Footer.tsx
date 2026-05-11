'use client';

import React from 'react';
import { useApp } from '@/context/AppProvider';
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  MapPin, 
  Phone, 
  Mail, 
  Shield 
} from 'lucide-react';
import { motion } from 'motion/react';

export function Footer() {
  const { companySettings, setIsAdminOpen } = useApp();

  return (
    <footer className="bg-brand-dark text-white pt-20 pb-32 px-6 no-print">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
        {/* Company Info */}
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-brand-yellow rounded-2xl flex items-center justify-center shadow-xl shadow-brand-yellow/10">
              <span className="text-brand-dark font-black text-2xl italic">{companySettings.logo}</span>
            </div>
            <h1 className="text-3xl font-black italic tracking-tighter uppercase">{companySettings.name}</h1>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed font-medium">
            {companySettings.mission}
          </p>
          <div className="flex gap-4">
            {[
              { icon: Facebook, url: companySettings.socials.facebook },
              { icon: Instagram, url: companySettings.socials.instagram },
              { icon: Twitter, url: companySettings.socials.twitter }
            ].map((social, idx) => (
              <motion.a
                key={idx}
                whileHover={{ y: -5, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-blue hover:border-brand-blue transition-all"
              >
                <social.icon className="w-5 h-5" />
              </motion.a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-8 text-brand-yellow italic">Link Rapidi</h3>
          <ul className="space-y-4 text-gray-400 text-sm font-bold">
            {['Chi Siamo', 'Prodotti', 'Offerte', 'Blog', 'Lavora con noi'].map((link) => (
              <li key={link} className="hover:text-white cursor-pointer transition-colors flex items-center gap-2 group">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-yellow opacity-0 group-hover:opacity-100 transition-opacity"></div>
                {link}
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-8 text-brand-yellow italic">Supporto</h3>
          <ul className="space-y-4 text-gray-400 text-sm font-bold">
            {['Centro Assistenza', 'Spedizioni', 'Resi e Rimborsi', 'Privacy Policy', 'Termini e Condizioni'].map((link) => (
              <li key={link} className="hover:text-white cursor-pointer transition-colors flex items-center gap-2 group">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-blue opacity-0 group-hover:opacity-100 transition-opacity"></div>
                {link}
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-8 text-brand-yellow italic">Contatti</h3>
          <ul className="space-y-6 text-gray-400 text-sm font-bold">
            <li className="flex items-start gap-4 group">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-brand-blue transition-colors flex-shrink-0">
                <MapPin className="w-5 h-5 text-brand-blue group-hover:text-white transition-colors" />
              </div>
              <span className="pt-2">{companySettings.legalAddress}</span>
            </li>
            <li className="flex items-start gap-4 group">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-brand-blue transition-colors flex-shrink-0">
                <Phone className="w-5 h-5 text-brand-blue group-hover:text-white transition-colors" />
              </div>
              <span className="pt-2">{companySettings.phone}</span>
            </li>
            <li className="flex items-start gap-4 group">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-brand-blue transition-colors flex-shrink-0">
                <Mail className="w-5 h-5 text-brand-blue group-hover:text-white transition-colors" />
              </div>
              <span className="pt-2">{companySettings.email}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
        <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">
          © 2026 {companySettings.name}. Tutti i diritti riservati - {companySettings.legalName}
        </p>
        
        <div className="flex items-center gap-6">
          <div className="flex gap-2">
             <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4 opacity-30 hover:opacity-100 transition-opacity" />
             <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4 opacity-30 hover:opacity-100 transition-opacity" />
             <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-4 opacity-30 hover:opacity-100 transition-opacity" />
          </div>
          <button
            onClick={() => setIsAdminOpen(true)}
            className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-brand-yellow hover:text-brand-dark transition-all group border border-white/5"
            title="Area Riservata"
          >
            <Shield className="w-5 h-5 opacity-50 group-hover:opacity-100" />
          </button>
        </div>
      </div>
    </footer>
  );
}
