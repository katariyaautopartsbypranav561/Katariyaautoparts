import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import OffersPage from './OffersPage';
import { CartProvider } from '../context/CartContext';
import { DataContext } from '../context/DataContext';
import { AuthProvider } from '../context/AuthContext';

// Mock matchMedia for jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn().mockResolvedValue(),
  },
});

const renderWithContext = (ui) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <DataContext.Provider value={{ products: [], categories: [], deals: [], banners: [], frontendSettings: { storeName: 'Katariya Auto Parts' } }}>
          <CartProvider>
            {ui}
          </CartProvider>
        </DataContext.Provider>
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('OffersPage', () => {
  it('renders offer zone header', () => {
    renderWithContext(<OffersPage />);
    expect(screen.getByText(/Auto Parts Offers & Bundles/i)).toBeInTheDocument();
  });

  it('renders active coupons', () => {
    renderWithContext(<OffersPage />);
    expect(screen.getByText('FESTIVE HARVEST')).toBeInTheDocument();
    expect(screen.getByText('FESTIVE25')).toBeInTheDocument();
  });

  it('renders flash sale products', () => {
    renderWithContext(<OffersPage />);
    expect(screen.getAllByText(/Full Face Helmet/i)[0]).toBeInTheDocument();
  });

  it('copies coupon code when clicked', async () => {
    renderWithContext(<OffersPage />);
    
    const codeElement = screen.getByText('FESTIVE25');
    const container = codeElement.closest('div');
    const copyButton = container.querySelector('button');
    
    fireEvent.click(copyButton);
    
    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('FESTIVE25');
    });
  });
});
