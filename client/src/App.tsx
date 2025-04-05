import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider  } from 'react-router';

import { AuthProvider } from './contexts/AuthContext'
import { SocketProvider } from './contexts/SocketContext'; 


import MainLayout from './MainLayout';
import Chat from './pages/Chat';
import Login from './pages/Login';


function App() {
  const router = createBrowserRouter (
    createRoutesFromElements (
      <Route path = '/' element = {<MainLayout />}>
        <Route path = '/' element = {<Chat  />} />

        <Route path = '/login' element = {<Login />} />
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
