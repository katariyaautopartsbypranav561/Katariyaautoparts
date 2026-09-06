import React, { useState } from 'react';
import { Bell, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { useCart } from '../../context/CartContext';

export default function AdminNotifications() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [image, setImage] = useState('');
  const [url, setUrl] = useState('/');
  const [isSending, setIsSending] = useState(false);
  const [result, setResult] = useState(null);
  
  const { showToast } = useCart();

  const handleBroadcast = async (e) => {
    e.preventDefault();
    if (!title || !body) {
      showToast("Title and Body are required");
      return;
    }
    
    setIsSending(true);
    setResult(null);
    try {
      const res = await axios.post('/api/analytics/broadcast', { title, body, image, url });
      showToast("Broadcast sent successfully!");
      setResult(res.data);
      setTitle('');
      setBody('');
      setImage('');
      setUrl('/');
    } catch (err) {
      showToast(err.response?.data?.error || "Failed to broadcast");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4 border-b border-[#ef4444]/30 pb-4">
        <div className="p-3 bg-[#ef4444]/10 rounded-full">
          <Bell className="w-8 h-8 text-[#ef4444]" />
        </div>
        <div>
          <h1 className="text-3xl font-cinzel font-bold text-[#F0DFA0]">Push Notifications</h1>
          <p className="text-neutral-400 font-medium">Broadcast messages to all opted-in customers.</p>
        </div>
      </div>

      <div className="bg-[#2C2C2C] border border-[#ef4444]/20 rounded-xl p-6 shadow-xl relative overflow-hidden">
        <form onSubmit={handleBroadcast} className="space-y-5 relative z-10">
          <div>
            <label className="block text-[#ef4444] font-semibold mb-2">Notification Title</label>
            <input 
              required
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Flash Sale: 20% Off Portraits!"
              className="w-full bg-[#171717] border border-neutral-700 rounded-lg px-4 py-3 text-neutral-100 focus:outline-none focus:border-[#ef4444] transition-colors"
            />
          </div>

          <div>
            <label className="block text-[#ef4444] font-semibold mb-2">Message Body</label>
            <textarea 
              required
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Tell your customers what's new..."
              className="w-full bg-[#171717] border border-neutral-700 rounded-lg px-4 py-3 text-neutral-100 h-28 focus:outline-none focus:border-[#ef4444] transition-colors resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[#ef4444] font-semibold mb-2">Redirect URL (Optional)</label>
              <input 
                type="text" 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="/category/portraits"
                className="w-full bg-[#171717] border border-neutral-700 rounded-lg px-4 py-3 text-neutral-100 focus:outline-none focus:border-[#ef4444] transition-colors"
              />
              <p className="text-xs text-neutral-500 mt-1">Where they go when they click the notification.</p>
            </div>
            <div>
              <label className="block text-[#ef4444] font-semibold mb-2">Image URL (Optional)</label>
              <input 
                type="text" 
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://your-image.jpg"
                className="w-full bg-[#171717] border border-neutral-700 rounded-lg px-4 py-3 text-neutral-100 focus:outline-none focus:border-[#ef4444] transition-colors"
              />
              <p className="text-xs text-neutral-500 mt-1">A large image to show in the notification.</p>
            </div>
          </div>

          <button 
            type="submit"
            disabled={isSending}
            className="w-full bg-gradient-to-r from-[#ef4444] to-[#F0DFA0] text-neutral-900 font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(201,168,76,0.3)] hover:shadow-[0_0_30px_rgba(201,168,76,0.5)] transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
          >
            {isSending ? (
              <span className="flex items-center gap-2">Sending Broadcast...</span>
            ) : (
              <span className="flex items-center gap-2"><Send className="w-5 h-5" /> Broadcast to All</span>
            )}
          </button>
        </form>
      </div>

      {result && (
        <div className="bg-[#171717] border border-[#2C2C2C] rounded-xl p-6">
          <h3 className="text-[#F0DFA0] font-cinzel font-bold text-xl mb-4 flex items-center gap-2">
            <CheckCircle2 className="text-green-400" /> Broadcast Summary
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#2C2C2C] p-4 rounded-lg text-center border border-[#ef4444]/10">
              <p className="text-neutral-400 text-sm font-medium mb-1">Delivered</p>
              <p className="text-3xl font-bold text-green-400">{result.count}</p>
            </div>
            <div className="bg-[#2C2C2C] p-4 rounded-lg text-center border border-red-500/10">
              <p className="text-neutral-400 text-sm font-medium mb-1">Failed</p>
              <p className="text-3xl font-bold text-red-400">{result.failedCount}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
