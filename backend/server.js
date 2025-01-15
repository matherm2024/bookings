import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRoute.js'
import doctorRouter from './routes/counselorRoute.js'
import userRouter from './routes/userRoute.js'

// app config

const app = express()

const port = process.env.PORT || 4000

connectDB()

connectCloudinary()

// middlewares

app.use(express.json())
app.use(cors())
const cors = require('cors');
app.use(cors({
  origin: 'https://clsgbookingsdb-dxfqb4d5cherbvd3.uksouth-01.azurewebsites.net/',
}));





// api endpoints

app.use('/api/admin', adminRouter)

// localhost: 40000/api/admin/add-counselor

app.use('/api/doctor', doctorRouter)


app.use('/api/user', userRouter)

app.get('/', (req,res)=>{
    res.send('API WORKING')

})

app.listen(port, ()=> console.log("server started", port))


