import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
export const useShop = () => {
  const value = useContext(ShopContext);
  if (!value) throw new Error("useShop must be used inside ShopProvider.");
  return value;
};
