import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsLetter from '../components/NewsLetter'
const Contact = () => {
  return (
    <div>
      <div className="border-t border-gray-300 text-center text-2xl pt-10 ">
        <Title text1={"CONTACT"} text2={"US"}/>
      </div>
      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28'>
        <img className='w-full md:max-w-[480px]' src={assets.contact_img} alt="" />
        <div className="flex flex-col justify-center items-start gap-6">
          <p className='font-semibold text-xl text-gray-600'>Our Store</p>
          <p className='text-gray-500'>123 Main Street <br />New York, NY 10001 <br />USA</p>
          <p className='text-gray-500'>Phone: (123) 456-7890 <br /> Email: info@ourstore.com</p>
          <p className='font-semibold text-xl text-gray-600'>Careers at Forever</p>
          <p className='text-gray-500'>Learn more about our team and job opportunities.</p>
          <button className='border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500'>Explore Jobs</button>
        </div>
      </div>
      <NewsLetter/>
    </div>
  )
}

export default Contact