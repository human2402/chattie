
import { useEffect, useState } from 'react';
import ChatRoomsBlock from '../components/ChatRoomsBlock/AChatRoomsBlock';
import ChatSingleBlock from '../components/ChatSingleBlock/AChatSingleBlock';
import { useAppContext } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router';




function Chat() {
  const {chatRoomID} = useAppContext ()        
  const {user} = useAuth ()
  const nav = useNavigate()

  // “isMobile” is true if window.innerWidth < MOBILE_BREAKPOINT
  const MOBILE_BREAKPOINT = 768; // e.g. 768px (matches “md” in Tailwind)
  const [isMobile, setIsMobile] = useState<boolean>(
    window.innerWidth < MOBILE_BREAKPOINT
  );

  // Update isMobile whenever the window resizes
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      nav('/login')
    }
  }, [user])

  return (
    <div className="App m-0 h-screen w-screen flex overflow-hidden">
      {/** ===== DESKTOP MODE ===== */}
      {
        !isMobile && (
          <>
            <ChatRoomsBlock />
            <ChatSingleBlock/>
          </> 
        )
      }

      {/** ===== MOBILE MODE ===== */}
      {
        isMobile && (
          <>
            {!chatRoomID ? (
              <div className="w-full">
                <ChatRoomsBlock />
              </div>
            ) : (
              <div className="w-full">
                <ChatSingleBlock />
              </div>
            )}
          </>
        )
      }
      

    </div>
  )
}

export default Chat
