import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Package, Heart, MapPin, CreditCard, Bell, Gift, HelpCircle,
  Shield, ChevronRight, Star, ShoppingBag, LogOut, Plus, Trash2, CheckCircle, Clock, Settings,
  Sparkles, Award, ShieldCheck
} from 'lucide-react';
import Header from '../components/Header';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ScrollReveal from '../components/ScrollReveal';
import axios from 'axios';
import { useEffect } from 'react';

const MENU_ITEMS = [
  { icon: Package, label: 'My Orders', sub: 'Active & past orders', color: '#dc2626' },
  { icon: Heart, label: 'My Wishlist', sub: 'Saved Auto Parts', color: '#EC4899' },
  { icon: MapPin, label: 'Saved Addresses', sub: 'Delivery locations', color: '#10B981' },
  { icon: CreditCard, label: 'Payment Methods', sub: 'UPI, Cards & Wallets', color: '#6366F1' },
  { icon: Gift, label: 'Rider Rewards', sub: 'Reward points & coupons', color: '#b91c1c' },
  { icon: HelpCircle, label: 'Technical Support', sub: 'Chat with Mechanic', color: '#0EA5E9' },
  { icon: ShieldCheck, label: 'Quality Guarantee', sub: 'Quality Guarantee', color: '#14B8A6' },
];

