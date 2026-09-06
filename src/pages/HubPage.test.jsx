import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import HubPage from './HubPage';
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

const renderWithContext = (ui) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <DataContext.Provider value={{ frontendSettings: { storeName: 'Katariya Auto Parts' } }}>
          <CartProvider>
            {ui}
          </CartProvider>
        </DataContext.Provider>
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('HubPage', () => {
  it('renders hub page header', () => {
    renderWithContext(<HubPage />);
    expect(screen.getByText(/Katariya Auto Parts Hub/i)).toBeInTheDocument();
  });

  it('renders featured article', () => {
    renderWithContext(<HubPage />);
    expect(screen.getByText('How to Maintain Your Motorcycle Chain for Longer Life')).toBeInTheDocument();
  });

  it('renders latest articles', () => {
    renderWithContext(<HubPage />);
    expect(screen.getByText('Top 7 Benefits of Using Synthetic Engine Oil in Superbikes')).toBeInTheDocument();
  });

  it('renders purity certification sidebar', () => {
    renderWithContext(<HubPage />);
    expect(screen.getByText('OEM Certification')).toBeInTheDocument();
  });
  
  it('can switch topic tabs', () => {
    renderWithContext(<HubPage />);
    const categoryTab = screen.getAllByText('Engine Oils')[0];
    fireEvent.click(categoryTab);
    
    expect(screen.getByText('Top 7 Benefits of Using Synthetic Engine Oil in Superbikes')).toBeInTheDocument();
  });
});
