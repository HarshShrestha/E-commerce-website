import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsLetter from '../components/NewsLetter'

const About = () => {
  return (
    <div>
      <div className="text-2xl text-center pt-8 border-t border-gray-300">
        <Title text1={"ABOUT"} text2={"US"}/>
      </div>
      <div className="my-10 flex flex-col md:flex-row gap-16">
        <img src={assets.about_img} className='w-full md:max-w-[480px]' alt="" />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
          <p>Forever was born out of a passion for quality, innovation, and exceptional customer experiences. Our journey is driven by a relentless pursuit of excellence, with a focus on carefully crafted products, dependable service, and creating lasting value for every customer.</p>
          <p>Since our inception, we have been committed to delivering exceptional products that exceed customer expectations. From fashion to footwear, we strive to deliver the best quality items that blend style with durability. Our carefully curated collection is designed to cater to diverse tastes and preferences, ensuring every customer finds something perfect for their lifestyle.</p>
          <b className='text-gray-800'>Our Mission</b>
          <p>Our mission is to provide our customers with the highest quality products at competitive prices, while maintaining the highest standards of integrity and customer service.</p>
        </div>
      </div>

      <div className='text-xl py-4'>
        <Title text1={"WHY"} text2={"CHOOSE US"}/>
      </div>
      <div className='flex flex-col md:flex-row text-sm mb-20'>
        <div className='border border-gray-300 px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-4'>
          <b>Quality Assurance : </b>
          <p className='text-gray-600'>All our products undergo rigorous quality checks to ensure they meet the highest standards.</p>
        </div>
        <div className='border border-gray-300 px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-4'>
          <b>Convenience : </b>
          <p className='text-gray-600'>All our products are designed with the customer in mind, ensuring a seamless shopping experience.</p>
        </div>
        <div className='border border-gray-300 px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-4'>
          <b>Exceptional Customer Service : </b>
          <p className='text-gray-600'>We are committed to providing outstanding customer service and support.</p>
        </div>
      </div>
      <NewsLetter />
    </div>
  )
}

export default About