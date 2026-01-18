import React from 'react'
import {Link, useLocation} from 'react-router-dom'

// first time using lucide react icons
import { 
  LayoutDashboard, 
  Store, 
  PackageSearch, 
  BarChart3, 
  User, 
  LogOut, 
  X,
  Globe,
  ShoppingCart
} from 'lucide-react'; 

// isOpen, logout and toggleSidebar is props from the AdminLayout
const AdminSidebar = ({isOpen, toggleSidebar, logout})=>{
    const location = useLocation();

    // every button we will use there
    const menuItems = [
        {name:'Dashboard', path:'/admin', icon: LayoutDashboard},
        {name:'My Store', path:'/admin/store', icon: Store},
        {name:'Inventory', path:'/admin/products', icon: PackageSearch},
        {name:'Orders', path:'/admin/orders', icon: ShoppingCart},
        {name:'Analytics', path:'/admin/analytics', icon: BarChart3},
        {name:'Profile', path:'/admin/profile', icon: User},
    ];

    return (
        <>
        
        {/* The sidebar box */}
        <aside
            className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-brand-dark text-white p-6 transition-transform duration-300 ease-in-out
                lg:relative lg:translate-x-0 
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
        >
            {/* this is the logo area */}
            <div className='flex items-center justify-between mb-10'>
                <h1 className='text-2xl font-black text-brand-primary italic'>PawAdmin</h1>
                {/* Close button only for mobile */}
                <button onClick={toggleSidebar} className='lg:hidden text-2xl text-slate-400'>
                <X size={24 } />
                </button>
            </div>

            {/* Navigation links */}
            <nav className='flex-1 space-y-2 '>
                {menuItems.map((item)=>{
                    const Icon = item.icon
                    const isActive = location.pathname === item.path 

                    return (
                         <Link
                key={item.name}
                to={item.path}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                  ${isActive 
                    ? 'bg-brand-primary text-white shadow-lg shadow-orange-900/20' 
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}
                `}
              >
                <Icon 
                   size={20} 
                   className={`${isActive ? 'text-white' : 'text-slate-400 group-hover:text-brand-primary'} transition-colors`} 
                />
                <span className="font-semibold text-sm">{item.name}</span>
              </Link>
            );
          })}

          <div className="pt-4 mt-4 border-t border-slate-800">
                    <Link
                        to="/" // Goes to Public Home Page
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-brand-primary/10 hover:text-brand-primary transition-all duration-200 group"
                    >
                        <Globe size={20} className="group-hover:rotate-12 transition-transform" />
                        <span className="font-semibold text-sm">View Live Shop</span>
                    </Link>
            </div>
        </nav>

        {/* logout button */}
        <div className="pt-6 border-t border-slate-800">
            <button 
                onClick={logout}
                className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-all duration-200 group"
            >
                <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
                <span className="font-semibold text-sm">Logout</span>
            </button>
        </div>
        </aside>

        {/* Black transparent when sidebar open in mobile (for mobile only logic) */}
        {
            isOpen && (
                <div className='fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden' onClick={toggleSidebar}>
                </div>
            )
        }
        </>
    )
};

export default AdminSidebar;