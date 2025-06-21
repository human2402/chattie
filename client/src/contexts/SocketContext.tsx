import { createContext, useState, useEffect, ReactNode, useContext, useRef } from 'react';
import { createSocket } from '../socket.ts';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';
import { useAppContext } from './AppContext.tsx';

// Type for the context value
type SocketContextType = {
  socket: Socket | null;      // ← new
  isConnected: boolean;
  fooEvents: any[];
  setFooEvents: React.Dispatch<React.SetStateAction<any[]>>;
  notifyEvents: any[], 
  setNotifyEvents: React.Dispatch<React.SetStateAction<any[]>>
};


interface NotificationPayload {
  roomID: string | number;
  authorID: string | number;
  authorName: string;
  msg: string;
  timestamp: string;
  messageID: string | number;
}

// Create the context with default values
const SocketContext = createContext<SocketContextType | undefined>(undefined);

// Provider component
export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<any>(null);
  const [fooEvents, setFooEvents] = useState<any[]>([]);
  const [notifyEvents, setNotifyEvents] = useState<any[]>([]);
  const serverOffsetRef = useRef(0);

  const { chatRoomID, setChatRoomID, setChatRoomData, chats } = useAppContext()
  const chatRoomIDRef = useRef<string | number | null>(chatRoomID);
  // console.log(chatRoomID)

  
  const { user } = useAuth(); 

  // Keep the ref updated whenever chatRoomID changes:
  useEffect(() => {
    chatRoomIDRef.current = chatRoomID;
  }, [chatRoomID]);


  useEffect(() => {

    if (!user?.id) {
      return   // reset on logout or fresh mount
      return;
    }
   
    
    const sock = createSocket(user.id, serverOffsetRef.current);
    sock.auth = { serverOffset: serverOffsetRef.current };
    setSocket(sock);  
    
    
    sock.on("connect", () => {
      console.log("Socket connected (or reconnected):", sock.id);
      sock.emit("authenticate", { userID: user.id });
      // console.log(chatRoomID, "chatRoomID")
    });

    sock.io.on("reconnect", () => {
      console.log("Socket reconnected via manager");
      sock.emit("authenticate", { userID: user.id });
    });
    
    

    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onFooEvent(
      newMes
    ) {
      console.log(newMes)


      
      setFooEvents(prev => [...prev, newMes]);
      // console.log(value, serverOffset)
      // console.log(newMessage)
      if (serverOffset !== undefined) {
        serverOffsetRef.current = serverOffset;
      }
    }

    function onNotification (payload: NotificationPayload) {
      const { 
        roomID,
        authorID,
        authorName,
        msg,
        timestamp,
        messageID 
      } = payload;

       // Compare against the ref, not the closed‐over `chatRoomID`
       if (roomID !== chatRoomIDRef.current) {
        console.log(roomID , chatRoomID)
        toast.info(
          <div 
            onClick={() => {
              setChatRoomID(roomID)
              setChatRoomData(chats.find((el) => el.id == roomID))
            }}
          >
            <strong>
              {authorName}
            </strong>: {msg}
          </div>,
          {
            position: "bottom-left", // move to bottom‐left
            icon: false,              
            autoClose: 7000,
            pauseOnHover: true,
            closeOnClick: true,
            hideProgressBar: true
          }
        );
  
        let newNoification = {
          value: msg,
          authorID: authorID,
          authorName: authorName,
          roomID: roomID,
          timestamp: timestamp,
          messageID: messageID
        }
  
        setNotifyEvents(prev => [newNoification,...prev])

      }


    }

    sock.on('connect', onConnect);
    sock.on('disconnect', onDisconnect);
    sock.on('foo', onFooEvent);
    sock.on('notification', onNotification)


    sock.connect();

    // Clean up the listeners
    return () => {
      sock.removeAllListeners();
      sock.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (!socket) return;
    if (!chatRoomID) return; // no room selected → nothing to join
  
    // Helper to emit join-room:
    const joinRoom = (roomID: string) => {
      socket.emit("join room", roomID, false, (err: any) => {
        if (err) {
          console.error("Error joining room:", err);
        }
      });
    };
    
  
    joinRoom(chatRoomID);
  
    // Optionally: clean‐up if you want to “leave” the old room when chatRoomID changes.
    // But usually Socket.IO will auto‐leave all previous rooms on a new `join`.
    // If you explicitly want to leave the previous room, store it in a ref and do:
    //   socket.emit("leave room", prevRoomID)
    // in the cleanup. For now, we can skip that.
  
  }, [socket, chatRoomID]);

  return (
    <SocketContext.Provider value={{ 
      socket, 
      isConnected, 
      fooEvents, setFooEvents,
      notifyEvents, setNotifyEvents 
    }}>
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
