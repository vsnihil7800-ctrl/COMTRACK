import { Router } from "express";
import { createSOS, sosHistory, uploadSOSEvidence } from "../controllers/sosController.js";
import { sosUpload } from "../config/upload.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.post("/create", protect, createSOS);
router.post("/upload", protect, sosUpload.single("file"), uploadSOSEvidence);
router.get("/history", protect, sosHistory);

export default router;
