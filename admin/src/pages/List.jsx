import React, { useEffect, useState } from "react";
import { backendURL, Currency } from "../App";
import axios from "axios";
import { toast } from "react-toastify";

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const fetchList = async () => {
    try {
      const response = await axios.get(backendURL + "/api/product/list");
      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const removeProduct = async(id)=>{
    try {
      const response = await axios.post(backendURL+"/api/product/remove", {id}, {headers:{token}});
      if(response.data.success){
        toast.success(response.data.message);
        await fetchList();
      }else{
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  }

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <>

      <h1 className="text-2xl font-semibold text-gray-700 mb-4">
        All Products
      </h1>

      <div className="flex flex-col gap-2">
        {/* List Table Title */}
        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 gap-2 border border-gray-300 bg-gray-100 text-sm">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className="text-center">Action</b>
        </div>
        {/* Product List  */}
        {list?.map((item,index) =>(
          <div className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border border-gray-300 bg-gray-100 text-sm" key={index}>
            <img className="w-20" src={item.images?.[0]} alt="" />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>{Currency}{item.price}</p>
            <p onClick={()=>{removeProduct(item._id)}} className="text-right md:text-center cursor-pointer text-lg">X</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default List;
