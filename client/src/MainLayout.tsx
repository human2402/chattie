// import Header from './Header'
import { Outlet } from 'react-router-dom'
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

function MainLayout() { 
//   const notify = () => toast("This is a toast notification !");
  return (
    <>
        {/* <Header /> */}
        <Outlet />
        {/* <ToastContainer /> */}
    </>
  )
}

export default MainLayout