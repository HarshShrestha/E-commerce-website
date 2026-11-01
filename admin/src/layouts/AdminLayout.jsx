import BrandLogo from "../components/BrandLogo.jsx";
import { NavLink } from "react-router-dom";
export default function AdminLayout({ children, mode, logout }) {
  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <div className="wordmark">
          <BrandLogo />
        </div>
        <span className="eyebrow">STORE MANAGER</span>
        <nav aria-label="Admin navigation">
          <NavLink to="/list">
            ▤ <span>Products</span>
          </NavLink>
          <NavLink to="/add">
            ＋ <span>Add product</span>
          </NavLink>
          <NavLink to="/orders">
            □ <span>Orders</span>
          </NavLink>
        </nav>
        <div className="sidebar-bottom">
          <span>Your store, in focus.</span>
          <button className="outline" onClick={logout}>
            Sign out
          </button>
        </div>
      </aside>
      <div className="workspace">
        <header className="admin-header">
          <span>Workspace / Store management</span>
          <span className="admin-pill">Administrator</span>
        </header>
        {mode === "demo" && (
          <div className="demo">
            Demo mode · Data resets when the API restarts. Orders are not
            fulfilled.
          </div>
        )}
        <main className="admin-main">{children}</main>
      </div>
    </div>
  );
}
