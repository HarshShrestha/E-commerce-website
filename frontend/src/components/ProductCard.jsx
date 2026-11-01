import { Link } from "react-router-dom";
import { imageUrl } from "../services/api";
import { money } from "../utils/money";
import { useShop } from "../hooks/useShop";
import Icon from "./Icon";
export default function ProductCard({ product }) {
  const { favorites, toggleFavorite } = useShop(),
    saved = favorites.includes(product._id);
  return (
    <article className="product-card">
      <Link to={`/product/${product._id}`} className="product-card-link">
        <div className="product-photo">
          <img
            src={imageUrl(product.images[0])}
            alt={product.name}
            loading="lazy"
          />
          {product.bestSeller && (
            <span className="product-badge">Bestseller</span>
          )}
          <span className="product-view">
            View details <Icon name="arrow" />
          </span>
        </div>
        <h3>{product.name}</h3>
        <div className="product-meta">
          <span>
            {product.category} · {product.subCategory}
          </span>
          <span>{money(product.price)}</span>
        </div>
      </Link>
      <button
        className={`favorite-button ${saved ? "saved" : ""}`}
        aria-label={`${saved ? "Remove" : "Save"} ${product.name} ${saved ? "from" : "to"} favorites`}
        aria-pressed={saved}
        onClick={() => toggleFavorite(product._id)}
      >
        <Icon name="heart" />
      </button>
    </article>
  );
}
