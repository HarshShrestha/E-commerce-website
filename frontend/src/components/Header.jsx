import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useShop } from "../hooks/useShop";
import BrandLogo from "./BrandLogo.jsx";
import Icon from "./Icon.jsx";
const links = [
  ["HOME", "/"],
  ["COLLECTION", "/collection"],
  ["ABOUT", "/about"],
  ["CONTACT", "/contact"],
];
export default function Header() {
  const { count, token, favorites, signOut } = useShop();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  // Links explicitly close the mobile menu; route key refreshes its navigation state.
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <header className="site-header shell">
        <Link className="brand" to="/" aria-label="Forever home">
          <BrandLogo />
        </Link>
        <nav className="main-navigation" aria-label="Main navigation">
          {links.map(([label, to]) => (
            <NavLink key={to} to={to} end={to === "/"}>
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="header-actions">
          <Link
            className="icon-button"
            to="/collection?focus=search"
            aria-label="Search products"
          >
            <Icon name="search" />
          </Link>
          <div className="account-menu">
            <Link
              className="icon-button"
              to={token ? "/orders" : "/login"}
              aria-label={token ? "My account and orders" : "Sign in"}
            >
              <Icon name="user" />
            </Link>
            <div className="account-dropdown">
              <Link to={token ? "/orders" : "/login"}>My profile</Link>
              <Link to="/orders">Your orders</Link>
              <Link
                to="/favorites"
                aria-label={`Favorites, ${favorites.length} saved items`}
              >
                Favorites ({favorites.length})
              </Link>
              {token && (
                <button className="text-button" onClick={signOut}>
                  Sign out
                </button>
              )}
            </div>
          </div>
          <Link
            className="icon-button cart-link"
            to="/cart"
            aria-label={`Shopping bag, ${count} items`}
          >
            <Icon name="bag" />
            <b className="bag-count">{count}</b>
          </Link>
          <button
            className="icon-button menu-toggle"
            aria-label="Toggle navigation"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            <Icon name={open ? "close" : "menu"} />
          </button>
        </div>
        {open && (
          <nav
            key={location.pathname}
            className="mobile-navigation"
            aria-label="Mobile navigation"
          >
            <button className="text-button" onClick={() => setOpen(false)}>
              ← Back
            </button>
            {links.map(([label, to]) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                onClick={() => setOpen(false)}
              >
                {label.charAt(0) + label.slice(1).toLowerCase()}
              </NavLink>
            ))}
            <Link to="/favorites" onClick={() => setOpen(false)}>
              Favorites ({favorites.length})
            </Link>
            <Link to="/orders" onClick={() => setOpen(false)}>
              Your orders
            </Link>
            {token ? (
              <button
                className="text-button"
                onClick={() => {
                  signOut();
                  setOpen(false);
                }}
              >
                Sign out
              </button>
            ) : (
              <Link to="/login" onClick={() => setOpen(false)}>
                Sign in / Register
              </Link>
            )}
          </nav>
        )}
      </header>
    </>
  );
}
