import Order from "../model/orderModel.js";
import User from "../model/userModel.js";
import Product from "../model/productModel.js";

export const getAdminStats = async (req, res) => {
  try {
    const [orders, users] = await Promise.all([
      Order.find().lean(),
      User.countDocuments(),
    ]);

    // REVENUE
    const totalRevenue = orders.reduce((sum, order) => {
      return sum + (order.total ?? 0);
    }, 0);

    // DISCOUNT
    const totalDiscount = orders.reduce((sum, order) => {
      return sum + (order.discount || 0);
    }, 0);

    const totalOrders = orders.length;

    // PRODUCT STATS
    const productStatsRaw = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          totalSold: { $sum: "$items.quantity" },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
    ]);

    const products = await Product.find({
      _id: { $in: productStatsRaw.map(p => p._id) }
    }).select("name").lean();

    const productMap = {};
    products.forEach(p => {
      productMap[p._id.toString()] = p.name;
    });

    const productStats = productStatsRaw.length
      ? productStatsRaw.map(item => ({
          name: productMap[item._id?.toString()] || "Unknown",
          value: item.totalSold,
        }))
      : [];

    // RECENT ORDERS
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("_id total")
      .lean();

    const formattedOrders = recentOrders.map(order => ({
      _id: order._id,
      totalAmount: order.total || 0,
    }));

    res.json({
      totalRevenue,
      totalOrders,
      totalUsers: users,
      totalDiscount,
      productStats,
      recentOrders: formattedOrders,
    });

  } catch (error) {
    console.log("Analytics error:", error);
    res.status(500).json({ message: "Analytics failed" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .select("_id name email role isVerified createdAt")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  }catch (error) {
    console.log(
      "Get all users error:",
      error
    );
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};