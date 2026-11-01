import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useShop } from "../hooks/useShop.js";
import { imageUrl } from "../services/api.js";
import { money } from "../utils/money.js";
import Icon from "../components/Icon.jsx";
import Empty from "../components/Empty.jsx";
import CatalogState from "../components/CatalogState.jsx";
import ProductCard from "../components/ProductCard.jsx";
function Product() {
  const { productId } = useParams();
  const { products, loading, error, add } = useShop();
  const [size, setSize] = useState(""),
    [image, setImage] = useState(0),
    [validation, setValidation] = useState("");
  const p = products.find((x) => x._id === productId);
  if (loading || error)
    return (
      <div className="shell section">
        <CatalogState />
      </div>
    );
  if (!p) return <Empty title="This piece is no longer available." />;
  return (
    <section className="shell section">
      <div className="breadcrumbs">
        <Link to="/collection">Collection</Link> / {p.category} / {p.name}
      </div>
      <div className="product-detail">
        <div>
          <div className="detail-image">
            <img src={imageUrl(p.images[image])} alt={p.name} />
          </div>
          {p.images.length > 1 && (
            <div className="thumbnails">
              {p.images.map((src, i) => (
                <button
                  key={src}
                  aria-label={`View image ${i + 1}`}
                  aria-pressed={image === i}
                  onClick={() => setImage(i)}
                >
                  <img src={imageUrl(src)} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="product-info">
          <span className="eyebrow">
            {p.category} / {p.subCategory}
          </span>
          <h1>{p.name}</h1>
          <p className="detail-price">{money(p.price)}</p>
          <p>{p.description}</p>
          <fieldset className="size-field">
            <legend>Select your size</legend>
            <div className="size-buttons">
              {p.sizes.map((s) => (
                <button
                  className={size === s ? "selected" : ""}
                  key={s}
                  aria-pressed={size === s}
                  onClick={() => {
                    setSize(s);
                    setValidation("");
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </fieldset>
          {validation && (
            <p className="error-text" role="alert">
              {validation}
            </p>
          )}
          <button
            className="button full"
            onClick={() => {
              if (!add(p, size))
                setValidation(
                  "Choose a size before adding this piece to your bag.",
                );
            }}
          >
            Add to bag <Icon name="bag" />
          </button>
          <Link className="underlined" to="/cart">
            View your bag <Icon name="arrow" />
          </Link>
          <div className="product-promises">
            <p>
              <Icon name="box" /> Free shipping on orders $150+
            </p>
            <p>
              <Icon name="check" /> Cash on delivery available
            </p>
            <p>Care: follow the instructions on the garment label.</p>
          </div>
        </div>
      </div>
      <div className="section-heading section">
        <div>
          <span className="eyebrow">KEEP EXPLORING</span>
          <h2>In good company.</h2>
        </div>
      </div>
      <div className="product-grid home-grid">
        {products
          .filter((x) => x.category === p.category && x._id !== p._id)
          .slice(0, 4)
          .map((x) => (
            <ProductCard key={x._id} product={x} />
          ))}
      </div>
    </section>
  );
}
export default Product;
