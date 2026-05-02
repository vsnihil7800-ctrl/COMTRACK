import crypto from "node:crypto";
import jwt from "jsonwebtoken";

export function signAccessToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "15m"
  });
}

export function signRefreshToken(id) {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d"
  });
}

export function randomToken() {
  return crypto.randomBytes(32).toString("hex");
}

export function tokenHash(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}
