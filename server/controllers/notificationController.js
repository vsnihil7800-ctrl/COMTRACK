import Notification from "../models/Notification.js";

export async function myNotifications(req, res) {
  const items = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(items);
}

export async function markRead(req, res) {
  const item = await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
  if (!item) return res.status(404).json({ message: "Notification not found" });
  res.json(item);
}
