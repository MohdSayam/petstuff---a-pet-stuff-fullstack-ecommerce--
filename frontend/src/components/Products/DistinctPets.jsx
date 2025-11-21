import React from "react";
import cats from "../../assets/cats.jpg";
import dogs from "../../assets/dogs.jpg";
import others from "../../assets/others.jpg";
import { Link } from "react-router-dom";

const DistinctPets = () => {
  // Array of pet categories for cleaner structure
  const petCategories = [
    { name: "Cats", imageSrc: cats, linkTo: "" }, // Adjusted linkTo for realism
    { name: "Dogs", imageSrc: dogs, linkTo: "" },
    { name: "Others", imageSrc: others, linkTo: "/" },
  ];

  return (
    <section className="distinctPets mt-8">
      <div className="container mx-auto px-4 py-2">
        <div className="flex flex-col sm:flex-row gap-8 justify-center items-start">
          {petCategories.map((category) => (
            <Link
              key={category.name}
              to={category.linkTo}
              className="group flex flex-col items-center w-full sm:w-1/3 p-4 transition duration-300 ease-in-out hover:scale-[1.1] text-center"
            >
              {/* Image Container: Ensures uniform size and consistency */}
              <div className="w-full max-w-[350px] h-[400px] mx-auto overflow-hidden border border-slate-200 rounded-md shadow-xl group-hover:shadow-2xl transition-shadow duration-300 ease-in-out">
                <img
                  src={category.imageSrc}
                  alt={category.name}
                  // w-full h-full object-cover: Ensures the image fills the container without distortion
                  className="w-full h-full object-cover"
                />
              </div>

              <h2 className="text-2xl mt-4 font-semibold text-emerald-700 transition-colors duration-300 ease-in-out group-hover:text-emerald-800">
                {category.name}
              </h2>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DistinctPets;
