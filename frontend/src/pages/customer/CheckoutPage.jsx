import React, {useState, useContext, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { CartContext } from '../../context/CartContext'
import { AuthContext } from '../../context/AuthContext'
import API from '../../api/axios'
import toast from 'react-hot-toast'
import { Truck, CreditCard, CheckCircle, Loader2 } from 'lucide-react'

function CheckoutPage() {
    const {cartItems, totalPrice, clearCart} = useContext(CartContext);
    const {user} = useContext(AuthContext)
    const navigate = useNavigate()

    const [loading, setLoading ] = useState(false)
    const [orderPlaced ,setOrderPlaced] = useState(false)
    const [shippingInfo, setShippingInfo] = useState({
        address: '',
        city: '',
        postalCode: '',
        country : ''
    })

    // calculation which have to match our cartpage logic
    const taxPrice = totalPrice * 0.08
    const shippingPrice = totalPrice > 100 ? 0 : 25;
    const finalTotal = totalPrice + taxPrice + shippingPrice;

    const handleChange = (e) => {
        setShippingInfo({...shippingInfo, [e.target.name]:e.target.value})
    }

    useEffect(()=>{
        if (cartItems.length === 0 && !orderPlaced){
            navigate('/shop')
        }
    }, [cartItems, navigate, orderPlaced])

    const submitOrder = async (e) => {
        e.preventDefault()
        setLoading(true)

        // formatting before backend request acc. to schema
        const orderItems = cartItems.map(item => ({
            name: item.productName,
            price: item.salePrice,
            quantity: item.quantity,
            product: item._id
        }));

        const orderData = {
            shippingInfo,
            orderItems,
            itemsPrice : totalPrice,
            shippingPrice,
            totalPrice: finalTotal
        };

        try {
            const res = await API.post('orders/create', orderData)

            if (res.data.success){
                setOrderPlaced(true)
                toast.success("order placed successfully")
                clearCart()
                navigate('/customer/orders')
            }
            
        } catch (error) {
            console.error("Order error:", error)
            const msg = error.response?.data?.message || "Order failed try again!"
            toast.error(msg)
        } finally {
            setLoading(false)
        }
    }

    if (cartItems.length===0 && !orderPlaced){
        return null
    }

    return (
            <div className='max-w-7xl mx-auto px-4 py-10 md:py-16'>
                <h1 className="text-3xl font-black uppercase tracking-tighter italic text-slate-900 mb-8">
                    Secure Checkout
                </h1>

                <div className='flex flex-col lg:flex-row gap-12'>

                    {/* Left: Shipping Form */}
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

                            {/* Step 3: Payment (Mock) */}
                            <div className="bg-white p-6 rounded-4xl border border-slate-100 shadow-sm opacity-60">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 bg-slate-200 text-slate-500 rounded-full flex items-center justify-center font-bold">3</div>
                                    <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wide">Payment</h3>
                                </div>
                                <p className="text-sm font-bold text-slate-400 ml-14">Cash on Delivery (Standard)</p>
                            </div>
                        </form>
                    </div>

                    {/* RIGHT: Order Summary */}
                    <div className="w-full lg:w-100">
                        <div className="bg-slate-900 text-white p-8 rounded-[40px] sticky top-28 shadow-2xl shadow-slate-900/20">
                            <h2 className="text-xl font-black uppercase tracking-widest mb-8">Order Summary</h2>

                            <div className="space-y-4 mb-8">
                                {cartItems.map((item) => (
                                    <div key={item._id} className="flex justify-between items-center text-sm">
                                        <span className="text-slate-400 font-bold">{item.quantity}x {item.productName}</span>
                                        <span className="font-bold">${(item.salePrice * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="h-px bg-slate-800 my-6" />

                            <div className="space-y-3 mb-8">
                                <div className="flex justify-between text-sm font-bold text-slate-400">
                                    <span>Subtotal</span>
                                    <span>${totalPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm font-bold text-slate-400">
                                    <span>Tax (8%)</span>
                                    <span>${taxPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm font-bold text-slate-400">
                                    <span>Shipping Price</span>
                                    <span>${shippingPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-lg font-black text-white mt-4">
                                    <span>Total</span>
                                    <span>${finalTotal.toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                form="checkout-form"
                                disabled={loading}
                                className="w-full py-4 bg-brand-primary text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-orange-600 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : <>Confirm Order <CheckCircle size={20} /></>}
                            </button>

                            <div className="flex items-center gap-2 justify-center mt-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                <Truck size={12} /> Free Shipping
                                <span className="w-1 h-1 bg-slate-700 rounded-full" />
                                <CreditCard size={12} /> Secure Payment
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

export default CheckoutPage;
        