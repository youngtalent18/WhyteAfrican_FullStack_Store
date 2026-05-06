import express from "express";
import { adminRoute, protectRoute } from "../middleware/protectRoute.js";
import { getAdminStats } from "../controllers/analyticsController.js";

const router = express.Router();

router.get("/stats", protectRoute, adminRoute, getAdminStats);

export default router;