import { Router } from "express";
import { adminComplaints, adminReports, adminUsers, updateComplaint } from "../controllers/adminController.js";
import { authorize, protect } from "../middleware/auth.js";

const router = Router();

router.use(protect, authorize("admin"));
router.get("/users", adminUsers);
router.get("/complaints", adminComplaints);
router.put("/complaints/:id", updateComplaint);
router.get("/reports", adminReports);

export default router;
