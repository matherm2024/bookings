import React from 'react'
import { useContext } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { useEffect } from 'react'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'

const CounsellorAppointment = () => {

  const { cToken, appointments, getAppointments, cancelAppointment, completeAppointment } = useContext(DoctorContext)
  const { calculateAge, slotDateFormat } = useContext(AppContext)


  useEffect(() => {
    if (cToken) {
      getAppointments()
    }

  }, [cToken])


  return (
    <div className='w-full max-w-6xl m-5'>
      <p className='mb-3 text-lg font-medium'>
        All Appointments
      </p>
      <div className='bg-white border rouneded text-sm max-h-[88vh] min-h-[50vh] overflow-y-scroll'>
        <div className='max-sm:hidden grid grid-cols-[0.5fr_2fr_2fr_2fr_1fr] gap-1 py-3 px-6 border-b'>
          <p>#</p>
          <p>Details</p>
          <p>Age</p>
          <p>Date and Time</p>
          <p>Action</p>
        </div>
        <div>
          {
            appointments.reverse().map((item, index) => (
              <div className='flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_2fr_2fr_1fr] gap-1 items-center text-gray-500 my-3 px-6 border-b hover:bg-gray-50' key={index}>
                {/* Index */}
                <p className='max-sm:hidden'>{index + 1}</p>

                {/* User Image and Name */}
                <div className="flex items-center gap-2">
                  <img src={item.userData.image} alt={`${item.userData.name}'s image`} className="w-8 h-8 rounded-full" />
                  <p>{item.userData.name}</p>
                </div>

                {/* Age */}
                <div className="flex flex-col">
                  <p>{calculateAge(item.userData.dob)}</p>
                </div>

                {/* Date and Time */}
                <div className="flex flex-col">
                  <p>{slotDateFormat(item.slotDate)}</p>
                  <p>{item.slotTime}</p>
                </div>

                {/* Action Icons */}
                {
                  item.cancelled
                    ? <p className='text-red-400 text-xs font-medium'>Cancelled</p>
                    : item.isCompleted
                      ? <p className='text-green-500 text-xs font-medium' >Completed</p>
                      : <div className="flex gap-3">
                        <img onClick={() => cancelAppointment(item._id)} src={assets.cancel_icon} alt="Cancel" className="w-6 h-6 cursor-pointer" />
                        <img onClick={() => completeAppointment(item._id)} src={assets.tick_icon} alt="" className="w-6 h-6 cursor-pointer" />
                      </div>
                }

              </div>

            ))
          }
        </div>


      </div>

    </div>
  )
}

export default CounsellorAppointment
