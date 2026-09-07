import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

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
    localStorage.clear();
  });

  it('provides default auth state', () => {
    render(
      <GoogleOAuthProvider clientId="test-client-id">
        <AuthProvider><TestComponent /></AuthProvider>
      </GoogleOAuthProvider>
    );
    expect(screen.getByTestId('user')).toHaveTextContent('none');
    expect(screen.getByTestId('admin')).toHaveTextContent('no');
  });
});
