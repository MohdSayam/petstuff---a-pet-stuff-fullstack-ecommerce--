import React, {useState, useContext} from "react";
import { Outlet } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext"
import AdminSidebar from "./AdminSidebar";
import { Menu, Plus, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminLayout = () => {
    // eslint-disable-next-line no-unused-vars
    const navigate = useNavigate()
    const { user, logout } = useContext(AuthContext)
    const [isOpen, setIsOpen] = useState(false)

    const toggleSidebar = ()=> setIsOpen(!isOpen)

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans">

            {/* The Sidebar */}
            <AdminSidebar 
            isOpen={isOpen}
            toggleSidebar={toggleSidebar}
            logout={logout}
            user={user}
            />

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0">

                {/* nav top */}
          <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6 sticky top-0 z-40">
    
        {/* LEFT SECTION: Hamburger + Title */}
        <div className="flex items-center gap-2 md:gap-4">
            {/* Hamburger - Always shows on < lg screens */}
            <button 
                onClick={toggleSidebar} 
                className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            >
                <Menu size={22} />
            </button>

            {/* Title - Hidden on very small screens, shows from 'sm' upwards */}
            <div className="hidden xs:block border-l lg:border-none border-slate-200 pl-3 lg:pl-0">
                <h2 className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                    Admin <span className="hidden md:inline">/ Inventory</span>
                </h2>
            </div>
        </div>

        {/* RIGHT SECTION: Quick Actions + Profile */}
        <div className="flex items-center gap-2 md:gap-4">
            {/* Profile Group */}
            <div className="flex items-center gap-2 md:gap-3 border-l border-slate-100 pl-2 md:pl-4">
                {/* Name hidden on mobile to save space */}
                <div className="text-right hidden lg:block">
                    <p className="text-xs font-bold text-slate-800 leading-tight truncate max-w-25">
                        {user?.name}
                    </p>
                    <p className="text-[10px] text-slate-400 uppercase font-medium">
                        {user?.role}
                    </p>
                </div>
                
                {/* Avatar - Always visible */}
                <div className="w-9 h-9 md:w-10 md:h-10 bg-brand-primary rounded-xl flex items-center justify-center text-white font-black shadow-sm shrink-0">
                    {user?.name?.charAt(0)}
                </div>
            </div>
        </div>
    </header>

                {/* page content container */}
                <main className="p-4 md:p-8 lg:p-10 flex-1 overflow-x-hidden">
                    {/* this is going to be main page where all other pages render */}
                    < Outlet />
                </main>

            </div>
        </div>
    )
}

export default AdminLayout;