import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from '../context/ShopContext';
import { assets } from "../assets/assets";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";
const Collection = () => {
  const {products ,search, showSearch} = useContext(ShopContext); //MAIN DATA SOURCE => contains all the products
  const [showFilter, setShowFilter] = useState(false);
  //State variblas fior profuct mapping
  const [fiteredProducts, setFilteredProducts] = useState([]);
  //state variable for category filter
  const [category,setCategory] = useState([]);
  const [subCategory,setSubCategory] = useState([]);
  //state variable for product sort
  const [sortType,setSortType] = useState("relevant");
  //Product mapping on page load
  useEffect(() => {
    setFilteredProducts(products);
  }, []);

  //Toggle category filter
  const toggleCategory = (event) => { 
    if(category.includes(event.target.value)){
      setCategory(prev=> prev.filter(item => item != event.target.value))
    }else{
      setCategory(prev => [...prev,event.target.value]);
    }
  }
  //Toggle sub category filter
  const toggleSubCategory = (event)=>{
      if(subCategory.includes(event.target.value)){
        setSubCategory(prev=> prev.filter(item => item!= event.target.value));
      }else{
        setSubCategory(prev => [...prev,event.target.value]);
      }
  }
  
  //To apply filter on category and sub category change  and also for "Search"
  const applyFilter = () =>{
    let productsCopy = products.slice();
    if(category.length > 0){
      productsCopy = productsCopy.filter(item=> category.includes(item.category)); 
    }
    if(subCategory.length > 0){
      productsCopy = productsCopy.filter(item=> subCategory.includes(item.subCategory));
    }
    //Filter for search
    if(showSearch && search){
      productsCopy = productsCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
    }
    setFilteredProducts(productsCopy);
  }

  useEffect(()=>{
    applyFilter();
  },[category,subCategory,search,showSearch])


  const sortProducts = () => {
    let filteredProductsCopy = fiteredProducts.slice();
    switch(sortType){
      case "low-high":
        setFilteredProducts(filteredProductsCopy.sort((a,b)=>(a.price-b.price)));
        break;
      case "high-low":
        setFilteredProducts(filteredProductsCopy.sort((a,b)=>(b.price-a.price)));
        break;
      default:
        applyFilter();
        break;
    }
  }
  
  useEffect(()=>{
    sortProducts();
  },[sortType])

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
                onChange={toggleCategory}
              />
              Men
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer hover:text-black transition">
              <input
                type="checkbox"
                className="w-4 h-4 accent-black rounded"
                value={"Women"}
                onChange={toggleCategory}
              />
              Women
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer hover:text-black transition">
              <input
                type="checkbox"
                className="w-4 h-4 accent-black rounded"
                value={"Kids"}
                onChange={toggleCategory}
              />
              Kids
            </label>
          </div>
        </div>
        {/*  Sub Category Filter*/}
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
                onChange={toggleSubCategory}
              />
              Topwear
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer hover:text-black transition">
              <input
                type="checkbox"
                className="w-4 h-4 accent-black rounded"
                value={"Bottomwear"}
                onChange={toggleSubCategory}
              />
              Bottomwear
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer hover:text-black transition">
              <input
                type="checkbox"
                className="w-4 h-4 accent-black rounded"
                value={"Winterwear"}
                onChange={toggleSubCategory}
              />
              Winterwear
            </label>
          </div>
        </div>
      </div>
      {/* Right side */}
      <div className="flex-1">
        <div className="flex justify-between text-base sm:text-2xl mb-4">
          <Title text1={"ALL"} text2={"COLLECTIONS"} />
          {/* Product Sort */}
          <select className="border-2 border-gray-300 text-sm px-2" value={sortType} onChange={(e) => setSortType(e.target.value)}>
            <option value="relevance">Sort by : Relevance</option>
            <option value="low-high">Sort by : Price (Low to High)</option>
            <option value="high-low">Sort by : Price (High to Low)</option>
          </select>
        </div>
        {/* Map products */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
          {
            fiteredProducts.map((item,index) => (
                <ProductItem key={index} name={item.name} id={item._id} price={item.price} image={item.image}/>
            ))
          }
        </div>
      </div>
    </div>
  );
};

export default Collection;
