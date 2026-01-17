import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Package, User, ShoppingBag, Truck } from 'lucide-react';

const CustomerDashboard = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            {/* Welcome Banner */}
            <div className="bg-slate-900 text-white rounded-4xl p-8 md:p-12 mb-10 relative overflow-hidden">
                <div className="relative z-10">
                    <span className="inline-block py-1 px-3 rounded-full bg-white/10 text-brand-primary text-xs font-black uppercase tracking-widest mb-4">
                        Member Dashboard
                    </span>
                    <h1 className="text-3xl md:text-5xl font-black italic tracking-tighter mb-4">
                        Welcome back, {user?.name.split(' ')[0]}!
                    </h1>
                    <p className="text-slate-400 max-w-lg text-lg">
                        Manage your orders, update your profile, and see what's new for your furry friend.
                    </p>
                    <div className="mt-8 flex flex-wrap gap-4">
                        <Link to="/shop" className="px-6 py-3 bg-brand-primary text-white font-bold rounded-xl hover:bg-orange-600 transition-colors">
                            Browse Shop
                        </Link>
                        <Link to="/customer/orders" className="px-6 py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-colors">
                            View Orders
                        </Link>
                    </div>
                </div>
                
                {/* Decorative Icon Background */}
                <User className="absolute -right-10 -bottom-10 text-white/5 w-64 h-64 rotate-12" />
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Orders Card */}
                <Link to="/customer/orders" className="group bg-white border border-slate-100 p-8 rounded-4xl hover:shadow-xl hover:-translate-y-1 transition-all">
                    <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Package size={28} />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-2">My Orders</h3>
                    <p className="text-slate-500 font-medium text-sm">Track active shipments and view purchase history.</p>
                </Link>

                {/* Profile Card */}
                <Link to="/customer/profile" className="group bg-white border border-slate-100 p-8 rounded-4xl hover:shadow-xl hover:-translate-y-1 transition-all">
                    <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <User size={28} />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-2">My Profile</h3>
                    <p className="text-slate-500 font-medium text-sm">Update your personal details and password.</p>
                </Link>

                {/* Cart Card */}
                <Link to="/cart" className="group bg-white border border-slate-100 p-8 rounded-4xl hover:shadow-xl hover:-translate-y-1 transition-all">
                    <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <ShoppingBag size={28} />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-2">My Cart</h3>
                    <p className="text-slate-500 font-medium text-sm">View items waiting for checkout.</p>
                </Link>
            </div>

            {/* Status Steps (Visual Filler) */}
            <div className="mt-10 bg-slate-50 rounded-4xl p-8 border border-slate-100">
                <h3 className="text-lg font-black text-slate-900 mb-6 uppercase tracking-wider">How it works</h3>
                <div className="flex flex-col md:flex-row justify-between gap-8 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-slate-200 -translate-y-1/2 z-0"></div>

                    {[
                        { icon: ShoppingBag, label: "Browse", text: "Find products" },
                        { icon: Truck, label: "Order", text: "Fast delivery" },
                        { icon: Package, label: "Receive", text: "Happy Pet!" }
                    ].map((step, i) => (
                        <div key={i} className="relative z-10 flex flex-col items-center text-center bg-slate-50 px-4">
                            <div className="w-12 h-12 bg-white border-4 border-slate-200 rounded-full flex items-center justify-center text-slate-400 mb-3 font-bold text-lg">
                                {i + 1}
                            </div>
                            <h4 className="font-bold text-slate-900">{step.label}</h4>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{step.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CustomerDashboard;