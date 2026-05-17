import express from 'express';
import { getCoupon, validateCoupon, createCoupon,getAllCoupons, toggleCoupon, deleteCoupon, redeemLoyaltyCoupon } from '../controllers/couponController.js';
import { adminRoute, protectRoute } from '../middleware/protectRoute.js';

const router = express.Router();

router.get('/',protectRoute, getCoupon);
router.post('/validate',protectRoute, validateCoupon);
router.post('/loyalty/redeem', protectRoute, redeemLoyaltyCoupon);

router.post("/admin/create", protectRoute, adminRoute, createCoupon);
router.get("/admin", protectRoute, adminRoute, getAllCoupons);
router.patch("/admin/toggle/:id", protectRoute, adminRoute, toggleCoupon);
router.delete("/admin/:id", protectRoute, adminRoute, deleteCoupon);


export default router;
