import { useEffect, useState } from "react";
import { request } from "../services/api";
export function useOrderHistory(token) {
  const [orders, setOrders] = useState([]),
    [busy, setBusy] = useState(true),
    [error, setError] = useState("");
  async function load() {
    setBusy(true);
    setError("");
    try {
      const data = await request("/api/order/userorders", { token });
      setOrders(data.orders);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }
  useEffect(() => {
    let active = true;
    if (token)
      request("/api/order/userorders", { token })
        .then((data) => {
          if (active) setOrders(data.orders);
        })
        .catch((err) => {
          if (active) setError(err.message);
        })
        .finally(() => {
          if (active) setBusy(false);
        });
    return () => {
      active = false;
    };
  }, [token]);
  return { orders, busy, error, load };
}
