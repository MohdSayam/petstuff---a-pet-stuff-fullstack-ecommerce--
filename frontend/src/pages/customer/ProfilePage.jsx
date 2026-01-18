import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import API from '../../api/axios';
import { 
    LogOut, Package, User, MapPin, CreditCard, ShoppingBag, 
    Edit3, Save, Lock, ShieldCheck, ChevronRight, LayoutDashboard, Settings
} from 'lucide-react';
import toast from 'react-hot-toast';

const ProfilePage = () => {
    const { user, setUser, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    // Tabs: 'overview' or 'settings'
    const [activeTab, setActiveTab] = useState('overview');
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
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name,
                email: user.email,
            }));
        }
    }, [user]);

    const handleLogout = () => {
        logout();
        toast.success("See you soon!");
        navigate('/'); 
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await API.put('/auth/edit', formData);
            
            // If password changed, force logout
            if (formData.newPassword.length > 0) {
                toast.success("Password updated! Please login again.");
                logout();
                navigate('/login');
            } else {
                setUser(res.data.user);
                toast.success("Profile updated successfully!");
                // Clear password fields
                setFormData(prev => ({ ...prev, oldPassword: "", newPassword: "", confirmNewPassword: "" }));
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Update failed");
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-slate-50/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
                
                {/* Header */}
                <div className="mb-8 md:mb-12">
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight italic uppercase">My Account</h1>
                    <p className="text-slate-500 font-medium">Welcome back, {user.name.split(' ')[0]}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* --- LEFT SIDEBAR (Navigation) --- */}
                    <div className="lg:col-span-4 xl:col-span-3 space-y-6">
                        
                        {/* Identity Card */}
                        <div className="bg-white border border-slate-100 rounded-4xl p-6 shadow-sm relative overflow-hidden">
                            <div className="relative z-10 flex flex-col items-center text-center">
                                <div className="w-24 h-24 bg-brand-primary text-white rounded-full flex items-center justify-center text-3xl font-black shadow-xl shadow-orange-200 mb-4 ring-4 ring-white">
                                    {user.name.charAt(0)}
                                </div>
                                <h2 className="text-xl font-bold text-slate-900 truncate w-full">{user.name}</h2>
                                <p className="text-slate-400 text-sm font-medium truncate w-full">{user.email}</p>
                                <div className="mt-3 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest border border-slate-200">
                                    <ShieldCheck size={12} /> {user.role}
                                </div>
                            </div>
                            {/* Decorative Background */}
                            <div className="absolute top-0 left-0 w-full h-24 bg-linear-to-b from-orange-50 to-white z-0"></div>
                        </div>

                        {/* Navigation Menu */}
                        <div className="bg-white border border-slate-100 rounded-4xl p-4 shadow-sm">
                            <nav className="space-y-2">
                                <button 
                                    onClick={() => setActiveTab('overview')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                                        activeTab === 'overview' 
                                        ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10' 
                                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                    }`}
                                >
                                    <LayoutDashboard size={18} /> Overview
                                </button>
                                <button 
                                    onClick={() => setActiveTab('settings')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                                        activeTab === 'settings' 
                                        ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10' 
                                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                    }`}
                                >
                                    <Settings size={18} /> Account Settings
                                </button>
                                <button 
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-red-500 hover:bg-red-50 transition-all"
                                >
                                    <LogOut size={18} /> Logout
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* --- RIGHT CONTENT AREA --- */}
                    <div className="lg:col-span-8 xl:col-span-9">
                        
                        {/* TAB: OVERVIEW */}
                        {activeTab === 'overview' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {/* Orders Banner */}
                                <Link to="/customer/orders" className="group relative block bg-slate-900 rounded-[2.5rem] p-8 md:p-10 overflow-hidden hover:shadow-2xl hover:shadow-slate-900/20 transition-all">
                                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div>
                                            <h3 className="text-3xl font-black italic text-white tracking-tight">MY ORDERS</h3>
                                            <p className="text-slate-400 font-medium mt-2">Track active deliveries or view purchase history</p>
                                        </div>
                                        <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-white group-hover:bg-brand-primary group-hover:scale-110 transition-all duration-300">
                                            <ChevronRight size={28} />
                                        </div>
                                    </div>
                                    <Package className="absolute -bottom-6 -right-6 text-white/5 w-48 h-48 rotate-12 group-hover:rotate-0 transition-transform duration-700" />
                                </Link>

                                {/* Quick Stats Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Link to="/cart" className="bg-white border border-slate-100 p-8 rounded-[2.5rem] hover:border-brand-primary/30 hover:shadow-xl transition-all group relative overflow-hidden">
                                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                            <ShoppingBag size={24} />
                                        </div>
                                        <h4 className="text-xl font-black text-slate-900">My Cart</h4>
                                        <p className="text-slate-500 text-sm font-bold mt-1">Manage pending items</p>
                                    </Link>

                                    <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] opacity-60 cursor-not-allowed">
                                        <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mb-4">
                                            <MapPin size={24} />
                                        </div>
                                        <h4 className="text-xl font-black text-slate-900">Addresses</h4>
                                        <p className="text-slate-500 text-sm font-bold mt-1">Manage delivery locations</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB: SETTINGS */}
                        {activeTab === 'settings' && (
                            <form onSubmit={handleUpdate} className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="mb-8">
                                    <h3 className="text-xl font-black text-slate-900">Profile Settings</h3>
                                    <p className="text-slate-500 text-sm font-bold">Update your personal information</p>
                                </div>

                                <div className="space-y-8">
                                    {/* Personal Info */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Full Name</label>
                                            <input 
                                                value={formData.name}
                                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                                className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:bg-white focus:ring-2 focus:ring-brand-primary/20 outline-none font-bold text-slate-800 transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Email</label>
                                            <input 
                                                value={formData.email}
                                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                                className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:bg-white focus:ring-2 focus:ring-brand-primary/20 outline-none font-bold text-slate-800 transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="h-px bg-slate-100 w-full" />

                                    {/* Password Change */}
                                    <div className="space-y-4">
                                        <h4 className="text-xs font-black uppercase text-brand-primary flex items-center gap-2">
                                            <Lock size={14}/> Change Password
                                        </h4>
                                        <div className="p-6 bg-slate-50 rounded-3xl space-y-4 border border-slate-100">
                                            <input 
                                                type="password" placeholder="Current Password"
                                                value={formData.oldPassword}
                                                onChange={(e) => setFormData({...formData, oldPassword: e.target.value})}
                                                className="w-full p-3 bg-white rounded-xl border border-slate-200 outline-none focus:border-brand-primary font-bold text-sm"
                                            />
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <input 
                                                    type="password" placeholder="New Password"
                                                    value={formData.newPassword}
                                                    onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                                                    className="w-full p-3 bg-white rounded-xl border border-slate-200 outline-none focus:border-brand-primary font-bold text-sm"
                                                />
                                                <input 
                                                    type="password" placeholder="Confirm New"
                                                    value={formData.confirmNewPassword}
                                                    onChange={(e) => setFormData({...formData, confirmNewPassword: e.target.value})}
                                                    className="w-full p-3 bg-white rounded-xl border border-slate-200 outline-none focus:border-brand-primary font-bold text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-4">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="px-8 py-4 bg-brand-primary text-white rounded-2xl font-black text-sm flex items-center gap-2 shadow-lg shadow-orange-200 hover:scale-105 active:scale-95 transition-all"
                                        >
                                            {loading ? "Saving..." : <><Save size={18} /> Save Changes</>}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;