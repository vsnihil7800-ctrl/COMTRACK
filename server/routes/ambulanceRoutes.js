// server/routes/ambulanceRoutes.js
// ADD this new route handler at the top of your existing ambulanceRoutes.js

import express from "express";
const router = express.Router();

// Simulated ambulance fleet
const ambulances = [
  { id: "AMB101", distance: 2, location: "Koramangala" },
  { id: "AMB102", distance: 5, location: "Whitefield" },
  { id: "AMB103", distance: 3, location: "Indiranagar" },
  { id: "AMB104", distance: 1, location: "BTM Layout" },
  { id: "AMB105", distance: 4, location: "Jayanagar" },
];

// POST /api/ambulance/request
router.post("/request", async (req, res) => {
  try {
    // Find nearest ambulance (minimum distance)
    const nearest = ambulances.reduce((prev, curr) =>
      curr.distance < prev.distance ? curr : prev
    );

    // ETA = distance × 2.5 minutes
    const eta = Math.round(nearest.distance * 2.5);

    return res.status(200).json({
      ambulanceId: nearest.id,
      distance: nearest.distance,
      eta,
      location: nearest.location,
      status: "ASSIGNED",
      message: `Ambulance ${nearest.id} assigned successfully`,
    });
  } catch (err) {
    console.error("Ambulance request error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;