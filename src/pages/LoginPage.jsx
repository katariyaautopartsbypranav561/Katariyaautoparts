import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { ChevronLeft, ArrowRight } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { loginWithGoogle } = useAuth();
  const { frontendSettings } = useData();
  const settings = frontendSettings || {};
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    
    try {
      await loginWithGoogle();
      navigate('/account');
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1c0c03] text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glowing red lights */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#dc2626]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#171717]/30 rounded-full blur-[140px] pointer-events-none" />
      
      <button 
        onClick={() => navigate(-1)} 
        className="absolute top-6 left-6 z-20 flex items-center gap-2 text-red-200 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-xl backdrop-blur-sm border border-red-400/20"
      >
        <ChevronLeft size={16} /> Back to Store
      </button>

      <ScrollReveal>
        <div className="w-full max-w-md relative z-10">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden border-2 border-red-400/40 p-2 shadow-2xl">
              <img src="/logo.png" alt="Katariya Auto Parts Logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="font-cinzel font-bold text-3xl text-red-100">
              Welcome to Katariya Auto Parts
            </h1>
            <p className="text-red-200/70 text-sm mt-2">
              Sign in securely to access orders & rider rewards.
            </p>
          </div>

          <div className="bg-[#2a1405]/90 border border-red-400/30 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden flex flex-col items-center">
            
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-xs text-center font-bold w-full mb-6">
                {error}
              </div>
            )}

            <button 
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full bg-white text-neutral-900 font-bold py-4 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-3 disabled:opacity-70 group"
            >
              {loading ? (
                'Authenticating...'
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    <path fill="none" d="M1 1h22v22H1z" />
                  </svg>
                  <span>Sign In with Google</span>
                  <ArrowRight size={16} className="text-neutral-400 group-hover:text-neutral-900 transition-colors ml-1" />
                </>
              )}
            </button>

            <div className="relative z-10 mt-6 text-center w-full">
              <p className="text-xs text-red-200/50 flex items-center justify-center gap-2">
                <span className="w-10 h-px bg-red-400/20 block" />
                100% Secure & Pure
                <span className="w-10 h-px bg-red-400/20 block" />
              </p>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
