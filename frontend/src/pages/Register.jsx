import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../api/axios';
import toast from 'react-hot-toast';

function Register() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    // creating user state according to usermodel
    const [formData, setFormData] = useState({
        name: "",
        email:"",
        password:"",
        confirmPassword:"",
        role:"customer"
    });

    const handleChange = (e)=>{
        const {name,value} = e.target 
        setFormData({...formData, [name]:value})
    }

    const handleSubmit =async (e)=>{
        e.preventDefault()
        setLoading(true)
        try {
            const response = await API.post('auth/register', formData)
            console.log("Success from backend", response.data)

            // if response created successfully then it will run 
            toast.success("Account successfully registered 🐾!")
            navigate("/login")
        } catch (error) {
            console.log("Signup Error", error.response?.data)
            toast.error(error.response?.data?.message || "Something wrong try again!")
        }finally{
            setLoading(false)
        }
    }

  return (
    <div className='flex min-h-screen items-center justify-center bg-brand-light px-4 py-10'>
        {/* form details div inside that main div */}
        <div className='w-full sm:max-w-md md:w-[45%] lg:w-[35%] xl:w-[30%] rounded-3xl bg-white p-8 md:p-10 shadow-2xl border border-slate-100'>
            
            <h1 className='text-3xl font-extrabold text-brand-dark mb-2 text-center'>PetStuff 🐾</h1>
            <p className='text-center text-slate-500 mb-8'>Start your journey with us</p>
            
            <form onSubmit={handleSubmit}>
                {/* Name Field */}
                <div className='mb-5'>
                    <label className='block text-sm font-bold text-slate-700 mb-2'>Full Name</label>
                    <input 
                        type="text"
                        name='name'  // same as form data
                        value={formData.name} // ham state display kar rahe hain jo form me set hui hai
                        onChange={handleChange} // now we are updating the state
                        placeholder='John Doe'
                        className='w-full rounded-xl border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all'
                        required
                    />
                </div>

                {/* Email Field */}
                <div className='mb-5'>
                    <label className='block text-sm font-bold text-slate-700 mb-2'>Email Address</label>
                    <input
                        type="email"
                        name='email'
                        value={formData.email}
                        onChange={handleChange}
                        placeholder='john@example.com'
                        className='w-full rounded-xl border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all'
                        required
                    />
                </div>

                {/* Password Field */}
                <div className='mb-5'>
                    <label className='block text-sm font-bold text-slate-700 mb-2'>Password</label>
                    <input 
                        type="password"
                        name='password'
                        value={formData.password}
                        onChange={handleChange}
                        placeholder='••••••••'
                        className='w-full rounded-xl border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all'
                        required
                    />
                </div>

                {/* Confirm Password Field */}
                <div className='mb-5'>
                    <label className='block text-sm font-bold text-slate-700 mb-2'>Password</label>
                    <input 
                        type="password"
                        name='confirmPassword'
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder='••••••••'
                        className='w-full rounded-xl border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all'
                        required
                    />
                </div>
                
                {/* Dropdown Field */}
                <div className="mb-8">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Join as</label>
                    <select 
                        name='role'
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 bg-white cursor-pointer accent-brand-primary"
                    >
                        <option value="customer">Customer (Pet Owner)</option>
                        <option value="admin">Admin (Store Manager)</option>
                    </select>
                </div>

                {/* Button */}
                <button 
                type='submit'
                disabled={loading}
                className={`w-full rounded-2xl py-4 font-bold text-white text-lg transition-all ${
                    loading ? 'bg-orange-300 cursor-not-allowed' : 'bg-brand-primary shadow-xl hover:brightness-110 active:scale-95'
                }`}
                >
               {loading ? (
                    <span className="flex items-center justify-center gap-2">
                    Processing... 🐾
                    </span>
                ) : (
                    "Register Now"
                )}
                </button>
            </form>

            <div className="mt-8 text-center text-sm text-slate-500">
                Already part of the pack? 
                <Link to="/login" className='text-brand-primary font-bold hover:underline ml-1'>Login</Link>
            </div>
        </div>
    </div>
  )
}

export default Register