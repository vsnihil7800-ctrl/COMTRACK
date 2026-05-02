import { Router } from "express";
import { bookAmbulance, nearbyAmbulance, nearbyServices, trackBooking } from "../controllers/ambulanceController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.get("/nearby", protect, nearbyAmbulance);
router.get("/nearby-services", protect, nearbyServices);
router.post("/book", protect, bookAmbulance);
router.get("/track/:id", protect, trackBooking);

export default router;
