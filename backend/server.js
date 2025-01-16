import express from 'express';
import cors from 'cors';
import path from 'path'; // Needed for resolving file paths
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import adminRouter from './routes/adminRoute.js';
import doctorRouter from './routes/counselorRoute.js';
import userRouter from './routes/userRoute.js';

// app config
const app = express();
const port = process.env.PORT || 4000;

// Database and cloudinary setup
connectDB();
connectCloudinary();

// Middlewares
app.use(express.json());
app.use(cors());

const allowedOrigins = [
  'https://clsgcounsellorpanel-c6crezf5e3h5fafe.uksouth-01.azurewebsites.net',
  'https://clsgcounsellorbookings-afg2a3dga9dkdeg7.uksouth-01.azurewebsites.net',
  'https://clsgbookingsdb-dxfqb4d5cherbvd3.uksouth-01.azurewebsites.net',
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  })
);
app.options('*', cors()); // Enable preflight across all routes

// API endpoints
app.use('/api/admin', adminRouter);
app.use('/api/doctor', doctorRouter);
app.use('/api/user', userRouter);

// Serve static files for Admin Frontend
const __dirname = path.resolve(); // Get the current directory
app.use(
  '/bookings/admin',
  express.static(path.join(__dirname, 'admin', 'dist')) // Adjust the path if needed
);
app.get('/bookings/admin/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'admin', 'dist', 'index.html'));
});

// Serve static files for User Frontend
app.use(
  '/bookings/frontend',
  express.static(path.join(__dirname, 'frontend', 'build')) // Adjust the path if needed
);
app.get('/bookings/frontend/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
});

// Default route for API status
app.get('/', (req, res) => {
  res.send('API WORKING');
});

// Start the server
app.listen(port, () => console.log(`Server started on port ${port}`));


