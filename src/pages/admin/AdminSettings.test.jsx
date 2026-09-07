import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { expect, test, vi } from 'vitest';
import AdminSettings from './AdminSettings';
import { DataContext } from '../../context/DataContext';
import { CartProvider } from '../../context/CartContext';
import axios from 'axios';

vi.mock('axios');

// Mock matchMedia
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

const mockSetFrontendSettings = vi.fn();

const renderAdminSettings = () => {
  return render(
    <BrowserRouter>
      <DataContext.Provider value={{ frontendSettings: { storeName: 'Katariya Auto Parts', tagline: 'Promise of Purity', logoChar: 'F' }, setFrontendSettings: mockSetFrontendSettings }}>
        <CartProvider>
          <AdminSettings />
        </CartProvider>
      </DataContext.Provider>
    </BrowserRouter>
  );
};

test('renders settings form correctly', () => {
  renderAdminSettings();
  expect(screen.getByText('Frontend Settings')).toBeInTheDocument();
  expect(screen.getByDisplayValue('Katariya Auto Parts')).toBeInTheDocument();
});

test('changes tabs and updates form data', async () => {
  axios.put.mockResolvedValue({ data: { success: true } });
  renderAdminSettings();
  
  // Update general info
  const storeNameInput = screen.getByDisplayValue('Katariya Auto Parts');
  fireEvent.change(storeNameInput, { target: { value: 'Katariya Auto Parts Pure' } });
  
  // Switch tab
  const footerTab = screen.getByText('Footer & Text');
  fireEvent.click(footerTab);
  expect(screen.getByText('Footer Description')).toBeInTheDocument();
  
  // Switch back and save
  const generalTab = screen.getByText('General Info');
  fireEvent.click(generalTab);
  
  const saveBtn = screen.getByRole('button', { name: /Save Changes/i });
  fireEvent.click(saveBtn);
  
  await waitFor(() => {
    expect(mockSetFrontendSettings).toHaveBeenCalledWith(expect.objectContaining({
      storeName: 'Katariya Auto Parts Pure',
      tagline: 'Promise of Purity'
    }));
  });
});
