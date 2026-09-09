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
