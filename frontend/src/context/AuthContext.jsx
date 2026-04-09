import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from token on startup
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      setUser({ ...JSON.parse(storedUser), isAuthenticated: true });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser({ ...data.user, isAuthenticated: true });
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser({ ...data.user, isAuthenticated: true });
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) {
     return <div>Loading...</div>; // Prevent flash of unauthorized content
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
