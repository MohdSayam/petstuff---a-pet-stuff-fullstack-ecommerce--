import React from "react";
import Header from "../Common/Header";
import Footer from "../Common/Footer";
import { Outlet } from "react-router-dom";

const UserLayout = () => {
  return (
    <>
      {/* this is for header */}
      <Header />

      {/* Here all the main content */}
      <main>
        <Outlet />
      </main>

      {/* this is the footer of the layout */}
      <Footer />
    </>
  );
};

export default UserLayout;
