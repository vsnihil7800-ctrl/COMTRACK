import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import RevokedToken from "../models/RevokedToken.js";
import { sendEmail } from "../config/mailer.js";
import { randomToken, signAccessToken, signRefreshToken, tokenHash } from "../utils/tokens.js";

function authPayload(user) {
  const token = signAccessToken(user._id);
  const refreshToken = signRefreshToken(user._id);
  user.refreshTokenHash = tokenHash(refreshToken);
  return {
    token,
    refreshToken,
    user: { id: user._id, name: user.name, email: user.email, role: user.role, language: user.language }
  };
}

export async function register(req, res) {
  const { name, email, password, role, mobile } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "Email already in use" });

  const hashed = await bcrypt.hash(password, 12);
  const verificationToken = randomToken();
  const user = await User.create({
    name,
    email,
    password: hashed,
    role: role || "citizen",
    mobile,
    emailVerificationTokenHash: tokenHash(verificationToken),
    emailVerificationExpires: new Date(Date.now() + 1000 * 60 * 60)
  });

  const verifyLink = `${process.env.CLIENT_URL || "http://localhost:5173"}/verify-email?token=${verificationToken}&email=${encodeURIComponent(email)}`;
 console.log("Attempting to send email to:", email);
console.log("RESEND_API_KEY exists:", !!process.env.RESEND_API_KEY);
sendEmail({
    to: email,
    subject: "Verify your COMTRACK account",
    html: `<p>Welcome to COMTRACK.</p><p>Verify your email here: <a href="${verifyLink}">${verifyLink}</a></p>`
}).then(() => console.log("Email sent successfully to:", email))
  .catch((err) => console.log("Email send failed:", err.message));
  });

  const payload = authPayload(user);
  await user.save();
  return res.status(201).json(payload);
}

export async function verifyEmail(req, res) {
  const { token, email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid request" });
  if (
    user.emailVerificationTokenHash !== tokenHash(token) ||
    !user.emailVerificationExpires ||
    user.emailVerificationExpires < new Date()
  ) {
    return res.status(400).json({ message: "Verification token invalid or expired" });
  }
  user.emailVerified = true;
  user.emailVerificationTokenHash = undefined;
  user.emailVerificationExpires = undefined;
  await user.save();
  return res.json({ message: "Email verified successfully" });
}

export async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });
  if (user.blocked) return res.status(403).json({ message: "Account blocked" });
  const payload = authPayload(user);
  await user.save();
  return res.json(payload);
}

export async function refreshToken(req, res) {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ message: "Refresh token required" });
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
    const hash = tokenHash(refreshToken);
    const revoked = await RevokedToken.findOne({ tokenHash: hash });
    if (revoked) return res.status(401).json({ message: "Refresh token revoked" });
    const user = await User.findById(decoded.id);
    if (!user || user.refreshTokenHash !== hash) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }
    await RevokedToken.create({
      tokenHash: hash,
      user: user._id,
      reason: "rotation",
      expiresAt: new Date(decoded.exp * 1000)
    });
    const payload = authPayload(user);
    await user.save();
    return res.json(payload);
  } catch {
    return res.status(401).json({ message: "Refresh token expired or invalid" });
  }
}

export async function logout(req, res) {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.json({ message: "Logged out" });
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
    const hash = tokenHash(refreshToken);
    await RevokedToken.updateOne(
      { tokenHash: hash },
      { $set: { tokenHash: hash, user: decoded.id, reason: "logout", expiresAt: new Date(decoded.exp * 1000) } },
      { upsert: true }
    );
    await User.findByIdAndUpdate(decoded.id, { $unset: { refreshTokenHash: 1 } });
  } catch {
    // no-op to avoid leaking token validity state
  }
  return res.json({ message: "Logged out" });
}

export async function forgotPassword(req, res) {
  const { email, mode = "link" } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.json({ message: "If account exists, reset instructions sent." });

  if (mode === "otp") {
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.otpCodeHash = tokenHash(otp);
    user.otpExpires = new Date(Date.now() + 1000 * 60 * 10);
    await user.save();
    await sendEmail({
      to: email,
      subject: "COMTRACK OTP",
      html: `<p>Your OTP: <b>${otp}</b> (10 min expiry)</p>`
    });
  } else {
    const reset = randomToken();
    user.resetTokenHash = tokenHash(reset);
    user.resetTokenExpires = new Date(Date.now() + 1000 * 60 * 30);
    await user.save();
    const resetLink = `${process.env.CLIENT_URL || "http://localhost:5173"}/reset-password?token=${reset}&email=${encodeURIComponent(email)}`;
    await sendEmail({
      to: email,
      subject: "COMTRACK password reset",
      html: `<p>Reset password: <a href="${resetLink}">${resetLink}</a></p>`
    });
  }

  return res.json({ message: "If account exists, reset instructions sent." });
}

export async function verifyOtp(req, res) {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });
  if (!user || user.otpCodeHash !== tokenHash(otp) || !user.otpExpires || user.otpExpires < new Date()) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }
  return res.json({ message: "OTP verified" });
}

export async function resetPassword(req, res) {
  const { email, token, otp, newPassword } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid reset request" });

  const validToken =
    token && user.resetTokenHash === tokenHash(token) && user.resetTokenExpires && user.resetTokenExpires > new Date();
  const validOtp = otp && user.otpCodeHash === tokenHash(otp) && user.otpExpires && user.otpExpires > new Date();
  if (!validToken && !validOtp) return res.status(400).json({ message: "Reset token invalid or expired" });

  user.password = await bcrypt.hash(newPassword, 12);
  user.resetTokenHash = undefined;
  user.resetTokenExpires = undefined;
  user.otpCodeHash = undefined;
  user.otpExpires = undefined;
  await user.save();
  return res.json({ message: "Password reset successful" });
}

export async function profile(req, res) {
  return res.json(req.user);
}

export async function updateProfile(req, res) {
  const allowed = ["name", "mobile", "email", "address", "emergencyContacts", "language", "darkMode", "notificationSettings"];
  const patch = {};
  allowed.forEach((key) => {
    if (req.body[key] !== undefined) patch[key] = req.body[key];
  });
  const user = await User.findByIdAndUpdate(req.user._id, patch, { new: true }).select("-password");
  return res.json(user);
}
