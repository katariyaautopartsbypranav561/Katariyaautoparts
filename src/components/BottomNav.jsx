import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Grid3X3, Tag, Sparkles, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_ITEMS = [
  { label: 'Home',      icon: Home,      path: '/' },
  { label: 'Catalogue', icon: Grid3X3,   path: '/category' },
  { label: 'Offers',    icon: Tag,        path: '/offers' },
  { label: 'Garage',  icon: Sparkles,   path: '/hub' },
  { label: 'Account',   icon: User,       path: '/account' },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [pressed, setPressed] = useState(null);

  return (
    <div className="md:hidden fixed z-[80] bottom-3 left-0 right-0 px-4 flex justify-center pointer-events-none">
      <div className="relative w-full max-w-[420px] min-w-0 pointer-events-auto">

        {/* Warm ambient glow behind pill */}
        <div className="absolute inset-x-4 bottom-0 h-10 rounded-full bg-red-400/30 blur-2xl pointer-events-none" />

        {/* Glass pill */}
        <nav
          className="relative w-full min-w-0 rounded-3xl flex items-center justify-between px-3 py-2"
          style={{
            background: 'linear-gradient(135deg, rgba(255,251,235,0.95) 0%, rgba(254,243,199,0.92) 100%)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1.5px solid rgba(217,119,6,0.35)',
            boxShadow:
              '0 8px 32px rgba(92,49,16,0.18), 0 2px 8px rgba(245,158,11,0.2), inset 0 1px 0 rgba(255,255,255,0.9)',
          }}
        >
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path ||
              (item.path !== '/' && location.pathname.startsWith(item.path));

            return (
              <button
                key={item.label}
                onClick={() => {
                  setPressed(item.path);
                  setTimeout(() => setPressed(null), 350);
                  navigate(item.path);
                }}
                aria-label={item.label}
                className="relative flex-1 flex flex-col items-center justify-center py-1.5 gap-0.5 rounded-2xl transition-all duration-200 min-w-0"
                style={{
                  background: isActive
                    ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                    : 'transparent',
                  boxShadow: isActive
                    ? '0 4px 12px rgba(217,119,6,0.4), inset 0 1px 0 rgba(255,255,255,0.3)'
                    : 'none',
                  transform: pressed === item.path ? 'scale(0.88)' : 'scale(1)',
                  transition: 'transform 0.15s ease, background 0.2s ease, box-shadow 0.2s ease',
                }}
              >
                {/* Icon */}
                <Icon
                  size={20}
                  strokeWidth={isActive ? 2.5 : 1.8}
                  style={{
                    color: isActive ? '#fff' : '#92400e',
                    filter: isActive ? 'drop-shadow(0 1px 3px rgba(0,0,0,0.2))' : 'none',
                    transition: 'color 0.2s ease',
                  }}
                />

                {/* Label */}
                <span
                  className="text-[9px] font-bold leading-none tracking-wide max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-center"
                  style={{
                    color: isActive ? '#fff' : '#78350f',
                    transition: 'color 0.2s ease',
                  }}
                >
                  {item.label === 'Catalogue' ? 'Browse' : item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
