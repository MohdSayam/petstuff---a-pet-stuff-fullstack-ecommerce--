import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Rocket } from 'lucide-react';

const ComingSoonPage = () => {
  return (
    <div className="min-h-[80vh] w-full flex flex-col items-center justify-center bg-white px-4 text-center">
      
      {/* Icon Animation */}
      <div className="relative mb-8">
        <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center animate-bounce">
            <Rocket size={48} className="text-brand-primary" />
        </div>
        {/* Decorative blur behind */}
        <div className="absolute top-0 left-0 w-24 h-24 bg-brand-primary/20 rounded-full blur-xl -z-10"></div>
      </div>

      <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-4">
        Coming <span className="text-brand-primary italic">Soon</span>
      </h1>
      
      <p className="text-slate-500 font-medium text-lg max-w-md mx-auto mb-10 leading-relaxed">
        We are working hard to bring this feature to life! Check back later for updates.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link 
            to="/" 
            className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-brand-primary transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-2"
        >
            <ArrowLeft size={20} /> Back to Home
        </Link>
        <Link 
            to="/shop" 
            className="px-8 py-4 bg-white text-slate-900 border-2 border-slate-100 rounded-2xl font-bold hover:border-brand-primary hover:text-brand-primary transition-all flex items-center justify-center"
        >
            Continue Shopping
        </Link>
      </div>

    </div>
  );
};

export default ComingSoonPage;