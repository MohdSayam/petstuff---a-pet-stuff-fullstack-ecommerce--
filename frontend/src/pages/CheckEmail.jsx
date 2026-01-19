import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Mail, ArrowLeft, RefreshCw, CheckCircle } from 'lucide-react';
import API from '../api/axios';
import toast from 'react-hot-toast';

function CheckEmail() {
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email;
    const [resending, setResending] = useState(false);
    const [resent, setResent] = useState(false);
    const [countdown, setCountdown] = useState(0);

    // Redirect if no email in state
    useEffect(() => {
        if (!email) {
            navigate('/register');
        }
    }, [email, navigate]);

    // Countdown timer for resend button
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const handleResend = async () => {
        if (countdown > 0) return;

        setResending(true);
        try {
            await API.post('/auth/resend-verification', { email });
            setResent(true);
            setCountdown(60); // 60 second cooldown
            toast.success('Verification email sent!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to resend email');
        } finally {
            setResending(false);
        }
    };

    if (!email) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-slate-50 flex items-center justify-center p-6">
            <div className="max-w-md w-full">
                {/* Back Button */}
                <Link
                    to="/login"
                    className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-brand-primary mb-8 transition-colors"
                >
                    <ArrowLeft size={16} /> Back to Login
                </Link>

                {/* Main Card */}
                <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50 text-center">
                    {/* Email Icon */}
                    <div className="w-24 h-24 mx-auto bg-gradient-to-br from-brand-primary to-orange-400 rounded-full flex items-center justify-center mb-8 shadow-xl shadow-orange-200">
                        <Mail size={40} className="text-white" />
                    </div>

                    <h1 className="text-3xl font-black text-slate-900 mb-4">
                        Check Your Email
                    </h1>

                    <p className="text-slate-500 mb-2">
                        We've sent a verification link to
                    </p>

                    <p className="text-brand-primary font-bold text-lg mb-8 break-all">
                        {email}
                    </p>

                    <div className="bg-slate-50 rounded-2xl p-6 mb-8">
                        <p className="text-sm text-slate-600">
                            Click the link in the email to verify your account.
                            The link expires in <span className="font-bold text-slate-800">24 hours</span>.
                        </p>
                    </div>

                    {/* Resend Section */}
                    <div className="space-y-4">
                        <p className="text-sm text-slate-400">
                            Didn't receive the email?
                        </p>

                        <button
                            onClick={handleResend}
                            disabled={resending || countdown > 0}
                            className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${countdown > 0
                                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                    : 'bg-slate-900 text-white hover:bg-brand-primary'
                                }`}
                        >
                            {resending ? (
                                <>
                                    <RefreshCw size={18} className="animate-spin" />
                                    Sending...
                                </>
                            ) : countdown > 0 ? (
                                <>
                                    Resend in {countdown}s
                                </>
                            ) : resent ? (
                                <>
                                    <CheckCircle size={18} />
                                    Resend Email
                                </>
                            ) : (
                                <>
                                    <RefreshCw size={18} />
                                    Resend Verification Email
                                </>
                            )}
                        </button>
                    </div>

                    {/* Tips */}
                    <div className="mt-8 pt-8 border-t border-slate-100">
                        <p className="text-xs text-slate-400">
                            💡 Check your spam folder if you don't see the email
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-sm text-slate-400 mt-8">
                    Wrong email? <Link to="/register" className="text-brand-primary font-bold hover:underline">Register again</Link>
                </p>
            </div>
        </div>
    );
}

export default CheckEmail;
