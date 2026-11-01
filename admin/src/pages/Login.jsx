import BrandLogo from "../components/BrandLogo.jsx";
import { useState } from "react";
import { api } from "../services/api.js";
function Login({ onLogin }) {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const data = await api("/api/user/admin", {
        method: "POST",
        body: Object.fromEntries(new FormData(e.currentTarget)),
      });
      onLogin(data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="admin-login">
      <div className="login-intro">
        <span className="eyebrow">THE OTHER SIDE OF FOREVER</span>
        <h1>
          A little order.
          <br />A lot of possibility.
        </h1>
        <p>Your products and orders, thoughtfully organized.</p>
      </div>
      <form onSubmit={submit} className="login-form">
        <div className="wordmark">
          <BrandLogo />
        </div>
        <span className="eyebrow">STORE MANAGEMENT</span>
        <h2>Welcome back.</h2>
        <label>
          Email address
          <input type="email" name="email" required autoComplete="username" />
        </label>
        <label>
          Password
          <input
            type="password"
            name="password"
            required
            autoComplete="current-password"
          />
        </label>
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        <button disabled={busy}>
          {busy ? "Signing in…" : "Sign in to dashboard →"}
        </button>
        <p className="muted">
          Use the administrator credentials configured on your server.
        </p>
      </form>
    </main>
  );
}
export default Login;
