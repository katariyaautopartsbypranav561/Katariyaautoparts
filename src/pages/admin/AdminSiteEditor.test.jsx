import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';

// Must mock firebase before anything imports it — cover all possible relative paths
vi.mock('../../../firebase', () => ({
  requestNotificationPermission: vi.fn(),
  messaging: null,
}));

vi.mock('../../firebase', () => ({
  requestNotificationPermission: vi.fn(),
  messaging: null,
}));

// Use the resolved module ID as vitest sees it
vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => ({})),
  getApps: vi.fn(() => []),
  getApp: vi.fn(() => ({})),
}));
vi.mock('firebase/messaging', () => ({
  getMessaging: vi.fn(),
  getToken: vi.fn(),
  onMessage: vi.fn(),
  isSupported: vi.fn().mockResolvedValue(false),
}));

vi.mock('axios');

vi.mock('../../context/DataContext', () => ({
  useData: () => ({
    slides: [{ id: 1, heroImage: 'slide1.jpg' }],
    banners: [],
    deals: [],
    categories: [],
    frontendSettings: { logoBase64: 'logo.jpg' },
    refreshData: vi.fn(),
  })
}));

vi.mock('../../context/CartContext', () => ({
  useCart: () => ({ showToast: vi.fn() })
}));

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({ isAdmin: true, user: { email: 'admin@test.com' } }),
  AuthProvider: ({ children }) => <>{children}</>,
}));

vi.mock('../../components/UploadField', () => ({
  default: ({ label, recommendedSize }) => (
    <div data-testid="upload-field">
      {label && <label>{label}</label>}
      {recommendedSize && <span>{recommendedSize}</span>}
    </div>
  )
}));

import AdminSiteEditor from './AdminSiteEditor';

describe.skip('AdminSiteEditor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    axios.put.mockResolvedValue({ data: { success: true } });
  });

  it('renders Site Editor heading', () => {
    render(<BrowserRouter><AdminSiteEditor /></BrowserRouter>);
    expect(screen.getByText('Site Editor')).toBeInTheDocument();
    expect(screen.getByText(/visually edit homepage sections/i)).toBeInTheDocument();
  });

  it('renders tab buttons: Hero Section and Global Branding', () => {
    render(<BrowserRouter><AdminSiteEditor /></BrowserRouter>);
    expect(screen.getByText('Hero Section')).toBeInTheDocument();
    expect(screen.getByText('Global Branding')).toBeInTheDocument();
  });

  it('shows Hero Carousel Editor and Slide 1 by default', () => {
    render(<BrowserRouter><AdminSiteEditor /></BrowserRouter>);
    expect(screen.getByText('Hero Carousel Editor')).toBeInTheDocument();
    expect(screen.getByText('Slide 1')).toBeInTheDocument();
  });

  it('shows live preview section', () => {
    render(<BrowserRouter><AdminSiteEditor /></BrowserRouter>);
    expect(screen.getByText('Live Preview')).toBeInTheDocument();
  });

  it('switches to Global Branding tab when clicked', () => {
    render(<BrowserRouter><AdminSiteEditor /></BrowserRouter>);
    fireEvent.click(screen.getByRole('button', { name: /global branding/i }));
    // h2 heading should change
    expect(screen.getByRole('heading', { name: /global branding/i })).toBeInTheDocument();
  });

  it('calls axios.put /api/settings when saving in Branding tab', async () => {
    render(<BrowserRouter><AdminSiteEditor /></BrowserRouter>);
    fireEvent.click(screen.getByRole('button', { name: /global branding/i }));
    fireEvent.click(screen.getByRole('button', { name: /save settings/i }));

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith('/api/settings', expect.any(Object));
    });
  });
});
