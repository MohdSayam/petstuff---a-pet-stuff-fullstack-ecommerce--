import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios'; // Adjust path based on your folder structure
import { CartContext } from '../context/CartContext';
import { ArrowRight, Star, Truck, ShieldCheck, Clock, ShoppingBag } from 'lucide-react';
import FullPageLoader from '../loading/FullPageLoader';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const { addToCart } = useContext(CartContext);
    const [newArrivals, setNewArrivals] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate()

    // Fetch "New Arrivals" (latest 4 products)
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // We use your existing backend sort logic!
                const res = await API.get('/products?sort=newest&limit=4');
                setNewArrivals(res.data.data);
            } catch (error) {
                console.error("Error fetching home products", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // handle those pages which are not ready till now
    const comingSoon = ()=>{
        navigate("/coming-soon")
    }

    if (loading) return <FullPageLoader />;

    return (
        <div className="w-full">
            
            {/* --- HERO SECTION --- */}
            <section className="relative w-full h-150 md:h-175 bg-[#FDF8F5] overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-[#fae8db] rounded-bl-[100px] z-0 hidden md:block" />
                
                <div className="max-w-7xl mx-auto px-6 h-full flex flex-col md:flex-row items-center relative z-10">
                    {/* Text Content */}
                    <div className="flex-1 pt-20 md:pt-0 text-center md:text-left">
                        <span className="inline-block py-2 px-4 rounded-full bg-orange-100 text-brand-primary text-xs font-black uppercase tracking-widest mb-6">
                             #1 Pet Store in the City
                        </span>
                        <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] mb-6 tracking-tighter">
                            Give Your Pet <br/>
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-primary to-orange-400 italic pr-2">The Best Life.</span>
                        </h1>
                        <p className="text-slate-500 text-lg font-medium mb-10 max-w-lg mx-auto md:mx-0 leading-relaxed">
                            Discover premium food, toys, and accessories carefully curated for your furry friends. Happiness delivered to your doorstep.
                        </p>
                        <div className="flex items-center justify-center md:justify-start gap-4">
                            <Link to="/shop" className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-brand-primary transition-all shadow-xl shadow-slate-900/20 flex items-center gap-2">
                                Shop Now <ArrowRight size={20} />
                            </Link>
                            <Link to="/shop?sort=discount" className="px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-2xl font-bold hover:bg-slate-50 transition-all">
                                View Deals
                            </Link>
                        </div>
                    </div>

                    {/* Hero Image (Right) */}
                    <div className="flex-1 h-full relative flex items-center justify-center">
                        {/* You can replace this URL with a real pet image from your assets */}
                        <img 
                            src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                            alt="Happy Dog" 
                            className="relative z-10 w-[80%] md:w-[90%] object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-700"
                        />
                        {/* Floating Badge */}
                        <div className="absolute bottom-20 left-10 md:left-0 bg-white p-4 rounded-2xl shadow-xl animate-bounce duration-3000">
                            <div className="flex items-center gap-2">
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_,i) => <Star key={i} size={14} fill="currentColor"/>)}
                                </div>
                                <span className="text-xs font-bold text-slate-400">Trusted by 10k+ Owners</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- FEATURES GRID --- */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { icon: Truck, title: "Free Shipping", desc: "On all orders over $100" },
                        { icon: ShieldCheck, title: "Secure Payment", desc: "100% secure payment methods" },
                        { icon: Clock, title: "Fast Delivery", desc: "2-3 business days delivery" }
                    ].map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-6 p-6 rounded-4xl border border-slate-50 hover:shadow-xl hover:-translate-y-1 transition-all group">
                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-brand-primary group-hover:text-white transition-colors">
                                <feature.icon size={32} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900">{feature.title}</h3>
                                <p className="text-slate-500 font-medium text-sm mt-1">{feature.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* --- CATEGORIES --- */}
            <section className="py-20 bg-slate-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="text-4xl font-black uppercase italic tracking-tighter text-slate-900">Shop by Category</h2>
                            <p className="text-slate-400 font-bold mt-2">Find exactly what your pet needs</p>
                        </div>
                        <Link to="/shop" className="hidden md:flex items-center gap-2 font-bold text-brand-primary hover:text-slate-900 transition-colors">
                            View All <ArrowRight size={16}/>
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { name: 'Dogs', type: 'animalType', val: 'Dog', img: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80' },
                            { name: 'Cats', type: 'animalType', val: 'Cat', img: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80' },
                            { name: 'Food', type: 'productType', val: 'Food', img: 'https://images.unsplash.com/photo-1565674244283-993fb27a215f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGV0JTIwZm9vZHxlbnwwfHwwfHx8MA%3D%3D' },
                            { name: 'Toys', type: 'productType', val: 'Toys', img: 'https://plus.unsplash.com/premium_photo-1665296633416-8317f7526c1d?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }
                        ].map((cat) => (
                            <Link to={`/shop?${cat.type}=${cat.val}`} key={cat.name} className="group relative h-64 rounded-4xl overflow-hidden cursor-pointer">
                                <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                                <div className="absolute bottom-6 left-6">
                                    <h3 className="text-2xl font-black text-white uppercase tracking-tight">{cat.name}</h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- NEW ARRIVALS --- */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-4xl font-black uppercase italic tracking-tighter text-slate-900 mb-12 text-center">New Arrivals</h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {newArrivals.map(product => (
                            <div key={product._id} className="group flex flex-col bg-white border border-slate-100 rounded-4xl p-4 hover:shadow-2xl hover:shadow-slate-200/50 transition-all">
                                <Link to={`/product/${product._id}`} className="aspect-4/5 bg-slate-50 rounded-2xl overflow-hidden relative mb-4">
                                    <img src={product.images[0]?.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={product.productName} />
                                    {product.discountPercentage > 0 && (
                                        <div className="absolute top-3 left-3 bg-brand-primary text-white text-[10px] font-black px-2 py-1 rounded-lg">-{product.discountPercentage}%</div>
                                    )}
                                </Link>
                                <Link to={`/product/${product._id}`}>
                                    <h3 className="font-bold text-slate-900 line-clamp-1 hover:text-brand-primary transition-colors mb-2">{product.productName}</h3>
                                </Link>
                                <div className="mt-auto flex items-center justify-between">
                                    <span className="text-lg font-black text-slate-900">${product.salePrice}</span>
                                    <button onClick={() => addToCart(product)} className="w-10 h-10 flex items-center justify-center bg-slate-900 text-white rounded-xl hover:bg-brand-primary transition-colors">
                                        <ShoppingBag size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="text-center mt-12">
                         <Link to="/shop" className="inline-block px-10 py-4 bg-slate-50 text-slate-900 font-bold rounded-2xl hover:bg-slate-900 hover:text-white transition-colors">
                            View All Products
                        </Link>
                    </div>
                </div>
            </section>

             {/* --- NEWSLETTER BANNER --- */}
             <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto bg-slate-900 rounded-[40px] p-10 md:p-20 text-center relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter text-white mb-6">Join the Pack</h2>
                        <p className="text-slate-400 max-w-xl mx-auto mb-10 text-lg">Subscribe to our newsletter and get 10% off your first order plus exclusive deals for your furry friends.</p>
                        
                        <div className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
                            <input type="email" placeholder="Enter your email" className="flex-1 bg-white/10 border border-white/20 text-white placeholder:text-white/40 rounded-2xl px-6 py-4 outline-none focus:bg-white/20 transition-colors" />
                            <button onClick={comingSoon} className="bg-brand-primary text-white font-bold px-8 py-4 rounded-2xl hover:bg-orange-600 transition-colors">Subscribe</button>
                        </div>
                    </div>
                    
                    {/* Decorative Circles */}
                    <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-brand-primary/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
                </div>
             </section>

        </div>
    );
};

export default Home;