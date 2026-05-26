//Four contoller functions
//1. Add product =>using multer middleware so that the form data passes through multer
//2. Show all products (listProducts)
//3. Delete product
//2. Show one product (singleProduct)

import {v2 as cloudinary} from 'cloudinary'
import { json } from 'express';
import productModel from '../models/product.model.js';

const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, subCategory, sizes, bestSeller } = req.body;
        //get produt images from multer
        const image1 = req.files?.image1?.[0]?.path ?? null;
        const image2 = req.files?.image2?.[0]?.path ?? null;
        const image3 = req.files?.image3?.[0]?.path ?? null;
        const image4 = req.files?.image4?.[0]?.path ?? null;

        // store the images into an array and upload to Cloudinary
        const images = [image1, image2, image3, image4].filter(Boolean);
        let imagesUrl = [];
        if (images.length > 0) {
            imagesUrl = await Promise.all(
                images.map(async (imagePath) => {
                    // `imagePath` is a local file path string from multer
                    const result = await cloudinary.uploader.upload(imagePath, { resource_type: 'image' });
                    return result.secure_url;
                })
            );
        }
        const productData = {
            name,
            description, 
            price:Number(price), 
            category, 
            subCategory,
            bestSeller : bestSeller === "true" ?true : false, 
            sizes : JSON.parse(sizes),
            images: imagesUrl,
            date: Date.now()
        };
        const product = new productModel(productData);
        await product.save();
        console.log(product);
        
        res.json({ success :true,message: 'Product added successfully', product });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

}
const listProducts = async (req, res) => {
    //dipllay all products stored in one arrray
    try {
        const products = await productModel.find({});
        console.log([products]);
        res.json({success:true,products})
    } catch (error) {
        console.log(error);
        res.json({success:false,msg:error.message})
    }
}
const removeProduct = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.body.id);
        res.json({success:true,msg:"product removed"});
    } catch (error) {
        console.log(error);
        res.json({success:false,msg:error.message})
    }
}
const singleProduct = async (req, res) => {
 try {
    const {productId} = req.body;
    const product = await productModel.findById(productId);
    res.json({success:true,product})
 } catch (error) {
    console.log(error);
    res.json({success:false,msg:error.message})
 }
}

export { addProduct, listProducts, removeProduct, singleProduct };