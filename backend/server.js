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


const allowedOrigins = [
  'https://clsgcounsellorpanel-c6crezf5e3h5fafe.uksouth-01.azurewebsites.net',
  'https://clsgcounsellorbookings-afg2a3dga9dkdeg7.uksouth-01.azurewebsites.net',
  'https://clsgbookingsdb-dxfqb4d5cherbvd3.uksouth-01.azurewebsites.net'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
}));


app.options('*', cors()); // Enable preflight across all routes



// api endpoints

app.use('/api/admin', adminRouter)

// localhost: 40000/api/admin/add-counselor

app.use('/api/doctor', doctorRouter)


app.use('/api/user', userRouter)

app.get('/', (req,res)=>{
    res.send('API WORKING')

})

app.listen(port, ()=> console.log("server started", port))


