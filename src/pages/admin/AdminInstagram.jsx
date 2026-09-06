import React, { useState } from 'react';
import axios from 'axios';
import { useData } from '../../context/DataContext';
import { useCart } from '../../context/CartContext';
import { Video, Plus, Trash2, Loader2, Info } from 'lucide-react';
import InstagramEmbed from '../../components/InstagramEmbed';

export default function AdminInstagram() {
  const { instagramFeeds, refreshData } = useData();
  const { showToast } = useCart();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!url.includes('instagram.com')) {
      return showToast('Please enter a valid Instagram URL');
    }
    
    // Extract link if they pasted the full HTML blockquote embed
    let cleanUrl = url;
    const match = url.match(/data-instgrm-permalink="(.*?)"/);
    if (match) cleanUrl = match[1];

    setLoading(true);
    try {
      await axios.post('/api/instagram', { url: cleanUrl });
      showToast('Instagram feed added successfully!');
      setUrl('');
      await refreshData();
    } catch (error) {
      showToast('Failed to add feed');
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this feed?')) return;
    try {
      await axios.delete(`/api/instagram/${id}`);
      showToast('Feed deleted');
      await refreshData();
    } catch (error) {
      showToast('Failed to delete feed');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Video className="text-[#ef4444]" size={28} /> Instagram Feeds
        </h2>
        <p className="text-gray-500 text-sm mt-1">Manage Instagram reels and posts displayed on your website.</p>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-[#ef4444]/20 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-[#ef4444]" />
        
        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Instagram Post URL</label>
            <input 
              type="text" 
              value={url} 
              onChange={(e) => setUrl(e.target.value)} 
              placeholder="e.g. https://www.instagram.com/p/Dch4BriSnAv/" 
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#ef4444]"
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="bg-[#2C2C2C] text-[#F0DFA0] px-6 py-3 rounded-xl font-bold hover:bg-[#ef4444] hover:text-[#2C2C2C] transition-colors whitespace-nowrap flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
            Add Reel
          </button>
        </form>

        <div className="mt-4 flex items-start gap-2 text-neutral-500 text-xs bg-neutral-50 p-3 rounded-xl border border-neutral-100">
          <Info size={16} className="text-[#ef4444] flex-shrink-0 mt-0.5" />
          <p>
            Paste the full URL of the Instagram Reel or Post. The website will automatically format it for embedded playback. 
            Note that some browsers or devices may prevent automatic playback with sound.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(instagramFeeds || []).map((feed) => (
          <div key={feed.id} className="bg-white rounded-3xl border border-[#ef4444]/20 shadow-lg overflow-hidden flex flex-col group relative">
            <button 
              onClick={() => handleDelete(feed.id)}
              className="absolute top-3 right-3 z-20 bg-red-500/90 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 hover:scale-110"
              title="Delete Feed"
            >
              <Trash2 size={16} />
            </button>
            <div className="relative bg-neutral-100 p-2 min-h-[400px] flex flex-col items-center justify-center overflow-y-auto">
              <InstagramEmbed url={feed.url} />
            </div>
            <div className="p-4 border-t border-neutral-100 bg-neutral-50 text-center">
              <a href={feed.url} target="_blank" rel="noreferrer" className="text-xs text-red-500 hover:underline break-all">
                {feed.url}
              </a>
            </div>
          </div>
        ))}
        {(!instagramFeeds || instagramFeeds.length === 0) && (
          <div className="col-span-full py-12 text-center text-neutral-500 border-2 border-dashed border-neutral-200 rounded-3xl bg-neutral-50">
            <Video className="mx-auto text-neutral-300 mb-3" size={48} />
            <p className="font-bold text-neutral-700">No Instagram Feeds Yet</p>
            <p className="text-sm mt-1">Add a post URL above to display it on the website.</p>
          </div>
        )}
      </div>
    </div>
  );
}
