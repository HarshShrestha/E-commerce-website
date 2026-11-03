export const API = (
  import.meta.env.VITE_BACKEND_URL || "http://localhost:4000"
).replace(/\/$/, "");
export const imageUrl = (source) => {
  if (!source) return "";
  if (
    source.startsWith("http://") ||
    source.startsWith("https://") ||
    source.startsWith("blob:") ||
    source.startsWith("data:") ||
    source.startsWith("/assets/")
  ) {
    return source;
  }
  return source.startsWith("/") ? `${API}${source}` : `${API}/${source}`;
};
export async function request(
  path,
  { token, body, method = "GET", headers = {} } = {},
) {
  let response;
  try {
    response = await fetch(`${API}${path}`, {
      method,
      headers: {
        ...(body ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(15000),
    });
  } catch {
    throw new Error(
      "Cannot reach the shop. Check your connection and try again.",
    );
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
