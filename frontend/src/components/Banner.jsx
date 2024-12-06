import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const Banner = () => {
    const navigate = useNavigate()
  return (
    <div className='flex bg-red-400 rounded-lg px-6 sm:px-10 md:px-14 lg:px-12 my-20 md:mx-10'>
  {/*---------left side----------*/}
  <div className='flex-1 py-8 sm:py-10 md:py-16 lg:py-24 lg:pl-5'>
    <div className='text-xl sm:text-2Xl md:text-3xl lg:text-5xl foint-semibold text-white'>
      <p className='mt-4'>Login to Book</p>
      <p>An Appointment</p>
    </div>
    <button onClick={()=>{navigate('/login'); scrollTo(0,0)}} className='mt-4 bg-red-100 text-grey-600 py-3 px-8 rounded-full hover:scale-105 transition-all'>Login</button>
  </div>

  {/*---------right side----------*/}
  <div className='flex-1 rounded-lg overflow-hidden flex justify-center items-center hidden md:block'>
    <img className='w-full sm:w-2/3 md:w-1/2 p-3 rounded-lg ' src={assets.appointment_img} alt="Appointment" />
  </div>
</div>

  )
}

export default Banner