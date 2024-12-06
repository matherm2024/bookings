import validator from 'validator'
import bycrypt from 'bcrypt'
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import {v2 as cloudinary} from 'cloudinary'
import counselorModel from '../models/counselorModel.js'
import appointmentModel from '../models/appointmentModel.js'
import Joi from "joi"
import passwordComplexity from "joi-password-complexity"
import { sendEmail } from './sendEmail.js'
import resetTokenModel from '../models/resetToken.js'
import crypto from 'crypto';

// api to register user

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body

        if (!name || !password || !email) {
            return res.json({ success: false, message: "missing details" })

        }
        // validaing email format

        if (!validator.isEmail) {
            return res.json({ success: false, message: "enter a valid email" })

        }
        if (password.length < 8) {
            return res.json({ success: false, message: "enter a strong password" })
        }

        // hashing user password

        const salt = await bycrypt.genSalt(10)
        const hashedPassword = await bycrypt.hash(password, salt)

        const userData = {
            name,
            email,
            password: hashedPassword
        }

        const newUser = new userModel(userData)

        const user = await newUser.save()
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

        res.json({ success: true, token })




    } catch (error) {

        console.log(error)
        res.json({ success: false, message: error.message })

    }
}
//api for user login

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await userModel.findOne({ email })
        if (!user) {
            console.log(error)
            return res.json({ success: false, message: 'user does not exist' })
        }
        const isMatch = await bycrypt.compare(password, user.password)
        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: 'invalid credentials' })
        }


    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })

    }
}
 
// api to get user profile data

const getProfile = async (req, res) => {
    try {
        const { userId } = req.body

        const userData = await userModel.findById(userId).select('-password')

        res.json({ success: true, userData })



    } catch (error) {

        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// api to update user profile 

const updateProfile = async (req, res) => {
    try {
        const { userId, name, phone, address, dob, gender } = req.body
        const imageFile = req.file

        if (!name || !dob) {

            return res.json({ success: false, message: 'data missing' })

        }

        await userModel.findByIdAndUpdate(userId, { name, dob })

        if(imageFile){
            //upload image to cloudinary 
            const imageUpload = await cloudinary.uploader.upload(imageFile.path,{resource_type:'image'})
            const imageURL = imageUpload.secure_url

            await userModel.findByIdAndUpdate(userId, {image:imageURL})
        }

        res.json({success:true,message:'profile updated'})



    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// api to book appointment

const bookAppointment = async (req,res)=>{
    try {
        const {userId, docId, slotDate, slotTime} = req.body

        const docData = await counselorModel.findById(docId).select('-password')

        if (!docData.available){
            return res.json({success:false,message:'Counsellor Not Available'})
        }
        let slots_booked = docData.slots_booked
 
        // checking for slot avaialblity 

        if (slots_booked[slotDate]){
            if (slots_booked[slotDate].includes(slotTime)){
                return res.json({success:false,message:'Slot Not Available'})
            }else{
                slots_booked[slotDate].push(slotTime)
            }
        }else{
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)
        }

        const userData = await userModel.findById(userId).select('-password')

        delete docData.slots_booked
        
        const appointmentData = {
            userId,
            docId,
            userData,
            docData,
            amount:docData.fees,
            slotTime,
            slotDate,
            date: Date.now()
        }

        const newAppointment = new appointmentModel(appointmentData)
        await newAppointment.save()

        // save new slots data in docData

        await counselorModel.findByIdAndUpdate(docId, {slots_booked})

        res.json({success:true,message:'Appointment Booked'})

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
        
    }
}

// api for frontend my-appointment page

const listAppointment = async(req,res)=>{
    try {
        const {userId} = req.body
        const appointments = await appointmentModel.find({userId})
        res.json({success:true,appointments})

        
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
        
    }
}

// api to cancel appointment 

const cancelAppointment = async (req, res) => {
    try {

        const { userId, appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        // verify appointment user 
        if (appointmentData.userId !== userId) {
            return res.json({ success: false, message: 'Unauthorized action' })
        }

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


// **1. Send Password Reset Link**
const sendPasswordReset = async (req, res) => {
    try {
      const emailSchema = Joi.object({
        email: Joi.string().email().required().label("Email"),
      });
      const { error } = emailSchema.validate(req.body);
      if (error) return res.status(400).send({ message: error.details[0].message });
  
      const user = await userModel.findOne({ email: req.body.email });
      if (!user) return res.status(409).send({ message: "User with given email does not exist!" });
  
      let token = await resetTokenModel.findOne({ userId: user._id });
      if (!token) {
        token = await new resetTokenModel({
          userId: user._id,
          token: crypto.randomBytes(32).toString("hex"),
        }).save();
      }
  
      const url = `${process.env.FRONTEND_URL}/password-reset/${user._id}/${token.token}`;
      await sendEmail(user.email, "Password Reset", url);
  
      res.status(200).send({ message: "Password reset link sent to your email account" });
    } catch (error) {
      console.error("Error in sendPasswordReset:", error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  };
  
  // **2. Verify Password Reset Link**
  const verifyPasswordLink = async (req, res) => {
    try {
      const user = await userModel.findOne({ _id: req.params.id });
      if (!user) return res.status(400).send({ message: "Invalid link" });
  
      const token = await resetTokenModel.findOne({
        userId: user._id,
        token: req.params.token,
      });
      if (!token) return res.status(400).send({ message: "Invalid link" });
  
      res.status(200).send("Valid Url");
    } catch (error) {
      res.status(500).send({ message: "Internal Server Error" });
    }
  };
  
  // **3. Set New Password**
  const setNewPassword = async (req, res) => {
    try {
      console.log("Request Params:", req.params);
      console.log("Request Body:", req.body);
  
      const passwordSchema = Joi.object({
        password: passwordComplexity().required().label("Password"),
      });
      const { error } = passwordSchema.validate(req.body);
      if (error) {
        console.log("Validation Error:", error.details[0].message);
        return res.status(400).send({ message: error.details[0].message });
      }
  
      const user = await userModel.findOne({ _id: req.params.id });
      if (!user) {
        console.log("Invalid User");
        return res.status(400).send({ message: "Invalid link" });
      }
  
      const token = await resetTokenModel.findOne({
        userId: user._id,
        token: req.params.token,
      });
      if (!token) {
        console.log("Invalid Token");
        return res.status(400).send({ message: "Invalid link" });
      }
  
      const salt = await bycrypt.genSalt(Number(process.env.SALT));
      const hashPassword = await bycrypt.hash(req.body.password, salt);
  
      user.password = hashPassword;
      await user.save();
      await token.deleteOne(); 
  
      res.status(200).send({ message: "Password reset successfully" });
    } catch (error) {
      console.error("Internal Server Error:", error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  };
  
  
export {  sendPasswordReset, verifyPasswordLink, setNewPassword, registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment }