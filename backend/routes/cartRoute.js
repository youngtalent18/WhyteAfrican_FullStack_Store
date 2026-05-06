import express from "express"
import { addToCart, getCartProducts, removefromCart, updateQuantity,clearCart } from "../controllers/cartController.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/", protectRoute, getCartProducts);
router.post("/add", protectRoute, addToCart);
router.delete("/remove/:id", protectRoute, removefromCart);
router.put("/:id", protectRoute, updateQuantity);
router.delete("/clear", protectRoute, clearCart);

export default router;