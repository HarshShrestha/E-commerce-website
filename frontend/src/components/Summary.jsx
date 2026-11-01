import { useShop } from "../hooks/useShop.js";
import { money } from "../utils/money.js";
function Summary({ children }) {
  const { subtotal, shipping } = useShop();
  return (
    <aside className="summary">
      <span className="eyebrow">THE DETAILS</span>
      <h2>Order summary</h2>
      <div>
        <span>Subtotal</span>
        <span>{money(subtotal)}</span>
      </div>
      <div>
        <span>Shipping</span>
        <span>{shipping ? money(shipping) : "Free"}</span>
      </div>
      <p className="muted">
        Free shipping from $150. Prices are in USD; no additional tax is
        collected by this app.
      </p>
      <div className="summary-total">
        <strong>Total</strong>
        <strong>{money(subtotal + shipping)}</strong>
      </div>
      {children}
    </aside>
  );
}
export default Summary;
