import express from "express";
import { adminRoute, protectRoute } from "../middleware/protectRoute.js";
import { getAdminStats, getAllUsers } from "../controllers/analyticsController.js";

const router = express.Router();

router.get("/stats", protectRoute, adminRoute, getAdminStats);
router.get("/stats/users", protectRoute, adminRoute, getAllUsers);

export default router;