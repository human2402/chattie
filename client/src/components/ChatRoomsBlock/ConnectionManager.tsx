
import { useSocket } from '../../contexts/SocketContext.tsx';
import { socket } from '../../socket.ts';

export default function ConnectionManager() {

  const { isConnected } = useSocket();
  function connect() {
    socket.connect();
  }

  function disconnect() {
    socket.disconnect();
  }

  return (
    <div className='className="block w-full text-left px-2 py-2 rounded-lg text-gray-100"'>
      <p> {isConnected ? "Connected" : "Disconnected"} </p>
      <button onClick={ connect }>Connect</button>
      <button onClick={ disconnect }>Disconnect</button>

    </div>
  );
}