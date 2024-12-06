
import counselorModel from "../models/counselorModel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/appointmentModel.js";
import userModel from "../models/userModel.js";
import bycrypt from 'bcrypt'
import crypto from 'crypto';
import Joi from "joi"
import passwordComplexity from "joi-password-complexity"
import { sendEmail } from './sendEmail.js'
import resetTokenModel from '../models/resetToken.js'


const changeAvailablity = async (req, res) => {
    try {
        const { docId } = req.body
        const docData = await counselorModel.findById(docId)
        await counselorModel.findByIdAndUpdate(docId, { available: !docData.available })
        res.json({ success: true, message: 'Availability Changed' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

const doctorList = async (req, res) => {
    try {
        const doctors = await counselorModel.find({}).select(['-password', '-email'])
        res.json({ success: true, doctors })

    } catch (error) {

        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// api for counsellor login

const loginCouncellor = async (req, res) => {

    try {

        const { email, password } = req.body
        const counsellor = await counselorModel.findOne({ email })

        if (!counsellor) {
            return res.json({ success: false, message: 'Invaild Email or Password' })
        }

        const isMatch = await bcrypt.compare(password, counsellor.password)

        if (isMatch) {
            const token = jwt.sign({ id: counsellor._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            return res.json({ success: false, message: 'Invaild Email or Password' })
        }


    } catch (error) {

        console.log(error)
        res.json({ success: false, message: error.message })

    }

}

// api to get doctor appointments for doctor panel

const appointmentsCounsellor = async (req, res) => {
    try {

        const { docId } = req.body
        const appointments = await appointmentModel.find({ docId })

        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })

    }
}
// api to get clender appointments (take ID out)

const appointmentsCalendarCounsellor = async (req, res) => {
    try {

        
        const allAppointments = await appointmentModel.find({})
        

        res.json({ success: true, allAppointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })

    }
}

// api to mark appointment compleated for councellor panel

const appointmentComplete = async (req, res) => {
    try {
        const { docId, appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)

        if (appointmentData && appointmentData.docId === docId) {

            await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true })
            return res.json({ success: true, message: 'Appointment Completed' })
        } else {
            return res.json({ success: false, message: 'Mark Failed' })
        }




    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })

    }
}

// api to cancel appointment from councellor panel

const appointmentCancel = async (req, res) => {
    try {
        const { docId, appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)

        if (appointmentData && appointmentData.docId === docId) {

            await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })
            return res.json({ success: true, message: 'Appointment Cancelled' })
        } else {
            return res.json({ success: false, message: 'Failed to Cancel Appointment' })
        }




    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })

    }
}

//  api for dash data

const councellorDashboard = async (req, res) => {
    try {
        const { docId } = req.body
        const appointments = await appointmentModel.find({ docId })



        let appointmentNumber = []

        appointments.map((item) => {
            if (!item.isCompleted && !item.cancelled) {
                appointmentNumber.push(item._id)
            }
        })

        let patients = []

        appointments.map((item) => {
            if (!patients.includes(item.userId)) {
                patients.push(item.userId)

            }

        })
        const dashData = {
            appointments: appointments.length,
            patients: patients.length,
            latestAppointments: appointments.reverse().slice(0, 5),
            appointmentNumber: appointmentNumber

        }

        res.json({ success: true, dashData })


    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })

    }

}


// api to get counsellor profile for counsellor panel

const counsellorProfile = async (req,res) => {
    try {
        const { docId } = req.body
        const profileData = await counselorModel.findById(docId).select('-password')

        res.json({ success: true, profileData })


    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}
// api for user data 

const getUserData = async (req,res) => {
    try {
        
        const profileData = await userModel.find({}).select('-password')

        res.json({ success: true, profileData })


    } catch (error) {
        
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}



// api to update counsellor profile from counsellor panel

const updateCousellorProfile = async (req, res) => {

    try {

        const { docId, address, available } = req.body
        await counselorModel.findByIdAndUpdate(docId, { address, available })
        res.json({ success: true, message: 'Profile Updated' })



    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}
// api to book appointment

const bookAppointment = async (req, res) => {
    try {
        const { userEmail, docId, slotDate, slotTime } = req.body;

        console.log('Received request with email:', userEmail);

        const docData = await counselorModel.findById(docId).select('-password');
        if (!docData.available) {
            return res.json({ success: false, message: 'Slot Not Available' });
        }

        let slots_booked = docData.slots_booked || {};
        

        // Atomic slot check and update
        if (slots_booked[slotDate]?.includes(slotTime)) {
            return res.json({ success: false, message: 'Slot Already Booked' });
        } else {
            slots_booked[slotDate] = slots_booked[slotDate] || [];
            slots_booked[slotDate].push(slotTime);
        }
        

        // Fetch user data
        let userData = null;
        if (userEmail) {
            const trimmedEmail = userEmail.trim().toLowerCase();
            userData = await userModel.findOne({ email: trimmedEmail }).select('-password');
            console.log('Queried userData:', userData);

        }

        if (!userData) {
            userData = { name: ' ', image: 'data:image/png;base64,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', _Id: '' };
        }

        const appointmentData = {
            userEmail,
            userId : userData._id.toString(),
            docId,
            userData,
            docData,
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now(),
        };

        const newAppointment = new appointmentModel(appointmentData);
        await newAppointment.save();

        await counselorModel.findByIdAndUpdate(docId, { slots_booked });

        res.json({ success: true, message: 'Appointment Booked' });

    } catch (error) {
        console.error('Error occurred:', error);
        res.json({ success: false, message: error.message });
    }
};

// **1. Send Password Reset Link**
const sendPasswordReset = async (req, res) => {
    try {
      const emailSchema = Joi.object({
        email: Joi.string().email().required().label("Email"),
      });
      const { error } = emailSchema.validate(req.body);
      if (error) return res.status(400).send({ message: error.details[0].message });
  
      const user = await counselorModel.findOne({ email: req.body.email });
      if (!user) return res.status(409).send({ message: "User with given email does not exist!" });
  
      let token = await resetTokenModel.findOne({ userId: user._id });
      if (!token) {
        token = await new resetTokenModel({
          userId: user._id,
          token: crypto.randomBytes(32).toString("hex"),
        }).save();
      }
  
      const url = `${process.env.FRONTEND_URLC}/password-reset/${user._id}/${token.token}`;
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
      const user = await counselorModel.findOne({ _id: req.params.id });
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
  
      const user = await counselorModel.findOne({ _id: req.params.id });
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
  

export {
    changeAvailablity,
    doctorList,
    loginCouncellor,
    appointmentsCounsellor,
    appointmentComplete,
    appointmentCancel,
    councellorDashboard,
    counsellorProfile,
    updateCousellorProfile,
    appointmentsCalendarCounsellor,
    bookAppointment,
    getUserData,
    sendPasswordReset,
    verifyPasswordLink,
    setNewPassword
    
    
}