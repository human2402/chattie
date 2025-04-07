import { createContext, useState, useEffect, ReactNode, useContext, useRef } from 'react';
import { socket } from '../socket.ts';  // Assuming socket.io client instance

// Type for the context value
type SocketContextType = {
  isConnected: boolean;
  fooEvents: string[];
  setFooEvents: React.Dispatch<React.SetStateAction<string[]>>;
};

// Create the context with default values
const SocketContext = createContext<SocketContextType | undefined>(undefined);

// Provider component
export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [fooEvents, setFooEvents] = useState<string[]>([]);
  const serverOffsetRef = useRef(0);

  useEffect(() => {
    socket.auth = { serverOffset: serverOffsetRef.current };
    socket.connect();

    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onFooEvent(value: string, serverOffset?: number) {
      setFooEvents(prev => [...prev, value]);
      console.log(value, serverOffset)
      if (serverOffset !== undefined) {
        serverOffsetRef.current = serverOffset;
      }
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('foo', onFooEvent);

    // Clean up the listeners
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('foo', onFooEvent);
    };
  }, []);

  return (
    <SocketContext.Provider value={{ isConnected, fooEvents, setFooEvents }}>
      {children}
    </SocketContext.Provider>
  );
};

// Custom hook to use the SocketContext
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
