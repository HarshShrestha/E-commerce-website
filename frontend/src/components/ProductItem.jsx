import React from 'react'
import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom'

const ProductItem = ({id,images,name,price}) => {
    const {currency} = useContext(ShopContext);
  return (
    <div>
        <Link to={`/product/${id}`} className='text-gray-700 cursor-pointer'>
            <div className="overflow-hidden">
                <img src={images ? images[0] : 'https://tse1.mm.bing.net/th/id/OIP.O7AZ0XWcehFsvINj7zOHSQHaE8?r=0&rs=1&pid=ImgDetMain&o=7&rm=3'} className='hover:scale-110 transition ease-in-out' alt="" />
            </div>
        </Link>
        <p className='pt-3 pb-1 text-sm'>{name}</p>
        <p className='text-sm font-medium'>{currency}{price}</p>
    </div>
  )
}

export default ProductItem