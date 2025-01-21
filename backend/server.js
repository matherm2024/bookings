// Import necessary modules
import express from 'express';
import cors from 'cors';
import path from 'path'; // Needed for resolving file paths
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import adminRouter from './routes/adminRoute.js';
import doctorRouter from './routes/counselorRoute.js';
import userRouter from './routes/userRoute.js';

// App config
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

app.use(cors({ origin: '*' }));
app.options('*', cors()); // Enable preflight across all routes

// Set base URL for API endpoints
const baseURL = 'http://localhost:4000/api';

app.use(`${baseURL}/admin`, adminRouter);
app.use(`${baseURL}/doctor`, doctorRouter);
app.use(`${baseURL}/user`, userRouter);

// Serve static files for Admin Frontend
const __dirname = path.resolve(); // Get the current directory
app.use(
  '/bookings/admin',
  express.static(path.join(__dirname, 'bookings', 'admin', 'dist')) // Adjust the path if needed
);
app.get('/bookings/admin/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'bookings', 'admin', 'dist', 'index.html'));
});

// Serve static files for User Frontend
app.use(
  '/bookings/frontend',
  express.static(path.join(__dirname, 'bookings', 'frontend', 'build')) // Adjust the path if needed
);
app.get('/bookings/frontend/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'bookings', 'frontend', 'build', 'index.html'));
});

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get(`${baseURL}/status`, (req, res) => {
  try {
    res.send('API WORKING');
  } catch (err) {
    console.error('Error in /api/status:', err, 'testing');
    res.status(500).send('Internal Server Error');
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log detailed error to the console (visible in Azure Log Stream)
  res.status(500).send('Something broke!'); // Return a generic error message to the client
});

// Start the server
app.listen(port, () => console.log(`Server started on port ${port}`));
