import { useEffect, useState } from "react";
import { request } from "../services/api";
export function useCustomerSession(notify) {
  const [token, setToken] = useState(
      () => sessionStorage.getItem("forever.token") || "",
    ),
    [user, setUser] = useState(null);
  useEffect(() => {
    let active = true;
    if (token)
      request("/api/user/me", { token })
        .then((data) => {
          if (active) setUser(data.user);
        })
        .catch((e) => {
          if (active && e.status === 401) {
            sessionStorage.removeItem("forever.token");
            setToken("");
            setUser(null);
          }
        });
    return () => {
      active = false;
    };
  }, [token]);
  function signIn(data) {
    sessionStorage.setItem("forever.token", data.token);
    setToken(data.token);
    setUser(data.user);
  }
  function signOut() {
    sessionStorage.removeItem("forever.token");
    setToken("");
    setUser(null);
    notify("You have signed out.");
  }
  return { token, user, signIn, signOut };
}
