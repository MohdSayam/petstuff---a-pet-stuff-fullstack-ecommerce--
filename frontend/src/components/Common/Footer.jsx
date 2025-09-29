import React from "react";
import { Link } from "react-router-dom";
import { TbBrandMeta } from "react-icons/tb";
import { IoLogoInstagram } from "react-icons/io5";
import { RiTwitterXLine } from "react-icons/ri";
import Copyright from "../Layout/Copyright";

const Footer = () => {
  return (
    <>
      <footer className="bg-slate-800 text-slate-50 flex flex-col md:flex-row md:justify-around shadow-xl">
        <div className="mt-6 px-6 md:mr-0 text-slate-150 mb-8">
          <h1 className="font-light text-emerald-500">Newsletter</h1>
          <p className="text-sm mt-4 space-x-0.5">
            Be the first to hear about new products and so you will never misses
            any offer!
          </p>
          <p className="mt-2 text-xs font-semibold italic">
            Sign up and get 10% off on your first order!
          </p>

          <div className="flex mt-4">
            <input
              className="border-none bg-amber-50 text-black outline-none px-2 rounded-bl-md rounded-tl-md py-0.5 w-full md:w-auto"
              type="email"
              placeholder="Enter your email"
            />
            <button className="py-0.5 px-2 bg-emerald-700 text-slate-50 rounded-r-md whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>

        <div className="mt-6 px-6 md:mr-0 text-slate-150 mb-8">
          <h1 className="mb-4 font-light text-emerald-500">Shop</h1>
          <nav className="flex flex-col space-y-1">
            <Link className="hover:text-emerald-400 hover:underline">Dog</Link>
            <Link className="hover:text-emerald-400 hover:underline">Cat</Link>
            <Link className="hover:text-emerald-400 hover:underline whitespace-nowrap">
              Small Animals
            </Link>
          </nav>
        </div>

        <div className="mt-6 px-6 md:mr-0 text-slate-150 mb-8">
          <h1 className="mb-4 font-light text-emerald-500">Support</h1>
          <nav className="flex flex-col space-y-1">
            <Link className="hover:text-emerald-400 hover:underline whitespace-nowrap">
              Contact Us
            </Link>
            <Link className="hover:text-emerald-400 hover:underline whitespace-nowrap">
              About Us
            </Link>
            <Link className="hover:text-emerald-400 hover:underline whitespace-nowrap">
              FAQ
            </Link>
            <Link className="hover:text-emerald-400 hover:underline whitespace-nowrap">
              Features
            </Link>
          </nav>
        </div>

        <div className="mt-6 px-6 md:mr-0 flex flex-col space-y-6 text-slate-150 mb-8">
          {/* Follow Us Section */}
          <div>
            <h1 className="mb-2 font-light text-emerald-500 whitespace-nowrap">
              Follow Us!
            </h1>
            <div className="flex items-center space-x-3">
              <a href="#" className="hover:text-emerald-400">
                <TbBrandMeta className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-emerald-400">
                <IoLogoInstagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-emerald-400">
                <RiTwitterXLine className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Call Us Section */}
          <div>
            <h1 className="mb-2 font-light text-emerald-500 whitespace-nowrap">
              Call Us!
            </h1>
            <a
              href="tel:+91-8787878787"
              className="hover:text-slate-300 text-sm whitespace-nowrap"
            >
              +(91)-8787878787
            </a>
          </div>
        </div>
      </footer>
      <Copyright />
    </>
  );
};

export default Footer;
