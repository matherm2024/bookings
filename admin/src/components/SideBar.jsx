import React, { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'
import { DoctorContext } from '../context/DoctorContext'

const SideBar = () => {

    const {aToken} = useContext(AdminContext)
    const {cToken} = useContext(DoctorContext)

  return (
    <div className='min-h-screen bg-white border-white'>
      {
        aToken && <ul className='text-[#515151] mt-5'>
            <NavLink className={({isActive})=> `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary':''}`} to={'/admin-dashboard'}>
                <img src={assets.home_icon} alt="" />
                <p className='hidden md:block' >Dashboard</p>
            </NavLink>
            <NavLink  className={({isActive})=> `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary':''}`} to={'/all-appointments'}>
                <img src={assets.list_icon} alt="" />
                <p className='hidden md:block' >All Appointmnets</p>
            </NavLink>
            <NavLink className={({isActive})=> `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary':''}`} to={'/add-counsellor'}>
                <img src={assets.add_icon} alt="" />
                <p className='hidden md:block'>Add Counsellor</p>
            </NavLink>
            <NavLink className={({isActive})=> `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary':''}`} to={'/all-counsellors'}>
                <img src={assets.people_icon} alt="" />
                <p className='hidden md:block'>All Counsellors</p>
            </NavLink>
            <NavLink className={({isActive})=> `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary':''}`} to={'/all-calendars'}>
                <img src={assets.appointment_icon} alt="" />
                <p className='hidden md:block'>Calendar</p>
            </NavLink>


        </ul>
      }
            {
        cToken && <ul className='text-[#515151] mt-5'>
            <NavLink className={({isActive})=> `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary':''}`} to={'/counsellor-dashboard'}>
                <img src={assets.home_icon} alt="" />
                <p className='hidden md:block'>Dashboard</p>
            </NavLink>
            <NavLink  className={({isActive})=> `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary':''}`} to={'/counsellor-appointments'}>
                <img src={assets.list_icon} alt="" />
                <p className='hidden md:block'>All Appointments</p>
            </NavLink>
            <NavLink className={({isActive})=> `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary':''}`} to={'/counsellor-profile'}>
                <img src={assets.people_icon} alt="" />
                <p className='hidden md:block'>Profile</p>
            </NavLink>
            <NavLink className={({isActive})=> `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary':''}`} to={'/calendar'}>
                <img src={assets.appointment_icon} alt="" />
                <p className='hidden md:block'>Calendar</p>
            </NavLink>

        </ul>
      }
    </div>
  )
}

export default SideBar
