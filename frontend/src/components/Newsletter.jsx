import { useState } from "react";
import { request } from "../services/api.js";
function Newsletter() {
  const [state, setState] = useState({
    busy: false,
    message: "",
    error: false,
  });
  async function submit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    setState({ busy: true, message: "", error: false });
    try {
      const data = await request("/api/newsletter", {
        method: "POST",
        body: { email: new FormData(form).get("email") },
      });
      setState({ busy: false, message: data.message, error: false });
      form.reset();
    } catch (error) {
      setState({ busy: false, message: error.message, error: true });
    }
  }
  return (
    <section className="newsletter">
      <div>
        <h2>Subscribe now & stay in the loop</h2>
        <p>
          Join our newsletter to stay updated with the latest styles and
          collection news.
        </p>
      </div>
      <form onSubmit={submit}>
        <label htmlFor="newsletter-email">Your email address</label>
        <div className="subscribe-row">
          <input
            id="newsletter-email"
            name="email"
            type="email"
            placeholder="Enter your email"
            required
            maxLength={254}
          />
          <button className="button" disabled={state.busy}>
            {state.busy ? "SUBSCRIBING…" : "SUBSCRIBE"}
          </button>
        </div>
        <p
          role="status"
          className={state.error ? "error-text" : "success-text"}
        >
          {state.message}
        </p>
      </form>
    </section>
  );
}
export default Newsletter;
