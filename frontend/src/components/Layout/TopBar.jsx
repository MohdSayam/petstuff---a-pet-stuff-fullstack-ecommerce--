import React from "react";
import { TbBrandMeta } from "react-icons/tb";
import { IoLogoInstagram } from "react-icons/io5";
import { RiTwitterXLine } from "react-icons/ri";

const TopBar = () => {
  return (
    <div className="bg-emerald-600 text-slate-50">
      <div className="container mx-auto flex items-center justify-between py-2 px-4 ">
        {/* Mobile & Medium only (centered text) */}
        <div className="text-sm text-center w-full md:block lg:hidden">
          We are shipping worldwide!
        </div>

        {/* Large devices (pc) */}
        <div className="hidden lg:flex items-center justify-between w-full">
          {/* Left icons */}
          <div className="flex items-center space-x-4">
            <a href="#" className="hover:text-slate-300 ">
              <TbBrandMeta className="h-5 w-5" />
            </a>
            <a href="#" className="hover:text-slate-300 ">
              <IoLogoInstagram className="h-5 w-5" />
            </a>
            <a href="#" className="hover:text-slate-300 ">
              <RiTwitterXLine className="h-5 w-5" />
            </a>
          </div>

          {/* Center text */}
          <div className="md:text-center text-sm flex-grow">
            <span>
              We are shipping on entire earth! Your pet is waiting order now!
            </span>
          </div>

          {/* Right phone */}
          <div className="text-sm">
            <a href="tel:+91-8787878787" className="hover:text-slate-300">
              +(91)-8787878787
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
