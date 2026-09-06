import React, { useState } from 'react';
import Fuse from 'fuse.js';
import { useLocation, Link } from 'react-router-dom';
import { Search, Star, ShoppingBag, Heart, LayoutGrid, List } from 'lucide-react';
import Header from '../components/Header';
import { useCart } from '../context/CartContext';
import { useData } from '../context/DataContext';
import ScrollReveal from '../components/ScrollReveal';
import MediaDisplay from '../components/MediaDisplay';
import { ProductCardSkeleton } from '../components/Skeleton';
import YMMFilter from '../components/YMMFilter';

export default function CategoryPage() {
  const location = useLocation();
  const [activeBrand, setActiveBrand] = useState('All');
  const [activePrice, setActivePrice] = useState('All');
  const [activeCategory, setActiveCategory] = useState(location.state?.category || 'All');
  const [searchQuery, setSearchQuery] = useState(location.state?.searchQuery || '');
  const [ymm, setYmm] = useState(location.state?.ymm || { make: '', model: '', year: '' });
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('Popular');
  const [visibleCount, setVisibleCount] = useState(24);

  React.useEffect(() => {
    setVisibleCount(24);
  }, [activeBrand, activePrice, activeCategory, searchQuery, ymm, sortBy]);

  React.useEffect(() => {
    if (location.state) {
      if (location.state.category !== undefined) setActiveCategory(location.state.category || 'All');
      setActiveBrand('All');
      setActivePrice('All');
      if (location.state.searchQuery !== undefined) {
        setSearchQuery(location.state.searchQuery);
      }
      if (location.state.ymm !== undefined) {
        setYmm(location.state.ymm);
      }
    }
  }, [location.state]);

  const observerRef = React.useRef(null);
  const loadMoreRef = React.useCallback(node => {
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setVisibleCount(prev => prev + 24);
      }
    }, { rootMargin: '600px' }); // Trigger load well before user reaches bottom

    if (node) observerRef.current.observe(node);
  }, []);

  const { addToCart, toggleWishlist, isInCart, isWishlisted } = useCart();
  const { categories: ALL_CATEGORIES, products: PRODUCTS, loading } = useData();

  const BRANDS = ['All', ...new Set(PRODUCTS.map(p => p.brand).filter(Boolean))];

  // Filter logic
  let filteredProducts = [...PRODUCTS];

  if (activeCategory !== 'All') {
    filteredProducts = filteredProducts.filter(p => p.category === activeCategory);
  }

  // YMM Filter Logic
  if (ymm.make) {
    const searchMake = ymm.make.toLowerCase();
    filteredProducts = filteredProducts.filter(p => (p.brand || '').toLowerCase().includes(searchMake) || (p.category || '').toLowerCase().includes(searchMake) || (p.name || '').toLowerCase().includes(searchMake));
  }
  if (ymm.model) {
    const modelTerms = ymm.model.toLowerCase().split(' ');
    filteredProducts = filteredProducts.filter(p => {
      const text = `${p.name} ${p.description || ''}`.toLowerCase();
      // Match all parts of the model name (e.g. "Pulsar" and "150")
      return modelTerms.every(term => text.includes(term));
    });
  }
  if (ymm.year) {
    filteredProducts = filteredProducts.filter(p => {
      const text = `${p.name} ${p.description || ''}`.toLowerCase();
      return text.includes(ymm.year);
    });
  }

  if (searchQuery.trim() !== '') {
    const fuse = new Fuse(filteredProducts, {
      keys: ['name', 'brand', 'category', 'tag', 'description'],
      threshold: 0.4,
      ignoreLocation: true,
      useExtendedSearch: true,
      ignoreFieldNorm: true,
      distance: 1000,
    });
    filteredProducts = fuse.search(searchQuery).map(r => r.item);
  }

  if (activePrice === 'Under ₹500') {
    filteredProducts = filteredProducts.filter(p => p.price < 500);
  } else if (activePrice === '₹500 – ₹1000') {
    filteredProducts = filteredProducts.filter(p => p.price >= 500 && p.price <= 1000);
  } else if (activePrice === '₹1000 – ₹2000') {
    filteredProducts = filteredProducts.filter(p => p.price > 1000 && p.price <= 2000);
  } else if (activePrice === 'Above ₹2000') {
    filteredProducts = filteredProducts.filter(p => p.price > 2000);
  }
  
  // Sorting logic
  if (sortBy === 'Price: Low to High') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'Price: High to Low') {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'Rating') {
    filteredProducts.sort((a, b) => b.rating - a.rating);
  }

  return (
    <div className="min-h-screen mesh-bg">
      <Header />

      <main className="pb-24 md:pb-12">
        {/* Page Banner */}
        <ScrollReveal>
          <div className="bg-gradient-to-r from-[#171717] via-[#dc2626] to-[#b91c1c] text-red-50 border-b border-red-400/40 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
              <h1 className="font-cinzel font-bold text-2xl md:text-4xl">Katariya Auto Parts Store Catalogue</h1>
              <p className="text-red-200 text-sm md:text-base mt-1">100% Genuine Spare Parts, Accessories & Engine Oils</p>
              
              <div className="flex items-center gap-2 mt-4 max-w-xl">
                <div className="flex-1 flex items-center bg-white/10 backdrop-blur-md border border-red-300/40 rounded-xl px-3 py-2 gap-2">
                  <Search size={15} className="text-red-200 flex-shrink-0" />
                  <input 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search parts by name or OEM number..." 
                    className="flex-1 bg-transparent text-white text-sm placeholder-blue-200/60 outline-none" 
                  />
                </div>
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="bg-red-400 text-neutral-900 text-xs font-bold px-3 py-2 rounded-xl">Clear</button>
                )}
              </div>
            </div>
          </div>
        </ScrollReveal>

        <div className="max-w-7xl mx-auto px-4 md:px-6 mt-6">
          <div className="flex gap-6">

            {/* DESKTOP SIDEBAR FILTER */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <ScrollReveal animation="fade-right">
                <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-red-200 shadow-md p-5 sticky top-24 space-y-6">
                  
                  {/* Categories list */}
                  <div>
                    <p className="text-neutral-900 font-bold text-sm mb-3 font-cinzel">Categories</p>
                    <button 
                      onClick={() => setActiveCategory('All')}
                      className={`w-full text-left flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all mb-1 ${activeCategory === 'All' ? 'bg-[#171717] text-red-200' : 'text-neutral-600 hover:bg-red-50'}`}
                    >
                      🌟 All Categories
                    </button>
                    {ALL_CATEGORIES.map(c => (
                      <button key={c.label} onClick={() => setActiveCategory(c.label)}
                        className={`w-full text-left flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all mb-1 ${activeCategory === c.label ? 'bg-[#171717] text-red-200' : 'text-neutral-600 hover:bg-red-50'}`}>
                        <span>{c.emoji}</span> {c.label}
                      </button>
                    ))}
                  </div>

                  {/* Price Filter */}
                  <div className="border-t border-red-200 pt-4">
                    <p className="text-neutral-900 font-bold text-sm mb-3 font-cinzel">Price Range</p>
                    {['All', 'Under ₹500', '₹500 – ₹1000', '₹1000 – ₹2000', 'Above ₹2000'].map(r => (
                      <label key={r} className="flex items-center gap-2 py-1.5 cursor-pointer group">
                        <input type="radio" name="price" checked={activePrice === r} onChange={() => setActivePrice(r)} className="w-4 h-4 accent-[#dc2626]" />
                        <span className="text-xs text-neutral-700 font-semibold group-hover:text-[#dc2626] transition-colors">{r}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            </aside>

            {/* MAIN CATALOGUE AREA */}
            <div className="flex-1 min-w-0">
              
              <ScrollReveal animation="fade-down" delay={50}>
                <YMMFilter onFilterChange={setYmm} />
              </ScrollReveal>

              {/* Category Pills */}
              <ScrollReveal animation="fade-down" delay={100}>
                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-4">
                  <button onClick={() => setActiveCategory('All')}
                    className={`flex-shrink-0 text-xs font-bold px-3.5 py-1.5 rounded-full border transition-all ${activeCategory === 'All' ? 'bg-[#171717] text-red-200 border-[#171717]' : 'bg-white text-neutral-700 border-red-200 hover:border-[#dc2626]'}`}>
                    📦 All Items
                  </button>
                  {ALL_CATEGORIES.map(cat => (
                    <button key={cat.label} onClick={() => setActiveCategory(cat.label)}
                      className={`flex-shrink-0 text-xs font-bold px-3.5 py-1.5 rounded-full border transition-all ${activeCategory === cat.label ? 'bg-[#171717] text-red-200 border-[#171717]' : 'bg-white text-neutral-700 border-red-200 hover:border-[#dc2626]'}`}>
                      {cat.emoji} {cat.label}
                    </button>
                  ))}
                </div>
              </ScrollReveal>

              {/* Toolbar */}
              <ScrollReveal animation="fade-up" delay={150}>
                  <div className="flex items-center justify-between mb-4 bg-white/90 backdrop-blur-md rounded-xl border border-red-200 shadow-sm px-4 py-2.5">
                    <p className="text-neutral-600 text-xs md:text-sm font-bold">{filteredProducts.length} <span className="hidden sm:inline">Products Available</span></p>
                    <div className="flex items-center gap-2">
                      <select value={activePrice} onChange={e => setActivePrice(e.target.value)}
                        className="lg:hidden text-xs font-bold text-neutral-700 bg-red-50 border border-red-200 rounded-lg px-2.5 py-1 outline-none">
                        {['All', 'Under ₹500', '₹500 - ₹1000', '₹1000 - ₹2000', 'Above ₹2000'].map(p => (
                          <option key={p} value={p}>{p === 'All' ? 'Price: All' : p}</option>
                        ))}
                      </select>
                      <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                        className="text-xs font-bold text-neutral-700 bg-red-50 border border-red-200 rounded-lg px-2.5 py-1 outline-none">
                        {['Popular', 'Price: Low to High', 'Price: High to Low', 'Rating'].map(o => (
                          <option key={o}>{o}</option>
                      ))}
                    </select>
                    <div className="hidden md:flex items-center gap-1 border border-red-200 rounded-lg overflow-hidden bg-red-50">
                      <button onClick={() => setViewMode('grid')} className={`p-1.5 ${viewMode === 'grid' ? 'bg-[#171717] text-red-200' : 'text-neutral-600'}`}>
                        <LayoutGrid size={15} />
                      </button>
                      <button onClick={() => setViewMode('list')} className={`p-1.5 ${viewMode === 'list' ? 'bg-[#171717] text-red-200' : 'text-neutral-600'}`}>
                        <List size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              {/* Product Grid */}
              {loading && PRODUCTS.length === 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center bg-white/80 rounded-3xl border border-red-200">
                  <p className="text-5xl mb-3">🌰</p>
                  <p className="text-neutral-800 font-bold text-lg">No matching products found</p>
                  <p className="text-neutral-500 text-xs mt-1">Try resetting search or filter options</p>
                </div>
              ) : (
                <div className={viewMode === 'grid'
                  ? 'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4'
                  : 'flex flex-col gap-3'}>
                  {filteredProducts.slice(0, visibleCount).map((p, idx) => (
                    <ScrollReveal key={p.id} delay={(idx % 8) * 80} className="h-full">
                      <Link to={`/product/${p.id}`} className="product-card block bg-white rounded-2xl border border-red-100 overflow-hidden shadow-sm hover:shadow-xl hover:border-red-300 transition-all cursor-pointer group h-full flex flex-col">
                        <div className="relative bg-red-50/50 overflow-hidden flex-shrink-0" style={{ height: 160 }}>
                          <MediaDisplay src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          <div className="absolute top-2 left-2 bg-[#dc2626] text-white text-[9px] font-bold px-2 py-0.5 rounded-md">{p.tag || 'Genuine'}</div>
                          <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(p); }} className="absolute top-2 right-2 bg-white/90 rounded-full p-1.5 shadow-sm hover:scale-110 transition-transform">
                            <Heart size={13} className={isWishlisted(p.id) ? 'fill-red-500 text-red-500' : 'text-neutral-400'} />
                          </button>
                        </div>
                        <div className="p-3 flex flex-col flex-1">
                          <p className="text-[10px] text-[#dc2626] font-bold uppercase">{p.brand || 'Katariya Auto Parts'}</p>
                          <p className="text-neutral-800 text-xs font-bold leading-tight mt-0.5 line-clamp-2">{p.name}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <div className="flex items-center bg-emerald-600 rounded px-1.5 py-0.5 gap-0.5">
                              <Star size={8} className="text-white fill-white" />
                              <span className="text-white text-[9px] font-bold">{p.rating}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 mt-2">
                            <span className="text-neutral-900 font-black text-sm">₹{p.price}</span>
                            {p.mrp && <span className="text-neutral-400 text-[10px] line-through">₹{p.mrp}</span>}
                          </div>
                          <div className="mt-auto pt-2">
                            <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(p); }}
                              className={`w-full text-[11px] font-bold py-1.5 rounded-xl flex items-center justify-center gap-1 transition-all ${isInCart(p.id) ? 'bg-emerald-600 text-white' : 'bg-gradient-to-r from-[#171717] to-[#dc2626] text-red-50 shadow-sm'}`}>
                              <ShoppingBag size={11} />
                              {isInCart(p.id) ? 'Added ✓' : 'Add to Cart'}
                            </button>
                          </div>
                        </div>
                      </Link>
                    </ScrollReveal>
                  ))}
                </div>
              )}

              {/* Load More Button */}
              {visibleCount < filteredProducts.length && (
                <div ref={loadMoreRef} className="mt-8 flex justify-center">
                  <button
                    onClick={() => setVisibleCount(prev => prev + 24)}
                    className="bg-white border-2 border-[#dc2626] text-[#dc2626] hover:bg-[#dc2626] hover:text-white font-bold py-2.5 px-8 rounded-full shadow-sm transition-all text-sm"
                  >
                    Load More ({filteredProducts.length - visibleCount} remaining)
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
