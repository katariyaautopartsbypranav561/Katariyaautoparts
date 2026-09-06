import React, { useState } from 'react';
import { BookOpen, Play, Clock, Search, Bookmark, ThumbsUp, MessageCircle, TrendingUp, ArrowRight, ShieldCheck, Sparkles, Award } from 'lucide-react';
import Header from '../components/Header';
import ScrollReveal from '../components/ScrollReveal';

const ARTICLES = [
  { id: 1, title: 'How to Maintain Your Motorcycle Chain for Longer Life', category: 'Maintenance Guide', time: '4 min', img: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&h=320&fit=crop', author: 'Rahul Katariya (Chief Mechanic)', authorImg: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=50&h=50&fit=crop&crop=face', tag: 'Maintenance Guide', likes: 542, comments: 38, featured: true },
  { id: 2, title: 'Top 7 Benefits of Using Synthetic Engine Oil in Superbikes', category: 'Dry Fruits', time: '5 min', img: 'https://images.unsplash.com/photo-1509358271058-acd01cc9386a?w=500&h=320&fit=crop', author: 'Vikram Singh (Rider)', authorImg: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=50&h=50&fit=crop&crop=face', tag: 'Garage', likes: 387, comments: 24, featured: false },
  { id: 3, title: 'Why Traditional Bilona A2 Gir Cow Ghee Boosts Immunity', category: 'Pure Ghee', time: '6 min', img: 'https://images.unsplash.com/photo-1608797178974-15b35a64ede9?w=500&h=320&fit=crop', author: 'Chef Vikram Roy', authorImg: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=50&h=50&fit=crop&crop=face', tag: 'A2 Ghee', likes: 412, comments: 45, featured: false },
  { id: 4, title: 'Waynad Green Cardamom & Black Pepper Culinary Pairings', category: 'Exotic Spices', time: '4 min', img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&h=320&fit=crop', author: 'Meera Kapoor', authorImg: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=50&h=50&fit=crop&crop=face', tag: 'Culinary', likes: 216, comments: 19, featured: false },
];

const VIDEOS = [
  { id: 1, title: 'Motorcycle Engine Restoration Timelapse', duration: '08:45', img: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=350&h=200&fit=crop', views: '45K' },
  { id: 2, title: 'How to Choose the Right Engine Oil for Your Bike', duration: '06:30', img: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=350&h=200&fit=crop', views: '32K' },
];

const TOPICS = ['All', 'Maintenance Guide', 'Engine Oils', 'Accessories', 'Brakes', 'Tyres', 'Safety'];

export default function HubPage() {
  const [activeTopic, setActiveTopic] = useState('All');
  const [saved, setSaved] = useState([]);
  const toggleSave = id => setSaved(p => p.includes(id) ? p.filter(s => s !== id) : [...p, id]);

  const featured = ARTICLES[0];
  const rest = ARTICLES.slice(1);

  return (
    <div className="min-h-screen mesh-bg">
      <Header />
      <main className="pb-24 md:pb-12">

        {/* Hero */}
        <ScrollReveal>
          <div className="bg-gradient-to-r from-[#171717] via-[#dc2626] to-[#7f1d1d] text-red-50 relative overflow-hidden border-b border-red-400/40 shadow-xl">
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-14 relative">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={18} className="text-red-300" />
                    <span className="text-red-300 text-xs font-bold uppercase tracking-widest">Garage & Culinary Hub</span>
                  </div>
                  <h1 className="font-cinzel font-bold text-3xl md:text-5xl leading-tight">Katariya Auto Parts Hub 📚</h1>
                  <p className="text-red-200 text-sm md:text-base mt-2">Expert guides on motorcycle maintenance, parts fitment & repair tutorials.</p>
                </div>
                <div className="flex items-center bg-black/20 backdrop-blur-md border border-red-300/40 rounded-2xl px-4 py-3 gap-3 max-w-md w-full">
                  <Search size={16} className="text-red-200/60 flex-shrink-0" />
                  <input placeholder="Search maintenance tips, brake installation..." className="flex-1 bg-transparent text-white text-sm placeholder-blue-200/40 outline-none" />
                  <button className="bg-red-500 text-neutral-950 font-bold text-xs px-3.5 py-1.5 rounded-xl">Search</button>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <div className="max-w-7xl mx-auto px-4 md:px-6 mt-8">
          
          {/* Topic Filters */}
          <ScrollReveal animation="fade-down" delay={100}>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-8">
              {TOPICS.map((t) => (
                <button key={t} onClick={() => setActiveTopic(t)}
                  className={`flex-shrink-0 text-xs font-bold px-4 py-2 rounded-full border transition-all ${activeTopic === t ? 'bg-[#171717] text-red-200 border-[#171717]' : 'bg-white text-neutral-700 border-red-200 hover:border-[#dc2626]'}`}>
                  {t}
                </button>
              ))}
            </div>
          </ScrollReveal>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 min-w-0">

              {/* Featured Article */}
              <ScrollReveal animation="scale-up" delay={150}>
                <div className="bg-white rounded-3xl border border-red-200 overflow-hidden shadow-md mb-8">
                  <div className="relative" style={{ height: 220 }}>
                    <img src={featured.img} alt={featured.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="bg-[#dc2626] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow">✨ Featured Guide</span>
                      <span className="bg-white/90 text-neutral-800 text-[10px] font-bold px-2.5 py-1 rounded-full">{featured.tag}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h2 className="font-cinzel font-bold text-xl md:text-2xl text-neutral-900 leading-tight">{featured.title}</h2>
                    <p className="text-neutral-600 text-sm mt-2">Learn 3 simple steps to clean, lube, and adjust your motorcycle chain for maximum performance and longevity.</p>
                    <div className="flex items-center gap-3 mt-4 pt-4 border-t border-red-100">
                      <img src={featured.authorImg} alt={featured.author} className="w-8 h-8 rounded-full object-cover border border-red-300" />
                      <div>
                        <p className="text-neutral-900 text-xs font-bold">{featured.author}</p>
                        <p className="text-neutral-400 text-[10px]">{featured.time} read</p>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              {/* Latest Articles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rest.map((a, idx) => (
                  <ScrollReveal key={a.id} delay={200 + idx * 80} animation="fade-up">
                    <div className="bg-white rounded-2xl border border-red-200 overflow-hidden shadow-sm p-4 flex gap-3 items-center">
                      <img src={a.img} alt={a.title} className="w-24 h-24 rounded-xl object-cover flex-shrink-0" />
                      <div>
                        <span className="text-[10px] font-bold text-[#dc2626] bg-red-50 px-2 py-0.5 rounded">{a.tag}</span>
                        <h3 className="font-bold text-neutral-900 text-xs leading-snug mt-1">{a.title}</h3>
                        <p className="text-neutral-400 text-[10px] mt-1">{a.author}</p>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>

            </div>

            {/* Sidebar */}
            <aside className="lg:w-80 flex-shrink-0 space-y-6">
              <ScrollReveal animation="fade-left" delay={250}>
                <div className="bg-white rounded-3xl border border-red-200 p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <ShieldCheck size={18} className="text-emerald-700" />
                    <h3 className="font-cinzel font-bold text-sm text-neutral-900">OEM Certification</h3>
                  </div>
                  <p className="text-neutral-600 text-xs leading-relaxed">
                    Every product at Katariya Auto Parts comes with an official certificate of OEM authenticity.
                  </p>
                </div>
              </ScrollReveal>
            </aside>
          </div>

        </div>
      </main>
    </div>
  );
}
