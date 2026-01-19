import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const CartPage = () => {
    const {
        cartItems,
        updateQuantity,
        removeFromCart,
        totalItems,
        // Selection features
        selectedItems,
        selectedTotalPrice,
        toggleItemSelection,
        selectAllItems,
        deselectAllItems,
        isItemSelected
    } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    // Shipping: ₹40 for orders < ₹500, FREE for ≥ ₹500
    const shippingPrice = selectedTotalPrice >= 500 ? 0 : 40;
    const finalTotal = selectedTotalPrice + shippingPrice;

    const allSelected = cartItems.length > 0 && selectedItems.length === cartItems.length;

    const handleSelectAll = () => {
        if (allSelected) {
            deselectAllItems();
        } else {
            selectAllItems();
        }
    };

    const handleCheckout = () => {
        if (selectedItems.length === 0) {
            toast.error("Please select at least one item to checkout");
            return;
        }

        if (!user) {
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

                {/* LEFT: CART ITEMS LIST */}
                <div className="flex-1 space-y-4">

                    {/* Select All Header */}
                    <div className="flex items-center justify-between bg-white border border-slate-100 rounded-2xl p-4">
                        <button
                            onClick={handleSelectAll}
                            className="flex items-center gap-3 text-sm font-bold text-slate-700 hover:text-brand-primary transition-colors"
                        >
                            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${allSelected
                                    ? 'bg-brand-primary border-brand-primary text-white'
                                    : 'border-slate-300 hover:border-brand-primary'
                                }`}>
                                {allSelected && <Check size={14} strokeWidth={3} />}
                            </div>
                            Select All ({cartItems.length})
                        </button>
                        <span className="text-xs font-bold text-slate-400">
                            {selectedItems.length} of {cartItems.length} selected
                        </span>
                    </div>

                    {cartItems.map((item) => {
                        const isSelected = isItemSelected(item._id);
                        return (
                            <div
                                key={item._id}
                                className={`flex gap-4 p-4 bg-white border rounded-3xl transition-all ${isSelected
                                        ? 'border-brand-primary/30 shadow-lg shadow-orange-100'
                                        : 'border-slate-100 hover:shadow-lg'
                                    }`}
                            >
                                {/* Checkbox */}
                                <button
                                    onClick={() => toggleItemSelection(item._id)}
                                    className="self-center"
                                >
                                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${isSelected
                                            ? 'bg-brand-primary border-brand-primary text-white'
                                            : 'border-slate-300 hover:border-brand-primary'
                                        }`}>
                                        {isSelected && <Check size={14} strokeWidth={3} />}
                                    </div>
                                </button>

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
                                            <span className="text-xs font-bold text-slate-400">₹{item.salePrice} each</span>
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

                                        {/* Price */}
                                        <div className="text-right">
                                            <span className="block text-xs font-bold text-slate-400">Total</span>
                                            <span className="text-xl font-black text-slate-900">₹{(item.salePrice * item.quantity).toFixed(0)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* RIGHT: ORDER SUMMARY */}
                <div className="lg:w-96">
                    <div className="bg-slate-50 p-6 rounded-3xl sticky top-24 border border-slate-100">
                        <h2 className="text-lg font-black uppercase text-slate-900 mb-6">Order Summary</h2>

                        {/* Selected Items Summary */}
                        {selectedItems.length > 0 ? (
                            <div className="mb-4 max-h-32 overflow-y-auto space-y-2">
                                {selectedItems.map(item => (
                                    <div key={item._id} className="flex justify-between text-xs font-medium text-slate-500">
                                        <span className="truncate max-w-[60%]">{item.quantity}x {item.productName}</span>
                                        <span>₹{(item.salePrice * item.quantity).toFixed(0)}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-orange-50 text-orange-600 text-sm font-bold p-4 rounded-2xl mb-4 text-center">
                                Select items to checkout
                            </div>
                        )}

                        <div className="space-y-3 mb-6 pt-4 border-t border-slate-200">
                            <div className="flex justify-between text-sm font-bold text-slate-500">
                                <span>Subtotal ({selectedItems.length} items)</span>
                                <span>₹{selectedTotalPrice.toFixed(0)}</span>
                            </div>
                            <div className="flex justify-between text-sm font-bold text-slate-500">
                                <span>Shipping</span>
                                {shippingPrice === 0 ? (
                                    <span className="text-brand-secondary">FREE</span>
                                ) : (
                                    <span>₹{shippingPrice}</span>
                                )}
                            </div>
                            {selectedTotalPrice > 0 && selectedTotalPrice < 500 && (
                                <p className="text-xs text-brand-primary font-medium">
                                    Add ₹{(500 - selectedTotalPrice).toFixed(0)} more for FREE shipping!
                                </p>
                            )}
                            <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                                <span className="text-base font-black text-slate-900">Total</span>
                                <span className="text-2xl font-black text-brand-primary">₹{finalTotal.toFixed(0)}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleCheckout}
                            disabled={selectedItems.length === 0}
                            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-brand-primary hover:scale-[1.02] transition-all shadow-xl shadow-slate-900/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            Checkout ({selectedItems.length}) <ArrowRight size={20} />
                        </button>

                        <p className="text-[10px] text-slate-400 font-bold text-center mt-4">
                            Free shipping on orders above ₹500
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CartPage;