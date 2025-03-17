import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import { toast } from 'react-toastify';
import axios from 'axios';






const Appointment = () => {
  const { docId } = useParams();
  const { doctors, backendUrl, token, getCounsellorsData } = useContext(AppContext);
  const daysOfWeek = ['SUN','MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']


  const navigate = useNavigate()


  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([])
  const [slotIndex, setSlotIndex] = useState(0)
  const [slotTime, setSlotTime] = useState('')
  const [holInfo, setHolInfo]= useState([])
  const [holidays, setHoliday]= useState([])


  // Fetch doctor information based on docId


  const fetchDocInfo = async () => {
    const docInfo = doctors.find(item => item._id === docId)
    setDocInfo(docInfo)
  };
  const getHoliday = async () => {
    try {
        const { data } = await axios.get(`${backendUrl}/api/doctor/list-holiday`);

        if (data.success) {
            setHoliday(data.holidays); // Ensure this function is defined
            
            
        } else {
            toast.error(data.message || "Failed to fetch holidays.");
        }
    } catch (error) {
        console.error("Error fetching holidays:", error);

        // Handle different error cases
        if (error.response) {
            // Server responded with a status code outside 2xx
            toast.error(error.response.data?.message || "Server Error");
        } else if (error.request) {
            // Request was made, but no response received
            toast.error("No response from server. Check network.");
        } else {
            // Something else went wrong
            toast.error(error.message);
        }
    }
};


const fetchHolInfo = async () => {
  if (holidays && Array.isArray(holidays)) {

    // Filter all holidays for the current doctor
    const allHolidaysForDoctor = holidays.filter(item => {

      return item.docData._id === docId;
    });


    setHolInfo(allHolidaysForDoctor); // Set holInfo to the list of all holidays for the doctor
  } else {
    console.error("holidays is not an array:", holidays);
  }
};
 
//change period times here! somtimes the time format changes from 24 hour to 12 hour and I don't know why, please just go with it
const displayPeriods = (slotTime)=>{
    if(slotTime.includes('9:10') || slotTime.includes('8:50') ){
      const period1 = 'Period 1'
      return period1
    }else if (slotTime.includes('9:50') || slotTime.includes('9:30')) {
      const period2 = 'Period 2'
      return period2


    }else if (slotTime.includes('10:30') || slotTime.includes('10:50')) {
      const period3 = 'Period 3'
      return period3


    }else if (slotTime.includes('11:10') || slotTime.includes('11:30')) {
      const period4 = 'Period 4'
      return period4


    }else if (slotTime.includes('12:10') || slotTime.includes('11:50') ) {
      const period5 = 'Period 5'
      return period5


    }else if (slotTime.includes('02:00') || slotTime.includes('01:40') || slotTime.includes('13:40') || slotTime.includes('14:00')) {
      const period6 = 'Period 6'
      return period6


    }else if (slotTime.includes('02:40') || slotTime.includes('02:20') || slotTime.includes('14:20') || slotTime.includes('14:40')) {
      const period7 = 'Period 7'
      return period7


    }else if (slotTime.includes('03:00') || slotTime.includes('03:20') || slotTime.includes('15:20') || slotTime.includes('15:00')) {
      const period8 = 'Period 8'
      return period8


    }else if (slotTime.includes('12:25') || slotTime.includes('12:50')) {
      const period8 = 'Lunch Slot'
      return period8


    }else{
      return ' '
    }


}




const getAvailableSlots = async () => {
  setDocSlots([]); // Clear existing slots
  const today = new Date();
  const now = new Date(); // Get the current date and time

  for (let i = 0; i < 100; i++) {
    const currentDate = new Date(today);
    currentDate.setDate(today.getDate() + i);

    const dayOfWeek = currentDate.getDay();
    const workingDays = JSON.parse(docInfo.daysWorking);

    // Only the days the person works
    if (!workingDays.includes(dayOfWeek)) continue;

    // Check if the current date falls within any holiday range
    if (holInfo && holInfo.length > 0) {
      const isHoliday = holInfo.some(holiday => {
        const [startDay, startMonth, startYear] = holiday.startDate.split('_').map(Number);
        const [endDay, endMonth, endYear] = holiday.endDate.split('_').map(Number);
      
        const startDate = new Date(startYear, startMonth - 1, startDay);
        const endDate = new Date(endYear, endMonth - 1, endDay);
      
        
      
        return currentDate >= startDate && currentDate <= endDate;
      });
      
      

      // Skip generating slots for holidays
      if (isHoliday) continue;
    }

    let slotBlocks = [];

    // Define custom slot blocks END IS NOT THE START TIME OF THE LAST AVAILABLE SESSION BUT THE END TIME
    if (dayOfWeek === 1) { // Monday
      slotBlocks = [
        { start: "08:50", end: "10:10", duration: 40 },
        { start: "10:30", end: "12:20", duration: 40 },
        { start: "12:25", end: "13:05", duration: 40 },
        { start: "13:40", end: "15:40", duration: 40 }
      ];
    } else if (dayOfWeek === 2) { // Tuesday
      slotBlocks = [
        { start: "09:10", end: "10:30", duration: 40 },
        { start: "10:50", end: "12:45", duration: 40 },
        { start: "12:50", end: "13:30", duration: 40 },
        { start: "14:00", end: "16:00", duration: 40 }
      ];
    } else if (dayOfWeek === 3) { // Wednesday
      slotBlocks = [
        { start: "08:50", end: "10:10", duration: 40 },
        { start: "10:30", end: "12:20", duration: 40 },
        { start: "12:25", end: "12:40", duration: 40 },
        { start: "14:00", end: "16:00", duration: 40 }
      ];
    } else if (dayOfWeek === 4) { // Thursday
      slotBlocks = [
        { start: "09:10", end: "10:30", duration: 40 },
        { start: "10:50", end: "12:45", duration: 40 },
        { start: "12:50", end: "13:30", duration: 40 },
        { start: "14:00", end: "16:00", duration: 40 }
      ];
    } else if (dayOfWeek === 5) { // Friday
      slotBlocks = [
        { start: "09:10", end: "10:30", duration: 40 },
        { start: "10:50", end: "12:45", duration: 40 },
        { start: "12:50", end: "13:30", duration: 40 },
        { start: "14:00", end: "16:00", duration: 40 }
      ];
    }

    let timeSlots = [];

    // Process each slot block for the current day
    for (let block of slotBlocks) {
      const [startHour, startMinute] = block.start.split(":").map(Number);
      const [endHour, endMinute] = block.end.split(":").map(Number);

      const blockStartTime = new Date(currentDate);
      blockStartTime.setHours(startHour, startMinute, 0, 0);

      const blockEndTime = new Date(currentDate);
      blockEndTime.setHours(endHour, endMinute, 0, 0);

      // Generate slots within the current block
      while (blockStartTime < blockEndTime) {
        // Skip times that have already passed
        if (currentDate.toDateString() === now.toDateString() && blockStartTime < now) {
          blockStartTime.setMinutes(blockStartTime.getMinutes() + block.duration);
          continue;
        }

        let formattedTime = blockStartTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        let day = blockStartTime.getDate();
        let month = blockStartTime.getMonth() + 1;
        let year = blockStartTime.getFullYear();

        const slotDate = `${day}_${month}_${year}`;
        const slotTime = formattedTime;

        const isSlotAvailable = !(
          docInfo.slots_booked[slotDate] &&
          docInfo.slots_booked[slotDate].includes(slotTime)
        );

        if (isSlotAvailable) {
          // Add slot to the array
          timeSlots.push({
            datetime: new Date(blockStartTime),
            time: formattedTime
          });
        }

        // Increment by the block's specific duration
        blockStartTime.setMinutes(blockStartTime.getMinutes() + block.duration);
      }
    }

    // Append the day's time slots to the state
    setDocSlots(prev => [...prev, timeSlots]);
  }
};

 
 
  const bookAppointment = async () =>{
    if (!token){
      toast.warn('login to book appointment')
      return navigate('/login')
    }


    try {
      const date = docSlots[slotIndex][0].datetime


      let day = date.getDate()
      let month = date.getMonth()+1
      let year = date.getFullYear()


      const slotDate = day + "_" + month + "_" + year


      const { data } = await axios.post(backendUrl + '/api/user/book-appointment', {docId,slotDate,slotTime}, {headers:{token}})
      if(data.success){
        toast.success(data.message)
        getCounsellorsData()
        navigate('/my-appointments')
        
      }else{
        toast.error(data.message)
      }
     
     
    } catch (error) {
      console.log(error);
      toast.error(error.message);
     
     
    }


  }

 




 


  // Call fetchDocInfo when doctors or docId changes
  useEffect(() => {
    fetchDocInfo()
   
  }, [doctors, docId]);
  useEffect(() => {
    fetchHolInfo()

   
  }, [holidays, docId]);


  useEffect(()=>{
    getAvailableSlots()


  },[docInfo])


  useEffect(()=>{

  }, [docSlots])

  useEffect(() => {
    getHoliday();  
}, []);

useEffect(() => {
  console.log("holInfo updated:", holInfo);
}, [holInfo]);









  return docInfo && (
    <div>
      {/* details */}
      <div className='flex flex-col sm:flex-row gap-4'>
        <div>
          <img className='w-9 sm:w-9 md:w-60 bg-red-500 rounded-lg' src={docInfo.image} alt="" />
        </div>




        <div className='felx-1 border border-grey-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0 w-full'>
          {/* counsellor information*/}
          <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>{docInfo.name}
          </p>
          <div className='flex items-center gap2 text-sm mt-1 text-gray-600'>
            <p>{docInfo.speciality}</p>
          </div>
          {/*Counsellor about */}
          <div>
            <p className='felx items-center gap-1 text-sm font-medium text-gray-900 mt-3'>
              About <img src={assets.info_icon} alt="" />
              </p>
            <p className='text-sm text-gray-500 max-w-[700px] mt-1'>{docInfo.about}</p>
          </div>




        </div>




      </div>
      {/*booking slots*/}
      <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
        <p>Booking Slots</p>
        <div className='flex gap-3 item-center w-full overflow-x-scroll mt-4'>
          {
            docSlots.length && docSlots.map((item,index)=>(
              <div onClick={()=> setSlotIndex(index)} className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex == index ? 'bg-red-500 text-white' : 'border border-gray-200'}`}              key={index}>
                <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                <p>{item[0] && item[0].datetime.getDate()}</p>
              </div>


            ))
          }
        </div>
        <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
          {docSlots.length && docSlots[slotIndex].map((item, index)=>(
            <p onClick={()=>setSlotTime(item.time)} className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? 'bg-red-500 text-white' : 'text-gray-400 border border-gray-300'}`}key={index}>
              {displayPeriods(item.time.toLowerCase())}
              <br />
              {item.time.toLowerCase()}
             


            </p>


          ))}


        </div>
        <button onClick={bookAppointment} className='bg-red-500 text-white text-sm font-light px-14 py-3 rounded-full my-6'>Book an Appointment</button>


      </div>




    </div>
  )










};




export default Appointment;
