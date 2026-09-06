import React, { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, CheckCircle2, MapPin, Phone, User, Package, Truck, ChevronDown, ChevronUp, ShieldCheck, Mail } from 'lucide-react';
import axios from 'axios';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

const DELIVERY_THRESHOLD = 999;
const DELIVERY_CHARGE    = 79;

function deliveryFee(subtotal) {
  return subtotal >= DELIVERY_THRESHOLD ? 0 : DELIVERY_CHARGE;
}

function grandTotal(subtotal) {
  return subtotal + deliveryFee(subtotal);
}

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (document.getElementById('razorpay-script')) { resolve(true); return; }
    const script = document.createElement('script');
    script.id  = 'razorpay-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload  = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function buildWhatsAppMessage(orderId, customerInfo, cartItems, total, paymentMethod) {
  const itemLines = cartItems
    .map(i => `- ${i.name} ${i.selectedWeight ? `(${i.selectedWeight})` : ''} x${i.qty} = ₹${i.price * i.qty}`)
    .join('\n');
  return encodeURIComponent(
    `✨ New Katariya Auto Parts Order #${orderId}\nCustomer: ${customerInfo.name}\nPhone: ${customerInfo.phone}\nAddress: ${customerInfo.address}\n\nItems:\n${itemLines}\n\nTotal Amount: ₹${total}\nPayment Method: ${paymentMethod}`
  );
}

const stepVariants = {
  enter:  (dir) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.28, ease: 'easeOut' } },
  exit:   (dir) => ({ x: dir > 0 ? -60 : 60, opacity: 0, transition: { duration: 0.2, ease: 'easeIn' } }),
};

