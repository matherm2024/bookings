import React from 'react'
import Banner from './components/Banner'
import Footer from './components/Footer'
import Header from './components/Header'
import NavBar from './components/NavBar'
import SpecialityMenu from './components/SpecialityMenu'
import TopDoctors from './components/TopDoctors'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Doctors from './pages/Doctors'
import Login from './pages/Login'
import About from './pages/About'
import Contact from './pages/Contact'
import MyProfile from './pages/MyProfile'
import MyAppointments from './pages/MyAppointments'
import Appointment from './pages/Appointment'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ForgotPassword from './pages/ForgotPassword'
import PasswordReset from './pages/PasswordReset'


const App = () => {
  return (
    <div className='mx-4 sm:mx-[10%]'>
      <ToastContainer/>
      <NavBar/>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/counsellors' element={<Doctors/>} />
        <Route path='/counsellors/:speciality' element={<Doctors/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/about' element={<About/>} />
        <Route path='/contact' element={<Contact/>} />
        <Route path='/my-profile' element={<MyProfile/>} />
        <Route path='/my-appointments' element={<MyAppointments/>} />
        <Route path='/appointment/:docId' element={<Appointment/>} />
        <Route path='/forgot-password' element={<ForgotPassword/>} />
        <Route path='/password-reset/:id/:token' element={<PasswordReset/>} />

      </Routes>
      <Footer/>
      
    </div>
  )
}

export default App


