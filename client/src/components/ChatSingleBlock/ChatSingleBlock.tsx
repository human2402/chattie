
import { Events } from "./Events";
import { useSocket } from '../../contexts/SocketContext';
import ChatRoomHeader from "./ChatRoomHeader";



function ChatRoomsBlock ({}) {
    const { isConnected, fooEvents } = useSocket();

    return (
        <div className='bg-[#f3f4f6] flex flex-col h-screen w-full'>
          
          {/* Header or status bar — won't grow */}
          <div className="px-4 py-1 shadow shrink-0 bg-white">
            <ChatRoomHeader />

          </div>
    
          {/* Scrollable event/chat section */}
          <div className="flex-1 overflow-hidden pt-3">
            <Events events={fooEvents} />
          </div>
          
        </div>
      );
}

export default ChatRoomsBlock