import { useShop } from "../hooks/useShop";
import PageTitle from "../components/PageTitle";
import ProductCard from "../components/ProductCard";
import Empty from "../components/Empty";
import CatalogState from "../components/CatalogState";
export default function Favorites() {
  const { favorites, products, loading, error } = useShop();
  const saved = products.filter((p) => favorites.includes(p._id));
  return (
    <section className="shell section">
      <PageTitle
        eyebrow="SAVED FOR LATER"
        title="My favorites"
        text="All the pieces you have your eye on, in one place."
      />
      {loading || error ? (
        <CatalogState />
      ) : saved.length ? (
        <div className="product-grid home-grid">
          {saved.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <Empty
          title="Save something you love."
          text="Tap the heart on any piece to add it to your favorites."
        />
      )}
    </section>
  );
}