function StepProgress({ step }) {
  const steps = ['Address', 'Payment', 'Order Placed'];
  return (
    <div className="flex items-center justify-center gap-0 px-5 py-3 bg-red-50/50 border-b border-red-200">
      {steps.map((label, i) => {
        const done    = i < step;
        const active  = i === step;
        return (
          <React.Fragment key={label}>
            <div className="flex flex-col items-center gap-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all duration-300 ${
                done   ? 'bg-emerald-600 text-white' :
                active ? 'bg-[#dc2626] text-white shadow-[0_0_0_4px_rgba(245,158,11,0.2)]' :
                         'bg-red-100 text-red-800/60'
              }`}>
                {done ? '✓' : i + 1}
              </div>
              <span className={`text-[10px] font-bold tracking-wide ${active ? 'text-[#dc2626]' : done ? 'text-emerald-700' : 'text-neutral-400'}`}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`h-0.5 w-12 mx-1 mb-3 rounded-full transition-all duration-500 ${i < step ? 'bg-emerald-500' : 'bg-red-200'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function Toast({ message, type }) {
  const bg = type === 'error' ? 'bg-red-500' : 'bg-emerald-600';
  return (
    <motion.div
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0,   opacity: 1 }}
      exit={{ y: -30,    opacity: 0 }}
      className={`${bg} text-white text-sm font-bold px-4 py-2.5 rounded-xl shadow-lg mx-5 mt-3 text-center`}
    >
      {message}
    </motion.div>
  );
}

function Field({ label, icon: Icon, error, children }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-bold text-neutral-600 mb-1.5 uppercase tracking-wide">
        {Icon && <Icon size={12} className="text-[#dc2626]" />}
        {label}
      </label>
      {children}
      {error && <p className="text-red-500 text-[11px] mt-1 font-semibold">{error}</p>}
    </div>
  );
}

function MiniOrderSummary({ cartItems, cartTotal }) {
  const [open, setOpen] = useState(false);
  const fee   = deliveryFee(cartTotal);
  const total = grandTotal(cartTotal);
  const toFree = DELIVERY_THRESHOLD - cartTotal;

  return (
    <div className="rounded-2xl border border-red-200 bg-red-50/80 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3"
      >
        <div className="flex items-center gap-2">
          <Package size={15} className="text-[#dc2626]" />
          <span className="text-xs font-bold text-neutral-800 uppercase tracking-wide">
            {cartItems.length} item{cartItems.length !== 1 ? 's' : ''}
          </span>
          {toFree > 0 && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-red-900 bg-red-200/80 px-2 py-0.5 rounded-full">
              <Truck size={10} /> Add ₹{toFree} for FREE Shipping
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-black text-neutral-900">₹{total}</span>
          {open ? <ChevronUp size={14} className="text-neutral-400" /> : <ChevronDown size={14} className="text-neutral-400" />}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-3 space-y-1.5 border-t border-red-200/60 pt-2">
              {cartItems.map(item => (
                <div key={item.cartItemId || item.id} className="flex justify-between text-xs text-neutral-700">
                  <span className="line-clamp-1 flex-1 mr-2">{item.name} {item.selectedWeight ? `(${item.selectedWeight})` : ''} <span className="text-neutral-400">×{item.qty}</span></span>
                  <span className="font-bold flex-shrink-0">₹{item.price * item.qty}</span>
                </div>
              ))}
              <div className="border-t border-red-200 pt-1.5 space-y-0.5">
                <div className="flex justify-between text-xs text-neutral-600">
                  <span>Subtotal</span><span>₹{cartTotal}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-600">Express Delivery</span>
                  <span className={fee === 0 ? 'text-emerald-700 font-bold' : 'text-neutral-600'}>{fee === 0 ? 'FREE 🎉' : `₹${fee}`}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-neutral-900 pt-1 border-t border-red-200">
                  <span>Grand Total</span><span>₹{total}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function OrderSummary({ cartItems, cartTotal }) {
  const fee   = deliveryFee(cartTotal);
  const total = grandTotal(cartTotal);
  return (
    <div className="bg-red-50/80 border border-red-200 rounded-2xl p-4 space-y-2.5">
      <p className="text-xs font-bold text-neutral-800 uppercase tracking-wide font-cinzel">Katariya Auto Parts Summary</p>
      <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
        {cartItems.map(item => (
          <div key={item.cartItemId || item.id} className="flex justify-between text-xs">
            <span className="text-neutral-700 line-clamp-1 flex-1 mr-2">
              {item.name} {item.selectedWeight ? `(${item.selectedWeight})` : ''} <span className="text-neutral-400">×{item.qty}</span>
            </span>
            <span className="text-neutral-900 font-bold flex-shrink-0">₹{item.price * item.qty}</span>
          </div>
        ))}
      </div>
      <div className="border-t border-red-200 pt-2 space-y-1">
        <div className="flex justify-between text-xs text-neutral-600">
          <span>Subtotal</span><span>₹{cartTotal}</span>
        </div>
        <div className="flex justify-between text-xs text-neutral-600">
          <span>Express Delivery</span>
          <span className={fee === 0 ? 'text-emerald-700 font-bold' : ''}>{fee === 0 ? 'FREE 🎉' : `₹${fee}`}</span>
        </div>
        <div className="flex justify-between text-sm font-black text-neutral-900 pt-1 border-t border-red-200">
          <span>Grand Total</span><span className="text-[#171717] font-extrabold text-base">₹{total}</span>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutModal({ isOpen, onClose, cartItems, cartTotal, onOrderSuccess }) {
  const { frontendSettings } = useData();
  const { user, loginWithGoogle } = useAuth();

  const [step, setStep]     = useState(0);
  const [direction, setDir] = useState(1);

  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', pincode: '', city: '' });
  const [errors, setErrors] = useState({});

  React.useEffect(() => {
    if (user) {
      setForm(f => ({
        ...f,
        name: user.displayName || f.name,
        email: user.email || f.email
      }));
    }
  }, [user]);

  const [payMethod, setPayMethod] = useState('COD');
  const [loading, setLoading]     = useState(false);
  const [orderStep, setOrderStep] = useState(null);
  const [toast, setToast]         = useState(null);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  const showToast = useCallback((message, type = 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const goTo = useCallback((nextStep) => {
    setDir(nextStep > step ? 1 : -1);
    setStep(nextStep);
  }, [step]);

  const handleClose = useCallback(() => {
    setStep(0); setDir(1);
    setForm({ name: '', phone: '', address: '', pincode: '', city: '' });
    setErrors({}); setPayMethod('COD'); setLoading(false);
    setToast(null); setConfirmedOrder(null);
    onClose();
  }, [onClose]);

  function validateForm() {
    const e = {};
    if (!form.name.trim())                   e.name    = 'Full Name is required.';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid Email is required.';
    if (!/^\d{10}$/.test(form.phone.trim())) e.phone   = 'Enter a valid 10-digit phone number.';
    if (!form.address.trim())                e.address = 'Please enter your shipping address.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleContinue() {
    if (validateForm()) goTo(1);
  }

  async function placeCOD() {
    setLoading(true);
    setOrderStep('saving');
    try {
      const fullAddress = [form.address.trim(), form.city, form.pincode].filter(Boolean).join(', ');
      const res = await axios.post('/api/orders', {
        visitorId:       user?.uid || 'anonymous',
        userEmail:       form.email.trim(),
        customerName:    form.name.trim(),
        customerPhone:   form.phone.trim(),
        customerAddress: fullAddress,
        items:           JSON.stringify(cartItems.map(i => ({ id: i.id, name: i.name, weight: i.selectedWeight || '', qty: i.qty, price: i.price }))),
        total:           grandTotal(cartTotal),
        paymentMethod:   'COD',
      });
      setOrderStep('confirmed');
      await new Promise(r => setTimeout(r, 700));
      const orderId = res.data?.orderId || res.data?.order?.id || res.data?.id || `KATARIYA${Date.now()}`;
      setConfirmedOrder({ orderId, paymentMethod: 'Cash on Delivery (COD)' });
      setOrderStep('whatsapp');
      await new Promise(r => setTimeout(r, 500));
      goTo(2);
      onOrderSuccess && onOrderSuccess(orderId);
      const phone   = (frontendSettings?.whatsappOrderNumber || '919876543210').replace(/\D/g, '');
      const message = buildWhatsAppMessage(orderId, form, cartItems, grandTotal(cartTotal), 'COD');
      window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
    } catch (err) {
      showToast(err?.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
      setOrderStep(null);
    }
  }

  async function placeOnline() {
    const keyId = frontendSettings?.razorpayKeyId;
    if (!keyId) { showToast('Razorpay online gateway is pending config. Please use Cash on Delivery.'); return; }
    setLoading(true);
    try {
      const orderRes = await axios.post('/api/payment/create-order', { amount: grandTotal(cartTotal) * 100 });
      const rpOrder  = orderRes.data;
      const loaded   = await loadRazorpayScript();
      if (!loaded) { showToast('Could not load payment gateway. Please check internet connection.'); setLoading(false); return; }
      const options = {
        key: keyId, amount: rpOrder.amount, currency: rpOrder.currency || 'INR',
        name: 'Katariya Auto Parts',
        description: 'Katariya Auto Parts Order', order_id: rpOrder.id,
        prefill: { name: form.name.trim(), contact: form.phone.trim() },
        theme: { color: '#dc2626' },
        handler: async (response) => {
          try {
            await axios.post('/api/payment/verify', {
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
            });
            const fullAddress = [form.address.trim(), form.city, form.pincode].filter(Boolean).join(', ');
            const saveRes = await axios.post('/api/orders', {
              visitorId: user?.uid || 'anonymous', 
              userEmail: form.email.trim(),
              customerName: form.name.trim(),
              customerPhone: form.phone.trim(), customerAddress: fullAddress,
              items: JSON.stringify(cartItems.map(i => ({ id: i.id, name: i.name, weight: i.selectedWeight || '', qty: i.qty, price: i.price }))),
              total: grandTotal(cartTotal), paymentMethod: 'ONLINE',
              razorpayOrderId: rpOrder.id, razorpayPaymentId: response.razorpay_payment_id,
            });
            const orderId = saveRes.data?.orderId || saveRes.data?.order?.id || saveRes.data?.id || `KATARIYA${Date.now()}`;
            setConfirmedOrder({ orderId, paymentMethod: 'Online Payment' });
            goTo(2);
            onOrderSuccess && onOrderSuccess(orderId);
          } catch (verifyErr) {
            showToast('Payment successful but order saving failed. Contact customer care.');
          } finally { setLoading(false); }
        },
        modal: { ondismiss: () => setLoading(false) },
      };
      new window.Razorpay(options).open();
    } catch (err) {
      showToast(err?.response?.data?.message || 'Could not initiate online payment. Try COD.');
      setLoading(false);
    }
  }

  async function handlePlaceOrder() {
    payMethod === 'COD' ? await placeCOD() : await placeOnline();
  }

  function openWhatsApp() {
    if (!confirmedOrder) return;
    const phone   = (frontendSettings?.whatsappOrderNumber || '919876543210').replace(/\D/g, '');
    const message = buildWhatsAppMessage(confirmedOrder.orderId, form, cartItems, grandTotal(cartTotal), confirmedOrder.paymentMethod);
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-neutral-900/70 backdrop-blur-sm" onClick={handleClose} />

      {/* Main Sheet */}
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0,  opacity: 1 }}
        exit={{ y: 60,    opacity: 0 }}
        transition={{ type: 'spring', stiffness: 340, damping: 30 }}
        className="relative bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-red-200"
        style={{ maxHeight: '93vh' }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#171717] via-[#dc2626] to-[#b91c1c] px-5 py-4 flex items-center justify-between flex-shrink-0 shadow-md">
          <div className="flex items-center gap-2.5">
            <ShieldCheck size={20} className="text-red-300" />
            <p className="text-red-50 font-cinzel font-bold text-base leading-tight">Katariya Auto Parts Checkout</p>
          </div>
          <button
            onClick={handleClose}
            className="bg-black/20 rounded-full p-1.5 hover:bg-black/40 transition-colors"
            aria-label="Close"
          >
            <X size={18} className="text-red-100" />
          </button>
        </div>

        {/* Progress steps */}
        {step < 2 && <StepProgress step={step} />}

        <AnimatePresence>
          {toast && <Toast key="toast" message={toast.message} type={toast.type} />}
        </AnimatePresence>

        {/* Body */}
        <div className="flex-1 overflow-y-auto relative">
          <AnimatePresence mode="wait" custom={direction}>

            {/* Step 0: Address Details */}
            {step === 0 && (
              <motion.div
                key="step-info"
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="p-5 space-y-4"
              >
                <MiniOrderSummary cartItems={cartItems} cartTotal={cartTotal} />

                <div className="space-y-3">
                  {!user && (
                    <div className="bg-red-50 p-4 rounded-xl border border-red-100 flex flex-col items-center justify-center text-center space-y-3 mb-4">
                      <p className="text-sm text-neutral-600 font-medium">Sign in for faster checkout & track orders</p>
                      <button 
                        type="button"
                        onClick={() => loginWithGoogle()}
                        className="w-full bg-white text-neutral-900 border border-neutral-200 font-semibold py-2.5 rounded-lg hover:shadow-md transition-all flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                          <path fill="none" d="M1 1h22v22H1z" />
                        </svg>
                        <span>Continue with Google</span>
                      </button>
                    </div>
                  )}

                  <Field label="Email Address *" icon={Mail} error={errors.email}>
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="e.g. you@example.com"
                      className={`w-full border ${errors.email ? 'border-red-400 bg-red-50' : 'border-red-200'} 
bg-red-50/20 rounded-xl px-3.5 py-2.5 text-sm text-neutral-800 placeholder-slate-400 focus:outline-none 
focus:border-[#dc2626] transition`}
                    />
                  </Field>

                  <Field label="Full Name *" icon={User} error={errors.name}>
                    <input
                      type="text"
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="e.g. Ananya Sharma"
                      className={`w-full border ${errors.name ? 'border-red-400 bg-red-50' : 'border-red-200'} bg-red-50/20 rounded-xl px-3.5 py-2.5 text-sm text-neutral-800 placeholder-slate-400 focus:outline-none focus:border-[#dc2626] transition`}
                    />
                  </Field>

                  <Field label="Mobile Number *" icon={Phone} error={errors.phone}>
                    <div className="flex gap-2">
                      <div className="flex items-center bg-red-100/70 border border-red-200 rounded-xl px-3 py-2.5 text-sm font-bold text-red-900 flex-shrink-0">
                        +91
                      </div>
                      <input
                        type="tel"
                        maxLength={10}
                        value={form.phone}
                        onChange={e => setForm(f => ({ ...f, phone: e.target.value.replace(/\D/g, '') }))}
                        placeholder="10-digit phone number"
                        className={`flex-1 border ${errors.phone ? 'border-red-400 bg-red-50' : 'border-red-200'} bg-red-50/20 rounded-xl px-3.5 py-2.5 text-sm text-neutral-800 placeholder-slate-400 focus:outline-none focus:border-[#dc2626] transition`}
                      />
                    </div>
                  </Field>

                  <Field label="Delivery Address *" icon={MapPin} error={errors.address}>
                    <textarea
                      rows={2}
                      value={form.address}
                      onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                      placeholder="Flat/House No., Street, Landmark"
                      className={`w-full border ${errors.address ? 'border-red-400 bg-red-50' : 'border-red-200'} bg-red-50/20 rounded-xl px-3.5 py-2.5 text-sm text-neutral-800 placeholder-slate-400 focus:outline-none focus:border-[#dc2626] transition resize-none`}
                    />
                  </Field>

                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Pincode">
                      <input
                        type="text"
                        maxLength={6}
                        value={form.pincode}
                        onChange={e => setForm(f => ({ ...f, pincode: e.target.value.replace(/\D/g, '') }))}
                        placeholder="400001"
                        className="w-full border border-red-200 bg-red-50/20 rounded-xl px-3.5 py-2.5 text-sm text-neutral-800 placeholder-slate-400 focus:outline-none focus:border-[#dc2626] transition"
                      />
                    </Field>
                    <Field label="City">
                      <input
                        type="text"
                        value={form.city}
                        onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                        placeholder="Mumbai"
                        className="w-full border border-red-200 bg-red-50/20 rounded-xl px-3.5 py-2.5 text-sm text-neutral-800 placeholder-slate-400 focus:outline-none focus:border-[#dc2626] transition"
                      />
                    </Field>
                  </div>
                </div>

                <button
                  onClick={handleContinue}
                  className="w-full bg-gradient-to-r from-[#171717] via-[#dc2626] to-[#b91c1c] text-red-50 font-bold text-sm py-3.5 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  Continue to Payment <ArrowRight size={16} />
                </button>
              </motion.div>
            )}

            {/* Step 1: Payment Selection */}
            {step === 1 && (
              <motion.div
                key="step-payment"
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="p-5 space-y-4"
              >
                <button
                  onClick={() => goTo(0)}
                  className="flex items-center gap-1 text-xs text-[#dc2626] font-bold hover:underline"
                >
                  <ArrowLeft size={13} /> Edit Address
                </button>

                <div className="flex items-start gap-2 bg-red-50/60 border border-red-200 rounded-xl px-3.5 py-2.5">
                  <MapPin size={14} className="text-[#dc2626] mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-red-900 uppercase tracking-wide mb-0.5">Shipping Address</p>
                    <p className="text-xs text-neutral-800 font-bold truncate">{form.name}</p>
                    <p className="text-xs text-neutral-500 line-clamp-1">{[form.address, form.city, form.pincode].filter(Boolean).join(', ')}</p>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <p className="text-xs font-bold text-neutral-700 uppercase tracking-wide font-cinzel">Payment Method</p>

                  {[
                    { id: 'COD',    emoji: '💵', title: 'Cash on Delivery',  sub: 'Pay with cash upon delivery' },
                    { id: 'ONLINE', emoji: '💳', title: 'Online Payment',    sub: 'UPI, Credit/Debit Card, Net Banking' },
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setPayMethod(opt.id)}
                      className={`w-full text-left rounded-2xl border-2 p-4 transition-all ${
                        payMethod === opt.id
                          ? 'border-[#dc2626] bg-red-50 shadow-md'
                          : 'border-red-100 bg-white hover:border-red-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{opt.emoji}</span>
                        <div className="flex-1">
                          <p className="font-bold text-neutral-900 text-sm">{opt.title}</p>
                          <p className="text-neutral-400 text-xs mt-0.5">{opt.sub}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                          payMethod === opt.id ? 'border-[#dc2626] bg-[#dc2626]' : 'border-neutral-300'
                        }`}>
                          {payMethod === opt.id && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                <OrderSummary cartItems={cartItems} cartTotal={cartTotal} />

                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#171717] via-[#dc2626] to-[#b91c1c] text-red-50 font-bold text-sm py-3.5 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {loading ? (
                    <div className="flex items-center gap-2 text-red-100 font-bold">
                      <span>Placing Order...</span>
                    </div>
                  ) : (
                    <><Package size={16} /> Confirm Order — ₹{grandTotal(cartTotal)}</>
                  )}
                </button>
              </motion.div>
            )}

            {/* Step 2: Order Confirmation */}
            {step === 2 && confirmedOrder && (
              <motion.div
                key="step-confirm"
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="p-6 flex flex-col items-center text-center space-y-4"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 16, delay: 0.1 }}
                  className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center shadow-lg border-2 border-emerald-300"
                >
                  <CheckCircle2 size={46} className="text-emerald-600" strokeWidth={2} />
                </motion.div>

                <div>
                  <h2 className="text-2xl font-cinzel font-bold text-neutral-900 leading-tight">Order Confirmed!</h2>
                  <p className="text-emerald-700 font-bold text-sm mt-1">Order ID: #{confirmedOrder.orderId}</p>
                </div>

                <div className="bg-red-50/70 border border-red-200 rounded-2xl w-full px-4 py-3.5 text-left space-y-2">
                  {[
                    { label: 'Customer', value: form.name },
                    { label: 'Phone',    value: `+91 ${form.phone}` },
                    { label: 'Address',  value: [form.address, form.city, form.pincode].filter(Boolean).join(', ') },
                    { label: 'Payment',  value: confirmedOrder.paymentMethod },
                  ].map(row => (
                    <div key={row.label} className="flex justify-between text-xs text-neutral-600 items-start gap-2">
                      <span className="font-bold text-red-900 flex-shrink-0 w-20">{row.label}</span>
                      <span className="text-right flex-1 font-medium">{row.value}</span>
                    </div>
                  ))}
                  <div className="border-t border-red-200 pt-2 flex justify-between text-sm font-black text-neutral-900">
                    <span>Total Amount</span>
                    <span className="text-[#171717] font-extrabold">₹{grandTotal(cartTotal)}</span>
                  </div>
                </div>

                <p className="text-neutral-500 text-xs">
                  Thank you for choosing Katariya Auto Parts. Your order is being processed! ✨
                </p>

                <button
                  onClick={openWhatsApp}
                  className="w-full bg-[#25D366] hover:bg-[#1fb855] text-white font-bold text-sm py-3.5 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span className="text-base">💬</span> Track Order via WhatsApp
                </button>

                <button
                  onClick={handleClose}
                  className="w-full text-neutral-500 text-xs font-bold py-1 hover:text-[#dc2626] transition-colors"
                >
                  Return to Store →
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
