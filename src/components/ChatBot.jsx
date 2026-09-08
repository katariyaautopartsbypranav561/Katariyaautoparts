import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, X, Send, Sparkles, ShieldCheck } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function ChatBot() {
  const { user, loginWithGoogle, isAuthenticated } = useAuth();
  const { frontendSettings } = useData();
  const settings = frontendSettings || {};
  const navigate = useNavigate();
  
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [step, setStep] = useState('INITIAL');
  
  const [capturedName, setCapturedName] = useState('');
  const [capturedContact, setCapturedContact] = useState('');
  const [authMode, setAuthMode] = useState('');
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Auto-open chatbot assistant after 20 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen((prev) => prev || true);
    }, 20000);
    return () => clearTimeout(timer);
  }, []);

  // Initialize greeting
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      if (isAuthenticated) {
        setStep('MAIN_MENU');
        setMessages([
          { sender: 'bot', text: `Welcome back to Katariya Auto Parts, ${user?.name?.split(' ')[0]}! ✨ How can I assist you with your spare parts or accessories today?`, isMenu: true }
        ]);
      } else {
        setStep('ASK_NAME');
        setMessages([
          { sender: 'bot', text: `Greetings! I am your Katariya Auto Parts Assistant. May I know your name to recommend our genuine spare parts?` }
        ]);
      }
    }
  }, [isOpen, isAuthenticated, user, messages.length]);

  const addMessage = (text, sender, isMenu = false) => {
    setMessages(prev => [...prev, { text, sender, isMenu }]);
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    const input = inputValue.trim();
    setInputValue('');

    if (step === 'VERIFY_AUTH') {
      addMessage('••••••••', 'user');
    } else {
      addMessage(input, 'user');
    }

    if (step === 'ASK_NAME') {
      setCapturedName(input);
      setStep('MAIN_MENU');
      addMessage(`Pleasure to meet you, ${input}! How can I serve you today?`, 'bot', true);
      return;
    }
  };

  const handleMenuAction = (action) => {
    if (action === 'shop') {
      navigate('/category');
      setIsOpen(false);
    } else if (action === 'fitment') {
      navigate('/hub');
      setIsOpen(false);
    } else if (action === 'offers') {
      navigate('/offers');
      setIsOpen(false);
    } else if (action === 'track') {
      navigate('/account');
      setIsOpen(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      setStep('MAIN_MENU');
      addMessage("You are successfully logged in! How can I serve you today?", 'bot', true);
    } catch (err) {
      addMessage(err.message + ". Please try again.", 'bot');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ── MOBILE: bottom-sheet overlay ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 z-[200] bg-black/40 backdrop-blur-sm flex flex-col justify-end"
            onClick={(e) => { if (e.target === e.currentTarget) setIsOpen(false); }}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              className="w-full bg-white rounded-t-3xl overflow-hidden flex flex-col"
              style={{ height: '75vh' }}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-[#171717] via-[#dc2626] to-[#b91c1c] p-4 flex items-center justify-between shadow-md flex-shrink-0 w-full overflow-hidden">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 min-w-9 min-h-9 rounded-full border-2 border-red-300 bg-white p-0.5 flex items-center justify-center overflow-hidden flex-shrink-0">
                    <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-red-50 font-bold leading-tight font-cinzel text-sm truncate">Katariya Auto Parts Assistant</h3>
                    <p className="text-red-200 text-[10px] uppercase font-bold tracking-wider flex items-center gap-1 truncate">
                      <ShieldCheck size={11} className="text-emerald-400 flex-shrink-0" /> <span className="truncate">100% Genuine</span>
                    </p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-red-100 hover:text-white p-1 bg-black/20 rounded-full flex-shrink-0 ml-2">
                  <X size={18} />
                </button>
              </div>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 bg-red-50/40 flex flex-col gap-3">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${msg.sender === 'user' ? 'bg-[#171717] text-red-100 font-medium' : 'bg-white border border-red-200/80 text-neutral-800'}`}>
                      {msg.text}
                      {msg.isMenu && (
                        <div className="mt-3 flex flex-col gap-2">
                          {[['🛒','shop','Shop Auto Parts'],['✨','fitment','Part Fitment Guide'],['🎁','offers','Festive Offers & Bundles'],['📦','track','Track My Order']].map(([emoji, action, label]) => (
                            <button key={action} onClick={() => handleMenuAction(action)} className="w-full bg-red-50 hover:bg-red-100 text-[#171717] border border-red-200 py-2 px-3 rounded-xl text-xs font-bold text-left flex items-center gap-2 transition-colors">
                              <span>{emoji}</span> {label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-red-200 p-3 rounded-2xl flex items-center gap-2">
                      {[0, 0.15, 0.3].map((d, i) => <div key={i} className="w-2 h-2 bg-[#dc2626] rounded-full animate-bounce" style={{ animationDelay: `${d}s` }} />)}
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              {/* Input */}
              {step !== 'MAIN_MENU' && (
                <div className="p-3 bg-white border-t border-red-200 flex-shrink-0 pb-[env(safe-area-inset-bottom)]">
                  <div className="flex items-center gap-2">
                    <input type={step === 'VERIFY_AUTH' ? 'password' : 'text'} value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} disabled={loading} placeholder={step === 'VERIFY_AUTH' ? 'Enter password...' : 'Type your message...'} className="flex-1 bg-red-50/50 border border-red-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#dc2626] disabled:opacity-50" />
                    <button onClick={handleSend} disabled={!inputValue.trim() || loading} className="bg-[#dc2626] text-white p-2.5 rounded-xl disabled:opacity-50 shadow-md"><Send size={18} /></button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── DESKTOP: floating popup ── */}
      <div className="hidden md:block fixed bottom-6 right-5 z-[110]">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-16 right-0 w-96 bg-white rounded-3xl shadow-2xl overflow-hidden border border-red-200 flex flex-col"
              style={{ height: '520px', maxHeight: '82vh' }}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-[#171717] via-[#dc2626] to-[#b91c1c] p-4 flex items-center justify-between shadow-md w-full overflow-hidden">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 min-w-9 min-h-9 rounded-full border-2 border-red-300 bg-white p-0.5 flex items-center justify-center overflow-hidden flex-shrink-0">
                    <img src="/logo.png" alt="Katariya Auto Parts Logo" className="w-full h-full object-contain" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-red-50 font-bold leading-tight font-cinzel text-sm truncate">Katariya Auto Parts Assistant</h3>
                    <p className="text-red-200 text-[10px] uppercase font-bold tracking-wider flex items-center gap-1 truncate">
                      <ShieldCheck size={11} className="text-emerald-400 flex-shrink-0" /> <span className="truncate">100% Genuine</span>
                    </p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-red-100 hover:text-white transition-colors p-1 bg-black/20 rounded-full hover:bg-black/40 flex-shrink-0 ml-2">
                  <X size={18} />
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 bg-red-50/40 flex flex-col gap-3.5">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm shadow-sm ${msg.sender === 'user' ? 'bg-[#171717] text-red-100 rounded-tr-xs font-medium' : 'bg-white border border-red-200/80 text-neutral-800 rounded-tl-xs'}`}>
                      {msg.text}
                      {msg.isMenu && (
                        <div className="mt-3 flex flex-col gap-2">
                          <button onClick={() => handleMenuAction('shop')} className="w-full bg-red-50 hover:bg-red-100 text-[#171717] border border-red-200 py-2 px-3 rounded-xl text-xs font-bold transition-colors text-left flex items-center gap-2">
                            <span>🌰</span> Shop Auto Parts
                          </button>
                          <button onClick={() => handleMenuAction('fitment')} className="w-full bg-red-50 hover:bg-red-100 text-[#171717] border border-red-200 py-2 px-3 rounded-xl text-xs font-bold transition-colors text-left flex items-center gap-2">
                            <span>✨</span> Part Fitment Guide
                          </button>
                          <button onClick={() => handleMenuAction('offers')} className="w-full bg-red-50 hover:bg-red-100 text-[#171717] border border-red-200 py-2 px-3 rounded-xl text-xs font-bold transition-colors text-left flex items-center gap-2">
                            <span>🎁</span> Festive Offers & Bundles
                          </button>
                          <button onClick={() => handleMenuAction('track')} className="w-full bg-red-50 hover:bg-red-100 text-[#171717] border border-red-200 py-2 px-3 rounded-xl text-xs font-bold transition-colors text-left flex items-center gap-2">
                            <span>📦</span> Track My Order
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-red-200 p-3 rounded-2xl rounded-tl-xs shadow-sm flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#dc2626] rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-[#dc2626] rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                      <div className="w-2 h-2 bg-[#dc2626] rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              {step !== 'MAIN_MENU' && (
                <div className="p-3.5 bg-white border-t border-red-200">
                  <div className="flex items-center gap-2">
                    <input
                      type={step === 'VERIFY_AUTH' ? 'password' : 'text'}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      disabled={loading}
                      placeholder={step === 'VERIFY_AUTH' ? "Enter password..." : "Type your message..."}
                      className="flex-1 bg-red-50/50 border border-red-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#dc2626] transition-all disabled:opacity-50"
                    />
                    <button
                      onClick={handleSend}
                      disabled={!inputValue.trim() || loading}
                      className="bg-[#dc2626] hover:bg-[#b91c1c] text-white p-2.5 rounded-xl transition-colors disabled:opacity-50 shadow-md"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* WhatsApp direct line */}
        {!isOpen && (
          <a
            href="https://wa.me/919876543210?text=Hi%20Katariya%20Auto%20Parts%2C%20I%20need%20help%20finding%20a%20spare%20part"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-[72px] right-1 w-12 h-12 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
            aria-label="Chat on WhatsApp"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M12.031 0C5.38 0 0 5.383 0 12.037c0 2.128.552 4.195 1.6 6.02L.15 23.4l5.485-1.439a11.967 11.967 0 006.396 1.836h.005c6.648 0 12.032-5.385 12.032-12.04C24 5.378 18.681 0 12.031 0zm0 21.8c-1.8 0-3.565-.483-5.11-1.397l-.367-.217-3.8.995 1.016-3.7-.238-.38A9.97 9.97 0 012.035 12.04c0-5.508 4.484-9.995 9.996-9.995 5.512 0 9.994 4.487 9.994 9.995 0 5.51-4.482 9.995-9.994 9.995v.001l-.001-.236zm5.486-7.502c-.302-.151-1.785-.882-2.062-.982-.278-.1-.48-.152-.682.15-.202.302-.783.982-.96 1.182-.176.202-.353.228-.655.076-1.503-.761-2.614-1.424-3.626-2.923-.255-.378-.026-.583.125-.733.136-.135.302-.352.453-.527.151-.177.202-.303.303-.504.1-.202.05-.378-.025-.528-.076-.151-.682-1.641-.934-2.247-.246-.593-.497-.512-.682-.522-.176-.008-.378-.008-.58-.008s-.53.076-.807.378c-.278.303-1.06 1.034-1.06 2.52s1.085 2.923 1.236 3.125c.15.202 2.13 3.25 5.158 4.557 2.052.887 2.872 1.004 3.93 1.004.832 0 2.552-.983 2.898-1.921.346-.94.346-1.745.245-1.921-.1-.176-.378-.278-.68-.428z" />
            </svg>
          </a>
        )}

        {/* Toggle FAB */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 bg-gradient-to-tr from-[#171717] to-[#dc2626] text-red-200 rounded-full flex items-center justify-center shadow-2xl hover:shadow-[0_0_25px_rgba(245,158,11,0.5)] transition-all transform hover:scale-105 active:scale-95 border-2 border-red-300 relative z-10"
        >
          {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        </button>
      </div>

      {/* ── MOBILE FAB button (separate, above bottom nav) ── */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed bottom-20 right-4 z-[110] w-13 h-13 w-12 h-12 bg-gradient-to-tr from-[#171717] to-[#dc2626] text-white rounded-full flex items-center justify-center shadow-2xl border-2 border-red-300 active:scale-90 transition-transform"
        aria-label="Open chat assistant"
      >
        <MessageSquare size={22} />
      </button>
    </>
  );
}
