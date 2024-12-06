import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate, Link } from 'react-router-dom' // Import Link

const Login = () => {
  const { backendUrl, token, setToken } = useContext(AppContext)
  const navigate = useNavigate()

  const [state, setState] = useState('Login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    try {
      if (state === 'Sign Up') {
        const { data } = await axios.post(backendUrl + '/api/user/register', { name, password, email })
        if (data.success) {
          localStorage.setItem('token', data.token)
          setToken(data.token)
        } else {
          toast.error(data.message)
        }
      } else {
        const { data } = await axios.post(backendUrl + '/api/user/login', { password, email })
        if (data.success) {
          localStorage.setItem('token', data.token)
          setToken(data.token)
        } else {
          toast.error('incorrect emil or password')
        }
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (token) {
      navigate('/')
    }
  })

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl test-zinc-600 text-sm shadow-lg'>
        <p className='text-2xl font-semibold'> {state === 'Sign Up' ? "Create Account" : "Login"} </p>
        <p>Please {state === 'Sign Up' ? "sign up" : "log in"} to book an appointment</p>

        {state === "Sign Up" && <div className='container mx-auto'>
          <p>Full Name</p>
          <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="text" onChange={(e) => setName(e.target.value)} value={name} />
        </div>}
        <div className='container mx-auto'>
          <p>Email</p>
          <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="text" onChange={(e) => setEmail(e.target.value)} value={email} />
        </div>
        <div className='container mx-auto'>
          <p>Password</p>
          <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="Password" onChange={(e) => setPassword(e.target.value)} value={password} />
        </div>
        <button type='submit' className='bg-red-500  text-white w-full py-2 rounded-md text-base'>{state === 'Sign Up' ? "Create Account" : "Login"}</button>
        
        {state === "Sign Up"
          ? <p>Already have an account? <span onClick={() => setState('Login')} className='text-primary underline cursor-pointer'>Login here.</span> </p>
          : <>
            <p className='text-sm mt-2'>Forgot your password, or signing in for the first time? <Link to="/forgot-password" className='text-primary underline'>Click here</Link></p>
          </>}

      </div>
    </form>
  )
}

export default Login

