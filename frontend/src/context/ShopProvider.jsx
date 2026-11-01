import { ShopContext } from "./ShopContext";
import { useCatalog } from "../hooks/useCatalog";
import { useCart } from "../hooks/useCart";
import { useCustomerSession } from "../hooks/useCustomerSession";
import { useFavorites } from "../hooks/useFavorites";
import { useNotice } from "../hooks/useNotice";
/** Compose focused domain hooks; business state does not live in the app entry point. */
export function Provider({ children }) {
  const notice = useNotice(),
    catalog = useCatalog(),
    cart = useCart(catalog.products, notice.setNotice),
    session = useCustomerSession(notice.setNotice),
    favorites = useFavorites();
  return (
    <ShopContext.Provider
      value={{ ...catalog, ...cart, ...session, ...favorites, ...notice }}
    >
      {children}
    </ShopContext.Provider>
  );
}
