import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const AuthLayout = () => {
  return (
    // Clean background matching your theme (bg-brand-light or slate-50)
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#FDF8F5] py-10 px-4">
      
      {/* Brand Logo / Header - Visible above the card */}
      <div className="mb-8 text-center">
         <Link to="/" className="text-4xl font-black text-slate-900 tracking-tighter hover:scale-105 transition-transform inline-block">
            Pet<span className="text-brand-primary">Stuff</span>
         </Link>
      </div>

      {/* Content Wrapper (The Card will render here) */}
      <div className="w-full max-w-md">
        <Outlet />
      </div>

      {/* Simple Footer Links */}
      <div className="mt-8 flex items-center gap-6 text-sm font-bold text-slate-400">
          <Link to="/" className="hover:text-brand-primary transition-colors flex items-center gap-2">
            <ArrowLeft size={16}/> Back to Shop
          </Link>
          <span>•</span>
          <Link to="/help" className="hover:text-brand-primary transition-colors">Help & Support</Link>
      </div>
    </div>
  );
};

export default AuthLayout;