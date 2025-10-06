import React from "react";
import ziglyVideo from "../../assets/zigly.mp4";

const AboutVideo = () => {
  return (
    <section className="py-12 px-4 md:py-16 bg-white">
      <div className="container mx-auto">
        {/*
          Main Flex Container:
          - items-stretch: Ensures children fill the full height of the row.
          - items-center: (Removed) Now relying on items-stretch for vertical alignment.
        */}
        <div className="flex justify-center flex-col md:flex-row gap-8 md:items-stretch">
          {/* 1. Text Content Div: Increased padding/shadow for a better look and uses h-full */}
          <div
            className="
            w-full  md:w-1/2 p-8 md:p-12 
            rounded-lg shadow-xl 
            bg-emerald-50 text-gray-800
            flex flex-col justify-center // Added: Used to vertically center text inside the stretched div
            h-112 md:h-auto
          "
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-emerald-800">
              Powered by Zigly: Your Pet’s Wellness Journey Starts Here
            </h1>
            <p className="text-base mb-6 leading-relaxed">
              Zigly isn’t just a brand — it’s a movement dedicated to pets and
              their people. In this new video, see how Zigly empowers pet
              parents through trusted products, expert advice, and a growing pet
              community. As the power behind Petstuff, Zigly brings a new
              standard of care right to your screen.
            </p>

            {/* Styled Button */}
            <button
              className="
                px-6 py-3 
                bg-emerald-700 text-slate-50 font-semibold 
                rounded-full shadow-lg 
                transition-all duration-300 ease-in-out
                hover:bg-emerald-800 hover:text-slate-100 hover:shadow-xl
                self-start // Added: Prevents button from stretching full width
              "
              onClick={() => window.open("https://zigly.com", "_blank")}
            >
              Know More
            </button>
          </div>

          {/* 2. Video Div: Clean, proportional size */}
          <div className="w-full md:w-1/2 rounded-lg overflow-hidden shadow-2xl">
            {/* The aspect-video container maintains the height/size that the text div will match */}
            <div className="w-full aspect-video">
              <video
                src={ziglyVideo}
                controls
                loop
                muted
                className="w-full h-full object-cover"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutVideo;
