import React from "react";
import Hero from "../components/Layout/Hero";
import Marquee from "../components/Common/Marquee";
import DistinctPets from "../components/Products/DistinctPets";
import ProductCarousel from "../components/Products/ProductCarousel";
import AboutVideo from "../components/Layout/AboutVideo";
import NewArrivals from "../components/Products/NewArrivals";

const Home = () => {
  return (
    <div>
      <Hero />
      <Marquee />
      <DistinctPets />
      <ProductCarousel />
      <AboutVideo />
      <NewArrivals />
    </div>
  );
};

export default Home;
