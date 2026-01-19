import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../../api/axios';
import { CartContext } from '../../context/CartContext';
import FullPageLoader from '../../loading/FullPageLoader';
import {
    ShoppingBag, Truck, ShieldCheck, ArrowLeft, Star, Minus, Plus,
    Store, ChevronRight
} from 'lucide-react';

const ProductDetails = () => {
    const { id } = useParams();
    const { addToCart } = useContext(CartContext);

    const [product, setProduct] = useState(null);
    const [similarProducts, setSimilarProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mainImage, setMainImage] = useState('');
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const res = await API.get(`/products/${id}`);
                setProduct(res.data);
                setMainImage(res.data.images[0]?.url);
                fetchSimilarProducts(res.data);
            } catch (error) {
                console.error("Error fetching product", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
        window.scrollTo(0, 0);
    }, [id]);

    const fetchSimilarProducts = async (currentProduct) => {
        try {
            const res = await API.get('/products', {
                params: {
                    animalType: currentProduct.animalType,
                    productType: currentProduct.productType,
                    limit: 5
                }
            });
            const related = res.data.data.filter(p => p._id !== currentProduct._id).slice(0, 4);
            setSimilarProducts(related);
        } catch (error) {
            console.error("Error fetching similar products", error);
        }
    };

    const handleAddToCart = () => {
        if (!product) return;
        addToCart(product, quantity);
        setQuantity(1);
    };

    if (loading) return <FullPageLoader />;
    if (!product) return <div className="p-20 text-center font-bold">Product not found</div>;

    const isOutOfStock = product.stock === 0;

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            {/* Breadcrumb */}
            <Link to="/shop" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-brand-primary mb-8 transition-colors">
                <ArrowLeft size={16} /> Back to Shop
            </Link>

            {/* --- MAIN PRODUCT SECTION --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-20">
                {/* Left: Images */}
                <div className="space-y-4">
                    <div className="aspect-square bg-slate-50 rounded-[40px] overflow-hidden border border-slate-100 relative group">
                        <img src={mainImage} alt={product.productName} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        {product.discountPercentage > 0 && (
                            <span className="absolute top-6 left-6 bg-brand-primary text-white text-xs font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-lg shadow-orange-500/20">
                                -{product.discountPercentage}% OFF
                            </span>
                        )}
                    </div>
                    {product.images.length > 1 && (
                        <div className="flex gap-4 overflow-x-auto pb-2">
                            {product.images.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => setMainImage(img.url)}
                                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${mainImage === img.url ? 'border-slate-900 ring-2 ring-slate-900/20' : 'border-slate-100 hover:border-brand-primary'}`}
                                >
                                    <img src={img.url} alt={`View ${index}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right: Info */}
                <div className="flex flex-col justify-center">
                    <div className="mb-6">
                        <span className="text-xs font-black text-brand-secondary uppercase tracking-widest bg-teal-50 px-3 py-1 rounded-lg">
                            {product.animalType} • {product.productType}
                        </span>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mt-4 mb-2 tracking-tight leading-tight">
                            {product.productName}
                        </h1>
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
                            <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                            </div>
                            <span>(No reviews yet)</span>
                        </div>
                    </div>

                    <div className="flex items-end gap-4 mb-6">
                        <span className="text-5xl font-black text-slate-900 tracking-tighter">₹{product.salePrice}</span>
                        {product.discountPercentage > 0 && (
                            <div className="flex flex-col mb-2">
                                <span className="text-lg font-bold text-slate-400 line-through decoration-2">₹{product.originalPrice}</span>
                                <span className="text-xs font-bold text-red-500 uppercase">Save ₹{(product.originalPrice - product.salePrice).toFixed(0)}</span>
                            </div>
                        )}
                    </div>

                    {/* --- NEW: STORE CARD --- */}
                    {product.store && (
                        <div className="bg-slate-50 rounded-2xl p-4 mb-8 border border-slate-100 flex items-center justify-between group hover:bg-white hover:shadow-lg hover:shadow-slate-200/50 hover:border-slate-200 transition-all duration-300">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm text-brand-primary border border-slate-100">
                                    <Store size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Sold By</p>
                                    <h3 className="font-bold text-slate-900 leading-tight">{product.store.name}</h3>
                                    {product.store.createdAt && (
                                        <p className="text-[10px] font-bold text-slate-400">
                                            Active since {new Date(product.store.createdAt).getFullYear()}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <Link
                                to={`/store/${product.store._id}`}
                                className="pl-4 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase tracking-wide text-slate-700 hover:text-brand-primary hover:border-brand-primary transition-all flex items-center gap-1 shadow-sm"
                            >
                                Visit <ChevronRight size={14} strokeWidth={3} />
                            </Link>
                        </div>
                    )}

                    <p className="text-slate-600 font-medium leading-relaxed mb-8 text-lg">{product.description}</p>
                    <div className="h-px bg-slate-100 mb-8" />

                    {/* Add to Cart Section */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-slate-900 uppercase tracking-widest">Quantity</span>
                            <div className={`text-sm font-bold ${isOutOfStock ? 'text-red-500' : product.stock < 5 ? 'text-orange-500' : 'text-green-600'}`}>
                                {isOutOfStock ? 'Out of Stock' : product.stock < 5 ? `Only ${product.stock} left!` : 'In Stock & Ready to Ship'}
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex items-center bg-slate-50 rounded-2xl px-2 h-16 w-40 justify-between">
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={isOutOfStock || quantity <= 1} className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm text-slate-900 hover:text-brand-primary disabled:opacity-50"><Minus size={18} /></button>
                                <span className="text-xl font-black text-slate-900">{quantity}</span>
                                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} disabled={isOutOfStock || quantity >= product.stock} className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm text-slate-900 hover:text-brand-primary disabled:opacity-50"><Plus size={18} /></button>
                            </div>
                            <button onClick={handleAddToCart} disabled={isOutOfStock} className="flex-1 h-16 bg-slate-900 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-brand-primary transition-all shadow-xl shadow-slate-900/20 disabled:opacity-50 disabled:cursor-not-allowed">
                                <ShoppingBag size={24} /> {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-slate-100">
                        <div className="flex items-center gap-3 text-slate-500"><Truck size={20} className="text-brand-primary" /><span className="text-xs font-bold uppercase tracking-wider">Free Shipping over ₹500</span></div>
                        <div className="flex items-center gap-3 text-slate-500"><ShieldCheck size={20} className="text-brand-primary" /><span className="text-xs font-bold uppercase tracking-wider">Secure Payment</span></div>
                    </div>
                </div>
            </div>

            {/* --- SIMILAR PRODUCTS SECTION --- */}
            {similarProducts.length > 0 && (
                <div className="border-t border-slate-100 pt-16">
                    <h2 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900 mb-10">You May Also Like</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
                        {similarProducts.map((item) => (
                            <Link to={`/product/${item._id}`} key={item._id} className="group bg-white border border-slate-100 rounded-4xl p-4 hover:shadow-xl transition-all">
                                <div className="aspect-4/5 bg-slate-50 rounded-2xl overflow-hidden relative mb-4">
                                    <img src={item.images[0]?.url} alt={item.productName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    {item.discountPercentage > 0 && (
                                        <div className="absolute top-3 left-3 bg-brand-primary text-white text-[10px] font-black px-2 py-1 rounded-lg">-{item.discountPercentage}%</div>
                                    )}
                                </div>
                                <h3 className="font-bold text-slate-900 line-clamp-1 group-hover:text-brand-primary transition-colors">{item.productName}</h3>
                                <div className="flex items-center justify-between mt-2">
                                    <span className="text-lg font-black text-slate-900">₹{item.salePrice}</span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.productType}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetails;