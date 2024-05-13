import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './components/Header';
import { Outlet } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const location = useLocation();
  const isNotAdminLogin = location.pathname !== '/admin';
  const isNotDashboard = location.pathname !== '/dashboard';

  return (
    <>
      {/* Render the Header only if the current path is not the AdminLogin page */}
      {isNotAdminLogin && isNotDashboard && <Header />}
      <ToastContainer />
      <Container className='my-2'>
        <Outlet />
      </Container>
    </>
  );
};

export default App;
