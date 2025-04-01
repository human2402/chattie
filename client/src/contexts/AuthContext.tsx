import { createContext, useContext, useState, ReactNode } from 'react';

interface Manager {
  id: number;
  login: string;
  firstName: string;
  lastName: string;
  position: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  manager: Manager | null;
  login: (token: string, manager: Manager) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const isTokenValid = (token: string) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  };
  
  // Update the initial state check
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem('authToken');
    return token ? isTokenValid(token) : false;
  });

  const [manager, setManager] = useState<Manager | null>(() => {
    // Retrieve manager info from localStorage if available
    const storedManager = localStorage.getItem('manager');
    return storedManager ? JSON.parse(storedManager) : null;
  });

  const login = (token: string, manager: Manager) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('manager', JSON.stringify(manager)); // Store manager info
    setIsAuthenticated(true);
    setManager(manager);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('manager'); // Clear manager info
    setIsAuthenticated(false);
    setManager(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, manager, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);