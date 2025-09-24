import React from "react";
import TopBar from "../Layout/TopBar";
import Navbar from "../Layout/Navbar";
import Marquee from "../Common/Marquee";

const Header = () => {
  return (
    <header className="border-b border-slate-100">
      {/* this is TopBar component which is under the header component */}
      <TopBar />
      {/* // Now adding Navbar component which is under the header component */}
      <Navbar />
      {/*adding marquee*/}
      <Marquee />
    </header>
  );
};

export default Header;
