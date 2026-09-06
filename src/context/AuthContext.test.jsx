import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup, signOut, onAuthStateChanged, getAuth } from 'firebase/auth';

vi.mock('../firebase', () => ({
  auth: {},
  googleProvider: {}
}));

vi.mock('firebase/auth', () => ({
  signInWithPopup: vi.fn(),
  signOut: vi.fn(),
  onAuthStateChanged: vi.fn((auth, cb) => { cb(null); return () => {}; }),
  getAuth: vi.fn()
}));

function TestComponent() {
  const { user, isAdmin, loginWithGoogle, logout } = useAuth();
  return (
    <div>
      <div data-testid='user'>{user ? user.email : 'none'}</div>
      <div data-testid='admin'>{isAdmin ? 'yes' : 'no'}</div>
      <button onClick={() => loginWithGoogle()}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('provides default auth state', () => {
    render(<AuthProvider><TestComponent /></AuthProvider>);
    expect(screen.getByTestId('user')).toHaveTextContent('none');
    expect(screen.getByTestId('admin')).toHaveTextContent('no');
  });

  it('sets isAdmin true for fortunefood273', () => {
    onAuthStateChanged.mockImplementation((auth, cb) => {
      cb({ email: 'fortunefood273@gmail.com' });
      return () => {};
    });
    render(<AuthProvider><TestComponent /></AuthProvider>);
    expect(screen.getByTestId('admin')).toHaveTextContent('yes');
  });
});
