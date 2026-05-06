import express from "express";
import mongoose from "mongoose";

const router = express.Router();

const sosSchema = new mongoose.Schema({
  name:      { type: String, default: "Anonymous" },
  type:      { type: String, default: "medical" },
  location: {
    lat:     { type: Number, required: true },
    lng:     { type: Number, required: true },
  },
  status:    { type: String, default: "ACTIVE" },
  createdAt: { type: Date, default: Date.now },
});

const SOS = mongoose.models.SOS || mongoose.model("SOS", sosSchema);

router.post("/", async (req, res) => {
  try {
    const { name, emergencyType, latitude, longitude } = req.body;
    if (!latitude || !longitude) {
      return res.status(400).json({ message: "Location is required" });
    }
    const alert = await SOS.create({
      name:     name || "Anonymous",
      type:     emergencyType || "medical",
      location: { lat: latitude, lng: longitude },
      status:   "ACTIVE",
    });
    return res.status(201).json({
      message: "SOS triggered successfully",
      status:  "ACTIVE",
      alertId: alert._id,
    });
  } catch (err) {
    console.error("SOS error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const alerts = await SOS.find().sort({ createdAt: -1 }).limit(20);
    return res.json({ alerts });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;