import { useOrderHistory } from "../hooks/useOrderHistory";
import { Navigate } from "react-router-dom";
import { useShop } from "../hooks/useShop.js";
import { imageUrl } from "../services/api.js";
import { money } from "../utils/money.js";
import PageTitle from "../components/PageTitle.jsx";
import Empty from "../components/Empty.jsx";
function Orders() {
  const { token } = useShop();
  const { orders, busy, error, load } = useOrderHistory(token);
  if (!token) return <Navigate to="/login" replace />;
  return (
    <section className="shell section">
      <div className="section-heading">
        <PageTitle
          eyebrow="YOUR FOREVER FINDS"
          title="Your orders."
          text="The latest on the pieces coming your way."
        />
        <button className="button outline" onClick={load} disabled={busy}>
          Refresh status
        </button>
      </div>
      {busy ? (
        <div className="loading" role="status">
          Loading your orders…
        </div>
      ) : error ? (
        <div className="error-panel" role="alert">
          <p>{error}</p>
          <button onClick={load} className="button">
            Try again
          </button>
        </div>
      ) : !orders.length ? (
        <Empty
          title="Your story starts here."
          text="When you place an order, all the details will appear here."
        />
      ) : (
        orders.map((order) => (
          <article className="order-card" key={order._id}>
            <div className="order-top">
              <div>
                <span className="eyebrow">
                  ORDER #{order._id.slice(-8).toUpperCase()}
                </span>
                <p>
                  {new Date(order.date).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
              <span className="status">{order.status}</span>
              <strong>{money(order.amount)}</strong>
            </div>
            <ol className="order-progress" aria-label="Order progress">
              {(order.status === "Cancelled"
                ? ["Cancelled"]
                : [
                    "Order placed",
                    "Packing",
                    "Shipped",
                    "Out for delivery",
                    "Delivered",
                  ]
              ).map((s, i) => (
                <li
                  key={s}
                  className={
                    i <=
                    [
                      "Order placed",
                      "Packing",
                      "Shipped",
                      "Out for delivery",
                      "Delivered",
                    ].indexOf(order.status)
                      ? "complete"
                      : ""
                  }
                >
                  {s}
                </li>
              ))}
            </ol>
            {order.items.map((item, i) => (
              <div className="order-item" key={i}>
                <img src={imageUrl(item.image)} alt={item.name} />
                <div>
                  <h3>{item.name}</h3>
                  <p>
                    Size {item.size} · Qty {item.quantity} · {money(item.price)}
                  </p>
                </div>
              </div>
            ))}
            <div className="order-footer">
              <p>
                Ship to: {order.address.firstName} {order.address.lastName},{" "}
                {order.address.city}, {order.address.country}
              </p>
              <span>
                Cash on delivery ·{" "}
                {order.payment ? "Paid" : "Payment due on delivery"}
              </span>
            </div>
          </article>
        ))
      )}
    </section>
  );
}
export default Orders;
