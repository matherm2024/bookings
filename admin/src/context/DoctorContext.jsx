import { useState } from "react";
import { createContext } from "react";
import axios from 'axios'
import {toast} from 'react-toastify'
import { useEffect } from "react";


export const DoctorContext = createContext()

const DoctorContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    
    const [cToken, setCToken] = useState(localStorage.getItem('cToken')? localStorage.getItem('cToken'):'')

    const [appointments, setAppointments] = useState([]) 

    const [dashData, setDashData] = useState(false)

    const [profileData, setProfileData] = useState(false)

    const [userData, setUserData] = useState([])

    const [doctors, setDoctors] = useState([])
    
    const [testData, setTestData] = useState([])

    const [allAppointments, setAllAppointments] = useState([])

    const getAllAppointments = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/doctor/cCalender`, { headers: { cToken } });
    
            if (data.success) {
                setAllAppointments(data.allAppointments);
                console.log("API Response:", data.allAppointments)
                return data.allAppointments
                
                
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Failed to fetch appointments.");
        }
    };
    

    const getAppointments = async ()=>{
        try {
            const {data} = await axios.get(backendUrl + '/api/doctor/appointments',{headers:{cToken}})

            if (data.success) {
                setAppointments(data.appointments) 
                
                
                
            }else{
                toast.error(data.message)

            }
            
        } catch (error) {
            console.log(error);
            toast.error(error.message)
            
            
        }
    }

    const completeAppointment = async (appointmentId)=>{
        try {
            const {data} = await axios.post(backendUrl + '/api/doctor/complete-appointment', {appointmentId},{headers:{cToken}})
            if (data.success) {
                toast.success(data.message)
                getAppointments()
                
            }else{
                toast.error(data.message)
            }

            
        } catch (error) {
            console.log(error);
            toast.error(error.message)
            
        }

    }
    const cancelAppointment = async (appointmentId)=>{
        try {
            const {data} =  await axios.post(backendUrl + '/api/doctor/cancel-appointment', { appointmentId }, { headers: { cToken } })
            if (data.success) {
                toast.success(data.message)
                getAppointments()
                
            }else{
                toast.error(data.message)
            }

            
        } catch (error) {
            console.log(error);
            toast.error(error.message)
            
        }

    }
    const getDashData = async () => {
        try {

            const {data} = await axios.get(backendUrl+'/api/doctor/dashboard', {headers:{cToken}})
            if (data.success) {
                setDashData(data.dashData)
                console.log(data.dashData);
                
                
                
                
            }else{
                toast.error(data.message)
            }
            
        } catch (error) {
            console.log(error);
            toast.error(error.message)
            
        }
        
    }

    const getProfileData = async () => {
        try {
            const {data} =await axios.get(backendUrl+'/api/doctor/profile', {headers:{cToken}})
            if (data.success) {
                setProfileData(data.profileData)
                
                
                
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }



    const getUserData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/doctor/getUserData', { headers: { cToken } });
            

            

            // Update testData
            setTestData(1); // Set to 1 to check if it's updating
            

            if (data.success) {
                setUserData(data.profileData);
                

              
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            toast.error(error.message);
        }
    };

    const getCounsellorsData = async () => {

        try {

            const { data } = await axios.get(backendUrl + '/api/doctor/list')
            if (data.success) {
                setDoctors(data.doctors)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }

    }



    const value = {
        cToken,
        setCToken,
        backendUrl,
        appointments,
        setAppointments,
        getAppointments,
        completeAppointment,
        cancelAppointment,
        dashData,
        setDashData,
        getDashData,
        profileData, setProfileData, getProfileData,
        getUserData,
        setUserData,
        userData,
        getCounsellorsData,
        doctors,
        getAllAppointments,
        setAllAppointments,
        allAppointments
        
    }
    return(
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    )

}

export default DoctorContextProvider