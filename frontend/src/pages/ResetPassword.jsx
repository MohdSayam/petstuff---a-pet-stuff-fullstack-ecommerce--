import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { Lock, ArrowLeft, Loader2, CheckCircle, Eye, EyeOff } from 'lucide-react';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [passwords, setPasswords] = useState({
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [status, setStatus] = useState('idle'); // idle, loading, success

    const handleChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (passwords.password !== passwords.confirmPassword) {
            return toast.error("Passwords do not match!");
        }

        if (passwords.password.length < 6) {
            return toast.error("Password must be at least 6 characters.");
        }

        setStatus('loading');

        try {
            const res = await API.put(`/auth/reset-password/${token}`, passwords);
            setStatus('success');
            toast.success("Password reset successful! 🎉");

            // Redirect after 3 seconds
            setTimeout(() => {
                navigate('/login');
            }, 3000);

        } catch (error) {
            setStatus('idle');
            const errorMsg = error.response?.data?.message || "Invalid or expired reset token.";
            toast.error(errorMsg);
        }
    };

    if (status === 'success') {
        return (
            <div className="w-full bg-white rounded-4xl p-8 md:p-10 shadow-xl shadow-slate-200 border border-slate-100 text-center animate-in fade-in zoom-in duration-300">
                <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={40} />
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">Password Reset!</h2>
                <p className="text-slate-500 font-medium mb-8">
                    Your password has been successfully updated. You can now login with your new password.
                </p>

                <Link
                    to="/login"
                    className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-lg hover:bg-brand-primary transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-900/20"
                >
                    Login Now
                </Link>
            </div>
        );
    }

    return (
        <div className="w-full bg-white rounded-4xl p-8 md:p-10 shadow-xl shadow-slate-200 border border-slate-100 animate-in fade-in zoom-in duration-300">

            <div className="mb-8">
                <div className="w-12 h-12 bg-brand-primary/10 text-brand-primary rounded-2xl flex items-center justify-center mb-4">
                    <Lock size={24} />
                </div>
                <h2 className='text-3xl font-black text-slate-900'>Set New Password</h2>
                <p className='text-slate-400 font-bold text-sm mt-2'>
                    Please enter a strong password for your account.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-xs font-black uppercase text-slate-400 tracking-widest ml-1 mb-2">New Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={passwords.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className='w-full rounded-2xl bg-slate-50 border-transparent focus:bg-white border-2 p-4 outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary font-bold text-slate-700 transition-all placeholder:text-slate-300 pr-12'
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-black uppercase text-slate-400 tracking-widest ml-1 mb-2">Confirm Password</label>
                    <input
                        type={showPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={passwords.confirmPassword}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className='w-full rounded-2xl bg-slate-50 border-transparent focus:bg-white border-2 p-4 outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary font-bold text-slate-700 transition-all placeholder:text-slate-300'
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full bg-brand-primary text-white py-4 rounded-2xl font-black text-lg hover:bg-orange-600 transition-all flex items-center justify-center gap-2 shadow-xl shadow-orange-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {status === 'loading' ? (
                        <>
                            <Loader2 className="animate-spin" size={20} /> Resetting...
                        </>
                    ) : (
                        "Reset Password"
                    )}
                </button>
            </form>
        </div>
    );
};

export default ResetPassword;
