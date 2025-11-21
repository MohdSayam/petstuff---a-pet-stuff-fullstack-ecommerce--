import React from "react";
import { Link } from "react-router-dom";
import SearchBox from "../Common/SearchBox";
import CartDrawer from "../Layout/CartDrawer";
import {
  HiOutlineUser,
  HiOutlineShoppingBag,
  HiBars3BottomRight,
} from "react-icons/hi2";
import { IoMdClose } from "react-icons/io";

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [navDrawerOpen, setNavDrawerOpen] = React.useState(false);

  const navDrawerToggle = () => {
    setNavDrawerOpen(!navDrawerOpen);
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };
  return (
    <>
      <nav className="container bg-white flex justify-between items-center py-4 px-6">
        {/* Logo */}
        <div className="flex justify-center">
          {/* Mobile menu toggle (only visible on small/medium) */}
          <button
            onClick={navDrawerToggle}
            className="lg:hidden hover:text-emerald-600 mr-3"
          >
            <HiBars3BottomRight className="h-6 w-6 text-slate-700" />
          </button>
          <Link
            to=""
            className="text-emerald-600 font-bold hover:text-emerald-500 text-2xl"
          >
            PetStuff
          </Link>
        </div>
        {/* Menu Items */}
        <div className=" hidden lg:flex space-x-4">
          <Link
            to="#"
            className="text-slate-700 hover:text-emerald-600 text-sm font-medium uppercase "
          >
            Dogs
          </Link>
          <Link
            to="#"
            className="text-slate-700 hover:text-emerald-600 text-sm font-medium uppercase "
          >
            Cats
          </Link>
          <Link
            to="#"
            className="text-slate-700 hover:text-emerald-600 text-sm font-medium uppercase "
          >
            More Pets
          </Link>
          <Link
            to="#"
            className="text-slate-700 hover:text-emerald-600 text-sm font-medium uppercase "
          >
            Accessories
          </Link>
        </div>
        {/* Right icons */}
        <div className="flex items-center w-full md:w-auto space-x-4">
          {/* SearchBox (full width on small/medium, compact on desktop) */}
          <div className="flex-1 px-4 md:px-0">
            <SearchBox />
          </div>
          {/* Profile button (hidden on small/medium, visible on large screens) */}
          <Link
            to="/profile"
            className="hidden md:block hover:text-emerald-600"
          >
            <HiOutlineUser className="h-6 w-6 text-slate-700" />
          </Link>

          {/* Shopping cart button */}
          <button
            onClick={toggleDrawer}
            className="relative hover:text-emerald-600 cursor-pointer"
          >
            <HiOutlineShoppingBag className="h-6 w-6 text-slate-700" />
            <span className="absolute -top-1 bg-emerald-600 text-slate-50 text-xs rounded-full px-2 py-0.5">
              4
            </span>
          </button>
        </div>
        <CartDrawer drawerOpen={drawerOpen} toggleDrawer={toggleDrawer} />

        {/* Mobile Navigation */}
        <div
          className={`fixed top-0 left-0 w-3/4 sm:w-1/2 md:w-1/3 bg-slate-50 h-full shadow-lg transform transition-transform duration-300  z-50 
         ${navDrawerOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex justify-between bg-emerald-800/5 shadow-lg items-center p-4">
            {/* Left side links */}
            <div className="flex gap-2 items-center">
              <a href="/profile" className="text-slate-800 hover:underline">
                <HiOutlineUser className="text-emerald-700 hover:text-emerald-600 text-2xl" />
              </a>
              <span>|</span>
              <a
                href="/login"
                className="text-emerald-700 hover:text-emerald-600  hover:underline"
              >
                Login
              </a>
              <span>/</span>
              <a
                href="/signup"
                className="text-emerald-700 hover:text-emerald-600  hover:underline"
              >
                Signup
              </a>
            </div>

            {/* Right side close button */}
            <div className="flex justify-between">
              <button
                onClick={navDrawerToggle}
                aria-label="Close navigation drawer"
              >
                <IoMdClose className="h-6 w-6 text-slate-800" />
              </button>
            </div>
          </div>

          <div className="p-4">
            <h2 className="text-2xl text-emerald-800 font-bold mb-4 ">Menu</h2>

            <nav className="space-y-4">
              <Link
                onClick={navDrawerToggle}
                className="block  text-slate-700  cursor-pointer"
              >
                Dogs
              </Link>
              <Link
                onClick={navDrawerToggle}
                className="block  text-slate-700  cursor-pointer"
              >
                Cats
              </Link>
              <Link
                onClick={navDrawerToggle}
                className="block  text-slate-700  cursor-pointer"
              >
                More Pets
              </Link>
              <Link
                onClick={navDrawerToggle}
                className="block  text-slate-700  cursor-pointer"
              >
                Accessories
              </Link>
            </nav>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
