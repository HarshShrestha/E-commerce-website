export const text = (value, max = 200) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";
