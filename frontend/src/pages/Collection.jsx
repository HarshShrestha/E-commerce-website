import React, { useContext, useState } from "react";
import { ShopContext } from "../context/shopContext";
import { assets } from "../assets/assets";
const Collection = () => {
  const products = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  return (
    <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 pt-10 border-t">
      {/* Filter options */}
      <div className="min-w-60">
        <p
          onClick={() => setShowFilter(!showFilter)}
          className="my-2 text-xl flex items-center cursor-pointer gap-2"
        >
          FILTERS
          <img
            src={assets.dropdown_icon}
            alt=""
            className={`h-3 sm:hidden ${showFilter ? "rotate-90" : ""}`}
          />
        </p>
        {/*  Category Filter*/}
        <div
          className={`border border-gray-200 px-5 py-4 bg-white ${showFilter ? "" : "hidden"} sm:block`}
        >
          <p className="mb-3 text-xs font-semibold tracking-widest text-gray-500">
            CATEGORIES
          </p>
          <div className="flex flex-col gap-2.5 text-sm text-gray-700">
            <label className="flex items-center gap-2.5 cursor-pointer hover:text-black transition">
              <input
                type="checkbox"
                className="w-4 h-4 accent-black rounded"
                value={"Men"}
              />
              Men
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer hover:text-black transition">
              <input
                type="checkbox"
                className="w-4 h-4 accent-black rounded"
                value={"Women"}
              />
              Women
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer hover:text-black transition">
              <input
                type="checkbox"
                className="w-4 h-4 accent-black rounded"
                value={"Kids"}
              />
              Kids
            </label>
          </div>
        </div>
        {/*  Category Filter*/}
        <div
          className={`border border-gray-200 px-5 py-4 mt-4 bg-white ${showFilter ? "" : "hidden"} sm:block`}
        >
          <p className="mb-3 text-xs font-semibold tracking-widest text-gray-500">
            TYPE
          </p>
          <div className="flex flex-col gap-2.5 text-sm text-gray-700">
            <label className="flex items-center gap-2.5 cursor-pointer hover:text-black transition">
              <input
                type="checkbox"
                className="w-4 h-4 accent-black rounded"
                value={"Topwear"}
              />
              Topwear
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer hover:text-black transition">
              <input
                type="checkbox"
                className="w-4 h-4 accent-black rounded"
                value={"Bottomwear"}
              />
              Bottomwear
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer hover:text-black transition">
              <input
                type="checkbox"
                className="w-4 h-4 accent-black rounded"
                value={"Winterwear"}
              />
              Winterwear
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collection;
