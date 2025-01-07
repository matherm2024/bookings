import React, { useContext } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AdminContext } from './context/AdminContext';
import { DoctorContext } from './context/DoctorContext';
import Navbar from './components/Navbar';
import SideBar from './components/SideBar';
import { Route, Routes, Navigate } from 'react-router-dom';
import Dashboard from './pages/Admin/Dashboard';
import AllAppointments from './pages/Admin/AllAppointments';
import AddDoctor from './pages/Admin/AddDoctor';
import DoctorsList from './pages/Admin/DoctorsList';
import CounsellorAppointment from './pages/Doctor/CounsellorAppointment';
import CounsellorDashboard from './pages/Doctor/CounsellorDashboard';
import CounsellorProfile from './pages/Doctor/CounsellorProfile';
import Calendar from './pages/Doctor/Calendar';
import AdminCalendar from './pages/Admin/AdminCalendar';
import ForgotPassword from './ForgotPassword';
import PasswordReset from './ResetPassword';
import Login from './pages/Login';

const App = () => {
  const { aToken } = useContext(AdminContext);
  const { cToken } = useContext(DoctorContext);

  // Handle routing based on tokens
  if (!aToken && !cToken) {
    return <Navigate to="/login" replace />; // Redirect to login if no tokens
  }

  if (cToken) {
    return <Navigate to="/admin-dashboard" replace />; // Redirect to admin-dashboard if cToken is present
  }

  return (
    <div className="bg-[#F8F9FD]">
      <ToastContainer />
      <Navbar />
      <div className="flex items-start">
        <SideBar />
        <Routes>
          {/* Admin Routes */}
          <Route path="/" element={<Navigate to="/admin-dashboard" replace />} />
          <Route path="/admin-dashboard" element={<Dashboard />} />
          <Route path="/all-appointments" element={<AllAppointments />} />
          <Route path="/add-counsellor" element={<AddDoctor />} />
          <Route path="/all-counsellors" element={<DoctorsList />} />
          <Route path="/all-calendars" element={<AdminCalendar />} />

          {/* Counsellor Routes */}
          <Route path="/counsellor-dashboard" element={<CounsellorDashboard />} />
          <Route path="/counsellor-appointments" element={<CounsellorAppointment />} />
          <Route path="/counsellor-profile" element={<CounsellorProfile />} />
          <Route path="/calendar" element={<Calendar />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
