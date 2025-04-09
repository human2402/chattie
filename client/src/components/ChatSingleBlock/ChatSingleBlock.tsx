import { ConnectionManager } from "./ConnectionManager";
import ConnectionState from "./ConnectionState";
import { Events } from "./Events";
import { useSocket } from '../../contexts/SocketContext';



function ChatRoomsBlock ({}) {
    const { isConnected, fooEvents } = useSocket();

    return (
        <div className='bg-[#f3f4f6] flex flex-col h-screen w-full'>
          
          {/* Header or status bar — won't grow */}
          <div className="px-4 py- shadow shrink-0">
            <ConnectionManager />
            <ConnectionState isConnected={isConnected} />
          </div>
    
          {/* Scrollable event/chat section */}
          <div className="flex-1 overflow-hidden">
            <Events events={fooEvents} />
          </div>
          
        </div>
      );
}

export default ChatRoomsBlock