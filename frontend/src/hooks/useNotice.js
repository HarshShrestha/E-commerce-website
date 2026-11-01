import { useEffect, useState } from "react";
export function useNotice() {
  const [notice, setNotice] = useState("");
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 4000);
    return () => clearTimeout(timer);
  }, [notice]);
  return { notice, setNotice };
}
