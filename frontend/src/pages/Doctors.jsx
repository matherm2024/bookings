import React, { useContext, useState } from 'react'
import TopDoctors from '../components/TopDoctors'
import { AppContext } from '../context/AppContext'

const Doctors = () => {
  const {doctors} = useContext(AppContext)
  const [filterDoc,setFilterDoc] = useState([])


  return (
    <div>
      <TopDoctors/>
    </div>
  )
}

export default Doctors
