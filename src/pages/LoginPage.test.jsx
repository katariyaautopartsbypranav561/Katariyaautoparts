import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from './LoginPage';
import { AuthProvider } from '../context/AuthContext';
import { DataContext } from '../context/DataContext';

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    loginWithGoogle: vi.fn(),
    error: null,
    loading: false
  }),
  AuthProvider: ({ children }) => <div>{children}</div>
}));

describe('LoginPage', () => {
  it('renders sign in button', () => {
    render(
      <BrowserRouter>
        <DataContext.Provider value={{ frontendSettings: { storeName: 'Katariya Auto Parts' } }}>
          <LoginPage />
        </DataContext.Provider>
      </BrowserRouter>
    );
    expect(screen.getByText(/Sign in with Google/i)).toBeInTheDocument();
  });
});
