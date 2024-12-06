import React, { useEffect, useState, Fragment } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify"; // Import toastify
import "react-toastify/dist/ReactToastify.css"; // Import toastify styles

const PasswordReset = () => {
    const [validUrl, setValidUrl] = useState(false);
    const [password, setPassword] = useState("");
    const [msg, setMsg] = useState("");
    const [error, setError] = useState("");
    const { id, token } = useParams(); // Extracting id and token from the URL
    const [email, setEmail] = useState("")
    const navigate = useNavigate()

    const url = `${import.meta.env.FRONTEND_URL}/password-reset/${id}/${token}`; // Constructing the URL

    useEffect(() => {
        const verifyUrl = async () => {
          try {
            // Correct Backend Endpoint
            const backendUrl = `${import.meta.env.VITE_BACKEND_URL}/api/user/password-reset-var/${id}/${token}`;
            console.log("Verifying URL:", backendUrl); // Log URL being called
            await axios.get(backendUrl); // Hit the backend for URL verification
            setValidUrl(true); // Mark URL as valid
          } catch (error) {
            console.error("Error verifying URL:", error.response?.data || error.message); // Log errors
            setValidUrl(false); // URL is invalid or expired
          }
        };
        verifyUrl();
      }, [id, token]);

      const validatePassword = () => {
        if (password.length < 8) {
            toast.error("Password must be at least 8 characters long");
            return false;
        }
        if (!/[A-Z]/.test(password)) {
            toast.error("Password must include at least one capital letter");
            return false;
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            toast.error("Password must include at least one special character");
            return false;
        }
        if (!/[0-9]/.test(password)) {
            toast.error("Password must include at least one number");
            return false;
        }
        return true;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validatePassword()) return;
        try {
            
            const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/password-reset-set/${id}/${token}`, { password });
            setMsg(data.message);
            setError("");
            navigate('/login')
        } catch (error) {
            if (
                error.response &&
                error.response.status >= 400 &&
                error.response.status <= 500
            ) {
                setError(error.response.data.message);
                console.log(password);
                
                setMsg("");
            }
        }
    };

    return (
        <Fragment>
            {validUrl ? (
                <form onSubmit={handleSubmit} className="min-h-[80vh] flex items-center justify-center">
                    <div className="flex flex-col gap-3 items-center p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg">
                        <div>
                            <p>
                                Type New Password
                            </p>
                        </div>
                        <div className="container mx-auto">
                            
                            <input
                                className="border border-zinc-300 rounded w-full p-2 mt-1"
                                type="password"
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-red-500 text-white w-full py-2 rounded-md text-base"
                        >
                            Submit
                        </button>
                    </div>
                </form>


            ) : (
                <h1>404 Not Found</h1>
            )}
        </Fragment>
    );
};

export default PasswordReset;