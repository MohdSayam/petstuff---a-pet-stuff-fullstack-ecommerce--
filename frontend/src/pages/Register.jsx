import React, { useState, useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../api/axios';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import FullPageLoader from '../loading/FullPageLoader';
import { User, ShieldCheck, CheckCircle } from 'lucide-react'; // Import Icons

function Register() {
    const navigate = useNavigate()
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(false)
    const [pageLoading, setPageLoading] = useState(true);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "customer"
    });

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            const target = user.role === 'admin' ? '/admin' : '/customer/profile';
            navigate(target, { replace: true });
            toast.success("You are already logged in!");
        } else {
            setPageLoading(false);
        }
    }, [user, navigate]);


    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const selectRole = (role) => {
        setFormData({ ...formData, role: role })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            await API.post('auth/register', formData)
            toast.success("Email sent!")
            // Redirect to Check Email page with email state
            navigate('/check-email', { state: { email: formData.email } })
        } catch (error) {
            console.log("Signup Error", error.response?.data)
            toast.error(error.response?.data?.message || "Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    if (pageLoading) return <FullPageLoader />;

    return (
        <div className='w-full bg-white rounded-4xl p-8 md:p-10 shadow-xl shadow-slate-200 border border-slate-100 animate-in fade-in zoom-in duration-300'>

            <div className="text-center mb-8">
                <h2 className='text-2xl font-black text-slate-900'>Create Account</h2>
                <p className='text-slate-400 font-bold text-sm mt-1'>Join the pack today!</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

                {/* Name & Email */}
                <div className="space-y-4">
                    <input
                        type="text" name='name' value={formData.name} onChange={handleChange} placeholder='Full Name'
                        className='w-full rounded-2xl bg-slate-50 border-transparent focus:bg-white border-2 p-4 outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary font-bold text-slate-700 transition-all placeholder:text-slate-400'
                        required
                    />
                    <input
                        type="email" name='email' value={formData.email} onChange={handleChange} placeholder='Email Address'
                        className='w-full rounded-2xl bg-slate-50 border-transparent focus:bg-white border-2 p-4 outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary font-bold text-slate-700 transition-all placeholder:text-slate-400'
                        required
                    />
                </div>

                {/* Password Group */}
                <div className="grid grid-cols-2 gap-4">
                    <input
                        type="password" name='password' value={formData.password} onChange={handleChange} placeholder='Password'
                        className='w-full rounded-2xl bg-slate-50 border-transparent focus:bg-white border-2 p-4 outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary font-bold text-slate-700 transition-all placeholder:text-slate-400'
                        required
                    />
                    <input
                        type="password" name='confirmPassword' value={formData.confirmPassword} onChange={handleChange} placeholder='Confirm'
                        className='w-full rounded-2xl bg-slate-50 border-transparent focus:bg-white border-2 p-4 outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary font-bold text-slate-700 transition-all placeholder:text-slate-400'
                        required
                    />
                </div>

                {/* --- PROFESSIONAL ROLE SELECTION (Visual Cards instead of Dropdown) --- */}
                <div>
                    <label className="block text-xs font-black uppercase text-slate-400 mb-3 ml-1">I want to join as:</label>
                    <div className="grid grid-cols-2 gap-4">
                        {/* Customer Option */}
                        <div
                            onClick={() => selectRole('customer')}
                            className={`cursor-pointer rounded-2xl p-4 border-2 transition-all flex flex-col items-center justify-center gap-2 relative ${formData.role === 'customer'
                                ? 'border-brand-primary bg-orange-50 text-brand-primary'
                                : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'
                                }`}
                        >
                            <User size={24} />
                            <span className="text-xs font-black uppercase">Customer</span>
                            {formData.role === 'customer' && <CheckCircle size={16} className="absolute top-2 right-2 text-brand-primary fill-white" />}
                        </div>

                        {/* Admin Option */}
                        <div
                            onClick={() => selectRole('admin')}
                            className={`cursor-pointer rounded-2xl p-4 border-2 transition-all flex flex-col items-center justify-center gap-2 relative ${formData.role === 'admin'
                                ? 'border-brand-primary bg-orange-50 text-brand-primary'
                                : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'
                                }`}
                        >
                            <ShieldCheck size={24} />
                            <span className="text-xs font-black uppercase">Store Manager</span>
                            {formData.role === 'admin' && <CheckCircle size={16} className="absolute top-2 right-2 text-brand-primary fill-white" />}
                        </div>
                    </div>
                </div>

                <button
                    type='submit' disabled={loading}
                    className={`w-full rounded-2xl py-4 font-black text-white text-lg transition-all shadow-xl shadow-brand-primary/20 ${loading ? 'bg-slate-300 cursor-not-allowed shadow-none' : 'bg-brand-primary hover:scale-[1.02] active:scale-95'
                        }`}
                >
                    {loading ? "Creating Account..." : "Register Now"}
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
                href="http://localhost:8080/api/auth/google"
                className="w-full flex items-center justify-center gap-3 rounded-2xl py-4 font-bold text-slate-700 bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all"
            >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Sign up with Google
            </a>

            <div className="mt-6 text-center text-sm font-bold text-slate-500">
                Already have an account?
                <Link to="/login" className='text-brand-primary hover:underline ml-1'>Login here</Link>
            </div>
        </div>
    )
}

export default Register