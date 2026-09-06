import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import { handleImageUpload } from '../../utils/imageUpload';
import MediaDisplay from '../../components/MediaDisplay';
import { TableRowSkeleton } from '../../components/Skeleton';
import { useData } from '../../context/DataContext';
import { useCart } from '../../context/CartContext';
import { Plus, Edit2, Trash2, X, Search, Image as ImageIcon, Package, Loader2 } from 'lucide-react';

export default function AdminProducts() {
  const { products, setProducts, categories, refreshData, loading } = useData();
  const { showToast } = useCart();
  const [editing, setEditing] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isUploadingPrimary, setIsUploadingPrimary] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [visibleCount, setVisibleCount] = useState(50);

  const observerRef = React.useRef(null);
  const loadMoreRef = React.useCallback(node => {
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setVisibleCount(prev => prev + 50);
      }
    }, { rootMargin: '600px' });

    if (node) observerRef.current.observe(node);
  }, []);

  React.useEffect(() => {
    setVisibleCount(50);
  }, [searchQuery]);

  const defaultProduct = {
    name: '', brand: 'Katariya Auto Parts', category: '', price: '', mrp: '', rating: 4.5, reviews: 0, img: '', images: [], tag: '', badge: '', variants: []
  };

  const uniqueBrands = [...new Set((products || []).map(p => p.brand).filter(Boolean))];

  const handleEditClick = (p) => {
    let images = [];
    try { if (p.images) images = typeof p.images === 'string' ? JSON.parse(p.images) : p.images; } catch(e) {}
    let variants = [];
    try { if (p.variants) variants = typeof p.variants === 'string' ? JSON.parse(p.variants) : p.variants; } catch(e) {}
    setEditing({ ...p, images: Array.isArray(images) ? images : [], variants: Array.isArray(variants) ? variants : [] });
    setIsModalOpen(true);
  };


  const handleSave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = { ...editing, price: Number(editing.price), mrp: Number(editing.mrp), variants: JSON.stringify(editing.variants || []) };
      if (editing.id) {
        await axios.put(`/api/products/${editing.id}`, payload).catch(err => console.warn('API error:', err));
        if (typeof setProducts === 'function') {
          setProducts(prev => prev.map(p => p.id === editing.id ? { ...p, ...payload } : p));
        }
        showToast('Product updated successfully!');
      } else {
        const newProd = { ...payload, id: Date.now() };
        await axios.post('/api/products', payload).catch(err => console.warn('API error:', err));
        if (typeof setProducts === 'function') {
          setProducts(prev => [...prev, newProd]);
        }
        showToast('New product added!');
      }
      if (typeof refreshData === 'function') {
        try { await refreshData(); } catch (e) {}
      }
    } catch (err) {
      console.error(err);
      showToast('Error saving product.');
    } finally {
      setIsModalOpen(false);
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setIsSubmitting(true);
      try {
        await axios.delete(`/api/products/${id}`).catch(err => console.warn('API error:', err));
        if (typeof setProducts === 'function') {
          setProducts(prev => prev.filter(p => p.id !== id));
        }
        if (typeof refreshData === 'function') {
          try { await refreshData(); } catch (e) {}
        }
        showToast('Product deleted.');
      } catch (err) {
        console.error(err);
        showToast('Error deleting product.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const filteredProducts = products.filter(p => {
    const search = (searchQuery || '').toLowerCase();
    const name = p.name ? String(p.name).toLowerCase() : '';
    const brand = p.brand ? String(p.brand).toLowerCase() : '';
    return name.includes(search) || brand.includes(search);
  });

  return (
    <>
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden animate-fade-in">
        {/* Header & Search */}
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/30">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Products</h2>
          <p className="text-sm text-gray-500">Manage your store's inventory</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm"
            />
          </div>
          <button 
            onClick={() => { setEditing(defaultProduct); setIsModalOpen(true); }}
            className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-red-500/20 whitespace-nowrap"
          >
            <Plus size={18} /> <span className="hidden sm:inline">Add Product</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 text-gray-500 text-sm border-b border-gray-100">
              <th className="p-4 font-semibold pl-6">Product</th>
              <th className="p-4 font-semibold">Brand</th>
              <th className="p-4 font-semibold">Price</th>
              <th className="p-4 font-semibold">Status/Badge</th>
              <th className="p-4 font-semibold text-right pr-6">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading && products.length === 0 ? (
              <>
                <TableRowSkeleton />
                <TableRowSkeleton />
                <TableRowSkeleton />
                <TableRowSkeleton />
                <TableRowSkeleton />
              </>
            ) : (
              <>
                {filteredProducts.slice(0, visibleCount).map(p => (
                  <tr key={p.id} className="hover:bg-red-50/30 transition-colors group">
                    <td className="p-4 pl-6 flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-gray-100 overflow-hidden border border-gray-200/50">
                        {p.img ? (
                          <MediaDisplay src={p.img} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400"><ImageIcon size={20}/></div>
                        )}
                      </div>
                      <div>
                        <span className="font-bold text-gray-800 block">{p.name}</span>
                        {p.tag && <span className="text-xs text-red-500 font-medium">{p.tag}</span>}
                      </div>
                    </td>
                    <td className="p-4 text-gray-600 font-medium">{p.brand || '-'}</td>
                    <td className="p-4">
                      <span className="text-gray-800 font-bold block">₹{p.price}</span>
                      {p.mrp && <span className="text-xs text-gray-400 line-through">₹{p.mrp}</span>}
                    </td>
                    <td className="p-4">
                      {p.badge ? (
                        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-xs font-bold">{p.badge}</span>
                      ) : (
                        <span className="text-gray-400 text-xs">-</span>
                      )}
                    </td>
                    <td className="p-4 pr-6">
                      <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button title="Edit Product" data-testid={`edit-btn-${p.id}`} onClick={() => handleEditClick(p)} className="p-2 text-red-500 hover:bg-red-100 rounded-xl transition-colors">
                          <Edit2 size={18} />
                        </button>
                        <button title="Delete Product" data-testid={`del-btn-${p.id}`} onClick={() => handleDelete(p.id)} className="p-2 text-red-500 hover:bg-red-100 rounded-xl transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-12 text-center">
                      <div className="inline-flex flex-col items-center justify-center text-gray-400">
                        <Package size={48} className="mb-4 text-gray-300" />
                        <p className="text-lg font-medium text-gray-500">No products found</p>
                        <p className="text-sm">Try adjusting your search or add a new product.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Load More Button */}
      {visibleCount < filteredProducts.length && (
        <div ref={loadMoreRef} className="mt-6 flex justify-center pb-6">
          <button
            onClick={() => setVisibleCount(prev => prev + 50)}
            className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-red-600 font-bold py-2 px-6 rounded-xl shadow-sm transition-all text-sm flex items-center gap-2"
          >
            Load More ({filteredProducts.length - visibleCount} remaining)
          </button>
        </div>
      )}
      </div>

      {/* Modal */}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[300] flex items-center justify-center p-4 animate-fade-in">
          <form id="productForm" onSubmit={handleSave} className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
              <h3 className="text-xl font-bold text-gray-800">{editing.id ? 'Edit Product' : 'Add New Product'}</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="w-8 h-8 flex items-center justify-center bg-white border rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 p-6">
              <div className="space-y-6">
                
                {/* Image Preview Area */}
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex gap-6 items-center">
                  <div className="w-24 h-24 rounded-xl bg-white border shadow-sm flex items-center justify-center overflow-hidden shrink-0">
                    {editing.img ? (
                      <MediaDisplay src={editing.img} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon size={32} className="text-gray-300" />
                    )}
                  </div>
                  <div className="flex-1">
                    <label htmlFor="img" className="block text-sm font-bold text-gray-700 mb-1">Primary Image <span className="text-red-500">*</span></label>
                    <div className="flex gap-2">
                      <input id="img" type="url" placeholder="Paste URL here..." value={editing.img || ''} onChange={e => setEditing({...editing, img: e.target.value})} className="flex-1 p-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm" />
                      <span className="text-sm text-gray-500 flex items-center">OR</span>
                      <label className={`cursor-pointer ${isUploadingPrimary ? 'bg-gray-200 opacity-70' : 'bg-gray-100 hover:bg-gray-200'} px-4 py-2.5 rounded-xl border border-gray-200 flex items-center gap-2 text-sm font-medium transition-colors text-gray-700`}>
                        {isUploadingPrimary ? <><Loader2 className="animate-spin" size={16} /> Uploading...</> : 'Upload File'}
                        <input type="file" accept="image/*,video/*" className="hidden" disabled={isUploadingPrimary} onChange={async (e) => {
                            if (e.target.files && e.target.files[0]) {
                              setIsUploadingPrimary(true);
                              try {
                                const base64 = await handleImageUpload(e.target.files[0]);
                                setEditing(prev => ({...prev, img: base64}));
                              } catch(err) {
                                console.error("Upload failed", err);
                                alert("Image upload failed");
                              } finally {
                                setIsUploadingPrimary(false);
                              }
                            }
                        }} />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Recommended size: 400x400px (1:1 Square)</p>
                  </div>
                </div>

                {/* Additional Images */}
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-3">
                  <label className="block text-sm font-bold text-gray-700">Additional Images (Gallery)</label>
                  <div className="flex gap-2">
                    <input 
                      type="url" 
                      placeholder="https://example.com/other-image.jpg" 
                      value={newImageUrl} 
                      onChange={e => setNewImageUrl(e.target.value)} 
                      className="flex-1 p-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm" 
                    />
                    <button 
                      type="button"
                      onClick={() => {
                        if (newImageUrl && !(editing.images || []).includes(newImageUrl)) {
                          setEditing({ ...editing, images: [...(editing.images || []), newImageUrl] });
                          setNewImageUrl('');
                        }
                      }}
                      className="bg-red-500 text-white px-4 rounded-xl font-bold hover:bg-red-600 transition-colors"
                    >
                      Add URL
                    </button>
                    <label className={`cursor-pointer ${isUploadingGallery ? 'bg-gray-200 opacity-70' : 'bg-gray-100 hover:bg-gray-200'} px-4 py-2.5 rounded-xl border border-gray-200 flex items-center gap-2 text-sm font-medium transition-colors text-gray-700`}>
                      {isUploadingGallery ? <><Loader2 className="animate-spin" size={16} /> Uploading...</> : 'Upload'}
                      <input type="file" accept="image/*,video/*" className="hidden" disabled={isUploadingGallery} onChange={async (e) => {
                          if (e.target.files && e.target.files[0]) {
                            setIsUploadingGallery(true);
                            try {
                              const base64 = await handleImageUpload(e.target.files[0]);
                              setEditing(prev => ({ ...prev, images: [...(prev.images || []), base64] }));
                            } catch(err) {
                              console.error("Upload failed", err);
                              alert("Image upload failed");
                            } finally {
                              setIsUploadingGallery(false);
                            }
                          }
                      }} />
                    </label>
                  </div>
                  {(editing.images && editing.images.length > 0) && (
                    <div className="flex flex-wrap gap-3 mt-3">
                      {editing.images.map((imgUrl, idx) => (
                        <div key={idx} className="relative w-16 h-16 rounded-xl border bg-white overflow-hidden group">
                          <MediaDisplay src={imgUrl} className="w-full h-full object-cover" alt="Additional" />
                          <button 
                            type="button" 
                            onClick={() => setEditing({ ...editing, images: editing.images.filter((_, i) => i !== idx) })}
                            className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-1">Product Name <span className="text-red-500">*</span></label>
                    <input id="name" required type="text" placeholder="e.g. Kashmiri Mongra Saffron 5g" value={editing.name || ''} onChange={e => setEditing({...editing, name: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm" />
                  </div>
                  
                  <div>
                    <label htmlFor="brand" className="block text-sm font-bold text-gray-700 mb-1">Brand <span className="text-red-500">*</span></label>
                    <input id="brand" list="brand-list" required type="text" placeholder="e.g. Katariya Auto Parts" value={editing.brand || ''} onChange={e => setEditing({...editing, brand: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm" />
                    <datalist id="brand-list">
                      {uniqueBrands.map(b => <option key={b} value={b} />)}
                    </datalist>
                  </div>



                  <div className="md:col-span-2">
                    <label htmlFor="category" className="block text-sm font-bold text-gray-700 mb-1">Category <span className="text-red-500">*</span></label>
                    <input id="category" list="category-list" required type="text" placeholder="e.g. Spices, Dry Fruit, Seeds" value={editing.category || ''} onChange={e => setEditing({...editing, category: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm" />
                    <datalist id="category-list">
                      {categories.map(c => <option key={c.label} value={c.label} />)}
                    </datalist>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="price" className="block text-sm font-bold text-gray-700 mb-1">Selling Price <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
                        <input id="price" required min="0" type="number" step="any" value={editing.price === 0 ? 0 : (editing.price || '')} onChange={e => setEditing({...editing, price: e.target.value})} className="w-full pl-7 p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm" />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="mrp" className="block text-sm font-bold text-gray-700 mb-1">MRP <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
                        <input id="mrp" required min="0" type="number" step="any" value={editing.mrp === 0 ? 0 : (editing.mrp || '')} onChange={e => setEditing({...editing, mrp: e.target.value})} className="w-full pl-7 p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Variants UI */}
                  <div className="md:col-span-2 mt-4 p-4 border border-gray-200 rounded-xl bg-gray-50/50">
                    <div className="flex justify-between items-center mb-3">
                      <label className="block text-sm font-bold text-gray-700">Pack Sizes & Rates (Variants)</label>
                      <button type="button" onClick={() => setEditing({...editing, variants: [...(editing.variants || []), {label: '', price: 0, mrp: 0}]})} className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded font-bold hover:bg-red-200 transition-colors">+ Add Size</button>
                    </div>
                    {(!editing.variants || editing.variants.length === 0) && <p className="text-xs text-gray-500 italic">No pack sizes defined. Product will be sold as a single unit using Base Price.</p>}
                    <div className="space-y-2">
                      {(editing.variants || []).map((v, i) => (
                        <div key={i} className="flex gap-2 items-center bg-white p-2 border rounded-lg">
                          <input type="text" placeholder="Size (e.g. 1L, 500g)" value={v.label} onChange={e => { const newV = [...editing.variants]; newV[i].label = e.target.value; setEditing({...editing, variants: newV}); }} className="flex-1 p-1.5 border rounded text-sm focus:ring-1 focus:ring-red-500 outline-none" required />
                          <div className="relative w-24">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">₹</span>
                            <input type="number" placeholder="Price" value={v.price === 0 ? '' : v.price} onChange={e => { const newV = [...editing.variants]; newV[i].price = Number(e.target.value); setEditing({...editing, variants: newV}); }} className="w-full pl-6 p-1.5 border rounded text-sm focus:ring-1 focus:ring-red-500 outline-none" required />
                          </div>
                          <div className="relative w-24">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">₹</span>
                            <input type="number" placeholder="MRP" value={v.mrp === 0 ? '' : v.mrp} onChange={e => { const newV = [...editing.variants]; newV[i].mrp = Number(e.target.value); setEditing({...editing, variants: newV}); }} className="w-full pl-6 p-1.5 border rounded text-sm focus:ring-1 focus:ring-red-500 outline-none" required />
                          </div>
                          <button type="button" onClick={() => setEditing({...editing, variants: editing.variants.filter((_, idx) => idx !== i)})} className="text-red-500 hover:text-red-700 p-1 bg-red-50 hover:bg-red-100 rounded"><X size={16}/></button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Highlight Tag</label>
                    <input type="text" placeholder="e.g. 20% OFF" value={editing.tag || ''} onChange={e => setEditing({...editing, tag: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Status Badge</label>
                    <input type="text" placeholder="e.g. 🏆 Bestseller" value={editing.badge || ''} onChange={e => setEditing({...editing, badge: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm" />
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t bg-gray-50/50 flex justify-end gap-3">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 border border-gray-200 bg-white rounded-xl hover:bg-gray-50 font-bold text-gray-600 transition-colors">Cancel</button>
              <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold shadow-lg shadow-red-500/20 transition-all hover:-translate-y-0.5 flex items-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0">
                {isSubmitting ? <><Loader2 className="animate-spin" size={16} /> Saving...</> : editing.id ? 'Save Changes' : 'Create Product'}
              </button>
            </div>
          </form>
        </div>
      , document.body)}
    </>
  );
}
