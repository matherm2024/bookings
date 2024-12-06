import express from 'express'
import { allCounsellors, addCounselor, loginAdmin, appointmentsAdmin, appointmentCancel, adminDashboard} from '../controllers/adminController.js'
import upload from '../middlewares/multer.js'
import authAdmin from '../middlewares/authAdmin.js'
import { changeAvailablity } from '../controllers/counselorController.js'


const adminRouter = express.Router()

adminRouter.post('/add-counselor',authAdmin, upload.single('image'), addCounselor)
adminRouter.post('/login', loginAdmin)
adminRouter.post('/all-counsellors', authAdmin, allCounsellors)
adminRouter.post('/change-availability',authAdmin, changeAvailablity  )
adminRouter.get('/appointments', authAdmin, appointmentsAdmin)
adminRouter.post('/cancel-appointment', authAdmin, appointmentCancel)
adminRouter.get('/dashboard',authAdmin, adminDashboard)
export default adminRouter
