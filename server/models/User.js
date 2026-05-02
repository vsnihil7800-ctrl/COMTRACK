import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    mobile: String,
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["citizen", "driver", "officer", "responder", "admin"],
      default: "citizen"
    },
    address: String,
    emergencyContacts: [{ name: String, phone: String, relation: String }],
    language: { type: String, enum: ["en", "ta"], default: "en" },
    darkMode: { type: Boolean, default: true },
    notificationSettings: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      sms: { type: Boolean, default: false }
    },
    blocked: { type: Boolean, default: false },
    emailVerified: { type: Boolean, default: false },
    emailVerificationTokenHash: String,
    emailVerificationExpires: Date,
    resetTokenHash: String,
    resetTokenExpires: Date,
    otpCodeHash: String,
    otpExpires: Date,
    refreshTokenHash: String
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
