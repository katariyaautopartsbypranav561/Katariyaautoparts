import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Package, Image, Percent,
  Menu, X, Settings, Users, ShoppingBag, CreditCard, Music2, Activity,
  Camera, Bell, Mail, BarChart2
} from 'lucide-react';

const NAV_ITEMS = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/live', label: 'Live Website', icon: Activity },
  { path: '/admin/products', label: 'Products Catalogue', icon: Package },
  { path: '/admin/categories', label: 'Category Banners', icon: Image },
  { path: '/admin/slides', label: 'Hero Slides', icon: Image },
  { path: '/admin/banners', label: 'Hero Banners', icon: Image },
  { path: '/admin/deals', label: 'Flash Deals', icon: Percent },
  { path: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { path: '/admin/customers', label: 'Customers', icon: Users },
  { path: '/admin/retention', label: 'Web Analytics', icon: BarChart2 },
  { path: '/admin/payment', label: 'Payment Config', icon: CreditCard },
  { path: '/admin/settings', label: 'Store Settings', icon: Settings },
  { path: '/admin/instagram', label: 'Instagram Reels', icon: Camera },
  { path: '/admin/notifications', label: 'Push Notifications', icon: Bell },
  { path: '/admin/campaigns', label: 'Email Campaigns', icon: Mail },
  { path: '/admin/music', label: 'Studio Music', icon: Music2 },
];

export default function AdminLayout() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className="min-h-screen bg-red-50/40 flex font-sans">
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-neutral-900/50 z-40 md:hidden backdrop-blur-sm"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-neutral-900 text-red-50 border-r border-red-900/40 shadow-xl transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 z-50 flex flex-col`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-red-900/30 shrink-0">
          <Link to="/admin" className="font-cinzel font-bold text-lg text-red-400 flex items-center gap-2">
            <img src="/logo.png" alt="Logo" className="w-8 h-8 rounded-full bg-white p-0.5 object-contain" />
            Katariya Auto Parts
          </Link>
          <button className="md:hidden p-2 text-red-200" onClick={toggleSidebar}>
            <X size={20} />
          </button>
        </div>
        <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                  isActive 
                    ? 'bg-gradient-to-r from-[#171717] to-[#dc2626] text-red-100 shadow-md' 
                    : 'text-red-200/70 hover:bg-neutral-800 hover:text-red-200'
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
                {item.label === 'Orders' && (
                  <span className="ml-auto text-[10px] bg-red-400 text-neutral-950 font-black px-1.5 py-0.5 rounded-full">NEW</span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-red-900/30">
          <Link to="/" className="flex items-center justify-center gap-2 text-xs font-bold text-red-300 hover:text-white bg-red-900/40 hover:bg-red-900/60 py-2.5 rounded-xl transition-all border border-red-400/20">
            ← Back to Storefront
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <header className="h-16 bg-white/90 backdrop-blur-md border-b border-red-200/80 flex items-center px-4 md:px-8 gap-4 sticky top-0 z-30 shadow-sm">
          <button className="md:hidden p-2 -ml-2 text-neutral-700" onClick={toggleSidebar}>
            <Menu size={24} />
          </button>
          <h1 className="font-cinzel font-bold text-base md:text-lg text-neutral-900">
            {NAV_ITEMS.find(item => item.path === location.pathname)?.label || 'Katariya Auto Parts Admin Portal'}
          </h1>
          <div className="ml-auto flex items-center gap-3">
            <span className="text-xs text-neutral-500 font-semibold hidden sm:block">Katariya Auto Parts HQ Admin</span>
            <Link to="/" className="text-xs font-bold text-red-50 bg-gradient-to-r from-[#171717] to-[#dc2626] hover:shadow-md px-4 py-2 rounded-xl transition-all">
              Live Storefront →
            </Link>
          </div>
        </header>
        
        <div className="flex-1 p-4 md:p-8 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
