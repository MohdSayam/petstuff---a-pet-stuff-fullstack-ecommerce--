import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Search, ShoppingCart, User, MapPin, Menu, X, ChevronDown, Flame, Sparkles } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

function UserNavbar({ toggleMenu, isMenuOpen }) {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // 1. Logic: Sync state with URL if user navigates back/forward
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || "");

    useEffect(() => {
        setSearchQuery(searchParams.get('search') || "");
    }, [searchParams]);

    // 2. Logic: Handle search submission (Matching your backend 'search' query)
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            // Updated 'q' to 'search' to match your controller: req.query.search
            navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const cartCount = 3;

    return (
        <nav className='bg-white border-b border-slate-100 w-full'>
            {/* Row 1: Identity and Utility */}
            <div className='max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-4 md:gap-8'>

                {/* Logo section */}
                <div className='flex items-center gap-4'>
                    <button onClick={toggleMenu} className='lg:hidden text-slate-600'>
                        <Menu size={28} />
                    </button>
                    <Link to="/" className='relative group'>
                        <span className='text-2xl font-black text-slate-900 tracking-tighter'>
                            Pet<span className='text-brand-primary'>Stuff</span>
                        </span>
                    </Link>
                </div>

                {/* 3. Center Search Bar (Connected to State) */}
                <form onSubmit={handleSearch} className='hidden md:flex flex-1 max-w-xl relative group'>
                    <input
                        type="text"
                        placeholder='Search for pet food, toys...'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className='w-full bg-slate-50 border-2 border-transparent focus:border-brand-primary/20 focus:bg-white rounded-2xl py-3 pl-12 pr-4 transition-all outline-none font-medium'
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                </form>

                {/* Right Action Icons */}
                <div className='flex items-center gap-4 md:gap-6'>
                    {/* Shipping Placeholder (Visual only for now) */}
                    <div className='hidden xl:flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors'>
                        <MapPin size={18} className='text-brand-primary' />
                        <div className='flex flex-col'>
                            <span className="text-[9px] font-black uppercase text-slate-400 leading-none">Deliver to</span>
                            <span className="text-xs font-bold text-slate-700">Select area</span>
                        </div>
                    </div>

                    <Link to="/profile" className="flex items-center gap-2 group">
                        <div className="p-2.5 bg-slate-50 group-hover:bg-brand-primary/10 rounded-2xl transition-colors">
                            <User size={20} className="text-slate-600 group-hover:text-brand-primary" />
                        </div>
                    </Link>

                    <Link to="/cart" className="relative p-2.5 bg-slate-900 text-white rounded-2xl hover:scale-105 transition-all shadow-lg shadow-slate-200">
                        <ShoppingCart size={20} />
                        {cartCount > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 bg-brand-primary text-white text-[10px] font-black h-5 w-5 rounded-full flex items-center justify-center border-2 border-white">
                                {cartCount}
                            </span>
                        )}
                    </Link>
                </div>
            </div>

            {/* Row 2: Navigation Links (Filtering Logic) */}
            <div className="hidden lg:block border-t border-slate-50 py-3 bg-white">
                <div className="max-w-7xl mx-auto px-4 flex items-center gap-8">
                    <button className="flex items-center gap-2 font-black text-xs uppercase tracking-widest text-slate-800 hover:text-brand-primary transition-colors">
                        <Menu size={16} /> All Categories <ChevronDown size={14} />
                    </button>
                    <div className="h-4 w-[1px] bg-slate-200" />
                    <nav className="flex items-center gap-6">
                        {/* AnimalType matching your backend: req.query.animalType */}
                        <Link to="/shop?animalType=dog" className="text-sm font-bold text-slate-500 hover:text-slate-900">Dogs</Link>
                        <Link to="/shop?animalType=cat" className="text-sm font-bold text-slate-500 hover:text-slate-900">Cats</Link>
                        <Link to="/shop?sort=discount" className="text-sm font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1">
                            <Flame size={14} className="text-orange-500" /> Hot Deals
                        </Link>
                        <Link to="/shop?sort=newest" className="text-sm font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1">
                            <Sparkles size={14} className="text-blue-500" /> New Releases
                        </Link>
                    </nav>
                </div>
            </div>
        </nav>
    );
}

export default UserNavbar;