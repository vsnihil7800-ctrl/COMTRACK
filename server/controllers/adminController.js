import User from "../models/User.js";
import Complaint from "../models/Complaint.js";
import Booking from "../models/Booking.js";
import SOSAlert from "../models/SOSAlert.js";

function buildDateMatch(startDate, endDate) {
  const match = {};
  if (startDate || endDate) {
    match.createdAt = {};
    if (startDate) match.createdAt.$gte = new Date(startDate);
    if (endDate) match.createdAt.$lte = new Date(endDate);
  }
  return match;
}

export async function adminUsers(req, res) {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.json(users);
}

export async function adminComplaints(req, res) {
  const complaints = await Complaint.find().populate("user", "name email").sort({ createdAt: -1 });
  res.json(complaints);
}

export async function updateComplaint(req, res) {
  const complaint = await Complaint.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status, aiDepartment: req.body.department },
    { new: true }
  );
  if (!complaint) return res.status(404).json({ message: "Complaint not found" });
  res.json(complaint);
}

export async function adminReports(req, res) {
  const { startDate, endDate } = req.query;
  const match = buildDateMatch(startDate, endDate);
  const [users, complaints, bookings, sos] = await Promise.all([
    User.countDocuments(match),
    Complaint.countDocuments(match),
    Booking.countDocuments(match),
    SOSAlert.countDocuments(match)
  ]);
  const byCategory = await Complaint.aggregate([{ $match: match }, { $group: { _id: "$category", count: { $sum: 1 } } }]);
  const byStatus = await Complaint.aggregate([{ $match: match }, { $group: { _id: "$status", count: { $sum: 1 } } }]);
  const bookingsDaily = await Booking.aggregate([
    { $match: match },
    { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ]);
  const sosByLocation = await SOSAlert.aggregate([
    { $match: match },
    { $group: { _id: "$locationName", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 8 }
  ]);
  const avgResponse = await Booking.aggregate([{ $match: match }, { $group: { _id: null, avg: { $avg: "$responseTimeMinutes" } } }]);
  const userGrowth = await User.aggregate([
    { $match: match },
    { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ]);
  res.json({
    totals: { users, complaints, bookings, sos },
    complaintsByCategory: byCategory,
    complaintsByStatus: byStatus,
    dailyBookings: bookingsDaily,
    sosByLocation,
    avgResponseTime: avgResponse[0]?.avg || 0,
    userGrowth
  });
}
