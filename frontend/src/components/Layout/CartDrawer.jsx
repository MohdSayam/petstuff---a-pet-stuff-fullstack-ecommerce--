import React from "react";
import { IoMdClose } from "react-icons/io";
import CartContent from "../Cart/CartContent";

const CartDrawer = ({ drawerOpen, toggleDrawer }) => {
  return (
    <div
      className={`fixed top-0 right-0 w-3/4 sm:w-1/2 md:w-[30rem] bg-slate-50 h-full shadow-lg transform transition-transform duration-300 flex flex-col z-50 text-slate-50 ${
        drawerOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex justify-between items-center p-4 bg-emerald-800/5 shadow-md rounded-t-lg">
        {/* Left side message */}
        <div className="flex items-center gap-2">
          <span className="text-emerald-700 font-bold text-lg">
            🛒 Big Sale!
          </span>
          <span className="text-slate-600 text-sm">
            Don’t miss out – grab your favorites now!
          </span>
        </div>

        {/* Right side close button */}
        <button
          onClick={toggleDrawer}
          aria-label="Close Cart Drawer"
          className="hover:bg-slate-200 rounded-full p-1 transition"
        >
          <IoMdClose className="h-6 w-6 text-slate-800" />
        </button>
      </div>

      {/* fix h2 tag your cart*/}
      <div className="p-4 flex-grow overflow-y-auto ">
        <h2 className=" text-2xl text-emerald-800 mb-2">My Bag (2 Items)</h2>
        <CartContent />
      </div>
      {/* All the cart content will go here */}

      {/* Checkout button */}
      <div className="p-4 text-center ">
        <button className="rounded-lg  px-4 py-2 text-slate-50 bg-emerald-600 hover:bg-emerald-700 w-full flex">
          Checkout
        </button>
        <p className="px-4 py-2 text-sm text-slate-700">
          Shipping,taxes, and discount codes included!
        </p>
      </div>
    </div>
  );
};

export default CartDrawer;
