import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import AccountPage from './AccountPage';
import { CartProvider } from '../context/CartContext';
import { DataContext } from '../context/DataContext';
import * as AuthContextModule from '../context/AuthContext';

vi.mock('../context/AuthContext', async () => {
  const actual = await vi.importActual('../context/AuthContext');
  return {
    ...actual,
    useAuth: vi.fn()
  };
});

describe('AccountPage Component', () => {
  const renderWithProviders = (ui) => {
    return render(
      <MemoryRouter>
        <DataContext.Provider value={{ frontendSettings: { storeName: 'Katariya Auto Parts' } }}>
          <CartProvider>
            {ui}
          </CartProvider>
        </DataContext.Provider>
      </MemoryRouter>
    );
  };

  it('renders guest view by default', () => {
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: null,
      logout: vi.fn(),
      isAdmin: false
    });

    renderWithProviders(<AccountPage />);
    expect(screen.getByText('Welcome to Katariya Auto Parts')).toBeInTheDocument();
    expect(screen.getByText('Sign In Now')).toBeInTheDocument();
  });

  it('renders logged in view when user is authenticated', () => {
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: { name: 'Priya Sharma', email: 'priya.sharma@email.com', role: 'user' },
      logout: vi.fn(),
      isAdmin: false
    });

    renderWithProviders(<AccountPage />);
    
    // Should show logged in view
    expect(screen.getByText(/Namaste, Priya Sharma/i)).toBeInTheDocument();
    expect(screen.getByText('priya.sharma@email.com')).toBeInTheDocument();
  });
});
