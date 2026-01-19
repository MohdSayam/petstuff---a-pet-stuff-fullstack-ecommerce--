import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api/axios";
import FullPageLoader from "../../loading/FullPageLoader";
import { Package, ChevronRight, Calendar, Clock, ChevronLeft, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";

const OrdersPage = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Pagination State
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);
            const response = await API.get(`/orders/me?page=${page}&limit=10`);
            setOrders(response.data.orders);
            setTotalPages(response.data.totalPages || 1);
        } catch (error) {
            console.error("Failed to fetch orders", error);
            toast.error(error.response?.data?.message || "Order fetch error");
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    if (loading) return <FullPageLoader />

    // Empty State
    if (orders.length === 0 && page === 1) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 animate-pulse">
                    <Package size={40} className="text-slate-300" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">No Orders Yet</h2>
                <p className="text-slate-500 mb-8 font-medium">Start filling your pet's life with joy!</p>
                <Link to="/shop" className="px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-brand-primary transition-colors shadow-xl shadow-slate-200">
                    Browse Shop
                </Link>
            </div>
        )
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-black uppercase tracking-tighter italic text-slate-900 mb-8">Order History</h1>

            <div className="space-y-6">
                {orders.map((order) => {
                    // Extract first product info safely
                    const firstItem = order.orderItems[0];
                    const imgUrl = firstItem?.product?.images?.[0]?.url;
                    const productId = firstItem?.product?._id;

                    return (
                        <div key={order._id} className="bg-white border border-slate-100 rounded-3xl p-6 hover:shadow-lg transition-all group relative">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

                                {/* Order Info Left Side */}
                                <div className="flex gap-4">

                                    {/* CLICKABLE IMAGE -> Navigates to Product Page */}
                                    <div
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent triggering the card link
                                            if (productId) navigate(`/product/${productId}`);
                                        }}
                                        className="w-20 h-20 bg-slate-50 rounded-2xl overflow-hidden shrink-0 border border-slate-100 relative cursor-pointer hover:ring-2 hover:ring-brand-primary transition-all z-10"
                                        title="View Product"
                                    >
                                        {imgUrl ? (
                                            <>
                                                <img
                                                    src={imgUrl}
                                                    alt="Order Thumbnail"
                                                    className="w-full h-full object-cover"
                                                />
                                                {/* Badge for multiple items */}
                                                {order.orderItems.length > 1 && (
                                                    <div className="absolute bottom-0 right-0 bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-tl-lg">
                                                        +{order.orderItems.length - 1}
                                                    </div>
                                                )}
                                                {/* Hover Icon */}
                                                <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                    <ExternalLink size={16} className="text-white drop-shadow-md" />
                                                </div>
                                            </>
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Package className="text-slate-300" size={24} />
                                            </div>
                                        )}
                                    </div>

                                    {/* Order Details Text */}
                                    <div className="flex flex-col justify-center">
                                        <h3 className="font-bold text-slate-900 text-lg line-clamp-1">{firstItem?.name}</h3>
                                        <div className="flex items-center gap-4 mt-2 text-xs font-bold text-slate-400 uppercase tracking-wide">
                                            <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(order.createdAt).toLocaleDateString()}</span>
                                            <span className="flex items-center gap-1"><Clock size={12} /> {order.orderItems.length} Items</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Status & Price Right Side */}
                                <div className="flex items-center gap-4 ml-auto md:ml-0">
                                    <div className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest ${order.orderStatus === 'Delivered' ? 'bg-green-50 text-green-600' :
                                            order.orderStatus === 'Shipped' ? 'bg-blue-50 text-blue-600' :
                                                order.orderStatus === 'Cancelled' ? 'bg-red-50 text-red-600' :
                                                    'bg-orange-50 text-orange-600'
                                        }`}>
                                        {order.orderStatus}
                                    </div>
                                    <span className="text-xl font-black text-slate-900">₹{order.totalPrice.toFixed(0)}</span>
                                </div>

                                {/* View Details Arrow (Separate Link) */}
                                <Link to={`/customer/orders/${order._id}`} className="w-12 h-12 flex items-center justify-center bg-slate-50 rounded-full hover:bg-slate-900 hover:text-white transition-colors">
                                    <ChevronRight size={20} />
                                </Link>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 pt-8">
                    <button
                        disabled={page === 1} onClick={() => setPage(p => p - 1)}
                        className="p-3 bg-white border border-slate-200 rounded-xl disabled:opacity-50 hover:bg-slate-50 transition-colors"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <span className="font-bold text-slate-600">Page {page} of {totalPages}</span>
                    <button
                        disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
                        className="p-3 bg-white border border-slate-200 rounded-xl disabled:opacity-50 hover:bg-slate-50 transition-colors"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}
        </div>
    );
}

export default OrdersPage;