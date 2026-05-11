'use client';

import React, { useMemo } from 'react';
import { useApp } from '@/context/AppProvider';
import { Hero } from './Hero';
import { ChoiceBlocks } from './ChoiceBlocks';
import { SectionTitle } from './SectionTitle';
import { ProductCard } from './ProductCard';
import { motion, AnimatePresence } from 'motion/react';
import { Star } from 'lucide-react';
import { CategoryBanner } from './CategoryBanner';
import { CatalogFilters } from './CatalogFilters';

export function ModularStorefront() {
  const {
    products,
    pageSettings,
    setSelectedCategory,
    setSelectedSubcategory,
    handleProductSelect,
    addToCart,
    productReviews,
    favorites,
    toggleFavorite,
    searchQuery,
    selectedCategory,
    filteredProducts,
    setSelectedBrand,
    setSortBy,
  } = useApp();

  const topSlides = useMemo(() => 
    (pageSettings.homeSlides || []).filter((s: any) => s.position === 'home_top' || !s.position).filter((s: any) => s.url),
    [pageSettings.homeSlides]
  );

  const featuredProducts = useMemo(() => {
    return products.filter((p: any) => p.isFeatured).slice(0, pageSettings.maxFeatured || 8);
  }, [products, pageSettings.maxFeatured]);

  const specialCategoryProducts = useMemo(() => {
    if (!pageSettings.isSpecialCategoryEnabled) return [];
    return products.filter((p: any) => p.isSpecialPromotion)
      .slice(0, pageSettings.specialCategoryMax || 4);
  }, [products, pageSettings.isSpecialCategoryEnabled, pageSettings.specialCategoryMax]);

  const newArrivals = useMemo(() => {
    return [...products].reverse().slice(0, pageSettings.maxNewArrivals || 15);
  }, [products, pageSettings.maxNewArrivals]);

  // If search is active, show only filtered grid
  if (searchQuery !== '') {
    return (
      <div className="px-4 py-12">
        <SectionTitle title="Risultati della ricerca" subtitle={`Trovati ${filteredProducts.length} prodotti`} />
        <CatalogFilters />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product: any, index: number) => (
            <ProductCard 
              key={`search-${product.id}`} 
              product={product} 
              onClick={() => handleProductSelect(product)} 
              onAddToCart={addToCart}
              index={index}
              reviews={productReviews}
              isFavorite={favorites.includes(product.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        key={selectedCategory}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.1 }}
        className={`flex flex-col gap-12 ${selectedCategory === 'Tutti' ? 'pt-0' : 'pt-8'} pb-24`}
      >
        {/* Hero or Category Banner */}
      {selectedCategory === 'Tutti' ? (
        pageSettings.isHeroEnabled && topSlides.length > 0 && (
          <Hero slides={topSlides} overlayEnabled={pageSettings.slidesOverlayEnabled} />
        )
      ) : (
        <CategoryBanner />
      )}

      {/* Choice Blocks (Quick Links) - Only on Home */}
      {selectedCategory === 'Tutti' && pageSettings.isQuickLinksEnabled && (
        <ChoiceBlocks 
          items={pageSettings.linkRapidi || pageSettings.quickLinks || []} 
          onSelect={(cat) => {
            handleCategorySelect(cat);
          }} 
        />
      )}

      {/* Global Filters */}
      <CatalogFilters />

      {/* Home Sections or Category Grid */}
      {selectedCategory === 'Tutti' ? (
        <>
          {/* Featured Products */}
          {pageSettings.isFeaturedEnabled && featuredProducts.length > 0 && (
            <section className="px-4">
              <SectionTitle 
                title={pageSettings.featuredTitle || "IN VETRINA"} 
                subtitle="I prodotti più amati dalla nostra community"
              />
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.map((product: any, index: number) => (
                  <ProductCard 
                    key={`featured-${product.id}`} 
                    product={product} 
                    onClick={() => handleProductSelect(product)} 
                    onAddToCart={addToCart}
                    index={index}
                    reviews={productReviews}
                    isFavorite={favorites.includes(product.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Special Promotion */}
          {pageSettings.isSpecialCategoryEnabled && specialCategoryProducts.length > 0 && (
            <section className="px-4">
              <SectionTitle 
                title={pageSettings.specialCategoryTitle || "SCELTI PER TE"} 
                accentColor="bg-brand-blue"
                subtitle="Offerte esclusive selezionate dai nostri esperti"
              />
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {specialCategoryProducts.map((product: any, index: number) => (
                  <ProductCard 
                    key={`special-${product.id}`} 
                    product={product} 
                    onClick={() => handleProductSelect(product)} 
                    onAddToCart={addToCart}
                    index={index}
                    reviews={productReviews}
                    isFavorite={favorites.includes(product.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
            </section>
          )}

          {/* New Arrivals */}
          {pageSettings.isNewArrivalsEnabled && (
            <section className="px-4">
              <SectionTitle 
                title={pageSettings.newArrivalsTitle || "NUOVI ARRIVI"} 
                subtitle="Le ultime novità appena arrivate in magazzino"
              />
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                {newArrivals.map((product: any, index: number) => (
                  <ProductCard 
                    key={`new-${product.id}`} 
                    product={product} 
                    onClick={() => handleProductSelect(product)} 
                    onAddToCart={addToCart}
                    index={index}
                    reviews={productReviews}
                    isFavorite={favorites.includes(product.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
            </section>
          )}
        </>
      ) : (
        <section className="px-4">
          <SectionTitle 
            title={selectedCategory} 
            subtitle={`${filteredProducts.length} prodotti in questa categoria`}
          />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product: any, index: number) => (
              <ProductCard 
                key={`cat-${product.id}`} 
                product={product} 
                onClick={() => handleProductSelect(product)} 
                onAddToCart={addToCart}
                index={index}
                reviews={productReviews}
                isFavorite={favorites.includes(product.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
          {filteredProducts.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-gray-400 font-bold uppercase tracking-widest">Nessun prodotto trovato con i filtri selezionati.</p>
              <button 
                onClick={() => { setSelectedBrand('Tutti'); setSortBy('newest'); }}
                className="mt-4 text-brand-blue font-black uppercase text-xs hover:underline"
              >
                Resetta Filtri
              </button>
            </div>
          )}
        </section>
      )}

      {/* Reviews Section */}
      <section className="px-4 mb-12">
        <div className="text-center mb-12">
           <div className="inline-flex items-center gap-2 bg-brand-blue/5 text-brand-blue px-4 py-1.5 rounded-full mb-4">
              <Star className="w-4 h-4 fill-brand-blue" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] pt-0.5">Feedback Verificati</span>
            </div>
            <h2 className="text-5xl font-black text-brand-dark uppercase tracking-tighter mb-2 italic">Dicono di noi</h2>
            <p className="text-gray-400 font-bold text-sm">La soddisfazione dei nostri clienti è la nostra priorità assoluta.</p>
        </div>

        <div className="flex overflow-x-auto no-scrollbar gap-6 pb-8 snap-x">
          {productReviews.filter((r: any) => r.status === 'approved').slice(-6).reverse().map((rev: any, idx: number) => (
            <motion.div 
              key={rev.id}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="flex-shrink-0 w-[320px] bg-white border border-gray-100 p-8 rounded-[2.5rem] shadow-xl shadow-brand-dark/5 snap-center relative group"
            >
              <div className="absolute top-8 right-8 text-6xl font-black text-gray-50 opacity-50 select-none group-hover:text-brand-yellow/30 transition-colors">"</div>
              
              <div className="flex gap-1 mb-6">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} className={`w-4 h-4 ${s <= rev.rating ? 'fill-brand-yellow text-brand-yellow' : 'text-gray-100'}`} />
                ))}
              </div>
              
              <p className="text-brand-dark font-medium leading-relaxed mb-6 italic">
                {rev.comment}
              </p>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-yellow rounded-full flex items-center justify-center font-black text-brand-dark text-sm">
                  {rev.customerName[0]}
                </div>
                <div>
                  <p className="text-sm font-black text-brand-dark">{rev.customerName}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{rev.date}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
      </motion.div>
    </AnimatePresence>
  );
}
