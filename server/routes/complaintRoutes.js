import { Router } from "express";
import { complaintStatus, createComplaint, myComplaints, uploadComplaintMedia } from "../controllers/complaintController.js";
import { complaintUpload } from "../config/upload.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.post("/create", protect, createComplaint);
router.post("/upload", protect, complaintUpload.single("file"), uploadComplaintMedia);
router.get("/my", protect, myComplaints);
router.get("/status/:id", protect, complaintStatus);

export default router;
