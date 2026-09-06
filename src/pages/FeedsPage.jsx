import React from 'react';
import Header from '../components/Header';
import LiveBackground from '../components/LiveBackground';
import { Video, Heart, MessageCircle, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';
import InstagramEmbed from '../components/InstagramEmbed';

export default function FeedsPage() {
  const { instagramFeeds } = useData();

  // If there are no feeds, we show a fallback (the one provided initially)
  const fallbackFeed = { url: 'https://www.instagram.com/p/Dch4BriSnAv/' };
  const feedsToDisplay = (instagramFeeds && instagramFeeds.length > 0) ? instagramFeeds : [fallbackFeed];

  return (
    <div className="min-h-screen bg-[#f1f5f9] font-sans pb-24 md:pb-0">
      <Header />
      <div className="relative pt-24 pb-12 px-4 md:px-8 max-w-[1600px] mx-auto min-h-screen">
        <LiveBackground theme="cream-waves" className="fixed inset-0 opacity-40 pointer-events-none" />
        
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center justify-center p-3 bg-gradient-to-tr from-red-400 via-pink-500 to-purple-500 rounded-2xl mb-4 shadow-lg"
            >
              <Video size={32} className="text-white" />
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-cinzel font-bold text-[#2C2C2C] mb-3"
            >
              Our Viral Feeds
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-neutral-500 max-w-lg mx-auto"
            >
              Join our growing Instagram family! Check out our latest viral creations and behind-the-scenes magic.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center items-start">
            {feedsToDisplay.map((feed, idx) => (
              <motion.div 
                key={feed.id || idx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + (idx * 0.1) }}
                className="flex flex-col gap-4 w-full bg-white/60 backdrop-blur-md p-4 rounded-[2rem] shadow-xl border border-neutral-100"
              >
                {/* Instagram Embed */}
                <div className="w-full bg-white p-2 rounded-[1.5rem] shadow-inner border border-neutral-50 flex-shrink-0 mx-auto overflow-hidden">
                  <div className="rounded-[1rem] overflow-hidden bg-neutral-50 relative min-h-[500px] flex flex-col items-center justify-center pt-4">
                    <InstagramEmbed url={feed.url} />
                  </div>
                </div>

                <a 
                  href={feed.url}
                  target="_blank" 
                  rel="noreferrer"
                  className="mt-2 flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-gradient-to-tr from-red-400 via-pink-500 to-purple-500 text-white font-bold text-sm hover:shadow-lg hover:shadow-pink-500/30 transition-all hover:-translate-y-1"
                >
                  <Video size={16} /> Watch on Instagram
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
