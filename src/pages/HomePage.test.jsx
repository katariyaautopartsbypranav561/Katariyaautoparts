import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { DataContext } from '../context/DataContext';
import { CartProvider } from '../context/CartContext';
import { AuthProvider } from '../context/AuthContext';
import HomePage from './HomePage';
import React from 'react';

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
  slides: [{ id: 1, heroImage: 'https://images.unsplash.com/photo-1509358271058-acd05cc93280' }],
  banners: [{ id: 1, mediaUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c', title: 'Special Festive Banner', subtitle: 'Great discounts', badge: 'DEAL' }],
  categories: [
    { label: 'Exotic Spices', emoji: '🌶️', img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d' },
    { label: 'Dry Fruits', emoji: '🌰', img: 'https://images.unsplash.com/photo-1509358271058-acd05cc93280' },
    { label: 'Gourmet Nuts', emoji: '🥜', img: 'https://images.unsplash.com/photo-1536591375315-1989565823e1' },
    { label: 'Healthy Seeds', emoji: '🌱', img: 'https://images.unsplash.com/photo-1514733670139-4d87a1941d55' },
    { label: 'Pure Ghee & Oils', emoji: '🧈', img: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108' },
    { label: 'Festive Gift Boxes', emoji: '🎁', img: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48' },
  ],
  deals: [{ id: 1, title: 'Kashmiri Saffron 1g', sub: '100% Mongra Grade A+', save: 'Flat 20% Off', bg: '#dbeafe', grad: 'from-red-500 to-red-700', badge: 'LIMITED', img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d' }],
  products: [
    { id: 'sp-1', name: 'Kashmiri Mongra Saffron 1g', category: 'Exotic Spices', price: 650, mrp: 799, rating: '4.9', reviews: 128, tag: 'ORGANIC', badge: 'Top Seller', img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d' },
    { id: 'df-1', name: 'Jumbo California Almonds 500g', category: 'Dry Fruits', price: 549, mrp: 699, rating: '4.8', reviews: 94, tag: 'ORGANIC', badge: 'Fresh Harvest', img: 'https://images.unsplash.com/photo-1509358271058-acd05cc93280' },
    { id: 'gn-1', name: 'Iranian Roasted Pistachios 250g', category: 'Gourmet Nuts', price: 499, mrp: 599, rating: '4.9', reviews: 76, tag: 'ORGANIC', badge: 'Lightly Salted', img: 'https://images.unsplash.com/photo-1536591375315-1989565823e1' },
    { id: 'hs-1', name: 'Organic Raw Chia Seeds 250g', category: 'Healthy Seeds', price: 199, mrp: 249, rating: '4.7', reviews: 52, tag: 'ORGANIC', badge: 'Omega 3 Boost', img: 'https://images.unsplash.com/photo-1514733670139-4d87a1941d55' },
    { id: 'pg-1', name: 'A2 Gir Cow Bilona Ghee 500ml', category: 'Pure Ghee & Oils', price: 1250, mrp: 1499, rating: '5.0', reviews: 210, tag: 'ORGANIC', badge: 'Traditional Bilona', img: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108' },
    { id: 'gb-1', name: 'Royal Velvet Dry Fruit Hamper', category: 'Festive Gift Boxes', price: 1899, mrp: 2299, rating: '4.9', reviews: 45, tag: 'ORGANIC', badge: 'Luxury Gift Box', img: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48' },
  ],
  frontendSettings: { storeName: 'Katariya Auto Parts' }
};

const renderHomePage = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <DataContext.Provider value={mockData}>
          <CartProvider>
            <HomePage />
          </CartProvider>
        </DataContext.Provider>
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('HomePage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders successfully without crashing', () => {
    renderHomePage();
    // Verify header or brand title exists
    expect(screen.getAllByAltText('Katariya Auto Parts')[0]).toBeInTheDocument();
  });

  it('renders initial data from DataContext', () => {
    renderHomePage();
    
    // QuickCategories section title
    expect(screen.getByText('Explore Category', { exact: false })).toBeInTheDocument();
    
    // Check product titles exist
    expect(screen.getAllByText('Kashmiri Mongra Saffron 1g')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Jumbo California Almonds 500g')[0]).toBeInTheDocument();
  });
});
