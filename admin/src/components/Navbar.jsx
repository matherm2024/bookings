import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AdminContext } from '../context/AdminContext'
import {useNavigate} from 'react-router-dom'
import { DoctorContext } from '../context/DoctorContext'

const Navbar = () => {

const {aToken, setAToken} = useContext(AdminContext)
const {cToken, setCToken} = useContext(DoctorContext)

const navigate = useNavigate()

const logout = () => {
  navigate('/login')
  aToken && setAToken('')
  aToken && localStorage.removeItem('aToken')
  cToken && setCToken('')
  cToken && localStorage.removeItem('cToken')
}




  return (
    <div className='flex justify-between items-center px-4  sm:px-10 py-3 border-b bg-white'>
      <div className='flex items-center gap-2 text-xs'>
        <img className='w-20 sm:w-20 cursor-pointer' src={assets.admin_logo} alt="" />
        <p className='border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600'>{aToken ? 'Admin' : 'Counsellor'}</p>
      </div>
      <button onClick={logout} className='bg-red-500 text-white text-sm px-10 py-2 rounded-full '>Logout</button>
    </div>
  )
}

export default Navbar
