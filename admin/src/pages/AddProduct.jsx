import { useState } from "react";
import { api } from "../services/api.js";
import PageHeader from "../components/PageHeader.jsx";
import ProductImageUpload from "../components/ProductImageUpload.jsx";
function AddProduct({ token, onError }) {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [success, setSuccess] = useState(""),
    [version, setVersion] = useState(0);
  async function submit(e) {
    e.preventDefault();
    const form = e.currentTarget,
      data = new FormData(form),
      sizes = data.getAll("selectedSizes");
    if (!sizes.length) {
      setError("Choose at least one size.");
      return;
    }
    data.delete("selectedSizes");
    data.set("sizes", JSON.stringify(sizes));
    data.set("bestSeller", data.has("bestSeller") ? "true" : "false");
    setBusy(true);
    setError("");
    setSuccess("");
    try {
      await api("/api/product/add", { method: "POST", token, body: data });
      form.reset();
      setVersion((v) => v + 1);
      setSuccess("Product added. It is now available in your storefront.");
    } catch (e) {
      setError(e.message);
      onError(e);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <PageHeader
        eyebrow="MAKE ROOM FOR SOMETHING GOOD"
        title="Add a new piece"
      />
      <form onSubmit={submit} className="panel product-form">
        <h2>Product details</h2>
        <p className="muted">
          Add up to four images. JPG, PNG or WebP, 5 MB each. Cloudinary must be
          configured.
        </p>
        <div className="uploads" key={version}>
          {[1, 2, 3, 4].map((n) => (
            <ProductImageUpload key={n} index={n} />
          ))}
        </div>
        <label>
          Product name
          <input
            name="name"
            required
            maxLength={120}
            placeholder="e.g. Everyday cotton shirt"
          />
        </label>
        <label>
          Description
          <textarea
            name="description"
            required
            maxLength={3000}
            rows="4"
            placeholder="Tell the story. Include fabric and fit details."
          />
        </label>
        <div className="form-grid">
          <label>
            Category
            <select name="category">
              <option>Women</option>
              <option>Men</option>
              <option>Kids</option>
            </select>
          </label>
          <label>
            Type
            <select name="subCategory">
              <option>Topwear</option>
              <option>Bottomwear</option>
              <option>Winterwear</option>
            </select>
          </label>
          <label>
            Price (USD)
            <input
              type="number"
              name="price"
              min="0.01"
              max="100000"
              step="0.01"
              required
              placeholder="0.00"
            />
          </label>
        </div>
        <fieldset>
          <legend>Available sizes</legend>
          <div className="size-choices">
            {["S", "M", "L", "XL", "XXL"].map((s) => (
              <label key={s}>
                <input type="checkbox" name="selectedSizes" value={s} />
                <span>{s}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <label className="checkbox">
          <input type="checkbox" name="bestSeller" /> Feature as a bestseller
        </label>
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        {success && (
          <p className="success" role="status">
            {success}
          </p>
        )}
        <button disabled={busy}>
          {busy ? "Uploading product…" : "Publish product →"}
        </button>
      </form>
    </>
  );
}
export default AddProduct;
