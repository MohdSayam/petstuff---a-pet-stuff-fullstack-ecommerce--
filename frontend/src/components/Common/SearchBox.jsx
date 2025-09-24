import React from "react";
import { HiMagnifyingGlass } from "react-icons/hi2";

const SearchBox = () => {
  const [searchTerm, setSearchTerm] = React.useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchTerm);
    setSearchTerm("");
  };

  return (
    <form
      onSubmit={handleSearch}
      className="w-full flex justify-center items-center"
    >
      <div className="relative w-full md:w-64">
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-slate-200 px-4 py-2 pr-12 rounded-lg focus:outline-none w-full placeholder:text-slate-700"
        />

        <button
          type="submit"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black hover:text-emerald-600"
        >
          <HiMagnifyingGlass className="h-5 w-5" />
        </button>
      </div>
    </form>
  );
};

export default SearchBox;
