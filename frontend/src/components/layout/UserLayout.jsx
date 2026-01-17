import { useState } from "react";
import { Outlet } from "react-router-dom";
import UserNavbar from "../customer/UserNavbar";
import UserFooter from "../customer/UserFooter"

const UserLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
            {/* 1. Global Navbar */}
            <UserNavbar toggleMenu={toggleMenu} isMenuOpen={isMenuOpen} />

            {/* 2. Main Content (The Pages) */}
            {/* flex-1 ensures the footer is pushed to the bottom even if content is short */}
            <main className="flex-1 w-full">
                <Outlet />
            </main>

            {/* 3. Global Footer */}
            <UserFooter />
    </div>
  );
};

export default UserLayout;