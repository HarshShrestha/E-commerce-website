import React, { useState } from "react";
import { assets } from "../assets/assets";
import { pink } from "@mui/material/colors";
import axios from "axios";
import { backendURL } from "../App";
import { toast } from "react-toastify";

const Add = ({token}) => {

  //variables to store product information
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productCategory, setProductCategory] = useState("Men");
  const [productSubCategory, setProductSubCategory] = useState("Topwear");
  const [productPrice, setProductPrice] = useState("");
  const [productSizes, setProductSizes] = useState([]);
  const [isBestSeller, setIsBestSeller] = useState(false);

  //function to handle form submission
  const onSubmitHandler = async(e)=>{
    e.preventDefault();
    try {
      const formData = new FormData();
      //API call to add product to database
      formData.append("name", productName);
      formData.append("description", productDescription);
      formData.append("category", productCategory);
      formData.append("subCategory", productSubCategory);
      formData.append("price", productPrice);
      formData.append("bestSeller", isBestSeller);
      formData.append("sizes", JSON.stringify(productSizes)); //because it is an array and we need to convert it to string before sending to backend
      //for images we need to append each image separately because multer expects each file to be in a separate field
      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);
      //send to backend via axios
      const response = await axios.post(backendURL+"/api/product/add", formData, {headers : {token}})
      
      if(response.data.success){
        toast.success(response.data.message);
        setProductName('');
        setProductDescription('');
        setProductCategory('Men');
        setProductSubCategory('Topwear');
        setProductPrice('');
        setProductSizes([]);
        setIsBestSeller(false);
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
      }else{
        toast.error(response.data.message);
      }
      
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  }
  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col w-full items-start gap-3">
      <div className="mb-2">
        <p>Upload Image</p>
        <div className="flex gap-2">
          <label htmlFor="image1" className="w-20 cursor-pointer">
            <img src={!image1 ? assets.upload_area : URL.createObjectURL(image1)} alt="" />
            <input onChange={(e)=>setImage1(e.target.files[0])} type="file" id="image1" hidden />
          </label>
          <label htmlFor="image2" className="w-20 cursor-pointer">
            <img src={!image2 ? assets.upload_area : URL.createObjectURL(image2) } alt="" />
            <input onChange={(e)=>setImage2(e.target.files[0])} type="file" id="image2" hidden />
          </label>
          <label htmlFor="image3" className="w-20 cursor-pointer">
            <img src={!image3 ? assets.upload_area : URL.createObjectURL(image3) } alt="" />
            <input onChange={(e)=>setImage3(e.target.files[0])} type="file" id="image3" hidden />
          </label>
          <label htmlFor="image4" className="w-20 cursor-pointer">
            <img src={!image4 ? assets.upload_area : URL.createObjectURL(image4) } alt="" />
            <input onChange={(e)=>setImage4(e.target.files[0])} type="file" id="image4" hidden />
          </label>
        </div>
      </div>

      <div className="w-full">
        <p className="mb-2">Product name</p>
        <input onChange={(e)=>setProductName(e.target.value)} value={productName}
          type="text"
          className="w-full max-w-[500px] px-3 py-2"
          placeholder="Type here"
          required
        />
      </div>

      <div className="w-full">
        <p className="mb-2">Product description</p>
        <textarea
          onChange={(e)=>setProductDescription(e.target.value)}
          value={productDescription}
          className="w-full max-w-125 px-3 py-2"
          placeholder="write content here"
          name=""
          required
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
        <div className="">
          <p className="mb-2">Product Category</p>
          <select onChange={(e)=>setProductCategory(e.target.value)} value={productCategory} className="w-full px-3 py-2" required>
            <option value="">Select a category</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>

        <div className="">
          <p className="mb-2">Sub Category</p>
          <select onChange={(e)=>setProductSubCategory(e.target.value)} value={productSubCategory} className="w-full px-3 py-2" required>
            <option value="">Select a sub category</option>
            <option value="Topwear">Topwear</option>
            <option value="Bottomwear">Bottomwear</option>
            <option value="Winterwear">Winterwear</option>
          </select>
        </div>

        <div className="">
          <p className="mb-2">Product Price</p>
          <input onChange={(e)=>setProductPrice(e.target.value)} value={productPrice} type="Number" placeholder="25" className="w-full px-3 py-2 sm:w-[120px]"/>
        </div>
      </div>

      <div>
        <p className="mb-2">Product Sizes</p>
        <div>
          <div className="flex gap-3">
            <div onClick={()=>setProductSizes(prev=>prev.includes("S") ? prev.filter(item=>item!=="S") : [...prev, "S"])}>
              <p className={`px-3 py-1 cursor-pointer ${productSizes.includes("S")?"bg-pink-100 border border-[#c586a5] ":" bg-slate-200"}`}>S</p>
            </div>
            <div onClick={()=>setProductSizes(prev=>prev.includes("M") ? prev.filter(item=>item!=="M") : [...prev, "M"])}>
              <p className={`px-3 py-1 cursor-pointer ${productSizes.includes("M")?"bg-pink-100 border border-[#c586a5] ":" bg-slate-200"}`}>M</p>
            </div>
            <div onClick={()=>setProductSizes(prev=>prev.includes("L") ? prev.filter(item=>item!=="L") : [...prev, "L"])}>
              <p className={`px-3 py-1 cursor-pointer ${productSizes.includes("L")?"bg-pink-100 border border-[#c586a5] ":" bg-slate-200"}`}>L</p>
            </div>
            <div onClick={()=>setProductSizes(prev=>prev.includes("XL") ? prev.filter(item=>item!=="XL") : [...prev, "XL"])}>
              <p className={`px-3 py-1 cursor-pointer ${productSizes.includes("XL")?"bg-pink-100 border border-[#c586a5] ":" bg-slate-200"}`}>XL</p>
            </div>
            <div onClick={()=>setProductSizes(prev=>prev.includes("XXL") ? prev.filter(item=>item!=="XXL") : [...prev, "XXL"])}>
              <p className={`px-3 py-1 cursor-pointer ${productSizes.includes("XXL")?"bg-pink-100 border border-[#c586a5] ":" bg-slate-200"}`}>XXL</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mt-2">
        <input onChange={()=>setIsBestSeller(!isBestSeller)} checked={isBestSeller} type="checkbox" id="bestseller" />
        <label className="cursor-pointer" htmlFor="bestseller">Add to bestseller</label>
      </div>

      <button type="submit" className="w-28 py-3 px-4 bg-black text-white">
        ADD
      </button>
    </form>
  );
};

export default Add;
