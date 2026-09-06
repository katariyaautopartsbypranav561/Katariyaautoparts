import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight, Star, ShoppingBag, Heart,
  Sparkles, ArrowRight, Award, ShieldCheck, Truck, Scale
} from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import { useData } from '../context/DataContext';
import { useCart } from '../context/CartContext';
import ScrollReveal from '../components/ScrollReveal';
import MediaDisplay from '../components/MediaDisplay';
import YMMFilter from '../components/YMMFilter';

/* ── HERO CAROUSEL ── */
function HeroCarousel() {
  const { slides } = useData();
  const [cur, setCur] = useState(0);
  const [auto, setAuto] = useState(true);
  const ref = useRef(null);
  const next = () => setCur(c => (c + 1) % (slides.length || 1));
  const prev = () => setCur(c => (c - 1 + slides.length) % (slides.length || 1));
  
  useEffect(() => {
    if (auto && slides.length > 0) { ref.current = setInterval(next, 4800); }
    return () => clearInterval(ref.current);
  }, [auto, cur, slides.length]);
  
  if (!slides || slides.length === 0) return null;
  const s = slides[cur] || slides[0];

  // Gradient fallbacks per index
  const GRADIENTS = [
    'linear-gradient(135deg, #78350f 0%, #92400e 40%, #1c1917 100%)',
    'linear-gradient(135deg, #14532d 0%, #166534 40%, #1c1917 100%)',
    'linear-gradient(135deg, #7c2d12 0%, #9a3412 40%, #1c1917 100%)',
    'linear-gradient(135deg, #713f12 0%, #854d0e 40%, #1c1917 100%)',
    'linear-gradient(135deg, #3b0764 0%, #581c87 40%, #1c1917 100%)',
  ];
  const fallbackGrad = GRADIENTS[cur % GRADIENTS.length];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10 max-w-[1600px] mx-auto w-full px-4 md:px-6 mb-4"
    >
      <div
        className="relative overflow-hidden rounded-3xl w-full shadow-2xl border border-red-200/30"
        style={{ background: fallbackGrad }}
        onMouseEnter={() => setAuto(false)}
        onMouseLeave={() => setAuto(true)}
      >
        {/* Desktop banner */}
        {s.heroImage && (
          <MediaDisplay
            src={s.heroImage}
            alt="Hero Banner"
            className="hidden md:block w-full h-auto object-cover"
            loading="eager"
          />
        )}

        {/* Mobile banner – falls back to heroImage if no mobileImage */}
        {(s.mobileImage || s.heroImage) ? (
          <MediaDisplay
            src={s.mobileImage || s.heroImage}
            alt="Hero Banner"
            className="block md:hidden w-full h-auto object-cover"
            loading="eager"
          />
        ) : (
          /* Fallback when no image: show brand visual on mobile */
          <div className="block md:hidden w-full h-[260px] flex items-center justify-center">
            <div className="text-center px-8">
              <div className="text-5xl mb-3">🌿</div>
              <p className="text-red-300 font-bold text-xl">Katariya Auto Parts</p>
              <p className="text-white/70 text-sm mt-1">Pure. Natural. Authentic.</p>
            </div>
          </div>
        )}




        {/* Navigation Arrows */}
        <button onClick={prev} className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-md rounded-full p-2 md:p-3 shadow-lg hover:bg-red-500 hover:text-white transition-all z-20">
          <ChevronLeft size={18} className="text-neutral-800 hover:text-white" />
        </button>
        <button onClick={next} className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-md rounded-full p-2 md:p-3 shadow-lg hover:bg-red-500 hover:text-white transition-all z-20">
          <ChevronRight size={18} className="text-neutral-800 hover:text-white" />
        </button>

        {/* Indicator Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {slides.map((_, i) => (
            <button key={i} onClick={() => setCur(i)}
              className={`h-2 rounded-full transition-all duration-300 ${i === cur ? 'bg-red-400 w-8' : 'bg-white/50 w-2'}`} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ── SITE HERO BANNERS ── */
function SiteHeroBannersSection() {
  const { banners } = useData();
  const navigate = useNavigate();

  if (!banners || banners.length === 0) return null;

  return (
    <section className="relative z-10 max-w-[1600px] mx-auto w-full px-4 md:px-6 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-neutral-900 font-cinzel font-bold text-xl md:text-3xl flex items-center gap-2">
            Featured Site Hero Banners <Sparkles className="text-red-500" size={22} />
          </h2>
          <p className="text-neutral-600 text-xs md:text-sm font-medium mt-0.5">Explore our premium auto parts collection</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {banners.map((b, idx) => (
          <ScrollReveal key={b.id || idx} delay={idx * 150} animation="scale-up">
            <div 
              onClick={() => navigate(b.link || '/category')}
              className="group relative overflow-hidden rounded-3xl h-[160px] md:h-[280px] shadow-xl border border-red-300/40 cursor-pointer bg-neutral-900"
            >
              <MediaDisplay 
                src={b.mediaUrl} 
                alt={b.title || 'Site Hero Banner'} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-900/40 to-transparent" />

              <div className="absolute inset-0 p-5 md:p-6 flex flex-col justify-end text-red-50">
                {b.badge && (
                  <span className="inline-flex items-center gap-1 bg-red-500 text-neutral-950 text-[11px] font-black uppercase px-3 py-1 rounded-full w-max shadow mb-2">
                    <Sparkles size={12} /> {b.badge}
                  </span>
                )}
                {b.title && (
                  <h3 className="font-cinzel font-bold text-xl md:text-2xl text-red-100 leading-tight group-hover:text-red-300 transition-colors">
                    {b.title}
                  </h3>
                )}
                {b.subtitle && (
                  <p className="text-red-200/80 text-xs md:text-sm font-medium mt-1 max-w-md line-clamp-2">
                    {b.subtitle}
                  </p>
                )}
                <div className="mt-3 flex items-center gap-2">
                  <span className="bg-red-400 group-hover:bg-red-300 text-neutral-900 text-xs font-bold px-4 py-2 rounded-full transition-all flex items-center gap-1 shadow-md">
                    Explore Category <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

/* ── QUICK CATEGORIES ── */
function QuickCategories() {
  const { categories } = useData();
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  const infiniteCategories = Array(4).fill(categories).flat();

  useEffect(() => {
    if (scrollRef.current) {
      const el = scrollRef.current;
      el.scrollLeft = (el.scrollWidth - el.clientWidth) / 3;
    }
  }, [categories]);

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === 'left' ? -380 : 380, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative z-10 max-w-[1600px] mx-auto w-full px-4 md:px-6 mb-4">
      <div className="relative overflow-hidden rounded-3xl p-4 md:p-7 border border-red-300/40 shadow-xl bg-gradient-to-br from-[#7f1d1d] via-[#171717] to-[#1a0e05]">
        
        {/* Background Sparkles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="hidden md:block absolute top-[-20%] left-[-10%] w-[450px] h-[450px] bg-red-500/20 rounded-full blur-[100px]" />
          <div className="hidden md:block absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-emerald-600/15 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between mb-6 md:mb-8 gap-4">
          <div>
            <h2 className="text-red-100 font-cinzel font-bold text-2xl md:text-4xl tracking-tight flex items-center gap-2">
              Explore Auto Parts <Sparkles className="text-red-400" size={24} />
            </h2>
            <p className="text-red-200/80 text-sm md:text-base font-medium mt-1">
              Find genuine auto parts, engine oils, batteries, and riding accessories for all brands.
            </p>
          </div>
          <button onClick={() => navigate('/category')}
            className="flex-shrink-0 flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-neutral-900 text-xs md:text-sm font-bold px-5 py-2.5 rounded-full transition-all shadow-md">
            View All Categories <ArrowRight size={14} />
          </button>
        </div>

        {/* Scrollable list */}
        <div className="relative z-10 mask-edges mt-4">
          <button onClick={() => scroll('left')} 
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-11 h-11 flex items-center justify-center rounded-full bg-neutral-900/80 border border-red-400 text-red-300 transition-all hover:bg-red-500 hover:text-neutral-900 hidden md:flex">
            <ChevronLeft size={24} />
          </button>

          <AutoScrollWrapper direction="left" className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide snap-x px-2 md:px-12 py-3">
            {infiniteCategories.map((cat, idx) => (
              <button key={`${cat.label}-${idx}`} onClick={() => navigate('/category', { state: { category: cat.label } })}
                className="snap-center flex-shrink-0 flex flex-col items-center gap-3 group focus:outline-none w-24 sm:w-32 md:w-44 cursor-pointer">
                <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-44 md:h-44 rounded-2xl md:rounded-3xl border-2 border-red-400/40 bg-[#020617] overflow-hidden shadow-lg group-hover:border-red-400 group-hover:scale-105 transition-all duration-300 relative">
                  <img src={cat.img} alt={cat.label} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <span className="text-xs md:text-sm font-bold text-red-100 text-center leading-tight group-hover:text-red-400 transition-colors">{cat.label}</span>
              </button>
            ))}
          </AutoScrollWrapper>

          <button onClick={() => scroll('right')} 
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-11 h-11 flex items-center justify-center rounded-full bg-neutral-900/80 border border-red-400 text-red-300 transition-all hover:bg-red-500 hover:text-neutral-900 hidden md:flex">
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
}

/* ── EXOTIC SPICES SECTION (DARK SAFFRON ROYAL VAULT) ── */
function ExoticSpicesSection({ cat, products, addToCart, toggleWishlist, isInCart, isWishlisted, navigate }) {
  const hero = products[0];
  const rest = products.slice(1);

  return (
    <section className="relative z-10 max-w-[1600px] mx-auto w-full px-4 md:px-6">
      <div className="relative overflow-hidden rounded-3xl p-4 md:p-8 border border-red-500/40 shadow-2xl bg-gradient-to-br from-[#2a0802] via-[#451004] to-[#170301] text-red-50">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-4 border-b border-red-500/30 gap-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl p-2.5 bg-red-500/20 rounded-2xl border border-red-400/40 shadow-inner">🌶️</span>
            <div>
              <h2 className="text-red-100 font-cinzel font-bold text-2xl md:text-4xl flex items-center gap-2">
                {cat.label} Vault <span className="text-xs font-bold text-red-950 bg-red-400 px-3 py-0.5 rounded-full border border-red-300">({products.length} Products)</span>
              </h2>
              <p className="text-red-200/80 text-xs md:text-sm mt-0.5">100% Genuine Spare Parts & Accessories 🏍️</p>
            </div>
          </div>
          <button onClick={() => navigate('/category', { state: { category: cat.label } })}
            className="flex items-center gap-1.5 text-red-950 text-xs md:text-sm font-bold bg-red-400 hover:bg-red-300 px-5 py-2.5 rounded-full transition-all shadow-lg">
            View All Spices ({products.length}) <ArrowRight size={14} />
          </button>
        </div>

        {/* Layout: Left Hero Spotlight + Right 5-Card Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Hero Card */}
          {hero && (
            <div className="lg:col-span-4 bg-neutral-950/80 rounded-2xl border-2 border-red-400/60 p-5 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
              <div className="absolute top-3 left-3 z-10 bg-red-500 text-neutral-950 text-[10px] font-black uppercase px-2.5 py-1 rounded-md shadow flex items-center gap-1">
                <Sparkles size={11} /> SPOTLIGHT HERITAGE
              </div>
              <button onClick={(e) => { e.preventDefault(); toggleWishlist(hero); }} 
                className="absolute top-3 right-3 z-10 bg-neutral-900/90 rounded-full p-2 text-neutral-300 hover:text-red-500 transition-colors">
                <Heart size={16} className={isWishlisted(hero.id) ? 'fill-red-500 text-red-500' : ''} />
              </button>

              <Link to={`/product/${hero.id}`} className="relative h-48 md:h-60 rounded-xl overflow-hidden mb-4 block">
                <MediaDisplay src={hero.img} alt={hero.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-80" />
              </Link>

              <div>
                <span className="text-[10px] text-red-400 font-bold uppercase tracking-widest">{hero.badge || 'PREMIUM ENGINE OILS'}</span>
                <Link to={`/product/${hero.id}`} className="font-cinzel text-red-100 font-bold text-lg md:text-xl leading-tight block mt-1 hover:text-red-300">
                  {hero.name}
                </Link>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center bg-red-400 text-neutral-950 rounded px-2 py-0.5 text-xs font-bold gap-1">
                    <Star size={10} className="fill-slate-950" /> {hero.rating}
                  </div>
                  <span className="text-red-200/60 text-xs">({hero.reviews} Lab Verified Reviews)</span>
                </div>

                <div className="flex items-baseline gap-2 mt-3">
                  <span className="text-2xl font-black text-red-300">₹{hero.price}</span>
                  {hero.mrp && <span className="text-red-200/40 text-sm line-through">₹{hero.mrp}</span>}
                </div>

                <button onClick={() => addToCart(hero)}
                  className={`w-full mt-4 text-xs md:text-sm font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md ${
                    isInCart(hero.id) ? 'bg-emerald-600 text-white' : 'bg-red-400 hover:bg-red-300 text-neutral-950'
                  }`}>
                  <ShoppingBag size={14} /> {isInCart(hero.id) ? 'Added to Cart ✓' : 'Add Spotlight Product to Cart'}
                </button>
              </div>
            </div>
          )}

          {/* Right 5-Card Grid */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
            {rest.map((p, idx) => (
              <ScrollReveal key={p.id} delay={idx * 60} animation="scale-up" className="h-full">
                <div className="bg-neutral-950/70 rounded-2xl border border-red-500/30 overflow-hidden hover:border-red-400 transition-all group flex flex-col h-full shadow-lg">
                  <Link to={`/product/${p.id}`} className="relative h-28 md:h-36 bg-neutral-900 overflow-hidden block">
                    <MediaDisplay src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute top-1.5 left-1.5 bg-red-500/90 text-neutral-950 text-[8px] font-extrabold px-1.5 py-0.5 rounded">{p.tag || 'Genuine'}</div>
                  </Link>
                  <div className="p-2.5 flex flex-col flex-1">
                    <p className="text-[8px] text-red-400 font-bold uppercase tracking-wider line-clamp-1">{p.badge || 'Exotic Spices'}</p>
                    <Link to={`/product/${p.id}`} className="text-red-100 text-xs font-bold leading-tight mt-0.5 line-clamp-2 hover:text-red-300">
                      {p.name}
                    </Link>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-red-500/20">
                      <span className="text-red-300 font-black text-xs">₹{p.price}</span>
                      <button onClick={() => addToCart(p)}
                        className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                          isInCart(p.id) ? 'bg-emerald-600 text-white' : 'bg-red-500/20 hover:bg-red-400 hover:text-neutral-950 text-red-300'
                        }`}>
                        <ShoppingBag size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

/* ── DRY FRUITS SECTION (WARM OAK HARVEST PANTRY) ── */
function DryFruitsSection({ cat, products, addToCart, toggleWishlist, isInCart, isWishlisted, navigate }) {
  const scrollRef = useRef(null);

  return (
    <section className="relative z-10 max-w-[1600px] mx-auto w-full px-4 md:px-6">
      <div className="relative overflow-hidden rounded-3xl p-4 md:p-8 border border-red-700/40 shadow-xl bg-gradient-to-r from-[#241306] via-[#3a200b] to-[#190c03] text-red-50">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-red-700/30 gap-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl p-2.5 bg-red-700/30 rounded-2xl border border-red-600/40 shadow-inner">🌰</span>
            <div>
              <h2 className="text-red-100 font-cinzel font-bold text-2xl md:text-4xl flex items-center gap-2">
                {cat.label} Pantry <span className="text-xs font-bold text-red-950 bg-red-400 px-3 py-0.5 rounded-full border border-red-300">({products.length} Products)</span>
              </h2>
              <p className="text-red-200/70 text-xs md:text-sm mt-0.5">Durable brake pads, chain sprockets, air filters, and battery kits 🔧</p>
            </div>
          </div>
          <button onClick={() => navigate('/category', { state: { category: cat.label } })}
            className="flex items-center gap-1.5 text-neutral-900 text-xs md:text-sm font-bold bg-red-400 hover:bg-red-300 px-5 py-2.5 rounded-full transition-all shadow-md">
            Explore All Parts ({products.length}) <ArrowRight size={14} />
          </button>
        </div>

        {/* Horizontal Scrollable Reel */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {products.slice(0, 6).map((p, idx) => (
            <ScrollReveal key={p.id} delay={idx * 70} animation="scale-up" className="h-full">
              <div className="bg-[#170b03]/90 rounded-2xl border border-red-700/40 overflow-hidden shadow-md hover:border-red-400 transition-all cursor-pointer group flex flex-col h-full">
                <Link to={`/product/${p.id}`} className="relative h-32 md:h-40 bg-neutral-950 overflow-hidden block">
                  <MediaDisplay src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <span className="absolute top-2 left-2 bg-red-700/90 text-red-100 text-[9px] font-bold px-2 py-0.5 rounded shadow">
                    {p.badge || 'HARVEST'}
                  </span>
                  <button onClick={(e) => { e.preventDefault(); toggleWishlist(p); }}
                    className="absolute top-2 right-2 bg-neutral-900/80 rounded-full p-1.5 text-red-200 hover:text-red-500 transition-colors">
                    <Heart size={13} className={isWishlisted(p.id) ? 'fill-red-500 text-red-500' : ''} />
                  </button>
                </Link>

                <div className="p-3 flex flex-col flex-1 justify-between">
                  <div>
                    <span className="text-[9px] text-red-400 font-bold uppercase tracking-wider">{p.tag || '500g PACK'}</span>
                    <Link to={`/product/${p.id}`} className="text-red-100 text-xs font-bold leading-tight block mt-0.5 line-clamp-2 hover:text-red-300">
                      {p.name}
                    </Link>
                  </div>

                  <div className="mt-3">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-red-300 font-black text-sm">₹{p.price}</span>
                      {p.mrp && <span className="text-red-200/40 text-[10px] line-through">₹{p.mrp}</span>}
                    </div>

                    <button onClick={() => addToCart(p)}
                      className={`w-full mt-2 text-[11px] font-bold py-2 rounded-xl transition-all flex items-center justify-center gap-1 ${
                        isInCart(p.id) ? 'bg-emerald-600 text-white' : 'bg-red-600 hover:bg-red-500 text-neutral-950'
                      }`}>
                      <ShoppingBag size={11} /> {isInCart(p.id) ? 'Added ✓' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
}

/* ── GOURMET NUTS SECTION (EMERALD LUXE TASTING BOARD) ── */
function GourmetNutsSection({ cat, products, addToCart, toggleWishlist, isInCart, isWishlisted, navigate }) {
  const topTwo = products.slice(0, 2);
  const bottomFour = products.slice(2);

  return (
    <section className="relative z-10 max-w-[1600px] mx-auto w-full px-4 md:px-6">
      <div className="relative overflow-hidden rounded-3xl p-4 md:p-8 border border-emerald-500/30 shadow-2xl bg-gradient-to-br from-[#052418] via-[#0a3827] to-[#03140e] text-emerald-50">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-4 border-b border-emerald-500/30 gap-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl p-2.5 bg-emerald-500/20 rounded-2xl border border-emerald-400/30 shadow-inner">🥜</span>
            <div>
              <h2 className="text-emerald-100 font-cinzel font-bold text-2xl md:text-4xl flex items-center gap-2">
                {cat.label} Tasting Board <span className="text-xs font-bold text-neutral-950 bg-emerald-400 px-3 py-0.5 rounded-full border border-emerald-300">({products.length} Products)</span>
              </h2>
              <p className="text-emerald-200/70 text-xs md:text-sm mt-0.5">Slow-Roasted Iranian Pistachios, Creamy Cashews & Macadamia Nuts 🥜</p>
            </div>
          </div>
          <button onClick={() => navigate('/category', { state: { category: cat.label } })}
            className="flex items-center gap-1.5 text-neutral-950 text-xs md:text-sm font-bold bg-emerald-400 hover:bg-emerald-300 px-5 py-2.5 rounded-full transition-all shadow-md">
            View Gourmet Tasting Board ({products.length}) <ArrowRight size={14} />
          </button>
        </div>

        {/* Bento Box Layout: 2 Wide Top Banners + 4 Bottom Grid Cards */}
        <div className="space-y-6">
          
          {/* Top Row: 2 Wide Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {topTwo.map((p) => (
              <div key={p.id} className="bg-neutral-950/80 rounded-2xl border border-emerald-500/40 p-4 flex gap-4 items-center shadow-xl group hover:border-emerald-400 transition-all">
                <Link to={`/product/${p.id}`} className="relative w-24 h-24 md:w-36 md:h-36 rounded-xl overflow-hidden flex-shrink-0 bg-neutral-900 block">
                  <MediaDisplay src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <span className="absolute top-1.5 left-1.5 bg-emerald-500 text-neutral-950 text-[8px] font-extrabold px-2 py-0.5 rounded">{p.badge || 'ROASTED'}</span>
                </Link>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">{p.tag || 'PREMIUM SELECTION'}</span>
                    <Link to={`/product/${p.id}`} className="font-cinzel text-emerald-100 font-bold text-base md:text-lg leading-tight block mt-0.5 hover:text-emerald-300">
                      {p.name}
                    </Link>
                    <div className="flex items-center gap-1.5 mt-2">
                      <Star size={12} className="fill-emerald-400 text-emerald-400" />
                      <span className="text-xs font-bold text-emerald-200">{p.rating} Rating</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-emerald-500/20">
                    <span className="text-xl font-black text-emerald-300">₹{p.price}</span>
                    <button onClick={() => addToCart(p)}
                      className={`text-xs font-bold px-4 py-2 rounded-xl transition-all ${
                        isInCart(p.id) ? 'bg-emerald-600 text-white' : 'bg-emerald-500 hover:bg-emerald-400 text-neutral-950'
                      }`}>
                      {isInCart(p.id) ? 'Added ✓' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Row: 4 Compact Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {bottomFour.map((p, idx) => (
              <ScrollReveal key={p.id} delay={idx * 60} animation="scale-up" className="h-full">
                <div className="bg-neutral-950/70 rounded-2xl border border-emerald-500/30 overflow-hidden p-3 hover:border-emerald-400 transition-all group flex flex-col h-full shadow-md">
                  <Link to={`/product/${p.id}`} className="relative h-24 md:h-32 rounded-xl overflow-hidden bg-neutral-900 block mb-2">
                    <MediaDisplay src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </Link>

                  <div className="flex flex-col flex-1 justify-between">
                    <div>
                      <p className="text-[8px] text-emerald-400 font-bold uppercase">{p.badge || 'Gourmet Nut'}</p>
                      <Link to={`/product/${p.id}`} className="text-emerald-100 text-xs font-bold leading-tight block mt-0.5 line-clamp-2 hover:text-emerald-300">
                        {p.name}
                      </Link>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <span className="text-emerald-300 font-black text-sm">₹{p.price}</span>
                      <button onClick={() => addToCart(p)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                          isInCart(p.id) ? 'bg-emerald-600 text-white' : 'bg-emerald-500/20 hover:bg-emerald-400 hover:text-neutral-950 text-emerald-300'
                        }`}>
                        {isInCart(p.id) ? 'Added ✓' : 'Add'}
                      </button>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}

/* ── HEALTHY SEEDS SECTION (BOTANICAL VITALITY BAR) ── */
function HealthySeedsSection({ cat, products, addToCart, toggleWishlist, isInCart, isWishlisted, navigate }) {
  return (
    <section className="relative z-10 max-w-[1600px] mx-auto w-full px-4 md:px-6">
      <div className="relative overflow-hidden rounded-3xl p-4 md:p-8 border border-emerald-300 shadow-xl bg-gradient-to-br from-[#f0fdf4] via-[#ecfdf5] to-[#d1fae5] text-neutral-900">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-emerald-200 gap-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl p-2.5 bg-emerald-100 rounded-2xl border border-emerald-300 shadow-sm">🌱</span>
            <div>
              <h2 className="text-neutral-900 font-cinzel font-bold text-2xl md:text-4xl flex items-center gap-2">
                {cat.label} Vitality Bar <span className="text-xs font-bold text-emerald-800 bg-emerald-200 px-3 py-0.5 rounded-full border border-emerald-300">({products.length} Products)</span>
              </h2>
              <p className="text-neutral-600 text-xs md:text-sm mt-0.5">High quality engine oils and lubes 🛢️</p>
            </div>
          </div>
          <button onClick={() => navigate('/category', { state: { category: cat.label } })}
            className="flex items-center gap-1.5 text-white text-xs md:text-sm font-bold bg-emerald-700 hover:bg-emerald-800 px-5 py-2.5 rounded-full transition-all shadow-md">
            View All Seeds ({products.length}) <ArrowRight size={14} />
          </button>
        </div>

        {/* 6 Clean Porcelain White Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {products.slice(0, 6).map((p, idx) => (
            <ScrollReveal key={p.id} delay={idx * 65} animation="scale-up" className="h-full">
              <div className="bg-white rounded-2xl border border-emerald-200 p-3 overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer group flex flex-col h-full">
                <Link to={`/product/${p.id}`} className="relative h-28 md:h-36 bg-emerald-50 rounded-xl overflow-hidden block mb-2">
                  <MediaDisplay src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <span className="absolute top-1.5 left-1.5 bg-emerald-600 text-white text-[8px] font-bold px-2 py-0.5 rounded-full shadow">
                    {p.badge || 'SUPERFOOD'}
                  </span>
                  <button onClick={(e) => { e.preventDefault(); toggleWishlist(p); }}
                    className="absolute top-1.5 right-1.5 bg-white/90 rounded-full p-1.5 shadow-sm hover:scale-110 transition-transform">
                    <Heart size={12} className={isWishlisted(p.id) ? 'fill-red-500 text-red-500' : 'text-neutral-400'} />
                  </button>
                </Link>

                <div className="flex flex-col flex-1 justify-between">
                  <div>
                    <span className="text-[9px] text-emerald-700 font-bold uppercase tracking-wider">{p.tag || 'OMEGA 3 BOOST'}</span>
                    <Link to={`/product/${p.id}`} className="text-neutral-800 text-xs font-bold leading-tight block mt-0.5 line-clamp-2 hover:text-emerald-700">
                      {p.name}
                    </Link>
                  </div>

                  <div className="mt-3 pt-2 border-t border-emerald-100">
                    <div className="flex items-baseline gap-1">
                      <span className="text-neutral-900 font-black text-sm">₹{p.price}</span>
                      {p.mrp && <span className="text-neutral-400 text-[10px] line-through">₹{p.mrp}</span>}
                    </div>

                    <button onClick={() => addToCart(p)}
                      className={`w-full mt-2 text-[11px] font-bold py-1.5 rounded-xl transition-all flex items-center justify-center gap-1 ${
                        isInCart(p.id) ? 'bg-emerald-700 text-white' : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                      }`}>
                      <ShoppingBag size={11} /> {isInCart(p.id) ? 'Added ✓' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
}

/* ── PURE GHEE & OILS SECTION (GOLDEN NECTAR SANCTUARY) ── */
function PureGheeSection({ cat, products, addToCart, toggleWishlist, isInCart, isWishlisted, navigate }) {
  const hero = products[0];
  const rest = products.slice(1);

  return (
    <section className="relative z-10 max-w-[1600px] mx-auto w-full px-4 md:px-6">
      <div className="relative overflow-hidden rounded-3xl p-4 md:p-8 border border-red-400/60 shadow-xl bg-gradient-to-r from-[#fffbeb] via-[#dbeafe] to-[#fde68a] text-neutral-900">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-4 border-b border-red-300/80 gap-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl p-2.5 bg-red-200/80 rounded-2xl border border-red-400/60 shadow-sm">🧈</span>
            <div>
              <h2 className="text-neutral-900 font-cinzel font-bold text-2xl md:text-4xl flex items-center gap-2">
                {cat.label} Sanctuary <span className="text-xs font-bold text-red-900 bg-red-300 px-3 py-0.5 rounded-full border border-red-400">({products.length} Products)</span>
              </h2>
              <p className="text-neutral-700 text-xs md:text-sm mt-0.5">Durable accessories and body parts 🏍️</p>
            </div>
          </div>
          <button onClick={() => navigate('/category', { state: { category: cat.label } })}
            className="flex items-center gap-1.5 text-red-50 text-xs md:text-sm font-bold bg-[#171717] hover:bg-[#7f1d1d] px-5 py-2.5 rounded-full transition-all shadow-md">
            View All Ghee & Oils ({products.length}) <ArrowRight size={14} />
          </button>
        </div>

        {/* Split Layout: Left Bilona Ghee Highlight + Right 5 Product Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Bilona Highlight Banner */}
          {hero && (
            <div className="lg:col-span-4 bg-gradient-to-br from-[#171717] to-[#7f1d1d] rounded-2xl p-5 text-red-50 flex flex-col justify-between shadow-xl relative overflow-hidden group">
              <div className="absolute top-3 left-3 z-10 bg-red-400 text-neutral-950 text-[10px] font-black uppercase px-2.5 py-1 rounded-md shadow flex items-center gap-1">
                <Award size={12} /> OEM CERTIFIED
              </div>

              <Link to={`/product/${hero.id}`} className="relative h-48 md:h-56 rounded-xl overflow-hidden mb-4 block">
                <MediaDisplay src={hero.img} alt={hero.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </Link>

              <div>
                <span className="text-[10px] text-red-300 font-bold uppercase tracking-wider">{hero.badge || 'A2 BILONA GHEE'}</span>
                <Link to={`/product/${hero.id}`} className="font-cinzel text-red-100 font-bold text-lg md:text-xl leading-tight block mt-1 hover:text-red-300">
                  {hero.name}
                </Link>
                <p className="text-red-200/80 text-xs mt-2 line-clamp-2">Hand-churned using traditional wooden bilona process from Gir cow milk.</p>

                <div className="flex items-baseline gap-2 mt-4">
                  <span className="text-2xl font-black text-red-300">₹{hero.price}</span>
                  {hero.mrp && <span className="text-red-200/50 text-sm line-through">₹{hero.mrp}</span>}
                </div>

                <button onClick={() => addToCart(hero)}
                  className={`w-full mt-4 text-xs md:text-sm font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md ${
                    isInCart(hero.id) ? 'bg-emerald-600 text-white' : 'bg-red-400 hover:bg-red-300 text-neutral-950'
                  }`}>
                  <ShoppingBag size={14} /> {isInCart(hero.id) ? 'Added to Cart ✓' : 'Add A2 Ghee to Cart'}
                </button>
              </div>
            </div>
          )}

          {/* Right 5 Product Cards Grid */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
            {rest.map((p, idx) => (
              <ScrollReveal key={p.id} delay={idx * 60} animation="scale-up" className="h-full">
                <div className="bg-white/90 rounded-2xl border border-red-300/80 overflow-hidden hover:border-red-500 transition-all group flex flex-col h-full shadow-sm p-2.5">
                  <Link to={`/product/${p.id}`} className="relative h-28 md:h-32 bg-red-50 rounded-xl overflow-hidden block mb-2">
                    <MediaDisplay src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <span className="absolute top-1 left-1 bg-red-500 text-neutral-950 text-[8px] font-bold px-1.5 py-0.5 rounded">{p.tag || 'Genuine'}</span>
                  </Link>

                  <div className="flex flex-col flex-1 justify-between">
                    <div>
                      <p className="text-[8px] text-[#171717] font-bold uppercase line-clamp-1">{p.badge || 'Pure Ghee & Oils'}</p>
                      <Link to={`/product/${p.id}`} className="text-neutral-800 text-xs font-bold leading-tight block mt-0.5 line-clamp-2 hover:text-[#171717]">
                        {p.name}
                      </Link>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-red-200">
                      <span className="text-neutral-900 font-black text-xs">₹{p.price}</span>
                      <button onClick={() => addToCart(p)}
                        className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                          isInCart(p.id) ? 'bg-emerald-600 text-white' : 'bg-[#171717] hover:bg-red-600 text-red-50'
                        }`}>
                        <ShoppingBag size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}

/* ── FESTIVE GIFT BOXES SECTION (ROYAL VELVET PAVILION) ── */
function FestiveGiftsSection({ cat, products, addToCart, toggleWishlist, isInCart, isWishlisted, navigate }) {
  return (
    <section className="relative z-10 max-w-[1600px] mx-auto w-full px-4 md:px-6">
      <div className="relative overflow-hidden rounded-3xl p-4 md:p-8 border border-red-400/50 shadow-2xl bg-gradient-to-br from-[#3b040a] via-[#5c0812] to-[#260206] text-red-50">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-4 border-b border-red-400/30 gap-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl p-2.5 bg-red-400/20 rounded-2xl border border-red-400/40 shadow-inner">🎁</span>
            <div>
              <h2 className="text-red-100 font-cinzel font-bold text-2xl md:text-4xl flex items-center gap-2">
                {cat.label} Pavilion <span className="text-xs font-bold text-red-950 bg-red-400 px-3 py-0.5 rounded-full border border-red-300">({products.length} Hampers)</span>
              </h2>
              <p className="text-red-200/80 text-xs md:text-sm mt-0.5">Complete Service Kits & Essential Accessories 🎁</p>
            </div>
          </div>
          <button onClick={() => navigate('/category', { state: { category: cat.label } })}
            className="flex items-center gap-1.5 text-neutral-950 text-xs md:text-sm font-bold bg-red-400 hover:bg-red-300 px-5 py-2.5 rounded-full transition-all shadow-lg">
            Explore All Deals ({products.length}) <ArrowRight size={14} />
          </button>
        </div>

        {/* 6 Royal Gift Box Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {products.slice(0, 6).map((p, idx) => (
            <ScrollReveal key={p.id} delay={idx * 70} animation="scale-up" className="h-full">
              <div className="bg-[#200307]/90 rounded-2xl border border-red-400/40 overflow-hidden shadow-xl hover:border-red-300 transition-all cursor-pointer group flex flex-col h-full">
                <Link to={`/product/${p.id}`} className="relative h-32 md:h-40 bg-neutral-950 overflow-hidden block">
                  <MediaDisplay src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute top-2 left-2 bg-red-400 text-neutral-950 text-[9px] font-black px-2 py-0.5 rounded shadow flex items-center gap-1">
                    <Sparkles size={10} /> {p.badge || 'ROYAL GIFT'}
                  </div>
                  <button onClick={(e) => { e.preventDefault(); toggleWishlist(p); }}
                    className="absolute top-2 right-2 bg-neutral-900/80 rounded-full p-1.5 text-red-200 hover:text-red-500 transition-colors">
                    <Heart size={13} className={isWishlisted(p.id) ? 'fill-red-500 text-red-500' : ''} />
                  </button>
                </Link>

                <div className="p-3 flex flex-col flex-1 justify-between">
                  <div>
                    <span className="text-[9px] text-red-400 font-bold uppercase tracking-wider">{p.tag || 'FESTIVE SPECIAL'}</span>
                    <Link to={`/product/${p.id}`} className="font-cinzel text-red-100 text-xs font-bold leading-tight block mt-0.5 line-clamp-2 hover:text-red-300">
                      {p.name}
                    </Link>
                  </div>

                  <div className="mt-3">
                    <div className="flex items-baseline gap-1">
                      <span className="text-red-300 font-black text-sm">₹{p.price}</span>
                      {p.mrp && <span className="text-red-200/40 text-[10px] line-through">₹{p.mrp}</span>}
                    </div>

                    <button onClick={() => addToCart(p)}
                      className={`w-full mt-2 text-[11px] font-bold py-2 rounded-xl transition-all flex items-center justify-center gap-1 ${
                        isInCart(p.id) ? 'bg-emerald-600 text-white' : 'bg-gradient-to-r from-red-400 to-red-500 hover:from-red-300 hover:to-red-400 text-neutral-950 shadow-md'
                      }`}>
                      <ShoppingBag size={11} /> {isInCart(p.id) ? 'Added ✓' : 'Gift Now 🎁'}
                    </button>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
}

/* ── CATEGORY SECTIONS GRID ── */
function CategorySectionsGrid() {
  const { categories, products } = useData();
  const { addToCart, toggleWishlist, isInCart, isWishlisted } = useCart();
  const navigate = useNavigate();

  // Show ALL categories from the database in this preferred order
  const FEATURED = [
    'Sticker Set', 'Wiring Harness', 'Petrol Tank', 'Handle Bar Switch', 'Front Fork Leg', 'Speedometer', 'Side Panel', 'Piston Cylinder Kit', 'Stator Coil Plate', 'Fork Pipe', 'Carburetor', 'CDI'
  ];
  const featuredCats = FEATURED
    .map(name => categories.find(c => c.label === name))
    .filter(Boolean)
    // Also append any remaining categories not in the above list
    .concat(categories.filter(c => !FEATURED.includes(c.label)));

  // Helper: small compact card used in most layouts
  const SmallCard = ({ p }) => (
    <div className="bg-white rounded-2xl border border-red-100 overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer group flex flex-col">
      <Link to={`/product/${p.id}`} className="relative overflow-hidden block h-28 md:h-36 bg-red-50/50">
        <MediaDisplay src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        <div className="absolute top-2 left-2 bg-[#dc2626] text-white text-[9px] font-bold px-2 py-0.5 rounded-md shadow">{p.tag || 'PURE'}</div>
        <button onClick={e => { e.preventDefault(); e.stopPropagation(); toggleWishlist(p); }}
          className="absolute top-2 right-2 bg-white/90 rounded-full p-1.5 shadow-sm hover:scale-110 transition-transform">
          <Heart size={12} className={isWishlisted(p.id) ? 'fill-red-500 text-red-500' : 'text-neutral-400'} />
        </button>
      </Link>
      <div className="p-2 flex flex-col flex-1">
        <p className="text-[9px] text-[#dc2626] font-bold uppercase tracking-wider truncate">{p.badge || 'Katariya Auto Parts'}</p>
        <Link to={`/product/${p.id}`} className="text-neutral-800 text-[11px] font-bold leading-tight mt-0.5 line-clamp-2 hover:text-[#dc2626]">{p.name}</Link>
        <div className="flex items-baseline gap-1 mt-auto pt-2">
          <span className="text-neutral-900 font-black text-sm">₹{p.price}</span>
          {p.mrp && <span className="text-neutral-400 text-[10px] line-through">₹{p.mrp}</span>}
        </div>
        <button onClick={() => addToCart(p)} className={`w-full mt-1.5 text-[10px] font-bold py-1.5 rounded-xl transition-all flex items-center justify-center gap-1 ${isInCart(p.id) ? 'bg-emerald-600 text-white' : 'bg-gradient-to-r from-[#171717] to-[#dc2626] text-red-50'}`}>
          <ShoppingBag size={10} />{isInCart(p.id) ? 'Added ✓' : 'Add'}
        </button>
      </div>
    </div>
  );

  // Helper: horizontal card (image left, text right) used for Dairy/Sharbat
  const HorizontalCard = ({ p }) => (
    <div className="bg-white rounded-2xl border border-red-100 overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-row gap-0">
      <Link to={`/product/${p.id}`} className="relative overflow-hidden block w-24 md:w-32 flex-shrink-0 bg-red-50/50">
        <MediaDisplay src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
      </Link>
      <div className="p-3 flex flex-col flex-1 justify-between">
        <div>
          <p className="text-[9px] text-[#dc2626] font-bold uppercase tracking-wider">{p.tag || 'PREMIUM'}</p>
          <Link to={`/product/${p.id}`} className="text-neutral-800 text-xs font-bold leading-tight mt-0.5 line-clamp-2 hover:text-[#dc2626] block">{p.name}</Link>
        </div>
        <div className="flex items-center justify-between mt-2">
          <div>
            <span className="text-neutral-900 font-black text-sm">₹{p.price}</span>
            {p.mrp && <span className="text-neutral-400 text-[10px] line-through ml-1">₹{p.mrp}</span>}
          </div>
          <button onClick={() => addToCart(p)} className={`text-[10px] font-bold py-1 px-3 rounded-lg transition-all ${isInCart(p.id) ? 'bg-emerald-600 text-white' : 'bg-[#dc2626] text-white'}`}>
            {isInCart(p.id) ? '✓' : '+'}
          </button>
        </div>
      </div>
    </div>
  );

  // Section header row
  const SectionHeader = ({ cat, count }) => (
    <div className="flex items-center justify-between mb-4 pb-3 border-b border-red-200/50">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{cat.emoji}</span>
        <div>
          <h2 className="text-neutral-900 font-cinzel font-bold text-lg md:text-2xl leading-tight">{cat.label}</h2>
          <p className="text-neutral-400 text-xs">{count} products available</p>
        </div>
      </div>
      <button onClick={() => navigate('/category', { state: { category: cat.label } })}
        className="flex items-center gap-1 text-[#171717] text-xs font-bold bg-red-50 hover:bg-[#171717] hover:text-white border border-red-300 px-3 py-1.5 rounded-full transition-all">
        View All <ArrowRight size={13} />
      </button>
    </div>
  );

  return (
    <div className="space-y-4 md:space-y-5 mb-4">
      {featuredCats.map((cat, sectionIdx) => {
        const catProducts = products.filter(p => p.category === cat.label).slice(0, 6);

        // Fallback layout logic
        const bgPalette = [
          'bg-gradient-to-br from-red-50/80 to-red-50/60',
          'bg-gradient-to-br from-neutral-50/80 to-red-50/60',
          'bg-gradient-to-br from-green-50/60 to-emerald-50/40',
          'bg-gradient-to-br from-lime-50/60 to-green-50/50',
          'bg-gradient-to-br from-violet-50/40 to-purple-50/30',
          'bg-gradient-to-br from-teal-50/60 to-cyan-50/40',
        ];
        const bg = bgPalette[sectionIdx % bgPalette.length];
        const layoutVariant = sectionIdx % 3; // 0=grid, 1=scroll, 2=horizontal list

        if (layoutVariant === 1) return (
          <section key={cat.label} className="relative z-10 max-w-[1600px] mx-auto w-full px-4 md:px-6">
            <div className={`glass-panel rounded-3xl p-4 md:p-5 ${bg}`}>
              <SectionHeader cat={cat} count={catProducts.length} />
              <AutoScrollWrapper direction={sectionIdx % 2 === 0 ? 'right' : 'left'}>
                {[...catProducts, ...catProducts, ...catProducts].map((p, i) => (
                  <div key={p.id + '-' + i} className="flex-shrink-0 w-36 md:w-44 snap-start">
                    <SmallCard p={p} />
                  </div>
                ))}
              </AutoScrollWrapper>
            </div>
          </section>
        );

        if (layoutVariant === 2) return (
          <section key={cat.label} className="relative z-10 max-w-[1600px] mx-auto w-full px-4 md:px-6">
            <div className={`glass-panel rounded-3xl p-4 md:p-5 ${bg}`}>
              <SectionHeader cat={cat} count={catProducts.length} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                {catProducts.map(p => <HorizontalCard key={p.id} p={p} />)}
              </div>
            </div>
          </section>
        );

        // default: compact 3-col grid
        return (
          <section key={cat.label} className="relative z-10 max-w-[1600px] mx-auto w-full px-4 md:px-6">
            <div className={`glass-panel rounded-3xl p-4 md:p-5 ${bg}`}>
              <SectionHeader cat={cat} count={catProducts.length} />
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3">
                {catProducts.map(p => <SmallCard key={p.id} p={p} />)}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}

/* ── DEALS SECTION ── */
function DealsSection() {
  const { deals } = useData();
  const navigate = useNavigate();
  return (
    <section className="relative z-10 max-w-[1600px] mx-auto w-full px-4 md:px-6 mb-4">
      <div className="glass-panel rounded-3xl p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-neutral-900 font-cinzel font-bold text-xl md:text-3xl">Garage Flash Deals</h2>
            <p className="text-[#dc2626] text-sm md:text-base font-bold mt-0.5">Limited Time Harvest Savings 🎉</p>
          </div>
          <button onClick={() => navigate('/offers')}
            className="flex items-center gap-1.5 text-[#171717] text-xs md:text-sm font-bold border border-red-300 bg-red-50 px-4 py-2 rounded-full hover:bg-[#171717] hover:text-red-100 transition-all">
            View All Offers <ArrowRight size={14} />
          </button>
        </div>

        {/* Marquee Deal Cards */}
        <div className="overflow-hidden py-2 mask-edges whitespace-nowrap">
          <div className="animate-marquee gap-5">
            {[...deals, ...deals].map((d, index) => (
              <div key={`${d.id}-${index}`} onClick={() => navigate('/offers')}
                className="product-card flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer border border-red-200 shadow-md hover:shadow-xl transition-all mx-2 inline-block text-left"
                style={{ width: 195, backgroundColor: d.bg }}>
                <div className="relative overflow-hidden" style={{ height: 140 }}>
                  <MediaDisplay src={d.img} alt={d.sub} className="w-full h-full object-cover" />
                  <div className={`absolute inset-0 bg-gradient-to-t ${d.grad} opacity-20`} />
                  <span className="absolute top-2 left-2 bg-white/90 text-neutral-900 text-[10px] font-bold px-2 py-0.5 rounded-full shadow">{d.badge}</span>
                </div>
                <div className="p-3.5">
                  <p className="text-[#171717] font-black text-sm">{d.title}</p>
                  <p className="text-neutral-700 font-bold text-xs mt-0.5">{d.sub}</p>
                  <div className="flex items-center justify-between mt-2.5">
                    <span className="text-emerald-700 text-xs font-bold">{d.save}</span>
                    <button className="bg-[#171717] text-red-200 text-[10px] font-bold px-3 py-1 rounded-full hover:bg-red-600 hover:text-white transition-colors">Shop →</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── FARM ORIGIN MAP SECTION ── */
function FarmOriginSection() {
  return (
    <section className="relative z-10 max-w-[1600px] mx-auto w-full px-4 md:px-6 mb-4">
      <div className="bg-gradient-to-r from-[#171717] to-[#7f1d1d] rounded-3xl p-4 md:p-7 border border-red-400/40 text-red-50 shadow-xl relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-red-400/20 text-red-300 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck size={14} /> Direct From Source
            </div>
            <h2 className="font-cinzel text-2xl md:text-3xl font-bold leading-tight mb-2">
              100% Genuine OES Parts
            </h2>
            <p className="text-red-200/80 text-xs md:text-sm leading-relaxed mb-4">
              We provide parts directly sourced from OEM manufacturers ensuring high quality and perfect fit for your motorcycle.
            </p>

            <div className="grid grid-cols-2 gap-2.5 text-xs md:text-sm">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2.5 border border-red-300/30">
                <p className="font-bold text-red-300 text-xs">🌸 Pampore Valley, Kashmir</p>
                <p className="text-red-100/70 text-[10px] mt-0.5">Original OEM Engine Oils</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2.5 border border-red-300/30">
                <p className="font-bold text-red-300 text-xs">🌴 Wayanad, Kerala</p>
                <p className="text-red-100/70 text-[10px] mt-0.5">High-Piperine Black Pepper & Elaichi</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2.5 border border-red-300/30">
                <p className="font-bold text-red-300 text-xs">🌰 California & Afghanistan</p>
                <p className="text-red-100/70 text-[10px] mt-0.5">Jumbo Almonds, Figs & Pistachios</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2.5 border border-red-300/30">
                <p className="font-bold text-red-300 text-xs">🐄 Gir Forests, Gujarat</p>
                <p className="text-red-100/70 text-[10px] mt-0.5">Pure Traditional Bilona A2 Ghee</p>
              </div>
            </div>
          </div>

          <div className="relative flex justify-center">
            <div className="w-full max-w-md aspect-video rounded-2xl overflow-hidden border-2 border-red-400/50 shadow-2xl">
              <img src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=800" alt="Auto Parts" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── TRUST BAR ── */
function TrustBar() {
  return (
    <section className="relative z-10 max-w-[1600px] mx-auto w-full px-4 md:px-6 mb-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {[
          { icon: ShieldCheck, label: '100% Pure OES', sub: 'Highest Quality Standards', color: '#dc2626' },
          { icon: Truck, label: 'Express Shipping', sub: 'Free over ₹999 order', color: '#059669' },
          { icon: Award, label: 'FSSAI Certified', sub: 'Lab Tested Grade A+', color: '#dc2626' },
          { icon: Scale, label: 'Exact Weight', sub: 'Precision Sealed Packs', color: '#7c3aed' },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <ScrollReveal key={item.label} delay={idx * 100} className="h-full">
              <div className="group flex items-center gap-3 bg-white rounded-2xl p-3.5 md:p-4 border border-red-200/80 shadow-md hover:shadow-xl transition-all duration-300">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-red-50 border border-red-200">
                  <Icon size={20} style={{ color: item.color }} />
                </div>
                <div>
                  <p className="text-neutral-900 font-bold text-xs md:text-sm">{item.label}</p>
                  <p className="text-neutral-500 text-[10px] md:text-xs mt-0.5 font-medium">{item.sub}</p>
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}

/* ── FOOTER ── */
function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="relative bg-[#1c0f05] text-red-50 mt-6 overflow-hidden border-t border-red-900/60 pb-24 md:pb-0">
      <div className="relative z-10 max-w-[1600px] mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand info */}
          <div>
            <div className="flex items-center gap-3 mb-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="w-11 h-11 rounded-full border-2 border-red-400 bg-red-50 p-0.5 overflow-hidden">
                <img src="/logo.png" alt="Katariya Auto Parts" className="w-full h-full object-contain" />
              </div>
              <div>
                <p className="font-cinzel font-bold text-lg text-red-100">katariya auto parts</p>
                <p className="text-[#dc2626] text-[9px] font-bold tracking-wider uppercase">Genuine Spare Parts</p>
              </div>
            </div>
            <p className="text-red-200/70 text-xs leading-relaxed mb-3">
              Katariya Auto Parts brings 100% genuine motorcycle spare parts, accessories, engine oils, and riding gear direct to your garage.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <p className="font-cinzel font-bold text-xs uppercase tracking-wider text-red-200 mb-3">Quick Navigation</p>
            <div className="flex flex-col gap-2 text-xs text-red-100/70 font-semibold">
              <button onClick={() => navigate('/')} className="hover:text-red-400 text-left">Home</button>
              <button onClick={() => navigate('/category')} className="hover:text-red-400 text-left">Store Catalogue</button>
              <button onClick={() => navigate('/offers')} className="hover:text-red-400 text-left">Festive Deals & Offers</button>
              <button onClick={() => navigate('/hub')} className="hover:text-red-400 text-left">Garage & Maintenance Hub</button>
              <button onClick={() => navigate('/account')} className="hover:text-red-400 text-left">My Account</button>
              <button onClick={() => navigate('/admin')} className="text-red-400 hover:text-white text-left font-bold mt-1">Admin Panel ⚙️</button>
            </div>
          </div>

          {/* Categories */}
          <div>
            <p className="font-cinzel font-bold text-xs uppercase tracking-wider text-red-200 mb-3">Categories</p>
            <div className="flex flex-col gap-2 text-xs text-red-100/70 font-semibold">
              <button onClick={() => navigate('/category', { state: { category: 'Engine Oils' } })} className="hover:text-red-400 text-left">Engine Oils & Lubricants</button>
              <button onClick={() => navigate('/category', { state: { category: 'Accessories' } })} className="hover:text-red-400 text-left">Bike Accessories</button>
              <button onClick={() => navigate('/category', { state: { category: 'Brakes' } })} className="hover:text-red-400 text-left">Brake Pads & Callipers</button>
              <button onClick={() => navigate('/category', { state: { category: 'Helmets' } })} className="hover:text-red-400 text-left">Helmets & Riding Gear</button>
              <button onClick={() => navigate('/category', { state: { category: 'Chains' } })} className="hover:text-red-400 text-left">Chain & Sprocket Kits</button>
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="font-cinzel font-bold text-xs uppercase tracking-wider text-red-200 mb-3">Contact & Support</p>
            <div className="flex flex-col gap-1.5 text-xs text-red-100/70 font-semibold mb-3">
              <p>📞 Helpline: +91 8062365021</p>
              <p>✉️ Email: support@katariyaautoparts.com</p>
              <p>📍 Mumbai • Pune • Delhi</p>
            </div>
            <div className="bg-red-900/40 p-2.5 rounded-xl border border-red-400/30">
              <p className="text-[10px] font-bold text-red-300 uppercase mb-1.5">Subscribe for Garage Updates</p>
              <div className="flex gap-1.5">
                <input placeholder="Enter your email" className="bg-neutral-900 border border-red-400/30 text-xs px-2.5 py-1.5 rounded-lg flex-1 text-white outline-none" />
                <button className="bg-red-500 text-neutral-900 text-xs font-bold px-3 py-1.5 rounded-lg">Join</button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-red-900/60 pt-4 flex justify-between text-xs text-red-200/50">
          <p>© 2026 Katariya Auto Parts — Genuine Spare Parts. All rights reserved.</p>
          <div className="flex gap-4">
            <span>ISO Certified</span>
            <span>FSSAI Approved</span>
            <span>Zero Preservatives</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ── HOME PAGE ── */
/* AUTO SCROLL WRAPPER */
function AutoScrollWrapper({ children, direction = 'left', speed = 0.5, className = "flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 snap-x snap-mandatory scrollbar-none" }) {
  const scrollRef = React.useRef(null);
  const [isPaused, setIsPaused] = React.useState(false);
  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let rafId;
    let lastTime = performance.now();
    const scroll = (time) => {
      if (isPaused) { lastTime = time; rafId = requestAnimationFrame(scroll); return; }
      const deltaTime = time - lastTime;
      lastTime = time;
      const movePixels = speed * (deltaTime / 16);
      if (direction === 'left') {
        el.scrollLeft += movePixels;
        if (el.scrollLeft >= el.scrollWidth / 2) { el.scrollLeft -= el.scrollWidth / 2; }
      } else {
        if (el.scrollLeft <= 0) { el.scrollLeft += el.scrollWidth / 2; }
        el.scrollLeft -= movePixels;
      }
      rafId = requestAnimationFrame(scroll);
    };
    rafId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(rafId);
  }, [direction, speed, isPaused]);
  return (
    <div ref={scrollRef} className={className} onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)} onTouchStart={() => setIsPaused(true)} onTouchEnd={() => setIsPaused(false)}>
      {children}
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen mesh-bg">
      {/* Announcement Marquee Bar */}
      <div className="bg-gradient-to-r from-[#171717] via-[#7f1d1d] to-[#171717] py-1.5 overflow-hidden border-b border-red-400/30">
        <div className="animate-marquee gap-12 text-red-200 text-xs font-bold whitespace-nowrap">
          <span>✨ 100% Genuine Auto Parts & Accessories</span>
          <span>•</span>
          <span>🔧 Top Brands: Hero, Bajaj, Honda, TVS, Yamaha & More</span>
          <span>•</span>
          <span>🚚 FREE Express Shipping on Orders Over ₹999</span>
          <span>•</span>
          <span>🎁 Promo Code: RIDE10 for 10% Extra Off</span>
        </div>
      </div>

      <Header />

      <main className="pt-2 space-y-4">
        <ScrollReveal delay={0}><HeroCarousel /></ScrollReveal>
        
        <div className="max-w-[1600px] mx-auto px-4 md:px-6">
          <ScrollReveal delay={50}><YMMFilter /></ScrollReveal>
        </div>

        <ScrollReveal delay={100}><SiteHeroBannersSection /></ScrollReveal>
        <ScrollReveal delay={100}><QuickCategories /></ScrollReveal>
        <ScrollReveal delay={100}><CategorySectionsGrid /></ScrollReveal>
        <ScrollReveal delay={100}><DealsSection /></ScrollReveal>
        <ScrollReveal delay={100}><TrustBar /></ScrollReveal>
      </main>

      <Footer />
    </div>
  );
}
