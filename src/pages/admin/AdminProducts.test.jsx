import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { DataContext } from '../../context/DataContext';
import { CartProvider } from '../../context/CartContext';
import AdminProducts from './AdminProducts';
import React, { useState } from 'react';

const initialProducts = [
  { id: 1, name: 'Premium Jumbo California Almonds', brand: 'Katariya Auto Parts', price: 649, mrp: 849, badge: '⭐ Customer Choice', category: 'Dry Fruits', img: '' },
  { id: 2, name: 'Royal Whole King Cashews (W240)', brand: 'Katariya Auto Parts', price: 799, mrp: 999, badge: '🔥 Hot Selling', category: 'Dry Fruits', img: '' }
];

function MockDataProvider({ children }) {
  const [products, setProducts] = useState(initialProducts);
  const refreshData = vi.fn();
  return (
    <DataContext.Provider value={{ products, setProducts, categories: [], loading: false, refreshData }}>
      {children}
    </DataContext.Provider>
  );
}

const renderAdminProducts = () => {
  return render(
    <BrowserRouter>
      <MockDataProvider>
        <CartProvider>
          <AdminProducts />
        </CartProvider>
      </MockDataProvider>
    </BrowserRouter>
  );
};

describe('AdminProducts', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    global.confirm = vi.fn(() => true); // Mock window.confirm to return true
  });

  it('renders existing products from context', () => {
    renderAdminProducts();
    expect(screen.getByText('Products', { selector: 'h2' })).toBeInTheDocument();
    expect(screen.getByText('Premium Jumbo California Almonds')).toBeInTheDocument();
  });

  it('can open modal to add a new product and save it', async () => {
    renderAdminProducts();
    
    // Open modal
    await act(async () => {
      fireEvent.click(screen.getByText('Add Product'));
    });
    
    expect(screen.getByText('Add New Product', { selector: 'h3' })).toBeInTheDocument();
    
    // Fill form
    const nameInput = screen.getByLabelText(/Product Name/i);
    const brandInput = screen.getByLabelText(/Brand/i);
    const priceInput = screen.getByLabelText(/Selling Price/i);
    const mrpInput = screen.getByLabelText(/MRP/i);
    const imgInput = screen.getByLabelText(/Primary Image/i);
    const categoryInput = screen.getByLabelText(/Category/i);
    
    await act(async () => {
      fireEvent.change(nameInput, { target: { value: 'Test Product 123' } });
      fireEvent.change(brandInput, { target: { value: 'Katariya Auto Parts' } });
      fireEvent.change(categoryInput, { target: { value: 'Brakes' } });
      fireEvent.change(priceInput, { target: { value: '100' } });
      fireEvent.change(mrpInput, { target: { value: '150' } });
      fireEvent.change(imgInput, { target: { value: 'http://test.img' } });
    });
    
    // Save
    await act(async () => {
      fireEvent.submit(screen.getByText('Create Product').closest('form'));
      await new Promise(r => setTimeout(r, 50));
    });
    
    // Verify it was added to table
    expect(screen.queryByText('Add New Product', { selector: 'h3' })).not.toBeInTheDocument();
    expect(screen.getByText('Test Product 123')).toBeInTheDocument();
  });

  it('can edit an existing product', async () => {
    renderAdminProducts();
    
    // Find first product edit button by its test id
    const editButton = screen.getByTestId('edit-btn-1');
    
    await act(async () => {
      fireEvent.click(editButton);
    });
    
    expect(screen.getByText('Edit Product', { selector: 'h3' })).toBeInTheDocument();
    
    // Change name
    const nameInput = screen.getByLabelText(/Product Name/i);
    await act(async () => {
      fireEvent.change(nameInput, { target: { value: 'Updated California Almonds' } });
      fireEvent.submit(screen.getByText('Save Changes').closest('form'));
      await new Promise(r => setTimeout(r, 50));
    });
    
    // Verify update
    expect(screen.getByText('Updated California Almonds')).toBeInTheDocument();
  });

  it('can delete an existing product', async () => {
    renderAdminProducts();
    
    expect(screen.getByText('Royal Whole King Cashews (W240)')).toBeInTheDocument();
    
    // Cashews is ID 2
    const deleteButton = screen.getByTestId('del-btn-2');
    
    // Click delete on second product
    await act(async () => {
      fireEvent.click(deleteButton);
      await new Promise(r => setTimeout(r, 50));
    });
    
    expect(global.confirm).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('Royal Whole King Cashews (W240)')).not.toBeInTheDocument();
  });
});
