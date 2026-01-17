import React, { useState, useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../api/axios';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import FullPageLoader from '../loading/FullPageLoader';
import { User, ShieldCheck, CheckCircle } from 'lucide-react'; // Import Icons

function Register() {
    const navigate = useNavigate()
    const { user } = useContext(AuthContext); // Get global user state
    const [loading, setLoading] = useState(false)
    const [pageLoading, setPageLoading] = useState(true);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "customer" // Default
    });

    // --- 1. RESTRICT ACCESS: Redirect if already logged in ---
    useEffect(() => {
        if (user) {
            // User is already logged in, kick them out of this page
            const target = user.role === 'admin' ? '/admin' : '/customer/profile';
            navigate(target, { replace: true });
            toast.success("You are already logged in!");
        } else {
            // User is guest, allow them to see the page
            setPageLoading(false);
        }
    }, [user, navigate]);


    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    // Custom handler for our fancy role cards
    const selectRole = (role) => {
        setFormData({ ...formData, role: role })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            await API.post('auth/register', formData)
            toast.success("Account successfully registered 🐾!")
            navigate("/login")
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
                            className={`cursor-pointer rounded-2xl p-4 border-2 transition-all flex flex-col items-center justify-center gap-2 relative ${
                                formData.role === 'customer' 
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
                            className={`cursor-pointer rounded-2xl p-4 border-2 transition-all flex flex-col items-center justify-center gap-2 relative ${
                                formData.role === 'admin' 
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
                className={`w-full rounded-2xl py-4 font-black text-white text-lg transition-all shadow-xl shadow-brand-primary/20 ${
                    loading ? 'bg-slate-300 cursor-not-allowed shadow-none' : 'bg-brand-primary hover:scale-[1.02] active:scale-95'
                }`}
                >
               {loading ? "Creating Account..." : "Register Now"}
                </button>
            </form>

            <div className="mt-8 text-center text-sm font-bold text-slate-500">
                Already have an account? 
                <Link to="/login" className='text-brand-primary hover:underline ml-1'>Login here</Link>
            </div>
        </div>
    )
}

export default Register