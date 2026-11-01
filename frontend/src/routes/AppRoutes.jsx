import { Route, Routes, useLocation } from "react-router-dom";
import Home from "../pages/Home";
import Collection from "../pages/Collection";
import Product from "../pages/Product";
import Cart from "../pages/Cart";
import Login from "../pages/Login";
import Checkout from "../pages/Checkout";
import Orders from "../pages/Orders";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Favorites from "../pages/Favorites";
import Empty from "../components/Empty";
export default function AppRoutes() {
  const location = useLocation();
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/collection" element={<Collection />} />
      <Route
        path="/product/:productId"
        element={<Product key={location.pathname} />}
      />
      <Route path="/cart" element={<Cart />} />
      <Route path="/login" element={<Login />} />
      <Route path="/place-order" element={<Checkout />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/favorites" element={<Favorites />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route
        path="*"
        element={
          <Empty
            title="This page has wandered off."
            text="Let’s get you back to the collection."
          />
        }
      />
    </Routes>
  );
}
