import React, { useContext } from 'react'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AppContext } from './context/AppContext';
import { AdminContext } from './context/AdminContext';
import Navbar from './components/Navbar';
import SideBar from './components/SideBar';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Admin/Dashboard';
import AllAppointments from './pages/Admin/AllAppointments';
import AddDoctor from './pages/Admin/AddDoctor';
import DoctorsList from './pages/Admin/DoctorsList';
import { DoctorContext } from './context/DoctorContext';
import Login from './pages/Login';
import CounsellorAppointment from './pages/Doctor/CounsellorAppointment';
import CounsellorDashboard from './pages/Doctor/CounsellorDashboard';
import CounsellorProfile from './pages/Doctor/CounsellorProfile';
import Calendar from './pages/Doctor/Calendar';
import AdminCalendar from './pages/Admin/AdminCalendar';
import ForgotPassword from './ForgotPassword';
import PasswordReset from './ResetPassword';


const App = () => {
  const { aToken } = useContext(AdminContext)
  const { cToken } = useContext(DoctorContext)

  return aToken || cToken ? (
    <div className='bg-[#F8F9FD]' >

      <ToastContainer />
      <Navbar />
      <div className='flex items-start'>
        <SideBar />
        <Routes>
          {/* Admin Route */}
          <Route path='/' element={<></>} />
          <Route path='/admin-dashboard' element={<Dashboard />} />
          <Route path='/all-appointments' element={<AllAppointments />} />
          <Route path='/add-counsellor' element={<AddDoctor />} />
          <Route path='/all-counsellors' element={<DoctorsList />} />
          <Route path='/all-calendars' element={<AdminCalendar />} />

          {/*Counsellor Route*/}
          <Route path='/counsellor-dashboard' element={<CounsellorDashboard />} />
          <Route path='/counsellor-appointments' element={<CounsellorAppointment />} />
          <Route path='/counsellor-profile' element={<CounsellorProfile />} />
          <Route path='/calendar' element={<Calendar />} />

        </Routes>

      </div>

    </div>
  ) : (
    <>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/password-reset/:id/:token' element={<PasswordReset />} />
      </Routes>
      <ToastContainer />
    </>
  )
}

export default App

