import React from "react";
import heroImg from "../../assets/heroImages.jpg";

const Hero = () => {
  return (
    <section className="hero relative">
      <img
        src={heroImg}
        alt="Hero Image"
        className=" w-full h-[400px] md:h-[480px] lg:h-[560px] object-cover"
      />

      <div className="absolute inset-0 bg-black opacity-50 z-10"></div>

      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-slate-50 text-center ">
        <h1 className="text-3xl md:text-5xl lg:text-6xlfont-extrabold mb-4 drop-shadow-lg text-white ">
          Quality Food and Fun Stuff
        </h1>

        <p className="text-lg md:text-xl lg:text-2xl mb-8 drop-shadow-md max-w-2xl">
          We care every pet like our own.
        </p>

        <button
          className="rounded-md w-32 px-3 py-2 bg-emerald-700 hover:bg-emerald-600 hover:text-white shadow-xl 
            transition duration-300
             "
        >
          Explore Now
        </button>
      </div>
    </section>
  );
};

export default Hero;
