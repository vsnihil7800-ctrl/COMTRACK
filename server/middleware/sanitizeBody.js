function clean(value) {
  if (typeof value === "string") return value.trim();
  if (Array.isArray(value)) return value.map(clean);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, clean(v)]));
  }
  return value;
}

export function sanitizeBody(req, res, next) {
  if (req.body && typeof req.body === "object") {
    req.body = clean(req.body);
  }
  next();
}
