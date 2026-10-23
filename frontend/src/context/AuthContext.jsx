import { createContext, useContext, useEffect, useState } from 'react';
import { api, authStorage } from '../api';

const AuthContext = createContext({
  user: null,
  token: '',
  loading: true,
  login: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authStorage.getUser());
  const [token, setToken] = useState(() => authStorage.getToken());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const existingToken = authStorage.getToken();
    if (existingToken) {
      api.me()
        .then((res) => {
          if (res?.user) {
            setUser(res.user);
            authStorage.setUser(res.user);
          }
        })
        .catch(() => {
          // Token expired or invalid
          setUser(null);
          setToken('');
          authStorage.clear();
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    const res = await api.login(username, password);
    if (res?.token && res?.user) {
      setToken(res.token);
      setUser(res.user);
      authStorage.setToken(res.token);
      authStorage.setUser(res.user);
      return res.user;
    }
    throw new Error('Login failed: Invalid server response');
  };

  const logout = () => {
    setUser(null);
    setToken('');
    authStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, isAuthenticated: !!token && !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
