import { useEffect, useState } from "react";
import { readLocal, saveLocal } from "../utils/storage";
export function useFavorites() {
  const [favorites, setFavorites] = useState(() => {
    const rows = readLocal("forever.favorites", []);
    return Array.isArray(rows)
      ? rows.filter((id) => typeof id === "string")
      : [];
  });
  useEffect(() => {
    saveLocal("forever.favorites", favorites);
  }, [favorites]);
  const toggleFavorite = (id) =>
    setFavorites((previous) =>
      previous.includes(id)
        ? previous.filter((value) => value !== id)
        : [...previous, id],
    );
  return { favorites, toggleFavorite };
}
