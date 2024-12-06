import React from 'react'
import { assets } from '../assets/assets'

const Contact = () => {

  return (
    <div>
      <div className='text-center text-2xl pt-10 text-gray-500'>
        <p>CONTACT <span className='text-gray-700 font-semibold'>US</span></p>
      </div>
      <div className='my-10 flex felx-col justify-center md:flex-row gap-10 md-28 text-sm'>
        <img className='w-full md:max-w-[360px]' src={assets.contact_image} alt="" />
        <div className='flex flex-col justify-center items-start gap-4'>
          <p className='text-gray-700 font-semibold'>Our Rooms</p>
          <p className='text-gray-500'>room numbers for all counsellors</p>
          <p className='text-gray-700 font-semibold'>Email Us</p>
          <p className='text-gray-500'>Christine Nancarrow - nancarrowc@clsg.org.uk  <br />Celia Baines - bainesc@clsg.org.uk <br />Sean Kinahan - kinahans@clsg.org.uk </p>
        </div>
      </div>
    </div>
  )
}

export default Contact

