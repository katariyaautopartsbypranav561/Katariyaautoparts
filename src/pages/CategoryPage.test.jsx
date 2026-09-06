import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import CategoryPage from './CategoryPage';
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
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

const mockData = {
  categories: [
    { label: 'Exotic Spices', emoji: '🌶️', img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d' },
    { label: 'Dry Fruits', emoji: '🌰', img: 'https://images.unsplash.com/photo-1509358271058-acd05cc93280' },
  ],
  products: [
    { id: 'sp-1', name: 'Kashmiri Mongra Saffron 1g', category: 'Exotic Spices', brand: 'Fortune Harvest', price: 650, mrp: 799, rating: '4.9', reviews: 128, tag: 'ORGANIC', img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d' },
    { id: 'df-1', name: 'Jumbo California Almonds 500g', category: 'Dry Fruits', brand: 'Fortune Pantry', price: 549, mrp: 699, rating: '4.8', reviews: 94, tag: 'ORGANIC', img: 'https://images.unsplash.com/photo-1509358271058-acd05cc93280' },
  ],
  loading: false,
};

const renderWithContext = (ui) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <DataContext.Provider value={mockData}>
          <CartProvider>
            {ui}
          </CartProvider>
        </DataContext.Provider>
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('CategoryPage', () => {
  it('renders store catalogue header', () => {
    renderWithContext(<CategoryPage />);
    expect(screen.getByText('Katariya Auto Parts Store Catalogue')).toBeInTheDocument();
  });

  it('renders products', () => {
    renderWithContext(<CategoryPage />);
    expect(screen.getByText('Kashmiri Mongra Saffron 1g')).toBeInTheDocument();
    expect(screen.getByText('Jumbo California Almonds 500g')).toBeInTheDocument();
  });

  it('can filter products by category tab', () => {
    renderWithContext(<CategoryPage />);
    const spicesBtn = screen.getAllByText(/Exotic Spices/i)[0];
    fireEvent.click(spicesBtn);
    expect(screen.getByText('Kashmiri Mongra Saffron 1g')).toBeInTheDocument();
  });
});
