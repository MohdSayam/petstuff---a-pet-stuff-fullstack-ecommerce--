import React, { useEffect, useState, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import FullPageLoader from '../../loading/FullPageLoader';
import { Check, Package, Truck, Home, ArrowLeft, Clock, XCircle, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

function OrdersDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch order details
    const fetchOrder = useCallback(async () => {
        try {
            const response = await API.get(`/orders/${id}`);
            setOrder(response.data.order);
            // eslint-disable-next-line no-unused-vars
        } catch (error) {
            toast.error("Error fetching order");
            navigate('/customer/orders');
        } finally {
            setLoading(false);
        }
    }, [id, navigate]);

    useEffect(() => {
        fetchOrder();
    }, [fetchOrder]);

    // Cancel order
    const handleCancelOrder = async () => {
        if (!window.confirm("Are you sure you want to cancel this order? This cannot be undone.")) return;

        try {
            await API.put(`/orders/user/${id}/status`);
            toast.success("Order cancelled successfully");
            fetchOrder(); // Refresh the page to show red tracker
        } catch (error) {
            toast.error(error.response?.data?.message || "Cancellation failed");
        }
    };

    if (loading) return <FullPageLoader />;
    if (!order) return <div className="p-10 text-center font-bold">Order not found</div>;

    // Tracker status logic
    const isCancelled = order.orderStatus === 'Cancelled';

    const steps = [
        { status: 'Pending', icon: Clock, label: 'Pending' },
        { status: 'Processing', icon: Package, label: 'Processing' },
        { status: 'Shipped', icon: Truck, label: 'Shipped' },
        { status: 'Delivered', icon: Home, label: 'Delivered' },
    ];

    // Calculate active step
    let activeStep = -1;
    if (!isCancelled) {
        // Find the index of the current status
        activeStep = steps.findIndex(step => step.status === order.orderStatus);

        // Edge case: if status doesn't match steps
        if (activeStep === -1 && order.orderStatus !== 'Pending') activeStep = 0;
    }

    // Can we cancel? (Only if NOT cancelled, and status is Pending or Processing)
    const canCancel = !isCancelled && activeStep < 2;

    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            <Link to="/customer/orders" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-brand-primary mb-8 transition-colors">
                <ArrowLeft size={16} /> Back to Orders
            </Link>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-black uppercase tracking-tighter italic text-slate-900">
                            Order Details
                        </h1>
                        {/* Status Badge */}
                        <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${isCancelled ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'
                            }`}>
                            #{order._id.slice(-6)}
                        </span>
                    </div>
                    <p className="text-slate-400 font-bold text-sm mt-1">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>

                <div className="text-right">
                    <p className="text-2xl font-black text-slate-900">₹{order.totalPrice.toFixed(0)}</p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{order.orderItems.length} Items</p>

                    {/* CANCEL BUTTON */}
                    {canCancel && (
                        <button
                            onClick={handleCancelOrder}
                            className="mt-2 text-xs font-bold text-red-500 hover:text-red-700 underline flex items-center gap-1 justify-end w-full"
                        >
                            <XCircle size={12} /> Cancel Order
                        </button>
                    )}
                </div>
            </div>

            {/* Tracker */}
            <div className={`border rounded-4xl p-8 mb-8 shadow-sm relative overflow-hidden ${isCancelled ? 'bg-red-50 border-red-100' : 'bg-white border-slate-100'
                }`}>

                {isCancelled && (
                    <div className="absolute top-0 left-0 w-full bg-red-100 text-red-600 text-xs font-bold text-center py-1 uppercase tracking-widest">
                        Order Cancelled
                    </div>
                )}

                <div className="relative flex justify-between mt-4">

                    {/* Gray Line Background */}
                    <div className="absolute top-5 left-0 w-full h-1 bg-slate-200 z-0"></div>

                    {/* Active Line (Red if cancelled, Orange if active) */}
                    <div
                        className={`absolute top-5 left-0 h-1 transition-all duration-1000 z-0 ${isCancelled ? 'bg-red-500 w-full' : 'bg-brand-primary'
                            }`}
                        style={!isCancelled ? { width: `${(activeStep / (steps.length - 1)) * 100}%` } : {}}
                    ></div>

                    {/* Steps Rendering */}
                    {steps.map((step, index) => {
                        const isCompleted = !isCancelled && index <= activeStep;

                        return (
                            <div key={step.label} className="relative z-10 flex flex-col items-center gap-3">
                                {/* Circle Icon */}
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 border-4 ${isCancelled
                                    ? 'bg-red-500 border-red-200 text-white'
                                    : isCompleted
                                        ? 'bg-brand-primary border-orange-100 text-white scale-110 shadow-lg'
                                        : 'bg-slate-100 border-white text-slate-300'
                                    }`}>
                                    {isCancelled ? <XCircle size={16} /> : (isCompleted ? <Check size={18} strokeWidth={4} /> : <step.icon size={16} />)}
                                </div>

                                {/* Label */}
                                <span className={`text-[10px] font-black uppercase tracking-widest ${isCancelled ? 'text-red-400' : (isCompleted ? 'text-brand-primary' : 'text-slate-300')
                                    }`}>
                                    {step.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Order Items & Details */}
            <div className="grid md:grid-cols-2 gap-8">

                {/* Items List */}
                <div className="bg-slate-50 rounded-4xl p-6">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Items Ordered</h3>
                    <div className="space-y-4">
                        {order.orderItems.map((item, i) => (
                            <div key={i} className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm">
                                <div className="flex items-center gap-4">
                                    {/* CLICKABLE IMAGE */}
                                    <div
                                        onClick={() => navigate(`/product/${item.product._id}`)}
                                        className="w-12 h-12 bg-slate-100 rounded-xl overflow-hidden cursor-pointer hover:ring-2 hover:ring-brand-primary transition-all"
                                    >
                                        <img
                                            src={item.product?.images?.[0]?.url || "https://placehold.co/100"}
                                            className="w-full h-full object-cover"
                                            alt={item.name}
                                        />
                                    </div>
                                    <div>
                                        <p
                                            onClick={() => navigate(`/product/${item.product._id}`)}
                                            className="font-bold text-slate-700 text-sm cursor-pointer hover:text-brand-primary transition-colors"
                                        >
                                            {item.name}
                                        </p>
                                        <p className="text-xs font-bold text-slate-400">Qty: {item.quantity}</p>
                                    </div>
                                </div>
                                <span className="font-bold text-slate-900">${item.price}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* DELIVERY DETAILS */}
                <div className="bg-slate-900 text-white rounded-4xl p-6">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-6">Delivery Details</h3>
                    <div className="space-y-6">
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