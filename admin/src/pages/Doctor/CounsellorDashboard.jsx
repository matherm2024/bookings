import React from 'react'
import { useContext } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { useEffect } from 'react'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const CounsellorDashboard = () => {
  const { cToken, dashData, setDashData, getDashData, completeAppointment, cancelAppointment, getProfileData, profileData, getUserData, setUserData, getCounsellorsData, doctors } = useContext(DoctorContext)
  const { slotDateFormat } = useContext(AppContext)
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const [userInfo, setUserInfo] = useState(null);
  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([])
  const [slotIndex, setSlotIndex] = useState(0)
  const [slotDate, setSlotDate] = useState('')
  const [slotTime, setSlotTime] = useState('')
  const [docId, setDocId] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [email, setEmail] = useState('')
  const [date, setDate] = useState('')
  const { userData } = useContext(DoctorContext);



  const fetchDocInfo = async () => {

    const docInfo = doctors.find(item => item._id === docId)
    setDocInfo(docInfo)
  };
  useEffect(() => {
    fetchDocInfo()

  }, [doctors, docId]);


  useEffect(() => {
    if (cToken) {
      getDashData()
      getProfileData()
      getUserData()
      getCounsellorsData()
      setUserInfo(removeNumberedKeys(userData))
      setDocId(profileData._id)
      console.log('here', email);
      console.log(slotTime);
      console.log(userData);

    }

  }, [cToken])







  function removeNumberedKeys(array) {
    // Check if the input is an array
    if (!Array.isArray(array)) {
      console.error('Input is not an array');
      return [];
    }

    // Process the array
    return array.map(item => {
      const numberedKey = Object.keys(item)[0]; // Get the first key
      if (numberedKey) {
        return item;
      } else {
        console.error('Object does not have a numbered key:', item);
        return null; // Return null for invalid objects
      }
    }).filter(Boolean); // Remove null or undefined results
  }



  const formatDate = async (date) => { //not sure why this is here, but i'm leaving it in idk 
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    return slotDate = `${day}_${month}_${year}`;

  }

  const bookAppointment = async (e) => {
    e.preventDefault();

    if (!cToken) {
      toast.warn('Login to book an appointment');
      return navigate('/login');
    }

    // Retrieve email from local storage
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
      setUserEmail(storedEmail); // Set the email in state from local storage
    }

    if (storedEmail) {
      try {
        const day = new Date(date).getDate();
        const month = new Date(date).getMonth() + 1;
        const year = new Date(date).getFullYear();
        const slotDate = `${day}_${month}_${year}`;

        console.log('Booking payload:', { docId, slotDate, slotTime, userEmail: storedEmail }); // Debug payload

        const { data } = await axios.post(
          `${backendUrl}/api/doctor/book`,
          { docId, slotDate, slotTime, userEmail: storedEmail },
          { headers: { cToken } }
        );

        if (data.success) {
          toast.success(data.message);
          getCounsellorsData();
          getDashData();

          // Clear inputs after successful booking
          setEmail('');
          setDate('');
          setSlotTime('');
          localStorage.removeItem('userEmail'); // Optional: Clear email from local storage
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        console.error('Booking error:', error);
        toast.error(error.message);
      }
    } else {
      toast.warn('Email not found in local storage. Please provide a valid email.');
    }
  };

  // Update the email state and save it to local storage
  const handleEmailChange = (e) => {
    const emailValue = e.target.value;
    setEmail(emailValue); // Update the email state
    localStorage.setItem('userEmail', emailValue); // Save the email to local storage
  };





  return dashData && (
    <div className='m-5 w-6/12'>
      <div className='w-6/12'>


        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.appointment_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600 '>{dashData.appointmentNumber.length}</p>
            <p className='text-gray-400'>Appointments</p>
          </div>
        </div>


      </div>
      <div className='bg-white'>

        <div className='flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border'>
          <img src={assets.list_icon} alt="" />
          <p className='font-semibold'>Latest Bookings </p>
        </div>
        <div className='pt-4 border border-t-0'>
          {
            dashData.latestAppointments.map((item, index) => (
              <div className='flex items-center px-6 py-3 gap-3 hover:bg-gray-100' key={index}>
                <img className='rounded-full w-10' src={item.userData.image} alt="" />
                <div className='flex-1 text-sm'>
                  <p className='text-gray-800 font-medium'>{item.userData.name}</p>
                  <p className='text-gray-600'>{slotDateFormat(item.slotDate)} {item.slotTime}</p>
                </div>
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
          <div className='flex items-center gap-2 bg-white border-t border-gray-300 '>
            <div>
              <div className='flex items-center gap-2 bg-white p-4 min-w-52 '>
                <img className='w-10' src={assets.add_icon} alt="" />
                <div>
                  <p className='text-gray-400'>Book Appointment</p>
                </div>
              </div >
              <form className=" px-5" action="" >
                <div className='container mx-auto'>
                  <p >Pupil/Staff Email</p>
                  <input
                    onChange={handleEmailChange} // Updated handler
                    value={email}
                    className="border border-zinc-300 rounded w-full p-2 mt-1"
                    type="text"
                  />
                </div>
                <div className='container mx-auto'>
                  <p>Set Time</p>
                  <input value={slotTime} onChange={(e) => setSlotTime(e.target.value)} className='border border-zinc-300 rounded w-full p-2 mt-1' type="time" />
                </div>
                <div className='container mx-auto'>
                  <p>Set Date</p>
                  <input value={date} onChange={(e) => setDate(e.target.value)} className='border border-zinc-300 rounded w-full p-2 mt-1' type="date" />
                </div>
                <div >
                  <button onClick={bookAppointment} className='px-4 py-1 border border-primary text-sm rounded-full mt-5 hover:bg-primary hover:text-white transition-all'>Book Appointment</button>
                </div>
              </form>
            </div>
          </div>

        </div>
      </div>



    </div>
  )
}

export default CounsellorDashboard
