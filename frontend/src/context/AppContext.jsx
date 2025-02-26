import { createContext, useEffect, useState } from "react";
//import { doctors } from "../assets/assets";
import axios from 'axios'
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
    const currencySymbol = '£'
    const backendUrl = http://clsgbookingdb.uksouth.cloudapp.azure.com

    const [doctors, setDoctors] = useState([])
    const [token, setToken] = useState(localStorage.getItem('token')?localStorage.getItem('token'):false)
    const [userData,setUserData] = useState(false)

    

    const getCounsellorsData = async () => {

        try {

            const { data } = await axios.get('http://clsgbookingdb.uksouth.cloudapp.azure.com /api/doctor/list')
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

    const loadUserProfileData = async () => {

        try {

            const { data } = await axios.get('http://clsgbookingdb.uksouth.cloudapp.azure.com/api/user/get-profile', { headers: { token } })

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
        loadUserProfileData
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
