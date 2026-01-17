import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { X,History, ArrowUpNarrowWide, ArrowDownWideNarrow, Trash2,Sparkles } from 'lucide-react';

const ProductFilter = ({ isOpen, toggleSidebar }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Helper to update specific filters
  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) newParams.set(key, value);
    else newParams.delete(key);
    setSearchParams(newParams);
  };

  const productTypes = ["Food", "Medicines", "Toys", "Accessories", "Grooming", "Snacks"];
  const animalTypes = ["Dog", "Cat", "Bird", "Other"];

  return (
    <aside className={`fixed inset-y-0 left-0 z-50 w-80 bg-white border-r border-slate-100 p-6 transform transition-transform lg:relative lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} overflow-y-auto`}>
      
      {/* Mobile Header */}
      <div className="flex items-center justify-between mb-8 lg:hidden">
        <h2 className="text-xl font-black italic uppercase">Filters</h2>
        <button onClick={toggleSidebar} className="p-2 bg-slate-50 rounded-full"><X size={20}/></button>
      </div>

      <div className="space-y-10">
        
        {/* 1. SORT BY PRICE */}
        <div>
           <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Sort By Price</h3>
           <div className="flex gap-2">
               <button 
                  onClick={() => updateFilter('sort', 'priceAsc')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-bold transition-all border-2 ${searchParams.get('sort') === 'priceAsc' ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-100 text-slate-600 hover:border-slate-300'}`}
               >
                   <ArrowUpNarrowWide size={16}/> Low to High
               </button>
               <button 
                  onClick={() => updateFilter('sort', 'priceDesc')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-bold transition-all border-2 ${searchParams.get('sort') === 'priceDesc' ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-100 text-slate-600 hover:border-slate-300'}`}
               >
                   <ArrowDownWideNarrow size={16}/> High to Low
               </button>
           </div>
        </div>

        {/* 2. SORT BY DATE (New Addition) */}
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Sort By Date</h3>
          <div className="flex gap-2">
              <button 
                  onClick={() => updateFilter('sort', 'newest')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-bold transition-all border-2 ${searchParams.get('sort') === 'newest' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 text-slate-600 hover:border-slate-300'}`}
              >
                  <Sparkles size={16}/> Newest
              </button>
              <button 
                  onClick={() => updateFilter('sort', 'oldest')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-bold transition-all border-2 ${searchParams.get('sort') === 'oldest' ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-100 text-slate-600 hover:border-slate-300'}`}
              >
                  <History size={16}/> Oldest
              </button>
          </div>
        </div>

        {/* 2. PET TYPE */}
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Pet Type</h3>
          <div className="flex flex-wrap gap-2">
            {animalTypes.map(type => (
              <button 
                key={type}
                onClick={() => updateFilter('animalType', type)}
                className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all ${searchParams.get('animalType') === type ? 'bg-brand-primary text-white shadow-lg shadow-orange-200' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* 3. PRODUCT CATEGORY */}
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Category</h3>
          <div className="flex flex-col gap-1">
            {productTypes.map(type => (
              <label key={type} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${searchParams.get('productType') === type ? 'bg-slate-50' : 'hover:bg-slate-50'}`}>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${searchParams.get('productType') === type ? 'border-brand-primary' : 'border-slate-300'}`}>
                    {searchParams.get('productType') === type && <div className="w-2.5 h-2.5 rounded-full bg-brand-primary" />}
                </div>
                <input 
                  type="radio" 
                  name="productType"
                  className="hidden"
                  onChange={() => updateFilter('productType', type)}
                  checked={searchParams.get('productType') === type}
                />
                <span className={`text-sm font-bold ${searchParams.get('productType') === type ? 'text-slate-900' : 'text-slate-500'}`}>{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 4. PRICE RANGE */}
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Price Range</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                <input 
                    type="number" 
                    placeholder="Min" 
                    className="w-full bg-slate-50 rounded-2xl py-3 pl-7 pr-3 text-sm font-bold outline-none focus:ring-2 focus:ring-brand-primary/20"
                    onChange={(e) => updateFilter('minPrice', e.target.value)}
                />
            </div>
            <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                <input 
                    type="number" 
                    placeholder="Max" 
                    className="w-full bg-slate-50 rounded-2xl py-3 pl-7 pr-3 text-sm font-bold outline-none focus:ring-2 focus:ring-brand-primary/20"
                    onChange={(e) => updateFilter('maxPrice', e.target.value)}
                />
            </div>
          </div>
        </div>

        {/* CLEAR BUTTON */}
        <button 
          onClick={() => setSearchParams({})}
          className="w-full flex items-center justify-center gap-2 py-4 text-xs font-black uppercase tracking-widest text-white bg-red-600 hover:bg-red-500 rounded-2xl transition-colors"
        >
          <Trash2 size={16} /> Clear All Filters
        </button>
      </div>
    </aside>
  );
};

export default ProductFilter;