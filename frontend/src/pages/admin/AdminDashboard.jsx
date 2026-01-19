import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import FullPageLoader from "../../loading/FullPageLoader";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, DollarSign, Users, Package, Store, Plus, TrendingUp } from "lucide-react";

const AdminDashboard = () => {
    const [store, setStore] = useState(null)
    const [analytics, setAnalytics] = useState(null)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboarData = async () => {
            try {
                // first we are checking the store exists or not 
                const storeRes = await API.get('/store/me')
                setStore(storeRes.data.store)

                // if exists, fetch analytics numbers
                if (storeRes.data.store) {
                    const analyticsRes = await API.get('/store/analytics')
                    setAnalytics(analyticsRes.data);  // data: {inventory:{..}, sales{..}}
                }
            } catch (error) {
                console.log("Dashboard fetch error", error.message)
            } finally {
                setLoading(false)
            }
        }
        fetchDashboarData()
    }, [])

    if (loading) return <FullPageLoader />;


    // extracting values from analytics which we want to show 
    const revenue = analytics?.sales?.totalRevenue.toFixed(0) || 0
    const orders = analytics?.sales?.totalOrders || 0
    const products = analytics?.inventory?.totalProducts || 0
    // Average order value
    const aov = orders > 0 ? (revenue / orders).toFixed(0) : 0

    // transforming this into dynamic stats -- main concept i learn 
    const stats = [
        { title: "Total Revenue", value: `₹${revenue}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
        { title: "Total Orders", value: orders, icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-100' },
        { title: "Total Products", value: products, icon: Package, color: 'text-orange-600', bg: 'bg-purple-100' },
        { title: "Average Order Value", value: `₹${aov}`, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-100' },
    ]


    // if there is not store this will render
    if (!store) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white rounded-3xl border-2 border-dashed border-slate-200 p-10 text-center">
                <div className="w-20 h-20 bg-orange-100 text-brand-primary rounded-full flex items-center justify-center mb-6">
                    <Store size={40} />
                </div>
                <h2 className="text-3xl font-black text-slate-800 mb-3">Your shop is empty!</h2>
                <p className="text-slate-500 max-w-sm mb-8">
                    To start selling pet supplies and tracking analytics, you first need to set up your official store.
                </p>
                <button
                    onClick={() => navigate('/admin/store/create')}
                    className="flex items-center gap-2 bg-brand-primary text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-orange-200 hover:scale-105 transition-all"
                >
                    <Plus size={20} /> Create My Store
                </button>
            </div>
        );
    }

    // this will render if all good store check and stats also came from api
    return (
        <div className="space-y-8">
            {/* Header section */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Dashboard</h1>
                    <p className="text-slate-500 text-sm font-medium">Overview of <span className="text-brand-primary">{store?.name}</span></p>
                </div>
                {/* to show good ui this is today date */}
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">
                    {new Date().toLocaleDateString('en-Us', { month: 'long', year: 'numeric' })}
                </p>
            </div>

            {/* stats grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ">
                {stats.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <div key={index} className="bg-white p-6 rounded-4xl shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-md transition-shadow cursor-default ">
                            <div className={`${item.bg} ${item.color} p-4 rounded-2xl`}>
                                <Icon size={24} />
                            </div>
                            <div>
                                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">{item.title}</p>
                                <h2 className="text-2xl font-black text-slate-800">{item.value}</h2>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* visual polish some features  */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 flex flex-col justify-center items-center text-center space-y-4">
                    <div className="p-4 bg-orange-50 text-brand-primary rounded-full">
                        <Package size={32} />
                    </div>
                    <h3 className="font-bold text-slate-800">Quick Actions</h3>
                    <p className="text-sm text-slate-500">Easily manage your stock or add new items to paw-admin.</p>
                    <div className="flex gap-3">
                        <button onClick={() => navigate('/admin/products/add')} className="bg-brand-primary text-white px-6 py-2 rounded-xl font-bold text-sm shadow-orange-100">Add Product</button>
                        <button onClick={() => navigate('/admin/products')} className="bg-slate-100 text-slate-600 px-6 py-2 rounded-xl font-bold text-sm ">View Inventory</button>
                    </div>
                </div>

                <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white flex flex-col justify-center relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="text-xl font-black mb-2">Ready for sales</h3>
                        <p className="text-slate-400 text-sm mb-6 ">Explore deep insights and customer behavior in your analytics tab.</p>
                        <button onClick={() => navigate('/admin/analytics')} className="bg-white text-slate-900 px-6 py-2 rounded-xl font-bold text-sm">Go to Analytics</button>
                    </div>
                    {/* abstract background shape for visual appeal */}
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-brand-primary/20 rounded-full blur-3xl"></div>
                </div>
            </div>

        </div>
    )
}

export default AdminDashboard