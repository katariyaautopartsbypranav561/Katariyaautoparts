import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Header from './Header';
import { CartProvider } from '../context/CartContext';
import { AuthProvider } from '../context/AuthContext';
import { DataContext } from '../context/DataContext';

// Mock matchMedia if not supported by jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe('Header Component', () => {
  const renderWithProviders = (ui) => {
    return render(
      <MemoryRouter>
        <AuthProvider>
          <DataContext.Provider value={{ frontendSettings: { storeName: 'Katariya Auto Parts' }, products: [] }}>
            <CartProvider>
              {ui}
            </CartProvider>
          </DataContext.Provider>
        </AuthProvider>
      </MemoryRouter>
    );
  };

  it('renders the logo and brand name', () => {
    renderWithProviders(<Header />);
    expect(screen.getByAltText('Katariya Auto Parts')).toBeInTheDocument();
  });

  it('renders desktop navigation links', () => {
    renderWithProviders(<Header />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Store Catalogue')).toBeInTheDocument();
    expect(screen.getByText('Deals & Offers')).toBeInTheDocument();
    expect(screen.getByText('Contact Us')).toBeInTheDocument();
    expect(screen.getByText('My Account')).toBeInTheDocument();
  });

  it('updates search query input', () => {
    renderWithProviders(<Header />);
    const searchInput = screen.getByPlaceholderText(/Search/i);
    fireEvent.change(searchInput, { target: { value: 'Engine Oil' } });
    expect(searchInput.value).toBe('Engine Oil');
  });
});
