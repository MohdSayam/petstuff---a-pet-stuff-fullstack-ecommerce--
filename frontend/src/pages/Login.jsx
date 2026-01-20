import React, { useState, useContext, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import API from '../api/axios'
import FullPageLoader from '../loading/FullPageLoader'
import toast from 'react-hot-toast'

function Login() {
    const navigate = useNavigate()
    const { login, user } = useContext(AuthContext);

    const [pageLoading, setPageLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Prevent duplicate toast
    const toastShown = useRef(false);

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })

    useEffect(() => {
        if (user) {
            if (user.role === 'admin') {
                navigate('/admin', { replace: true });
            } else {
                navigate('/shop', { replace: true });
            }
        } else {
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

            // Show toast only once
            if (!toastShown.current) {
                toastShown.current = true;
                toast.success(`Welcome back ${user.name}! 🐾`);
            }

            if (user.role === 'admin') {
                navigate("/admin");
            } else {
                navigate("/shop");
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
                    className={`w-full rounded-2xl py-4 font-black text-white text-lg transition-all shadow-xl shadow-brand-primary/20 ${submitting ? 'bg-slate-300 cursor-not-allowed shadow-none' : 'bg-brand-primary hover:scale-[1.02] active:scale-95'
                        }`}
                >
                    {submitting ? "Logging In..." : "Login"}
                </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-slate-200"></div>
                <span className="text-xs font-bold text-slate-400 uppercase">or</span>
                <div className="flex-1 h-px bg-slate-200"></div>
            </div>

            {/* Google Sign-in Button */}
            <a
                href={`${import.meta.env.VITE_API_URL || 'http://localhost:8080/api'}/auth/google`}
                className="w-full flex items-center justify-center gap-3 rounded-2xl py-4 font-bold text-slate-700 bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all"
            >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
            </a>

            <div className="mt-6 text-center text-sm font-bold text-slate-500">
                New to the pack?
                <Link to="/register" className='text-brand-primary hover:underline ml-1'>Create Account</Link>
            </div>
        </div>
    )
}

export default Login;