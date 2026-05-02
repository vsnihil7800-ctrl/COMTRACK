import Complaint from "../models/Complaint.js";
import Notification from "../models/Notification.js";
import { classifyComplaint, detectPriority, mapDepartment } from "../utils/ai.js";
import { uploadToCloudinary, virusScanHook } from "../config/upload.js";

function ticket() {
  return `CMP${Math.floor(10000 + Math.random() * 90000)}`;
}

export async function createComplaint(req, res) {
  const aiCategory = classifyComplaint(req.body.description || "");
  const category = req.body.category || aiCategory;
  const priority = req.body.priority || detectPriority(req.body.description || "");
  const aiDepartment = mapDepartment(category);

  const complaint = await Complaint.create({
    ...req.body,
    user: req.user._id,
    ticketId: ticket(),
    category,
    aiCategory,
    aiDepartment,
    aiSeverity: priority,
    priority,
    photoUrl: req.body.photoUrl,
    mediaType: req.body.mediaType
  });

  await Notification.create({
    user: req.user._id,
    title: "Complaint submitted",
    message: `Ticket ${complaint.ticketId} is ${complaint.status}`,
    type: "complaint"
  });

  req.io.to(String(req.user._id)).emit("notification", {
    title: "Complaint update",
    message: `${complaint.ticketId} routed to ${aiDepartment}`
  });
  req.io.to("role:admin").emit("complaint:new", complaint);

  res.status(201).json(complaint);
}

export async function uploadComplaintMedia(req, res) {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  const safe = await virusScanHook(req.file.path);
  if (!safe) return res.status(400).json({ message: "File blocked by security scan" });
  const cloudUrl = await uploadToCloudinary(req.file.path, "image");
  const localPath = `/${req.file.path.replace(/\\/g, "/")}`;
  return res.status(201).json({ url: cloudUrl || localPath, mediaType: req.file.mimetype });
}

export async function myComplaints(req, res) {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Complaint.find({ user: req.user._id }).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Complaint.countDocuments({ user: req.user._id })
  ]);
  res.json({ items, total, page, pages: Math.ceil(total / limit) });
}

export async function complaintStatus(req, res) {
  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) return res.status(404).json({ message: "Complaint not found" });
  res.json(complaint);
}
