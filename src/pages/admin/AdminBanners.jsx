import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import { handleImageUpload } from '../../utils/imageUpload';
import { useData } from '../../context/DataContext';
import { useCart } from '../../context/CartContext';
import { Plus, Edit2, Trash2, X, Search, Image as ImageIcon, Loader2 } from 'lucide-react';

export default function AdminBanners() {
  const { banners, refreshData } = useData();
  const { showToast } = useCart();
  const [editing, setEditing] = useState(null);
  const editingRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const defaultBanner = {
    mediaUrl: '', link: '/category', title: '', subtitle: '', badge: ''
  };

  // Keep ref in sync so handleSave always gets the latest editing value
  const updateEditing = (val) => {
    editingRef.current = val;
    setEditing(val);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (isUploading) {
      showToast('Please wait for image upload to finish', 'error');
      return;
    }
    // Use ref to get the absolute latest state
    const latest = editingRef.current || editing;
    try {
      if (latest.id) {
        await axios.put(`/api/banners/${latest.id}`, latest);
        showToast('Banner updated successfully!');
      } else {
        await axios.post('/api/banners', latest);
        showToast('New banner added!');
      }

      setIsModalOpen(false);
      setEditing(null);
      await refreshData();
    } catch (error) {
      console.error(error);
      showToast('Failed to save banner', 'error');
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm('Delete this banner?')) return;
    try {
      await axios.delete(`/api/banners/${id}`);
      showToast('Banner deleted.');
      await refreshData();
    } catch (error) {
      console.error(error);
      showToast('Failed to delete banner', 'error');
    }
  };

  const filteredBanners = banners?.filter(b => 
    b.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.subtitle?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/30">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Site Hero Banners</h2>
          <p className="text-sm text-gray-500">Manage large homepage grid banners (4 cards)</p>
        </div>
        <div className="flex w-full sm:w-auto gap-3">
          <div className="relative flex-1 sm:w-64">
            <input type="text" placeholder="Search banners..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm" />
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <button onClick={() => { updateEditing(defaultBanner); setIsModalOpen(true); }}
            className="flex items-center justify-center gap-2 bg-red-600 text-white hover:bg-red-700 px-4 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-lg shadow-red-500/30 shrink-0">
            <Plus size={18} /> <span className="hidden sm:inline">Add Banner</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-50/50 text-gray-500 font-medium">
            <tr>
              <th className="px-6 py-4">Banner Info</th>
              <th className="px-6 py-4">Link</th>
              <th className="px-6 py-4">Badge</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredBanners.map((b) => (
              <tr key={b.id} className="hover:bg-red-50/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-16 rounded-xl border border-gray-100 overflow-hidden bg-gray-50 shrink-0">
                      {b.mediaUrl ? (
                        <img src={b.mediaUrl} alt={b.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><ImageIcon className="text-gray-300" /></div>
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{b.title || 'No Title'}</div>
                      <div className="text-xs text-gray-500 mt-1 max-w-[200px] truncate">{b.subtitle}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600 font-medium">{b.link}</td>
                <td className="px-6 py-4">
                  {b.badge && <span className="bg-red-100 text-red-800 px-2.5 py-1 rounded-md text-xs font-bold border border-red-200">{b.badge}</span>}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => { updateEditing(b); setIsModalOpen(true); }} className="w-8 h-8 rounded-lg flex items-center justify-center bg-red-50 text-red-600 hover:bg-red-100 transition-colors">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(b.id)} className="w-8 h-8 rounded-lg flex items-center justify-center bg-red-50 text-red-600 hover:bg-red-100 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredBanners.length === 0 && (
              <tr><td colSpan="4" className="px-6 py-12 text-center text-gray-500">No banners found. Create one to get started.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <form id="bannerForm" onSubmit={handleSave} className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl relative z-10">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
              <h3 className="text-xl font-bold text-gray-800">{editing.id ? 'Edit Banner' : 'Add New Banner'}</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="w-8 h-8 flex items-center justify-center bg-white border rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 p-6 space-y-6">
              
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex gap-6 items-center">
                <div className="w-32 h-24 rounded-xl border shadow-sm flex items-center justify-center overflow-hidden shrink-0 bg-gray-100">
                  {editing.mediaUrl ? (
                    <img src={editing.mediaUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon size={32} className="text-gray-300" />
                  )}
                </div>
                <div className="flex-1 space-y-3">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-0">Background Image <span className="text-red-500">*</span></label>
                    <p className="text-[10px] text-gray-500 mb-2 font-normal">Recommended: 800x400px (landscape)</p>
                    <div className="flex gap-2">
                      <input type="url" placeholder="Paste URL..." value={editing.mediaUrl || ''} onChange={e => updateEditing({...editingRef.current, mediaUrl: e.target.value})} className="flex-1 p-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm" />
                      <span className="text-sm text-gray-500 flex items-center">OR</span>
                      <label className={`cursor-pointer ${isUploading ? 'bg-gray-200 opacity-70' : 'bg-gray-100 hover:bg-gray-200'} px-4 py-2.5 rounded-xl border border-gray-200 flex items-center gap-2 text-sm font-medium transition-colors text-gray-700`}>
                        {isUploading ? <Loader2 size={16} className="animate-spin text-red-600" /> : <ImageIcon size={16} className="text-red-600" />}
                        {isUploading ? 'Uploading...' : 'Upload'}
                        <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          setIsUploading(true);
                          try {
                            const url = await handleImageUpload(file);
                            if (url) updateEditing({...editingRef.current, mediaUrl: url});
                          } catch (err) {
                            showToast('Upload failed', 'error');
                          }
                          setIsUploading(false);
                        }} />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
                  <input type="text" value={editing.title || ''} onChange={e => updateEditing({...editingRef.current, title: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Subtitle</label>
                  <textarea value={editing.subtitle || ''} onChange={e => updateEditing({...editingRef.current, subtitle: e.target.value})} rows={2} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Badge Text</label>
                    <input type="text" value={editing.badge || ''} onChange={e => updateEditing({...editingRef.current, badge: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm" placeholder="e.g. 100% PURE" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Link URL</label>
                    <input type="text" value={editing.link || ''} onChange={e => updateEditing({...editingRef.current, link: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm" placeholder="/category" />
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 border-t flex justify-end gap-3 bg-gray-50/80">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-colors text-sm">Cancel</button>
              <button type="submit" form="bannerForm" className="px-6 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-500/30 text-sm">
                {editing.id ? 'Save Changes' : 'Create Banner'}
              </button>
            </div>
          </form>
        </div>
      , document.body)}
    </div>
  );
}
