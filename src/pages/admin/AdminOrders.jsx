import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import {
  Package, ChevronDown, ChevronUp, Trash2, MessageCircle,
  ShoppingBag, Clock, CheckCircle, TrendingUp, RefreshCw,
  IndianRupee, Phone, User, Hash, Filter, Loader2, Download
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useData } from '../../context/DataContext';
import ScrollReveal from '../../components/ScrollReveal';
import InvoiceTemplate from '../../components/InvoiceTemplate';
import html2pdf from 'html2pdf.js';

/* ─── Constants ─────────────────────────────────────────────────────────── */

const ORDER_STATUSES = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
const FILTER_TABS    = ['All', ...ORDER_STATUSES];

const ORDER_STATUS_STYLES = {
  PENDING:   'bg-red-100 text-red-700',
  CONFIRMED: 'bg-red-100   text-red-700',
  SHIPPED:   'bg-purple-100 text-purple-700',
  DELIVERED: 'bg-green-100  text-green-700',
  CANCELLED: 'bg-red-100    text-red-700',
};

const PAYMENT_STATUS_STYLES = {
  PENDING: 'bg-red-100 text-red-700',
  PAID:    'bg-green-100  text-green-700',
  FAILED:  'bg-red-100    text-red-700',
};

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function parseItems(items) {
  if (!items) return [];
  if (Array.isArray(items)) return items;
  try { return JSON.parse(items); } catch { return []; }
}

function buildWhatsAppUrl(order) {
  const phone = String(order.phone || '').replace(/\D/g, '');
  const cc    = phone.startsWith('91') ? phone : `91${phone}`;
  const items = parseItems(order.items);
  const itemList = items.map(i => `• ${i.name || i.productName || 'Item'} x${i.qty || i.quantity || 1}`).join('\n');
  const text = encodeURIComponent(
    `Hello ${order.customerName || order.name || 'Customer'}! 🎨\n\n` +
    `Your Katariya Auto Parts order *#${String(order.id).slice(-6).toUpperCase()}* update:\n\n` +
    `${itemList || '(see order details)'}\n\n` +
    `Total: ₹${order.total || order.totalAmount || 0}\n` +
    `Status: ${order.status}\n\n` +
    `Thank you for shopping with us! ✨🖼️`
  );
  return `https://wa.me/${cc}?text=${text}`;
}

/* ─── Sub-components ─────────────────────────────────────────────────────── */

function StatusBadge({ status }) {
  const cls = ORDER_STATUS_STYLES[status] || 'bg-gray-100 text-gray-600';
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${cls}`}>
      {status || '—'}
    </span>
  );
}

function PaymentBadge({ status }) {
  const cls = PAYMENT_STATUS_STYLES[status] || 'bg-gray-100 text-gray-600';
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${cls}`}>
      {status || '—'}
    </span>
  );
}

