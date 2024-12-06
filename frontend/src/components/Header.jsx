import React from 'react'
import { assets } from '../assets/assets'

const Header = () => {
  return (
    <div className='flex flex-col md:flex-row flex-wrap bg-red-400 rounded-lg px-6 md:px-10 lg:px-20 relative'>
      {/* ------ Left side ------ */}
      <div className='md:w-1/2 flex flex-col items-start justify-center gap-4 py-10 md:py-[10vw] md:ml-[-20px]'>
        <p className='text-4xl md:text-5xl lg:text-6xl text-white font-semibold leading-tight md:leading-tight lg:leading-tight'>
          Book An Appointment <br /> With Our Counsellors
        </p>
        <div className='felx felx-col md:flex-row items-center gap-3 text-white text-sm font-light'>
          <img className='w-28' src={assets.group_profiles} alt="" />
          <p>Click on a counsellor and book a slot.</p>
        </div>
        <a href="/counsellors" className='flex items-center gap-2 bg-white px-8 py-3 rounded-full text-grey-600 text-sm m-auto md:m-0 hover:scale-105 transition-all duration-300' >
          Book Appointment <img className='w-3' src={assets.arrow_icon} alt="" />
        </a>
      </div>
  
      {/* ----- Right Side ----- */}
      <div className='w-1/2 relative'>
        
      </div>
    </div>
  );
}

export default Header
