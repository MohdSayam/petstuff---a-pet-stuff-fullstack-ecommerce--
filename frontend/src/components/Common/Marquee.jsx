import React, { useState } from "react";

const Marquee = () => {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div
      className="overflow-hidden bg-emerald-600 text-slate-50 py-2"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className="whitespace-nowrap inline-block px-4 text-white font-bold animate-slide md:animate-slide-md"
        style={{ animationPlayState: isPaused ? "paused" : "running" }}
      >
        🛒 SALE STARTING FROM $9.99 – LIMITED TIME OFFER! 🛒 Buy Cheap Pet food
        limited offer
        <a className="ml-4 underline" href="/">
          Order Now
        </a>
      </div>

      {/* Inline style for animation */}
      <style>
        {`
          @keyframes slide {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
          .animate-slide {
            display: inline-block;
            animation: slide 10s linear infinite;
          }

          /* For larger screens: animation slower */
          @media (min-width: 1024px) {
            .animate-slide {
              animation: slide 20s linear infinite;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Marquee;
