import React, { useState, useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// --- Product Data (Hardcoded but using unique Picsum IDs) ---
// Each product now gets a unique 'random' ID and we'll use a fixed size (350x450).
const newProducts = [
  {
    id: 1,
    name: "Premium Dog Food",
    randomId: 101,
    price: 35.0,
    discountedPrice: 29.75,
  },
  {
    id: 2,
    name: "Luxury Cat Bed",
    randomId: 102,
    price: 60.0,
    discountedPrice: 45.0,
  },
  {
    id: 3,
    name: "Interactive Pet Toy",
    randomId: 103,
    price: 25.0,
    discountedPrice: 20.0,
  },
  {
    id: 4,
    name: "Ergonomic Dog Leash",
    randomId: 104,
    price: 40.0,
    discountedPrice: 32.0,
  },
  {
    id: 5,
    name: "Organic Catnip Spray",
    randomId: 105,
    price: 18.0,
    discountedPrice: 15.3,
  },
  {
    id: 6,
    name: "Pet Grooming Kit",
    randomId: 106,
    price: 55.0,
    discountedPrice: 41.25,
  },
  {
    id: 7,
    name: "Fish Oil Supplements",
    randomId: 107,
    price: 30.0,
    discountedPrice: 24.0,
  },
  {
    id: 8,
    name: "Small Animal Hay Bale",
    randomId: 108,
    price: 15.0,
    discountedPrice: 13.5,
  },
];

const NewArrivals = () => {
  const carouselRef = useRef(null);

  // Function to scroll the carousel
  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount =
        direction === "left"
          ? -carouselRef.current.offsetWidth / 4
          : carouselRef.current.offsetWidth / 4;

      carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="bg-emerald-50 py-12 px-4 md:py-16 relative">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center text-emerald-800 mb-10 md:mb-12">
          New Arrivals
        </h2>

        {/* Carousel Container */}
        <div className="relative">
          {/* Left Scroll Button */}
          <button
            onClick={() => scrollCarousel("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 p-3 bg-emerald-700 text-slate-50 rounded-full z-10 shadow-lg opacity-70 hover:opacity-100 transition hidden md:block"
            aria-label="Scroll Left"
          >
            <FaChevronLeft className="w-5 h-5" />
          </button>

          {/* Right Scroll Button */}
          <button
            onClick={() => scrollCarousel("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 p-3 bg-emerald-700 text-slate-50 rounded-full z-10 shadow-lg opacity-70 hover:opacity-100 transition hidden md:block"
            aria-label="Scroll Right"
          >
            <FaChevronRight className="w-5 h-5" />
          </button>

          {/* Scrollable Products List */}
          <div
            ref={carouselRef}
            className="
                    flex overflow-x-scroll snap-x snap-mandatory 
                    gap-8 pb-4 
                    scrollbar-hide 
                "
            style={{ scrollBehavior: "smooth" }}
          >
            {newProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// --- ProductCard Component ---
const ProductCard = ({ product }) => {
  // We no longer need the 'hovered' state for image swap
  const [quantity, setQuantity] = useState(1);

  // Use the Picsum URL structure with desired width and height
  const imageUrl = `https://picsum.photos/350/450?random=${product.randomId}`;

  const discountPercentage =
    product.price > 0
      ? Math.round(
          ((product.price - product.discountedPrice) / product.price) * 100
        )
      : 0;

  return (
    <div
      className="
        bg-slate-50 rounded-lg shadow-xl overflow-hidden
        flex-shrink-0 snap-center 
        w-full max-w-[350px] // Card max width is 350px
        sm:w-[calc(50%-16px)]
        md:w-[calc(33.33%-20px)]
        lg:w-[calc(25%-24px)]
        group transition-all duration-300 ease-in-out
        hover:shadow-2xl hover:scale-[1.01]
      "
    >
      {/* Image Container */}
      <div className="w-full h-[450px] overflow-hidden relative">
        <img
          src={imageUrl} // ⚡️ Uses Picsum URL directly
          alt={product.name}
          // The image will fill the 350x450 dimensions specified in the URL/container
          className="w-full h-full object-cover transition-all duration-300 ease-in-out"
        />
      </div>

      {/* Product Details */}
      <div className="p-5 flex flex-col items-center text-center">
        <h2 className="text-xl font-semibold text-emerald-700 mb-2">
          {product.name}
        </h2>

        {/* Pricing */}
        <div className="mb-3">
          <span className="text-lg text-gray-500 line-through mr-2">
            ${product.price.toFixed(2)}
          </span>
          <span className="text-2xl font-bold text-emerald-800">
            ${product.discountedPrice.toFixed(2)}
          </span>
        </div>

        {/* Quantity Enhancer */}
        <div className="flex items-center space-x-2 mb-4">
          <button
            onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
            className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition"
          >
            <FaChevronLeft className="w-3 h-3" />
          </button>
          <span className="text-lg font-medium">{quantity}</span>
          <button
            onClick={() => setQuantity((prev) => prev + 1)}
            className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition"
          >
            <FaChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* Total Discount Percentage */}
        {discountPercentage > 0 && (
          <p className="text-sm font-medium text-red-600 mb-4">
            Save {discountPercentage}%!
          </p>
        )}

        {/* Add to Cart Button */}
        <button
          className="
            mt-auto 
            px-6 py-3 
            bg-emerald-700 text-slate-50 font-semibold 
            rounded-full shadow-md 
            transition-all duration-300 ease-in-out
            hover:bg-emerald-800 hover:shadow-lg
          "
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default NewArrivals;
