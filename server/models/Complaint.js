import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    ticketId: { type: String, unique: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fullName: String,
    mobile: String,
    email: String,
    address: String,
    city: String,
    description: String,
    photoUrl: String,
    mediaType: String,
    priority: { type: String, enum: ["low", "medium", "high", "critical"], default: "medium" },
    category: {
      type: String,
      enum: ["garbage", "street_light", "water_leakage", "sewage", "road_damage", "pothole", "electricity", "public_safety"]
    },
    aiCategory: String,
    aiDepartment: String,
    aiSeverity: String,
    status: { type: String, enum: ["submitted", "assigned", "in_progress", "resolved"], default: "submitted" },

    // ── NEW FIELDS ──────────────────────────────────────
    assignedTo:    { type: String, default: "" },
    contactNumber: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Complaint", complaintSchema);import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    ticketId: { type: String, unique: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fullName: String,
    mobile: String,
    email: String,
    address: String,
    city: String,
    description: String,
    photoUrl: String,
    mediaType: String,
    priority: { type: String, enum: ["low", "medium", "high", "critical"], default: "medium" },
    category: {
      type: String,
      enum: ["garbage", "street_light", "water_leakage", "sewage", "road_damage", "pothole", "electricity", "public_safety"]
    },
    aiCategory: String,
    aiDepartment: String,
    aiSeverity: String,
    status: { type: String, enum: ["submitted", "assigned", "in_progress", "resolved"], default: "submitted" },

    // ── NEW FIELDS ──────────────────────────────────────
    assignedTo:    { type: String, default: "" },
    contactNumber: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Complaint", complaintSchema);import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    ticketId: { type: String, unique: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fullName: String,
    mobile: String,
    email: String,
    address: String,
    city: String,
    description: String,
    photoUrl: String,
    mediaType: String,
    priority: { type: String, enum: ["low", "medium", "high", "critical"], default: "medium" },
    category: {
      type: String,
      enum: ["garbage", "street_light", "water_leakage", "sewage", "road_damage", "pothole", "electricity", "public_safety"]
    },
    aiCategory: String,
    aiDepartment: String,
    aiSeverity: String,
    status: { type: String, enum: ["submitted", "assigned", "in_progress", "resolved"], default: "submitted" },

    // ── NEW FIELDS ──────────────────────────────────────
    assignedTo:    { type: String, default: "" },
    contactNumber: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Complaint", complaintSchema);import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    ticketId: { type: String, unique: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fullName: String,
    mobile: String,
    email: String,
    address: String,
    city: String,
    description: String,
    photoUrl: String,
    mediaType: String,
    priority: { type: String, enum: ["low", "medium", "high", "critical"], default: "medium" },
    category: {
      type: String,
      enum: ["garbage", "street_light", "water_leakage", "sewage", "road_damage", "pothole", "electricity", "public_safety"]
    },
    aiCategory: String,
    aiDepartment: String,
    aiSeverity: String,
    status: { type: String, enum: ["submitted", "assigned", "in_progress", "resolved"], default: "submitted" },

    // ── NEW FIELDS ──────────────────────────────────────
    assignedTo:    { type: String, default: "" },
    contactNumber: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Complaint", complaintSchema);