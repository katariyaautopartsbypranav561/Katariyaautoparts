import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'

// ── Global scroll-in-view observer ──
// Watches every <section> and .animate-section on any page.
// Adds "in-view" class as they enter the viewport, triggering CSS animations.
function setupScrollObserver() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target); // animate once, then stop watching
        }
      });
    },
    { threshold: 0.06, rootMargin: '0px 0px -40px 0px' }
  );

  const observe = () => {
    document.querySelectorAll('section:not(.in-view), .animate-section:not(.in-view)')
      .forEach((el) => observer.observe(el));
  };

  // Initial pass
  observe();

  // Re-scan on every navigation (SPA route change) using MutationObserver
  const mutationObs = new MutationObserver(observe);
  mutationObs.observe(document.body, { childList: true, subtree: true });
}

// Run after first paint
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', setupScrollObserver);
  // Fallback: also run after a short delay in case DOMContentLoaded already fired
  setTimeout(setupScrollObserver, 100);
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
