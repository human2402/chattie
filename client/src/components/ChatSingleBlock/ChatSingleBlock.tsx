import { ConnectionManager } from "./ConnectionManager";
import ConnectionState from "./ConnectionState";
import { Events } from "./Events";
import { useSocket } from '../../contexts/SocketContext';



function ChatRoomsBlock ({}) {
    const { isConnected, fooEvents } = useSocket();

    return (
        <div className='w-100 bg-amber-300 flex-grow'>
            <ConnectionManager />
            <ConnectionState isConnected={ isConnected } />
            
            <Events events={ fooEvents } />
            
        </div>
    )
}

export default ChatRoomsBlock