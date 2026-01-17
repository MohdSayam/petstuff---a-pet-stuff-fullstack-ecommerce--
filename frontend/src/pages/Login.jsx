import React, { useState, useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import API from '../api/axios'
import toast from 'react-hot-toast'
import FullPageLoader from '../loading/FullPageLoader'

function Login() {
    const navigate = useNavigate()
    const { login, user } = useContext(AuthContext); 
    
    // State 1: Page Loading (Waiting for Auth Check)
    const [pageLoading, setPageLoading] = useState(true);
    // State 2: Submitting Form
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })

    // --- RESTRICT ACCESS ---
    useEffect(() => {
        if (user) {
            // Already logged in? Go to dashboard.
            const target = user.role === 'admin' ? '/admin' : '/customer/profile';
            navigate(target, { replace: true });
        } else {
            // Not logged in? Show form.
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setPageLoading(false);
        }
    }, [user, navigate]);


    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        try {
            const response = await API.post('/auth/login', formData)
            const { user, token } = response.data;
            login(user, token);

            toast.success(`Welcome back ${user.name}! 🐾`)

            if (user.role === 'admin') {
                navigate("/admin");
            } else {
                navigate("/customer");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Invalid email or password")
            setSubmitting(false) 
        }
    }

    if (pageLoading) return <FullPageLoader />;

    return (
        <div className='w-full bg-white rounded-4xl p-8 md:p-10 shadow-xl shadow-slate-200 border border-slate-100 animate-in fade-in zoom-in duration-300'>
            
            <div className="text-center mb-8">
                <h2 className='text-2xl font-black text-slate-900'>Welcome Back</h2>
                <p className='text-slate-400 font-bold text-sm mt-1'>Please login to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <input
                        type="email" name='email' value={formData.email} onChange={handleChange} placeholder='Email Address'
                        className='w-full rounded-2xl bg-slate-50 border-transparent focus:bg-white border-2 p-4 outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary font-bold text-slate-700 transition-all placeholder:text-slate-400'
                        required
                    />
                </div>

                <div>
                    <input
                        type="password" name='password' value={formData.password} onChange={handleChange} placeholder='Password'
                        className='w-full rounded-2xl bg-slate-50 border-transparent focus:bg-white border-2 p-4 outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary font-bold text-slate-700 transition-all placeholder:text-slate-400'
                        required
                    />
                </div>

                <div className="text-right">
                    <Link to="/forgot-password" className="text-xs font-bold text-slate-400 hover:text-brand-primary">Forgot Password?</Link>
                </div>

                <button
                    type="submit" disabled={submitting}
                    className={`w-full rounded-2xl py-4 font-black text-white text-lg transition-all shadow-xl shadow-brand-primary/20 ${
                        submitting ? 'bg-slate-300 cursor-not-allowed shadow-none' : 'bg-brand-primary hover:scale-[1.02] active:scale-95'
                    }`}
                >
                    {submitting ? "Logging In..." : "Login"}
                </button>
            </form>

            <div className="mt-8 text-center text-sm font-bold text-slate-500">
                New to the pack? 
                <Link to="/register" className='text-brand-primary hover:underline ml-1'>Create Account</Link>
            </div>
        </div>
    )
}

export default Login