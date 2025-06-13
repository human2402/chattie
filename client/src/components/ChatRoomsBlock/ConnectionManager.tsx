
import { useSocket } from '../../contexts/SocketContext.tsx';

export default function ConnectionManager() {
  const { socket } = useSocket();
  if (!socket) {
    console.warn("Socket not ready yet");
    return;
  }
  //Декларируем статус
  const { isConnected } = useSocket();
  //Функции подключения\отключения
  function connect() {
    socket.connect();
  }
  function disconnect() {
    socket.disconnect();
  }
  //UI для контроля из приложения
  return (
    <div className='className="block w-full text-left px-2 py-2 rounded-lg text-gray-100"'>
      <p> {isConnected ? "Connected" : "Disconnected"} </p>
      <button onClick={ connect }>Connect</button>
      <button onClick={ disconnect }>Disconnect</button>
    </div>
  );
}