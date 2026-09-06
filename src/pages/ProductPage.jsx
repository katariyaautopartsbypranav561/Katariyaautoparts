import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Star, Heart, ShoppingBag, ChevronRight, ShieldCheck, Truck, RotateCcw, Plus, Minus, Award, Sparkles, CheckCircle2, Share2 } from 'lucide-react';
import Header from '../components/Header';
import ScrollReveal from '../components/ScrollReveal';
import MediaDisplay from '../components/MediaDisplay';
import { useCart } from '../context/CartContext';
import { useData } from '../context/DataContext';

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products } = useData();
  const { addToCart, toggleWishlist, isWishlisted, setCartOpen } = useCart();
  
  const product = products.find(p => String(p.id) === String(id));
  
  const handleShare = async () => {
    if (!product) return;
    const messages = [
      `Hey look, I found this part for your ride: ${product.name}!`,
      `Check out this ${product.name} I found on Katariya Auto Parts!`,
      `Need a ${product.name}? Found a great deal here.`,
      `I think this ${product.name} is exactly what you were looking for.`
    ];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    const shareUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: randomMessage,
          url: shareUrl,
        });
      } catch (err) {
        console.log('Share canceled or failed', err);
      }
    } else {
      navigator.clipboard.writeText(`${randomMessage} ${shareUrl}`);
      alert('Link and message copied to clipboard!');
    }
  };

  useEffect(() => {
    if (product) {
      document.title = `${product.name} | Katariya Auto Parts`;
      
      const setMetaTag = (property, content) => {
        let meta = document.querySelector(`meta[property="${property}"]`);
        if (!meta) {
          meta = document.createElement('meta');
          meta.setAttribute('property', property);
          document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
      };

      setMetaTag('og:title', product.name);
      setMetaTag('og:image', product.img);
      setMetaTag('og:description', product.description || 'Genuine auto spare parts.');
      setMetaTag('og:url', window.location.href);
      setMetaTag('twitter:card', 'summary_large_image');
    }
  }, [product]);
  
  const parsedVariants = useMemo(() => {
    if (!product) return [];
    try {
      if (product.variants && typeof product.variants === 'string') {
        const v = JSON.parse(product.variants);
        if (Array.isArray(v) && v.length > 0) return v;
      }
    } catch(e){}
    return [];
  }, [product]);

  const [activeImage, setActiveImage] = useState(0);
  const [selectedVariant, setSelectedWeight] = useState(parsedVariants.length > 0 ? parsedVariants[0].label : '');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    if (parsedVariants.length > 0) {
      if (!parsedVariants.find(v => v.label === selectedVariant)) {
        setSelectedWeight(parsedVariants[0].label);
      }
    } else {
      setSelectedWeight('');
    }
  }, [parsedVariants, selectedVariant]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen mesh-bg pb-32 md:pb-0 flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <h2 className="text-2xl font-cinzel font-bold text-neutral-900 mb-2">Product Not Found</h2>
          <p className="text-neutral-500 mb-6">The requested auto part does not exist.</p>
          <button onClick={() => navigate('/category')} className="bg-[#171717] text-red-200 px-6 py-3 rounded-xl font-bold hover:bg-red-600 hover:text-white transition-colors">
            Return to Store Catalogue
          </button>
        </div>
      </div>
    );
  }

  const activeVariant = parsedVariants.find(v => v.label === selectedVariant);
  const computedPrice = activeVariant ? Number(activeVariant.price) : Number(product.price || 0);
  const computedMrp   = activeVariant ? Number(activeVariant.mrp) : Number(product.mrp || Math.round(computedPrice * 1.3));

  const gallery = [product.img, ...(product.images ? (typeof product.images === 'string' ? JSON.parse(product.images) : product.images) : [])];
  const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="min-h-screen mesh-bg pb-32 md:pb-0">
      <Header />
      
      <main className="pb-28 md:pb-16 pt-4">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          
          {/* Breadcrumbs */}
          <ScrollReveal>
            <div className="flex items-center gap-2 text-xs md:text-sm text-neutral-500 mb-6 overflow-x-auto whitespace-nowrap pb-1">
              <Link to="/" className="hover:text-[#dc2626] transition-colors">Home</Link>
              <ChevronRight size={13} />
              <Link to="/category" state={{ category: product.category }} className="hover:text-[#dc2626] transition-colors">{product.category}</Link>
              <ChevronRight size={13} />
              <span className="text-neutral-900 font-bold truncate">{product.name}</span>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14 bg-white/90 backdrop-blur-md rounded-3xl p-5 md:p-10 border border-red-200/80 shadow-xl">
            
            {/* Image Gallery */}
            <ScrollReveal>
              <div className="flex flex-col-reverse md:flex-row gap-4">
                {/* Thumbnails */}
                <div className="flex md:flex-col gap-3 overflow-x-auto md:w-20 flex-shrink-0 hide-scrollbar">
                  {gallery.map((img, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${activeImage === idx ? 'border-[#dc2626] shadow-md' : 'border-red-100 opacity-70 hover:opacity-100'}`}
                    >
                      <MediaDisplay src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover bg-red-50" />
                    </button>
                  ))}
                </div>
                
                {/* Main Product Showcase */}
                <div className="flex-1 bg-red-50/50 rounded-2xl md:rounded-3xl overflow-hidden relative aspect-square md:aspect-auto md:h-[480px] border border-red-200">
                  {product.tag && (
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-[#171717] to-[#dc2626] text-red-100 text-xs font-bold px-3 py-1.5 rounded-lg shadow-md z-10">
                      {product.tag}
                    </div>
                  )}
                  <button className="absolute top-4 right-16 p-2.5 bg-white/90 rounded-full hover:scale-110 text-neutral-600 transition-all z-10 shadow-md"
                    onClick={handleShare}>
                    <Share2 size={20} />
                  </button>
                  <button className="absolute top-4 right-4 p-2.5 bg-white/90 rounded-full hover:scale-110 text-neutral-600 transition-all z-10 shadow-md"
                    onClick={() => toggleWishlist(product)}>
                    <Heart size={20} className={isWishlisted(product.id) ? "fill-red-500 text-red-500" : ""} />
                  </button>
                  <MediaDisplay src={gallery[activeImage]} alt={product.name} className="w-full h-full object-cover p-2" />
                </div>
              </div>
            </ScrollReveal>

            {/* Product Details */}
            <ScrollReveal delay={100}>
              <div className="flex flex-col">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[#dc2626] font-bold text-xs tracking-wider uppercase bg-red-100 px-2.5 py-1 rounded-full">{product.brand || 'Katariya Auto Parts'}</span>
                  <span className="text-emerald-700 text-xs font-bold flex items-center gap-1"><ShieldCheck size={14} /> 100% Genuine Fit</span>
                </div>
                
                <h1 className="text-xl md:text-3xl font-cinzel font-bold text-neutral-900 leading-tight mb-2">{product.name}</h1>
                
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex items-center gap-1 bg-emerald-600 text-white px-2 py-0.5 rounded-md">
                    <Star size={14} className="fill-white" />
                    <span className="font-bold text-xs">{product.rating}</span>
                  </div>
                  <span className="text-xs text-neutral-500 font-medium">({product.reviews?.toLocaleString() || 120} Lab Verified Reviews)</span>
                </div>

                {/* Pricing Calculation */}
                <div className="flex items-baseline gap-3 mb-6 bg-red-50/80 p-4 rounded-2xl border border-red-200">
                  <span className="text-3xl md:text-4xl font-black text-[#171717]">₹{computedPrice}</span>
                  {computedMrp && <span className="text-base md:text-lg text-neutral-400 line-through font-semibold">₹{computedMrp}</span>}
                  <span className="ml-auto text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg">
                    Save ₹{computedMrp - computedPrice}
                  </span>
                </div>

                {/* Pack Size / Weight Variable Selector */}
                {parsedVariants.length > 0 && (
                  <div className="mb-6">
                    <p className="text-xs font-bold text-neutral-700 uppercase tracking-wide mb-2 flex items-center justify-between">
                      <span>Select Variant</span>
                      <span className="text-[#dc2626]">{selectedVariant}</span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {parsedVariants.map(w => (
                        <button
                          key={w.label}
                          onClick={() => setSelectedWeight(w.label)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                            selectedVariant === w.label
                              ? 'bg-[#171717] text-red-200 border-[#171717] shadow-md scale-105'
                              : 'bg-white text-neutral-700 border-red-200 hover:border-[#dc2626]'
                          }`}
                        >
                          {w.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity modifier */}
                <div className="mb-8 flex items-center justify-between border-t border-b border-red-100 py-4">
                  <span className="text-sm font-bold text-neutral-700">Quantity</span>
                  <div className="flex items-center border border-red-200 rounded-xl overflow-hidden bg-red-50/50">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3.5 py-2 text-neutral-600 hover:bg-red-100 transition-colors"><Minus size={14}/></button>
                    <span className="w-10 text-center font-bold text-neutral-900 text-sm">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="px-3.5 py-2 text-neutral-600 hover:bg-red-100 transition-colors"><Plus size={14}/></button>
                  </div>
                </div>

                {/* Desktop Action Buttons */}
                <div className="hidden md:flex gap-3 mb-6">
                  <button 
                    onClick={() => {
                      for(let i = 0; i < quantity; i++) {
                        addToCart({ ...product, price: computedPrice, mrp: computedMrp, selectedVariant });
                      }
                      setCartOpen(true);
                    }}
                    className="flex-1 bg-white border-2 border-[#dc2626] text-[#dc2626] py-3.5 rounded-xl font-bold text-base hover:bg-red-50 transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <ShoppingBag size={18} />
                    Add to Cart
                  </button>
                  <button 
                    onClick={() => {
                      for(let i = 0; i < quantity; i++) {
                        addToCart({ ...product, price: computedPrice, mrp: computedMrp, selectedVariant });
                      }
                      setCartOpen(true);
                    }}
                    className="flex-1 bg-gradient-to-r from-[#171717] via-[#dc2626] to-[#b91c1c] text-red-50 py-3.5 rounded-xl font-bold text-base hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    Buy Now
                  </button>
                </div>

                {/* Quality Assurance Badges */}
                <div className="grid grid-cols-3 gap-3 border border-red-200/60 rounded-2xl p-3.5 bg-red-50/40">
                  <div className="flex flex-col items-center text-center gap-1.5">
                    <ShieldCheck size={18} className="text-emerald-700" />
                    <span className="text-[11px] font-bold text-neutral-700">100% Genuine Fit</span>
                  </div>
                  <div className="flex flex-col items-center text-center gap-1.5">
                    <Truck size={18} className="text-[#dc2626]" />
                    <span className="text-[11px] font-bold text-neutral-700">Express Delivery</span>
                  </div>
                  <div className="flex flex-col items-center text-center gap-1.5">
                    <Award size={18} className="text-red-800" />
                    <span className="text-[11px] font-bold text-neutral-700">OEM Quality</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>

          </div>

          {/* Details & Nutritional Accordions */}
          <ScrollReveal delay={200}>
            <div className="mt-12 bg-white/90 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-red-200/80 shadow-lg">
              <div className="flex gap-6 border-b border-red-200 mb-6 overflow-x-auto">
                {['description', 'specifications', 'fitment guide'].map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 text-sm font-bold capitalize whitespace-nowrap transition-all border-b-2 ${activeTab === tab ? 'border-[#dc2626] text-[#dc2626]' : 'border-transparent text-neutral-400 hover:text-neutral-700'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="text-neutral-700 text-sm leading-relaxed">
                {activeTab === 'description' && (
                  <div className="space-y-3">
                    <p className="font-semibold text-neutral-900">{product.description || 'High quality aftermarket or OEM replacement part.'}</p>
                    <p>Every part is sourced directly from trusted manufacturers to ensure perfect fit and long-lasting durability.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2">
                      <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs"><CheckCircle2 size={15} /> 100% Genuine Compatibility</div>
                      <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs"><CheckCircle2 size={15} /> High Durability Standards</div>
                      <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs"><CheckCircle2 size={15} /> Rigorously Tested</div>
                      <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs"><CheckCircle2 size={15} /> Ready to Install</div>
                    </div>
                  </div>
                )}
                {activeTab === 'specifications' && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-red-50 p-4 rounded-2xl border border-red-200">
                    <div><p className="text-xs text-neutral-500 font-bold">Brand</p><p className="font-black text-neutral-900">{product.brand || 'Katariya'}</p></div>
                    <div><p className="text-xs text-neutral-500 font-bold">Category</p><p className="font-black text-neutral-900">{product.category}</p></div>
                    <div><p className="text-xs text-neutral-500 font-bold">Condition</p><p className="font-black text-neutral-900">Brand New</p></div>
                    <div><p className="text-xs text-neutral-500 font-bold">Warranty</p><p className="font-black text-neutral-900">Standard</p></div>
                  </div>
                )}
                {activeTab === 'fitment guide' && (
                  <div className="space-y-2">
                    <p className="font-bold text-[#171717]">Katariya Auto Parts Quality Guarantee:</p>
                    <p>All parts undergo rigorous quality testing to ensure perfect fitment and reliability for your vehicle.</p>
                  </div>
                )}
              </div>
            </div>
          </ScrollReveal>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <ScrollReveal delay={300}>
              <div className="mt-12">
                <h3 className="text-2xl font-cinzel font-bold text-neutral-900 mb-6">You May Also Like</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {relatedProducts.map((p, idx) => (
                    <div key={idx} onClick={() => navigate(`/product/${p.id}`)} className="bg-white rounded-2xl p-3 border border-red-200 shadow-sm hover:shadow-xl transition-all cursor-pointer">
                      <div className="relative bg-red-50 rounded-xl overflow-hidden aspect-square mb-2">
                        <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <p className="text-xs font-bold text-[#dc2626]">{p.brand}</p>
                      <h4 className="font-bold text-neutral-800 text-xs line-clamp-1 mt-0.5">{p.name}</h4>
                      <p className="font-black text-neutral-900 text-sm mt-1">₹{p.price}</p>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          )}

        </div>
      </main>

      {/* Sticky Mobile Add To Cart Bar */}
      <div
        className="md:hidden fixed left-3 right-3 z-[70] bg-white/95 backdrop-blur-md border border-red-300 shadow-2xl flex flex-col gap-2 px-4 py-3 rounded-2xl"
        style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 76px)' }}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0 pr-2">
            <p className="text-xs font-bold text-neutral-800 truncate">{product.name}</p>
            <p className="font-black text-[#171717] text-base leading-tight">₹{computedPrice} {selectedVariant && <span className="text-xs text-red-800 font-bold bg-red-100 px-1.5 py-0.5 rounded ml-1">{selectedVariant}</span>}</p>
          </div>
          <div className="flex items-center border border-red-200 rounded-lg overflow-hidden flex-shrink-0 h-9 bg-red-50">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-2.5 text-neutral-600 font-bold"><Minus size={13}/></button>
            <span className="w-6 text-center font-bold text-neutral-900 text-xs">{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)} className="px-2.5 text-neutral-600 font-bold"><Plus size={13}/></button>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => { 
              for(let i=0; i<quantity; i++) addToCart({ ...product, price: computedPrice, mrp: computedMrp, selectedVariant });
              setCartOpen(true);
            }}
            className="flex-1 bg-gradient-to-r from-[#171717] to-[#dc2626] text-red-50 py-2.5 rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-1"
          >
            <ShoppingBag size={14} /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
