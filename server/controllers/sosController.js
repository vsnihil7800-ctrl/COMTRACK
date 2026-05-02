import SOSAlert from "../models/SOSAlert.js";
import Notification from "../models/Notification.js";
import { uploadToCloudinary, virusScanHook } from "../config/upload.js";

export async function createSOS(req, res) {
  const alert = await SOSAlert.create({
    user: req.user._id,
    emergencyType: req.body.emergencyType,
    location: req.body.location,
    locationName: req.body.locationName,
    silentMode: !!req.body.silentMode,
    evidenceUrl: req.body.evidenceUrl
  });
  await Notification.create({
    user: req.user._id,
    title: "SOS alert sent",
    message: "Emergency responders have been notified.",
    type: "sos"
  });
  req.io.emit("sos:new", alert);
  req.io.to("role:admin").emit("sos:new", alert);
  req.io.to(String(req.user._id)).emit("notification", {
    title: "SOS Dispatched",
    message: "Responder will be assigned shortly."
  });
  res.status(201).json(alert);
}

export async function uploadSOSEvidence(req, res) {
  if (!req.file) return res.status(400).json({ message: "No evidence uploaded" });
  const safe = await virusScanHook(req.file.path);
  if (!safe) return res.status(400).json({ message: "Evidence blocked by security scan" });
  const cloudUrl = await uploadToCloudinary(req.file.path, "auto");
  const localPath = `/${req.file.path.replace(/\\/g, "/")}`;
  return res.status(201).json({ url: cloudUrl || localPath, mediaType: req.file.mimetype });
}

export async function sosHistory(req, res) {
  const alerts = await SOSAlert.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(alerts);
}
