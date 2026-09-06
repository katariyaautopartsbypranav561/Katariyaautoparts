import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import AdminOrders from './AdminOrders';
import { DataContext } from '../../context/DataContext';
import { CartProvider } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';

vi.mock('axios');

vi.mock('../../firebase', () => ({ auth: {} }));
vi.mock('firebase/auth', () => ({
  onAuthStateChanged: vi.fn((auth, cb) => { cb(null); return vi.fn(); }),
  signInWithPopup: vi.fn(),
  signOut: vi.fn(),
  getAuth: vi.fn()
}));

const sampleOrders = [
  {
    id: 'o1',
    customerName: 'Ravi Sharma',
    phone: '9876543210',
    address: '123 MG Road, Bangalore',
    items: JSON.stringify([{ id: 1, name: 'Sample Item', qty: 2, price: 499 }]),
    total: 998,
    paymentMethod: 'COD',
    paymentStatus: 'PENDING',
    status: 'PENDING',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'o2',
    customerName: 'Priya Singh',
    phone: '9123456789',
    address: '45 Park Street, Mumbai',
    items: JSON.stringify([{ id: 2, name: 'Sample Item 2', qty: 1, price: 299 }]),
    total: 299,
    paymentMethod: 'ONLINE',
    paymentStatus: 'PAID',
    status: 'CONFIRMED',
    createdAt: new Date().toISOString(),
  }
];

const mockAuthValue = {
  user: { email: 'fortunefood273@gmail.com' },
  isAdmin: true,
  loginWithGoogle: vi.fn(),
  logout: vi.fn(),
};

const renderAdminOrders = () => render(
  <BrowserRouter>
    <AuthContext.Provider value={mockAuthValue}>
      <DataContext.Provider value={{ frontendSettings: {}, loading: false }}>
        <CartProvider>
          <AdminOrders />
        </CartProvider>
      </DataContext.Provider>
    </AuthContext.Provider>
  </BrowserRouter>
);

describe('AdminOrders', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders orders list with customer names', async () => {
    axios.get.mockResolvedValueOnce({ data: sampleOrders });
    renderAdminOrders();

    await waitFor(() => {
      expect(screen.queryAllByText(/Ravi Sharma/i).length).toBeGreaterThan(0);
      expect(screen.queryAllByText(/Priya Singh/i).length).toBeGreaterThan(0);
    });
  });

  it('displays order totals correctly', async () => {
    axios.get.mockResolvedValueOnce({ data: sampleOrders });
    renderAdminOrders();

    await waitFor(() => {
      expect(screen.queryAllByText(/998/i).length).toBeGreaterThan(0);
      expect(screen.queryAllByText(/299/i).length).toBeGreaterThan(0);
    });
  });
});
