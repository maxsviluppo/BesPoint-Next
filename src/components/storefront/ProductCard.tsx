'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Star, Heart, Share2 } from 'lucide-react';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
  onAddToCart: (p: Product) => void;
  index: number;
  reviews?: any[];
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  onShare?: (p: Product) => void;
}

export function ProductCard({
  product,
  onClick,
  onAddToCart,
  index,
  reviews = [],
  isFavorite = false,
  onToggleFavorite,
  onShare,
}: ProductCardProps) {
  const productReviews = reviews.filter(
    (r) => r.productId === product.id && r.status === 'approved'
  );
  const avgRating =
    productReviews.length > 0
      ? productReviews.reduce((s, r) => s + r.rating, 0) / productReviews.length
      : product.rating;
  const reviewCount =
    productReviews.length > 0
      ? productReviews.length + (product.reviews || 0)
      : product.reviews || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.5,
        delay: index * 0.05,
        ease: [0.21, 1.02, 0.73, 1],
      }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      onClick={onClick}
      className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-xl transition-shadow duration-300 relative group cursor-pointer"
    >
      <div className="relative w-full aspect-square mb-3 overflow-hidden rounded-xl bg-gray-50 border border-gray-100 flex-shrink-0">
        {product.image && (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
        )}
        <div className="absolute top-2 left-2 flex flex-col gap-2 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite?.(product.id);
            }}
            className={`transition-all hover:scale-110 active:scale-90 ${
              isFavorite
                ? 'text-red-500 drop-shadow-sm'
                : 'text-white/60 hover:text-red-500 drop-shadow-sm'
            }`}
            title="Aggiungi ai preferiti"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onShare?.(product);
            }}
            className="text-white/60 hover:text-sky-400 transition-all hover:scale-110 active:scale-90 drop-shadow-sm"
            title="Condividi prodotto"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      {product.brand && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[10px] font-black text-brand-yellow uppercase tracking-widest mb-0.5"
        >
          {product.brand}
        </motion.p>
      )}
      <motion.h3
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 + 0.3 }}
        className="text-sm font-medium text-brand-dark line-clamp-2 mb-1 cursor-pointer hover:text-brand-yellow"
      >
        {product.name}
      </motion.h3>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.05 + 0.4 }}
        className="flex items-center gap-1 mb-2"
      >
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star
              key={`card-star-${i}`}
              className={`w-3 h-3 ${
                i < Math.floor(avgRating || 0)
                  ? 'text-brand-yellow fill-brand-yellow'
                  : 'text-gray-200'
              }`}
            />
          ))}
        </div>
        <span className="text-[10px] text-blue-600 font-medium">{reviewCount}</span>
      </motion.div>
      <div className="mt-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 + 0.5 }}
          className="flex items-baseline gap-1 mb-3"
        >
          <span className="text-xs font-bold align-top">€</span>
          <span className="text-xl font-bold">{Math.floor(product.price || 0)}</span>
          <span className="text-xs font-bold">
            {((product.price || 0) % 1).toFixed(2).substring(2)}
          </span>
        </motion.div>
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 + 0.6 }}
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product);
          }}
          className="w-full bg-brand-yellow hover:bg-brand-orange text-brand-dark py-2 rounded-lg text-xs font-bold shadow-sm active:scale-95 transition-all"
        >
          Aggiungi al carrello
        </motion.button>
      </div>
    </motion.div>
  );
}
