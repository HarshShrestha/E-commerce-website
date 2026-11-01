import { Navigate, Route, Routes } from "react-router-dom";
import { useAdminSession } from "./hooks/useAdminSession";
import AdminLayout from "./layouts/AdminLayout";
import Login from "./pages/Login";
import Products from "./pages/Products";
import AddProduct from "./pages/AddProduct";
import Orders from "./pages/Orders";
export default function App() {
  const { token, mode, logout, onError, login } = useAdminSession();
  if (!token) return <Login onLogin={login} />;
  return (
    <AdminLayout mode={mode} logout={logout}>
      <Routes>
        <Route
          path="/list"
          element={<Products token={token} onError={onError} />}
        />
        <Route
          path="/add"
          element={<AddProduct token={token} onError={onError} />}
        />
        <Route
          path="/orders"
          element={<Orders token={token} onError={onError} />}
        />
        <Route path="*" element={<Navigate to="/list" replace />} />
      </Routes>
    </AdminLayout>
  );
}
