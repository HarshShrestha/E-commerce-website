import { Link } from "react-router-dom";
import { useShop } from "../hooks/useShop";
import BrandLogo from "./BrandLogo.jsx";
export default function Footer() {
  const { mode, token, user, signOut, favorites } = useShop();
  return (
    <footer className="site-footer shell">
      <div className="footer-top">
        <div className="footer-story">
          <Link className="brand" to="/" aria-label="Forever home">
            <BrandLogo />
          </Link>
          <p>
            Clothing for every day. Explore the latest styles for women, men and
            kids, and find the pieces that feel like you.
          </p>
        </div>
        <div>
          <h3>COMPANY</h3>
          <Link to="/">Home</Link>
          <Link to="/about">About us</Link>
          <Link to="/collection">Collection</Link>
          <Link to="/contact">Delivery & returns</Link>
        </div>
        <div>
          <h3>GET IN TOUCH</h3>
          <Link to="/contact">Contact & help</Link>
          <Link to="/orders">Your orders</Link>
          <Link
            to="/favorites"
            aria-label={`Favorites, ${favorites.length} saved items`}
          >
            Your favorites
          </Link>
          {token ? (
            <button className="text-button" onClick={signOut}>
              Sign out{user ? `, ${user.name.split(" ")[0]}` : ""}
            </button>
          ) : (
            <Link to="/login">Sign in / Register</Link>
          )}
        </div>
      </div>
      {mode === "demo" && (
        <p className="demo-note">
          Demo store · Sample catalog · Orders are not fulfilled · Data resets
          on server restart
        </p>
      )}
      <div className="footer-bottom">
        © {new Date().getFullYear()} Forever. All rights reserved.
      </div>
    </footer>
  );
}
