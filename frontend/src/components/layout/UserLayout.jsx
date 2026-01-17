import { useState } from "react";
import { Outlet } from "react-router-dom";
import UserNavbar from "../customer/UserNavbar";

const UserLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="user-layout min-h-screen flex flex-col bg-slate-50">
      {/* We pass both the state and the function to the Navbar */}
      <UserNavbar toggleMenu={toggleMenu} isMenuOpen={isMenuOpen} />

      <main className="grow">
        <Outlet /> 
      </main>

      {/* Footer can go here later */}
    </div>
  );
};

export default UserLayout;