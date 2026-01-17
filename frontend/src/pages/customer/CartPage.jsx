import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';

const CartPage = () => {
    const { cartItems, updateQuantity, removeFromCart, totalPrice, totalItems } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    // Standard shipping rate (you can make this dynamic later)
    const shippingPrice = totalPrice > 100 ? 40 : 0; 
    const finalTotal = totalPrice + shippingPrice;

    const handleCheckout = () => {
        if (!user) {
            // Smart UX: Send them to login, then redirect BACK to checkout
            navigate('/login?redirect=/customer/checkout');
        } else {
            navigate('/customer/checkout');
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag size={40} className="text-slate-300" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-2">Your Cart is Empty</h2>
                <p className="text-slate-500 mb-8 max-w-sm">Looks like you haven't added any treats for your furry friends yet.</p>
                <Link to="/shop" className="px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-brand-primary transition-all shadow-xl shadow-slate-900/20">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
            <h1 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900 mb-8">
                Your Bag <span className="text-slate-400 not-italic text-lg font-bold ml-2">({totalItems} Items)</span>
            </h1>

            <div className="flex flex-col lg:flex-row gap-8 xl:gap-12">
                
                {/* --- LEFT: CART ITEMS LIST --- */}
                <div className="flex-1 space-y-4">
                    {cartItems.map((item) => (
                        <div key={item._id} className="flex gap-4 p-4 bg-white border border-slate-100 rounded-3xl hover:shadow-lg transition-shadow">
                            
                            {/* Image */}
                            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-slate-50 rounded-2xl overflow-hidden shrink-0">
                                <img src={item.images[0]?.url} alt={item.productName} className="w-full h-full object-cover" />
                            </div>

                            {/* Details */}
                            <div className="flex-1 flex flex-col justify-between py-1">
                                <div className="flex justify-between items-start gap-2">
                                    <div>
                                        <span className="text-[10px] font-black text-brand-secondary uppercase tracking-widest">{item.productType}</span>
                                        <h3 className="font-bold text-slate-900 text-lg leading-tight line-clamp-1">{item.productName}</h3>
                                    </div>
                                    <button 
                                        onClick={() => removeFromCart(item._id)} 
                                        className="text-slate-300 hover:text-red-500 transition-colors p-1"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                <div className="flex items-end justify-between mt-4">
                                    {/* Quantity Controls */}
                                    <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-1">
                                        <button 
                                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                            className="w-8 h-8 flex items-center justify-center bg-white rounded-lg text-slate-600 hover:bg-brand-primary hover:text-white transition-colors shadow-sm"
                                        >
                                            <Minus size={14} />
                                        </button>
                                        <span className="text-sm font-black w-4 text-center">{item.quantity}</span>
                                        <button 
                                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                            className="w-8 h-8 flex items-center justify-center bg-white rounded-lg text-slate-600 hover:bg-brand-primary hover:text-white transition-colors shadow-sm"
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>

                                    {/* Price Calculation */}
                                    <div className="text-right">
                                        <span className="block text-xs font-bold text-slate-400">Total</span>
                                        <span className="text-xl font-black text-slate-900">${(item.salePrice * item.quantity).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* --- RIGHT: ORDER SUMMARY --- */}
                <div className="lg:w-96">
                    <div className="bg-slate-50 p-6 rounded-3xl sticky top-24 border border-slate-100">
                        <h2 className="text-lg font-black uppercase text-slate-900 mb-6">Order Summary</h2>
                        
                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-sm font-bold text-slate-500">
                                <span>Subtotal</span>
                                <span>${totalPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm font-bold text-slate-500">
                                <span>Shipping Estimate</span>
                                {shippingPrice === 0 ? (
                                    <span className="text-brand-secondary">FREE</span>
                                ) : (
                                    <span>${shippingPrice.toFixed(2)}</span>
                                )}
                            </div>
                            <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                                <span className="text-base font-black text-slate-900">Total</span>
                                <span className="text-2xl font-black text-brand-primary">${finalTotal.toFixed(2)}</span>
                            </div>
                        </div>

                        <button 
                            onClick={handleCheckout}
                            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-brand-primary hover:scale-[1.02] transition-all shadow-xl shadow-slate-900/20"
                        >
                            Proceed to Checkout <ArrowRight size={20} />
                        </button>

                        <p className="text-[10px] text-slate-400 font-bold text-center mt-4">
                            Taxes calculated at checkout. Secure transaction.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CartPage;