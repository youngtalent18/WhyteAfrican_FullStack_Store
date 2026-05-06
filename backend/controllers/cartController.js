import Product from "../model/productModel.js";

/**
 * 🔥 ADD TO CART (FIXED)
 */
export const addToCart = async (req, res) => {
  try {
    const { productId, selectedSize } = req.body;
    const user = req.user;

    const item = user.cart.find(
      (i) =>
        i.productId.toString() === productId &&
        (i.selectedSize || null) === (selectedSize || null)
    );

    if (item) {
      item.quantity += 1;
    } else {
      user.cart.push({
        productId,
        selectedSize: selectedSize || null,
        quantity: 1,
      });
    }

    await user.save();

    res.json({ message: "ok" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * 🔥 REMOVE FROM CART (FIXED SIZE SUPPORT)
 */
export const removefromCart = async (req, res) => {
  try {
    const productId = req.params.id;
    const { selectedSize } = req.body;
    const user = req.user;

    if (!productId) {
      user.cart = [];
    } else {
      user.cart = user.cart.filter(
        (item) =>
          !(
            item.productId.toString() === productId &&
            (item.selectedSize || null) === (selectedSize || null)
          )
      );
    }

    await user.save();

    return res.json({
      message: "Removed from cart",
      cart: user.cart,
    });
  } catch (error) {
    console.log("removefromCart error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * 🔥 UPDATE QUANTITY (FIXED SIZE + SAFETY)
 */
export const updateQuantity = async (req, res) => {
  try {
    const productId = req.params.id;
    const { quantity, selectedSize } = req.body;
    const user = req.user;

    const item = user.cart.find(
      (i) =>
        i.productId.toString() === productId &&
        (i.selectedSize || null) === (selectedSize || null)
    );

    if (!item) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    if (quantity <= 0) {
      user.cart = user.cart.filter(
        (i) =>
          !(
            i.productId.toString() === productId &&
            (i.selectedSize || null) === (selectedSize || null)
          )
      );
    } else {
      item.quantity = quantity;
    }

    await user.save();

    return res.json({
      message: "Cart updated",
      cart: user.cart,
    });
  } catch (error) {
    console.log("updateQuantity error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * 🔥 GET CART (FIXED + FRONTEND FRIENDLY)
 */
export const getCartProducts = async (req, res) => {
  try {
    const user = req.user;

    const cart = user.cart || [];

    const products = await Product.find({
      _id: { $in: cart.map(i => i.productId) }
    });

    const result = products.map(p => {
      const item = cart.find(
        c => c.productId.toString() === p._id.toString()
      );

      return {
        productId: p._id,
        name: p.name,
        price: p.price,
        image: p.image,
        category: p.category,
        selectedSize: item?.selectedSize,
        quantity: item?.quantity || 1,
      };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * 🔥 CLEAR CART
 */
export const clearCart = async (req, res) => {
  try {
    const user = req.user;

    user.cart = [];
    await user.save();

    return res.json({
      message: "Cart cleared",
      cart: [],
    });
  } catch (error) {
    console.log("clearCart error:", error);
    res.status(500).json({ message: "Failed to clear cart" });
  }
};

