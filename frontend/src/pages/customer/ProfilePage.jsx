import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import API from '../../api/axios';
import { 
    LogOut, Package, User, MapPin, CreditCard, ShoppingBag, 
    Edit3, X, Save, Mail, Calendar, Lock, ShieldCheck, ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';

const ProfilePage = () => {
    const { user, setUser, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    // UI States
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    // Form Data State
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
    });

    useEffect(() => {
        if (user && !isEditing) {
            setFormData({
                name: user.name,
                email: user.email,
                oldPassword: "",
                newPassword: "",
                confirmNewPassword: "",
            });
        }
    }, [user, isEditing]);

    const hasChanges = 
        formData.name !== user?.name ||
        formData.email !== user?.email ||
        (formData.oldPassword && formData.newPassword && formData.confirmNewPassword);

    // --- HANDLERS ---

    const handleLogout = () => {
        logout();
        toast.success("Logged out successfully");
        navigate('/'); 
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (loading) return;

        setLoading(true);
        try {
            const res = await API.put('/auth/edit', formData);
            const isPasswordChanged = formData.newPassword.length > 0;

            if (isPasswordChanged) {
                toast.success("Password changed! Please login again.");
                setTimeout(() => {
                    logout();
                    navigate('/login');
                }, 2000);
            } else {
                setUser(res.data.user);
                setIsEditing(false);
                toast.success("Profile updated successfully!");
            }
        } catch (error) {
            const msg = error.response?.data?.message || "Failed to update profile";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            {/* Minimal Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight italic">MY ACCOUNT</h1>
                <p className="text-slate-500 font-medium">Manage your profile and orders</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* --- LEFT SIDEBAR (The Identity Card) --- */}
                {/* Now spans 4 columns for better proportion */}
                <div className="lg:col-span-4">
                    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm sticky top-24">
                        
                        {/* Profile Header */}
                        <div className="flex flex-col items-center text-center pb-6 border-b border-slate-100">
                            <div className="w-20 h-20 bg-orange-50 text-brand-primary rounded-full flex items-center justify-center mb-4 text-2xl font-black uppercase ring-4 ring-white shadow-lg shadow-orange-100">
                                {user.name.charAt(0)}
                            </div>
                            <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
                            <p className="text-slate-400 text-sm font-medium">{user.email}</p>
                            
                            <div className="mt-3 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest">
                                <ShieldCheck size={12} /> {user.role}
                            </div>
                        </div>

                        {/* Details List */}
                        <div className="py-6 space-y-5">
                            <div className="flex items-start gap-4">
                                <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                                    <MapPin size={18} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase">Default Address</p>
                                    <p className="text-sm font-bold text-slate-700 mt-0.5">No default address</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                                    <Calendar size={18} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase">Member Since</p>
                                    <p className="text-sm font-bold text-slate-700 mt-0.5">
                                        {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Actions Area - MOVED HERE */}
                        <div className="pt-2 space-y-3">
                            {/* Toggle Edit Button */}
                            <button 
                                onClick={() => setIsEditing(!isEditing)}
                                className={`w-full py-3 flex items-center justify-center gap-2 rounded-xl font-bold text-sm transition-all ${
                                    isEditing 
                                    ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' 
                                    : 'bg-slate-900 text-white hover:bg-brand-primary shadow-lg shadow-slate-900/10'
                                }`}
                            >
                                {isEditing ? <><X size={16}/> Cancel Editing</> : <><Edit3 size={16}/> Edit Profile</>}
                            </button>

                            {/* Logout Button */}
                            <button 
                                onClick={handleLogout}
                                className="w-full py-3 flex items-center justify-center gap-2 bg-red-50 text-red-500 font-bold text-sm rounded-xl hover:bg-red-100 transition-colors"
                            >
                                <LogOut size={16} /> Logout
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- RIGHT CONTENT AREA --- */}
                <div className="lg:col-span-8">
                    
                    {/* VIEW MODE: Dashboard Widgets */}
                    {!isEditing && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            
                            {/* Hero Banner: Orders */}
                            <Link to="/customer/orders" className="group relative block bg-slate-900 rounded-4xl p-8 overflow-hidden hover:shadow-xl hover:shadow-slate-900/20 transition-all">
                                <div className="relative z-10 flex justify-between items-center">
                                    <div>
                                        <h3 className="text-2xl font-black italic text-white tracking-tight">MY ORDERS</h3>
                                        <p className="text-slate-400 text-sm font-medium mt-1">Track deliveries or view history</p>
                                    </div>
                                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white group-hover:bg-brand-primary group-hover:text-white transition-colors">
                                        <ChevronRight size={20} />
                                    </div>
                                </div>
                                {/* Background Abstract Shape */}
                                <Package className="absolute right-0 bottom-0 text-white/5 w-40 h-40 translate-x-10 translate-y-10 -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
                            </Link>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Cart Card */}
                                <Link to="/cart" className="bg-white border border-slate-100 p-8 rounded-4xl hover:border-brand-primary/50 hover:shadow-lg transition-all group">
                                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                                        <ShoppingBag size={24} />
                                    </div>
                                    <h4 className="text-lg font-black text-slate-900">My Cart</h4>
                                    <p className="text-xs text-slate-500 font-bold mt-1">Check pending items</p>
                                </Link>

                                {/* Payment Methods (Disabled/Coming Soon) */}
                                <div className="bg-white border border-slate-100 p-8 rounded-4xl opacity-60 cursor-not-allowed">
                                    <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mb-6">
                                        <CreditCard size={24} />
                                    </div>
                                    <h4 className="text-lg font-black text-slate-900">Payment Methods</h4>
                                    <p className="text-xs text-slate-500 font-bold mt-1">Coming Soon</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* EDIT MODE: Form */}
                    {isEditing && (
                        <form onSubmit={handleUpdate} className="bg-white p-8 rounded-4xl border border-slate-100 shadow-xl shadow-slate-200/50 animate-in fade-in slide-in-from-top-2 duration-300">
                            
                            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-50">
                                <div className="p-2 bg-brand-primary/10 text-brand-primary rounded-lg">
                                    <Edit3 size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">Edit Details</h3>
                                    <p className="text-xs text-slate-500 font-bold">Update your personal information</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {/* Name & Email */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Full Name</label>
                                        <input 
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:bg-white focus:border-brand-primary/20 outline-none font-bold text-sm transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Email Address</label>
                                        <input 
                                            value={formData.email}
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                            className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:bg-white focus:border-brand-primary/20 outline-none font-bold text-sm transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Security Section */}
                                <div className="pt-4">
                                    <h4 className="text-xs font-black uppercase text-brand-primary mb-4 flex items-center gap-2">
                                        <Lock size={14}/> Security Change
                                    </h4>
                                    <div className="space-y-4 p-6 bg-slate-50 rounded-3xl">
                                        <input 
                                            type="password"
                                            placeholder="Current Password"
                                            value={formData.oldPassword}
                                            onChange={(e) => setFormData({...formData, oldPassword: e.target.value})}
                                            className="w-full p-3 bg-white rounded-xl border border-slate-200 outline-none focus:border-brand-primary font-bold text-sm"
                                        />
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <input 
                                                type="password"
                                                placeholder="New Password"
                                                value={formData.newPassword}
                                                onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                                                className="w-full p-3 bg-white rounded-xl border border-slate-200 outline-none focus:border-brand-primary font-bold text-sm"
                                            />
                                            <input 
                                                type="password"
                                                placeholder="Confirm New"
                                                value={formData.confirmNewPassword}
                                                onChange={(e) => setFormData({...formData, confirmNewPassword: e.target.value})}
                                                className="w-full p-3 bg-white rounded-xl border border-slate-200 outline-none focus:border-brand-primary font-bold text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Save Button */}
                            <div className="pt-8 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={!hasChanges || loading}
                                    className={`px-8 py-3 rounded-xl font-bold text-white text-sm flex items-center gap-2 transition-all shadow-lg ${
                                        !hasChanges || loading
                                        ? "bg-slate-300 cursor-not-allowed shadow-none"
                                        : "bg-slate-900 hover:bg-brand-primary shadow-slate-900/20"
                                    }`}
                                >
                                    <Save size={18} />
                                    {loading ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;