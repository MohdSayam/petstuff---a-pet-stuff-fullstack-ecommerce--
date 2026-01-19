import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { Mail, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const res = await API.post('/auth/forgot-password', { email });
            setStatus('success');
            setMessage(res.data.message);
            toast.success("Reset link sent! 📧");
        } catch (error) {
            setStatus('idle');
            const errorMsg = error.response?.data?.message || "Something went wrong. Please try again.";
            toast.error(errorMsg);
            setMessage(errorMsg);
        }
    };

    if (status === 'success') {
        return (
            <div className="w-full bg-white rounded-4xl p-8 md:p-10 shadow-xl shadow-slate-200 border border-slate-100 text-center animate-in fade-in zoom-in duration-300">
                <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={40} />
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">Check your inbox</h2>
                <p className="text-slate-500 font-medium mb-8">
                    We've sent password reset instructions to <br />
                    <span className="font-bold text-slate-900">{email}</span>
                </p>

                <Link
                    to="/login"
                    className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-lg hover:bg-brand-primary transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-900/20"
                >
                    Back to Login
                </Link>

                <p className="mt-6 text-xs text-slate-400 font-bold">
                    Did not receive the email? Check your spam filter.
                </p>
            </div>
        );
    }

    return (
        <div className="w-full bg-white rounded-4xl p-8 md:p-10 shadow-xl shadow-slate-200 border border-slate-100 animate-in fade-in zoom-in duration-300">
            <Link to="/login" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-brand-primary mb-6 transition-colors">
                <ArrowLeft size={16} /> Back to Login
            </Link>

            <div className="mb-8">
                <div className="w-12 h-12 bg-orange-100 text-brand-primary rounded-2xl flex items-center justify-center mb-4">
                    <Mail size={24} />
                </div>
                <h2 className='text-3xl font-black text-slate-900'>Forgot Password?</h2>
                <p className='text-slate-400 font-bold text-sm mt-2'>
                    No worries! Enter your email and we'll send you reset instructions.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-xs font-black uppercase text-slate-400 tracking-widest ml-1 mb-2">Email Address</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
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
                            <Loader2 className="animate-spin" size={20} /> Sending...
                        </>
                    ) : (
                        "Send Reset Link"
                    )}
                </button>
            </form>
        </div>
    );
};

export default ForgotPassword;
