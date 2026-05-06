import { Router } from "express";
import { nearbyAmbulance, bookAmbulance, trackBooking, nearbyServices } from "../controllers/ambulanceController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

// ── Original routes
router.get("/nearby", protect, nearbyAmbulance);
router.post("/book", protect, bookAmbulance);
router.get("/track/:id", protect, trackBooking);
router.get("/services", nearbyServices);

// ── New simulated request route (no auth needed for demo)
const ambulances = [
  { id: "AMB101", distance: 2, location: "Koramangala" },
  { id: "AMB102", distance: 5, location: "Whitefield" },
  { id: "AMB103", distance: 3, location: "Indiranagar" },
  { id: "AMB104", distance: 1, location: "BTM Layout" },
  { id: "AMB105", distance: 4, location: "Jayanagar" },
];

router.post("/request", async (req, res) => {
  try {
    const nearest = ambulances.reduce((prev, curr) =>
      curr.distance < prev.distance ? curr : prev
    );
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