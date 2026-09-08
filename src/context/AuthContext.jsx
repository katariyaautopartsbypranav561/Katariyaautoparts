import React, { createContext, useContext, useState, useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('katariya_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error(e);
      }
    }
    setLoading(false);
  }, []);

  const loginWithGoogle = useGoogleLogin({
    flow: 'implicit',
    onSuccess: async (tokenResponse) => {
      try {
        // Since implicit flow returns access_token, we can fetch user info from Google
        const userInfo = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
        );
        
        const googleUser = userInfo.data;
        
        // Sync with backend using the access token as a pseudo-JWT, 
        // OR better yet, just register the user directly.
        // Wait, implicit flow returns an access_token. To get an id_token, we need to pass `response_type: 'id_token'`. 
        // But let's just POST the user data directly to a mock registration or use the DB.
        
        const katariyaUser = {
          uid: googleUser.sub,
          displayName: googleUser.name,
          email: googleUser.email,
          photoURL: googleUser.picture,
          role: 'user'
        };
        
        try {
          await axios.post('/api/auth/register', {
            name: googleUser.name,
            email: googleUser.email
          }, {
            headers: {
              // Send the real Google access_token to the backend for verification
              Authorization: `Bearer ${tokenResponse.access_token}`
            }
          });
        } catch(e) {
          console.warn('Backend sync failed, continuing locally', e);
        }

        setUser(katariyaUser);
        localStorage.setItem('katariya_user', JSON.stringify(katariyaUser));
        return katariyaUser;
      } catch (err) {
        console.error('Failed to fetch user profile', err);
        throw err;
      }
    },
    onError: errorResponse => {
      console.error('Google Sign In Failed', errorResponse);
      throw new Error('Google Sign In Failed');
    },
  });

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('katariya_user');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loginWithGoogle, 
      logout,
      isAuthenticated: !!user,
      isAdmin: user?.email === 'admin@katariya.com'
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
