import { useCallback, useEffect, useState } from "react";
import { api, imageUrl } from "../services/api.js";
import { money } from "../utils/money.js";
import { statuses } from "../constants/orderStatuses.js";
import PageHeader from "../components/PageHeader.jsx";
function Orders({ token, onError }) {
  const [rows, setRows] = useState([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [filter, setFilter] = useState(""),
    [pending, setPending] = useState("");
  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api("/api/order/list", { token });
      setRows(data.orders);
    } catch (e) {
      setError(e.message);
      onError(e);
    } finally {
      setLoading(false);
    }
  }, [token, onError]);
  useEffect(() => {
    let active = true;
    api("/api/order/list", { token })
      .then((data) => {
        if (active) setRows(data.orders);
      })
      .catch((e) => {
        if (active) {
          setError(e.message);
          onError(e);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [token, onError]);
  async function status(row, value) {
    setPending(row._id);
    setError("");
    try {
      const data = await api("/api/order/status", {
        method: "POST",
        token,
        body: { orderId: row._id, status: value },
      });
      setRows((prev) => prev.map((x) => (x._id === row._id ? data.order : x)));
    } catch (e) {
      setError(e.message);
      onError(e);
    } finally {
      setPending("");
    }
  }
  return (
    <>
      <PageHeader eyebrow="EVERY ORDER, TAKEN CARE OF" title="Order management">
        <button className="outline" onClick={load} disabled={loading}>
          Refresh orders
        </button>
      </PageHeader>
      <div className="stats">
        <div>
          <span>Orders</span>
          <strong>{rows.length}</strong>
        </div>
        <div>
          <span>Awaiting dispatch</span>
          <strong>
            {
              rows.filter((x) => ["Order placed", "Packing"].includes(x.status))
                .length
            }
          </strong>
        </div>
        <div>
          <span>Order value (not revenue)</span>
          <strong>
            {money(
              rows
                .filter((x) => x.status !== "Cancelled")
                .reduce((sum, x) => sum + x.amount, 0),
            )}
          </strong>
        </div>
      </div>
      <div className="panel-tools">
        <h2>Order activity</h2>
        <select
          aria-label="Filter order status"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">All statuses</option>
          {statuses.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      {loading ? (
        <p className="empty" role="status">
          Loading orders…
        </p>
      ) : !rows.filter((x) => !filter || x.status === filter).length ? (
        <div className="panel empty">
          <h2>No orders here yet.</h2>
          <p>New orders will appear as customers check out.</p>
        </div>
      ) : (
        rows
          .filter((x) => !filter || x.status === filter)
          .map((order) => (
            <article className="panel order" key={order._id}>
              <div className="order-heading">
                <div>
                  <span className="eyebrow">
                    ORDER #{order._id.slice(-8).toUpperCase()}
                  </span>
                  <p>{new Date(order.date).toLocaleString()}</p>
                </div>
                <label>
                  Order status
                  <select
                    aria-label={`Status for order ${order._id.slice(-8)}`}
                    value={order.status}
                    disabled={pending === order._id}
                    onChange={(e) => status(order, e.target.value)}
                  >
                    {statuses.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="order-body">
                <div>
                  {order.items.map((item, i) => (
                    <div className="order-item" key={i}>
                      <img src={imageUrl(item.image)} alt={item.name} />
                      <div>
                        <strong>{item.name}</strong>
                        <p>
                          {item.quantity} × {money(item.price)} · Size{" "}
                          {item.size}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <address>
                  <strong>
                    {order.address.firstName} {order.address.lastName}
                  </strong>
                  <br />
                  {order.address.street}
                  <br />
                  {order.address.city}, {order.address.state}{" "}
                  {order.address.zipcode}
                  <br />
                  {order.address.country}
                  <br />
                  {order.address.phone}
                  <br />
                  {order.address.email}
                </address>
              </div>
              <div className="order-bottom">
                <span>
                  Cash on delivery ·{" "}
                  {order.payment ? "Paid" : "Awaiting payment"}
                </span>
                <strong>
                  Total {money(order.amount)}{" "}
                  <small>(Shipping {money(order.shipping)})</small>
                </strong>
              </div>
            </article>
          ))
      )}
    </>
  );
}
export default Orders;
