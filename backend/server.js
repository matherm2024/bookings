import express from 'express';
import cors from 'cors';
import path from 'path';
import 'dotenv/config';
import net from 'net'; // For finding a free port
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import adminRouter from './routes/adminRoute.js';
import doctorRouter from './routes/counselorRoute.js';
import userRouter from './routes/userRoute.js';


const app = express();
const baseURL = '/api';


// Middleware setup
app.use(express.json());
app.use(cors());
app.use(cors({ origin: '*' }));
app.options('*', cors());

app.get('/debug/port', (req, res) => {
  res.send(`PORT: ${process.env.PORT || 'Port not set'}`);
});

// Database and cloudinary setup
connectDB();
connectCloudinary();

// Routes setup
app.use(`${baseURL}/admin`, adminRouter);
app.use(`${baseURL}/doctor`, doctorRouter);
app.use(`${baseURL}/user`, userRouter);

// Serve static files (adjust paths as needed)
const __dirname = path.resolve();
app.use('/bookings/admin', express.static(path.join(__dirname, 'bookings', 'admin', 'dist')));
app.get('/bookings/admin/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'bookings', 'admin', 'dist', 'index.html'));
});
app.use('/bookings/frontend', express.static(path.join(__dirname, 'bookings', 'frontend')));
app.get('/bookings/frontend/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'bookings', 'frontend', 'index.html'));
});
process.on('uncaughtException', (err) => {
  console.error('Unhandled Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
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
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Function to find an available port dynamically
const findFreePort = () =>
  new Promise((resolve, reject) => {
    const server = net.createServer();
    server.unref();
    server.on('error', reject);
    server.listen(0, () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });
  });
app.use(express.static(path.join(__dirname))); // Adjust 'build' to your actual build folder
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});


// Start the server
const startServer = async () => {
  const port = process.env.PORT || (await findFreePort()); // Use Azure's PORT or find a free port
  app.listen(port, () => console.log(`Server started on port ${port}`));
};
export const port = process.env.PORT || (await findFreePort())


startServer();

