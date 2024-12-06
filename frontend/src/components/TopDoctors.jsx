import React, { useContext } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { doctors } from '../assets/assets'
import { AppContext } from '../context/AppContext'



const TopDoctors = () => {
    const navigate = useNavigate();
    const {doctors} = useContext(AppContext)
  return (
    <div className='flex flex-col items-center gap-4 my-16 text-grey-900 md:mx-10'>
        <h1 className='text-3xl font-medium'>Counsellors</h1>
        <p className='sm:w-1/3 text-center tect-sm'>Select an available counsellor with the slot you would like to book.</p>
        <div className='w-full grid grid-cols-auto gap-4 gap-4 pt-5 gap-y-6 px-3 sm:px-0'>
            {doctors.slice(0,4).map((item,index)=>(
                <div onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0) }} className='border border-red-300 rounded-xl overflow-hidden cursor-pointer hover:translate-y-2 transition-all duration-500' key={index}>
                <div className='flex justify-center items-center'>
                    <img className='bg-blue-50' src={item.image} alt="" />
                </div>
                <div className='p-4'>
                    <div className={`flex items-center gap-2 text-sm ${item.available ? 'text-green-500' : 'text-gray-500'}`}>
                        <p className= {`w-2 h-2 ${item.available ?'bg-green-500 ' : 'bg-gray-500'} rounded-full`}></p><p>{item.available ? 'Avilable' : 'Not Available'}</p>
                    </div>
                    <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
                    <p className='text-gray-600 text-sm'>{item.speciality}</p>
                </div>
            </div>
            
            ))}
        </div>
      
    </div>
  )
}

export default TopDoctors
