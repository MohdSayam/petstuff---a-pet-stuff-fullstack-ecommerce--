import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// --- Image Imports ---
import prescribed_food from "../../assets/products_carousel/prescribed_food.jpg";
import cat_food from "../../assets/products_carousel/cat_food.png";
import cat_snacks from "../../assets/products_carousel/cat_snacks.jpg";
import dog_food from "../../assets/products_carousel/dogfood.jpg";
import dog_snacks from "../../assets/products_carousel/dog_snacks.png";
import pet_chunks from "../../assets/products_carousel/pet_chunks.jpg";
import pet_medicines from "../../assets/products_carousel/medicines.jpg";

const ProductCarousel = () => {
  const productImages = [
    { src: prescribed_food, name: "Prescribed Food", to: "/" },
    { src: cat_food, name: "Cat Food", to: "/" },
    { src: cat_snacks, name: "Cat Snacks", to: "/" },
    { src: dog_food, name: "Dog Food", to: "/shop/" },
    { src: dog_snacks, name: "Dog Snacks", to: "/" },
    { src: pet_chunks, name: "Pet Chunks", to: "/" },
    { src: pet_medicines, name: "Medicines", to: "/" },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const carouselRef = useRef(null);

  // 1. SCROLL-IN ANIMATION EFFECT (Intersection Observer)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (carouselRef.current) {
      observer.observe(carouselRef.current);
    }

    // Cleanup function with null check
    return () => {
      if (carouselRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(carouselRef.current);
      }
    };
  }, []);

  // 2. AUTOMATIC SLIDING (5 seconds)
  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % productImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [productImages.length, isVisible]);

  // 3. MANUAL NAVIGATION FUNCTIONS
  const goToNextSlide = () => {
    setActiveIndex((current) => (current + 1) % productImages.length);
  };

  const goToPrevSlide = () => {
    setActiveIndex(
      (current) => (current - 1 + productImages.length) % productImages.length
    );
  };

  const currentProduct = productImages[activeIndex];

  return (
    <section className="mt-10 mb-15 relative" ref={carouselRef}>
      <div className="container mx-auto px-4 flex justify-center">
        {/*
          MAIN CAROUSEL CONTAINER: Increased max-width for large screens.
          max-w-xl: default/md screens
          lg:max-w-3xl: large screens (more wide)
        */}
        <div
          className={`
            relative w-full max-w-xl lg:max-w-3xl 
            p-6 shadow-2xl rounded-lg bg-white
            transition-all duration-1000 ease-out
            ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-20"
            }
          `}
        >
          {/* NAVIGATION BUTTONS (Left/Right Chevrons) */}
          <button
            onClick={goToPrevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 ml-2 p-3 bg-emerald-700 text-slate-50 rounded-full z-10 opacity-70 hover:opacity-100 transition shadow-md"
            aria-label="Previous Slide"
          >
            <FaChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={goToNextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 mr-2 p-3 bg-emerald-700 text-slate-50 rounded-full z-10 opacity-70 hover:opacity-100 transition shadow-md"
            aria-label="Next Slide"
          >
            <FaChevronRight className="w-4 h-4" />
          </button>

          {/* CAROUSEL CONTENT */}
          <div className="flex flex-col items-center">
            {/* Product Title */}
            <h3 className="text-3xl font-bold text-gray-800 mb-4 text-center">
              {currentProduct.name}
            </h3>

            {/* Image Container: Full width, responsive height */}
            <div
              className="
              w-full // Takes full width of the carousel container
              h-80 sm:h-96 
              mx-auto mb-6 rounded-md overflow-hidden shadow-lg border border-slate-100
            "
            >
              <img
                src={currentProduct.src}
                alt={currentProduct.name}
                // ⚡ CHANGED: object-contain ensures the WHOLE image is visible, fitting within the container
                className="w-full h-full object-contain transition-opacity duration-500"
                key={activeIndex}
              />
            </div>

            {/* Explore/Buy Button: Responsive text size */}
            <Link
              to={currentProduct.to}
              // ⚡ CHANGED: sm:text-lg makes the text slightly bigger on small screens
              className="px-8 py-3 bg-emerald-700 text-slate-50 text-base sm:text-lg font-semibold rounded-full shadow-lg hover:bg-emerald-800 transition-colors duration-200"
            >
              Explore Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductCarousel;
