import axios from "axios";
import { createContext, useState } from "react";
import { toast } from "react-toastify";



export const AdminContext = createContext()


const AdminContextProvider = (props) => {
    const [aToken, setAToken] = useState(localStorage.getItem('aToken')? localStorage.getItem('aToken'):'')
    const [counsellors, setCounsellors] = useState([])
    const [appointments, setAppointments] = useState([])
    const [dashData, setDashData] = useState(false)


    const backendUrl = import.meta.env.VITE_BACKEND_URL


    const getAllCounsellors = async ()=>{
        try {
            const {data} = await axios.post(backendUrl+'/api/admin/all-counsellors', {}, {headers:{aToken}})
            
            
            if (data.success){
                setCounsellors(data.counsellors)
                console.log(data.counsellors);
                

            }else{
                toast.error(data.message)
            }
            
        } catch (error) {
            toast.error(error.message)
            
            
        }
    }

    const changeAvailability = async (docId)=> {
        try {

            const {data} = await axios.post(backendUrl+'/api/admin/change-availability', {docId}, {headers: {aToken}})
            if (data.success) {
                toast.success(data.message)
                getAllCounsellors()
            }else{
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
            
            
        }

    }

    const getAllAppointments = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/admin/appointments`, { headers: { aToken } });
            if (data.success && Array.isArray(data.appointments)) {
                setAppointments(data.appointments); // Ensure this updates the state
                return data.appointments; // Return the fetched appointments
            } else {
                setAppointments([]);
                return [];
            }
        } catch (error) {
            console.error("Error fetching appointments:", error);
            setAppointments([]);
            return [];
        }
    };
    

    const cancelAppointment = async (appointmentId) =>{
        try {

            const {data} = await axios.post(backendUrl+'/api/admin/cancel-appointment', {appointmentId},{headers:{aToken}})

            if (data.success){
                toast.success(data.message)
                getAllAppointments()
            }else{
                toast.error(data.message)
            }
            
        } catch (error) {
            toast.error(data.message)

            
        }
    }

    const getDashData = async()=>{
        try {

            const {data} = await axios.get(backendUrl+'/api/admin/dashboard', {headers:{aToken}})
            if (data.success){
                setDashData(data.dashData)
                console.log(data.dashData);
                
            }else{
                toast.error(error.message)
            }
            
        } catch (error) {
            toast.error(data.message)
            
        }
    }


    const value = {
        aToken,
        setAToken,
        backendUrl, 
        counsellors,
        getAllCounsellors,
        changeAvailability,
        appointments,
        setAppointments,
        getAllAppointments,
        cancelAppointment,
        dashData,
        getDashData

    }
    return(
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )


}


export default AdminContextProvider
