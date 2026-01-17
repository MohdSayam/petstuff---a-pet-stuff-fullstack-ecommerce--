import React, { useState, useContext, useEffect } from 'react';
import { CartContext } from '../../context/CartContext';
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Search, ShoppingCart, User, Menu, X, Flame, Sparkles, Home, ShoppingBag, LayoutDashboard, ChevronRight } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

function UserNavbar({ toggleMenu, isMenuOpen }) {
    const { user } = useContext(AuthContext);
    const { totalItems } = useContext(CartContext);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || "");

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSearchQuery(searchParams.get('search') || "");
    }, [searchParams]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
            if(isMenuOpen) toggleMenu(); 
        }
    };

    return (
        <nav className='bg-white border-b border-slate-100 w-full sticky top-0 z-50'>
            {/* --- DESKTOP HEADER --- */}
            <div className='w-full px-6 h-20 flex items-center justify-between gap-8'>
                
                {/* Left: Logo & Menu */}
                <div className='flex items-center gap-4'>
                    <button onClick={toggleMenu} className='lg:hidden text-slate-600 hover:text-brand-primary p-1'>
                        {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                    <Link to="/" className='flex items-center gap-1 group'>
                        <span className='text-3xl font-black text-slate-900 tracking-tighter'>
                            Pet<span className='text-brand-primary'>Stuff</span>
                        </span>
                    </Link>
                </div>

                {/* Center: Search */}
                <form onSubmit={handleSearch} className='hidden md:flex flex-1 max-w-2xl relative group'>
                    <input
                        type="text"
                        placeholder='Search for products...'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className='w-full bg-slate-50 border-2 border-transparent focus:border-brand-primary/20 focus:bg-white rounded-2xl py-3 pl-12 pr-4 transition-all outline-none font-bold text-slate-700'
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                </form>

                {/* Right: User Actions */}
                <div className='flex items-center gap-4'>
                    {user ? (
                        user.role === 'admin' ? (
                            <Link to="/admin" className="flex items-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-2xl hover:bg-brand-primary transition-colors shadow-lg shadow-slate-900/20">
                                <LayoutDashboard size={18} />
                                <span className="text-sm font-bold hidden sm:block">Dashboard</span>
                            </Link>
                        ) : (
                            <Link to="/customer/profile" className="flex items-center gap-3 p-2 pr-4 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-colors">
                                <div className="bg-white p-2 rounded-xl shadow-sm">
                                    <User size={20} className="text-slate-900" />
                                </div>
                                <div className="hidden xl:flex flex-col items-start">
                                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Account</span>
                                    <span className="text-xs font-bold text-slate-900 line-clamp-1">{user.name}</span>
                                </div>
                            </Link>
                        )
                    ) : (
                        <Link to="/login" className="hidden sm:block px-6 py-3 font-bold text-slate-600 hover:text-brand-primary">Login</Link>
                    )}

                    <Link to="/cart" className="relative p-3 bg-slate-50 text-slate-900 rounded-2xl hover:bg-brand-primary hover:text-white transition-all">
                        <ShoppingCart size={22} />
                        {totalItems > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 bg-brand-primary text-white text-[10px] font-black h-5 w-5 rounded-full flex items-center justify-center border-2 border-white">
                                {totalItems}
                            </span>
                        )}
                    </Link>
                </div>
            </div>

            {/* --- DESKTOP NAV BAR --- */}
            <div className="hidden lg:block border-t border-slate-50 bg-white px-6">
                <div className="flex items-center justify-between h-14">
                    <nav className="flex items-center gap-8 text-sm font-bold text-slate-500">
                        <Link to="/shop?animalType=Dog" className="hover:text-brand-primary transition-colors">Dogs</Link>
                        <Link to="/shop?animalType=Cat" className="hover:text-brand-primary transition-colors">Cats</Link>
                        <div className="w-px h-4 bg-slate-200"></div>
                        <Link to="/shop?productType=Food" className="hover:text-slate-900 transition-colors">Food</Link>
                        <Link to="/shop?productType=Toys" className="hover:text-slate-900 transition-colors">Toys</Link>
                        <Link to="/shop?productType=Accessories" className="hover:text-slate-900 transition-colors">Accessories</Link>
                    </nav>
                    
                    <div className="flex items-center gap-3">
                        <Link to="/shop?sort=discount" className="flex items-center gap-2 px-4 py-1.5 bg-orange-50 text-brand-primary rounded-xl text-xs font-black uppercase tracking-wide hover:bg-orange-100 transition-colors">
                            <Flame size={14} /> Hot Deals
                        </Link>
                        <Link to="/shop?sort=newest" className="flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-600 rounded-xl text-xs font-black uppercase tracking-wide hover:bg-blue-100 transition-colors">
                            <Sparkles size={14} /> New Arrivals
                        </Link>
                    </div>
                </div>
            </div>

            {/* --- MOBILE MENU OVERLAY --- */}
            <div className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${isMenuOpen ? "visible" : "invisible"}`}>
                
                {/* Backdrop */}
                <div className={`absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 ${isMenuOpen ? "opacity-100" : "opacity-0"}`} onClick={toggleMenu} />
                
                {/* Side Drawer */}
                <div className={`absolute top-0 left-0 bottom-0 w-80 bg-white shadow-2xl transition-transform duration-300 flex flex-col ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
                    
                    <div className='p-6 border-b border-slate-50 flex justify-between items-center'>
                         <span className='text-2xl font-black text-slate-900 tracking-tighter'>Pet<span className='text-brand-primary'>Stuff</span></span>
                         <button onClick={toggleMenu}><X size={24} className="text-slate-400"/></button>
                    </div>
                    
                    <div className='flex-1 overflow-y-auto p-6'>
                        <form onSubmit={handleSearch} className='relative mb-8'>
                            <input type="text" placeholder='Search...' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className='w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-3 pl-10 pr-4 text-sm font-bold outline-none focus:border-brand-primary/20'/>
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        </form>

                        <nav className='space-y-6'>
                            
                            {/* 1. Main Links */}
                            <div>
                                <h3 className='text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1'>Menu</h3>
                                <div className='space-y-1'>
                                    <Link onClick={toggleMenu} to="/" className='flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 font-bold text-slate-700'><Home size={18}/> Home</Link>
                                    <Link onClick={toggleMenu} to="/shop" className='flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 font-bold text-slate-700'><ShoppingBag size={18}/> Shop All</Link>
                                </div>
                            </div>

                            {/* 2. Deals Buttons (Visible on Mobile) */}
                            <div className="grid grid-cols-2 gap-3">
                                <Link onClick={toggleMenu} to="/shop?sort=discount" className="flex items-center justify-center gap-2 p-3 bg-orange-50 text-brand-primary rounded-xl text-xs font-black uppercase tracking-wide">
                                    <Flame size={16} /> Hot Deals
                                </Link>
                                <Link onClick={toggleMenu} to="/shop?sort=newest" className="flex items-center justify-center gap-2 p-3 bg-blue-50 text-blue-600 rounded-xl text-xs font-black uppercase tracking-wide">
                                    <Sparkles size={16} /> Arrivals
                                </Link>
                            </div>

                            {/* 3. Categories List */}
                            <div>
                                <h3 className='text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1'>Categories</h3>
                                <div className='space-y-1'>
                                    <Link onClick={toggleMenu} to="/shop?animalType=Dog" className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-sm font-bold text-slate-600">Dogs <ChevronRight size={14} className="text-slate-300"/></Link>
                                    <Link onClick={toggleMenu} to="/shop?animalType=Cat" className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-sm font-bold text-slate-600">Cats <ChevronRight size={14} className="text-slate-300"/></Link>
                                    <Link onClick={toggleMenu} to="/shop?productType=Food" className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-sm font-bold text-slate-600">Food <ChevronRight size={14} className="text-slate-300"/></Link>
                                    <Link onClick={toggleMenu} to="/shop?productType=Toys" className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-sm font-bold text-slate-600">Toys <ChevronRight size={14} className="text-slate-300"/></Link>
                                    <Link onClick={toggleMenu} to="/shop?productType=Accessories" className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-sm font-bold text-slate-600">Accessories <ChevronRight size={14} className="text-slate-300"/></Link>
                                </div>
                            </div>
                            
                            {/* 4. Admin Link */}
                            {user && user.role === 'admin' && (
                                <div className="pt-4 border-t border-slate-50">
                                    <Link onClick={toggleMenu} to="/admin" className="flex items-center justify-center gap-2 font-bold text-white bg-slate-900 p-4 rounded-xl shadow-lg shadow-slate-900/20">
                                        <LayoutDashboard size={18}/> Go to Admin Dashboard
                                    </Link>
                                </div>
                            )}

                            {/* 5. Login Button */}
                            {!user && (
                                <div className="pt-4 border-t border-slate-50">
                                    <Link onClick={toggleMenu} to="/login" className="block w-full py-4 text-center font-bold text-white bg-brand-primary rounded-2xl shadow-xl shadow-orange-100">
                                        Login / Register
                                    </Link>
                                </div>
                            )}
                        </nav>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default UserNavbar;