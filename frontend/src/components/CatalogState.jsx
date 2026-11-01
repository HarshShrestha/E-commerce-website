import { useShop } from "../hooks/useShop.js";
function CatalogState() {
  const { loading, error, load } = useShop();
  return loading ? (
    <div className="loading" role="status">
      Gathering your next favorites…
    </div>
  ) : error ? (
    <div className="error-panel" role="alert">
      <h2>We couldn’t load the collection.</h2>
      <p>{error}</p>
      <button className="button" onClick={load}>
        Try again
      </button>
    </div>
  ) : null;
}
export default CatalogState;
