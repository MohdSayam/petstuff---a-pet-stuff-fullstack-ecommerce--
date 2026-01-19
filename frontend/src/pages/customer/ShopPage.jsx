import React, { useState, useEffect, useContext } from 'react';
import { CartContext } from '../../context/CartContext';
import { useSearchParams } from 'react-router-dom';
import API from '../../api/axios';
import ProductFilter from '../../components/customer/ProductFilter';
import { Filter, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const ShopPage = () => {
    // FIX: We must destructure 'setSearchParams' here to use it later
    const [searchParams, setSearchParams] = useSearchParams();
    const { addToCart } = useContext(CartContext)
    const [products, setProducts] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Convert searchParams to a plain object for Axios
    const params = Object.fromEntries([...searchParams]);

    useEffect(() => {
        const fetchProducts = async () => {
            setIsFetching(true);
            try {
                const response = await API.get('/products', { params });
                setProducts(response.data.data);
            } catch (error) {
                console.error("Failed to fetch products:", error);
            } finally {
                setIsFetching(false);
            }
        };
        fetchProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    return (
        <div className="flex w-full min-h-screen bg-white">

            {/* 1. LEFT SIDEBAR (Filter) */}
            <ProductFilter
                isOpen={isSidebarOpen}
                toggleSidebar={() => setIsSidebarOpen(false)}
            />

            {/* 2. RIGHT MAIN CONTENT (Full Width Grid) */}
            <div className="flex-1 p-6 lg:p-10">

                {/* Header Area */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter italic text-slate-900">
                            Shop Supplies
                        </h1>
                        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-2">
                            Showing {products.length} Products
                        </p>
                    </div>

                    {/* Mobile Filter Toggle Button */}
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="lg:hidden flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl text-sm font-bold hover:bg-slate-800 transition-colors"
                    >
                        <Filter size={18} /> Filters
                    </button>
                </div>

                {/* PRODUCT GRID */}
                <div className={`grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8 transition-opacity duration-300 ${isFetching ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>

                    {products.length > 0 ? products.map(product => (
                        <div key={product._id} className="group flex flex-col bg-white rounded-4xl border border-slate-100 p-4 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500">

                            {/* Image Container - CHANGED div TO Link */}
                            <Link to={`/product/${product._id}`} className="block aspect-4/5 bg-slate-50 rounded-3xl overflow-hidden relative mb-5 cursor-pointer">
                                <img
                                    src={product.images[0]?.url}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    alt={product.productName}
                                />
                                {product.discountPercentage > 0 && (
                                    <div className="absolute top-4 left-4 bg-brand-primary text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-orange-500/20">
                                        -{product.discountPercentage}%
                                    </div>
                                )}
                            </Link>

                            {/* Product Details */}
                            <div className="flex-1 flex flex-col">
                                {/* ... rest of your details code ... */}
                                <div className="flex justify-between items-start">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{product.animalType}</span>
                                    <span className="text-[10px] font-black text-brand-secondary uppercase tracking-widest bg-teal-50 px-2 py-1 rounded-lg">{product.productType}</span>
                                </div>

                                {/* Make the title clickable too for better UX */}
                                <Link to={`/product/${product._id}`}>
                                    <h3 className="font-bold text-slate-800 text-lg line-clamp-1 mt-2 mb-1 group-hover:text-brand-primary transition-colors cursor-pointer">
                                        {product.productName}
                                    </h3>
                                </Link>

                                {/* Bottom Row: Price & Add Button */}
                                <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-50">
                                    <div className="flex flex-col">
                                        {product.discountPercentage > 0 && (
                                            <span className="text-xs font-bold text-slate-400 line-through">₹{product.originalPrice}</span>
                                        )}
                                        <span className="text-2xl font-black text-slate-900">₹{product.salePrice}</span>
                                    </div>

                                    {/* Add to Cart Button (Keep this as a button, don't link it!) */}
                                    <button onClick={() => addToCart(product)} className="h-12 w-12 flex items-center justify-center bg-slate-900 text-white rounded-2xl hover:bg-brand-primary hover:scale-110 hover:rotate-3 transition-all duration-300 shadow-xl shadow-slate-900/10">
                                        <ShoppingBag size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )) : (
                        !isFetching && (
                            <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
                                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                    <Filter size={32} className="text-slate-300" />
                                </div>
                                <h3 className="text-xl font-black text-slate-900">No Products Found</h3>
                                <p className="text-slate-500 mt-2 max-w-xs mx-auto">Try adjusting your filters or clearing them to see more results.</p>

                                {/* This button now works because setSearchParams is defined above */}
                                <button
                                    onClick={() => setSearchParams({})}
                                    className="mt-6 px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-brand-primary transition-colors"
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default ShopPage;