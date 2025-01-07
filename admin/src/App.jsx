import React, { useContext, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Route, Routes, Navigate, useLocation } from 'react-router-dom';

import { AdminContext } from './context/AdminContext';
import { DoctorContext } from './context/DoctorContext';

// Components
import Navbar from './components/Navbar';
import SideBar from './components/SideBar';

// Admin Pages
import Dashboard from './pages/Admin/Dashboard';
import AllAppointments from './pages/Admin/AllAppointments';
import AddDoctor from './pages/Admin/AddDoctor';
import DoctorsList from './pages/Admin/DoctorsList';
import AdminCalendar from './pages/Admin/AdminCalendar';

// Counsellor Pages
import CounsellorDashboard from './pages/Doctor/CounsellorDashboard';
import CounsellorAppointment from './pages/Doctor/CounsellorAppointment';
import CounsellorProfile from './pages/Doctor/CounsellorProfile';
import Calendar from './pages/Doctor/Calendar';

// Auth Pages
import Login from './pages/Login';
import ForgotPassword from './ForgotPassword';
import PasswordReset from './ResetPassword';

const App = () => {
  const location = useLocation(); // Used to check the current URL path

  // Context Tokens
  const { aToken } = useContext(AdminContext);
  const { cToken } = useContext(DoctorContext);

  // Redirect Logic - Only when accessing "/" directly
  useEffect(() => {
    if (!aToken && !cToken && location.pathname === '/') {
      // Redirect to login if no tokens are present
      window.location.href = '/login';
    } else if (cToken && location.pathname === '/') {
      // Redirect to counsellor dashboard if cToken is present
      window.location.href = '/counsellor-dashboard';
    } else if (aToken && location.pathname === '/') {
      // Redirect to admin dashboard if aToken is present
      window.location.href = '/admin-dashboard';
    }
  }, []); // Only runs once when the component mounts

  return (
    <div className='bg-[#F8F9FD]'>
      <ToastContainer />
      {aToken || cToken ? (
        <>
          <Navbar />
          <div className='flex items-start'>
            <SideBar />
            <Routes>
              {/* Admin Routes */}
              <Route path='/admin-dashboard' element={<Dashboard />} />
              <Route path='/all-appointments' element={<AllAppointments />} />
              <Route path='/add-counsellor' element={<AddDoctor />} />
              <Route path='/all-counsellors' element={<DoctorsList />} />
              <Route path='/all-calendars' element={<AdminCalendar />} />

              {/* Counsellor Routes */}
              <Route path='/counsellor-dashboard' element={<CounsellorDashboard />} />
              <Route path='/counsellor-appointments' element={<CounsellorAppointment />} />
              <Route path='/counsellor-profile' element={<CounsellorProfile />} />
              <Route path='/calendar' element={<Calendar />} />

              {/* Catch-all route */}
              <Route path='*' element={<Navigate to={aToken ? '/admin-dashboard' : '/counsellor-dashboard'} />} />
            </Routes>
          </div>
        </>
      ) : (
        // Public Routes for Login and Password Reset
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/password-reset/:id/:token' element={<PasswordReset />} />
          <Route path='*' element={<Navigate to='/login' />} />
        </Routes>
      )}
    </div>
  );
};

export default App;
