import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../../api/axios';
import FullPageLoader from '../../loading/FullPageLoader';
import { MapPin, Calendar, Package, Store, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const StoreDetailsPage = () => {
    const { id } = useParams();
    const [store, setStore] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStoreData = async () => {
            try {
                // Matches the controller we just updated
                const res = await API.get(`/store/public/${id}`);
                setStore(res.data.store);
                setProducts(res.data.products);
            } catch (error) {
                console.error("Store fetch error:", error);
                toast.error("Store not found");
            } finally {
                setLoading(false);
            }
        };
        fetchStoreData();
    }, [id]);

    if (loading) return <FullPageLoader />;
    if (!store) return <div className="text-center p-10 font-bold text-slate-500">Store not found</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            {/* Back Link */}
            <Link to="/shop" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-brand-primary mb-8 transition-colors">
                <ArrowLeft size={16} /> Back to Shop
            </Link>

            {/* --- STORE HEADER / BANNER --- */}
            <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white mb-12 relative overflow-hidden shadow-2xl shadow-slate-900/20">
                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row gap-6 md:items-start">
                        {/* Store Icon */}
                        <div className="w-20 h-20 bg-brand-primary text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-orange-900/50">
                            <Store size={40} />
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-2">{store.name}</h1>
                                <p className="text-slate-400 font-medium text-lg leading-relaxed max-w-2xl">
                                    {store.description}
                                </p>
                            </div>

                            {/* Store Meta Info */}
                            <div className="flex flex-wrap gap-4 text-sm font-bold text-slate-400">
                                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full">
                                    <MapPin size={16} className="text-brand-primary" />
                                    {store.location || "Online Store"}
                                </div>
                                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full">
                                    <Calendar size={16} className="text-brand-primary" />
                                    Since {new Date(store.createdAt).getFullYear()}
                                </div>
                                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full">
                                    <Package size={16} className="text-brand-primary" />
                                    {products.length} Products
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Decorative Background Icon */}
                <Store className="absolute -bottom-10 -right-10 w-96 h-96 text-white/5 rotate-12" />
            </div>

            {/* --- PRODUCTS GRID --- */}
            <h2 className="text-2xl font-black text-slate-900 mb-6">Store Collection</h2>

            {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <Link to={`/product/${product._id}`} key={product._id} className="group bg-white border border-slate-100 rounded-3xl p-4 hover:shadow-xl transition-all hover:-translate-y-1">
                            <div className="aspect-square bg-slate-50 rounded-2xl mb-4 overflow-hidden">
                                <img
                                    src={product.images?.[0]?.url}
                                    alt={product.productName}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            </div>
                            <div className="px-2">
                                <h3 className="font-bold text-slate-900 truncate">{product.productName}</h3>
                                <p className="text-brand-primary font-black text-lg mt-1">₹{product.salePrice}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-slate-50 rounded-[3rem]">
                    <Package size={48} className="mx-auto text-slate-300 mb-4" />
                    <h3 className="text-xl font-bold text-slate-500">No products available yet.</h3>
                </div>
            )}
        </div>
    );
};

export default StoreDetailsPage;