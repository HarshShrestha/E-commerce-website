import { useCollectionFilters } from "../hooks/useCollectionFilters";
import { useShop } from "../hooks/useShop.js";
import Icon from "../components/Icon.jsx";
import PageTitle from "../components/PageTitle.jsx";
import CatalogState from "../components/CatalogState.jsx";
import ProductCard from "../components/ProductCard.jsx";
function Collection() {
  const { products, loading, error } = useShop();
  const {
    params,
    q,
    category,
    type,
    sort,
    filters,
    setFilters,
    visible,
    update,
    clearFilters,
  } = useCollectionFilters(products);
  return (
    <section className="shell section">
      <PageTitle
        eyebrow="THE FOREVER WARDROBE"
        title="All collections"
        text="Explore the latest styles and find your everyday favorites."
      />
      <div className="collection-tools">
        <div className="search-field">
          <Icon name="search" />
          <input
            aria-label="Search products"
            type="search"
            value={q}
            onChange={(e) => update("q", e.target.value)}
            placeholder="Search the collection"
            autoFocus={params.get("focus") === "search"}
          />
        </div>
        <label className="sort-label">
          Sort by
          <select value={sort} onChange={(e) => update("sort", e.target.value)}>
            <option value="featured">Featured</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>
            <option value="new">Newest first</option>
          </select>
        </label>
        <button
          className="button outline mobile-filter"
          onClick={() => setFilters(!filters)}
          aria-expanded={filters}
        >
          Filters
        </button>
      </div>
      <div className="collection-layout">
        <aside className={filters ? "filter-panel expanded" : "filter-panel"}>
          <div className="filter-title">
            <h2>Filters</h2>
            <button className="text-button" onClick={clearFilters}>
              Clear all
            </button>
          </div>
          <fieldset>
            <legend>Shop by</legend>
            {["", "Women", "Men", "Kids"].map((c) => (
              <label key={c}>
                <input
                  type="radio"
                  name="category"
                  value={c}
                  checked={category === c}
                  onChange={() => update("category", c)}
                />
                {c || "Everyone"}
              </label>
            ))}
          </fieldset>
          <fieldset>
            <legend>Category</legend>
            {["", "Topwear", "Bottomwear", "Winterwear"].map((c) => (
              <label key={c}>
                <input
                  type="radio"
                  name="type"
                  value={c}
                  checked={type === c}
                  onChange={() => update("type", c)}
                />
                {c || "All clothing"}
              </label>
            ))}
          </fieldset>
          <div className="filter-note">
            Fewer decisions.
            <br />
            <em>More possibilities.</em>
          </div>
        </aside>
        <div className="collection-results">
          <p className="results-count" role="status">
            {loading
              ? "Loading collection…"
              : `${visible.length} pieces to make your own`}
          </p>
          <CatalogState />
          {!loading &&
            !error &&
            (visible.length ? (
              <div className="product-grid">
                {visible.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            ) : (
              <div className="empty">
                <h2>No matches this time.</h2>
                <p>Try another search or clear your filters.</p>
                <button className="button outline" onClick={clearFilters}>
                  Clear filters
                </button>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
export default Collection;
