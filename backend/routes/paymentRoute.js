import express from "express";
import { initializePayment,getUserOrders,paystackWebhook,verifyPayment } from "../controllers/paymentController.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/webhook",paystackWebhook);
router.post("/initialize", protectRoute, initializePayment);
router.get("/orders", protectRoute, getUserOrders);
router.post("/verify", verifyPayment);

export default router;