export default function AccountPage() {
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('Profile');
  const { wishlistItems, removeFromWishlist, addToCart, isInCart, showToast } = useCart();
  
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    if (user && (activeTab === 'Profile' || activeTab === 'My Orders')) {
      const fetchOrders = async () => {
        setLoadingOrders(true);
        try {
          const res = await axios.get('/api/orders');
          const myOrders = res.data.filter(o => o.customerEmail === user.email || o.visitorId === user.uid);
          setOrders(myOrders);
        } catch (e) {
          console.error('Failed to fetch orders:', e);
        }
        setLoadingOrders(false);
      };
      fetchOrders();
    }
  }, [user, activeTab]);

  /* GUEST VIEW */
  if (!user) {
    return (
      <div className="min-h-screen mesh-bg">
        <Header />
        <main className="pb-24 md:pb-12">
          
          <ScrollReveal>
            <div className="bg-gradient-to-r from-[#171717] via-[#dc2626] to-[#b91c1c] text-red-50 shadow-xl border-b border-red-400/40">
              <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <span className="text-red-200 text-xs font-bold uppercase tracking-widest bg-red-900/40 px-3 py-1 rounded-full border border-red-300/30">
                    Katariya Riders Club
                  </span>
                  <h1 className="font-cinzel font-bold text-3xl md:text-5xl mt-3">Welcome to Katariya Auto Parts</h1>
                  <p className="text-red-100 text-sm md:text-base mt-2 max-w-lg">Sign in to track spare part orders, earn reward coins, and manage saved delivery addresses.</p>
                  
                  <div className="flex flex-wrap gap-3 mt-6 justify-center md:justify-start">
                    <button onClick={() => navigate('/login')} className="bg-red-400 text-neutral-950 font-bold px-8 py-3 rounded-xl shadow-md hover:bg-red-300 transition-all text-sm">
                      Sign In Now
                    </button>
                    <button onClick={() => navigate('/login')} className="bg-neutral-900/50 text-red-100 font-bold px-8 py-3 rounded-xl border border-red-300/40 hover:bg-neutral-900 transition-all text-sm">
                      Create Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Member Perks */}
          <ScrollReveal delay={100}>
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
              <h2 className="font-cinzel font-bold text-xl md:text-2xl text-neutral-900 text-center mb-8">Rider Privileges</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: Package, label: 'Live Farm Tracking', sub: 'Real-time dispatch updates', color: '#dc2626' },
                  { icon: Heart, label: 'Wishlist Lock', sub: 'Save favorite harvests', color: '#EC4899' },
                  { icon: Gift, label: 'Rider Coins', sub: 'Earn cashback on auto parts', color: '#b91c1c' },
                  { icon: ShieldCheck, label: 'Quality Check', sub: 'Lab reports on every batch', color: '#10B981' },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="bg-white/90 backdrop-blur-md rounded-2xl border border-red-200 p-5 text-center shadow-sm">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 bg-red-50">
                        <Icon size={22} style={{ color: item.color }} />
                      </div>
                      <p className="font-bold text-neutral-900 text-sm">{item.label}</p>
                      <p className="text-neutral-500 text-xs mt-1">{item.sub}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </ScrollReveal>

        </main>
      </div>
    );
  }

  /* LOGGED IN VIEW */
  return (
    <div className="min-h-screen mesh-bg">
      <Header />
      <main className="pb-24 md:pb-12">

        {/* Profile Header */}
        <ScrollReveal>
          <div className="bg-gradient-to-r from-[#171717] via-[#dc2626] to-[#b91c1c] text-red-50 border-b border-red-400/40 shadow-xl">
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-red-200/20 border-2 border-red-300 flex items-center justify-center text-3xl font-black text-red-300 shadow">
                    {user?.name?.[0]?.toUpperCase() || 'F'}
                  </div>
                  <div>
                    <h1 className="font-cinzel font-bold text-xl md:text-3xl">Namaste, {user?.name || 'Valued Member'} ✨</h1>
                    <p className="text-red-200 text-xs md:text-sm">{user?.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-bold bg-red-400 text-neutral-950 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      Gold Rider
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isAdmin && (
                    <button onClick={() => navigate('/admin')} className="bg-red-400 text-neutral-950 text-xs font-bold px-4 py-2.5 rounded-xl shadow hover:bg-red-300 transition-all">
                      ⚙️ Admin Portal
                    </button>
                  )}
                  <button onClick={() => logout()} className="bg-neutral-950/40 border border-red-300/40 text-red-100 text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-neutral-950 transition-all flex items-center gap-1.5">
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Content Tabs */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 mt-8">
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Sidebar */}
            <aside className="lg:w-64 flex-shrink-0">
              <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-red-200 p-4 shadow-sm space-y-1">
                {MENU_ITEMS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.label}
                      onClick={() => setActiveTab(item.label)}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        activeTab === item.label
                          ? 'bg-[#171717] text-red-200 shadow-md'
                          : 'text-neutral-700 hover:bg-red-50'
                      }`}
                    >
                      <Icon size={16} style={{ color: activeTab === item.label ? '#dbeafe' : item.color }} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </aside>

            {/* Tab Body */}
            <div className="flex-1 min-w-0 bg-white/90 backdrop-blur-md rounded-3xl border border-red-200 p-6 md:p-8 shadow-sm">
              {activeTab === 'Profile' || activeTab === 'My Orders' ? (
                <div>
                  <h2 className="font-cinzel font-bold text-xl text-neutral-900 mb-4">My Orders</h2>
                  {loadingOrders ? (
                    <div className="text-center p-6 text-neutral-500 text-sm">Loading orders...</div>
                  ) : orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.map(order => (
                        <div key={order.id} className="bg-red-50/30 p-4 rounded-xl border border-red-200 flex flex-col md:flex-row justify-between md:items-center gap-4">
                          <div>
                            <p className="font-bold text-neutral-800 text-sm">Order #{order.id}</p>
                            <p className="text-neutral-500 text-xs mt-1">{new Date(order.createdAt).toLocaleDateString()} • {order.status}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-neutral-800 text-sm">₹{order.total}</p>
                            <p className="text-red-600 font-semibold text-xs mt-1">{order.paymentMethod}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-red-50/50 p-6 rounded-2xl border border-red-200 text-center">
                      <Package size={40} className="mx-auto text-[#dc2626] mb-2" />
                      <p className="font-bold text-neutral-800 text-sm">No Active Orders</p>
                      <p className="text-neutral-500 text-xs mt-1">Explore our auto parts catalogue to place your first order.</p>
                      <button onClick={() => navigate('/category')} className="mt-4 bg-[#171717] text-red-200 font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-red-600 hover:text-white transition-all">
                        Browse Store Catalogue
                      </button>
                    </div>
                  )}
                </div>
              ) : activeTab === 'My Wishlist' ? (
                <div>
                  <h2 className="font-cinzel font-bold text-xl text-neutral-900 mb-4">Saved Wishlist ({wishlistItems.length})</h2>
                  {wishlistItems.length === 0 ? (
                    <p className="text-neutral-500 text-xs">Your wishlist is currently empty.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {wishlistItems.map((item) => (
                        <div key={item.id} className="border border-red-200 rounded-2xl p-3 flex gap-3 items-center">
                          <img src={item.img} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
                          <div className="flex-1">
                            <p className="font-bold text-neutral-900 text-xs">{item.name}</p>
                            <p className="font-black text-[#171717] text-sm">₹{item.price}</p>
                          </div>
                          <button onClick={() => addToCart(item)} className="bg-[#dc2626] text-white text-xs font-bold px-3 py-1.5 rounded-xl">Add</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <h2 className="font-cinzel font-bold text-xl text-neutral-900 mb-2">{activeTab}</h2>
                  <p className="text-neutral-500 text-xs">Section under active sync with Katariya Auto Parts server database.</p>
                </div>
              )}
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}
