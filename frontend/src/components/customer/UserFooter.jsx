import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const UserFooter = () => {
    return (
        <footer className="bg-slate-900 text-slate-300 py-16">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
                
                {/* Brand Column */}
                <div className="space-y-4">
                    <Link to="/" className="text-3xl font-black text-white tracking-tighter">
                        Pet<span className="text-brand-primary">Stuff</span>
                    </Link>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        Providing the best quality food, toys, and accessories for your furry family members since 2023.
                    </p>
                    <div className="flex gap-4 pt-2">
                        <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all"><Facebook size={18}/></a>
                        <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all"><Instagram size={18}/></a>
                        <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all"><Twitter size={18}/></a>
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-white font-black uppercase tracking-widest mb-6">Shop</h3>
                    <ul className="space-y-4 text-sm font-bold">
                        <li><Link to="/shop?animalType=Dog" className="hover:text-brand-primary transition-colors">Dog Food</Link></li>
                        <li><Link to="/shop?animalType=Cat" className="hover:text-brand-primary transition-colors">Cat Food</Link></li>
                        <li><Link to="/shop?productType=Toys" className="hover:text-brand-primary transition-colors">Toys & Accessories</Link></li>
                        <li><Link to="/shop?sort=newest" className="hover:text-brand-primary transition-colors">New Arrivals</Link></li>
                    </ul>
                </div>

                {/* Support */}
                <div>
                    <h3 className="text-white font-black uppercase tracking-widest mb-6">Support</h3>
                    <ul className="space-y-4 text-sm font-bold">
                        <li><Link to="/coming-soon" className="hover:text-brand-primary transition-colors">Track Order</Link></li>
                        <li><Link to="/coming-soon" className="hover:text-brand-primary transition-colors">Returns & Exchanges</Link></li>
                        <li><Link to="/coming-soon" className="hover:text-brand-primary transition-colors">FAQs</Link></li>
                        <li><Link to="/coming-soon" className="hover:text-brand-primary transition-colors">Privacy Policy</Link></li>
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h3 className="text-white font-black uppercase tracking-widest mb-6">Contact</h3>
                    <ul className="space-y-4 text-sm font-bold">
                        <li className="flex items-center gap-3">
                            <MapPin size={18} className="text-brand-primary"/>
                            <span>123 Pet Street, NY 10001</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Phone size={18} className="text-brand-primary"/>
                            <span>+1 (555) 123-4567</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Mail size={18} className="text-brand-primary"/>
                            <span>support@petstuff.com</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                <p>&copy; 2025 PetStuff Inc. All rights reserved.</p>
                <div className="flex gap-6 mt-4 md:mt-0">
                    <span>Terms</span>
                    <span>Privacy</span>
                    <span>Cookies</span>
                </div>
            </div>
        </footer>
    );
};

export default UserFooter;