import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider  } from 'react-router';

import { AuthProvider } from './contexts/AuthContext'
import { SocketProvider } from './contexts/SocketContext'; 
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import MainLayout from './MainLayout';
import Chat from './pages/Chat';
import Login from './pages/Login';
import { AppProvider } from './contexts/AppContext';


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
      <AppProvider>
        <SocketProvider>
          <RouterProvider router={router} />
          <ToastContainer />
        </SocketProvider>
      </AppProvider>
    </AuthProvider>
  );
}

export default App
