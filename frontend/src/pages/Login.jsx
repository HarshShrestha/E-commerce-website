import { useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useShop } from "../hooks/useShop.js";
import { request } from "../services/api.js";
import Icon from "../components/Icon.jsx";
import Field from "../components/Field.jsx";
function Login() {
  const { token, signIn } = useShop();
  const [register, setRegister] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const [params] = useSearchParams();
  const next =
    params.get("next") === "/place-order" ? "/place-order" : "/orders";
  const navigate = useNavigate();
  if (token) return <Navigate to={next} replace />;
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const fields = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const data = await request(
        `/api/user/${register ? "register" : "login"}`,
        { method: "POST", body: fields },
      );
      signIn(data);
      navigate(next, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="auth-page shell">
      <form className="auth-form" onSubmit={submit}>
        <span className="eyebrow">
          {register ? "A FRESH START" : "GOOD TO SEE YOU"}
        </span>
        <h2>{register ? "Sign up" : "Login"}</h2>
        <p>
          {register
            ? "A few details, and you’re one of us."
            : "Sign in to your account to continue."}
        </p>
        {register && (
          <Field
            name="name"
            label="Full name"
            autoComplete="name"
            minLength={2}
            maxLength={100}
          />
        )}
        <Field
          name="email"
          label="Email address"
          type="email"
          autoComplete="email"
          maxLength={254}
        />
        <Field
          name="password"
          label="Password"
          type="password"
          minLength={register ? 8 : 1}
          maxLength={72}
          autoComplete={register ? "new-password" : "current-password"}
        />
        {register && (
          <small>
            Use at least 8 characters. Passwords are securely hashed.
          </small>
        )}
        {error && (
          <p role="alert" className="error-text">
            {error}
          </p>
        )}
        <button className="button full" disabled={busy}>
          {busy ? "Please wait…" : register ? "Create account" : "Sign in"}
          <Icon name="arrow" />
        </button>
        <p>
          {register ? "Already a member?" : "New to Forever?"}{" "}
          <button
            type="button"
            className="text-button"
            onClick={() => {
              setRegister(!register);
              setError("");
            }}
          >
            {register ? "Sign in" : "Create an account"}
          </button>
        </p>
      </form>
    </section>
  );
}
export default Login;
