import React, { useEffect, useState} from 'react'
import { Link, useParams } from 'react-router-dom'
import API from '../../api/axios'
import FullPageLoader from '../../loading/FullPageLoader'
import { Check, Package, Truck, Home, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'

function OrdersDetailsPage() {
    const {id} = useParams()
    const [order, setOrder] = useState(null)
    const [loading ,setLoading] = useState(true)

    useEffect(()=>{
        const fetchOrder = async ()=>{
            try {
                const response = await API.get(`/orders/${id}`)
                setOrder(response.data.order)
                toast("Order fetched successfully")
            } catch (error) {
                toast.error("Error fetching order:", error.response?.data?.message)
            }finally{
                setLoading(false)
            }
        }
        fetchOrder()
    },[id])

    if (loading) return <FullPageLoader/>

    if (!order) return <div className="p-10 text-center font-bold">Order not found</div>;

    // logic for status tracker
    const steps = [
        {status: 'Processing', icon: Package, label: 'Order Placed'},
        {status: 'Shipped', icon: Truck, label: 'Order on the way'},
        {status: 'Delivered', icon: Home, label: 'Delivered'},
    ];

    const currentStep = steps.findIndex(step => step.status === order.orderStatus);

return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            <Link to="/customer/orders" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-brand-primary mb-8 transition-colors">
                <ArrowLeft size={16}/> Back to Orders
            </Link>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter italic text-slate-900">
                        Order name: {order.orderItems[0].name}
                    </h1>
                    <p className="text-slate-400 font-bold text-sm mt-1">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-black text-slate-900">${order.totalPrice.toFixed(2)}</p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{order.orderItems.length} Items</p>
                </div>
            </div>

            {/* --- TRACKER UI --- */}
            <div className="bg-white border border-slate-100 rounded-4xl p-8 mb-8 shadow-sm">
                <div className="relative flex justify-between">
                    
                    {/* Progress Bar Background */}
                    <div className="absolute top-5 left-0 w-full h-1 bg-slate-100 z-0"></div>
                    
                    {/* Active Progress Bar (Calculated width) */}
                    <div 
                        className="absolute top-5 left-0 h-1 bg-brand-primary transition-all duration-1000 z-0" 
                        style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                    ></div>

                    {/* Steps */}
                    {steps.map((step, index) => {
                        const isCompleted = index <= currentStep;
                        const isCurrent = index === currentStep;
                        
                        return (
                            <div key={step.label} className="relative z-10 flex flex-col items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                                    isCompleted ? 'bg-brand-primary text-white scale-110 shadow-lg shadow-orange-200' : 'bg-slate-100 text-slate-300'
                                }`}>
                                    {isCompleted ? <Check size={18} strokeWidth={4} /> : <step.icon size={18} />}
                                </div>
                                <span className={`text-xs font-bold uppercase tracking-widest ${
                                    isCurrent ? 'text-brand-primary' : 'text-slate-300'
                                }`}>
                                    {step.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Order Items Grid */}
            <div className="grid md:grid-cols-2 gap-8">
                {/* Items List */}
                <div className="bg-slate-50 rounded-4xl p-6">
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">Items Ordered</h3>
                    <div className="space-y-4">
                        {order.orderItems.map((item, i) => (
                            <div key={i} className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center font-bold text-slate-400">
                                        x{item.quantity}
                                    </div>
                                    <span className="font-bold text-slate-700">{item.name}</span>
                                </div>
                                <span className="font-bold text-slate-900">${item.price}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Shipping Details */}
                <div className="bg-slate-900 text-white rounded-4xl p-6">
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-6">Delivery Details</h3>
                    <div className="space-y-4">
                        <div>
                            <span className="text-xs font-bold text-slate-500 uppercase">Address</span>
                            <p className="font-bold text-lg leading-tight mt-1">{order.shippingInfo.address}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="text-xs font-bold text-slate-500 uppercase">City</span>
                                <p className="font-bold">{order.shippingInfo.city}</p>
                            </div>
                            <div>
                                <span className="text-xs font-bold text-slate-500 uppercase">Zip Code</span>
                                <p className="font-bold">{order.shippingInfo.postalCode}</p>
                            </div>
                        </div>
                        <div>
                            <span className="text-xs font-bold text-slate-500 uppercase">Country</span>
                            <p className="font-bold">{order.shippingInfo.country}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrdersDetailsPage;