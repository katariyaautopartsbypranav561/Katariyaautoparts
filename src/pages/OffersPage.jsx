import React, { useState } from 'react';
import { Clock, Tag, Star, ShoppingBag, Heart, Flame, Zap, Copy, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import ScrollReveal from '../components/ScrollReveal';
import MediaDisplay from '../components/MediaDisplay';
import { useCart } from '../context/CartContext';

const COUPONS = [
  { id: 1, title: 'FESTIVE HARVEST', sub: 'Flat 25% Off Luxury Combo Hampers', expiry: '3 Days Left', grad: 'from-[#171717] to-[#dc2626]', emoji: '🎁', code: 'FESTIVE25' },
  { id: 2, title: 'RIDER SPECIAL', sub: '10% Extra Off Sitewide on All Orders', expiry: 'Ongoing', grad: 'from-[#047857] to-[#10b981]', emoji: '✨', code: 'RIDE10' },
  { id: 3, title: 'HELMETS & GEAR', sub: '20% Off Studds & Steelbird Helmets', expiry: '5 Days Left', grad: 'from-[#b91c1c] to-[#78350F]', emoji: '🌸', code: 'SAFFRON20' },
  { id: 4, title: 'ENGINE OILS', sub: '15% Off Motul & Castrol Oils', expiry: '4 Days Left', grad: 'from-[#7f1d1d] to-[#dc2626]', emoji: '🌿', code: 'SPICE15' },
];

const FLASH_PRODUCTS = [
  { id: 1, name: 'Full Face Helmet', price: 499, mrp: 699, img: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=250&h=250&fit=crop', rating: 4.9, off: '28% OFF', left: 8 },
  { id: 2, name: 'Jumbo California Almonds (500g)', price: 649, mrp: 849, img: 'https://images.unsplash.com/photo-1509358271058-acd01cc9386a?w=250&h=250&fit=crop', rating: 4.8, off: '23% OFF', left: 14 },
  { id: 3, name: 'Royal King Cashews W240 (500g)', price: 799, mrp: 999, img: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=250&h=250&fit=crop', rating: 4.7, off: '20% OFF', left: 19 },
  { id: 4, name: 'Premium Chain Spray (500g)', price: 899, mrp: 1199, img: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=250&h=250&fit=crop', rating: 4.9, off: '25% OFF', left: 5 },
  { id: 5, name: 'Green Cardamom Pods (250g)', price: 599, mrp: 799, img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=250&h=250&fit=crop', rating: 4.8, off: '25% OFF', left: 11 },
  { id: 6, name: 'A2 Gir Cow Bilona Ghee (500ml)', price: 1299, mrp: 1599, img: 'https://images.unsplash.com/photo-1608797178974-15b35a64ede9?w=250&h=250&fit=crop', rating: 4.9, off: '18% OFF', left: 6 },
];

function CouponCard({ item, delay }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard?.writeText(item.code).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <ScrollReveal delay={delay} className="flex-shrink-0 md:flex-shrink min-w-[250px] h-full">
      <div className={`bg-gradient-to-r ${item.grad} rounded-2xl p-5 text-red-50 relative overflow-hidden h-full flex flex-col shadow-lg border border-red-300/30`}>
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-4 translate-x-4" />
        <div className="text-3xl mb-2">{item.emoji}</div>
        <p className="font-cinzel font-bold text-lg leading-tight">{item.title}</p>
        <p className="text-red-100/80 text-xs mt-0.5 font-medium">{item.sub}</p>
        <div className="flex items-center gap-2 mt-4">
          <div className="flex-1 bg-black/20 border border-red-300/40 border-dashed rounded-xl px-3 py-1.5 flex items-center justify-between">
            <span className="font-mono font-black text-sm tracking-widest text-red-200">{item.code}</span>
            <button onClick={copy} className="hover:scale-110 transition-transform">
              {copied ? <Check size={14} className="text-emerald-300" /> : <Copy size={14} className="text-red-200" />}
            </button>
          </div>
        </div>
        <div className="flex items-center gap-1 mt-auto pt-3 text-[10px] text-red-200/80 font-bold">
          <Clock size={11} /> <span>{item.expiry}</span>
        </div>
      </div>
    </ScrollReveal>
  );
}

export default function OffersPage() {
  const { addToCart, toggleWishlist, isInCart, isWishlisted } = useCart();

  return (
    <div className="min-h-screen mesh-bg">
      <Header />
      <main className="pb-24 md:pb-12">

        {/* Hero */}
        <ScrollReveal>
          <div className="bg-gradient-to-r from-[#171717] via-[#dc2626] to-[#b91c1c] relative overflow-hidden border-b border-red-400/40 shadow-xl">
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-14 relative text-red-50">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Flame size={20} className="text-red-300" />
                    <span className="text-red-300 text-xs font-bold uppercase tracking-widest">Harvest Deals Zone</span>
                  </div>
                  <h1 className="font-cinzel font-bold text-3xl md:text-5xl leading-tight">Auto Parts Offers & Bundles 🎉</h1>
                  <p className="text-red-100 text-sm md:text-base mt-2">Authentic OEM spare parts, engine oils, and riding gear at wholesale prices.</p>
                </div>
                
                {/* Countdown Timer */}
                <div className="bg-black/20 backdrop-blur-md border border-red-300/40 rounded-2xl p-4 md:p-6 text-center">
                  <p className="text-red-200 text-xs font-bold uppercase tracking-wider mb-2.5 flex items-center gap-1.5 justify-center">
                    <Zap size={14} className="text-red-300" /> Flash Sale Ends In
                  </p>
                  <div className="flex items-center gap-2 justify-center">
                    {[{ val: '06', label: 'Hrs' }, { val: '24', label: 'Min' }, { val: '45', label: 'Sec' }].map(t => (
                      <React.Fragment key={t.label}>
                        <div className="text-center">
                          <div className="bg-red-500 text-neutral-950 font-black text-2xl md:text-3xl px-3.5 py-1.5 rounded-xl min-w-[50px] shadow">{t.val}</div>
                          <p className="text-red-200 text-[10px] mt-1 font-bold">{t.label}</p>
                        </div>
                        {t.label !== 'Sec' && <span className="text-red-300 font-bold text-2xl -mt-4">:</span>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <div className="max-w-7xl mx-auto px-4 md:px-6">

          {/* Active Coupons Section */}
          <ScrollReveal delay={100}>
            <section className="mt-8 md:mt-10">
              <div className="flex items-center gap-2 mb-4">
                <Tag size={18} className="text-[#dc2626]" />
                <h2 className="text-neutral-900 font-cinzel font-bold text-xl">Active Promo Codes</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {COUPONS.map((c, idx) => <CouponCard key={c.id} item={c} delay={idx * 100} />)}
              </div>
            </section>
          </ScrollReveal>

          {/* Flash Deals */}
          <ScrollReveal delay={100}>
            <section className="mt-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Zap size={18} className="text-[#dc2626]" />
                  <h2 className="text-neutral-900 font-cinzel font-bold text-xl">⚡ Limited Farm Flash Deals</h2>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {FLASH_PRODUCTS.map((p, idx) => (
                  <ScrollReveal key={p.id} delay={(idx % 6) * 80} className="h-full">
                    <Link to={`/product/${p.id}`} className="block bg-white rounded-2xl border border-red-200 overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer h-full flex flex-col">
                      <div className="relative bg-red-50 overflow-hidden" style={{ height: 135 }}>
                        <MediaDisplay src={p.img} alt={p.name} className="w-full h-full object-cover" />
                        <span className="absolute top-2 left-2 bg-[#dc2626] text-white text-[9px] font-bold px-2 py-0.5 rounded-md">{p.off}</span>
                        <div className="absolute bottom-0 left-0 right-0 bg-neutral-900/80 text-red-300 text-[9px] font-bold text-center py-0.5">
                          Only {p.left} packs left!
                        </div>
                      </div>
                      <div className="p-3 flex flex-col flex-1">
                        <p className="text-neutral-800 text-xs font-bold leading-tight line-clamp-2">{p.name}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star size={9} className="text-emerald-600 fill-emerald-600" />
                          <span className="text-neutral-600 text-[10px] font-bold">{p.rating}</span>
                        </div>
                        <div className="flex items-baseline gap-1 mt-1.5">
                          <span className="text-neutral-900 font-black text-sm">₹{p.price}</span>
                          <span className="text-neutral-400 text-[10px] line-through">₹{p.mrp}</span>
                        </div>
                        <div className="mt-auto pt-2">
                          <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(p); }}
                            className={`w-full text-[10px] font-bold py-1.5 rounded-xl transition-all ${isInCart(p.id) ? 'bg-emerald-600 text-white' : 'bg-[#171717] text-red-200 hover:bg-[#dc2626] hover:text-white'}`}>
                            {isInCart(p.id) ? '✓ Added' : '+ Add to Cart'}
                          </button>
                        </div>
                      </div>
                    </Link>
                  </ScrollReveal>
                ))}
              </div>
            </section>
          </ScrollReveal>

        </div>
      </main>
    </div>
  );
}
