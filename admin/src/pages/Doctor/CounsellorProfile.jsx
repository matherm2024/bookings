import React from 'react'
import { useContext } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const CounsellorProfile = () => {

  const { cToken, profileData, setProfileData, getProfileData } = useContext(DoctorContext)
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const [isEdit, setIsEdit] = useState(false)

  const updateProfile = async (params) => {
    try {
      const updateData = {
        address: profileData.address,
        available: profileData.available
      }
      const { data } = await axios.post(backendUrl + '/api/doctor/update-profile', updateData, { headers: { cToken } })

      if (data.success) {
        toast.success(data.message)
        setIsEdit(false)
        getProfileData()
      } else {
        toast.error(data.message)
      }

      setIsEdit(false)

    } catch (error) {
      toast.error(error.message)
      console.log(error)
    }

  }

  useEffect(() => {
    if (cToken) {
      getProfileData()

    }

  }, [cToken])


  return profileData && (
    <div>
      <div className='flex flex-col gap-4 m-5'>
        <img className='bg-primary/80 w-full sm:max-w-64 rounded-lg' src={profileData.image} alt="" />
      </div>
      <div className='flex-1 border border-stone-100 rounded-lg p-8 py-7 bg-white'>
        <div >
          {/*Name*/}
          <p className='flex items-center gap-2 text-3xl font-medium text-gray-700'>{profileData.name}</p>
          <p className='flex items-center gap-2 mt-1 text-gray-600'>{profileData.speciality}</p>
        </div>
        {/*About*/}
        <div>
          <p className='flex items-center gap-1 text-sm font-medium text-neutral-800 mt-3'>About</p>
          <p className='text-sm text-gray-60 max-w-[700px] mt-1'>
            {profileData.about}
          </p>
        </div>
        <div>
          <p className='flex gap-2 py-2'>Room Number</p>
          <p className='text-sm'>{isEdit ? <input type="text" onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))} value={profileData.address.line1} /> : profileData.address.line1}</p>
        </div>
        <div className='flex gap-1 pt-2'>
          <input onChange={() => isEdit && setProfileData(prev => ({ ...prev, available: !prev.available }))} checked={profileData.available} type="checkbox" />
          <label htmlFor="">Available</label>
        </div>
        {
          isEdit
            ? <button onClick={updateProfile} className='px-4 py-1 border border-primary text-sm rounded-full mt-5 hover:bg-primary hover:text-white transition-all'>Save</button>
            : <button onClick={() => setIsEdit(prev => !prev)} className='px-4 py-1 border border-primary text-sm rounded-full mt-5 hover:bg-primary hover:text-white transition-all'>Edit</button>
        }



      </div>

    </div>
  )
}

export default CounsellorProfile
