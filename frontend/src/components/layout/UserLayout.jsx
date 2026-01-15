import React, {useState} from 'react'
import { Outlet } from 'react-router-dom'
import UserNavbar from '../customer/UserNavbar'
// footer

function UserLayout() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-slate-900">
            {/* 1. THE NAVBAR (Non-Sticky as requested) */}
            <UserNavbar isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />

            {/* 2. THE MAIN SHOWROOM */}
            <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-6 py-8">
                <Outlet />
            </main>

            {/* 3. THE FOOTER */}
            <UserFooter />
        </div>
  )
}

export default UserLayout