import React, { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CartContext } from '../../context/CartContext'
import { AuthContext } from '../../context/AuthContext'
import API from '../../api/axios'
import toast from 'react-hot-toast'
import { Truck, CreditCard, CheckCircle, Loader2, Lock, ShieldCheck } from 'lucide-react'

function CheckoutPage() {
    const { selectedItems, selectedTotalPrice, clearSelectedItems } = useContext(CartContext);
    const { user } = useContext(AuthContext)
    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)
    const [orderPlaced, setOrderPlaced] = useState(false)
    const [paymentMethod, setPaymentMethod] = useState('card') // 'card' or 'cod'
    const [shippingInfo, setShippingInfo] = useState({
        address: '',
        city: '',
        postalCode: '',
        country: ''
    })

    // Fake card details (for demo)
    const [cardInfo, setCardInfo] = useState({
        cardNumber: '',
        cardName: '',
        expiry: '',
        cvv: ''
    })

    // Price calculations (₹40 shipping for < ₹500, FREE for ≥ ₹500)
    const shippingPrice = selectedTotalPrice >= 500 ? 0 : 40;
    const finalTotal = selectedTotalPrice + shippingPrice;

    const handleChange = (e) => {
        setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value })
    }

    // Format card number with spaces
    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
        const matches = v.match(/\d{4,16}/g)
        const match = matches && matches[0] || ''
        const parts = []
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4))
        }
        return parts.length ? parts.join(' ') : value
    }

    // Format expiry date
    const formatExpiry = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
        if (v.length >= 2) {
            return v.substring(0, 2) + '/' + v.substring(2, 4)
        }
        return v
    }

    const handleCardChange = (e) => {
        const { name, value } = e.target
        let formattedValue = value

        if (name === 'cardNumber') {
            formattedValue = formatCardNumber(value)
        } else if (name === 'expiry') {
            formattedValue = formatExpiry(value.replace('/', ''))
        } else if (name === 'cvv') {
            formattedValue = value.replace(/[^0-9]/gi, '').substring(0, 3)
        }

        setCardInfo({ ...cardInfo, [name]: formattedValue })
    }

    useEffect(() => {
        if (selectedItems.length === 0 && !orderPlaced) {
            navigate('/cart')
        }
    }, [selectedItems, navigate, orderPlaced])

    const submitOrder = async (e) => {
        e.preventDefault()

        // If card payment, simulate processing
        if (paymentMethod === 'card') {
            if (!cardInfo.cardNumber || !cardInfo.cardName || !cardInfo.expiry || !cardInfo.cvv) {
                toast.error('Please fill in all card details')
                return
            }
        }

        setLoading(true)

        // Simulate payment processing delay for card
        if (paymentMethod === 'card') {
            await new Promise(resolve => setTimeout(resolve, 2000))
        }

        const orderItems = selectedItems.map(item => ({
            name: item.productName,
            price: item.salePrice,
            quantity: item.quantity,
            product: item._id
        }));

        const orderData = {
            shippingInfo,
            orderItems,
            itemsPrice: selectedTotalPrice,
            shippingPrice,
            totalPrice: finalTotal
        };

        try {
            const res = await API.post('orders/create', orderData)

            if (res.data.success) {
                setOrderPlaced(true)
                if (paymentMethod === 'card') {
                    toast.success("Payment successful! Order placed 🎉")
                } else {
                    toast.success("Order placed successfully!")
                }
                clearSelectedItems()
                navigate('/customer/orders')
            }

        } catch (error) {
            console.error("Order error:", error)
            const msg = error.response?.data?.message || "Order failed, try again!"
            toast.error(msg)
        } finally {
            setLoading(false)
        }
    }

    if (selectedItems.length === 0 && !orderPlaced) {
        return null
    }

    return (
        <div className='max-w-7xl mx-auto px-4 py-10 md:py-16'>
            <h1 className="text-3xl font-black uppercase tracking-tighter italic text-slate-900 mb-8">
                Secure Checkout
            </h1>

            <div className='flex flex-col lg:flex-row gap-12'>

                {/* Left: Forms */}
                <div className='flex-1'>
                    <form id="checkout-form" onSubmit={submitOrder} className="space-y-8">

                        {/* Step 1: Identity */}
                        <div className="bg-white p-6 rounded-4xl border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold">1</div>
                                <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wide">Contact Info</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-50 rounded-2xl">
                                    <span className="text-xs font-bold text-slate-400 uppercase">Name</span>
                                    <p className="font-bold text-slate-900">{user?.name}</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-2xl">
                                    <span className="text-xs font-bold text-slate-400 uppercase">Email</span>
                                    <p className="font-bold text-slate-900">{user?.email}</p>
                                </div>
                            </div>
                        </div>

                        {/* Step 2: Shipping Address */}
                        <div className="bg-white p-6 rounded-4xl border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold">2</div>
                                <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wide">Shipping Address</h3>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2 pl-2">Address</label>
                                    <input
                                        type="text"
                                        name="address"
                                        required
                                        value={shippingInfo.address}
                                        onChange={handleChange}
                                        placeholder="123 Pet Street"
                                        className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-primary/20 rounded-2xl p-4 font-bold outline-none transition-all"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2 pl-2">City</label>
                                        <input
                                            type="text"
                                            name="city"
                                            required
                                            value={shippingInfo.city}
                                            onChange={handleChange}
                                            placeholder="New York"
                                            className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-primary/20 rounded-2xl p-4 font-bold outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2 pl-2">Postal Code</label>
                                        <input
                                            type="text"
                                            name="postalCode"
                                            required
                                            value={shippingInfo.postalCode}
                                            onChange={handleChange}
                                            placeholder="10001"
                                            className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-primary/20 rounded-2xl p-4 font-bold outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2 pl-2">Country</label>
                                    <input
                                        type="text"
                                        name="country"
                                        required
                                        value={shippingInfo.country}
                                        onChange={handleChange}
                                        placeholder="USA"
                                        className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-primary/20 rounded-2xl p-4 font-bold outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Step 3: Payment */}
                        <div className="bg-white p-6 rounded-4xl border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold">3</div>
                                <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wide">Payment Method</h3>
                            </div>

                            {/* Payment Method Toggle */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod('card')}
                                    className={`p-4 rounded-2xl border-2 flex items-center justify-center gap-2 font-bold transition-all ${paymentMethod === 'card'
                                        ? 'border-brand-primary bg-orange-50 text-brand-primary'
                                        : 'border-slate-100 text-slate-400 hover:border-slate-200'
                                        }`}
                                >
                                    <CreditCard size={20} />
                                    Credit Card
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod('cod')}
                                    className={`p-4 rounded-2xl border-2 flex items-center justify-center gap-2 font-bold transition-all ${paymentMethod === 'cod'
                                        ? 'border-brand-primary bg-orange-50 text-brand-primary'
                                        : 'border-slate-100 text-slate-400 hover:border-slate-200'
                                        }`}
                                >
                                    <Truck size={20} />
                                    Cash on Delivery
                                </button>
                            </div>

                            {/* Card Form */}
                            {paymentMethod === 'card' && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                                    {/* Card Preview */}
                                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl text-white relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

                                        <div className="flex justify-between items-start mb-8 relative z-10">
                                            <div className="w-12 h-8 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded" />
                                            <div className="text-xs font-bold text-slate-400 uppercase">Credit Card</div>
                                        </div>

                                        <div className="font-mono text-xl tracking-widest mb-6 relative z-10">
                                            {cardInfo.cardNumber || '•••• •••• •••• ••••'}
                                        </div>

                                        <div className="flex justify-between relative z-10">
                                            <div>
                                                <div className="text-[10px] text-slate-400 uppercase mb-1">Card Holder</div>
                                                <div className="font-bold text-sm uppercase">{cardInfo.cardName || 'YOUR NAME'}</div>
                                            </div>
                                            <div>
                                                <div className="text-[10px] text-slate-400 uppercase mb-1">Expires</div>
                                                <div className="font-bold text-sm">{cardInfo.expiry || 'MM/YY'}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card Inputs */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2 pl-2">Card Number</label>
                                        <input
                                            type="text"
                                            name="cardNumber"
                                            value={cardInfo.cardNumber}
                                            onChange={handleCardChange}
                                            placeholder="1234 5678 9012 3456"
                                            maxLength="19"
                                            className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-primary/20 rounded-2xl p-4 font-mono font-bold outline-none transition-all tracking-widest"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2 pl-2">Cardholder Name</label>
                                        <input
                                            type="text"
                                            name="cardName"
                                            value={cardInfo.cardName}
                                            onChange={handleCardChange}
                                            placeholder="John Doe"
                                            className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-primary/20 rounded-2xl p-4 font-bold outline-none transition-all uppercase"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 uppercase mb-2 pl-2">Expiry Date</label>
                                            <input
                                                type="text"
                                                name="expiry"
                                                value={cardInfo.expiry}
                                                onChange={handleCardChange}
                                                placeholder="MM/YY"
                                                maxLength="5"
                                                className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-primary/20 rounded-2xl p-4 font-mono font-bold outline-none transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 uppercase mb-2 pl-2">CVV</label>
                                            <input
                                                type="password"
                                                name="cvv"
                                                value={cardInfo.cvv}
                                                onChange={handleCardChange}
                                                placeholder="•••"
                                                maxLength="3"
                                                className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-primary/20 rounded-2xl p-4 font-mono font-bold outline-none transition-all text-center tracking-widest"
                                            />
                                        </div>
                                    </div>

                                    {/* Security Notice */}
                                    <div className="bg-green-50 p-4 rounded-2xl flex items-center gap-3">
                                        <ShieldCheck className="text-green-600" size={20} />
                                        <p className="text-xs text-green-700 font-medium">
                                            <span className="font-bold">Demo Mode:</span> No real payment will be processed. This is for portfolio demonstration only.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* COD Info */}
                            {paymentMethod === 'cod' && (
                                <div className="bg-slate-50 p-4 rounded-2xl animate-in fade-in slide-in-from-top-4 duration-300">
                                    <p className="text-sm text-slate-600 font-medium">
                                        Pay with cash when your order is delivered. Additional ₹40 handling fee may apply.
                                    </p>
                                </div>
                            )}
                        </div>
                    </form>
                </div>

                {/* RIGHT: Order Summary */}
                <div className="w-full lg:w-100">
                    <div className="bg-slate-900 text-white p-8 rounded-[40px] sticky top-28 shadow-2xl shadow-slate-900/20">
                        <h2 className="text-xl font-black uppercase tracking-widest mb-8">Order Summary</h2>

                        <div className="space-y-4 mb-8">
                            {selectedItems.map((item) => (
                                <div key={item._id} className="flex justify-between items-center text-sm">
                                    <span className="text-slate-400 font-bold">{item.quantity}x {item.productName}</span>
                                    <span className="font-bold">₹{(item.salePrice * item.quantity).toFixed(0)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="h-px bg-slate-800 my-6" />

                        <div className="space-y-3 mb-8">
                            <div className="flex justify-between text-sm font-bold text-slate-400">
                                <span>Subtotal ({selectedItems.length} items)</span>
                                <span>₹{selectedTotalPrice.toFixed(0)}</span>
                            </div>
                            <div className="flex justify-between text-sm font-bold text-slate-400">
                                <span>Shipping</span>
                                {shippingPrice === 0 ? (
                                    <span className="text-green-400">FREE</span>
                                ) : (
                                    <span>₹{shippingPrice}</span>
                                )}
                            </div>
                            <div className="flex justify-between text-lg font-black text-white mt-4">
                                <span>Total</span>
                                <span>₹{finalTotal.toFixed(0)}</span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            form="checkout-form"
                            disabled={loading}
                            className="w-full py-4 bg-brand-primary text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-orange-600 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    {paymentMethod === 'card' ? 'Processing Payment...' : 'Placing Order...'}
                                </>
                            ) : (
                                <>
                                    {paymentMethod === 'card' ? (
                                        <>
                                            <Lock size={18} />
                                            Pay ₹{finalTotal.toFixed(0)}
                                        </>
                                    ) : (
                                        <>
                                            Confirm Order <CheckCircle size={20} />
                                        </>
                                    )}
                                </>
                            )}
                        </button>

                        <div className="flex items-center gap-2 justify-center mt-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            <Lock size={12} /> Secure Checkout
                            <span className="w-1 h-1 bg-slate-700 rounded-full" />
                            <ShieldCheck size={12} /> SSL Encrypted
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;

