const API = (
  import.meta.env.VITE_BACKEND_URL || "http://localhost:4000"
).replace(/\/$/, "");
export const imageUrl = (src) => (src?.startsWith("/") ? API + src : src);
export async function api(path, { token, body, method = "GET" } = {}) {
  const form = body instanceof FormData;
  let response;
  try {
    response = await fetch(API + path, {
      method,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(!form && body ? { "Content-Type": "application/json" } : {}),
      },
      body: body ? (form ? body : JSON.stringify(body)) : undefined,
      signal: AbortSignal.timeout(form ? 60000 : 15000),
    });
  } catch {
    throw new Error("Cannot reach the server. Please try again.");
  }
  const data = await response
    .json()
    .catch(() => ({ message: "Unexpected server response." }));
  if (!response.ok || !data.success) {
    const error = new Error(data.message || "Request failed.");
    error.status = response.status;
    throw error;
  }
  return data;
}
