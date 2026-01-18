import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import FullPageLoader from '../../loading/FullPageLoader';
import { Trash2, ExternalLink, Package, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminOrders = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Pagination & Filter State
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filterStatus, setFilterStatus] = useState("All");

    // Fetch Orders Function
    const fetchOrders = useCallback(async () => {
        setLoading(true);
        try {
            // Calls the admin endpoint with pagination and status query
            const res = await API.get(`/orders/admin/store?page=${page}&limit=10&status=${filterStatus}`);
            
            setOrders(res.data.orders || []);
            setTotalPages(res.data.totalPages || 1);
        } catch (error) {
            console.error(error);
            if (error.response?.status === 404) {
                toast.error("Please create a store first!")
            } else {
                toast.error("Failed to load orders")
            }
        } finally {
            setLoading(false);
        }
    }, [page, filterStatus]);
    // Initial Load & Refetch on changes
    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    // Handle Status Change
    const handleStatusChange = async (orderId, newStatus) => {
        try {
            // Optimistic UI update
            setOrders(prev => prev.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o));
            await API.put(`/orders/admin/${orderId}/status`, { status: newStatus });
            toast.success(`Order marked as ${newStatus}`);
        // eslint-disable-next-line no-unused-vars
        } catch (error) {
            toast.error("Update failed");
            fetchOrders(); // Revert on failure
        }
    };

    // Handle Delete
    const handleDeleteOrder = async (id) => {
        if(!window.confirm("Delete this order history?")) return;
        try {
            await API.delete(`/orders/admin/${id}`);
            setOrders(orders.filter(o => o._id !== id));
            toast.success("Order deleted");
        // eslint-disable-next-line no-unused-vars
        } catch (error) {
            toast.error("Delete failed");
        }
    }

    // Status Color Helper
    const getStatusColor = (status) => {
         switch(status) {
            case 'Pending': return 'bg-yellow-50 text-yellow-600 border-yellow-100';
            case 'Processing': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'Shipped': return 'bg-purple-50 text-purple-600 border-purple-100';
            case 'Delivered': return 'bg-green-50 text-green-600 border-green-100';
            case 'Cancelled': return 'bg-red-50 text-red-600 border-red-100';
            default: return 'bg-slate-50 text-slate-600 border-slate-100';
        }
    }

    if (loading) return <FullPageLoader />;

    return (
        <div className="space-y-8">
            {/* Header with Filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Orders</h1>
                    <p className="text-slate-500 font-medium">Page {page} of {totalPages}</p>
                </div>
                
                {/* Filters */}
                <div className="flex bg-white p-1 rounded-xl border border-slate-100 shadow-sm overflow-x-auto">
                    {['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(status => (
                        <button
                            key={status}
                            onClick={() => {
                                setFilterStatus(status);
                                setPage(1); // Reset to page 1 on filter change
                            }}
                            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${
                                filterStatus === status 
                                ? 'bg-slate-900 text-white shadow-md' 
                                : 'text-slate-500 hover:bg-slate-50'
                            }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100 text-xs font-black text-slate-400 uppercase tracking-widest">
                                <th className="p-6">Product</th>
                                <th className="p-6">Customer</th>
                                <th className="p-6">Total</th>
                                <th className="p-6">Status</th>
                                <th className="p-6 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {orders.map((order) => {
                                const firstItem = order.orderItems[0];
                                const productImg = firstItem?.product?.images?.[0]?.url;
                                const productId = firstItem?.product?._id;

                                return (
                                    <tr key={order._id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                {/* CLICKABLE IMAGE -> Navigates to Product Page */}
                                                <div 
                                                    onClick={() => productId && navigate(`/product/${productId}`)}
                                                    title="View Product Details"
                                                    className="w-12 h-12 bg-slate-100 rounded-xl overflow-hidden relative cursor-pointer hover:ring-2 hover:ring-brand-primary transition-all"
                                                >
                                                    {productImg ? (
                                                        <img src={productImg} alt="" className="w-full h-full object-cover"/>
                                                    ) : (
                                                        <Package className="m-auto text-slate-300" size={20}/>
                                                    )}
                                                    {/* Hover Overlay Icon */}
                                                    {productId && (
                                                        <div className="absolute inset-0 bg-black/10 hidden group-hover:flex items-center justify-center">
                                                            <ExternalLink size={12} className="text-white drop-shadow-md"/>
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                <div>
                                                    <p 
                                                        onClick={() => productId && navigate(`/product/${productId}`)}
                                                        className="font-bold text-slate-800 text-sm cursor-pointer hover:text-brand-primary transition-colors"
                                                    >
                                                        {firstItem?.name}
                                                    </p>
                                                    {order.orderItems.length > 1 && <span className="text-xs text-brand-primary font-bold">+{order.orderItems.length - 1} more items</span>}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <p className="font-bold text-slate-800 text-sm">{order.user?.name || "Guest"}</p>
                                            <p className="text-xs text-slate-400 font-mono">#{order._id.slice(-6)}</p>
                                        </td>
                                        <td className="p-6 font-black text-slate-800">${order.totalPrice.toFixed(2)}</td>
                                        <td className="p-6">
                                            <select
                                                value={order.orderStatus}
                                                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                className={`py-2 px-3 rounded-xl text-xs font-black uppercase tracking-wide border outline-none cursor-pointer appearance-none ${getStatusColor(order.orderStatus)}`}
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Processing">Processing</option>
                                                <option value="Shipped">Shipped</option>
                                                <option value="Delivered">Delivered</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                        <td className="p-6 text-right">
                                            {(order.orderStatus === 'Delivered' || order.orderStatus === 'Cancelled') && (
                                                <button onClick={() => handleDeleteOrder(order._id)} className="p-2 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors">
                                                    <Trash2 size={16}/>
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 pt-4">
                    <button 
                        disabled={page === 1}
                        onClick={() => setPage(p => p - 1)}
                        className="p-3 bg-white border border-slate-200 rounded-xl disabled:opacity-50 hover:bg-slate-50 transition-colors"
                    >
                        <ChevronLeft size={20}/>
                    </button>
                    <span className="font-bold text-slate-600">Page {page} of {totalPages}</span>
                    <button 
                        disabled={page === totalPages}
                        onClick={() => setPage(p => p + 1)}
                        className="p-3 bg-white border border-slate-200 rounded-xl disabled:opacity-50 hover:bg-slate-50 transition-colors"
                    >
                        <ChevronRight size={20}/>
                    </button>
                </div>
            )}
        </div>
    );
};

export default AdminOrders;