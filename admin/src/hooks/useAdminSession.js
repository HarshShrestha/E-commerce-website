import { useCallback, useEffect, useState } from "react";
import { api } from "../services/api";
export function useAdminSession() {
  const [token, setToken] = useState(
      () => sessionStorage.getItem("forever.admin") || "",
    ),
    [mode, setMode] = useState("");
  const logout = useCallback(() => {
    sessionStorage.removeItem("forever.admin");
    setToken("");
  }, []);
  const onError = useCallback(
    (error) => {
      if (error.status === 401) logout();
    },
    [logout],
  );
  useEffect(() => {
    api("/api/health")
      .then((data) => setMode(data.mode))
      .catch(() => {});
  }, []);
  const login = (value) => {
    sessionStorage.setItem("forever.admin", value);
    setToken(value);
  };
  return { token, mode, logout, onError, login };
}
