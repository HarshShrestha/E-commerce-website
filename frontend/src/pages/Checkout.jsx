import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useShop } from "../hooks/useShop.js";
import { money } from "../utils/money.js";
import { request } from "../services/api.js";
import Icon from "../components/Icon.jsx";
import PageTitle from "../components/PageTitle.jsx";
import Empty from "../components/Empty.jsx";
import Summary from "../components/Summary.jsx";
import Field from "../components/Field.jsx";
function Checkout() {
  const { token, cart, lines, count, subtotal, shipping, setCart, setNotice } =
    useShop();
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const [requestKey] = useState(() => crypto.randomUUID());
  const navigate = useNavigate();
  if (!count) return <Empty title="Your bag is empty." />;
  if (!token) return <Navigate to="/login?next=/place-order" replace />;
  async function submit(e) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      await request("/api/order/place", {
        method: "POST",
        token,
        headers: { "Idempotency-Key": requestKey },
        body: {
          address: Object.fromEntries(new FormData(e.currentTarget)),
          items: cart,
          paymentMethod: "cod",
        },
      });
      setCart([]);
      setNotice("Order placed. Thank you for shopping with Forever.");
      navigate("/orders");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="shell section">
      <PageTitle
        eyebrow="ONE LAST THING"
        title="Make it yours."
        text="Add your delivery details and review your order."
      />
      <form className="cart-layout checkout" onSubmit={submit}>
        <div>
          <h2>Delivery information</h2>
          <div className="fields">
            <Field
              label="First name"
              name="firstName"
              autoComplete="given-name"
              maxLength={100}
            />
            <Field
              label="Last name"
              name="lastName"
              autoComplete="family-name"
              maxLength={100}
            />
            <Field
              label="Email address"
              name="email"
              type="email"
              autoComplete="email"
              maxLength={150}
            />
            <Field
              label="Phone number"
              name="phone"
              type="tel"
              autoComplete="tel"
              minLength={7}
              maxLength={25}
              title="Enter a phone number with 7–25 characters"
            />
            <Field
              label="Street address"
              name="street"
              autoComplete="street-address"
              maxLength={300}
            />
            <Field
              label="City"
              name="city"
              autoComplete="address-level2"
              maxLength={100}
            />
            <Field
              label="State / Province"
              name="state"
              autoComplete="address-level1"
              maxLength={100}
            />
            <Field
              label="ZIP / Postal code"
              name="zipcode"
              autoComplete="postal-code"
              maxLength={30}
            />
            <Field
              label="Country"
              name="country"
              autoComplete="country-name"
              maxLength={100}
            />
          </div>
          <h2 className="payment-heading">Payment</h2>
          <label className="payment-option">
            <input type="radio" name="payment" value="cod" checked readOnly />
            <span>
              Cash on delivery
              <small>
                Pay {money(subtotal + shipping)} when your order arrives.
              </small>
            </span>
          </label>
          <p className="muted">
            Online card payments are not enabled. No card details are collected.
          </p>
        </div>
        <Summary>
          <div className="checkout-items">
            {lines.map((x) => (
              <p key={x.productId + x.size}>
                {x.quantity} × {x.product?.name || "Unavailable item"} ·{" "}
                {x.size}
              </p>
            ))}
          </div>
          {error && (
            <p className="error-text" role="alert">
              {error}
            </p>
          )}
          <button
            className="button full"
            disabled={busy || lines.some((x) => !x.product)}
          >
            {busy ? "Placing your order…" : "Place order"}
            <Icon name="arrow" />
          </button>
          <Link className="text-button" to="/cart">
            Back to bag
          </Link>
        </Summary>
      </form>
    </section>
  );
}
export default Checkout;
