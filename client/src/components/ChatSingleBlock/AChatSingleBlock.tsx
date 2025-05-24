
import { Events } from "./Events";
import { useSocket } from '../../contexts/SocketContext';
import ChatHeader from "./ChatHeader";
import { useAppContext } from "../../contexts/AppContext";
import EmptyChat from './EmptyChat.jsx'



function ChatRoomsBlock ({}) {
    const { isConnected, fooEvents } = useSocket();
    const {chatRoomID } = useAppContext() ;

    if (chatRoomID) {
      
      return (
          <div className='bg-[#f3f4f6] flex flex-col h-screen w-full'>
            
            {/* Header or status bar — won't grow */}
            <div className="px-4 py-1 shadow shrink-0 bg-white border-b-[1px] border-gray-300  ">
              <ChatHeader />
  
            </div>
      
            {/* Scrollable event/chat section */}
            <div className="flex-1 overflow-hidden">
              <Events events={fooEvents} />
            </div>
            
          </div>
        );
    } else {
      return (<EmptyChat />)
    }
}

export default ChatRoomsBlock