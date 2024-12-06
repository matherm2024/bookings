import React from 'react'
import { assets } from '../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'

const Footer = () => {
  return (
    <div className='md:mx-10'>
        <div className='flex flex-col sm:grid grid-cols-[2fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
            {/*left section*/}
            <div className='realtive'>
                <img className='h-1/2  px-20 ' src={assets.logo} alt="" />
                

            </div>
            {/*Mid section*/}
            <div >
                <p className='w-full md:w-2/3 text-gray-600 leading-6'>COUNSELLING</p>
                <ul className='flex flex-col gap-2 text-gray-600'> 
                <NavLink to= '/'>
                    <li>Home</li>
                </NavLink>    
                <NavLink to='/about'>
                    <li>About</li>
                </NavLink> 
                <NavLink to='/contact'>   
                    <li>Contacts</li>
                </NavLink>

                </ul>
                
            </div>
            {/*right section*/}
            <div>
                <p className='w-full md:w-2/3 text-gray-600 leading-6'>GET IN TOUCH</p>
                <ul className='flex flex-col gap-2 text-gray-600'> 
                <li>020 7847 5558</li>
                <li>nancarrowc@clsg.org.uk</li>
                </ul>
            </div>
        </div>
        {/*copyright text*/}
        <div >
            <hr />
            <p className='py-5 text-sm text-center'>Copyright 2024@ CLSG Counsellor Bookings - All Rights Reserved.</p>
        </div>

        

    </div>
  )
}

export default Footer
