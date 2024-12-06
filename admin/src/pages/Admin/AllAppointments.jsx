import React from 'react'
import { useContext } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { useEffect } from 'react'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'

const AllAppointments = () => {
  const { aToken, appointments, getAllAppointments, cancelAppointment } = useContext(AdminContext)
  const { calculateAge, slotDateFormat } = useContext(AppContext)

  useEffect(() => {
    if (aToken) {
      getAllAppointments()
      
      
    }

  }, [aToken])






  return (
    <div className='w-full max-w-6xl m-5'>
      <p className='mb-3 text-lg font-medium'>All Appointments</p>

      <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll'>
        <div className='hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_2fr] grid-flow-col py-3 px-6 border-b'>
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Counsellor Name</p>
          <p>Cancel Session</p>
        </div>

        {appointments.map((item, index) => (
          <div
            className='grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_2fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50'
            key={index}
          >
            <p className='max-sm:hidden'>{index + 1}</p>
            <div className='flex items-center gap-2'>
              <img className='w-8 rounded-full' src={item.userData.image} alt="" />
              <p>{item.userData.name}</p>
            </div>
            <p className='max-sm:hidden'>{calculateAge(item.userData.dob)}</p>
            <p>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>
            <div className='flex items-center gap-2'>
              <img className='w-8 rounded-full' src={item.docData.image} alt="" />
              <p>{item.docData.name}</p>
            </div>
            <div className='px-4'>
              {item.cancelled
                ? <p className='text-red-400 text-xs font-medium'>Cancelled</p>
                : item.isCompleted
                  ? <p className='text-green-500 text-xs font-medium'>Completed</p>
                  : <img onClick={(() => cancelAppointment(item._id))} className='w-10 cursor-pointer' src={assets.cancel_icon} />

              }
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AllAppointments

