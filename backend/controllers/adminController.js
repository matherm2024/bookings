import validator from "validator";
import bcrypt from 'bcrypt'
import { v2 as cloudinary } from "cloudinary"
import counselorModel from "../models/counselorModel.js"
import jwt from 'jsonwebtoken';
import appointmentModel from "../models/appointmentModel.js";
import userModel from "../models/userModel.js";


// API for adding counselor
const addCounselor = async (req, res) => {
    try {

        const { name, email, password, speciality, degree, experience, about, fees, address, daysWorking } = req.body
        const imageFile = req.file
        console.log({ name, email, password, speciality, degree, experience, about, fees, address, daysWorking }, imageFile);

        // checking that all data for doctor has been included 
        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
            return res.json({ success: false, message: "Missing Details" })
        }

        // validating email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })

        }
        // validating strong password 
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a password of 8 charactors or more" })

        }
        // hasing conselor password 
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // upload img to cloundinary 
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { ressource_type: "image" })
        const imageUrl = imageUpload.secure_url

        const counselorData = {
            name,
            email,
            image: imageUrl,
            password: hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address: JSON.parse(address),
            date: Date.now(),
            daysWorking
        }
        const newCounselor = new counselorModel(counselorData)
        await newCounselor.save()
        res.json({ success: true, message: 'counselor added' })



    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })

    }



}


//api for admin login

const loginAdmin = async (req, res) => {
    try {

        const { email, password } = req.body
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {

            const token = jwt.sign(email + password, process.env.JWT_SECRET)
            res.json({ success: true, token })


        } else {
            res.json({ success: false, message: "Invalid Email and Password" })
        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })

    }
}

// API to get all counsellors list for admin panel 

const allCounsellors = async (req, res) => {
    try {
        const counsellors = await counselorModel.find({}).select('-password')
        res.json({ success: true, counsellors })

    } catch (error) {

        console.log(error)
        res.json({ success: false, message: error.message })

    }

}

// api to get all appointments list

const appointmentsAdmin = async (req, res) => {
    try {

        const appointments = await appointmentModel.find({})

        res.json({ success: true, appointments })

    } catch (error) {

        console.log(error)
        res.json({ success: false, message: error.message })

    }
}



// api to cancel appointment 

const appointmentCancel = async (req, res) => {
    try {

        const { appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)


        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

        // releasing doctor slot 
        const { docId, slotDate, slotTime } = appointmentData

        const doctorData = await counselorModel.findById(docId)

        let slots_booked = doctorData.slots_booked

        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)

        await counselorModel.findByIdAndUpdate(docId, { slots_booked })

        res.json({ success: true, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// api to get dashboard data for admin panel 

const adminDashboard = async (req,res) =>{
    try {

        const doctors = await counselorModel.find({})
        const users = await userModel.find({})
        const appointments = await appointmentModel.find({})

        const dashData = {
            doctors: doctors.length,
            appointments: appointments.length,
            patients: users.length,
            latestAppointments: appointments.reverse().slice(0,5)
        }

        res.json({success:true,dashData})
        
    } catch (error) {

        console.log(error)
        res.json({ success: false, message: error.message })
        
    }
}

export { addCounselor, loginAdmin, allCounsellors, appointmentsAdmin, appointmentCancel, adminDashboard }