import { Link } from "react-router-dom";
import { useShop } from "../hooks/useShop.js";
import { imageUrl } from "../services/api.js";
import { money } from "../utils/money.js";
import Icon from "../components/Icon.jsx";
import PageTitle from "../components/PageTitle.jsx";
import Empty from "../components/Empty.jsx";
import Summary from "../components/Summary.jsx";
function Cart() {
  const { lines, quantity, count, loading } = useShop();
  if (!count)
    return (
      <Empty
        title="Your bag is waiting."
        text="A good everyday starts with something you love."
      />
    );
  return (
    <section className="shell section">
      <PageTitle
        eyebrow="YOUR EVERYDAY, IN THE MAKING"
        title={`Shopping bag (${count})`}
      />
      <div className="cart-layout">
        <div>
          {lines.map((row) => (
            <div className="cart-row" key={row.productId + row.size}>
              {row.product ? (
                <>
                  <Link to={`/product/${row.productId}`}>
                    <img
                      src={imageUrl(row.product.images[0])}
                      alt={row.product.name}
                    />
                  </Link>
                  <div>
                    <span className="eyebrow">{row.product.category}</span>
                    <Link to={`/product/${row.productId}`}>
                      <h3>{row.product.name}</h3>
                    </Link>
                    <p>Size: {row.size}</p>
                    <strong>{money(row.product.price)}</strong>
                    <label className="quantity-label">
                      Qty
                      <input
                        type="number"
                        min="1"
                        max="99"
                        aria-label={`Quantity for ${row.product.name}, size ${row.size}`}
                        value={row.quantity}
                        onChange={(e) => {
                          if (e.target.value)
                            quantity(
                              row.productId,
                              row.size,
                              Number(e.target.value),
                            );
                        }}
                      />
                    </label>
                  </div>
                </>
              ) : (
                <p>
                  {loading
                    ? "Loading item…"
                    : "This item is no longer available. Please remove it to continue."}
                </p>
              )}
              <button
                className="icon-button"
                aria-label={`Remove ${row.product?.name || "unavailable item"}, size ${row.size}`}
                onClick={() => quantity(row.productId, row.size, 0)}
              >
                <Icon name="trash" />
              </button>
            </div>
          ))}
          <Link className="underlined" to="/collection">
            Continue exploring <Icon name="arrow" />
          </Link>
        </div>
        <Summary>
          <Link
            className={`button full ${lines.some((x) => !x.product) ? "disabled" : ""}`}
            aria-disabled={lines.some((x) => !x.product)}
            to={lines.some((x) => !x.product) ? "/cart" : "/place-order"}
          >
            Continue to checkout <Icon name="arrow" />
          </Link>
          <p className="muted">Sign in to place your order.</p>
        </Summary>
      </div>
    </section>
  );
}
export default Cart;
