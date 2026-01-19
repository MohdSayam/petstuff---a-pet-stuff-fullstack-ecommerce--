import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { CheckCircle, XCircle, Loader, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const VerifyEmailPage = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    // Status: 'loading' | 'success' | 'error'
    const [status, setStatus] = useState('loading');
    const [message, setMessage] = useState("Verifying your email...");

    // Prevent double execution in React StrictMode
    const hasVerified = useRef(false);

    useEffect(() => {
        const verifyToken = async () => {
            // Prevent double call in StrictMode
            if (hasVerified.current) return;
            hasVerified.current = true;

            if (!token) {
                setStatus('error');
                setMessage("Invalid verification link.");
                return;
            }

            try {
                const res = await API.get(`/auth/verify/${token}`);

                setStatus('success');
                setMessage(res.data.message || "Email verified successfully!");
                toast.success("Verification successful! 🚀");
            } catch (error) {
                console.error(error);
                setStatus('error');
                setMessage(error.response?.data?.message || "Verification failed or token expired.");
            }
        };

        verifyToken();
    }, [token]);

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-200 border border-slate-100 p-8 md:p-10 text-center animate-in fade-in zoom-in duration-300">

                {/* --- LOADING STATE --- */}
                {status === 'loading' && (
                    <div className="space-y-6">
                        <div className="w-20 h-20 mx-auto relative">
                            <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-brand-primary rounded-full border-t-transparent animate-spin"></div>
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-900">Verifying...</h2>
                            <p className="text-slate-500 font-bold text-sm mt-2">Just a moment while we secure your account.</p>
                        </div>
                    </div>
                )}

                {/* --- SUCCESS STATE --- */}
                {status === 'success' && (
                    <div className="space-y-6">
                        <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                            <CheckCircle size={40} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-900">Verified! 🎉</h2>
                            <p className="text-slate-500 font-medium mt-2">{message}</p>
                        </div>

                        <button
                            onClick={() => navigate('/login')}
                            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-lg hover:bg-brand-primary transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-900/20"
                        >
                            Login Now <ArrowRight size={20} />
                        </button>
                    </div>
                )}

                {/* --- ERROR STATE --- */}
                {status === 'error' && (
                    <div className="space-y-6">
                        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <XCircle size={40} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-900">Verification Failed</h2>
                            <p className="text-slate-400 font-bold text-sm mt-2 max-w-xs mx-auto">
                                {message}
                            </p>
                        </div>

                        <div className="space-y-3 pt-4">
                            <p className="text-xs text-slate-400">Token might be expired. Try registering again.</p>
                            <button
                                onClick={() => navigate('/register')}
                                className="w-full bg-slate-100 text-slate-700 py-3 rounded-2xl font-bold hover:bg-slate-200 transition-colors"
                            >
                                Back to Register
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default VerifyEmailPage;