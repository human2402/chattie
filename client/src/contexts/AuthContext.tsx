import { createContext, useContext, useState, ReactNode } from 'react';
import forge from 'node-forge';
import crypto from 'crypto';
import { fetchGetCool, justFetch } from './FetchigCool';

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

  

/**
 * Generates a random AES key and encrypts it with the recipient's RSA public key
 * @param {string} recipientPublicKey - PEM-encoded RSA public key (e.g., -----BEGIN PUBLIC KEY-----...)
 * @returns {{ encryptedAESKey: string, aesKey: Buffer }}
 */
  async function generateAndEncryptAESKey(recipientID: number) {
    // 1. Generate a 256-bit AES key using Web Crypto API
              // const aesKey = await window.crypto.subtle.generateKey(
              //   {
              //     name: 'AES-GCM',
              //     length: 256,
              //   },
              //   true,
              //   ['encrypt', 'decrypt']
              // );

              // // 2. Export the key to raw bytes
              // const rawKey = await window.crypto.subtle.exportKey('raw', aesKey);

              // // 3. Fetch recipient's public key
              // const { publicKey: recipientPublicKeyPem } = await justFetch(`/api/users/${recipientID}/public-key`);
              // console.log (publicKey)
      // 4. Convert PEM to CryptoKey
      // const recipientPublicKey = await importRSAPublicKey(recipientPublicKeyPem);

      // // 5. Encrypt the AES key using the recipient's RSA public key
      // const encryptedKeyBuffer = await window.crypto.subtle.encrypt(
      //   {
      //     name: 'RSA-OAEP',
      //   },
      //   recipientPublicKey,
      //   rawKey
      // );

      // const encryptedKeyBase64 = btoa(String.fromCharCode(...new Uint8Array(encryptedKeyBuffer)));

      // return {
      //   aesKey,
      //   encryptedAESKey: encryptedKeyBase64,
      // };
  }


  //            //
  // keys Stuff //
  //            //

  
  // const generateAndStoreKeys = async (password: string) => {
  //   // Check if keys already exist
  //   if (user) {
  //     const localKeyData = localStorage.getItem('privateKeyData');
  //     const currentUserId = user.id;
  
  //     if (localKeyData) {
  //       const parsed = JSON.parse(localKeyData);
        
  //       if (parsed.userId !== currentUserId) {
  //         // Key belongs to a different user — generate new keys
  //         generateAndStoreKeyPair(currentUserId);
  //       } else {
  //         // Key is valid for this user — you're good
  //         console.log("Correct key already present.");
  //       }
  //     } else {
  //       // No key exists — generate new one
  //       generateAndStoreKeyPair(currentUserId);
  //     }
  //   }

  //   // Generate key pair
  //   const keypair = forge.pki.rsa.generateKeyPair({ bits: 2048, e: 0x10001 })
  //   const publicKeyPem = forge.pki.publicKeyToPem(keypair.publicKey)
  //   const privateKeyPem = forge.pki.privateKeyToPem(keypair.privateKey)

    

  //   // Send public key to server
  //   try {
  //     const res = await fetch(`/api/users/${user.id}/public-key`, {
  //       method: 'POST',
  //       headers: { 
  //         'Content-Type': 'application/json',
  //         Authorization: `Bearer ${localStorage.getItem("authToken")}`,
  //       },
  //       body: JSON.stringify({ publicKey: publicKeyPem }),
  //     })
  //     if (!res.ok) throw new Error('Failed to upload public key')
  //     console.log('Public key uploaded successfully')
  //     // Store private key locally (for now, not encrypted)!!!!!!!!!
  //     localStorage.setItem('privateKeyPem', privateKeyPem)
  //   } catch (err) {
  //     console.error('Error uploading public key:', err)
  //   }
  // }

  const generateAndStoreKeys = async (userid:number , password: string) => {
  
    const currentUserId = userid;
    const localKeyData = localStorage.getItem('privateKeyData');
  
    if (localKeyData) {
      try {
        const parsed = JSON.parse(localKeyData);
        if (parsed.userId === currentUserId) {
          console.log('Correct key already present.');
          return; // ✅ Skip generation
        } else {
          console.warn('Key belongs to different user. Generating new key...');
        }
      } catch (err) {
        console.error('Failed to parse localKeyData, generating new keys...');
      }
    }
  
    // 🔐 Generate new key pair
    const keypair = forge.pki.rsa.generateKeyPair({ bits: 2048, e: 0x10001 });
    const publicKeyPem = forge.pki.publicKeyToPem(keypair.publicKey);
    const privateKeyPem = forge.pki.privateKeyToPem(keypair.privateKey);
  
    // ⬆️ Upload public key to server
    try {
      const res = await fetch(`/api/users/${currentUserId}/public-key`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({ publicKey: publicKeyPem }),
      });
  
      if (!res.ok) throw new Error('Failed to upload public key');
      console.log('✅ Public key uploaded successfully');
  
      // 💾 Store private key + userId locally
      localStorage.setItem('privateKeyData', JSON.stringify({
        userId: currentUserId,
        privateKey: privateKeyPem
      }));
  
    } catch (err) {
      console.error('❌ Error uploading public key:', err);
    }
  };
  




  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, 
      logout, generateAndStoreKeys, generateAndEncryptAESKey }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);