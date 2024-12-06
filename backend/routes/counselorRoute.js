import express from 'express'
import { doctorList, loginCouncellor, appointmentsCounsellor, appointmentCancel, appointmentComplete, councellorDashboard, sendPasswordReset, verifyPasswordLink, setNewPassword, counsellorProfile, updateCousellorProfile, bookAppointment, getUserData, appointmentsCalendarCounsellor } from '../controllers/counselorController.js'
import authCounsellor from '../middlewares/authCounsellor.js'

const doctorRouter = express.Router()

doctorRouter.get('/list', doctorList )
doctorRouter.post('/login', loginCouncellor)
doctorRouter.get('/appointments', authCounsellor, appointmentsCounsellor)
doctorRouter.post('/complete-appointment', authCounsellor, appointmentComplete)
doctorRouter.post('/cancel-appointment', authCounsellor, appointmentCancel)
doctorRouter.get('/dashboard', authCounsellor, councellorDashboard)
doctorRouter.get('/profile', authCounsellor, counsellorProfile) 
doctorRouter.post('/update-profile',authCounsellor , updateCousellorProfile)
doctorRouter.post('/book', authCounsellor, bookAppointment)
doctorRouter.get('/getUserData', authCounsellor, getUserData)
doctorRouter.get('/cCalender', authCounsellor, appointmentsCalendarCounsellor)

doctorRouter.post('/password-reset-c', sendPasswordReset); // Step 1: Send reset link
doctorRouter.get('/password-reset-var-c/:id/:token',  verifyPasswordLink); // Step 2: Verify reset link
doctorRouter.post('/password-reset-set-c/:id/:token',  setNewPassword); // Step 3: Set new password


export default doctorRouter