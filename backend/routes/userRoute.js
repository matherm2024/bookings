import express from 'express'
import { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment, sendPasswordReset, verifyPasswordLink, setNewPassword  } from '../controllers/userController.js'
import authUser from '../middlewares/authUser.js'
import upload from '../middlewares/multer.js'
import cors from 'cors'



const userRouter = express.Router()

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)

userRouter.get('/get-profile',authUser, getProfile)
userRouter.post('/update-profile', upload.single('image'), authUser,updateProfile)
userRouter.post('/book-appointment', authUser, bookAppointment)
userRouter.get('/appointments',authUser, listAppointment)
userRouter.post('/cancel-appointmnet', authUser, cancelAppointment)

userRouter.post('/password-reset', sendPasswordReset); // Step 1: Send reset link
userRouter.get('/password-reset-var/:id/:token',  verifyPasswordLink); // Step 2: Verify reset link
userRouter.post('/password-reset-set/:id/:token',  setNewPassword); // Step 3: Set new password

export default userRouter