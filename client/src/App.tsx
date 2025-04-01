import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider  } from 'react-router';

import { AuthProvider } from './contexts/AuthContext'
import { SocketProvider } from './contexts/SocketContext'; 


import MainLayout from './MainLayout';
import Chat from './pages/Chat';

function App() {
  // console.log("Socket connected?", socket.connected);

  // const [isConnected, setIsConnected] = useState<boolean>(socket.connected);
  // const [fooEvents, setFooEvents] = useState([]);

  // useEffect(() => {
  //   function onConnect() {
  //     console.log("Connected!");
  //     setIsConnected(true);
  //   }
  
  //   function onDisconnect() {
  //     console.log("Disconnected!");
  //     setIsConnected(false);
  //   }
  //   function onFooEvent(value) {
  //     setFooEvents(previous => [...previous, value]);
  //   }

  //   socket.on('connect', onConnect);
  //   socket.on('disconnect', onDisconnect);
  //   socket.on('foo', onFooEvent);

  //   if (socket.connected) {
  //     setIsConnected(true);
  //   }


  //   return () => {
  //     socket.off('connect', onConnect);
  //     socket.off('disconnect', onDisconnect);
  //     socket.off('foo', onFooEvent);
  //   };
  // }, []);



  const router = createBrowserRouter (
    createRoutesFromElements (
      <Route path = '/' element = {<MainLayout />}>
        <Route path = '/' element = {<Chat  />} />
      </Route>
    )
  )



  return (
    <AuthProvider >
      <SocketProvider>
        <RouterProvider router={router} />
      </SocketProvider>
    </AuthProvider>
  );
}

export default App
