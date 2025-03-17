import { createContext, useEffect, useState } from "react";
//import { doctors } from "../assets/assets";
import axios from 'axios'
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
    const currencySymbol = '£'
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [doctors, setDoctors] = useState([])
    const [token, setToken] = useState(localStorage.getItem('token')?localStorage.getItem('token'):false)
    const [userData,setUserData] = useState(false)
    const [holidays, setHoliday] = useState([])

    

    const getCounsellorsData = async () => {

        try {

            const { data } = await axios.get(backendUrl+'/api/doctor/list')
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
    const getHoliday = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/doctor/list-holiday`);
    
            if (data.success) {
                setHoliday(data); // Ensure this function is defined
                console.log(data);
                
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
    


    const loadUserProfileData = async () => {

        try {

            const { data } = await axios.get(backendUrl+'/api/user/get-profile', { headers: { token } })

            if (data.success) {
                setUserData(data.userData)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }

    }



    const value = {
        doctors, 
        getCounsellorsData,
        currencySymbol,
        token, 
        setToken,
        backendUrl,
        userData,
        setUserData,
        loadUserProfileData,
        getHoliday,
        holidays
    }


    useEffect (()=>{
        console.log('testing');
        
        getCounsellorsData()

    },[])

    useEffect(()=>{

        if (token){
            loadUserProfileData()
        }

    }, [token])

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;

