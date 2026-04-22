import React, { useContext, useEffect ,useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';

const Product = () => {
  const {productId} = useParams(); //we will get id from the url parameters 
  //get all the product data 
  const {products}=useContext(ShopContext);
  const [productData,setProductData] = useState({});
  const [image,setImage] = useState('')

  const fetchProductData = async() =>{
    products.map((item)=>{
      if(item._id == productId){
        setProductData(item);
        setImage(item.image[0]);
        console.log(item);
        return null;
      }
    })
  }

  useEffect(()=>{
    fetchProductData();
  },[productId,products])

  return productData ? (
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>
      {/* Product Data  */}
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        {/* Product Images */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
            <div  className='flex sm:flex-col sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full'>
                {
                  productData.image?.map((item,index)=>{
                    return <img src={item} key={index} onClick={()=>{setImage(item)}} alt=""  className='w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer'/>
                  })
                  
                }
            </div>
            <div className="w-full sm:w-[80%]">
                <img className='w-full h-auto' src={image} alt="" />
            </div>
        </div>
        {/* ---------- Product Info --------------- */}
        <div className="flex-1">
              <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>
              <div className="flex items-center gap-1 mt-2">
                <img src={assets.star_icon} alt="" className="w-3.5" />
                <img src={assets.star_icon} alt="" className="w-3.5" />
                <img src={assets.star_icon} alt="" className="w-3.5" />
                <img src={assets.star_icon} alt="" className="w-3.5" />
                <img src={assets.star_dull_icon} alt="" className="w-3.5" />
                <p className='pl-2'>(122)</p>
              </div>
        </div>
      </div>
    </div>
  ): (
    <div className='opacity-0'>
      <h1>No product found</h1>
    </div>
  )
}

export default Product