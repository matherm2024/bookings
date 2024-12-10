import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import { AdminContext } from '../../context/AdminContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const AddDoctor = () => {

    const [docImg, setDocImg] = useState(false)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [experiance, setExperiance] = useState('N/A')
    const [fee, setFee] = useState('')
    const [about, setAbout] = useState('')
    const [speciality, setSpeciality] = useState('School Counsellor')
    const [degree, setDegree] = useState('')
    const [address, setAddress] = useState('')
    const [daysWorking, setDaysWorking] = useState([])

    const {backendUrl, aToken} = useContext(AdminContext)

    const onSubmitHandler = async (event)=>{
        event.preventDefault()
        try {
            if (!docImg){

                return toast.error('Image Not Selected')
            }
            const formData = new FormData()
            formData.append('image', docImg)
            formData.append('name', name)
            formData.append('email', email)
            formData.append('password', password)
            formData.append('experience', experiance)
            formData.append('fees', Number(fee))
            formData.append('about', about)
            formData.append('speciality', speciality)
            formData.append('degree', degree)
            formData.append('address', JSON.stringify({line1:address, line2:email}))
            formData.append('daysWorking', JSON.stringify(daysWorking))

            // console log formdata
            formData.forEach((value,key)=>{
                console.log(`${key} : ${value}`);
                
            })
            const {data} = await axios.post(backendUrl + '/api/admin/add-counselor', formData, {headers:{aToken}})
            
            if (data.success){
                toast.success(data.message)
                setDocImg(false)
                setName('')
                setPassword('')
                setEmail('')
                setAddress('')
                setDegree('')
                setAbout('')
                setFee('')
                setDaysWorking('');
                
            }else{
                toast.error(data.message)
            }
            

        } catch (error){
            toast.error(error.message)
            console.log(error)

        }

    }

    const handleDaysWorkingChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => parseInt(option.value, 10));
        setDaysWorking(selectedOptions);
      };
    



    return (
        <form onSubmit={onSubmitHandler} className='m-5 w-full' action="">
            <p className='mb-3 text-lg font-medium'>Add Counsellor</p>
            <div className='bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll'>
                <div className='flex items-center gap-4 mb-8 text-gray-500'>
                    <label htmlFor="doc-img">
                        <img className='w-16 bg-grey-100 rounded-full cursor-pointer' src={docImg? URL.createObjectURL(docImg) : assets.upload_area} alt="" />
                    </label>
                    <input onChange={(e)=> setDocImg(e.target.files[0])} type="file" id='doc-img' hidden />
                    <p> Upload Counsellor <br /> Picture</p>
                </div>
                <div className='flex flex-col lg:flex-row items-start gap-10 text-gray-600'>
                    <div className='w-full lg:flex-1 flex-col gap-4'>
                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Counsellor Name</p>
                            <input onChange={(e)=> setName(e.target.value)} value={name} className='border rounded px-3 py-2' type="text" placeholder='Name' required />
                        </div>
                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Counsellor Email</p>
                            <input onChange={(e)=> setEmail(e.target.value)} value={email}  className='border rounded px-3 py-2' type="email" placeholder='Email' required />
                        </div>
                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Counsellor Password</p>
                            <input onChange={(e)=> setPassword(e.target.value)} value={password}   className='border rounded px-3 py-2' type="password" placeholder='Password' required />
                        </div>
                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Experiance</p>
                            <select onChange={(e)=> setExperiance(e.target.value)} value={experiance}  className='border rounded px-3 py-2' name="" id="">
                                <option value="n/a">N/A</option>
                            </select>
                        </div>
                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Fee</p>
                            <input onChange={(e)=> setFee(e.target.value)} value={fee}   className='border rounded px-3 py-2' type="number" placeholder='Fee'  />
                        </div>

                    </div>
                    <div className='w-full lg:flex-1 felx-col gap-4'>
                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Speciality</p>
                            <select onChange={(e)=> setSpeciality(e.target.value)} value={speciality} className='border rounded px-3 py-2' name="" id="">
                                <option value="School Counsellor">School Counsellor</option>
                            </select>
                        </div>
                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Education</p>
                            <input onChange={(e)=> setDegree(e.target.value)} value={degree}  className='border rounded px-3 py-2' type="text" placeholder='Education'  />
                        </div>
                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Room in Building</p>
                            <input onChange={(e)=> setAddress(e.target.value)} value={address}  className='border rounded px-3 py-2' type="text" placeholder='Room Number' required />
                        </div>
                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Days Working <span className='text-red-500'>CTRL click to select multiple</span> </p>
                            <select onChange={handleDaysWorkingChange} value={daysWorking}  className='border rounded px-3 py-2' name="" id="" multiple>
                                <option value="1">Mon</option>
                                <option value="2">Tue</option>
                                <option value="3">Wed</option>
                                <option value="4">Thu</option>
                                <option value="5">Fri</option>                                
                            </select>
                        </div>
                    </div>

                </div>           
                    <div>
                        <p className='mt-4 mb-2'>About</p>
                        <textarea onChange={(e)=> setAbout(e.target.value)} value={about}  className='w-full px-4 pt-2 border rounded' placeholder='write about counsellor' rows={5} required />
                    </div>
                    <button className='bg-primary px-10 py-3 mt-4 text-white rounded-full'>Add Counsellor</button>
            </div>
        </form>
    )
}

export default AddDoctor
