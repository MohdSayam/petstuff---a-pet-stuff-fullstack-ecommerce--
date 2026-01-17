import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";
import FullPageLoader from "../../loading/FullPageLoader";
import { Package, ChevronRight, Calendar, Clock } from "lucide-react";
import toast from "react-hot-toast";

const OrdersPage = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    const fetchOrders = async () => {
      try {
        const response = await API.get('/orders/me')
        setOrders(response.data.orders);
      } catch (error) {
        console.error("Failed to fetch orders", error)
        toast.error(error.response?.data?.message || "Order fetch error")
      } finally{
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  if (loading) return <FullPageLoader/>

  if (orders.length === 0 ){
    return(
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                    <Package size={32} className="text-slate-300" />
                </div>
                <h2 className="text-xl font-black text-slate-900 mb-2">No Orders Yet</h2>
                <p className="text-slate-500 mb-6">Start filling your pet's life with joy!</p>
                <Link to="/shop" className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-brand-primary transition-colors">
                    Browse Shop
                </Link>
            </div>
    )
  }

return (
        <div className="max-w-5xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-black uppercase tracking-tighter italic text-slate-900 mb-8">Order History</h1>

            <div className="space-y-6">
                {orders.map((order) => (
                    <div key={order._id} className="bg-white border border-slate-100 rounded-3xl p-6 hover:shadow-lg transition-all group">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            
                            {/* Order Info */}
                            <div className="flex gap-4">
    
                                {/* VISUAL UPDATE: Product Image Thumbnail */}
                                <div className="w-20 h-20 bg-slate-50 rounded-2xl overflow-hidden shrink-0 border border-slate-100 relative">
                                    {order.orderItems[0]?.product?.images?.[0]?.url ? (
                                        <>
                                            <img 
                                                src={order.orderItems[0].product.images[0].url} 
                                                alt="Order Thumbnail" 
                                                className="w-full h-full object-cover"
                                            />
                                            {/* If multiple items, show a small badge "+2" */}
                                            {order.orderItems.length > 1 && (
                                                <div className="absolute bottom-0 right-0 bg-slate-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-tl-lg">
                                                    +{order.orderItems.length - 1}
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        // Fallback if product was deleted
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Package className="text-slate-300" size={24} />
                                        </div>
                                    )}
                                </div>

                                {/* Order Text Details */}
                                <div className="flex flex-col justify-center">
                                    <h3 className="font-bold text-slate-900 text-lg">{order.orderItems[0]?.name}</h3>
                                    <div className="flex items-center gap-4 mt-1 text-xs font-bold text-slate-400 uppercase tracking-wide">
                                        <span className="flex items-center gap-1"><Calendar size={12}/> {new Date(order.createdAt).toLocaleDateString()}</span>
                                        <span className="flex items-center gap-1"><Clock size={12}/> {order.orderItems.length} Items</span>
                                    </div>
                                </div>
                            </div>

                            {/* Status Badge */}
                            <div className="flex items-center gap-4">
                                <div className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest ${
                                    order.orderStatus === 'Delivered' ? 'bg-green-50 text-green-600' : 
                                    order.orderStatus === 'Shipped' ? 'bg-blue-50 text-blue-600' : 
                                    'bg-orange-50 text-orange-600'
                                }`}>
                                    {order.orderStatus}
                                </div>
                                <span className="text-xl font-black text-slate-900">${order.totalPrice.toFixed(2)}</span>
                            </div>

                            {/* Action Button */}
                            <Link to={`/customer/orders/${order._id}`} className="w-12 h-12 flex items-center justify-center bg-slate-50 rounded-full group-hover:bg-slate-900 group-hover:text-white transition-colors">
                                <ChevronRight size={20} />
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default OrdersPage;
