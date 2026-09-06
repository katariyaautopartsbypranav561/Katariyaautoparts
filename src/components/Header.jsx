import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Search, Heart, ShoppingBag, ChevronDown,
  MapPin, Phone, User, Tag, Sparkles, Award
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import Fuse from 'fuse.js';

const NAV_LINKS = [
  { label: 'Home',           path: '/' },
  { label: 'Store Catalogue',path: '/category', hasDropdown: true },
  { label: 'Deals & Offers', path: '/offers' },
  { label: 'Contact Us',     path: '/contact' },
  { label: 'My Account',     path: '/account' },
];

const SHOP_DROPS = [
  { label: '🏍️ HERO',    sub: 'Splendor, Passion, HF Deluxe' },
  { label: '⚡ BAJAJ',    sub: 'Pulsar, Dominar, Platina' },
  { label: '🛵 HONDA',    sub: 'Activa, Shine, SP 125' },
  { label: '🚀 TVS',      sub: 'Apache, Jupiter, Raider' },
  { label: '🎸 YAMAHA',   sub: 'R15, MT-15, FZ' },
  { label: '👑 ENFIELD',  sub: 'Classic 350, Bullet, Meteor' },
];

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount, wishlistItems, setCartOpen } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { products, frontendSettings } = useData();
  const settings = frontendSettings || {};
  const wishlistCount = wishlistItems ? wishlistItems.length : 0;

  const [shopOpen, setShopOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const suggestions = React.useMemo(() => {
    if (!query.trim()) return [];
    const fuse = new Fuse(products, {
      keys: ['name', 'brand', 'category'],
      threshold: 0.4,
      ignoreLocation: true,
      useExtendedSearch: true,
      ignoreFieldNorm: true,
      distance: 1000
    });
    return fuse.search(query).slice(0, 5).map(r => r.item);
  }, [query, products]);
  
  const handleSearch = () => {
    if (query.trim()) {
      navigate('/category', { state: { searchQuery: query } });
      setShopOpen(false);
      setShowSuggestions(false);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* ── TOP UTILITY BAR (desktop) ── */}
      <div className="hidden md:block bg-[#171717] text-red-50 text-xs">
        <div className="max-w-[1600px] mx-auto px-6 py-1.5 flex items-center justify-between">
          <div className="flex items-center gap-4 text-red-200">
            <span className="flex items-center gap-1.5 font-medium"><Phone size={11} /> Helpline: +91 8062365021</span>
            <span className="flex items-center gap-1.5"><MapPin size={11} /> Genuine Spare Parts | 100% Guaranteed Fit</span>
          </div>
          <div className="flex items-center gap-4 text-red-200">
            <span className="flex items-center gap-1"><Award size={11} className="text-red-400" /> OEM Certified Parts</span>
            <span>|</span>
            <span>🚚 Free Express Shipping on Orders Over ₹999</span>
            <span>|</span>
            <button onClick={() => navigate('/offers')} className="text-red-300 font-bold hover:text-white transition-colors flex items-center gap-1">
              <Sparkles size={11} /> Promo Code: RIDE10
            </button>
          </div>
        </div>
      </div>

      {/* ── MAIN NAVIGATION HEADER ── */}
      <header className="bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b border-red-200/60 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-2.5 flex items-center flex-wrap md:flex-nowrap gap-y-3 gap-x-4">

          <Link to="/" className="flex items-center gap-3 group">
            <img src="/logo.png" alt="Katariya Auto Parts" className="h-10 md:h-12 object-contain group-hover:scale-105 transition-transform" />
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 ml-4">
            {NAV_LINKS.map(link => (
              <div key={link.label} className="relative group">
                <button
                  onClick={() => !link.hasDropdown && navigate(link.path)}
                  onMouseEnter={() => link.hasDropdown && setShopOpen(true)}
                  onMouseLeave={() => link.hasDropdown && setShopOpen(false)}
                  className={`desk-nav-link flex items-center gap-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                    isActive(link.path)
                      ? 'text-[#dc2626] active'
                      : 'text-neutral-700 hover:text-[#dc2626] hover:bg-red-50'
                  }`}
                >
                  {link.label}
                  {link.hasDropdown && <ChevronDown size={13} className="opacity-60" />}
                </button>

                {link.hasDropdown && (
                  <div
                    onMouseEnter={() => setShopOpen(true)}
                    onMouseLeave={() => setShopOpen(false)}
                    className={`absolute top-full left-0 mt-1 w-80 bg-white rounded-2xl shadow-2xl border border-red-200 overflow-hidden transition-all duration-200 ${
                      shopOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'
                    }`}
                  >
                    <div className="p-2.5">
                      {SHOP_DROPS.map(d => (
                        <button
                          key={d.label}
                          onClick={() => { 
                            const categoryName = d.label.split(' ').slice(1).join(' ');
                            navigate('/category', { state: { category: categoryName } }); 
                            setShopOpen(false); 
                          }}
                          className="w-full flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 transition-colors text-left group"
                        >
                          <span className="text-xl flex-shrink-0 mt-0.5">{d.label.split(' ')[0]}</span>
                          <div>
                            <p className="text-neutral-800 font-bold text-sm group-hover:text-[#dc2626] transition-colors">
                              {d.label.substring(d.label.indexOf(' ') + 1)}
                            </p>
                            <p className="text-neutral-400 text-xs">{d.sub}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                    <div className="bg-red-50/80 px-4 py-2.5 border-t border-red-100 flex justify-between items-center">
                      <button onClick={() => { navigate('/category'); setShopOpen(false); }}
                        className="text-[#dc2626] text-xs font-bold hover:underline">
                        View All Categories →
                      </button>
                      <span className="text-[10px] text-red-800 font-bold bg-red-200/60 px-2 py-0.5 rounded-full">100% Genuine</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Search Input Bar */}
          <div className="w-full order-3 md:order-none md:w-auto md:flex-1 flex justify-center min-w-[200px] md:px-4">
            <div className="search-bar relative w-full max-w-xl flex items-center bg-red-50/60 border border-red-200/80 rounded-xl px-3 py-2 gap-2 transition-all duration-200 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-300/40">
              <Search size={15} className="text-red-700/60 flex-shrink-0" />
              <input
                type="text"
                value={query}
                onChange={e => {
                  setQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                placeholder="Search parts for Pulsar, Splendor, Activa..."
                className="flex-1 bg-transparent text-sm text-neutral-800 placeholder-blue-800/40 outline-none min-w-0 font-medium"
              />
              {query && (
                <button onClick={() => { setQuery(''); setShowSuggestions(false); }} className="text-neutral-400 hover:text-neutral-600">
                  <span className="text-xs font-bold">✕</span>
                </button>
              )}
              <button onClick={handleSearch} className="hidden md:flex items-center gap-1.5 bg-gradient-to-r from-[#dc2626] to-[#ef4444] hover:from-[#b91c1c] hover:to-[#dc2626] rounded-lg px-3 py-1 flex-shrink-0 shadow-sm transition-all">
                <Search size={13} className="text-white" />
                <span className="text-white text-xs font-bold">Search</span>
              </button>
              <button onClick={handleSearch} className="md:hidden bg-[#dc2626] rounded-lg p-1.5 flex-shrink-0">
                <Search size={14} className="text-white" />
              </button>

              {/* Suggestions Dropdown */}
              {showSuggestions && query.trim() !== '' && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-red-200 overflow-hidden z-50">
                  {suggestions.length > 0 ? (
                    <div className="py-2">
                      {suggestions.map((item, idx) => (
                        <div 
                          key={idx} 
                          className="px-4 py-2 hover:bg-red-50 cursor-pointer flex items-center gap-3 transition-colors"
                          onClick={() => {
                            navigate(`/product/${item.id}`);
                            setShowSuggestions(false);
                            setQuery('');
                          }}
                        >
                          {item.img && (
                            <img src={item.img} alt={item.name} className="w-9 h-9 object-cover rounded-md flex-shrink-0 border border-red-200" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-neutral-800 truncate">{item.name}</p>
                            <p className="text-xs text-red-700 font-medium truncate">{item.category} • ₹{item.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-sm text-neutral-500">
                      No matching products for "{query}"
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-1.5 flex-shrink-0 ml-auto md:ml-0">
            {/* Wishlist */}
            <button
              onClick={() => navigate('/account')}
              className="relative p-2 rounded-xl hover:bg-red-100/50 transition-colors"
              aria-label="Wishlist"
            >
              <Heart size={22} className="text-neutral-700" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Trigger Button */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 rounded-xl hover:bg-red-100/50 transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag size={22} className="text-neutral-700" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#dc2626] text-white text-[9px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center badge-pulse shadow-md">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Account / Login */}
            {isAuthenticated ? (
              <button
                onClick={() => navigate('/account')}
                className="hidden md:flex items-center gap-2 ml-1 px-3.5 py-2 bg-red-100/80 hover:bg-red-200/80 text-[#171717] rounded-xl transition-colors font-bold text-sm border border-red-200"
              >
                <User size={16} />
                <span>{user?.name?.split(' ')[0] || 'Account'}</span>
              </button>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="hidden md:flex items-center gap-2 ml-1 px-3.5 py-2 bg-[#171717] hover:bg-[#7f1d1d] text-red-50 rounded-xl transition-colors font-bold text-sm shadow-sm"
              >
                <User size={16} />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>

        {/* Category Strip */}
        <div className="border-t border-red-100 bg-red-50/50 py-1.5 px-4 md:px-6">
          <div className="max-w-[1600px] mx-auto flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {[
              { label: '✨ Hero Parts', category: 'HERO', query: 'Hero' },
              { label: '🏍️ Bajaj Pulsar', category: 'BAJAJ', query: 'Pulsar' },
              { label: '🛵 Honda Activa', category: 'HONDA', query: 'Activa' },
              { label: '🚀 TVS Apache', category: 'TVS', query: 'Apache' },
              { label: '🎸 Yamaha R15', category: 'YAMAHA', query: 'R15' },
              { label: '👑 Enfield Bullet', category: 'ROYAL ENFIELD', query: 'Bullet' },
              { label: '🛢️ Engine Oils', category: 'ENGINE OIL', query: '' },
              { label: '🔧 Accessories', category: 'ACCESSORIES', query: '' },
            ].map(item => {
              const currentCat = location.state?.category;
              const currentQuery = location.state?.searchQuery || '';
              const isSelected = (currentCat === item.category && (!item.query || currentQuery.toLowerCase().includes(item.query.toLowerCase()))) ||
                                 (currentQuery && item.query && currentQuery.toLowerCase().includes(item.query.toLowerCase()));
              return (
                <button
                  key={item.label}
                  onClick={() => navigate('/category', { state: { category: item.category, searchQuery: item.query } })}
                  className={`flex-shrink-0 text-xs font-bold px-3 py-1 rounded-full border transition-all whitespace-nowrap ${
                    isSelected
                      ? 'bg-[#171717] text-red-300 border-[#171717] shadow-sm'
                      : 'bg-white/80 text-neutral-700 border-red-200 hover:border-[#dc2626] hover:text-[#dc2626] hover:bg-red-50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>
    </>
  );
}
