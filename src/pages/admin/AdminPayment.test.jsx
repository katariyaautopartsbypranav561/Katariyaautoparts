import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import AdminPayment from './AdminPayment';
import { DataContext } from '../../context/DataContext';
import { AuthProvider } from '../../context/AuthContext';

describe('AdminPayment', () => {
  it('renders payment settings correctly', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <DataContext.Provider value={{ frontendSettings: { razorpayKeyId: 'rzp_test_123' }, refreshData: () => {} }}>
            <AdminPayment />
          </DataContext.Provider>
        </AuthProvider>
      </BrowserRouter>
    );
    
    expect(screen.getByText('Payment Settings')).toBeInTheDocument();
    expect(screen.getByText(/How Razorpay works/i)).toBeInTheDocument();
  });
});
