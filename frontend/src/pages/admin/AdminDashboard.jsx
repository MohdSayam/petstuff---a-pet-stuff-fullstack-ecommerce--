import React, {useEffect, useState} from "react";
import API from "../../api/axios";
import FullPageLoader from "../../loading/FullPageLoader";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, DollarSign, Users, Package, Store, Plus } from "lucide-react";

const AdminDashboard = ()=> {
    const [store, setStore] = useState(null)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate();

    useEffect(()=>{
        const fetchStoreStatus = async () => {
            try {
                const res = await API.get('/store/me')
                setStore(res.data.store)
            } catch (error) {
                console.log("No store Found for this admin", error.message)
            } finally {
                setLoading(false)
            }
        }
        fetchStoreStatus()
    },[])

    if (loading) return <FullPageLoader/>;

    // fir now static data i will update this after real data 
    const stats = [
        { title: 'Total Revenue', value: '$12,450', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100'},
        { title: 'Total Orders', value: '156', icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-100'},
        { title: 'Active Products', value: '42', icon: Users, color: 'text-orange-600', bg: 'bg-orange-100'},
        { title: 'Total Customers', value: '89', icon: Package, color: 'text-purple-600', bg: 'bg-purple-100'},
    ];

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

    return (
        <div className="space-y-8">
            {/* Header section */}
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>
                <p className="text-slate-500 text-sm">Welcome Back! Here is what's happening with your pet shop today.</p>
            </div>

            {/* Stats Grid: responsive 1 col mobile, 2 on tablet, 4 on desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((item, index)=>{
                    const Icon = item.icon;
                    return (
                        <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5 ">
                            <div className={`${item.bg} ${item.color} p-3 rounded-xl`}>
                                <Icon size={24} />
                            </div>

                            <div>
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{item.title}</p>
                                <h2 className="text-2xl font-black text-slate-800">{item.value}</h2>
                            </div>
                        </div>  
                    )
                })}
            </div>

            Placeholder for monthly sales chart 
            <div className="bg-white p-8 rounded-3xl shadow-sm border-2 border-slate-100 h-64 flex items-center justify-center border-dashed ">
                <p className="text-slate-400 font-medium">Monthly Sales Chart will appear here... 📈</p>
            </div>
            </div>
    )
}

export default AdminDashboard