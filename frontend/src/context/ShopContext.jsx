import { createContext } from "react";
import {products} from '../assets/assets' //You’re loading your product list (likely an array of objects)
export const ShopContext = createContext() //This creates a global store . Any component can access it later using useContext

//context provider function = > This is a wrapper component that will provide data to all child components
const ShopContextProvider = (props) =>{
    // create some variables
    const currency = '$';
    const delivery_fee = 10;

    const value = {
        currency,
        delivery_fee,
        products
    }
    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}
export default ShopContextProvider;