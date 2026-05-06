import express from "express"
import { createProduct, 
         deleteProduct, 
         getAllProducts, 
         getCategoryProducts, 
         getFeaturedProducts, 
         getRecommendedProducts,
         getSingleProduct,
         toggleFeaturedProducts,searchProducts} from "../controllers/productController.js";
import {protectRoute, adminRoute} from "../middleware/protectRoute.js"

const router = express.Router()

router.get("/", getAllProducts); //test successful
router.delete("/:id",protectRoute, adminRoute, deleteProduct);//test successful
router.post("/create", protectRoute, adminRoute, createProduct);//test successful
router.get("/featured", getFeaturedProducts);//test successful
router.get("/category/:category", getCategoryProducts);//test sucessful
router.get("/recommendations", getRecommendedProducts);//test successful
router.patch("/:id/featured", protectRoute, adminRoute, toggleFeaturedProducts);//test successful
router.get("/search", searchProducts);
router.get("/:id", getSingleProduct);

export default router;