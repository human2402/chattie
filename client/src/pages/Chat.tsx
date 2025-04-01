import { ConnectionManager } from '../components/ConnectionManager';
import ConnectionState from '../components/ConnectionState';
import { Events } from "../components/Events";
import { MyForm } from '../components/MyForm';

import { useSocket } from '../contexts/SocketContext';


function Chat() {
    const { isConnected, fooEvents } = useSocket();

    console.log('Chat component props:', { isConnected, fooEvents });
  return (
    <div className="App">
      
      <ConnectionState isConnected={ isConnected } />
      <Events events={ fooEvents } />
      <ConnectionManager />
      <MyForm />
    </div>
  )
}

export default Chat
