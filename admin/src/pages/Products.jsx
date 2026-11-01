import { useCallback, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { api, imageUrl } from "../services/api.js";
import { money } from "../utils/money.js";
import PageHeader from "../components/PageHeader.jsx";
function Products({ token, onError }) {
  const [rows, setRows] = useState([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [query, setQuery] = useState(""),
    [pending, setPending] = useState("");
  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api("/api/product/list");
      setRows(data.products);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    let active = true;
    api("/api/product/list")
      .then((data) => {
        if (active) setRows(data.products);
      })
      .catch((e) => {
        if (active) setError(e.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);
  async function remove(row) {
    if (
      !window.confirm(
        `Remove “${row.name}” from the store? Existing order records will be preserved.`,
      )
    )
      return;
    setPending(row._id);
    try {
      await api("/api/product/remove", {
        token,
        method: "POST",
        body: { id: row._id },
      });
      setRows((prev) => prev.filter((x) => x._id !== row._id));
    } catch (e) {
      setError(e.message);
      onError(e);
    } finally {
      setPending("");
    }
  }
  const visible = rows.filter((x) =>
    x.name.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <>
      <PageHeader eyebrow="YOUR STOREFRONT, CURATED" title="Product collection">
        <NavLink className="button" to="/add">
          + Add product
        </NavLink>
      </PageHeader>
      <div className="stats">
        <div>
          <span>Total products</span>
          <strong>{rows.length}</strong>
        </div>
        <div>
          <span>Featured pieces</span>
          <strong>{rows.filter((x) => x.bestSeller).length}</strong>
        </div>
        <div>
          <span>Categories</span>
          <strong>{new Set(rows.map((x) => x.category)).size}</strong>
        </div>
      </div>
      <div className="panel">
        <div className="panel-tools">
          <h2>All products</h2>
          <input
            type="search"
            aria-label="Search products"
            placeholder="Search products…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        {error && (
          <div className="error" role="alert">
            {error}
            <button className="text" onClick={load}>
              Try again
            </button>
          </div>
        )}
        {loading ? (
          <p className="empty" role="status">
            Loading collection…
          </p>
        ) : visible.length ? (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Sizes</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((row) => (
                  <tr key={row._id}>
                    <td>
                      <div className="product-cell">
                        <img src={imageUrl(row.images[0])} alt={row.name} />
                        <div>
                          <strong>{row.name}</strong>
                          <small>
                            {row.subCategory}
                            {row.bestSeller ? " · Featured" : ""}
                          </small>
                        </div>
                      </div>
                    </td>
                    <td>{row.category}</td>
                    <td>{money(row.price)}</td>
                    <td>{row.sizes.join(", ")}</td>
                    <td>
                      <button
                        className="danger"
                        disabled={pending === row._id}
                        onClick={() => remove(row)}
                      >
                        {pending === row._id ? "Removing…" : "Remove"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="empty">No products match your search.</p>
        )}
      </div>
    </>
  );
}
export default Products;