function ExpandedItems({ items }) {
  const parsed = parseItems(items);
  if (!parsed.length) {
    return <p className="text-gray-400 text-sm italic">No item details available.</p>;
  }
  return (
    <div className="space-y-2">
      {parsed.map((item, idx) => (
        <div key={idx} className="flex items-center justify-between bg-white rounded-xl px-4 py-2.5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            {item.img || item.image ? (
              <img
                src={item.img || item.image}
                alt={item.name || item.productName}
                className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                onError={e => { e.target.style.display = 'none'; }}
              />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-[#f1f5f9]/50 border border-[#f1f5f9] flex items-center justify-center">
                <Package size={16} className="text-gray-200" />
              </div>
            )}
            <div>
              <p className="font-semibold text-gray-800 text-sm">{item.name || item.productName || `Item #${idx + 1}`}</p>
              {item.brand && <p className="text-xs text-gray-400">{item.brand}</p>}
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <span className="text-gray-500">Qty: <span className="font-bold text-gray-700">{item.qty || item.quantity || 1}</span></span>
            <span className="text-[#b91c1c] font-bold">₹{item.price || item.sellingPrice || '—'}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Stat Card ──────────────────────────────────────────────────────────── */

function StatCard({ label, value, icon: Icon, color, bg }) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
      <div className={`w-14 h-14 rounded-2xl ${bg} ${color} flex items-center justify-center shadow-inner`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-3xl font-black text-gray-800">{value}</p>
        <p className="text-sm text-gray-500 font-semibold">{label}</p>
      </div>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────────── */

export default function AdminOrders() {
  const { showToast } = useCart();
  const { frontendSettings } = useData();

  const [orders, setOrders]             = useState([]);
  const [loading, setLoading]           = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [expandedRow, setExpandedRow]   = useState(null);
  const [updatingId, setUpdatingId]     = useState(null);
  const [deletingId, setDeletingId]     = useState(null);
  
  const [downloadingOrderId, setDownloadingOrderId] = useState(null);
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState(null);
  const invoiceRef = React.useRef(null);

  /* ── Fetch ── */
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/orders');
      setOrders(Array.isArray(data) ? data : (data.orders || []));
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      showToast('❌ Failed to load orders.');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  /* ── Status update ── */
  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    // Optimistic update
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    try {
      await axios.put(`/api/orders/${orderId}`, { status: newStatus });
      showToast(`✅ Order status updated to ${newStatus}`);
    } catch (err) {
      console.error('Status update failed:', err);
      showToast('❌ Failed to update order status.');
      fetchOrders(); // revert
    } finally {
      setUpdatingId(null);
    }
  };

  /* ── Delete ── */
  const handleDelete = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order? This cannot be undone.')) return;
    setDeletingId(orderId);
    try {
      await axios.delete(`/api/orders/${orderId}`);
      fetchOrders();
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setDeletingId(null);
    }
  };

  /* ── Download Invoice ── */
  const handleDownloadInvoice = async (order) => {
    setDownloadingOrderId(order.id);
    setSelectedOrderForInvoice(order);
    
    // Wait for state update to render InvoiceTemplate and images to fetch
    setTimeout(async () => {
      try {
        const element = invoiceRef.current;
        const opt = {
          margin:       0,
          filename:     `Invoice_${String(order.id).slice(-6).toUpperCase()}.pdf`,
          image:        { type: 'jpeg', quality: 0.98 },
          html2canvas:  { scale: 2, useCORS: true },
          jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
        const generatePdf = typeof html2pdf === 'function' ? html2pdf : html2pdf.default;
        await generatePdf().set(opt).from(element).save();
      } catch (err) {
        console.error('Invoice generation failed:', err);
        const errMsg = err?.message || String(err);
        showToast('❌ Failed to generate invoice.');
        alert('Invoice Generation Error: ' + errMsg);
      } finally {
        setDownloadingOrderId(null);
        setSelectedOrderForInvoice(null);
      }
    }, 500);
  };

  /* ── Stats ── */
  const stats = useMemo(() => {
    const total     = orders.length;
    const pending   = orders.filter(o => o.status === 'PENDING').length;
    const confirmed = orders.filter(o => o.status === 'CONFIRMED').length;
    const revenue   = orders
      .filter(o => o.status !== 'CANCELLED')
      .reduce((sum, o) => sum + Number(o.total || o.totalAmount || 0), 0);
    return [
      { label: 'Total Orders',   value: total,     icon: ShoppingBag,  color: 'text-red-500',   bg: 'bg-red-50' },
      { label: 'Pending',        value: pending,   icon: Clock,        color: 'text-red-500', bg: 'bg-red-50' },
      { label: 'Confirmed',      value: confirmed, icon: CheckCircle,  color: 'text-green-500',  bg: 'bg-green-50' },
      { label: 'Total Revenue',  value: `₹${revenue.toLocaleString('en-IN')}`, icon: TrendingUp, color: 'text-[#ef4444]', bg: 'bg-[#f1f5f9]/50' },
    ];
  }, [orders]);

  /* ── Filtered orders ── */
  const filteredOrders = useMemo(() => {
    if (activeFilter === 'All') return orders;
    return orders.filter(o => o.status === activeFilter);
  }, [orders, activeFilter]);

  /* ── Toggle expand ── */
  const toggleExpand = (id) => setExpandedRow(prev => (prev === id ? null : id));

  /* ─────────────────────────────────────────────────────────────────────── */

  return (
    <div className="space-y-8 animate-fade-in relative">
      <div style={{ position: 'fixed', left: '-9999px', top: '0', pointerEvents: 'none' }}>
        {selectedOrderForInvoice && (
          <InvoiceTemplate ref={invoiceRef} order={selectedOrderForInvoice} frontendSettings={frontendSettings} />
        )}
      </div>

      {/* Page Header */}
      <ScrollReveal>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-gray-800 tracking-tight mb-1">Orders</h1>
            <p className="text-gray-500 font-medium">Manage and track customer orders.</p>
          </div>
          <button
            onClick={fetchOrders}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 font-semibold hover:bg-gray-50 transition-all shadow-sm text-sm disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </ScrollReveal>

      {/* Stats */}
      <ScrollReveal delay={100}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <StatCard key={i} {...s} />
          ))}
        </div>
      </ScrollReveal>

      {/* Table Card */}
      <ScrollReveal delay={200}>
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">

          {/* Card Header + Filters */}
          <div className="p-6 border-b border-gray-100 bg-gray-50/30 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Order List</h2>
              <p className="text-sm text-gray-500">
                {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''} shown
              </p>
            </div>

            {/* Filter tabs */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <Filter size={14} className="text-gray-400 mr-1" />
              {FILTER_TABS.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeFilter === tab
                      ? 'bg-[#ef4444] text-white shadow-md shadow-[#ef4444]/20'
                      : 'bg-white border border-gray-200 text-gray-500 hover:border-gray-200 hover:text-[#ef4444]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Loading skeleton */}
          {loading ? (
        <div className="p-12 flex flex-col items-center justify-center gap-4 text-gray-400">
              <RefreshCw size={36} className="animate-spin text-gray-200" />
              <p className="font-medium">Loading orders…</p>
            </div>
          ) : (
            <div>
              {/* Mobile View */}
              <div className="block lg:hidden space-y-4">
                {filteredOrders.length === 0 ? (
                  <div className="py-12 text-center bg-gray-50/50 rounded-2xl border border-gray-100">
                    <div className="inline-flex flex-col items-center gap-3 text-gray-400">
                      <Package size={42} className="text-gray-200" />
                      <p className="text-base font-bold text-gray-500">No orders found</p>
                    </div>
                  </div>
                ) : (
                  filteredOrders.map(order => {
                    const isExpanded   = expandedRow === order.id;
                    const itemList     = parseItems(order.items);
                    const itemCount    = itemList.length || order.itemCount || '-';
                    const orderTotal   = order.total || order.totalAmount || 0;
                    const customerName = order.customerName || order.name || '-';
                    const phone        = order.phone || order.customerPhone || '-';
                    const payMethod    = order.paymentMethod || order.payment || '-';
                    const payStatus    = order.paymentStatus || 'PENDING';
                    const ordStatus    = order.status || 'PENDING';
                    const shortId      = String(order.id).slice(-6).toUpperCase();

                    return (
                      <div key={order.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-3 border-b border-gray-50 pb-3">
                          <span className="font-mono font-bold text-gray-700 text-sm">#{shortId}</span>
                          <span className="text-xs text-gray-500 font-medium">{formatDate(order.createdAt)}</span>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500 flex items-center gap-1"><User size={14}/> {customerName}</span>
                            <span className="font-bold text-gray-800 flex items-center gap-1"><IndianRupee size={12} /> {orderTotal}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500 flex items-center gap-1"><Phone size={14}/> {phone}</span>
                            <span className="text-gray-600 font-medium">{itemCount} items</span>
                          </div>
                        </div>

                        <div className="flex gap-2 mb-4 flex-wrap">
                          <select
                            value={ordStatus}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className={`text-[10px] font-bold px-2 py-1.5 rounded-lg border-0 appearance-none pr-6 cursor-pointer relative ${ORDER_STATUS_STYLES[ordStatus] || 'bg-gray-100 text-gray-700'}`}
                            style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2214%22%20height%3D%2214%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 4px center' }}
                          >
                            {ORDER_STATUSES.map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                          
                          <select
                            value={payStatus}
                            className={`text-[10px] font-bold px-2 py-1.5 rounded-lg border-0 appearance-none pr-6 cursor-pointer relative ${PAYMENT_STATUS_STYLES[payStatus] || 'bg-gray-100 text-gray-700'}`}
                            style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2214%22%20height%3D%2214%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 4px center' }}
                          >
                            {['PENDING', 'PAID', 'FAILED'].map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                          <span className="bg-gray-100 text-gray-600 text-[10px] px-2 py-1.5 rounded-lg font-bold">{payMethod}</span>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => toggleExpand(order.id)}
                            className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-600 text-sm font-bold py-2 rounded-xl transition-colors flex items-center justify-center gap-1"
                          >
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />} Items
                          </button>
                          <button
                            title="Download Invoice"
                            onClick={() => handleDownloadInvoice(order)}
                            disabled={downloadingOrderId === order.id}
                            className="w-10 h-10 bg-[#f1f5f9]/50 hover:bg-[#f1f5f9] text-[#b91c1c] rounded-xl flex items-center justify-center transition-colors shrink-0 disabled:opacity-50"
                          >
                            {downloadingOrderId === order.id ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                          </button>
                          <button
                            onClick={() => handleDelete(order.id)}
                            className="w-10 h-10 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl flex items-center justify-center transition-colors shrink-0"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        {isExpanded && (
                          <div className="mt-4 bg-gray-50 rounded-xl p-3 space-y-3">
                            {itemList.length > 0 ? itemList.map((itm, i) => (
                              <div key={i} className="flex gap-3">
                                {itm.img ? (
                                  <div className="w-12 h-12 rounded-lg bg-gray-200 overflow-hidden shrink-0">
                                    <img src={itm.img} alt={itm.name} className="w-full h-full object-cover" />
                                  </div>
                                ) : (
                                  <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center text-gray-400 shrink-0">
                                    <ShoppingBag size={20} />
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-bold text-gray-700 truncate">{itm.name || 'Unknown Item'}</p>
                                  <div className="flex gap-3 mt-1 text-xs text-gray-500">
                                    <span>Qty: {itm.quantity || 1}</span>
                                    <span className="font-medium text-gray-700">₹{itm.price || 0}</span>
                                  </div>
                                </div>
                              </div>
                            )) : (
                              <p className="text-sm text-gray-500 text-center py-2">No item details available.</p>
                            )}
                            {order.address && (
                              <div className="pt-3 border-t border-gray-200">
                                <p className="text-xs font-bold text-gray-500 mb-1">Shipping Address</p>
                                <p className="text-sm text-gray-700 leading-tight whitespace-pre-line">{order.address}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Desktop View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[960px]">
                <thead>
                  <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                    <th className="px-4 py-4 font-semibold pl-6 w-10"></th>
                    <th className="px-4 py-4 font-semibold">
                      <div className="flex items-center gap-1"><Hash size={12} /> Order ID</div>
                    </th>
                    <th className="px-4 py-4 font-semibold">Date</th>
                    <th className="px-4 py-4 font-semibold">
                      <div className="flex items-center gap-1"><User size={12} /> Customer</div>
                    </th>
                    <th className="px-4 py-4 font-semibold">
                      <div className="flex items-center gap-1"><Phone size={12} /> Phone</div>
                    </th>
                    <th className="px-4 py-4 font-semibold text-center">Items</th>
                    <th className="px-4 py-4 font-semibold">
                      <div className="flex items-center gap-1"><IndianRupee size={12} /> Total</div>
                    </th>
                    <th className="px-4 py-4 font-semibold">Payment</th>
                    <th className="px-4 py-4 font-semibold">Pay Status</th>
                    <th className="px-4 py-4 font-semibold">Order Status</th>
                    <th className="px-4 py-4 font-semibold text-right pr-6">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="py-16 text-center">
                        <div className="inline-flex flex-col items-center gap-3 text-gray-400">
                          <Package size={52} className="text-gray-200" />
                          <p className="text-lg font-bold text-gray-500">No orders found</p>
                          <p className="text-sm">
                            {activeFilter !== 'All'
                              ? `No ${activeFilter.toLowerCase()} orders yet.`
                              : 'Orders placed by customers will appear here.'}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map(order => {
                      const isExpanded   = expandedRow === order.id;
                      const itemList     = parseItems(order.items);
                      const itemCount    = itemList.length || order.itemCount || '—';
                      const orderTotal   = order.total || order.totalAmount || 0;
                      const customerName = order.customerName || order.name || '—';
                      const phone        = order.phone || order.customerPhone || '—';
                      const payMethod    = order.paymentMethod || order.payment || '—';
                      const payStatus    = order.paymentStatus || 'PENDING';
                      const ordStatus    = order.status || 'PENDING';
                      const shortId      = String(order.id).slice(-6).toUpperCase();

                      return (
                        <React.Fragment key={order.id}>
                          {/* Main row */}
                          <tr className={`hover:bg-[#f1f5f9]/50/20 transition-colors group ${isExpanded ? 'bg-[#f1f5f9]/50/10' : ''}`}>

                            {/* Expand toggle */}
                            <td className="px-4 py-4 pl-6">
                              <button
                                onClick={() => toggleExpand(order.id)}
                                title={isExpanded ? 'Collapse' : 'Show items'}
                                className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-[#f1f5f9] text-gray-500 hover:text-[#b91c1c] flex items-center justify-center transition-colors"
                              >
                                {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                              </button>
                            </td>

                            {/* Order ID */}
                            <td className="px-4 py-4">
                              <span className="font-mono font-bold text-gray-700 text-sm">#{shortId}</span>
                            </td>

                            {/* Date */}
                            <td className="px-4 py-4 text-gray-500 text-sm whitespace-nowrap">
                              {formatDate(order.createdAt || order.date)}
                            </td>

                            {/* Customer */}
                            <td className="px-4 py-4">
                              <span className="font-semibold text-gray-800 text-sm">{customerName}</span>
                            </td>

                            {/* Phone */}
                            <td className="px-4 py-4 text-gray-600 text-sm font-medium">
                              {phone}
                            </td>

                            {/* Items count */}
                            <td className="px-4 py-4 text-center">
                              <span className="bg-[#f1f5f9]/50 text-[#b91c1c] font-bold text-xs px-2.5 py-1 rounded-full border border-[#f1f5f9]">
                                {itemCount}
                              </span>
                            </td>

                            {/* Total */}
                            <td className="px-4 py-4 font-bold text-gray-800">
                              ₹{Number(orderTotal).toLocaleString('en-IN')}
                            </td>

                            {/* Payment Method */}
                            <td className="px-4 py-4">
                              {payMethod === 'COD' ? (
                                <span className="bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full text-xs font-bold">COD</span>
                              ) : (
                                <span className="bg-indigo-50 text-indigo-600 px-2.5 py-0.5 rounded-full text-xs font-bold">{payMethod}</span>
                              )}
                            </td>

                            {/* Payment Status */}
                            <td className="px-4 py-4">
                              <PaymentBadge status={payStatus} />
                            </td>

                            {/* Order Status dropdown */}
                            <td className="px-4 py-4">
                              <div className="relative inline-block">
                                <select
                                  value={ordStatus}
                                  disabled={updatingId === order.id}
                                  onChange={e => handleStatusChange(order.id, e.target.value)}
                                  className={`appearance-none pl-3 pr-7 py-1.5 rounded-xl border text-xs font-bold cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#ef4444]/20 focus:border-[#ef4444] transition-all disabled:opacity-60 disabled:cursor-wait border-transparent ${ORDER_STATUS_STYLES[ordStatus] || 'bg-gray-100 text-gray-600'}`}
                                >
                                  {ORDER_STATUSES.map(s => (
                                    <option key={s} value={s}>{s}</option>
                                  ))}
                                </select>
                                <ChevronDown size={11} className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
                              </div>
                            </td>

                            {/* Actions */}
                            <td className="px-4 py-4 pr-6">
                              <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                {/* Download */}
                                <button
                                  title="Download Invoice"
                                  onClick={() => handleDownloadInvoice(order)}
                                  disabled={downloadingOrderId === order.id}
                                  className="p-2 text-[#b91c1c] hover:bg-[#f1f5f9] rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {downloadingOrderId === order.id ? <Loader2 size={17} className="animate-spin" /> : <Download size={17} />}
                                </button>
                                {/* WhatsApp */}
                                <a
                                  href={buildWhatsAppUrl({ ...order, customerName, phone, status: ordStatus })}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title="Send WhatsApp message"
                                  className="p-2 text-green-600 hover:bg-green-100 rounded-xl transition-colors"
                                >
                                  <MessageCircle size={17} />
                                </a>
                                {/* Delete */}
                                <button
                                  title="Delete order"
                                  onClick={() => handleDelete(order.id)}
                                  disabled={deletingId === order.id}
                                  className="p-2 text-red-500 hover:bg-red-100 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {deletingId === order.id ? <Loader2 size={17} className="animate-spin" /> : <Trash2 size={17} />}
                                </button>
                              </div>
                            </td>
                          </tr>

                          {/* Expandable items row */}
                          {isExpanded && (
                            <tr>
                              <td colSpan={11} className="px-8 py-5 bg-gradient-to-r from-[#f1f5f9]/50/60 to-gray-200 border-b border-[#f1f5f9]/50">
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                  <Package size={12} className="text-gray-200" />
                                  Order Items — #{shortId}
                                </p>
                                <ExpandedItems items={order.items} />
                                {(order.address || order.deliveryAddress) && (
                                  <div className="mt-3 pt-3 border-t border-[#f1f5f9] text-sm text-gray-500">
                                    <span className="font-semibold text-gray-600">Delivery address: </span>
                                    {order.address || order.deliveryAddress}
                                  </div>
                                )}
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
          )}
        </div>
      </ScrollReveal>
    </div>
  );
}
