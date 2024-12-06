import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import Login from './Login';

const ForgotPassword = () => {
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = `${backendUrl}/api/user/password-reset`;
      const { data } = await axios.post(url, { email });

      // Show success toast
      toast.success(data.message || "Password reset email sent successfully!");
      navigate('/login')

      // Navigate to login page after 2 seconds
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;

        if (status === 404) {
          // Specific toast for "user not found"
          toast.error("User not found, please check your email address.");
         
        } else if (status >= 400 && status <= 500) {
          // General error toast
          toast.error(data.message || "Failed to send reset email.");
          
        }
      } else {
        // Handle network or unexpected errors
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="min-h-[80vh] flex items-center justify-center">
      <div className="flex flex-col gap-3 items-center p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg">
        <div className="flex flex-col items-center">
          <p className="text-2xl font-semibold text-center">
            Use your school email <br /> to send a reset password link!
          </p>
          <p >
            Check your spam if the you do not appear to recive an email
          </p>
        </div>
        <div className="container mx-auto">
          <p>Email</p>
          <input
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            type="text"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>
        <button
          type="submit"
          className="bg-red-500 text-white w-full py-2 rounded-md text-base"
        >
          Reset Password
        </button>
      </div>
      
    </form>
  );
};

export default ForgotPassword;
