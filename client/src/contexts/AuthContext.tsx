import { createContext, useContext, useState, ReactNode } from 'react';
import forge from 'node-forge';

interface User {
  id: number;
  login: string;
  firstName: string;
  lastName: string;
  position: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  publicKeyPem: string | null;
  privateKeyPem: string | null; // decrypted in-memory only
  decryptPrivateKey: (encryptedKey: string, password: string) => void;
  generateAndStoreKeys: (password: string) => Promise<void>;
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

  const [user, setUser] = useState<User | null>(() => {
    // Retrieve user info from localStorage if available
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = (token: string, user: User) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user)); // Store user info
    setIsAuthenticated(true);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user'); // Clear user info
    setIsAuthenticated(false);
    setUser(null);
  };

  //            //
  // keys Stuff //
  //            //

  const generateAndStoreKeys = async (password: string) => {
    // Check if keys already exist
    const existingPrivateKey = localStorage.getItem('privateKeyPem')
    if (existingPrivateKey) {
      console.log('Private key already exists')
      return
    }

    // Generate key pair
    const keypair = forge.pki.rsa.generateKeyPair({ bits: 2048, e: 0x10001 })
    const publicKeyPem = forge.pki.publicKeyToPem(keypair.publicKey)
    const privateKeyPem = forge.pki.privateKeyToPem(keypair.privateKey)

    

    // Send public key to server
    try {
      const res = await fetch(`/api/users/${user.id}/public-key`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({ publicKey: publicKeyPem }),
      })
      if (!res.ok) throw new Error('Failed to upload public key')
      console.log('Public key uploaded successfully')
      // Store private key locally (for now, not encrypted)!!!!!!!!!
      localStorage.setItem('privateKeyPem', privateKeyPem)
    } catch (err) {
      console.error('Error uploading public key:', err)
    }
  }




  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, generateAndStoreKeys }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);