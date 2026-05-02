import { Router } from "express";
import { markRead, myNotifications } from "../controllers/notificationController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.get("/", protect, myNotifications);
router.patch("/:id/read", protect, markRead);

export default router;
