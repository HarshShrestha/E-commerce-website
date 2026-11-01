import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
/** URL-backed filters. Read current history to avoid losing rapid pending updates. */
export function useCollectionFilters(products) {
  const [params, setParams] = useSearchParams(),
    [filters, setFilters] = useState(false);
  const q = params.get("q") || "",
    category = params.get("category") || "",
    type = params.get("type") || "",
    sort = params.get("sort") || "featured";
  function update(key, value) {
    const next = new URLSearchParams(window.location.search);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  }
  const visible = useMemo(() => {
    const rows = products.filter(
      (p) =>
        (!category || p.category === category) &&
        (!type || p.subCategory === type) &&
        `${p.name} ${p.category} ${p.subCategory}`
          .toLowerCase()
          .includes(q.trim().toLowerCase()),
    );
    if (sort === "low") rows.sort((a, b) => a.price - b.price);
    if (sort === "high") rows.sort((a, b) => b.price - a.price);
    if (sort === "new") rows.sort((a, b) => b.date - a.date);
    return rows;
  }, [products, q, category, type, sort]);
  return {
    params,
    q,
    category,
    type,
    sort,
    filters,
    setFilters,
    visible,
    update,
    clearFilters: () => setParams({}),
  };
}
