import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import BottomNav from './BottomNav';
import { CartProvider } from '../context/CartContext';
import { DataContext } from '../context/DataContext';

describe('BottomNav Component', () => {
  it('renders all navigation items', () => {
    render(
      <MemoryRouter>
        <DataContext.Provider value={{ frontendSettings: { storeName: 'Katariya Auto Parts' } }}>
          <CartProvider>
            <BottomNav />
          </CartProvider>
        </DataContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Catalogue')).toBeInTheDocument();
    expect(screen.getByText('Offers')).toBeInTheDocument();
    expect(screen.getByText('Garage')).toBeInTheDocument();
    expect(screen.getByText('Account')).toBeInTheDocument();
  });
});
