import React, { useContext ,useState ,useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';
import ProductItem from './ProductItem';

const LatestCollection = () => {
  
    const { products } = useContext(ShopContext);

    //STATE VARIBLES
    const [latestProducts, setLatestProducts] = useState([])

    //USE EFFECT
    useEffect(()=>{
        //get the latest products from the products array
        const latest = products.slice(-10); // Assuming you want the last 4 products as the latest collection
        setLatestProducts(latest);
    }, [])

  return (
    <div>
        <div className="my-10">
            <div className="text-center py-8 text-3xl">
                <Title text1={'LATEST'} text2={'COLLECTIONS'}/>
                <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
                    Explore our latest collection of products, featuring the newest trends and styles.
                </p>
            </div>
        </div>
        {/* Redering products */}
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
            {
                latestProducts.map((item,index)=>{
                        return <ProductItem key={index} id={item._id} image={item.image} name={item.name} price={item.price}/>
                })
            }

        </div>
    </div>
  )
}

export default LatestCollection