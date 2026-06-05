import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
export const ShopContext = createContext() //This creates a global store . Any component can access it later using useContext
import {useNavigate} from 'react-router-dom';
import axios from "axios";

//context provider function = > This is a wrapper component that will provide data to all child components
const ShopContextProvider = (props) =>{
    // create some variables
    const currency = '$';
    const delivery_fee = 10;
    const backendURL = import.meta.env.VITE_BACKEND_URL;
    const [search,setSearch] = useState("");
    const [showSearch,setShowSearch] = useState(false);
    const [cartItems,setCartItems] = useState([]); //for cart items
    const [products,setProducts] = useState([]); //for products data , we will fetch it from backend and store it here
    const [token,setToken] = useState(''); //for user token after login
    const navigate = useNavigate();

    const getProducts = async() =>{
        try {
            const response = await axios(backendURL + "/api/product/list");
            if(response.data.success){
                setProducts(response.data.products)
            }else{
                toast.error(response.data.message)
            }
            
        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }
    const addToCart = async(itemId,size) =>{
        if(!size){
            toast.error("Please select the product size!");
            return
        }
        let cartData = structuredClone(cartItems);
        if(cartData[itemId]){
            if(cartData[itemId][size]){
                cartData[itemId][size] +=1;
            }else{
                cartData[itemId][size] = 1;
            }
        }else{
            cartData[itemId]={};
            cartData[itemId][size] = 1;
        }
        setCartItems(cartData);
    }

    const getCartCount = () =>{
        let totalCount = 0;
        for(const items in cartItems){
            for(const item in cartItems[items]){
                try {
                    if(cartItems[items][item]>0){
                        totalCount+= cartItems[items][item];
                    }
                } catch (error) {
                    console.error("Error occurred while calculating cart count:", error);
                }
            }
        }
        return totalCount;
    }

    const updateQuantity = async (itemId,size,quantity) =>{
        let cartData = structuredClone(cartItems);
        cartData[itemId][size] = quantity;
        setCartItems(cartData);
    }
    
    const getCartAmount = () =>{
        let totalAmount = 0;
        for(const items  in cartItems){
            let itemInfo = products.find((product)=>product._id === items);
            for(const item in cartItems[items]){
                try{
                    if(cartItems[items][item]>0){
                        totalAmount += itemInfo.price * cartItems[items][item];
                    }
                }catch(error){

                }
            }
        }
        return totalAmount;
    }   

    useEffect(()=>{
        getProducts();
    },[])


    const value = {
        currency,
        delivery_fee,
        products,
        search, setSearch, showSearch,setShowSearch,
        cartItems, addToCart , getCartCount , updateQuantity,
        getCartAmount, 
        navigate,
        backendURL,
        setToken, token
    }
    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}
export default ShopContextProvider;