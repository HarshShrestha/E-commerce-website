import { useEffect, useState } from "react";
import { request } from "../services/api";
import { products as fallbackProducts } from "../assets/assets";
export function useCatalog() {
  const [products, setProducts] = useState(fallbackProducts),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [mode, setMode] = useState("demo");
  const fetchCatalog = () =>
    Promise.all([request("/api/product/list"), request("/api/health")]);
  async function load() {
    setLoading(true);
    setError("");
    try {
      const [data, health] = await fetchCatalog();
      setProducts(data.products);
      setMode(health.mode);
    } catch (e) {
      setProducts(fallbackProducts);
      setMode("demo");
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    let active = true;
    Promise.all([request("/api/product/list"), request("/api/health")])
      .then(([data, health]) => {
        if (active) {
          setProducts(data.products);
          setMode(health.mode);
        }
      })
      .catch(() => {
        if (active) {
          setProducts(fallbackProducts);
          setMode("demo");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);
  return { products, loading, error, mode, load };
}
