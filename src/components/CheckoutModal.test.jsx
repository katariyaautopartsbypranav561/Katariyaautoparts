import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CheckoutModal from './CheckoutModal';
import { DataProvider } from '../context/DataContext';
import { AuthProvider } from '../context/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

describe('CheckoutModal', () => {
  it('renders checkout form correctly', () => {
    render(
      <GoogleOAuthProvider clientId="test">
        <AuthProvider>
          <DataProvider>
            <CheckoutModal 
              isOpen={true} 
              onClose={vi.fn()} 
              cartItems={[]} 
              cartTotal={0} 
              onOrderSuccess={vi.fn()} 
            />
          </DataProvider>
        </AuthProvider>
      </GoogleOAuthProvider>
    );
    
    expect(screen.getAllByText(/Checkout/i)[0]).toBeInTheDocument();
  });
});
