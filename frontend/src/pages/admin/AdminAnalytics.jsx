import React, {useState, useEffect} from 'react'
import API from "../../api/axios";
import {PieChart , Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid} from "recharts";
import {TrendingUp, Package, AlertTriangle, CheckCircle2 } from "lucide-react";
import FullPageLoader from "../../loading/FullPageLoader";

function AdminAnalytics() {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)

    // month translator
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    useEffect (()=>{
        const fetchAnalytics = async () => {
            try {
                const res = await API.get("/store/analytics");
                setData(res.data);                
            } catch (error) {
                console.error("Analytics fetch Error", error)
            } finally {
                setLoading(false)
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) return <FullPageLoader/>

    //safety check
    if (!data) return null;

    // data transformation in data= {inventory{}, sale{}}
    const {inventory, sales} = data;
    const healthyCount = inventory.totalProducts - (inventory.outOfStock + inventory.lowStock);

    // this is where we are making donut kind of chart
    const inventoryData = [
        {name: "Healthy", value:healthyCount, color:'#10B981'},
        {name: "Low Stock", value:inventory.lowStock, color:'#F59E0B'},
        {name: "Out of Stock", value:inventory.outOfStock, color:'#EF4444'},
    ];

    // sales data line chart we map 12 months even no sale
    const chartData = monthNames.map((month,index)=>{
        const monthData = sales.monthlyBreakdown.find(m => m.month === index+1);
        return {
            name: month,
            revenue: monthData ? monthData.revenue : 0
        }
    })

  return (
    <div className='space-y-8 pb-10'>
        {/* Header */}
        <div>
            <h1 className='text-3xl font-black text-slate-800'>Store Analytics</h1>
            <p className='text-slate-500'>Deep dive in your sales and inventory stats</p>
        </div>

        {/* Grid Layout  */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            
            {/* Card1: sales overview-- spans 2 columns on desktop */}
            <div className='lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm '>
                <div className='flex items-center justify-between mb-8'>
                    <h3 className='font-bold text-slate-800 flex items-center gap-2'>
                        <TrendingUp size={20} className='text-brand-primary'/>Sales Trend
                    </h3>
                    <span className='text-xs font-bold text-slate-400 uppercase tracking-widest'>Last 12 months</span>    
                </div>

                <div className='h-80 w-full'>
                    <ResponsiveContainer width="100%" height="100%" debounce={50}>
                        <LineChart data={chartData} key={`line-${chartData.length}`}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke='#f1f5f9' />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize:12}} dy={10}/>
                            <YAxis axisLine={false} tickLine={false} tick={{fill:'#94a3b8', fontSize:12}}/>
                            <Tooltip contentStyle={{borderRadius:'15px', border:'none', boxShadow:'0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                            <Line type="monotone" dataKey="revenue" stroke='#FF7A30' strokeWidth={4} dot={{r:6, fill: '#FF7A30', strokeWidth: 2, stroke: '#fff'}} activeDot={{r:8}} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Card:2 Inventory Donut  */}
            <div className='bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col min-h-0'>
            <h3 className='font-bold text-slate-800 mb-6 flex items-center gap-2'>
                <Package size={20} className='text-brand-primary' /> Stock Health
            </h3>

            <div className="relative h-80 w-full">
                <div className='absolute inset-0 flex flex-col items-center justify-center pointer-events-none'>
                <span className='text-4xl font-black text-slate-800'>
                    {inventory.totalProducts}
                </span>
                <span className='text-[10px] font-bold text-slate-400 uppercase'>
                    Items
                </span>
                </div>

                <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                    data={inventoryData}
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={8}
                    dataKey="value"
                    >
                    {inventoryData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} stroke="none" />
                    ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
                </ResponsiveContainer>
            </div>

            <div className='mt-auto space-y-3'>
                {inventoryData.map((item) => (
                <div key={item.name} className='flex items-center justify-between text-sm'>
                    <div className='flex items-center gap-2'>
                    <div className='w-3 h-3 rounded-full' style={{ backgroundColor: item.color }} />
                    <span className='text-slate-500 font-medium'>{item.name}</span>
                    </div>
                    <span className='font-bold text-slate-800'>{item.value}</span>
                </div>
                ))}
            </div>
            </div>
 
        </div>
    </div>
  )
}

export default AdminAnalytics