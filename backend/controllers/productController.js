import Product from "../model/productModel.js";
import cloudinary from "../lib/utils/cloudinary.js";
import { redis } from "../config/redis.js";

// ✅ GET ALL PRODUCTS
export const getAllProducts = async (_, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });

    if(!products || products.length === 0) {
      return res.status(404).json({success: false, message: "No products found" });
    }

    return res.status(200).json(products);
  } catch (error) {
    console.log("Error in getAllProducts controller", error);
    return res.status(500).json({ message: "Failed to fetch products" });
  }
};

// ✅ GET FEATURED PRODUCTS (WITH CACHE)
export const getFeaturedProducts = async (_, res) => {
  try {
    const cached = await redis.get("featured_products");

    if (cached) {
      // safety check
      if (typeof cached === "string") {
        return res.status(200).json(JSON.parse(cached));
      }

      return res.status(200).json(cached);
    }

    const featuredProducts = await Product.find({
      isFeatured: true,
    }).lean();

    if (!featuredProducts.length) {
      return res.status(404).json({
        message: "No featured products found",
      });
    }

    await redis.set(
      "featured_products",
      JSON.stringify(featuredProducts),
      "EX",
      3600
    );

    return res.status(200).json(featuredProducts);

  } catch (error) {
    console.log("Featured error:", error.message);
    return res.status(500).json({
      message: "Failed to fetch featured products",
    });
  }
};

// ✅ CREATE PRODUCT
export const createProduct = async (req, res) => {
  try {
    const { name, description, category, price, image, discountPercentage,
      sizes, } = req.body;

    let imageUrl = "";

    if (image) {
      // ✅ If it's a normal URL → use directly
      if (image.startsWith("http")) {
        imageUrl = image;
      } 
      // ✅ If it's base64 → upload to Cloudinary
      else {
        const cloudinaryResult = await cloudinary.uploader.upload(image, {
          folder: "products",
        });
        imageUrl = cloudinaryResult.secure_url;
      }
    }

    const newProduct = await Product.create({
      name,
      description,
      price,
      image: imageUrl,
      category,
      discountPercentage,
      sizes: Array.isArray(sizes) ? sizes : [],
    });

    return res.status(201).json(newProduct);

  } catch (error) {
    console.log("Error in createProduct controller", error);
    return res.status(500).json({ message: "Failed to create product" });
  }
};


// ✅ GET RECOMMENDED PRODUCTS
export const getRecommendedProducts = async (_, res) => {
  try {
    const recommendations = await Product.aggregate([
      { $sample: { size: 4 } },
      {
        $project: {
          name: 1,
          description: 1,
          price: 1,
          image: 1,
          category: 1,
        },
      },
    ]);

    if (!recommendations.length) {
      return res.status(404).json({
        message: "No recommendations found",
      });
    }

    res.status(200).json(
      recommendations, // 🔥 IMPORTANT
    );

  } catch (error) {
    console.log("Recommendation error:", error.message);
    res.status(500).json({
      message: "Failed to fetch recommendations",
    });
  }
};

// ✅ GET PRODUCTS BY CATEGORY
export const getCategoryProducts = async (req, res) => {
  try {
    const { category } = req.params;

    const categoryProducts = await Product.find({ category }).sort({
      createdAt: -1,
    });

    return res.status(200).json(categoryProducts);
  } catch (error) {
    console.log("Error in getCategoryProducts controller", error);
    return res.status(500).json({ error: "Failed to fetch category products" });
  }
};

// ✅ TOGGLE FEATURED PRODUCT
export const toggleFeaturedProducts = async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    product.isFeatured = !product.isFeatured;
    const updatedProduct = await product.save();

    await updateFeaturedProductCache();

    return res.status(200).json(updatedProduct);
  } catch (error) {
    console.log("Error in toggleFeaturedProducts controller", error);
    return res.status(500).json({ error: "Failed to update product" });
  }
};

// ✅ DELETE PRODUCT
export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await Product.findByIdAndDelete(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (product.image) {
      const publicId = product.image.split("/").pop().split(".")[0];

      try {
        await cloudinary.uploader.destroy(`products/${publicId}`);
      } catch (error) {
        console.log("Error deleting image from Cloudinary", error);
      }
    }

    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.log("Error in deleteProduct controller", error);
    return res.status(500).json({ error: "Failed to delete product" });
  }
};

//Detailed Product
export const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ UPDATE CACHE
async function updateFeaturedProductCache() {
  try {
    const featuredProducts = await Product.find({ isFeatured: true }).lean();

    await redis.set(
      "featured_products",
      JSON.stringify(featuredProducts),
      { EX: 60 * 60 }
    );
  } catch (error) {
    console.log("Error updating featured products cache", error);
  }
}

export const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ message: "Search query missing" });
    }

    const products = await Product.find({
      name: { $regex: q, $options: "i" }, // case-insensitive
    });

    res.json(products);

  } catch (error) {
    console.log("SEARCH ERROR:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};